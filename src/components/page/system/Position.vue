<template>
  <div>
    <div>
      <el-input size="small"
                class="addPositionButton"
                placeholder="添加职位..."
                prefix-icon="el-icon-plus"
                @keydown.enter.native="handleAdd"
                v-model="addPosition.name"
      >
      </el-input>
      <el-button icon="el-icon-plus"
                 size="small"
                 type="primary"
                 style="margin-top: 5px"
                 @click="handleAdd"
      >
        添加
      </el-button>
      <el-button type="danger"
                 size="small"
                 :disabled="multipleSelection.length === 0"
                 @click="deleteBatch"
      >
        批量删除
      </el-button>
    </div>
    <div class="positionTable">
      <el-table :data="positions"
                border
                stripe
                :header-cell-style="myTableStyle"
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"
                         fixed="left"
                         width="55"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="id"
                         label="编号"
                         width="150"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="name"
                         label="职位名称"
                         min-width="200"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="createdate"
                         min-width="200"
                         label="创建时间"
                         header-align="center"
                         align="center"
        />
        <el-table-column label="操作"
                         header-align="center"
                         align="center"
                         min-width="200"
        >
          <template slot-scope="scope">
            <el-button size="small"
                       type="text"
                       icon="el-icon-edit"
                       @click="showEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button size="small"
                       type="text"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="修改职位"
               :visible.sync="dialogVisible"
               width="420px"
               style="text-align: center"
    >
      <div>
        <div>
          <el-tag>职位名称</el-tag>
          <el-input class="editDialogInput"
                    size="small"
                    v-model="editPost.name" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="handleEdit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Position",
  data() {
    return {
      // 用于添加职位
      addPosition: { name: ''},
      positions: [],

      dialogVisible: false,
      editPost: {
        id: '',
        name: '',
        enabled: false,
      },

      multipleSelection: [],
      ids: [],
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
      if (this.addPosition.name) {
        this.API.positionAdd(this.addPosition)
            .then(data => {
              if (data.success) {
                this.$message.success(data.message)
                this.initPosition()
                this.addPosition.name = ''
              }
            })
      } else {
        this.$message.error("职位名称不可为空")
      }
    },

    // ----- 编辑职位 -----
    showEdit(data) {
      // 将值进行复制（使打开对话框后，改变对话框中值，未提交时表格内数据不变）
      Object.assign(this.editPost, data)
      this.dialogVisible = true
    },
    handleEdit() {
      this.API.positionUpdate(this.editPost).then(data => {
        if (data.success) {
          this.$message.success(data.message)
          this.initPosition()
          this.editPost.name = ''
          this.dialogVisible = false
      }
      })
    },

    // ----- 删除职位 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除职位【' + data.name + '】, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            // ----- 统一使用批量删除的方法 -----
            const deleteId = []
            deleteId.push(data.id);
            this.API.positionRemoveBatch(deleteId).then(data => {
              if (data.success) {
                    this.$message.success(data.message)
                    this.initPosition();
                  }
            })

            // ----- 使用单个删除的方法 -----
            // this.API.positionRemove(data.id).then(data => {
            //   if (data.success) {
            //     this.$message.success(data.message)
            //     this.initPosition();
            //   }
            // })
          })
    },

    // ----- 进行批量删除 -----
    handleSelectionChange(val) {
      // 传入选中的值
      this.multipleSelection = val
      // 遍历选中的值，将 id 存入一个集合中
      this.ids = val.map(item => item.id)
    },
    deleteBatch() {
      this.$confirm('此操作将永久删除编号为【' + this.ids + '】的职位, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
        console.log(this.ids)
            this.API.positionRemoveBatch(this.ids).then(data => {
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
  margin-top: 20px;
}
.editDialogInput {
  margin-left: 10px;
  width: 200px;
}
</style>