<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input size="small"
                  v-model="addLevel.name"
                  style="width: 200px;"
                  prefix-icon="el-icon-plus"
                  placeholder="添加职称..."
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="addLevel.titleLevel"
                   placeholder="职称等级"
                   clearable
                   size="small"
                   style="width: 150px;"
        >
          <el-option v-for="item in titleLevels"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus"
                   type="primary"
                   size="small"
                   @click="addJobLevel"
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
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button icon="el-icon-refresh"
                     circle
                     size="mini"
                     @click="refreshJobLevel"
          />
        </el-tooltip>
      </el-form-item>
    </el-form>

    <div>
      <el-table :data="levels"
                border
                stripe
                :header-cell-style="myTableStyle"
                @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"
                         width="55"
                         fixed="left"
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
                         label="职称名称"
                         min-width="200"
                         header-align="center"
                         align="center"
        />
        <el-table-column  prop="titleLevel"
                          label="职称级别"
                          width="150"
                          header-align="center"
                          align="center"
        >
          <template slot-scope="scope">
            <el-tag>{{scope.row.titleLevel}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  prop="createdate"
                          label="创建时间"
                          min-width="200"
                          header-align="center"
                          align="center"
        />
        <el-table-column label="是否启用"
                         header-align="center"
                         align="center"
        >
          <template slot-scope="scope">
<!--            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>-->
<!--            <el-tag type="danger" v-else>未启用</el-tag>-->
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

    <el-dialog title="修改职称"
               :visible.sync="dialogVisible"
               width="420px"
               style="text-align: center"
    >
      <el-form>
        <el-form-item>
          <el-tag>职位名称</el-tag>
          <el-input v-model="editPost.name"
                    size="medium"
                    style="width: 200px; margin-left: 10px;"
          />
        </el-form-item>
        <el-form-item>
          <el-tag>职称级别</el-tag>
          <el-select v-model="editPost.titleLevel"
                     size="medium"
                     style="width: 200px; margin-left: 10px;"
          >
            <el-option v-for="item in titleLevels"
                       :key="item"
                       :label="item"
                       :value="item"
            />
          </el-select>
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
        <el-button size="small" type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JobLevel",
  data() {
    return {
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级',
      ],

      multipleSelection: [],
      ids: [],

      // 用于添加职称
      addLevel: {
        name: '',
        titleLevel: '',
      },
      levels: [],

      dialogVisible: false,
      editPost : {
        name: '',
        titleLevel: '',
        enabled: '',
      },
    }
  },

  mounted() {
    this.initJobLevel()
  },

  methods: {

    // ----- 初始化数据 -----
    initJobLevel() {
      this.API.jobLevelGet().then(res => {
        if (res.success) {
          this.levels = res.data.list
        }
      })
    },

    // ----- 刷新数据 -----
    refreshJobLevel() {
      this.API.jobLevelGet().then(res => {
        if (res.success) {
          this.levels = res.data.list
          this.$message.success("刷新成功")
        }
      })
    },

    // ----- 添加职称 -----
    addJobLevel() {
      if (this.addLevel.name && this.addLevel.titleLevel) {
        this.API.jobLevelAdd(this.addLevel).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.initJobLevel()
          }
          // 将添加值清空
          this.addLevel = {
            name: '',
            titleLevel: '',
          }
        })
      } else {
        if (!this.addLevel.name) {
          this.$message.error("职位名称不可为空")
        } else {
          this.$message.error("职称等级不可为空")
        }
      }
    },

    // ----- 修改状态 -----
    handleStatus(data) {
      const text = data.enabled === true ? "启用" : "停用"
      this.$confirm('确定要"' + text + '"职称【' + data.name + '】吗?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            this.API.jobLevelUpdate(data).then(res => {
              if (res.success) {
                this.$message.success(text + "成功")
              }
            })
          }).catch(() => {
            data.enabled = data.enabled !== true
      })
    },

    // ----- 编辑职称 -----
    showEdit(data) {
      Object.assign(this.editPost, data)
      this.dialogVisible = true
    },
    handleEdit() {
      if (this.editPost.name) {
        this.API.jobLevelUpdate(this.editPost).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.initJobLevel()
            this.dialogVisible = false
          }
        })
      }
    },

    // ----- 删除职称 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除职称【' + data.name + '】, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            const deleteId = []
            deleteId.push(data.id)
            this.API.jobLevelRemoveBatch(deleteId).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.initJobLevel()
              }
            })
          }).catch(() => {})
    },
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
            this.API.jobLevelRemoveBatch(this.ids).then(data => {
              if (data.success) {
                this.$message.success(data.message)
                this.initJobLevel()
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

</style>