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
          <router-view />
        </el-main>
        <Footer />
      </section>
    </el-container>
  </section>
</template>

<script>

import Header from "../components/Header";
import Footer from "../components/Footer";
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
