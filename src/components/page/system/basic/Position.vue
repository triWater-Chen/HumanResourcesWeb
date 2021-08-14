<template>
  <div>
    <el-form :inline="true" @submit.native.prevent>
      <!-- 当 form 内只有一个输入框时,按回车会自动提交，使用 @submit 来阻止页面刷新-->
      <el-form-item>
        <el-input size="small"
                  style="width: 200px;"
                  placeholder="添加职位..."
                  prefix-icon="el-icon-plus"
                  v-model="addPosition.name"
                  @keydown.enter.native="handleAdd"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus"
                   size="small"
                   type="primary"
                   :loading="addLoading"
                   style="margin-top: 5px"
                   @click="handleAdd"
        >
          {{ addLoading ? '添加中...' : '添 加' }}
        </el-button>
        <el-button type="danger"
                   size="small"
                   :disabled="multipleSelection.length === 0"
                   @click="deleteBatch"
        >
          批量删除
        </el-button>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button icon="el-icon-refresh"
                     circle
                     size="mini"
                     @click="refreshPosition"
          />
        </el-tooltip>
      </el-form-item>
    </el-form>

    <div>
      <el-table :data="positions"
                v-loading="loading"
                border
                stripe
                size="small"
                style="font-size: 13px;"
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
                         sortable
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
        <el-table-column label="是否启用"
                         header-align="center"
                         align="center"
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled"
                       @change="handleStatus(scope.row)"
            />
          </template>
        </el-table-column>
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
      <el-form @submit.native.prevent>
        <el-form-item>
          <el-tag>职位名称</el-tag>
          <el-input v-model="editPost.name"
                    size="medium"
                    class="editDialogInput"
          />
        </el-form-item>
        <el-form-item>
          <el-switch v-model="editPost.enabled"
                     active-text="启用"
                     inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" size="small" type="primary" @click="handleEdit">{{ buttonLoading ? '提交中...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Position",
  data() {
    return {
      loading: true,
      buttonLoading: false,
      addLoading: false,

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
      this.loading = true
      this.API.positionGet()
          .then(data => {
            if (data.success) {
              this.positions = data.data.list
            }
            this.loading = false
          })
    },

    // ----- 刷新数据 -----
    refreshPosition() {
      this.loading = true
      this.API.positionGet().then(res => {
        if (res.success) {
          this.positions = res.data.list
          this.$message.success("刷新成功")
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // ----- 添加职位 -----
    handleAdd() {
      if (this.addPosition.name) {
        this.addLoading = true
        this.API.positionAdd(this.addPosition)
            .then(data => {
              this.addLoading = false
              if (data.success) {
                this.$message.success(data.message)
                this.initPosition()
                this.addPosition.name = ''
              }
            })
            .catch(() => {
              this.addLoading = false
            })
      } else {
        this.$message.error("职位名称不可为空")
      }
    },

    // ----- 修改状态 -----
    handleStatus(data) {
      const text = data.enabled === true ? "启用" : "停用"
      this.$confirm('确定要"' + text + '"职位【' + data.name + '】吗?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = text + '中...'

                this.API.positionUpdate(data).then(res => {
                  instance.confirmButtonLoading = false
                  if (res.success) {
                    this.$message.success(text + "成功")
                    done()
                  }
                }).catch(() => {
                  data.enabled = data.enabled !== true
                  instance.confirmButtonLoading = false
                  instance.confirmButtonText = '确 定'
                  done()
                })
              } else {
                done()
              }
            })
          }).catch(() => {
            data.enabled = data.enabled !== true
          })
    },

    // ----- 编辑职位 -----
    showEdit(data) {
      // 将值进行复制（使打开对话框后，改变对话框中值，未提交时表格内数据不变）
      Object.assign(this.editPost, data)
      this.dialogVisible = true
    },
    handleEdit() {
      if (this.editPost.name) {
        this.buttonLoading = true
        this.API.positionUpdate(this.editPost).then(data => {
          this.buttonLoading = false
          if (data.success) {
            this.$message.success(data.message)
            this.initPosition()
            this.editPost.name = ''
            this.dialogVisible = false
          }
        }).catch(() => {
          this.buttonLoading = false
        })
      } else {
        this.$message.error("职位名称不可为空")
      }
    },

    // ----- 删除职位 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除职位【' + data.name + '】, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '删除中...'

                const deleteId = []
                deleteId.push(data.id)
                this.API.positionRemoveBatch(deleteId).then(res => {
                  instance.confirmButtonLoading = false
                  if (res.success) {
                    this.initPosition()
                    this.$message.success(res.message)
                    done()
                  }
                }).catch(() => {
                  instance.confirmButtonLoading = false
                  instance.confirmButtonText = '确 定'
                })
              } else {
                done()
              }
            })
          }).catch(() => {})
    },
    // ----- 使用单个删除的方法 -----
    // this.API.positionRemove(data.id).then(data => {
    //   if (data.success) {
    //     this.$message.success(data.message)
    //     this.initPosition();
    //   }
    // })

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
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '删除中...'

                this.API.positionRemoveBatch(this.ids).then(res => {
                  instance.confirmButtonLoading = false
                  if (res.success) {
                    this.initPosition()
                    this.$message.success(res.message)
                    done()
                  }
                }).catch(() => {
                  instance.confirmButtonLoading = false
                  instance.confirmButtonText = '确 定'
                })
              } else {
                done()
              }
            })
          }).catch(() => {})
    },

    // ----- 表头样式 -----
    myTableStyle() {
      return "background-color: #f8f8f9; color: #515a6e;"
    }
  }
}
</script>

<style scoped>
.editDialogInput {
  margin-left: 10px;
  width: 200px;
}
</style>