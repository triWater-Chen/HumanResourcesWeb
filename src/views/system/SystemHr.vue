<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input size="small"
                  clearable
                  v-model="queryHr.username"
                  style="width: 150px;"
                  prefix-icon="el-icon-search"
                  placeholder="请输入用户名"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-input size="small"
                  clearable
                  v-model="queryHr.name"
                  style="width: 150px;"
                  prefix-icon="el-icon-search"
                  placeholder="请输入昵称"
                  @keydown.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryHr.enabled"
                   placeholder="用户状态"
                   clearable
                   size="small"
                   style="width: 100px;"
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
                v-loading="loading"
                stripe
                size="small"
                ref="hrTableRef"
                row-key="id"
                :expand-row-keys="expandKeys"
                @cell-click="handleClick"
                style="font-size: 13px;"
                :header-cell-style="myTableStyle"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="tableExpand">
              <el-form-item label="用户名">
                <span>{{ props.row.username }}</span>
              </el-form-item>
              <el-form-item label="昵称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="手机号码">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="座机号">
                <span>{{ props.row.telephone }}</span>
              </el-form-item>
              <el-form-item label="联系地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="备注">
                <span>{{ props.row.remark }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="username"
                         label="用户名"
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
                       v-if="scope.row.id !== 3"
            />
            <el-switch v-model="scope.row.enabled"
                       disabled
                       v-else
            />
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         header-align="center"
                         align="center"
                         min-width="180"
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
                       v-if="scope.row.id !== 3"
            >
              删除
            </el-button>
            <el-dropdown size="small"
                         type="text"
                         @command="(command) => commandHandler(command, scope.row)"
                         class="hrDropdown"
            >
              <span class="el-dropdown-link">
                <i class="el-icon-d-arrow-right el-icon--right"></i><span style="margin-left: 5px;">更多</span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="handleRole" icon="el-icon-s-operation" >分配角色</el-dropdown-item>
                <el-dropdown-item command="handlePassword" icon="el-icon-key" >重置密码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 自定义抽屉组件，用于分配角色 -->
    <AssignRoles :hr-info="hrInfo"
                 :visible="drawer"
                 :roles-table="rolesTable"
                 :default-id="defaultId"
                 @close="drawerClose"
    />
    <!-- 对话框 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               center
               width="550px"
    >
      <el-form label-width="70px"
               ref="hrForm"
               :model="editForm"
               :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="username">
              <span slot="label" class="hrFormStyle">用户名</span>
              <el-input v-model="editForm.username"
                        clearable
                        placeholder="请输入用户名"
                        maxlength="12"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone">
              <span slot="label" class="hrFormStyle">手机号</span>
              <el-input v-model="editForm.phone"
                        clearable
                        placeholder="请输入手机号"
                        maxlength="11"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 此处不能使用 v-show，会导致出现 password 字段，引发表单校验 -->
        <el-row v-if="editForm.id === undefined">
          <el-col :span="12">
            <el-form-item prop="password">
              <span slot="label" class="hrFormStyle">密码</span>
              <el-input v-model="editForm.password"
                        show-password
                        type="password"
                        placeholder="请输入密码"
                        maxlength="20"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="passwordConfirm">
              <span slot="label" class="hrFormStyle">确认</span>
              <el-input v-model="editForm.passwordConfirm"
                        clearable
                        type="password"
                        placeholder="请再次输入密码"
                        maxlength="20"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="name">
              <span slot="label" class="hrFormStyle">昵称</span>
              <el-input v-model="editForm.name"
                        clearable
                        placeholder="请输入昵称"
                        maxlength="12"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="座机号" prop="telephone">
              <el-input v-model="editForm.telephone"
                        clearable
                        placeholder="请输入座机号"
                        maxlength="12"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="editForm.address"
                        clearable
                        placeholder="请输入联系地址"
                        maxlength="15"
                        style="width: 160px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-switch v-model="editForm.enabled"
                         active-text="启用"
                         inactive-text="禁用"
                         v-if="editForm.id !== 3"
              />
              <el-switch v-model="editForm.enabled"
                         disabled
                         active-text="启用"
                         inactive-text="禁用"
                         v-else
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="editForm.remark"
                        clearable
                        placeholder="请输入备注内容"
                        type="textarea"
                        :autosize="{minRows: 2, maxRows: 2}"
                        maxlength="40"
                        show-word-limit
                        style="width: 415px;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="buttonLoading" type="primary" @click="handleForm">{{ buttonLoading ? '提交中...' : '确 定' }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {addDateRange} from "../../utils/commonTools";
import AssignRoles from "../../components/page/system/Others/AssignRoles";

export default {
  name: "SystemHr",
  components: {AssignRoles},
  data() {

    // 表单验证
    let checkUserName = (rule, value, callback) => {
      const check = /^[A-Za-z][a-zA-Z0-9]\w{0,10}$/
      if (value === '' || value === undefined) {
        callback(new Error('请输入用户名'))
      } else if (!check.test(value)) {
        callback(new Error('必须以英文开头，且为英文或数字'))
      } else {
        callback()
      }
    }
    let checkName = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请输入昵称'))
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
    let checkTelePhone = (rule, value, callback) => {
      const check = /^0\d{2,3}-\d{7,8}$/
      if (!check.test(value) && value !== undefined) {
        if (value === null || value === '') {
          callback()
        } else {
          callback(new Error('座机号码格式不正确'))
        }
      } else {
        callback()
      }
    }
    let checkPassword = (rule, value, callback) => {
      const check = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[.!@#$%^&*? ]).*$/
      if (value === '' || value === undefined) {
        callback(new Error('请输入密码'))
      } else if (!check.test(value)) {
        callback(new Error('密码格式不正确'))
      } else {
        if (this.editForm.passwordConfirm !== '' || this.editForm.passwordConfirm !== undefined) {
          this.$refs.hrForm.validateField('passwordConfirm')
        }
        callback()
      }
    }
    let checkPasswordConfirm = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      buttonLoading: false,

      // 用于查询
      queryHr: {},
      dateRange: [],

      // 用于实现手风琴效果
      // 要展开的行，数值的元素是 row 的 id 值
      expandKeys: [],

      hrs: [],
      title: '',
      dialogVisible: false,

      editForm: {
        enabled: true,
        name: '',
        username: '',
        phone: '',
        telephone: '',
        address: '',
        userFace: '',
        remark: '',
      },

      drawer: false,
      hrInfo: [],
      rolesTable: [],
      defaultId: [],

      // 表单校验
      rules: {
        username: [{validator: checkUserName, trigger: ['blur', 'change']}],
        name: [{validator: checkName, trigger: ['blur', 'change']}],
        phone: [{validator: checkPhone, trigger: ['blur', 'change']}],
        telephone: [{validator: checkTelePhone, trigger: ['blur', 'change']}],
        password: [{validator: checkPassword, trigger: ['blur', 'change']}],
        passwordConfirm: [{validator: checkPasswordConfirm, trigger: ['blur', 'change']}]
      }
    }
  },

  mounted() {
    this.initHr()
  },

  methods: {

    // ----- 初始化数据 -----
    initHr() {
      this.loading = true
      this.API.hrGet().then(res => {
        if (res.success) {
          this.hrs = res.data.list
        }
        this.loading = false
      })
    },

    // ----- 点击单元格触发手风琴样式的展开收起 -----
    handleClick(row, column) {
      if (column.label === "用户名" || column.label === "用户头像") {
        if (this.expandKeys.length === 0 || this.expandKeys.toString() !== row.id.toString()) {
          this.expandKeys = []
          this.expandKeys.push(row.id)
        } else {
          this.$refs.hrTableRef.toggleRowExpansion('')
          this.expandKeys = []
        }
      }
    },

    // ----- 刷新数据 -----
    refreshHr() {
      this.loading = true
      this.API.hrGet().then(res => {
        if (res.success) {
          this.hrs = res.data.list
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
      this.API.hrGet({
        params: addDateRange(this.queryHr, this.dateRange)
      }).then(res => {
        if (res.code === 200) {
          this.hrs = res.data.list
          this.$message.success(res.message)
        } else if (res.code === 500) {
          this.hrs = []
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      // 重置查询表单
      this.queryHr = {}
      this.dateRange = []
    },

    // ----- 修改用户状态 -----
    handleStatus(data) {
      const text = data.enabled === true ? "启用" : "停用"
      this.$confirm('确定要"' + text + '"用户【' + data.name + '】吗?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = text + '中...'

                this.API.hrUpdate(data).then(res => {
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
    showAdd() {
      // 初始化表单数据（因为用了表单校验，所以需要先定义字段）
      this.editForm = {
        id: undefined,
        enabled: true,
        username: undefined,
        phone: undefined,
        telephone: undefined,
        name: undefined,
        address: undefined,
        remark: undefined,
        password: undefined,
        passwordConfirm: undefined,
      }
      this.title = "添加用户"

      this.dialogVisible = true
    },
    // ----- 初始化修改按钮 -----
    showEdit(data) {
      // 初始化表单数据（浅拷贝即可）
      Object.assign(this.editForm, data)
      this.title = "修改用户"

      this.dialogVisible = true
    },
    // ----- 添加、修改用户 -----
    handleForm() {
      this.$refs.hrForm.validate(valid => {
        if (valid) {
          this.buttonLoading = true
          if (this.editForm.id === undefined) {
            // 进行添加

            // 删除确认密码字段
            delete this.editForm.passwordConfirm
            this.API.hrAdd(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success(res.message)
                this.initHr()
                this.dialogVisible = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          } else {
            // 进行修改

            this.API.hrUpdate(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success(res.message)
                this.initHr()
                this.dialogVisible = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        } else {
          return false
        }
      })
    },


    // ----- 删除用户 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除用户【' + data.name + '】, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '删除中...'

                this.API.hrRemove(data.id).then(res => {
                  instance.confirmButtonLoading = false
                  if (res.success) {
                    this.initHr()
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


    // ----- 更多操作触发 -----
    commandHandler(param, row){
      if (param === "handleRole") {
        // 进行分配角色
        this.resetRole(row)
      }
      if (param === "handlePassword") {
        this.resetPassword(row)
      }
    },
    // ----- 分配角色 -----
    resetRole(data) {
      this.drawer = true
      this.hrInfo = {
        id: data.id,
        username: data.username,
        name: data.name
      }
      this.getHrWithRole(data.id)

    },
    // ----- 重置密码 -----
    resetPassword(data) {
      this.$prompt('请输入用户【' + data.username + '】的新密码', "提示", {
        confirmButtonText: "确 定",
        cancelButtonText: "取 消",
        closeOnClickModal: false,
        inputPattern: /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[.!@#$%^&*? ]).*$/,
        inputErrorMessage: "用户密码至少6位，且包含大小写字母、数字和标点符号",
        beforeClose: ((action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '密码重置中...'

            this.API.hrResetPassword({
              id: data.id,
              password: instance.inputValue
            }).then(res => {
              instance.confirmButtonLoading = false
              if (res.success) {
                this.$message.success(res.message)
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

    // ----- 关闭 drawer -----
    drawerClose() {
      this.defaultId = []
      this.drawer = false
    },
    // ----- 根据 id 查询该用户所拥有的角色 -----
    getHrWithRole(id) {
      const tagLoading = this.$loading({
        fullscreen: false,
        text: '正在获取详情...',
        background: 'rgba(255, 255, 255, 0.4)',
        target: document.querySelector(".hrTags")
      })
      this.API.hrWithRole(id).then(res => {
        if (res.success) {
          // 整合默认勾选角色
          res.data.roles.forEach(item => {
            this.defaultId.push(item.id)
          })

          // 获取所有角色
          this.getAllEnabledRoles()
          tagLoading.close()
        }
      })
    },
    // ----- 查询所有可用角色 -----
    getAllEnabledRoles() {
      const queryRole = {
        current: 1,
        size: 100
      }
      this.API.roleGet({
        params: queryRole
      }).then(res => {
        if (res.success) {
          this.rolesTable = res.data.list.records
        }
      })
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
.hrFormStyle {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
  padding-left: 10px;
}
.hrDropdown .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
  margin-left: 5px;
}
</style>