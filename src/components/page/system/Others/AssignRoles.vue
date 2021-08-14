<template>
  <el-drawer :visible.sync="drawer"
             direction="ltr"
             :with-header="false"
             size="500px"
             :before-close="beforeClose"
             @close="drawerClose"
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

      <div class="hrTags">
        <el-divider content-position="left">拥有角色：</el-divider>
        <div>
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
                  ref="assignTable"
                  border
                  stripe
                  size="mini"
                  style="font-size: 13px;"
                  class="hrTable"
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
                           width="75"
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column prop="name"
                           label="角色英文名"
                           show-overflow-tooltip
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column prop="namezh"
                           label="角色中文名"
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column label="状态"
                           header-align="center"
                           align="center"
                           width="60"
          >
            <template slot-scope="scope">
              <el-tag size="mini" type="success" v-if="scope.row.enabled">启用</el-tag>
              <el-tag size="mini" type="info" v-else>禁用</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <el-form>
          <el-form-item style="text-align: center; margin-top: 30px;">
            <el-button @click="drawerClose">返 回</el-button>
            <el-button :loading="loading" type="primary" @click="handleSubmit">{{ loading ? '提交中...' : '提 交' }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  // 用于接受从父组件传来的值
  props: [
      "visible",
      "hrInfo",
      "defaultId",
      "rolesTable",
  ],

  name: "AssignRoles",
  data() {
    return {
      loading: false,
      drawer: this.visible,

      hrTagsWithRole: [],
      multipleSelection: [],
      ids: [],

      updateData: {}
    }
  },

  watch: {
    visible(val) {
      this.drawer = val
    },
    rolesTable() {
      this.$nextTick(()=>{
        // 自动勾选已有角色

        const tableLoading = this.$loading({
          fullscreen: false,
          text: '更新数据...',
          background: 'rgba(0, 0, 0, 0.4)',
          target: document.querySelector(".hrTable")
        })
        this.rolesTable.forEach(row => {
          // indexOf 输出查找到的位置，>= 0 即代表在 defaultId 中查到对应 id
          if (this.defaultId.indexOf(row.id) >= 0){
            this.$refs.assignTable.toggleRowSelection(row,true)
          }
        })
        tableLoading.close()
      })
    },
    multipleSelection(val) {
      this.multipleSelection = val
    }
  },

  methods: {

    // ----- 删除标签 -----
    tagClose(data) {
      this.hrTagsWithRole.splice(this.hrTagsWithRole.indexOf(data), 1)

      // 同时将表格中数据也进行删除
      this.$nextTick(() => {
        this.rolesTable.forEach(row => {
          if (data.id === row.id){
            this.$refs.assignTable.toggleRowSelection(row,false)
          }
        })
      })
    },

    // ----- 处理勾选角色 -----
    handleSelectionChange(val) {
      // 传入选中的值
      this.multipleSelection = val
      // 遍历选中的值，将 id 存入一个集合中
      this.ids = val.map(item => item.id)

      // 同时改变 tag 中的数据
      this.hrTagsWithRole = this.multipleSelection
    },

    // ----- 进行修改 -----
    handleSubmit() {
      this.loading = true
      this.updateData = {
        id: this.hrInfo.id,
        roleIds: this.ids
      }
      this.API.hrUpdateByRole(this.updateData).then(res => {
        this.loading = false
        if (res.success) {
          this.$message.success(res.message)
          this.$emit("close")
        }
      }).catch(() => {
        this.loading = false
      })
      this.updateData = {}
    },

    // ----- 关闭 drawer 之前进行提示 -----
    beforeClose(done) {
      this.$confirm('还有未保存的工作哦，确定关闭吗',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            done()
      }).catch(() => {})
    },

    // ----- 关闭 drawer -----
    drawerClose() {
      this.hrTagsWithRole = []
      this.$refs.assignTable.clearSelection()
      this.$emit("close")
      // $emit 会自动触发 2 次
    },

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
  padding: 20px 20px;
  overflow-y: auto;
}
</style>