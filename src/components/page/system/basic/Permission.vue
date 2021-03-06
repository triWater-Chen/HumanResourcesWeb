<template>
  <div class="permissionStyle">
    <el-form :inline="true" v-show="showQuery">
      <el-form-item>
        <el-input size="small"
                  clearable
                  v-model="queryRole.name"
                  style="width: 230px;"
                  placeholder="请输入角色英文名"
                  @keydown.enter.native="handleQuery"
        >
          <template slot="prepend">ROLE_</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input size="small"
                  clearable
                  v-model="queryRole.namezh"
                  style="width: 160px;"
                  placeholder="请输入角色中文名"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryRole.enabled"
                   placeholder="角色状态"
                   clearable
                   size="small"
                   style="width: 120px;"
        >
          <el-option label="可用" value="true"></el-option>
          <el-option label="禁用" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker  v-model="dateRange"
                         size="small"
                         style="width: 220px"
                         value-format="yyyy-MM-dd"
                         type="daterange"
                         range-separator="-"
                         start-placeholder="开始日期"
                         end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search"
                   type="primary"
                   size="small"
                   @click="handleQuery"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh"
                   size="small"
                   @click="refreshRole"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-row :gutter="10" style="margin-bottom: 10px;">
        <el-col :span="1.5">
            <el-button type="primary"
                       icon="el-icon-plus"
                       size="mini"
                       @click="handleAdd"
            >
              新增
            </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger"
                     size="mini"
                     :disabled="multipleSelection.length === 0"
                     @click="deleteBatch"
          >
            批量删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-tooltip effect="dark" content="隐藏搜索栏" placement="top"  v-show="showQuery">
            <el-button icon="el-icon-zoom-out"
                       circle
                       size="mini"
                       @click="showQuery = false"
            />
          </el-tooltip>
          <el-tooltip effect="dark" content="显示搜索栏" placement="top"  v-show="!showQuery">
            <el-button icon="el-icon-zoom-in"
                       circle
                       size="mini"
                       @click="showQuery = true"
            />
          </el-tooltip>
        </el-col>
        <el-col :span="1.5">
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-button icon="el-icon-refresh"
                       circle
                       size="mini"
                       @click="refreshRole"
            />
          </el-tooltip>
        </el-col>
      </el-row>

      <el-table :data="roles"
                v-loading="loading"
                border
                stripe
                size="small"
                style="font-size: 13px;"
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
                         width="100"
                         header-align="center"
                         align="center"
                         sortable
        />
        <el-table-column prop="name"
                         label="角色英文名称"
                         min-width="170"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="namezh"
                         label="角色中文名称"
                         min-width="170"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="remark"
                         label="角色描述"
                         min-width="250"
                         show-overflow-tooltip
                         header-align="center"
                         align="center"
        />
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
                       v-if="scope.row.id !== 6"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paginationStyle">
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[6, 10, 100]"
                     :page-size="queryRole.size ? queryRole.size : 6"
                     :total="total"
                     :current-page="queryRole.current"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     v-show="total > 0"
      />
    </div>

    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="500px"
               style="text-align: center"
    >
      <el-form ref="dialogForm">
        <el-form-item>
          <el-tag>角色英文名称</el-tag>
          <el-input size="medium"
                    clearable
                    v-model="editForm.name"
                    style="width: 280px; margin-left: 10px;"
          >
            <template slot="prepend">ROLE_</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-tag>角色中文名称</el-tag>
          <el-input v-model="editForm.namezh"
                    clearable
                    size="medium"
                    style="width: 280px; margin-left: 10px;"
          />
        </el-form-item>
        <el-form-item>
          <el-tag>角色作用描述</el-tag>
          <el-input v-model="editForm.remark"
                    size="medium"
                    type="textarea"
                    :autosize="{minRows: 2, maxRows: 2}"
                    maxlength="40"
                    show-word-limit
                    style="width: 280px; margin-left: 10px;"
          />
        </el-form-item>
        <el-form-item style="display: flex; justify-content: center;">
          <el-card class="box-card"
                   shadow="hover"
                   style="width: 380px"
          >
            <div slot="header" style="height: 20px;">
              <span style="font-size: 16px;color: #303133;">
                菜单权限管理
              </span>
            </div>
              <el-checkbox v-model="menuExpand" @change="handleMenuExpand">展开/折叠</el-checkbox>
              <el-checkbox v-model="menuAllChecked" @change="handleMenuAllChecked">全选/全不选</el-checkbox>
