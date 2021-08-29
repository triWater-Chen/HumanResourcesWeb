<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-form-item>
          <span slot="label" class="salaryQueryStyle">员工名</span>
          <el-input size="small"
                    clearable
                    v-model="querySalary.name"
                    style="width: 160px;"
                    placeholder="请输入员工名"
                    @keydown.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <span slot="label" class="salaryQueryStyle">工号</span>
          <el-input size="small"
                    clearable
                    v-model="querySalary.workId"
                    style="width: 160px; margin-right: 10px"
                    placeholder="请输入员工工号"
                    @keydown.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item class="editTree">
          <span slot="label" class="salaryQueryStyle">部门</span>
          <TreeSelect v-model="querySalary.departmentId"
                      :options="departments"
                      :default-expand-level="2"
                      :normalizer="normalizerQuery"
                      noResultsText="未查询到相关部门"
                      :clearable="true"
                      placeholder="请输入关键字"
                      style="width: 188px; line-height: 34px; margin-top: 3px"
          />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search"
                     type="primary"
                     size="small"
                     @click="handleQuery"
                     style="margin-left: 12px"
          >
            查询
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
    </div>

    <div>
      <el-table :data="salaries"
                v-loading="loading"
                border
                stripe
                size="mini"
                style="font-size: 13px;"
                :header-cell-style="myTableStyle"
      >
        <el-table-column prop="id"
                         label="编号"
                         fixed="left"
                         min-width="60"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="name"
                         label="员工名"
                         show-overflow-tooltip
                         min-width="110"
                         header-align="center"
                         align="center"
                         sortable
        />
        <el-table-column prop="workId"
                         label="工号"
                         min-width="120"
                         header-align="center"
                         align="center"
                         sortable
        />
        <el-table-column prop="phone"
                         label="手机号码"
                         min-width="150"
                         header-align="center"
                         align="center"
                         sortable
        />
        <el-table-column prop="email"
                         label="邮箱"
                         show-overflow-tooltip
                         min-width="150"
                         header-align="center"
                         align="center"
        />
        <el-table-column prop="department.name"
                         label="所属部门"
                         min-width="120"
                         header-align="center"
                         align="center"
        >
          <template slot-scope="scope">
            <el-tag size="medium" >{{ scope.row.department.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属账套"
                         min-width="140"
                         align="center"
        >
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{scope.row.salary.basicSalary}}</td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{scope.row.salary.trafficSalary}}</td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{scope.row.salary.lunchSalary}}</td>
                  </tr>
                  <tr>
                    <td>奖金</td>
                    <td>{{scope.row.salary.bonus}}</td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{scope.row.salary.pensionPer}}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{scope.row.salary.pensionBase}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{scope.row.salary.medicalPer}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{scope.row.salary.medicalBase}}</td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                  </tr>
                  <tr>
                    <td>启用时间</td>
                    <td>{{scope.row.salary.createdate}}</td>
                  </tr>
                </table>
              </div>
              <el-tag effect="dark"
                      disable-transitions
              >
                {{scope.row.salary.name}}
              </el-tag>
            </el-tooltip>
            <el-tag effect="dark"
                    type="info"
                    v-else
                    disable-transitions
            >
              暂未设置
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         header-align="center"
                         align="center"
                         min-width="130"
        >
          <template slot-scope="scope">
            <el-popover placement="left"
                        title="修改工资账套"
                        @show="showPop(scope.row.salary)"
                        @hide="hidePop(scope.row)"
                        width="200"
                        trigger="click"
            >
              <div>
                <el-select v-model="currentSob" placeholder="请选择" size="mini">
                  <el-option   v-for="item in sobs"
                               :key="item.id"
                               :label="item.name"
                               :value="item.id"
                  />
                </el-select>
              </div>
              <el-button slot="reference"
                         size="small"
                         type="text"
                         icon="el-icon-edit"
              >
                修改工资账套
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="paginationStyle">
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[5, 12, 50, 100]"
                     :page-size="querySalary.size ? querySalary.size : 12"
                     :total="total"
                     :current-page="querySalary.current"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     v-show="total > 0"
      />
    </div>

    <el-backtop target=".el-main" :bottom="100">
      <div
          style="{
        height: 100%;
        width: 100%;
        background-color: #001529;
        box-shadow: 0 0 6px rgba(0,0,0, .12);
        text-align: center;
        line-height: 40px;
        color: #1890ff;
        border-radius: 50%;
      }"
      >
        ↑
      </div>
    </el-backtop>

  </div>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "SalarySobCfg",
  components: { TreeSelect },
  data() {
    return {
      loading: false,

      total: 0,
      querySalary: {
        current: 1,
        size: 12,
      },

      departments: [],
      salaries: [],

      sobs: [],
      currentSob: null,

      // 仅声明下，取消未解析变量的报错
      salary: '',
      workId: '',
      department: '',
    }
  },

  mounted() {
    this.initVarData()
    this.initSalary()
  },

  methods: {

    // ----- 初始化数据 -----
    initSalary() {
      this.loading = true
      this.API.salaryGet({
        params: this.querySalary
      }).then(res => {
        if (res.code === 200) {
          this.salaries = res.data.salaries.list
          this.total = res.data.salaries.total
        } else if (res.code === 500) {
          this.salaries = []
          this.total = 0
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },

    // ----- 初始化下拉数据列表 -----
    initVarData() {
      this.API.salaryOfDepartments().then(res => {
        if (res.success) {
          this.departments = res.data.departments
          this.deleteChildren(this.departments)
        }
      })
      this.API.salaryOfSobs().then(res => {
        if (res.success) {
          this.sobs = res.data.sobs
        }
      })
    },

    // ----- 处理部门树 -----
    normalizerQuery(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      }
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children,
        isDisabled: !node.enabled
      }
    },
    // ----- 递归删除值为 null 的 children -----
    deleteChildren(data) {
      data.forEach(item => {
        item.children === null ? delete item.children : this.deleteChildren(item.children)
      })
    },

    // ----- 重置查询表单 -----
    resetForm() {
      this.querySalary = {
        current: 1,
        size: 12,
      }
    },

    // ----- 处理分页 -----
    handleSizeChange(currentSize) {
      this.querySalary.size = currentSize
      this.querySalary.current = 1
      this.initSalary()
    },
    handleCurrentChange(currentPage) {
      this.querySalary.current = currentPage
      this.initSalary()
    },

    // ----- 刷新数据 -----
    refreshRole() {
      this.loading = true
      this.resetForm()
      this.initVarData()
      this.API.salaryGet({
        params: this.querySalary
      }).then(res => {
        if (res.success) {
          this.salaries = res.data.salaries.list
          this.total = res.data.salaries.total
          this.$message.success("刷新成功")
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // ----- 按条件查询 -----
    handleQuery() {
      this.loading = true
      // 重置分页
      this.querySalary.current = 1

      this.API.salaryGet({
        params: this.querySalary
      }).then(res => {
        if (res.code === 200) {
          this.salaries = res.data.salaries.list
          this.total = res.data.salaries.total
          this.$message.success(res.message)
        } else if (res.code === 500) {
          this.salaries = []
          this.total = 0
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // ----- 修改账套 -----
    showPop(data) {
      if (data) {
        this.currentSob = data.id
      } else {
        this.currentSob = null
      }
    },
    hidePop(data) {
      if (this.currentSob) {
        this.$confirm('确定修改将该员工账套吗?',
            '提示',
            {
              confirmButtonText: '确 定',
              cancelButtonText: '取 消',
              type: 'warning',
              beforeClose: ((action, instance, done) => {
                if (action === 'confirm') {
                  instance.confirmButtonLoading = true
                  instance.confirmButtonText = '修改中...'

                  let empSalary = {
                    eid: data.id,
                    sid: this.currentSob
                  }
                  this.API.salaryUpdate(empSalary).then(res => {
                    instance.confirmButtonLoading = false
                    if (res.success) {
                      this.initSalary()
                      this.$message.success(res.message)
                      done()
                    } else {
                      done()
                    }
                  }).catch(() => {
                    instance.confirmButtonLoading = false
                    instance.confirmButtonText = '确 定'
                    done()
                  })
                } else {
                  done()
                }
              })
            }).catch(() => {})
      }
    },

    // ----- 表头样式 -----
    myTableStyle() {
      return "background-color: #f8f8f9; color: #515a6e;"
    }
  }
}
</script>

<style>
.salaryQueryStyle {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
}
.paginationStyle {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px
}
</style>