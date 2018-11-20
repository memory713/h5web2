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
          <el-button icon="el-icon-search"  circle  @click = "searchData()"></el-button>
        </div>
        <el-button type="primary" style="height:40px;" round @click="refreshGroup()">更新数据</el-button>
      </div>
      <div style="width:100%;margin-left:0%;">
        <template >
          <el-table :data="tableData" stripe border :default-sort = "{prop: 'date', order: 'descending'}" >
            <el-table-column prop="name" label="班组"></el-table-column>
            <el-table-column prop="number" label="部门人数"></el-table-column>
            <el-table-column prop="createDate" sortable label="计算更新时间">
              <template slot-scope="scope">
                  {{scope.row.createDate | dataFilter}}
              </template>
            </el-table-column>
            <el-table-column prop="ignoreFlag" label="推送消息" >
              <template slot-scope="scope">
                <el-switch
                  @change="switchChange(scope.row)"
                  v-model="scope.row.ignoreFlag"
                  active-text="忽略"
                  inactive-text="不忽略"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
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
      options: [{tagid: '', name: '全部'}],
      tagid:''
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
    this.getGroupData()
  },
  methods:{
    getGroupData() {
      const params = {}
      params.havaIgnore = '1'
      this.$http.get('/huoli/org/findGroupMap', {params: params}).then(({ data }) => {
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
    switchChange (data) {
      const params = {}
      params.tagid = data.tagid
      params.ignoreFlag = data.ignoreFlag
      this.$http.get('/huoli/org/setGroupFlag', {params: params}).then(({ data }) => {
        if (data) {
          console.log(data)
          // this.initData()
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    refreshGroup () {
      this.$http.get('/huoli/wxData/refreshTag').then(({ data }) => {
        this.initData()
        this.getGroupData()
        if (data && data >= 0 ) {
          this.$notify.success({
            type: 'success',
            message: '现有班组' + data + '个'
          })
        }else if (data === 0 ) {
          this.$notify.success({
            type: 'error',
            message: '现有没有班组!'
          })
        } else {
          this.$notify.error({
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
      console.log(this.tagid)
      params.avg = '0'
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
.shaixuan{display: flex;width: 50%;}
    /deep/ .el-table th>.cell{color:#000;}
/deep/ .el-table{color:#000;}
</style>
