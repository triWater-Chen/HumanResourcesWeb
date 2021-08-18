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
      <el-form-item class="editTree">
        <span slot="label" class="employeeQueryStyle">部门</span>
        <TreeSelect v-model="queryEmployee.departmentId"
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
                           show-overflow-tooltip
                           min-width="80"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="nativePlace"
                           label="籍贯"
                           show-overflow-tooltip
                           min-width="100"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="politicsStatus.name"
                           label="政治面貌"
                           show-overflow-tooltip
                           min-width="100"
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
          <el-table-column label="在职状态"
                           min-width="80"
                           header-align="center"
                           align="center"
          >
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.workState === '在职'">{{scope.row.workState}}</el-tag>
              <el-tag type="info" v-else>{{scope.row.workState}}</el-tag>
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
                  <el-option v-for="politics in politicsStatus"
                             :key="politics.id"
                             :label="politics.name"
                             :value="politics.id"
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

          <el-row class="editTree">
            <el-col :span="12">
              <el-form-item prop="departmentId">
                <span slot="label" class="employeeFormStyle">部门</span>
                <TreeSelect v-model="editForm.departmentId"
                            :options="departments"
                            :default-expand-level="2"
                            :clearable="true"
                            :normalizer="normalizer"
                            noResultsText="未查询到相关部门"
                            placeholder="请输入关键字"
                            style="width: 168px; margin-top: 5px; line-height: 34px;"
                />
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
                             :disabled="!position.enabled"
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
                             :disabled="!jobLevel.enabled"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="workState">
                <span slot="label" class="employeeFormStyle">在职状态</span>
                <el-select v-model="editForm.workState"
                           size="small"
                           style="width: 180px;"
                           :disabled="title === '添加员工'"
                >
                  <el-option v-for="workState in workStates"
                             :key="workState"
                             :label="workState"
                             :value="workState"
                  />
                </el-select>
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
            <el-form-item prop="engageForm">
              <span slot="label" class="employeeFormStyle">聘用形式</span>
              <el-radio-group v-model="editForm.engageForm">
                <el-radio label="劳动合同">劳动合同</el-radio>
                <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>
          <el-row>
          </el-row>

        </el-form>
        <el-form>
          <el-form-item style="text-align: center; margin-top: 5px;">
            <el-button @click="drawer = false" style="width: 150px">返 回</el-button>
            <el-button :loading="buttonLoading" type="primary" @click="handleSubmit" style="width: 150px">
              {{ buttonLoading ? '提交中...' : '提 交' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "PersonnelEmp",
  components: { TreeSelect },
  data() {

    // 表单验证
    let checkName = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入员工名'))
      } else {
        callback()
      }
    }
    let checkGender = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择性别'))
      } else {
        callback()
      }
    }
    let checkNativePlace = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入籍贯'))
      } else {
        callback()
      }
    }
    let checkNationId = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择民族'))
      } else {
        callback()
      }
    }
    let checkEmail = (rule, value, callback) => {
      const check = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (value === '' || value === undefined) {
        callback(new Error('请输入邮箱'))
      } else if (!check.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    let checkPhone = (rule, value, callback) => {
      const check = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (value === '' || value === undefined) {
        callback(new Error('请输入手机号'))
      } else if (!check.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    let checkBirthday = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择出生日期'))
      } else {
        callback()
      }
    }
    let checkIdCard = (rule, value, callback) => {
      const check = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
      if (value === '' || value === undefined) {
        callback(new Error('请输入身份证号'))
      } else if (!check.test(value)) {
        callback(new Error('身份证号格式不正确'))
      } else {
        callback()
      }
    }
    let checkPoliticId = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择政治面貌'))
      } else {
        callback()
      }
    }
    let checkTiptopDegree = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择最高学历'))
      } else {
        callback()
      }
    }
    let checkSchool = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入毕业院校'))
      } else {
        callback()
      }
    }
    let checkSpecialty = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入所属专业'))
      } else {
        callback()
      }
    }
    let checkWedlock = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择婚姻状况'))
      } else {
        callback()
      }
    }
    let checkAddress = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入联系地址'))
      } else {
        callback()
      }
    }
    let checkDepartmentId = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择部门'))
      } else {
        callback()
      }
    }
    let checkPositionId = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择职位'))
      } else {
        callback()
      }
    }
    let checkJobLevelId = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择职称'))
      } else {
        callback()
      }
    }
    let checkBeginDate = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择入职日期'))
      } else {
        callback()
      }
    }
    let checkConversionTime = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择转正日期'))
      } else {
        callback()
      }
    }
    let checkBeginContract = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择合同起始日期'))
      } else {
        callback()
      }
    }
    let checkEndContract = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择合同终止日期'))
      } else {
        callback()
      }
    }
    let checkEngageForm = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请选择聘用形式'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      buttonLoading: false,

      total: 0,
      queryEmployee: {
        current: 1,
        size: 12,
      },
      pageSize: 0,

      departments: [],
      positions: [],
      nations: [],
      politicsStatus: [],
      jobLevels: [],
      degrees: ['博士', '硕士', '本科', '大专', '高中', '初中', '小学', '其他'],
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

      rules: {
        name: [{validator: checkName, trigger: ['blur', 'change']}],
        gender: [{validator: checkGender, trigger: ['blur', 'change']}],
        nativePlace: [{validator: checkNativePlace, trigger: ['blur', 'change']}],
        nationId: [{validator: checkNationId, trigger: ['blur', 'change']}],
        email: [{validator: checkEmail, trigger: ['blur', 'change']}],
        phone: [{validator: checkPhone, trigger: ['blur', 'change']}],
        birthday: [{validator: checkBirthday, trigger: ['blur', 'change']}],
        idCard: [{validator: checkIdCard, trigger: ['blur', 'change']}],
        politicId: [{validator: checkPoliticId, trigger: ['blur', 'change']}],
        tiptopDegree: [{validator: checkTiptopDegree, trigger: ['blur', 'change']}],
        school: [{validator: checkSchool, trigger: ['blur', 'change']}],
        specialty: [{validator: checkSpecialty, trigger: ['blur', 'change']}],
        wedlock: [{validator: checkWedlock, trigger: ['blur', 'change']}],
        address: [{validator: checkAddress, trigger: ['blur', 'change']}],
        departmentId: [{validator: checkDepartmentId, trigger: ['blur', 'change']}],
        posId: [{validator: checkPositionId, trigger: ['blur', 'change']}],
        jobLevelId: [{validator: checkJobLevelId, trigger: ['blur', 'change']}],
        beginDate: [{validator: checkBeginDate, trigger: ['blur', 'change']}],
        conversionTime: [{validator: checkConversionTime, trigger: ['blur', 'change']}],
        beginContract: [{validator: checkBeginContract, trigger: ['blur', 'change']}],
        endContract: [{validator: checkEndContract, trigger: ['blur', 'change']}],
        engageForm: [{validator: checkEngageForm, trigger: ['blur', 'change']}],
      },
    }
  },

  mounted() {
    this.initEmployee()
    this.initDefaultData()
  },

  methods: {

    // ----- 初始化数据 -----
    initEmployee() {
      this.loading = true
      this.initVarData()
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
    // ----- 不常改变，能存入 session 的数据 -----
    initDefaultData() {
      if (!this.SessionStorage.get("nations")) {
        this.API.employeeOfNations().then(res => {
          if (res.success) {
            this.nations = res.data.nations
            this.SessionStorage.set("nations", res.data.nations)
          }
        })
      } else {
        this.nations = this.SessionStorage.get("nations")
      }
      if (!this.SessionStorage.get("politicsStatus")) {
        this.API.employeeOfPoliticsStatus().then(res => {
          if (res.success) {
            this.politicsStatus = res.data.politicsStatus
            this.SessionStorage.set("politicsStatus", res.data.politicsStatus)
          }
        })
      } else {
        this.politicsStatus = this.SessionStorage.get("politicsStatus")
      }
    },
    // ----- 常改变，刷新页面重新获取的数据 -----
    initVarData() {
      this.API.employeeOfPositions().then(res => {
        if (res.success) {
          this.positions = res.data.positions
        }
      })
      this.API.employeeOfJobLevels().then(res => {
        if (res.success) {
          this.jobLevels = res.data.jobLevels
        }
      })
      this.API.employeeOfDepartments().then(res => {
        if (res.success) {
          this.departments = res.data.departments
          this.deleteChildren(this.departments)
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
      this.initVarData()
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
    handleQuery() {
      this.loading = true
      this.API.employeeGet({
        params: this.queryEmployee
      }).then(res => {
        if (res.code === 200) {
          this.employees = res.data.list.records
          this.total = res.data.list.total
          this.pageSize = res.data.list.records.length
          this.$message.success(res.message)
        } else if (res.code === 500) {
          this.employees = []
          this.total = 0
          this.pageSize = 0
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // 重置查询表单
      this.resetForm()
    },

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
    // ----- 进行添加、修改员工 -----
    handleSubmit() {
      this.$refs.employeeForm.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (this.editForm.id === undefined) {
            // 进行添加

            this.API.employeeAdd(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success(res.message)
                this.initEmployee()
                this.drawer = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          } else {
            // 进行修改

            this.drawer = false
          }
        } else {
          return false
        }
      })
      this.buttonLoading = false
    },
    // ----- 关闭 drawer 之前进行提示 -----
    beforeClose(done) {
      this.$confirm('还有未保存的工作哦，确定关闭吗',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning'
          }).then(() => {
            done()
          }).catch(() => {})
    },

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
.editTree .vue-treeselect__menu {
  overflow-x: scroll !important;
}
.editTree .vue-treeselect div, .vue-treeselect span {
  box-sizing: content-box;
}
</style>