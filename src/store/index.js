import Vue from 'vue'
import Vuex from 'vuex'
import {Notification} from "element-ui"
import {SessionStorage} from "../utils/sessionStorage"
import api from "../api/index"
import Stomp from '../utils/stomp'
import SockJS from '../utils/sockjs'

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
    // 存放变量
    myRoutes: [],
    sessions: {}, // 存放消息，格式为 {'A#B': [{聊天内容}]}
    hrs: [],
    currentSession: null, // 存放选中的用户
    currentHr: SessionStorage.get("USER"),
    filterKey: '',
    stomp: null,
    isDot: {}
  },
  mutations: {
    // 对变量的操作（同步）

    /**
     * 存入从后端得到的菜单
     */
    saveRoutes(state, data) {
      state.myRoutes = data
    },

    // ----- 聊天相关 -----
    INIT_CURRENT_HR(state, hr) {
      state.currentHr = hr
    },

    /**
     * 恢复对应用户的本地聊天记录
     * @param state
     * @constructor
     */
    INIT_DATA(state) {
      //浏览器本地的历史聊天记录可以在这里完成
      let data = localStorage.getItem('vue-chat-session')
      if (data) {
        state.sessions = JSON.parse(data)
      }
    },
    INIT_HR(state, data) {
      state.hrs = data;
    },
    changeCurrentSession(state, currentSession) {
      Vue.set(state.isDot, state.currentHr.username + '#' + currentSession.username, false)
      state.currentSession = currentSession
    },

    /**
     * 封装添加消息
     * @param state
     * @param msg
     */
    addMessage(state, msg) {
      let message = state.sessions[state.currentHr.username + '#' + msg.to]
      if (!message) {
        // state.sessions[state.currentHr.username+'#'+msg.to] = []
        Vue.set(state.sessions, state.currentHr.username + '#' + msg.to, [])
      }
      state.sessions[state.currentHr.username + '#' + msg.to].push({
        content: msg.content,
        date: new Date(),
        self: !msg.notSelf
      })
    }
  },
  actions: {
    // 对变量的操作（异步）

    // ----- 聊天相关 -----
    /**
     * 连接 webSocket，接受消息
     * @param context
     */
    connect(context) {
      context.state.stomp = Stomp.Stomp.over(new SockJS('/ws/ep'))
      context.state.stomp.connect({}, () => {
        context.state.stomp.subscribe('/user/queue/chat', message => {
          let receiveMsg = JSON.parse(message.body)
          if (!context.state.currentSession || receiveMsg.from !== context.state.currentSession.username) {
            Notification.info({
              title: '【' + receiveMsg.fromNickName + '】发来一条消息',
              message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
              position: 'top-right'
            })
            Vue.set(context.state.isDot, context.state.currentHr.username + '#' + receiveMsg.from, true)
          }
          receiveMsg.notSelf = true
          receiveMsg.to = receiveMsg.from
          context.commit('addMessage', receiveMsg)
        })
      }, error => {
        console.log(error)
      })
    },

    initData(context) {
      context.commit('INIT_DATA')
      api.getChatUser().then(res => {
        context.commit('INIT_HR', res.data.list)
      })
    }
  },
  modules: {
  }
})

store.watch(function (state) {
  return state.sessions
}, function (val) {
  localStorage.setItem('vue-chat-session', JSON.stringify(val))
}, {
  deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store;
