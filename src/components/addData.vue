<template>
  <div style="height:100%;width:100%;">
    <Sidebar/>
    <div style="" ref="openWindow" class="component-page">
      <div style="display:flex;">
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :headers="headers"
        :data="upLoadData"
        :on-success="uploadImg"
        :before-upload="beforeUpload"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过1M</div>
      </el-upload>
      <div style="margin-left:50px;margin-top:20px;">
        <el-date-picker
          v-model="valueMonth"
          type="month"
          style="margin-right:30px;"
          placeholder="指数归属月份">
        </el-date-picker>
        <el-button @click = "setResultData()" style="background-color:#83C0EF;color:#fff;">计算</el-button>
        <el-button @click="sendMsg()" style="background-color:#99C794;color:#fff;">推送</el-button>
        <el-button @click="getExcel()" style="background-color:#99C794;color:#fff;">原始表单</el-button>
      </div>
    </div>
      <!-- 筛选 -->

      <div class="shaixuan">
        <div style="width:50px;margin-rignt:30px;color:#58595D;line-height:35px;">筛选：</div>
        <div style="width:30%;margin-right:30px;">
        <el-input
          placeholder="请输入姓名"
          v-model="inputSearch"
          style="margin-right:30px;"
          >
        </el-input>
        </div>
        <el-date-picker
          v-model="value6"
          type="daterange"
          range-separator="至"
          format=" yyyy-MM"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>

        <el-button icon="el-icon-search"  @click = "searchData()" circle style="margin-left:30px;"> </el-button>
        <el-button type="primary" plain>重置</el-button>
      </div>

      <div style="width:100%;margin-left:0%;">
        <template >
          <el-table
            :data="tableData"
            stripe
            border
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
            <el-table-column
              prop="month"
              label="日期"
              sortable
              >
            </el-table-column>
            <el-table-column
              prop="userName"
              label="姓名"
              >
            </el-table-column>
            <el-table-column
              prop="read"
              sortable
              label="读书指数">
            </el-table-column>
            <el-table-column
              prop="study"
              sortable
              label="学习成长">
            </el-table-column>
            <el-table-column
              prop="attendance"
              sortable
              label="出勤指数">
            </el-table-column>
            <el-table-column
              prop="hse"
              sortable
              label="HSE">
            </el-table-column>
            <el-table-column
              prop="culture"
              sortable
              label="企业文化">
            </el-table-column>
            <el-table-column
              label="精益改善"
              prop="improve">
            </el-table-column><!-- 
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button disabled
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              </template> -->
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
  name: 'addData',
  data () {
    return {
      uploadUrl: 'http://www.whchlor-alkali.com:8083/huoli/file/upload',
      headers: {
        loginUuid: this.$service.localStorage.get('loginUuid')
      },
      upLoadData: {month: null},
      pageSize: 10,
      time: this.$store.state.today.month,
      tableData0: {},
      tableData: [],
      count: 0,
      valueMonth: '',
      inputSearch:'',
      currentPage:1,
      content:'上月活跃指数已发发布',
      showDialog: false,
      value6:''
    }
  },
  created () {
    let now = new Date()
    let yearDate = now.getFullYear()
    let monthDate = now.getMonth()
    this.upLoadData.month = yearDate + '-'+ monthDate
    this.time  = yearDate + '-'+ monthDate
    // this.valueMonth = yearDate + '-'+ monthDate
    // this.getResturants()
  },
  mounted(){
    this.$nextTick(() => {
      $(".component-page").width($(window).width()-340)
      $(".component-page").height($(window).height()-220)
      this.animatePage()
    })
  },
  watch:{
    valueMonth:function() {
      if(this.valueMonth && this.valueMonth.getFullYear()){
        var datetime=this.valueMonth.getFullYear() + '-' + (this.valueMonth.getMonth() + 1)
        this.time = datetime
        this.upLoadData.month = this.time
      }
      // this.getResturants()
    }
  },
  methods:{
    searchData () {
      this.getResturants()
    },
    getResturants() {
      const params = {}
      if(this.value6 && this.value6.length > 0){
        const date = this.$filter.setMonth(this.value6)
        params.startMonth = date.startMonth
        params.monthNub = date.monthNub
      }
      // params.month = this.time
      params.inputSearch = this.inputSearch
      params.start = (this.currentPage - 1) * this.pageSize
      params.length = this.pageSize
      //展示源数据
      this.$http.get('/huoli/data/dataDataGrid', {params: params}).then(({ data }) => {
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
    uploadImg (res, file) {
      if (res.id) {
        this.getResturants()
      } else {
        this.$message.error('上传图片失败！')
      }
    },

    getExcel() {
      this.$http.get('/huoli/file/getExcel', {
        responseType: 'arraybuffer'
      }).then(({ response }) => {
        var blob = new Blob([response.data], {type:'application/vnd.ms-excel'})

        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE10
          navigator.msSaveBlob(blob, '活力指数.xls')
        } else {
          //  chrome/firefox
          let link = document.createElement('a')
          link.download = '活力指数.xls' //item.name
          link.href = URL.createObjectURL(blob)
          /*link.click()
          URL.revokeObjectURL(link.href)*/

           //此写法兼容可火狐浏览器
          document.body.appendChild(link);
          var evt = document.createEvent("MouseEvents")
          evt.initEvent("click", false, false)
          link.dispatchEvent(evt)
          document.body.removeChild(link)
        }

       /* var link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = '活力指数.xls' //item.name
        link.click()*/
      })
    },
    sendMsg() {
      this.$prompt( this.time ,'推送信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: this.content
      }).then(({ value }) => {
        this.content = value
        const params = {}
        params.content = value
        params.month = this.time
        this.$http.get('/huoli/wxData/sendMsg', {params: params}).then(({ data }) => {
          if (data) {
            this.$message.success({
              type: 'success',
              message: '发送成功'
            })
          } else {
            this.$message.error({
              type: 'error',
              message: data.message
            })
          }
        })
      }).catch(() => {

      })
    },
    setResultData(){
      const params = {}
      params.month = this.time
      //展示处理数据
      this.$http.get('/huoli/data/setAverageData', {params: params}).then(({ data }) => {
        if (data) {
          this.$message.success({
            type: 'success',
            message: '计算成功'
          })
        } else {
          this.$message.error({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    beforeUpload (file) {
      let filename = file.name
      let arr = filename.split('.')
      const isRightType = ['xlsx', 'xls'].includes(arr[1])
      if (!isRightType) {
        this.$message.error('只能上传Excel!')
      }
      let haveMonth = true
      if (!this.valueMonth) {
        this.$message.error('指数归属月份不能为空!')
        haveMonth = false
      }
      return isRightType&&haveMonth
    },
    animatePage(){
      $(".component-page").animate({
      　　"opacity":"1",
      　　"left":"220px"
      },500);
    },
    handleSizeChange (val) {
      this.currentPage = val
      this.getResturants()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getResturants()
    },
    handleEdit(index, row) {
      var that = this
      this.tableData0 = row
      const h = this.$createElement
        this.$msgbox({
          title: '修改',
          message: "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>日期:</span><input disabled value='"  +that.tableData0.month  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>" + "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>姓名:</span><input disabled value='"  +that.tableData0.userName  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>"+"<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>读书指数:</span><input value='"  +that.tableData0.read  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>" + "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>学习成长:</span><input value='"  +that.tableData0.study  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>" + "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>出勤指数:</span><input value='"  +that.tableData0.attendance  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>" + "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>HSE:</span><input value='"  +that.tableData0.hse  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>"+"<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>企业文化:</span><input value='"  +that.tableData0.culture  +"' style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>",
          dangerouslyUseHTMLString:true,
          // <el-form ref="ableData0" :model="tableData0" label-width="80px">
    //   <el-form-item label="活动名称">
    //     <el-input v-model="tableData0.Name"></el-input>
    //   </el-form-item>
    // </el-form>
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            console.log(instance)
            console.log(done)
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '执行中...'
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300)
              }, 3000)
            } else {
              done()
            }
          }
        }).then(action => {
          this.$message({
            type: 'info',
            message: 'action: ' + action
          })
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tan-name{width:50px;display: inline-block;text-align: right;}
.shaixuan{display: flex;width: 70%;margin:50px 0 20px 0;}
/deep/ .el-upload-dragger{width: 180px;height: 90px}
/deep/ .el-upload-dragger .el-icon-upload{margin: 20px 0 16px;}
    /deep/ .el-table th>.cell{color:#000;}
/deep/ .el-table{color:#000;}
</style>
