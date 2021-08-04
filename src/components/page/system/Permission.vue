<template>
  <div class="permissionStyle">
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="small"
                   @click="handleAdd"
        >
          新增
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
                     @click="refreshRole"
          />
        </el-tooltip>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button icon="el-icon-search"
                   type="primary"
                   size="small"
                   @click="handleQuery"
        >
          搜索
        </el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-select v-model="queryRole.enabled"
                   placeholder="角色状态"
                   clearable
                   size="small"
                   style="width: 150px;"
        >
          <el-option label="可用" value="true"></el-option>
          <el-option label="禁用" value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-input size="small"
                  v-model="queryRole.namezh"
                  style="width: 200px;"
                  placeholder="请输入角色中文名"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item style="float: right;">
        <el-input size="small"
                  v-model="queryRole.name"
                  style="width: 250px;"
                  placeholder="请输入角色英文名"
                  @keydown.enter.native="handleQuery"
        >
          <template slot="prepend">ROLE_</template>
        </el-input>
      </el-form-item>
    </el-form>

    <div>
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

<!--    <el-dialog title="修改职称"-->
<!--               :visible.sync="dialogVisible"-->
<!--               width="420px"-->
<!--               style="text-align: center"-->
<!--    >-->
<!--      <el-form>-->
<!--        <el-form-item>-->
<!--          <el-tag>职位名称</el-tag>-->
<!--          <el-input v-model="editPost.name"-->
<!--                    size="medium"-->
<!--                    style="width: 200px; margin-left: 10px;"-->
<!--          />-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-tag>职称级别</el-tag>-->
<!--          <el-select v-model="editPost.titleLevel"-->
<!--                     size="medium"-->
<!--                     style="width: 200px; margin-left: 10px;"-->
<!--          >-->
<!--            <el-option v-for="item in titleLevels"-->
<!--                       :key="item"-->
<!--                       :label="item"-->
<!--                       :value="item"-->
<!--            />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-switch v-model="editPost.enabled"-->
<!--                     active-text="启用"-->
<!--                     inactive-text="禁用"-->
<!--          />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button size="small" @click="dialogVisible = false">取 消</el-button>-->
<!--        <el-button size="small" type="primary" @click="handleEdit">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
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
        name: '',
        namezh: '',
        enabled: '',
      },

      // 用于添加角色
      addRole: {name: ''},
      roles: [],

      dialogVisible: false,
      editPost: {},
    }
  },

  mounted() {
    this.initRole()
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

    // ----- 刷新数据 -----
    refreshRole() {
      this.queryRole.current = 1
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
        params: this.queryRole
      }).then(res => {
        if (res.success) {
          this.roles = res.data.list.records
          this.total = res.data.list.total
          this.$message.success(res.message)
        }
      })
      this.queryRole.name = ''
      this.queryRole.namezh = ''
      this.queryRole.enabled = ''
    },


    // ----- 添加角色 -----
    handleAdd() {
    },

    // ----- 修改状态 -----
    handleStatus() {
    },

    // ----- 编辑角色 -----
    showEdit() {
    },

    // ----- 删除角色 -----
    handleDelete() {
    },
    handleSelectionChange() {
    },
    deleteBatch() {
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