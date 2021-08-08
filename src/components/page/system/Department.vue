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
                   @click="handleAdd"
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
          <el-col :span="24">
            <el-form-item style="display: flex; justify-content: center;">
              <span slot="label" class="treeStyle">上级部门</span>
              <TreeSelect v-model="editForm.parentId"
                          :options="depTree"
                          :normalizer="normalizer"
                          placeholder="选择上级部门"
                          style="width: 280px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
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
import {addDateRange} from "../../../utils/commonUtils";
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

      defaultProps: {
        children: 'children',
        label: 'name'
      },
      depTree: [],

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
        }
      })
      this.initDepartmentTree()
    },
    // 初始化下拉树
    initDepartmentTree() {
      this.API.departmentOrderTree().then(res => {
        this.depTree = res.data.tree
        // 处理下拉树数据
        this.deleteChildren(this.depTree)
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
          this.$message.success("刷新成功")
        }
      })
    },

    // ----- 按条件查询 -----
    handleQuery() {
      this.API.departmentGet({
        params: addDateRange(this.queryDep, this.dateRange)
      }).then(res => {
        if (res.success) {
          this.departments = res.data.list
          this.$message.success(res.message)
        } else {
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
    // ----- 返回下拉树所需格式 -----
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },

    // ----- 修改部门状态 -----
    handleStatus() {
    },

    handleAdd() {
      this.dialogVisible = true
    },
    showAdd() {
    },
    showEdit(data) {
      Object.assign(this.editForm, data)
      this.title = "修改角色"
      this.dialogVisible = true
    },
    // ----- 添加、修改部门 -----
    handleForm() {
      this.dialogVisible = false
    },

    // ----- 删除部门 -----
    handleDelete() {
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