<template>
  <section>
    <Header></Header>
    <el-container>
      <el-aside width="200px">
        <el-menu router
                 background-color="#001529"
                 text-color="#fff"
                 active-text-color="#1890ff"
                 unique-opened
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
        </el-menu>
      </el-aside>
      <section>
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
          <router-view class="homeRouterView"/>
        </el-main>
        <Footer />
      </section>
    </el-container>
  </section>
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
      return this.$store.state.myRoutes
    }
  }
}
</script>

<style>
  .homeRouterView {
    margin-top: 20px;
    margin-left: 10px;
  }
</style>
