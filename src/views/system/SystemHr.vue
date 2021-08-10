<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input size="small"
                  v-model="queryHr.name"
                  style="width: 160px;"
                  prefix-icon="el-icon-search"
                  placeholder="请输入用户名"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryHr.enabled"
                   placeholder="用户状态"
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
                     @click="refreshHr"
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
      <el-table :data="hrs"
                stripe
                size="small"
                ref="hrTableRef"
                row-key="id"
                @cell-click="handleClick"
                style="font-size: 13px;"
                :header-cell-style="myTableStyle"
      >
        <el-table-column type="expand" fixed="left">
          <template slot-scope="props">
            <el-form label-position="left" inline class="tableExpand">
              <el-form-item label="昵称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="联系地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="住宅电话">
                <span>{{ props.row.telephone }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="username"
                         label="用户名"
                         fixed="left"
                         sortable
                         min-width="100"
                         header-align="center"
                         align="center"
        />
        <el-table-column label="用户头像"
                         min-width="150"
                         header-align="center"
                         align="center"
        >
          <template slot-scope="scope">
            <img :src="scope.row.userFace" alt="" style="width: 40px; height: 40px; border-radius: 24px;"/>
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="昵称"
                         min-width="150"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="phone"
                         label="手机号码"
                         min-width="150"
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

  </div>
</template>

<script>
export default {
  name: "SystemHr",
  data() {
    return {
      // 用于查询
      queryHr: {},
      dateRange: [],

      hrs: [],
      dialogVisible: false,
    }
  },

  mounted() {
    this.initHr()
  },

  methods: {

    // ----- 初始化数据 -----
    initHr() {
      this.API.hrGet().then(res => {
        if (res.success) {
          this.hrs = res.data.list
        }
      })
    },

    // ----- 点击单元格触发展开收起 -----
    handleClick(row, column) {
      if (column.label === "用户名") {
        this.$refs.hrTableRef.toggleRowExpansion(row)
      }
    },

    // ----- 刷新数据 -----
    refreshHr() {
      this.initHr()
    },

    handleQuery() {
    },
    handleStatus() {
    },
    showAdd() {
    },
    showEdit() {
    },
    handleDelete() {
    },

    // ----- 表头样式 -----
    myTableStyle() {
      return "background-color: #f8f8f9; color: #515a6e;"
    }
  }
}
</script>

<style>
.tableExpand {
  font-size: 0;
}
.tableExpand label {
  width: 90px;
  color: #99a9bf;
}
.tableExpand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>