<template>
  <div class="page-content">
    <el-row :gutter="15">
      <el-col :xs="19" :sm="12" :lg="6">
        <el-input placeholder="请输入用户名搜索"></el-input>
      </el-col>
      <el-col :xs="4" :sm="12" :lg="4">
        <el-button v-ripple>搜索</el-button>
      </el-col>
    </el-row>

    <art-table :records="logList">
      <el-table-column label="用户名" prop="username" />
      <el-table-column label="ip地址" prop="ip" />
      <el-table-column label="浏览器" prop="browser" />
      <el-table-column label="请求耗时" prop="status" />
      <el-table-column label="日期" prop="create_time" />
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'

  const logList = reactive([
    {
      username: 'admin',
      gender: 0,
      ip: '143.133.312.563',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-07'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '143.133.312.563',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-07'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '143.133.312.563',
      browser: 'chrome',
      status: 0,
      create_time: '2025-05-07'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '143.133.312.563',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-07'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '143.133.312.563',
      browser: 'chrome',
      status: 0,
      create_time: '2025-05-07'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '127.133.145.545',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-06'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '156.133.313.756',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-06'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '131.133.234.424',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-06'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '167.133.355.534',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-06'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '234.133.545.533',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-06'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '245.567.313.890',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-04'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '235.789.313.345',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-04'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '214.133.313.543',
      browser: 'chrome',
      status: 0,
      create_time: '2025-05-04'
    },
    {
      username: 'admin',
      gender: 0,
      ip: '567.756.313.123',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-04'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '564.133.313.645',
      browser: 'chrome',
      status: 0,
      create_time: '2025-05-04'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '587.133.313.422',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-04'
    },
    {
      username: 'admin',
      gender: 1,
      ip: '571.133.313.423',
      browser: 'chrome',
      status: 1,
      create_time: '2025-05-04'
    }
  ])
</script>

<style lang="scss" scoped></style>
