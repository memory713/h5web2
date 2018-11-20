<template>
  <div style="height:100%;width:100%;">
    <Sidebar/>
    <div style="" ref="openWindow" class="component-page">
      <div style="display:flex;justify-content:space-between;margin:50px 0 20px 0;">
        <div class="shaixuan">
          <div style="width:50px;margin-rignt:30px;color:#58595D;line-height:35px;">筛选：</div>
          <div style="margin-right:15px;">
          <el-input
            placeholder="请输入账号"
            v-model="inputSearch"
            style="margin-right:30px;"
            clearable>
          </el-input>
          </div>
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
          <el-table :data="tableData" stripe border :default-sort = "{prop: 'date', order: 'descending'}" ><el-table-column prop="createDate" label="导入时间" sortable >
            <template slot-scope="scope">
                  {{scope.row.createDate | dataFilter}}
              </template>
          </el-table-column><el-table-column prop="Acount" label="导入账号" ></el-table-column><el-table-column prop="name"  label="文件名称"></el-table-column><el-table-column prop="month"  label="归属月份" sortable></el-table-column><el-table-column prop="status" sortable label="状态"></el-table-column>
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
  name: 'systemList',
  data () {
    return {
      count: 0,
      pageSize: 20,
      currentPage: 1,
      tableData: [],
      inputSearch: '',
      value6: []
    }
  },
  mounted(){
    this.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕 
      $(".component-page").width($(window).width()-340)
      $(".component-page").height($(window).height()-220)
      this.animatePage()
    })
  },
  filters: {
    dataFilter: function(date) {
      let data = ''
      if(date){
        data = date.split('T')[0]
      }
      return data
    }
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
      params.inputSearch = this.inputSearch
      params.start = (this.currentPage - 1) * this.pageSize
      params.length = this.pageSize
      if(this.value6 && this.value6.length > 0){
        const date = this.$filter.setMonth(this.value6)
        params.startMonth = date.startMonth
        params.monthNub = date.monthNub
      }
      params.relationType = 'xlsx'
      this.$http.get('/huoli/file/getFileDataGrid', {params: params}).then(({ data }) => {
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
.shaixuan{display: flex;width: 70%;}
/deep/ .el-table th>.cell{color:#000;}
/deep/ .el-table{color:#000;}

</style>
