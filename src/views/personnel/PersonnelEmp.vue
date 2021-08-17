<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <span slot="label" class="employeeQueryStyle">员工名</span>
        <el-input size="small"
                  v-model="queryEmployee.name"
                  style="width: 180px;"
                  placeholder="请输入员工名"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <span slot="label" class="employeeQueryStyle">职位</span>
        <el-select v-model="queryEmployee.posId"
                   placeholder="请选择职位"
                   clearable
                   size="small"
                   style="width: 200px;"
        >
          <el-option v-for="position in positions"
                     :key="position.id"
                     :label="position.name"
                     :value="position.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <span slot="label" class="employeeQueryStyle">所属部门</span>
        <el-select v-model="queryEmployee.departmentId"
                   placeholder="请选择部门"
                   clearable
                   size="small"
                   style="width: 200px;"
        >
          <el-option v-for="department in departments"
                     :key="department.id"
                     :label="department.name"
                     :value="department.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search"
                   type="primary"
                   size="small"
                   @click="handleQuery"
        >
          查询
        </el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-row :gutter="10" style="margin-bottom: 10px;">
        <el-col :span="1.5">
          <el-button type="primary"
                     icon="el-icon-plus"
                     size="mini"
                     plain
                     @click="handleAdd"
          >
            新增
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger"
                     icon="el-icon-delete"
                     size="mini"
                     plain
                     :disabled="multipleSelection.length === 0"
                     @click="deleteBatch"
          >
            删除
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info"
                     icon="el-icon-upload2"
                     size="mini"
                     plain
          >
            导入
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning"
                     icon="el-icon-download"
                     size="mini"
                     plain
          >
            导出
          </el-button>
        </el-col>
        <el-col :span="1.5">
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-button icon="el-icon-refresh"
                       circle
                       size="mini"
                       @click="refreshHr"
            />
          </el-tooltip>
        </el-col>
      </el-row>

      <el-row>
        <el-table :data="employees"
                  v-loading="loading"
                  stripe
                  size="mini"
                  style="font-size: 13px;"
                  :header-cell-style="myTableStyle"
                  @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection"
                           width="50"
                           fixed="left"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="name"
                           label="姓名"
                           fixed="left"
                           show-overflow-tooltip
                           min-width="110"
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column prop="workId"
                           label="工号"
                           min-width="110"
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column prop="gender"
                           label="性别"
                           min-width="60"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="phone"
                           label="手机号码"
                           min-width="140"
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column prop="idCard"
                           label="身份证号码"
                           min-width="190"
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
          <el-table-column prop="birthday"
                           label="出生日期"
                           min-width="110"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="wedlock"
                           label="婚姻状况"
                           min-width="80"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="nation.name"
                           label="民族"
                           min-width="60"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="nativePlace"
                           label="籍贯"
                           show-overflow-tooltip
                           min-width="80"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="politicsStatus.name"
                           label="政治面貌"
                           show-overflow-tooltip
                           min-width="90"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="address"
                           label="联系地址"
                           show-overflow-tooltip
                           min-width="180"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="department.name"
                           label="所属部门"
                           min-width="100"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="position.name"
                           label="职位"
                           min-width="100"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="jobLevel.name"
                           label="职称"
                           min-width="100"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="engageForm"
                           label="聘用形式"
                           min-width="100"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="tiptopDegree"
                           label="最高学历"
                           min-width="80"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="specialty"
                           label="专业"
                           show-overflow-tooltip
                           min-width="150"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="school"
                           label="毕业院校"
                           show-overflow-tooltip
                           min-width="150"
                           header-align="center"
                           align="center"
          />
          <el-table-column  prop="beginDate"
                            label="入职日期"
                            min-width="120"
                            header-align="center"
                            align="center"
          />
          <el-table-column  prop="conversionTime"
                            label="转正日期"
                            min-width="120"
                            header-align="center"
                            align="center"
          />
          <el-table-column  prop="beginContract"
                            label="合同起始日期"
                            min-width="120"
                            header-align="center"
                            align="center"
          />
          <el-table-column  prop="endContract"
                            label="合同截止日期"
                            min-width="120"
                            header-align="center"
                            align="center"
          />
          <el-table-column label="合同期限（年）"
                           min-width="120"
                           header-align="center"
                           align="center"
          >
            <template slot-scope="scope">
              <el-tag>{{scope.row.contractTerm}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           fixed="right"
                           header-align="center"
                           align="center"
                           min-width="130"
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
      </el-row>

    </div>

    <div class="paginationStyle">
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[10, 12, 50, 100]"
                     :page-size="12"
                     :total="total"
                     :current-page="queryEmployee.current"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     v-show="total > 0"
      />
    </div>

    <el-drawer :visible.sync="drawer"
               direction="ltr"
               :with-header="false"
               size="550px"
               :before-close="beforeClose"
    >
      <h3 style="color: royalblue; text-align: center">{{ title }}</h3>
      <div style="padding: 0 10px">
        <el-divider content-position="left">基本情况：</el-divider>
      </div>
      <div class="employee-drawer__content">
        <el-form label-width="80px"
                 ref="employeeForm"
                 :model="editForm"
                 :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name">
                <span slot="label" class="employeeFormStyle">姓名</span>
                <el-input v-model="editForm.name"
                          size="small"
                          placeholder="请输入员工名"
                          maxlength="12"
                          prefix-icon="el-icon-edit"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="gender">
                <span slot="label" class="employeeFormStyle">性别</span>
                <el-radio-group v-model="editForm.gender" style="margin-left: 20px">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="nativePlace">
                <span slot="label" class="employeeFormStyle">籍贯</span>
                <el-input v-model="editForm.nativePlace"
                          size="small"
                          placeholder="请输入籍贯"
                          prefix-icon="el-icon-edit"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="nationId">
                <span slot="label" class="employeeFormStyle">民族</span>
                <el-select v-model="editForm.nationId"
                           size="small"
                           placeholder="民族"
                           style="width: 180px;"
                >
                  <el-option v-for="nation in nations"
                             :key="nation.id"
                             :label="nation.name"
                             :value="nation.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="email">
                <span slot="label" class="employeeFormStyle">邮箱</span>
                <el-input v-model="editForm.email"
                          size="small"
                          placeholder="请输入邮箱"
                          prefix-icon="el-icon-message"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="phone">
                <span slot="label" class="employeeFormStyle">手机号</span>
                <el-input v-model="editForm.phone"
                          size="small"
                          placeholder="请输入手机号"
                          maxlength="11"
                          prefix-icon="el-icon-phone"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="birthday">
                <span slot="label" class="employeeFormStyle">出生日期</span>
                <el-date-picker  v-model="editForm.birthday"
                                 size="small"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 style="width: 180px;"
                                 placeholder="出生日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="idCard">
                <span slot="label" class="employeeFormStyle">身份证号</span>
                <el-input v-model="editForm.idCard"
                          size="small"
                          placeholder="请输入身份证号"
                          maxlength="18"
                          prefix-icon="el-icon-edit"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="politicId">
                <span slot="label" class="employeeFormStyle">政治面貌</span>
                <el-select v-model="editForm.politicId"
                           size="small"
                           placeholder="政治面貌"
                           style="width: 180px;"
                >
                  <el-option v-for="politic in politicStatus"
                             :key="politic.id"
                             :label="politic.name"
                             :value="politic.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="tiptopDegree">
                <span slot="label" class="employeeFormStyle">最高学历</span>
                <el-select v-model="editForm.tiptopDegree"
                           size="small"
                           placeholder="最高学历"
                           style="width: 180px;"
                >
                  <el-option v-for="degree in degrees"
                             :key="degree"
                             :label="degree"
                             :value="degree"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="school">
                <span slot="label" class="employeeFormStyle">毕业院校</span>
                <el-input v-model="editForm.school"
                          size="small"
                          placeholder="请输入校名"
                          prefix-icon="el-icon-school"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="specialty">
                <span slot="label" class="employeeFormStyle">所属专业</span>
                <el-input v-model="editForm.specialty"
                          size="small"
                          placeholder="请输入专业名"
                          prefix-icon="el-icon-edit"
                          style="width: 180px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="wedlock">
              <span slot="label" class="employeeFormStyle">婚姻状况</span>
              <el-radio-group v-model="editForm.wedlock">
                <el-radio label="未婚">未婚</el-radio>
                <el-radio label="已婚">已婚</el-radio>
                <el-radio label="离异">离异</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="address">
              <span slot="label" class="employeeFormStyle">联系地址</span>
              <el-input v-model="editForm.address"
                        size="small"
                        placeholder="请输入地址"
                        prefix-icon="el-icon-edit"
              />
            </el-form-item>
          </el-row>

          <el-divider content-position="left">入司情况：</el-divider>

          <el-row>
            <el-col :span="12">
              <el-form-item prop="departmentId">
                <span slot="label" class="employeeFormStyle">部门</span>
                <el-select v-model="editForm.departmentId"
                           size="small"
                           placeholder="请选择部门"
                           style="width: 180px;"
                >
                  <el-option v-for="department in departments"
                             :key="department.id"
                             :label="department.name"
                             :value="department.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="posId">
                <span slot="label" class="employeeFormStyle">职位</span>
                <el-select v-model="editForm.posId"
                           size="small"
                           placeholder="请选择职位"
                           style="width: 180px;"
                >
                  <el-option v-for="position in positions"
                             :key="position.id"
                             :label="position.name"
                             :value="position.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="jobLevelId">
                <span slot="label" class="employeeFormStyle">职称</span>
                <el-select v-model="editForm.jobLevelId"
                           size="small"
                           placeholder="请选择职称"
                           style="width: 180px;"
                >
                  <el-option v-for="jobLevel in jobLevels"
                             :key="jobLevel.id"
                             :label="jobLevel.name"
                             :value="jobLevel.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="beginDate">
                <span slot="label" class="employeeFormStyle">入职日期</span>
                <el-date-picker  v-model="editForm.beginDate"
                                 size="small"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 style="width: 180px;"
                                 placeholder="入职日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="conversionTime">
                <span slot="label" class="employeeFormStyle">转正日期</span>
                <el-date-picker  v-model="editForm.conversionTime"
                                 size="small"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 style="width: 180px;"
                                 placeholder="转正日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="beginDate">
                <span slot="label" class="employeeFormStyle">入职日期</span>
                <el-date-picker  v-model="editForm.beginDate"
                                 size="small"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 style="width: 180px;"
                                 placeholder="入职日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="beginContract">
                <span slot="label" class="employeeFormStyle">合同起始</span>
                <el-date-picker  v-model="editForm.beginContract"
                                 size="small"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 style="width: 180px;"
                                 placeholder="合同起始日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="endContract">
                <span slot="label" class="employeeFormStyle">合同终止</span>
                <el-date-picker  v-model="editForm.endContract"
                                 size="small"
                                 type="date"
                                 value-format="yyyy-MM-dd"
                                 style="width: 180px;"
                                 placeholder="合同终止日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <el-form-item prop="engageForm">
                <span slot="label" class="employeeFormStyle">聘用形式</span>
                <el-radio-group v-model="editForm.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="workState">
                <span slot="label" class="employeeFormStyle">在职状态</span>
                <el-select v-model="editForm.workState"
                           size="small"
                           style="width: 115px;"
                           :disabled="title === '添加员工'"
                >
                  <el-option v-for="workState in workStates"
                             :key="workState"
                             :label="workState"
                             :value="workState"
                  />
                </el-select>
<!--                <el-radio-group v-model="editForm.workState">-->
<!--                  <el-radio label="在职">在职</el-radio>-->
<!--                  <el-radio label="离职">离职</el-radio>-->
<!--                </el-radio-group>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
          </el-row>

        </el-form>
        <el-form>
          <el-form-item style="text-align: center; margin-top: 5px;">
            <el-button @click="drawer = false" style="width: 150px">返 回</el-button>
            <el-button :loading="loading" type="primary" @click="handleSubmit" style="width: 150px">
              {{ loading ? '提交中...' : '提 交' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "PersonnelEmp",
  data() {
    return {

      loading: false,

      total: 0,
      queryEmployee: {
        current: 1,
        size: 12,
      },
      pageSize: 0,

      departments: [],
      positions: [],
      nations: [],
      politicStatus: [],
      jobLevels: [],
      degrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
      workStates: ['在职', '离职'],

      multipleSelection: [],
      ids: [],

      title: '',
      employees: [],

      drawer: false,
      editForm: {
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: '',
        nativePlace: '',
        politicId: '',
        email: '',
        phone: '',
        address: '',
        departmentId: '',
        jobLevelId: '',
        posId: '',
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '',
        workID: '',
        contractTerm: '',
        conversionTime: '',
        notworkDate: '',
        beginContract: '',
        endContract: '',
        workAge: ''
      },

      rules: {},
    }
  },

  mounted() {
    this.initEmployee()
  },

  methods: {

    // ----- 初始化数据 -----
    initEmployee() {
      this.loading = true
      this.API.employeeGet({
        params: this.queryEmployee
      }).then(res => {
        if (res.success) {
          this.employees = res.data.list.records
          this.total = res.data.list.total
          this.pageSize = res.data.list.records.length
        }
        this.loading = false
      })
    },

    // ----- 重置查询表单 -----
    resetForm() {
      this.queryEmployee = {
        current: 1,
        size: 12,
      }
    },

    // ----- 处理分页 -----
    handleSizeChange(currentSize) {
      this.queryEmployee.size = currentSize
      this.queryEmployee.current = 1
      this.initEmployee()
    },
    handleCurrentChange(currentPage) {
      this.queryEmployee.current = currentPage
      this.initEmployee()
    },

    // ----- 刷新数据 -----
    refreshHr() {
      this.loading = true
      this.resetForm()
      this.API.employeeGet({
        params: this.queryEmployee
      }).then(res => {
        if (res.success) {
          this.employees = res.data.list.records
          this.total = res.data.list.total
          this.pageSize = res.data.list.records.length
          this.$message.success("刷新成功")
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    // ----- 按条件查询 -----
    handleQuery() {},

    // ----- 初始化添加按钮 -----
    handleAdd() {
      // 初始化表单数据（因为用了表单校验，所以需要先定义字段）
      this.editForm = {
        name: undefined,
        gender: undefined,
        birthday: undefined,
        idCard: undefined,
        wedlock: undefined,
        nationId: undefined,
        nativePlace: undefined,
        politicId: undefined,
        email: undefined,
        phone: undefined,
        address: undefined,
        departmentId: undefined,
        jobLevelId: undefined,
        posId: undefined,
        engageForm: undefined,
        tiptopDegree: undefined,
        specialty: undefined,
        school: undefined,
        beginDate: undefined,
        workState: '在职',
        workID: undefined,
        contractTerm: undefined,
        conversionTime: undefined,
        notworkDate: undefined,
        beginContract: undefined,
        endContract: undefined,
        workAge: undefined
      }
      this.title = "添加员工"

      this.drawer = true
    },
    // ----- 初始化编辑按钮 -----
    showEdit(data) {
      // 初始化表单数据（浅拷贝即可）
      Object.assign(this.editForm, data)
      this.title = "修改员工"

      this.drawer = true
    },
    beforeClose(done) {done()},
    handleSubmit() {},

    handleDelete() {},
    deleteBatch() {},
    handleSelectionChange() {},

    // ----- 表头样式 -----
    myTableStyle() {
      return "background-color: #f8f8f9; color: #515a6e;"
    }
  }
}
</script>

<style>
.employee-drawer__content {
  display: flex;
  flex-direction: column;
  padding: 0 20px 0 5px;
  overflow-y: auto;
}
.employeeQueryStyle {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
}
.paginationStyle {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px
}
.employeeFormStyle {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
}
</style>