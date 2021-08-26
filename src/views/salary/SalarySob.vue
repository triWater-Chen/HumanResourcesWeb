<template>
  <div>
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
          <el-tooltip effect="dark" content="刷新" placement="top">
            <el-button icon="el-icon-refresh"
                       circle
                       size="mini"
                       @click="refreshSob"
            />
          </el-tooltip>
        </el-col>
      </el-row>

      <el-row>
        <el-table :data="sobs"
                  v-loading="loading"
                  stripe
                  size="small"
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
          <el-table-column prop="id"
                           label="编号"
                           width="60"
                           header-align="center"
                           align="center"
          />
          <el-table-column prop="name"
                           label="账套名称"
                           min-width="150"
                           header-align="center"
                           align="center"
                           sortable
          />
          <el-table-column  prop="basicSalary"
                            label="基本工资"
                            min-width="100"
                            header-align="center"
                            align="center"
                            sortable
          />
          <el-table-column  prop="bonus"
                            label="奖金"
                            min-width="100"
                            header-align="center"
                            align="center"
          />
          <el-table-column  prop="trafficSalary"
                            label="交通补助"
                            min-width="100"
                            header-align="center"
                            align="center"
          />
          <el-table-column  prop="lunchSalary"
                            label="午餐补助"
                            min-width="100"
                            header-align="center"
                            align="center"
          />
          <el-table-column label="养老金"
                           header-align="center"
                           align="center"
          >
            <el-table-column prop="pensionPer"
                             label="比率"
                             min-width="90"
                             header-align="center"
                             align="center"
            />
            <el-table-column prop="pensionBase"
                             label="基数"
                             min-width="90"
                             header-align="center"
                             align="center"
            />
          </el-table-column>
          <el-table-column label="公积金"
                           header-align="center"
                           align="center"
          >
            <el-table-column prop="accumulationFundPer"
                             label="比率"
                             min-width="90"
                             header-align="center"
                             align="center"
            />
            <el-table-column prop="accumulationFundBase"
                             label="基数"
                             min-width="90"
                             header-align="center"
                             align="center"
            />
          </el-table-column>
          <el-table-column label="医疗保险"
                           header-align="center"
                           align="center"
          >
            <el-table-column prop="medicalPer"
                             label="比率"
                             min-width="90"
                             header-align="center"
                             align="center"
            />
            <el-table-column prop="medicalBase"
                             label="基数"
                             min-width="90"
                             header-align="center"
                             align="center"
            />
          </el-table-column>
          <el-table-column  prop="createdate"
                            label="启用时间"
                            min-width="180"
                            header-align="center"
                            align="center"
          />
          <el-table-column label="操作"
                           header-align="center"
                           align="center"
                           min-width="180"
                           fixed="right"
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

    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="500px"
               center
    >
      <el-form>
        <el-steps :active="active" finish-status="success" align-center style="margin-bottom: 20px">
          <el-step title="基础工资"/>
          <el-step title="补贴"/>
          <el-step title="一险两金"/>
        </el-steps>

        <div v-show="active === 0" style="text-align: center">
          <el-form-item prop="name">
            <el-tag>职称名称</el-tag>
            <el-input v-model="editForm.name"
                      size="medium"
                      style="width: 345px; margin-left: 10px"
            />
          </el-form-item>
          <el-col :span="12">
            <el-form-item prop="basicSalary">
              <el-tag>基础工资</el-tag>
              <el-input-number v-model="editForm.basicSalary"
                               controls-position="right"
                               :min="2000"
                               :max="20000"
                               :step="500"
                               step-strictly
                               size="medium"
                               style="width: 120px; margin-left: 10px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="bonus">
              <el-tag>季度奖金</el-tag>
              <el-input-number v-model="editForm.bonus"
                               controls-position="right"
                               :min="1000"
                               :max="10000"
                               :step="500"
                               step-strictly
                               size="medium"
                               style="width: 120px; margin-left: 10px;"
              />
            </el-form-item>
          </el-col>
        </div>
        <div v-show="active === 1" style="text-align: center">
          <el-col :span="12">
            <el-form-item prop="trafficSalary">
              <el-tag>交通补助</el-tag>
              <el-input-number v-model="editForm.trafficSalary"
                               controls-position="right"
                               :min="200"
                               :max="1500"
                               :step="200"
                               step-strictly
                               size="medium"
                               style="width: 120px; margin-left: 10px;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="lunchSalary">
              <el-tag>午餐补助</el-tag>
              <el-input-number v-model="editForm.lunchSalary"
                               controls-position="right"
                               :min="200"
                               :max="1000"
                               :step="100"
                               step-strictly
                               size="medium"
                               style="width: 120px; margin-left: 10px;"
              />
            </el-form-item>
          </el-col>
        </div>
        <div v-show="active === 2" style="align-items: center">
          <el-row style="margin-bottom: 10px">
            <el-col :span="8" :offset="8">
              <el-tag>比率</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag>基数</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="1">
              <el-form-item prop="pensionPer">
                <span slot="label" class="sobFormStyle">养老金</span>
                <el-input-number v-model="editForm.pensionPer"
                                 :min="0.05"
                                 :max="1"
                                 :precision="2"
                                 :step="0.01"
                                 step-strictly
                                 size="small"
                                 style="width: 140px; margin-left: 10px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item prop="pensionBase">
                <el-input-number v-model="editForm.pensionBase"
                                 controls-position="right"
                                 :min="1000"
                                 :max="20000"
                                 :step="500"
                                 step-strictly
                                 size="small"
                                 style="width: 120px; margin-left: 10px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="1">
              <el-form-item prop="accumulationFundPer">
                <span slot="label" class="sobFormStyle">公积金</span>
                <el-input-number v-model="editForm.accumulationFundPer"
                                 :min="0.05"
                                 :max="1"
                                 :precision="2"
                                 :step="0.01"
                                 step-strictly
                                 size="small"
                                 style="width: 140px; margin-left: 10px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item prop="accumulationFundBase">
                <el-input-number v-model="editForm.accumulationFundBase"
                                 controls-position="right"
                                 :min="1000"
                                 :max="20000"
                                 :step="500"
                                 step-strictly
                                 size="small"
                                 style="width: 120px; margin-left: 10px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="medicalPer" style="margin-left: 4px">
                <span slot="label" class="sobFormStyle">医疗保险</span>
                <el-input-number v-model="editForm.medicalPer"
                                 :min="0.05"
                                 :max="1"
                                 :precision="2"
                                 :step="0.01"
                                 step-strictly
                                 size="small"
                                 style="width: 140px; margin-left: 10px;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-form-item prop="medicalBase">
                <el-input-number v-model="editForm.medicalBase"
                                 controls-position="right"
                                 :min="1000"
                                 :max="20000"
                                 :step="500"
                                 step-strictly
                                 size="small"
                                 style="width: 120px; margin-left: 10px;"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="preStep">{{ active === 0 ? '取 消' : '上一步' }}</el-button>
        <el-button :loading="buttonLoading" v-show="active === 2" size="medium" type="primary" @click="handleSubmit">{{ buttonLoading ? '提交中...' : '提 交'}}</el-button>
        <el-button :loading="buttonLoading" v-show="active !== 2" size="medium" type="primary" @click="handleSubmit">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalarySob",
  data() {
    return {
      loading: false,
      buttonLoading: false,
      dialogVisible: false,

      title: '',
      sobs: [],

      multipleSelection: [],
      ids: [],

      active: 0,
      editForm: {
        name: '',
        bonus: '',
        basicSalary: '',
        trafficSalary: '',
        lunchSalary: '',
        pensionPer: '',
        pensionBase: '',
        medicalPer: '',
        medicalBase: '',
        accumulationFundPer: '',
        accumulationFundBase: '',
      },

      rules: {},
    }
  },

  mounted() {
    this.initSob()
  },

  methods: {

    // ----- 初始化数据 -----
    initSob() {
      this.loading = true
      this.API.sobGet().then(res => {
        if (res.success) {
          this.sobs = res.data.list
        }
        this.loading = false
      })
    },

    // ----- 刷新数据 -----
    refreshSob() {
      this.loading = true
      this.API.sobGet().then(res => {
        if (res.success) {
          this.sobs = res.data.list
          this.$message.success("刷新成功")
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },


    // ----- 初始化添加按钮 -----
    handleAdd() {
      this.title = "添加账套"
      this.editForm = {
        name: '',
        basicSalary: 2000,
        bonus: 1000,
        trafficSalary: 200,
        lunchSalary: 200,
        pensionPer: 0.05,
        pensionBase: 1000,
        medicalPer: 0.05,
        medicalBase: 1000,
        accumulationFundPer: 0.05,
        accumulationFundBase: 1000,
      }

      this.active = 0
      this.dialogVisible = true
    },
    // ----- 初始化编辑按钮 -----
    showEdit(data) {
      this.title = "修改账套"
      Object.assign(this.editForm, data)

      this.active = 0
      this.dialogVisible = true
    },
    // ----- 点击上一步按钮 -----
    preStep() {
      if (this.active === 0) {
        this.dialogVisible = false
        return
      }
      this.active--
    },
    // ----- 进行添加、修改员工 -----
    handleSubmit() {
      if (this.active === 2) {

        if (this.editForm.name) {
          this.buttonLoading = true
          if (this.editForm.id === undefined) {
            // 进行添加

            this.API.sobAdd(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success(res.message)
                this.initSob()
                this.dialogVisible = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          } else {
            // 进行修改

            this.API.sobUpdate(this.editForm).then(res => {
              this.buttonLoading = false
              if (res.success) {
                this.$message.success(res.message)
                this.initSob()
                this.dialogVisible = false
              }
            }).catch(() => {
              this.buttonLoading = false
            })
          }
        } else {
          this.$message.error("职称名称不可为空")
        }
        return
      }
      this.active++
    },


    // ----- 删除工资账套 -----
    handleDelete(data) {
      this.$confirm('此操作将永久删除工资账套【' + data.name + '】, 是否继续?',
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
                this.API.sobRemoveBatch(deleteId).then(res => {
                  instance.confirmButtonLoading = false
                  if (res.success) {
                    this.initSob()
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
      this.$confirm('此操作将永久删除编号为【' + this.ids + '】的工资账套, 是否继续?',
          '提示',
          {
            confirmButtonText: '确 定',
            cancelButtonText: '取 消',
            type: 'warning',
            beforeClose: ((action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '删除中...'

                this.API.sobRemoveBatch(this.ids).then(data => {
                  instance.confirmButtonLoading = false
                  if (data.success) {
                    this.initSob()
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
.sobFormStyle {
  color: #515a6e;
  font-size: 14px;
  font-weight: bold;
  padding-left: 20px;
}
</style>