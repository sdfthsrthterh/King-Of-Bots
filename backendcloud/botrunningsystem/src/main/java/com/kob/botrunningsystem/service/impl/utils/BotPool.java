package com.kob.botrunningsystem.service.impl.utils;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class BotPool extends Thread {
    private final static ReentrantLock lock = new ReentrantLock();
    private final Condition condition = lock.newCondition();

    private final Queue<Bot> bots = new LinkedList<>();


    public void addBot(Integer userId, String botCode, String input) {
        lock.lock();
        try {
            bots.add(new Bot(userId, botCode, input));
            condition.signalAll(); //唤醒
        } finally {
            lock.unlock();
        }
    }
    private void consume(Bot bot) {
        Consumer consumer = new Consumer();
        consumer.startTimeout(2000, bot);
    }
    @Override
    public void run() {
        while (true) {
            lock.lock();
            if (bots.isEmpty()) {   //如果bots队列没有操作，则将该线程设为等待
                try {
                    condition.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    lock.unlock();
                    break;
                }
            } else {
                Bot bot = bots.remove();
                lock.unlock();
                consume(bot); //比较耗时，可能会执行两秒中
            }
        }
    }
}
