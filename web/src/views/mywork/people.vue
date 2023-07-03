<template>
  <div class="people">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input clearable v-model="formInline.keyword" placeholder="姓名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="getEmployeeAll">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" v-loading="loading" style="width: 100%">

      <el-table-column prop="eno" label="编号" width="180"> </el-table-column>

      <el-table-column prop="ename" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="dname" label="部门" width="180"> </el-table-column>
      <el-table-column prop="salary" label="工资"> </el-table-column>
    </el-table>
    <div class="pagination">

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.pageIndex"
      :page-sizes="[10, 20, 50]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    </div>
  </div>
</template>

<script>
import myworkApi from './api/mywork'
export default {
  data () {
    return {
      formInline: {
        keyword: ''
      },
      page: {
        total: 0,
        pageSize: 10,
        pageIndex: 1
      },
      tableData: [
      ],
      loading: false
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSizeChange (size) {
      this.page.pageSize = size
      this.getEmployeeAll()
    },
    handleCurrentChange (index) {
      this.page.pageIndex = index
      this.getEmployeeAll()
    },
    getEmployeeAll () {
      this.loading = true
      const { pageSize, pageIndex } = this.page
      myworkApi.getEmployeeAll({
        pageSize,
        pageIndex,
        keyword: this.formInline.keyword
      }).then((res) => {
        const { count, rows } = res.data.data
        this.tableData = rows
        this.page.total = count
      }).finally(() => {
        this.loading = false
      })
    }
  },
  created () {
    this.getEmployeeAll()
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  text-align: right;
  margin-top:10px;
  background: #fff;
    .el-pagination {
    padding-right: 0;
   }
}
.people {
  background: #fff;
  padding: 10px;
}
</style>
