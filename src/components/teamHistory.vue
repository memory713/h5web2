<template>
  <div style="height:100%;width:100%;">
    <Sidebar/>
    <div style="" ref="openWindow" class="component-page">
      <div style="display:flex;justify-content:space-between;margin:50px 0 20px 0;">
        <div class="shaixuan">
          <div style="width:50px;margin-rignt:30px;color:#58595D;line-height:35px;">筛选：</div>
          <el-select v-model="tagid" filterable placeholder="请选择班组" style="margin-right:15px;">
            <el-option
              v-for="item in options"
              :key="item.tagid"
              :label="item.name"
              :value="item.tagid">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="value6"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            style="margin-right:15px;"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button icon="el-icon-search"  @click = "searchData()" circle ></el-button>
          <el-button type="primary" plain>重置</el-button>
        </div>
      </div>
      <div style="width:100%;margin-left:0%;">
        <template >
          <el-table :data="tableData" stripe border :default-sort = "{prop: 'date', order: 'descending'}" >
            <el-table-column prop="name" label="班组" sortable></el-table-column>
            <el-table-column prop="number" label="班组人数" sortable></el-table-column>
            <el-table-column prop="total"  label="班组总平均值" sortable>
              <template slot-scope="scope">
                {{scope.row.total | dataForm}}
               </template>
            </el-table-column>
            <el-table-column prop="culture" sortable  label="企业文化指数部门均值">
              <template slot-scope="scope">
                {{scope.row.culture | dataForm}}
               </template>
            </el-table-column>
            <el-table-column prop="study" sortable label="学习成长指数部门均值">
              <template slot-scope="scope">
                {{scope.row.study | dataForm}}
               </template>
            </el-table-column>
            <el-table-column prop="improve"  label="精益改善指数部门均值" sortable>
              <template slot-scope="scope">
                {{scope.row.improve | dataForm}}
               </template>
            </el-table-column><el-table-column prop="read"  label="读书指数部门均值" sortable>
              <template slot-scope="scope">
                {{scope.row.read | dataForm}}
               </template>
            </el-table-column>
            <el-table-column prop="hse" sortable label="HSE指数部门均值">
              <template slot-scope="scope">
                {{scope.row.hse | dataForm}}
               </template>
            </el-table-column>
            <el-table-column prop="attendance" sortable label="出勤指数部门均值">
              <template slot-scope="scope">
                {{scope.row.attendance | dataForm}}
               </template>
            </el-table-column>
            <el-table-column prop="createDate" sortable label="计算更新时间">
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
  name: 'departmentList',
  data () {
    return {
      count: 0,
      pageSize: 20,
      currentPage: 1,
      tableData: [],
      options: [],
      tagid:'',
      value6:''
    }
  },
  mounted(){
    this.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕 
      $(".component-page").width($(window).width()-340)
      $(".component-page").height($(window).height()-220)
      this.animatePage()
    });
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
  created () {
    this.getTagData()
    this.initData()
  },
  methods:{
    getTagData () {
      this.$http.get('/huoli/org/findGroupMap').then(({ data }) => {
        if (data) {
          this.options = [{tagid: '', name: '全部'}]
          this.options = this.options.concat(data)
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    searchData () {
      this.initData()
    },
    initData () {
      const params = {}
      params.tagid = this.tagid
      if(this.value6 && this.value6.length > 0){
        const date = this.$filter.setMonth(this.value6)
        params.startMonth = date.startMonth
        params.monthNub = date.monthNub
      }
      params.start = (this.currentPage - 1) * this.pageSize
      params.length = this.pageSize
      this.$http.get('/huoli/org/groupDataGrid', {params: params}).then(({ data }) => {
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
