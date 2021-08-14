<template>
  <el-drawer :visible.sync="drawer"
             direction="ltr"
             :with-header="false"
             size="500px"
             @close="drawerClose"
             @open="drawerOpen"
  >
    <div class="hr-drawer__content">
      <h3 style="color: royalblue; text-align: center">分配角色</h3>
      <el-divider />
      <el-form :inline="true">
        <el-form-item>
          <span slot="label" class="hrFormStyle">用户名</span>
          <el-input v-model="hrInfo.username"
                    style="width: 150px;"
                    disabled
          />
        </el-form-item>
        <el-form-item>
          <span slot="label" class="hrFormStyle">昵称</span>
          <el-input v-model="hrInfo.name"
                    style="width: 150px;"
                    disabled
          />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">拥有角色：</el-divider>
      <div class="hrTags">
        <el-tag v-for="tag in hrTagsWithRole"
                :key="tag.id"
                closable
                effect="dark"
                @close="tagClose(tag)"
                style="margin: 0 10px 10px 0"
        >
          {{tag.namezh}}
        </el-tag>
        <el-tag :disable-transitions="true" v-show="hrTagsWithRole.length === 0">
          该用户暂无角色
        </el-tag>
      </div>
      <el-divider content-position="right"><i class="el-icon-sunrise-1"></i></el-divider>

      <el-table :data="rolesTable"
                border
                stripe
                size="mini"
                style="font-size: 13px;"
                :header-cell-style="myTableStyle"
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"
                         fixed="left"
                         width="40"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="id"
                         label="编号"
                         width="80"
                         header-align="center"
                         align="center"
                         sortable
        />
        <el-table-column prop="name"
                         label="角色英文名"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="namezh"
                         label="角色中文名"
                         header-align="center"
                         align="center"
        />
      </el-table>

      <el-form>
        <el-form-item style="text-align: center; margin-top: 30px;">
          <el-button @click="drawerClose">返 回</el-button>
          <el-button type="primary">提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
export default {
  // 用于接受从父组件传来的值
  props: [
      "visible",
      "hrInfo",
      "hrTagsWithRole",
      "rolesTable",
  ],

  name: "AssignRoles",
  data() {
    return {
      drawer: this.visible,
    }
  },

  watch: {
    visible(val) {
      this.drawer = val
    }
  },

  methods: {
    // ----- 关闭 drawer -----
    drawerClose() {
      this.$emit("close")
    },
    drawerOpen() {
      //
    },

    // ----- 删除标签 -----
    tagClose(data) {
      this.hrTagsWithRole.splice(this.hrTagsWithRole.indexOf(data), 1)
    },

    handleSelectionChange() {},


    // ----- 表头样式 -----
    myTableStyle() {
      return "background-color: #f8f8f9; color: #515a6e;"
    }
  }
}
</script>

<style>
.hr-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 20px;
}
</style>