<!--              <el-checkbox v-model="checkStrictly" @change="handleCheckStrictly">父子联动</el-checkbox>-->
            <div>
              <el-tree class="tree-border"
                       ref="tree"
                       show-checkbox
                       empty-text="加载中，请稍后"
                       node-key="id"
                       :data="menuTree"
                       :props="defaultProps"
              />
            <!-- :check-strictly="!checkStrictly" -->
            </div>
          </el-card>
        </el-form-item>
        <el-form-item>
          <el-switch v-model="editForm.enabled"
                     active-text="启用"
                     inactive-text="禁用"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" size="small" type="primary" @click="handleForm">{{ buttonLoading ? '提交中...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {addDateRange} from "../../../../utils/commonTools";

export default {
  name: "Permission",
  data() {
    return {
      showQuery: true,
      loading: false,
      buttonLoading: false,

      multipleSelection: [],
      ids: [],

      total: 0,
      queryRole: {
        current: 1,
        size: 6,
      },
      pageSize: 0,
      dateRange: [],

      title: '',
      roles: [],

      // 树形数据
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      menuExpand: false,
      menuAllChecked: false,
      // checkStrictly: true,

      dialogVisible: false,
      // 用于添加、编辑角色
      editForm: {
        id: '',
        name: '',
        namezh: '',
        remark: '',
        enabled: true,
        menuIds: [],
      },
    }
  },

  watch: {
    // 监控 menuExpand 是否变化，变化则执行相关操作
    menuExpand(val) {
      this.handleMenuExpand(val)
    }
  },

  mounted() {
    this.initRole()
    this.getMenuTree()
  },

  methods: {

    // ----- 初始化数据 -----
    initRole() {
      this.loading = true
      this.API.roleGet({
        params: addDateRange(this.queryRole, this.dateRange)
      }).then(res => {
        if (res.code === 200) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
          this.pageSize = res.data.list.records.length
        } else if (res.code === 500) {
          this.roles = []
          this.total = 0
          this.pageSize = 0
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },

    // ----- 树形组件 -----
    // ----- 查询所有树形菜单 -----
    getMenuTree() {
      this.API.menuTree().then(res => {
        if (res.success) {
          this.menuTree = res.data.menus
        }
      })
    },
    // ----- 根据角色 id 查询其所属的菜单 -----
    getSelectedMenus(id) {
      const treeLoading = this.$loading({
        fullscreen: false,
        text: '正在获取权限...',
        background: 'rgba(255, 255, 255, 0.4)',
        target: document.querySelector(".el-card")
      })
      this.API.menuIdByRole(id).then(res => {
        if (res.success) {
          // 设置默认勾选的菜单
          this.$refs.tree.setCheckedKeys(res.data.list)
          treeLoading.close()
        }
      })
    },
    // ----- 处理树形中，展开 -----
    handleMenuExpand(val) {
      for (let i = 0; i < this.menuTree.length; i++) {
        this.$refs.tree.store.nodesMap[this.menuTree[i].id].expanded = val
      }
    },
    // ----- 处理树形中，全选 -----
    handleMenuAllChecked(val) {
      this.$refs.tree.setCheckedNodes(val ? this.menuTree : [])
    },
    // // ----- 处理树形中，父子关联 -----
    // handleCheckStrictly(val) {
    //   this.checkStrictly = !!val
    // },
    // ----- 重置树形数据 -----
    resetTree() {
      this.menuExpand = false
      this.menuAllChecked = false
      // this.checkStrictly = true
      if (this.$refs.tree !== undefined) {
        this.$refs.tree.setCheckedKeys([])
      }
    },

    // ----- 重置查询表单 -----
    resetForm() {
      this.queryRole = {
        current: 1,
        size: 6,
      }
      this.dateRange = []
    },

    // ----- 刷新数据 -----
    refreshRole() {
      this.loading = true
      this.resetForm()
      this.API.roleGet({
        params: this.queryRole
      }).then(res => {
        if (res.success) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
          this.pageSize = res.data.list.records.length
          this.$message.success("刷新成功")
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // ----- 处理分页 -----
    handleSizeChange(currentSize) {
      this.queryRole.size = currentSize
      this.queryRole.current = 1
      this.initRole()
    },
    handleCurrentChange(currentPage) {
      this.queryRole.current = currentPage
      this.initRole()
    },

    // ----- 按条件查询 -----
    handleQuery() {
      this.loading = true
      // 重置分页
      this.queryRole.current = 1

      this.API.roleGet({
        params: addDateRange(this.queryRole, this.dateRange)
      }).then(res => {
        if (res.code === 200) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
          this.pageSize = res.data.list.records.length
          this.$message.success(res.message)
        } else if (res.code === 500) {
          this.roles = []
          this.total = 0
          this.pageSize = 0
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },

    // ----- 修改角色状态 -----
    handleStatus(data) {
      const text = data.enabled === true ? "启用" : "停用"
      this.$confirm('确定要"' + text + '"角色【' + data.name + '】吗?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = text + '中...'

                this.API.roleStatus(data).then(res => {
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


    // ----- 初始化添加按钮 -----
    handleAdd() {
      this.resetTree()
      this.editForm = {enabled: true}
      this.title = "添加角色"
      this.dialogVisible = true
    },
    // ----- 初始化编辑按钮 -----
    showEdit(data) {
      this.resetTree()
      Object.assign(this.editForm, data)
      this.editForm.name = this.editForm.name.substr(5)
      this.title = "修改角色"

      // 获取所编辑对象所属的菜单
      this.getSelectedMenus(this.editForm.id)
      this.dialogVisible = true
    },
    // ----- 进行添加、修改角色 -----
    handleForm() {
      // 设置该角色所属的菜单
      this.editForm.menuIds = this.$refs.tree.getCheckedKeys(true)
      // // 如果取消父子联动，选择的是 半选父节点 的值，上一步需改为：
      // let checkedKeys = this.$refs.tree.getCheckedKeys()
      // let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      // this.editForm.menuIds = checkedKeys

      if (this.editForm.name && this.editForm.namezh) {
        const check = /^\w{1,15}$/
        if (check.test(this.editForm.name)) {
          this.buttonLoading = true

          if (this.editForm.id === undefined) {
            // 进行添加

            this.API.roleAddOrUpdate(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success("添加成功")
                this.resetForm()
                this.initRole()
                this.dialogVisible = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          } else {
            // 进行修改

            this.API.roleAddOrUpdate(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success(res.message)
                this.initRole()
                this.dialogVisible = false
              } else {
                this.buttonLoading = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          }

        } else {
          this.$message.error("角色英文名称格式不正确")
        }
      } else {
        if (!this.editForm.name) {
          this.$message.error("角色英文名称不能为空")
        } else {
          this.$message.error("角色中文名称不能为空")
        }
      }

      // 数据清零
      this.editForm.menuIds = []
    },


    // ----- 删除角色 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除所有与角色【' + data.name + '】相关的数据, 是否继续?',
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
                this.API.roleRemoveBatch(deleteId).then(res => {
                  instance.confirmButtonLoading = false
                  if (res.success) {

                    // 判断删除后该页是否还有数据
                    if (!(this.pageSize - 1 > 0)) {
                      this.queryRole.current = this.queryRole.current - 1 ? this.queryRole.current : 1
                    }
                    this.initRole()
                    this.$message.success(res.message)
                    done()
                  } else {
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
    handleSelectionChange(val) {
      // 传入选中的值
      this.multipleSelection = val
      // 遍历选中的值，将 id 存入一个集合中
      this.ids = val.map(item => item.id)
    },
    deleteBatch() {
      this.$confirm('此操作将永久删除与角色编号为【' + this.ids + '】相关的所有数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '删除中...'

                this.API.roleRemoveBatch(this.ids).then(data => {
                  instance.confirmButtonLoading = false
                  if (data.success) {

                    // 判断删除后该页是否还有数据
                    if (!(this.pageSize - this.ids.length > 0)) {
                      this.queryRole.current = this.queryRole.current - 1 ? this.queryRole.current : 1
                    }
                    this.initRole()
                    this.$message.success(data.message)
                    done()
                  } else {
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

<style>
.paginationStyle {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px
}
.permissionStyle .el-form-item__content .el-input-group {
  vertical-align: baseline;
}
</style>