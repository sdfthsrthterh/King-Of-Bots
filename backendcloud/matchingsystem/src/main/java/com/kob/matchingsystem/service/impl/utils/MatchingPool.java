package com.kob.matchingsystem.service.impl.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

@Component
public class MatchingPool extends Thread{

    private static List<Player> players = new ArrayList<>(); //将所有用户存下来
    private ReentrantLock lock = new ReentrantLock();  //定义锁

    private static RestTemplate restTemplate;
    private final static String startGameUrl = "http://127.0.0.1:3000/pk/start/game/";

    @Autowired
    public void setRestTemplate(RestTemplate restTemplate) {
        MatchingPool.restTemplate = restTemplate;
    }

    public void addPlayer(Integer userId, Integer rating, Integer botId) {
        lock.lock();
        try {
            players.add(new Player(userId, rating, botId,0));
        } finally {
            lock.unlock();
        }
    }

    public void removePlayer(Integer userId) {
        lock.lock();
        try {
            List<Player> newPlayers = new ArrayList<>();
            for (Player player : players) {
                if (!player.getUserId().equals(userId)) {
                    newPlayers.add(player);
                }
            }
            players = newPlayers;  //将除当前玩家外的其他玩家复制到新数组然后重新赋值给原先数组，完成删除玩家操作
        } finally {
            lock.unlock();
        }

    }

    private void  increaseWaitingTime() {   //将匹配池中所有存在的玩家的等待时间+ 1
        for (Player player : players) {
            player.setWaitingTime(player.getWaitingTime() + 1);
        }
    }

    private boolean checkMatched(Player a, Player b) { //判断两名玩家是否匹配
        int ratingDelta = Math.abs(a.getRating() - b.getRating());  //计算二者的分差
        int waitingTime = Math.min(a.getWaitingTime(), b.getWaitingTime());  //获取二者等待时间的最小值
        return ratingDelta <= waitingTime * 10;   //如果分差小于当前二者等待时间最小值*10，则说明二者可以匹配

    }

    private void sendResult(Player a, Player b) {  //返回a和b的匹配结果
        System.out.println("send result: " + a+ " " + b);
        MultiValueMap<String, String> data = new LinkedMultiValueMap<>();
        data.add("a_id", a.getUserId().toString());
        data.add("a_bot_id", a.getBotId().toString());
        data.add("b_id", b.getUserId().toString());
        data.add("b_bot_id", b.getBotId().toString());
        restTemplate.postForObject(startGameUrl, data, String.class);
    }

    private void matchPlayers() {   ///尝试匹配所有玩家
        System.out.println("match players: " + players.toString());
        boolean[] used = new boolean[players.size()];   //用于维护匹配池中哪些玩家已经匹配成功了
        for (int i = 0; i < players.size(); i++) {  //优先把排在前面（等待时间长）的玩家选择
            if (used[i]) continue;
            for (int j = i + 1; j < players.size(); j++) {
                if (used[j]) continue;  //选取两个没有匹配过的玩家
                Player a = players.get(i), b = players.get(j);
                if (checkMatched(a, b)) {   //将二者进行匹配，如果匹配成功则将二者的标记变成匹配过了
                    used[i] = used[j] = true;
                    sendResult(a, b);  //并发送匹配结果
                    break;
                }
            }
        }
        List<Player> newPlayers = new ArrayList<>();
        for (int i = 0; i < players.size(); i++) {
            if (!used[i]) {
                newPlayers.add(players.get(i));
            }
        }
        players = newPlayers;
    }
    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(1000);
                lock.lock();
                try {
                    increaseWaitingTime();
                    matchPlayers();
                } finally {
                    lock.unlock();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }

    }
}
