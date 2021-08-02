<template>
  <div>
    <div>
      <el-input
          size="small"
          class="addPositionButton"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          @keydown.enter.native="handleAdd"
          v-model="position.name"
      >
      </el-input>
      <el-button icon="el-icon-plus"
                 size="small"
                 type="primary"
                 @click="handleAdd"
      >
        添加
      </el-button>
    </div>
    <div class="positionTable">
      <el-table
          :data="positions"
          border
          size="small"
          stripe
          style="width: 100%; font-size: 14px"
          :header-cell-style="myTableStyle"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="createdate"
            width="250"
            label="创建时间">
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                @click="showEdit(scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "Position",
  data() {
    return {
      position: { name: ''},
      positions: []
    }
  },

  mounted() {
    this.initPosition()
  },

  methods: {

    // ----- 初始化数据 -----
    initPosition() {
      this.API.positionGet()
          .then(data => {
            if (data.success) {
              this.positions = data.data.list
            }
          })
    },

    // ----- 添加职位 -----
    handleAdd() {
      if (this.position.name) {
        this.API.positionAdd(this.position)
            .then(data => {
              if (data.success) {
                this.$message.success(data.message)
                this.initPosition()
                this.position.name = ''
              }
            })
      } else {
        this.$message.error("职位名称不可为空")
      }
    },

    // ----- 编辑职位 -----
    showEdit() {
    },

    // ----- 删除职位 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职位, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.API.positionRemove(data.id).then(data => {
              if (data.success) {
                this.$message.success(data.message)
                this.initPosition();
              }
            })
          })
    },

    // ----- 表头样式 -----
    myTableStyle() {
      return "background-color: #f8f8f9; color: #515a6e;"
    }
  }
}
</script>

<style scoped>
.addPositionButton {
  width: 200px;
  margin-right: 10px;
}
.positionTable {
  margin-top: 15px;
}
</style>