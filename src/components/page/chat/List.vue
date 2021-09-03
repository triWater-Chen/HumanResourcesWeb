<template>
  <div id="list">
    <ul style="padding-left: 0">
      <li v-for="item in hrs"
          :key="item.id"
          :class="{ active: currentSession ? item.username === currentSession.username : false}"
          @click="changeCurrentSession(item)"
      >
        <el-badge :is-dot="isDot[user.username+'#'+item.username]">
          <img class="avatar" :src="item.userFace" :alt="item.name">
        </el-badge>
        <p class="name">{{item.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'List',
  data () {
    return {
      user: this.SessionStorage.get("USER")
    }
  },

  computed: mapState([
  'hrs',
  'isDot',
  'currentSession'
	]),

  methods:{
    changeCurrentSession (currentSession) {
      this.$store.commit('changeCurrentSession', currentSession)
    }
  }
}
</script>

<style lang="scss" scoped>
#list {
  li {
    padding: 16px 15px;
    border-bottom: 1px solid #292C33;
    cursor: pointer;
    list-style: none;

    &:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }
  }

  li.active { /*注意这个是.不是冒号:*/
    background-color: rgba(255, 255, 255, 0.1);
  }

  .avatar {
    width: 35px;
    height: 35px;
    vertical-align: middle;
    border-radius: 24px;
  }

  .name {
    display: inline-block;
    margin-left: 15px;
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
