<template>
  <section>
    <Header></Header>
    <el-container>
      <el-aside width="200px">
        <el-menu router
                 background-color="#001529"
                 text-color="#fff"
                 active-text-color="#1890ff">
          <el-submenu :index="item.path"
                      v-for="(item, index) in this.$router.options.routes"
                      :key="index"
                      >
            <template slot="title">
              <i class="el-icon-location" />
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
}
</script>
