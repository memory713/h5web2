<template>
  <div style="height:100%;width:100%;">
    <Sidebar/>
    <div style="" ref="openWindow" class="component-page">
      <div style="display:flex;margin:50px 0 20px 0;">
        <div class="shaixuan">
          <div style="width:50px;margin-rignt:30px;color:#58595D;line-height:35px;">筛选：</div>
          <div style="margin-right:15px;width:15%;">
            <el-input
              placeholder="请输入手机号码"
              v-model="mobile"
              clearable>
            </el-input>
          </div>
          <div style="margin-right:15px;width:12%;">
          <el-input
            placeholder="请输入姓名"
            v-model="username"
            clearable>
          </el-input>
          </div>
          <div style="margin-right:15px;">
          <el-input
            placeholder="请输入系统ID"
            v-model="userid"
            clearable>
          </el-input>
          </div>
          <div style="margin-right:15px;">
            <el-select v-model="deptType" filterable placeholder="请选择主部门" >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="margin-right:15px;">
            <el-select v-model="deptId" filterable placeholder="请选择子部门">
              <el-option
                v-for="item in options2"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div style="margin-right:15px;">
            <el-select v-model="deptId" filterable placeholder="请选择班组">
              <el-option
                v-for="item in options2"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
          
          <el-button icon="el-icon-search"  circle  @click = "searchData()"></el-button>
          <el-button type="primary" plain>重置</el-button>
        </div>
      </div>
      
      <div style="width:100%;margin-left:0%;">
        <template >
          <el-table :data="tableData" stripe border :default-sort = "{prop: 'date', order: 'descending'}" >
            <el-table-column prop="ignoreFlag" label="推送消息" >
              <template slot-scope="scope">
                <el-switch
                  @change="switchChange(scope.row)"
                  v-model="scope.row.ignoreFlag"
                  active-text="不发送"
                  inactive-text="发送"
                  active-value="1"
                  inactive-value="0">
                </el-switch>
              </template>           
            </el-table-column>
           <!--  <el-table-column prop="OpenID" label="微信id" sortable></el-table-column> -->
    <!--         <el-table-column prop="WeName" label="微信昵称" ></el-table-column> -->
            <el-table-column prop="name" sortable label="姓名"></el-table-column>
            <el-table-column prop="mobile" sortable label="手机号码">
            </el-table-column>
            <el-table-column prop="position" label="职位" ></el-table-column>
            <el-table-column prop="avatar" sortable label="微信头像">
              <template slot-scope="scope"><img  :src="scope.row.avatar" alt="" style="width: 40px;height: 40px"></template></el-table-column>
            <el-table-column prop="userid" sortable label="系统id"></el-table-column>
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
  name: 'wechatsList',
  data () {
    return {
      mobile: '',
      username: '',
      userid: '',
      count: 0,
      pageSize: 20,
      currentPage: 1,
      options: [{
        value: '',
        label: '全部'
      },{
        value: '01',
        label: '生产部门'
      }, {
        value: '02',
        label: '非生产部门'
      }],
      options2: [{
        value: '选项1',
        label: '子部门1'
      }, {
        value: '选项2',
        label: '子部门2'
      }],
      tableData: [],
      deptType: '',
      deptId: ''
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
    this.getDeptData()
  },
  methods:{
    getDeptData () {
      this.$http.get('/huoli/org/findDeptMap').then(({ data }) => {
        if (data) {
          this.options2 = [{id: '', name: '全部'}]
          this.options2 = this.options2.concat(data)
        } else {
          this.$message.error({
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
      params.deptType = this.deptType
      params.deptId = this.deptId
      params.mobile = this.mobile
      params.username = this.username
      params.userid = this.userid
      params.start = (this.currentPage - 1) * this.pageSize
      params.length = this.pageSize
      this.$http.get('/huoli/user/userDataGrid', {params: params}).then(({ data }) => {
        if (data) {
          this.tableData = data.rows
          this.count = data.count
        } else {
          this.$message.error({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    switchChange (data) {
      const params = {}
      params.userid = data.userid
      params.ignoreFlag = data.ignoreFlag
      this.$http.get('/huoli/user/setIgnoreFlag', {params: params}).then(({ data }) => {
        if (data) {
          console.log(data)
          // this.initData()
        } else {
          this.$message.error({
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
.shaixuan{display: flex;width: 100%;justify-content: space-around;}
    /deep/ .el-table th>.cell{color:#000;}
/deep/ .el-table{color:#000;}
</style>
