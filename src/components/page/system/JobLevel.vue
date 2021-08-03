<template>
  <div>
    <el-form :inline="true">
      <el-form-item prop="levelName">
        <el-input size="small"
                  v-model="addLevel.name"
                  style="width: 200px;"
                  prefix-icon="el-icon-plus"
                  placeholder="添加职称..."
        />
      </el-form-item>
      <el-form-item prop="levelTitle">
        <el-select v-model="addLevel.titleLevel"
                   placeholder="职称等级"
                   clearable
                   size="small"
                   style="width: 150px;"
        >
          <el-option v-for="item in titleLevels"
                     :key="item"
                     :label="item"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus"
                   type="primary"
                   size="small"
                   @click="addJobLevel"
        >
          添加
        </el-button>
        <el-button type="danger"
                   size="small"
                   :disabled="multipleSelection.length === 0"
                   @click="deleteBatch"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-table :data="levels"
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
                         label="职称名称"
                         min-width="200"
                         header-align="center"
                         align="center"
        />
        <el-table-column  prop="titleLevel"
                          label="职称级别"
                          width="150"
                          header-align="center"
                          align="center"
        >
          <template slot-scope="scope">
            <el-tag>{{scope.row.titleLevel}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column  prop="createdate"
                          label="创建时间"
                          min-width="200"
                          header-align="center"
                          align="center"
        />
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
  name: "JobLevel",
  data() {
    return {
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级',
      ],
      multipleSelection: [],

      // 用于添加职称
      addLevel: {
        name: '',
        titleLevel: '',
      },
      levels: [],
    }
  },

  mounted() {
    this.initJobLevel()
  },

  methods: {

    // ----- 初始化数据 -----
    initJobLevel() {
      this.API.jobLevelGet().then(res => {
        if (res.success) {
          this.levels = res.data.list
        }
      })
    },

    // ----- 添加职称 -----
    addJobLevel() {
      if (this.addLevel.name && this.addLevel.titleLevel) {
        this.API.jobLevelAdd(this.addLevel).then(res => {
          if (res.success) {
            this.$message.success(res.message)
            this.initJobLevel()
          }
        })
      } else {
        if (!this.addLevel.name) {
          this.$message.error("职位名称不可为空")
        } else {
          this.$message.error("职称等级不可为空")
        }
      }
      this.addLevel = {
        name: '',
        titleLevel: '',
      }
    },

    showEdit() {
    },

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

<style scoped>

</style>