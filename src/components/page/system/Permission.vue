<template>
  <div class="permissionStyle">
    <el-form :inline="true">
      <el-form-item>
        <el-input size="small"
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
                         sortable
        />
        <el-table-column prop="name"
                         label="角色英文名称"
                         min-width="200"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="namezh"
                         label="角色中文名称"
                         min-width="200"
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
                     :page-size="6"
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
                    v-model="editForm.name"
                    style="width: 280px; margin-left: 10px;"
          >
            <template slot="prepend">ROLE_</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-tag>角色中文名称</el-tag>
          <el-input v-model="editForm.namezh"
                    size="medium"
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
              <el-checkbox v-model="checkStrictly" @change="handleCheckStrictly">父子联动</el-checkbox>
            <div>
              <el-tree class="tree-border"
                       ref="tree"
                       show-checkbox
                       empty-text="加载中，请稍后"
                       node-key="id"
                       :data="menuTree"
                       :props="defaultProps"
                       :check-strictly="!checkStrictly"
              />
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
        <el-button size="small" type="primary" @click="handleForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addDateRange} from "../../../utils/commonUtils";

export default {
  name: "Permission",
  data() {
    return {
      multipleSelection: [],
      ids: [],

      total: 0,
      queryRole: {
        current: 1,
        size: 6,
      },
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
      checkStrictly: true,

      dialogVisible: false,
      // 用于添加、编辑角色
      editForm: {
        id: '',
        name: '',
        namezh: '',
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
      this.API.roleGet({
        params: this.queryRole
      }).then(res => {
        if (res.success) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
        }
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
      this.API.menuIdByRole(id).then(res => {
        if (res.success) {
          // 设置默认勾选的菜单
          this.$refs.tree.setCheckedKeys(res.data.list)
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
    // ----- 处理树形中，父子关联 -----
    handleCheckStrictly(val) {
      this.checkStrictly = !!val
    },
    // ----- 重置树形数据 -----
    resetTree() {
      this.menuExpand = false
      this.menuAllChecked = false
      this.checkStrictly = true
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
      this.resetForm()
      this.API.roleGet({
        params: this.queryRole
      }).then(res => {
        if (res.success) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
          this.$message.success("刷新成功")
        }
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
      this.queryRole.current = 1
      this.API.roleGet({
        params: addDateRange(this.queryRole, this.dateRange)
      }).then(res => {
        if (res.success) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
          this.$message.success(res.message)
        } else {
          this.roles = []
          this.total = 0
          this.$message.error(res.message)
        }
      })
      // 重置查询条件
      this.resetForm()
    },

    // ----- 修改角色状态 -----
    handleStatus(data) {
      const text = data.enabled === true ? "启用" : "停用"
      this.$confirm('确定要"' + text + '"角色【' + data.name + '】吗?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
        this.API.roleStatus(data).then(res => {
          if (res.success) {
            this.$message.success(text + "成功")
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

      if (this.editForm.name && this.editForm.namezh) {
        const check = /^\w{1,15}$/
        if (check.test(this.editForm.name)) {

          if (this.editForm.id === undefined) {
            // 进行添加

            this.API.roleAddOrUpdate(this.editForm).then(res => {
              if (res.success) {
                this.$message.success("添加成功")
                this.initRole()
              }
            })
          } else {
            // 进行修改

            this.API.roleAddOrUpdate(this.editForm).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.initRole()
              }
            })
          }

        } else {
          this.$message.success("角色英文名称格式不正确")
        }
      } else {
        if (!this.editForm.name) {
          this.$message.success("角色英文名称不能为空")
        } else {
          this.$message.success("角色中文名称不能为空")
        }
      }

      // 数据清零
      this.editForm.menuIds = []
      this.dialogVisible = false
    },


    // ----- 删除角色 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除所有与角色【' + data.name + '】相关的数据, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            const deleteId = []
            deleteId.push(data.id)
            this.API.roleRemoveBatch(deleteId).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.initRole()
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
            type: 'warning'
          }).then(() => {
            this.API.roleRemoveBatch(this.ids).then(data => {
              if (data.success) {
                this.$message.success(data.message)
                this.initRole()
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