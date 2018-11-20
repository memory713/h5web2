<template>
  <div style="height:100%;width:100%;">
    <Sidebar/>
    <div style="" ref="openWindow" class="component-page">
      <div style="display:flex;justify-content:space-between;margin:50px 0 20px 0;">
        <div class="shaixuan">
          
          <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            style="margin-right:15px;"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button icon="el-icon-search" @click = "searchData()" circle></el-button>
          <el-button type="primary" plain>重置</el-button>
        </div>
      </div>
      <div style="width:100%;margin-left:0%;">
        <template >
          <el-table :data="tableData" stripe border :default-sort = "{prop: 'date', order: 'descending'}" ><el-table-column prop="total" label="公司平均值" sortable></el-table-column></el-table-column><el-table-column prop="personNub"  label="统计公司总人数" sortable></el-table-column><el-table-column prop="month" label="指数月份" sortable></el-table-column><el-table-column prop="culture" sortable  label="企业文化平均指数">
            <template slot-scope="scope">
                {{scope.row.culture | dataForm}}
               </template>
          </el-table-column><el-table-column prop="study" sortable label="学习成长平均指数">
            <template slot-scope="scope">
                {{scope.row.study | dataForm}}
               </template>
          </el-table-column><el-table-column prop="improve"  label="精益改善平均指数" sortable>
            <template slot-scope="scope">
                {{scope.row.improve | dataForm}}
               </template>
          </el-table-column><el-table-column prop="read"  label="读书平均指数" sortable>
            <template slot-scope="scope">
                {{scope.row.read | dataForm}}
               </template>
          </el-table-column><el-table-column prop="hse" sortable label="HSE平均指数">
            <template slot-scope="scope">
                {{scope.row.hse | dataForm}}
               </template>
          </el-table-column><el-table-column prop="attendance" sortable label="出勤平均指数">
            <template slot-scope="scope">
                {{scope.row.attendance | attendance}}
               </template>
          </el-table-column></el-table-column><el-table-column prop="createDate" sortable label="计算更新时间">
            <template slot-scope="scope">
                {{scope.row.createDate | dataFilter}}
            </template>
          </el-table-column>
          </el-table>
        </template>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        style="margin-top:20px;"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count">
      </el-pagination>
 
    </div>
 
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'totalHistory',
  data () {
    return {
      count: 0,
      pageSize: 20,
      currentPage: 1,
      tableData: [],
      value6:''
    }
  },
  filters: {
    dataForm: function(date) {
      let data = ''
      if(date){
        data = date.toFixed(2)
      }
      return data
    },
    dataFilter: function(date) {
      let data = ''
      if(date){
        data = date.split('T')[0]
      }
      return data
    }
  },
  mounted(){
    this.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕 
      $(".component-page").width($(window).width()-340)
      $(".component-page").height($(window).height()-220)
      this.animatePage()
    });
  },
  created () {
    this.initData()
  },
  methods:{
    searchData () {
      this.initData()
    },
    initData () {
      const params = {}
      if(this.value6 && this.value6.length > 0){
        const date = this.$filter.setMonth(this.value6)
        params.startMonth = date.startMonth
        params.monthNub = date.monthNub
      }
      params.relationType = 'company'
      params.start = (this.currentPage - 1) * this.pageSize
      params.length = this.pageSize
      this.$http.get('/huoli/data/dataResultGrid', {params: params}).then(({ data }) => {
        if (data) {
          this.tableData = data.rows
          this.count = data.count
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    animatePage(){
      $(".component-page").animate({
      　　"opacity":"1",
      　　"left":"220px"
      },500);
    },
    handleSizeChange (val) {
      this.currentPage = val
      this.initData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.shaixuan{display: flex;width: 80%;}
    /deep/ .el-table th>.cell{color:#000;}
/deep/ .el-table{color:#000;}
</style>
