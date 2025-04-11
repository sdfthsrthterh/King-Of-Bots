


export default {
  state: {
    status: "matching", //连接状态：matching表示匹配界面，playing表示对战中
    socket: null,  //建立的连接是什么
    opponent_username: "",  //跟谁建立的连接
    opponent_photo: "",  //对方的头像
    gamemap: null,
    
  },
  getters: {
  },
  mutations: {
        updateSocket(state, socket) {
            state.socket = socket;
        },
        updateOpponent(state, opponent) {
            state.opponent_username = opponent.username;
            state.opponent_photo = opponent.photo;
        },
        updateStatus(state, status) {
            state.status = status;
        },
        updateGamemap(state, gamemap) {
          state.gamemap = gamemap;
        }
  },
  actions: {
    
  },
  modules: {
  }
}
