<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane label="部门管理" name="department">
      <Department />
    </el-tab-pane>
    <el-tab-pane label="职位管理" name="position" :lazy="true">
      <Position />
    </el-tab-pane>
    <el-tab-pane label="职称管理" name="jobLevel" :lazy="true">
      <JobLevel />
    </el-tab-pane>
    <el-tab-pane label="奖惩规则" name="rewardPenalty" :lazy="true">
      <RewardPenalty />
    </el-tab-pane>
    <el-tab-pane label="权限管理" name="permission" :lazy="true">
      <Permission />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Department from "../../components/page/system/basic/Department"
import Position from "../../components/page/system/basic/Position"
import JobLevel from "../../components/page/system/basic/JobLevel"
import RewardPenalty from "../../components/page/system/basic/RewardPenalty";
import Permission from "../../components/page/system/basic/Permission";

export default {
  name: "SystemBasic",
  data() {
    return {
      activeName: 'department'
    }
  },

  components: {
    Permission,
    RewardPenalty,
    JobLevel,
    Position,
    Department,
  }
}
</script>

<style scoped>

</style>