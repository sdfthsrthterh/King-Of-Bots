<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'"  />
    <MatchGround v-if="$store.state.pk.status === 'matching'" />
    <ResultBoard v-if="$store.state.pk.loser !== 'none'"/>
</template>

<script>
import PlayGround from "../../components/PlayGround.vue"
import MatchGround from '../../components/MatchGround.vue'
import ResultBoard from '../../components/ResultBoard.vue'
import { onMounted, onUnmounted } from "vue"
import { useStore } from 'vuex'


export default{
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();
        const socketUrl = `ws://127.0.0.1:3000/websocket/${store.state.user.token}/`;
        
        let socket = null;  //定义socket

        onMounted( () => {  //当该组件被挂载时执行
            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            })
            
            socket = new WebSocket(socketUrl); //调用前端的WebSocket通过给定的socketUrl去调用后端的函数，发送连接请求


            socket.onopen = () => {  //前端对应的也有onopen和onclose
                console.log("connected!");
                store.commit("updateSocket", socket);
            }

            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                console.log(data);
                if (data.event === "start-matching") {   //接收到后端的start-matching表示匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,   //将对手信息拆解出来
                    });
                    setTimeout(() => {
                        store.commit("updateStatus", "playing");
                    }, 2000);
                    store.commit("updateGame", data.game);
                } else if (data.event === "move") {
                    console.log(data);
                    const game = store.state.pk.gameObject;
                    const [snake0, snake1] = game.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                } else if (data.event === "result") {
                    const game = store.state.pk.gameObject;
                    const[snake0, snake1] = game.snakes;

                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    } 
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
                }
            }

            socket.onclose = () => {
                console.log("disconnected!");
            }
        }),

        onUnmounted( () => {
            socket.close();
            store.commit("updateStatus", "matching");
        })

    }
}
</script>

<style scoped>

</style>