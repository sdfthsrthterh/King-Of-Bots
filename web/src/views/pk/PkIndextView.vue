<template>
    <PlayGround v-if="$store.state.pk.status === 'playing'"  />
    <MatchGround v-if="$store.state.pk.status === 'matching'" />
</template>

<script>
import PlayGround from "../../components/PlayGround.vue"
import MatchGround from '../../components/MatchGround.vue'
import { onMounted, onUnmounted } from "vue"
import { useStore } from 'vuex'


export default{
    components: {
        PlayGround,
        MatchGround,
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
                    store.commit("updateGamemap", data.gamemap);
                }
            }

            socket.onclose = () => {
                console.log("disconnected!");
                store.commit("updateStatus", "matching");
            }
        }),

        onUnmounted( () => {
            socket.close();
        })

    }
}
</script>

<style scoped>

</style>