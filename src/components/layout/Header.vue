<template>
  <el-header class="homeHeader">
    <div class="title">人事管理</div>
    <div>
      <el-col :span="7">
        <el-button icon="el-icon-bell"
                   type="text"
                   @click="goChat"
                   style="margin-top: 3px; font-size: x-large"
        />
      </el-col>
      <el-col :span="7" style="margin-right: 15px">
        <el-dropdown class="userInfo" @command="commandHandler">
        <span class="el-dropdown-link">
          <i><img :src="user.userFace" alt=""></i>{{user.name}}
        </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout" divided>登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </div>
  </el-header>
</template>

<script>
import {Message} from "element-ui";

export default {
  name: "Header",
  data() {
    return {
      user: {
        userFace: this.SessionStorage.get("USER").userFace,
        name: this.SessionStorage.get("USER").username
      }
    }
  },
  methods: {

    goChat() {
    },

    commandHandler(param) {
      if (param === 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.API.logout()
              .then((res) => {
                this.SessionStorage.clearAll()
                this.$store.commit("saveRoutes", [])
                this.$router.replace("/login")
                if (res.success) {
                  Message.success("成功退出当前账号")
                }
              })
        })
      } else if (param === 'userinfo') {
        //
      }
    }
  }

}
</script>

<style scoped>

.homeHeader {
  background-color: #001529;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: #ffffff;
  margin-left: 20px;
}

.homeHeader .userInfo {
  cursor: pointer;
  margin-top: 4px;
}

.el-dropdown-link img {
  width: 45px;
  height: 45px;
  border-radius: 24px;
  margin-right: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
</style>