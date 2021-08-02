<template>
  <el-container direction="vertical">
    <Header></Header>
    <el-container>
      <el-aside style="background-color: #001529; width: auto" >
        <el-menu router
                 background-color="#001529"
                 text-color="#fff"
                 active-text-color="#1890ff"
                 unique-opened
                 class="collapseStyle"
                 :collapse="isCollapse"
        >
          <el-submenu :index="index + ''"
                      v-for="(item, index) in routes"
                      :key="index"
                      >
            <template slot="title">
              <i style="color: deepskyblue" :class="item.iconCls" />
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="child.path"
                          v-for="(child, indexSec) in item.children"
                          :key="indexSec"
                          >
              {{child.name}}
            </el-menu-item>
          </el-submenu>
          <div class="collapseMenu"
               @click="isCollapse = false"
               v-show="isCollapse"
          >
            <i class="el-icon-d-arrow-right" />
          </div>
          <div class="collapseMenu"
               @click="isCollapse = true"
               v-show="!isCollapse"
          >
            <i class="el-icon-d-arrow-left" />
          </div>
        </el-menu>
      </el-aside>
      <el-container direction="vertical">
        <el-main>
          <el-breadcrumb
              style="margin-left: 10px; margin-top: 10px;"
              separator-class="el-icon-arrow-right"
              v-show="this.$router.currentRoute.path !== '/'"
          >
            <el-breadcrumb-item :to="{ path: '/' }">
              首页
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              {{this.$router.currentRoute.name}}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <router-view class="homeRouterView" />
        </el-main>
        <Footer />
      </el-container>
    </el-container>
  </el-container>
</template>

<script>

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
export default {
  name: 'Home',
  components: {
    Footer,
    Header
  },

  computed: {
    routes() {
      // 从 store 中获取菜单列表
      return this.$store.state.myRoutes
    }
  },
  data() {
    return {
      isCollapse: true
    }
  }
}
</script>

<style>
  .homeRouterView {
    margin-top: 20px;
    margin-left: 10px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside .el-menu {
    border-right: none;
  }
  .collapseStyle:not(.el-menu--collapse) {
    width: 200px;
  }
  .collapseMenu {
    width: 64px;
    height: 45px;
    position: fixed;
    bottom: 0;
    color: white;
    z-index: 1;
    text-align: center;
    cursor: pointer;
  }
</style>
