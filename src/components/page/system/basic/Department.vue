<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input size="small"
                  v-model="queryDep.name"
                  style="width: 160px;"
                  prefix-icon="el-icon-search"
                  placeholder="请输入部门名"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryDep.enabled"
                   placeholder="部门状态"
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
          查询
        </el-button>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button icon="el-icon-refresh"
                     circle
                     size="mini"
                     @click="refreshDepartment"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button icon="el-icon-plus"
                   type="primary"
                   size="small"
                   @click="showAdd"
        >
          添加
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-table :data="departments"
                row-key="id"
                ref="tableRef"
                default-expand-all
                border
                size="small"
                style="font-size: 13px;"
                :header-cell-style="myTableStyle"
                @cell-click="handleClick"
      >
        <el-table-column prop="name"
                         label="部门名称"
                         min-width="250"
        />
        <el-table-column  prop="sort"
                          label="排序"
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
            <el-tag effect="dark" type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag effect="dark" type="info" v-else>未启用</el-tag>
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
                       icon="el-icon-plus"
                       @click="showAdd(scope.row)"
            >
              添加
            </el-button>
            <el-button size="small"
                       type="text"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.row)"
                       v-if="scope.row.parentId !== -1"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="420px"
               style="text-align: center"
    >
      <el-form>
        <el-row>
          <el-col :span="24" v-if="editForm.parentId !== -1">
            <el-form-item style="display: flex; justify-content: center;">
              <span slot="label" class="treeStyle">上级部门</span>
              <TreeSelect v-model="editForm.parentId"
                          :options="depTree"
                          :normalizer="normalizer"
                          placeholder="选择上级部门"
                          style="width: 280px;"
              />
              <!-- :key="componentKey" -->
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-tag>部门名称</el-tag>
              <el-input v-model="editForm.name"
                        style="width: 280px; margin-left: 10px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="text-align: right">
              <el-tag>部门顺序</el-tag>
              <el-input-number v-model="editForm.sort"
                               controls-position="right"
                               :min="0"
                               style="width: 100px; margin-left: 10px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item style="text-align: center">
              <el-switch v-model="editForm.enabled"
                         active-text="启用"
                         inactive-text="禁用"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addDateRange, copy} from "../../../../utils/commonTools";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Department",
  components: { TreeSelect },
  data() {
    return {
      // 用于查询
      queryDep: {},
      dateRange: [],

      title: '',
      departments: [],
      dialogVisible: false,

      depTreeTemp: [],
      depTree: [],
      // 重新渲染组件（通过更改 key 强制刷新组件）
      // 使用深拷贝后，便不需要重新渲染，对源对象的修改不会影响现对象
      componentKey: 0,

      editForm: {
        parentId: '',
        sort: '',
        enabled: true,
        name: '',
      },
    }
  },

  mounted() {
    this.initDepartment()
  },

  methods: {

    // ----- 初始化数据 -----
    initDepartment() {
      // 初始化页面树
      this.API.departmentTree().then(res => {
        if (res.success) {
          this.departments = res.data.tree

          // 使用深拷贝，将树存起来，用于赋值给下拉树
            // 原因一：在查询后，通过 departments 赋值给下拉树的就不是完整的部门
            // 原因二：使用深拷贝，使得对下拉树的操作不会影响到 departments （即表格）数据
          this.depTreeTemp = copy(this.departments)
          // 处理下拉数据
          this.deleteChildren(this.depTreeTemp)
        }
      })
    },

    // ----- 点击单元格触发展开收起 -----
    handleClick(row, column) {
      if (column.label === "部门名称") {
        this.$refs.tableRef.toggleRowExpansion(row)
      }
    },

    // ----- 刷新数据 -----
    refreshDepartment() {
      this.API.departmentTree().then(res => {
        if (res.success) {
          this.departments = res.data.tree
          this.depTreeTemp = copy(this.departments)
          this.deleteChildren(this.depTreeTemp)

          this.$message.success("刷新成功")
        }
      })
    },

    // ----- 按条件查询 -----
    handleQuery() {
      this.API.departmentGet({
        params: addDateRange(this.queryDep, this.dateRange)
      }).then(res => {
        if (res.code === 200) {
          this.departments = res.data.list
          this.$message.success(res.message)
        } else if (res.code === 500) {
          this.departments = []
          this.$message.error(res.message)
        }
      })
      // 重置查询表单
      this.queryDep = {}
      this.dateRange = []
    },

    // ----- 递归删除值为 null 的 children -----
    deleteChildren(data) {
      data.forEach(item => {
        item.children === null ? delete item.children : this.deleteChildren(item.children)
      })
    },
    // ----- 递归将等于 id 的节点及其子节点进行禁用 -----
    disabledDepartment(data, id) {
      data.forEach(item => {
        if (item.children !== undefined) {
          // 若有子节点，则判断是否为本身或其子节点
          if (item.id === id || item.parentId === id) {
            item.isDisabled = true
            this.disabledDepartment(item.children, item.id)
          } else {
            item.isDisabled = false
            this.disabledDepartment(item.children, id)
          }
        } else {
          // 若无子节点，则只需判断是否为本身
          item.isDisabled = item.id === id;
        }
      })
    },
    // ----- 返回下拉树所需格式 -----
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },


    // ----- 初始化添加按钮 -----
    showAdd(data) {
      // 初始化表单数据
      this.editForm = {enabled: true}
      if (data !== undefined) {
        this.editForm.parentId = data.id
      }
      this.title = "添加部门"

      // 初始化下拉树，不禁用节点
      this.depTree = copy(this.depTreeTemp)
      this.disabledDepartment(this.depTree, 0)
      // 重新渲染树
      // this.componentKey--

      this.dialogVisible = true
    },
    // ----- 初始化修改按钮 -----
    showEdit(data) {
      // 初始化表单数据（浅拷贝即可）
      Object.assign(this.editForm, data)
      this.title = "修改部门"

      // 将子节点禁用，不允许修改子节点为自己的父节点
      this.depTree = copy(this.depTreeTemp)
      this.disabledDepartment(this.depTree, this.editForm.id)
      // 重新渲染树
      // this.componentKey++

      this.dialogVisible = true
    },
    // ----- 添加、修改部门 -----
    handleForm() {
      // 下拉树中不用禁止不可用的部门，因为就算不可用的部门也需要调整，而不是不能调整
      // 状态调整：若节点禁用，其子节点需全是禁用状态；若节点可用，其父节点必可用

      if (!this.editForm.parentId && this.editForm.parentId !== -1) {
        this.$message.error("上级部门不能为空")
      } else if (!this.editForm.name) {
        this.$message.error("部门名称不能为空")
      } else if (!(this.editForm.sort >= 0)){
        this.$message.error("部门顺序不能为空")
      } else {
        if (this.editForm.id === undefined) {
          // 进行添加

          this.API.departmentAdd(this.editForm).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.initDepartment()
              this.dialogVisible = false
            }
          })
        } else {
          // 进行修改

          this.API.departmentUpdate(this.editForm).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.initDepartment()
              this.dialogVisible = false
            }
          })
        }
      }
    },


    // ----- 删除部门 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除部门【' + data.name + '】, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            this.API.departmentRemove(data.id).then(res => {
              if (res.success) {
                this.$message.success(res.message)
                this.initDepartment()
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
.treeStyle {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
}
</style>