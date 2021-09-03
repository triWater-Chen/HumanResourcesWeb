<template>
  <div id="userText">
    <textarea placeholder="按 Ctrl + Enter 换行"
              v-model="content"
              @keydown="addMessage"
              v-if="currentSession"
    />
  </div>
</template>

<script>

import {mapState} from "vuex";

export default {
  name: 'UserText',
  data () {
    return {
      content:''
    }
  },

  computed: mapState([
    'currentSession'
  ]),

  methods: {
    addMessage (e) {
      if ((e.keyCode === 13 && e.ctrlKey) || (e.keyCode === 10 && e.ctrlKey)) {
        this.content += "\n"
      } else if (e.keyCode === 13 && this.content.length && !e.ctrlKey) {
        //禁止回车的默认换行
        e.preventDefault()
        let msgObj = {}
        msgObj.to = this.currentSession.username
        msgObj.content = this.content
        this.$store.state.stomp.send('/ws/chat', {}, JSON.stringify(msgObj))
        this.$store.commit('addMessage', msgObj)
        this.content = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#userText {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;
  > textarea {
    padding: 10px;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
  }
}
</style>
