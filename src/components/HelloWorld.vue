<template>
  <div style="height:100%;width:100%;">
    <Sidebar/>
    <div style="" ref="openWindow" class="component-page">
      <div class="title1">{{time}}各项指数统计  
        <div style="position:absolute;right:20px;top:0;">
          <el-date-picker
            v-model="valueMonth"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </div> 
      </div> 
      <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
        <div id="myChart" :style="{width: '40%', height: '400px'}"></div>
        <div id="myChart2" :style="{width: '60%', height: '400px'}"></div>
      </div>
      <div class="title1">
        {{timeYear}}年各项指数值
        <div style="position:absolute;right:20px;top:0;">
          <el-date-picker
            v-model="valueYear"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
        <div id="myChart3" :style="{width: '70%', height: '500px'}"></div>
        <div class="ranking-all">
          <div class="ranking-all-title" style=""><span>公司总排名</span><span>总值</span></div>
          <ul class="ranking-all-ul">
            <li v-for="(item,index) in rankData1" style="display:flex;justify-content:space-between;">
              <span>第{{index+1}}名： {{item.name}}</span>
              <span>{{item.sumData}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="title1" >{{time2}}部门排名  
        <div style="position:absolute;right:20px;top:0;">
          <el-date-picker
            v-model="valueMonth2"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </div> 
      </div> 

      <div style="display:flex;justify-content:space-between;">
        <div style="border-radius:10px;overflow:hidden;border:1px solid #E9ECF3;width:48%;">
          <div class="part3-title" style="">生产部门</div>
          <template>
            <el-table :data="deptData1" stripe border :default-sort = "{prop: 'date', order: 'descending'}" ><el-table-column prop="rank" label="排名" ></el-table-column><el-table-column prop="name" label="姓名" ></el-table-column><el-table-column prop="culture"  label="企业文化指数"></el-table-column><el-table-column prop="study"  label="学习成长指数"></el-table-column><el-table-column prop="improve"  label="精益改善指数" ></el-table-column><el-table-column prop="read"  label="读书指数" ></el-table-column><el-table-column prop="hse"  label="HSE指数"></el-table-column><el-table-column prop="attendance"  label="出勤指数"></el-table-column><el-table-column prop="avg"  label="平均指数"></el-table-column>
            </el-table>
          </template>
        </div>
        <div style="border-radius:10px;overflow:hidden;border:1px solid #E9ECF3;width:48%;">
          <div class="part3-title" style="">非生产部门</div>
          <template>
            <el-table :data="deptData2" stripe border :default-sort = "{prop: 'date', order: 'descending'}" ><el-table-column prop="rank" label="排名" ></el-table-column><el-table-column prop="name" label="姓名" ></el-table-column><el-table-column prop="culture"  label="企业文化指数"></el-table-column><el-table-column prop="study"  label="学习成长指数"></el-table-column><el-table-column prop="improve"  label="精益改善指数" ></el-table-column><el-table-column prop="read"  label="读书指数" ></el-table-column><el-table-column prop="hse"  label="HSE指数"></el-table-column><el-table-column prop="attendance"  label="出勤指数"></el-table-column><el-table-column prop="avg"  label="平均指数"></el-table-column>
            </el-table>
          </template>
        </div>
      </div>
      <div class="title1" style="margin-top:50px;">
        {{timeYear}}年班组活力指数走势图
        <div style="position:absolute;right:20px;top:0;">
          <el-select v-model="tagValue" placeholder="请选择">
            <el-option
              v-for="item in tagOptions"
              :key="item.tagid"
              :label="item.name"
              :value="item.tagid">
            </el-option>
          </el-select>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:30px;">
        <div id="myChart4" :style="{width: '60%', height: '500px'}"></div>
        <div id="myChart5" :style="{width: '40%', height: '600px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  name: 'HelloWorld',
  data () {
    return {
      time: '',
      valueMonth: '',
      dataChart1: [],
      dataChart2: [],
      timeYear: '',
      valueYear: '',
      seriesData: [],
      rankData1: [],
      tagOptions: [],
      tagValue: '1',
      time2: '',
      valueMonth2: '',
      deptData1: [],
      deptData2: [],
      seriesData2: [],
      dataChart3: []
    }
  },
  watch:{
    valueMonth:function(){
      if(this.valueMonth && this.valueMonth.getFullYear()){
        var datetime=this.valueMonth.getFullYear() + '-' + (this.valueMonth.getMonth() + 1)
        this.time = datetime
        this.initData()
      }
    },
    valueYear: function() {
      if(this.valueYear && this.valueYear.getFullYear()){
        this.timeYear = this.valueYear.getFullYear()
        this.yearData()
        this.getTagData()
      }
    },
    valueMonth2:function(){
      if (this.valueMonth2 && this.valueMonth2.getFullYear()) {
        var datetime=this.valueMonth2.getFullYear() + '-' + (this.valueMonth2.getMonth() + 1)
        this.time2 = datetime
        this.findDeptRank()
      }
    },
    tagValue:function(){
      this.getTagData()
    }
  },
  created () {
    let now = new Date()
    let yearDate = now.getFullYear()
    let monthDate = now.getMonth()
    const today = {}
    today.year = yearDate
    today.month = yearDate + '年'+ monthDate +"月"
    today.monthDate = yearDate + '-'+ monthDate
    console.log(today.monthDate)

    this.time = today.monthDate
    this.valueMonth = today.monthDate
    this.timeYear = today.year
    this.valueYear = today.monthDate
    this.time2 = today.monthDate
    this.valueMonth2 = today.monthDate
 
    this.initData()
    this.yearData()
    this.findGroupMap()
    this.findDeptRank()
  },
  mounted(){
    this.$nextTick(() => {
      $(".component-page").width($(window).width()-340)
      $(".component-page").height($(window).height()-220)
      this.animatePage()
    });
    // openWindow
  },
  methods:{
    findDeptRank () {
      const params = {}
      params.month = this.time2
      this.$http.get('/huoli/htChart/findDeptRank', {params: params}).then(({ data }) => {
        if (data) {
          this.deptData1 = data.data1
          this.deptData2 = data.data2
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    findGroupMap () {
      const params = {}
      this.$http.get('/huoli/org/findGroupMap', {params: params}).then(({ data }) => {
        if (data) {
          //获取班组数据
          this.tagOptions = data
          if (data.length > 0) {
            this.tagValue = data[0].tagid
          }
          this.getTagData()
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    getTagData () {
      const params = {}
      params.timeYear = this.timeYear
      params.tagid = this.tagValue
      this.$http.get('/huoli/htChart/getTagData', {params: params}).then(({ data }) => {
        if (data) {
          this.seriesData2 = data.series
          this.dataChart3 = data.data2
          this.drawLine4()
          this.drawLine5()
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    yearData () {
      const params = {}
      params.timeYear = this.timeYear
      this.$http.get('/huoli/htChart/yearData', {params: params}).then(({ data }) => {
        if (data) {
          console.log(data)
          this.seriesData = data.series
          this.rankData1 = data.rankData
          this.drawLine3()
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    initData () {
      const params = {}
      params.month = this.time
      this.$http.get('/huoli/htChart/dataChart12', {params: params}).then(({ data }) => {
        if (data) {
          this.dataChart1 = data.chart1
          this.dataChart2 = data.chart2
          this.drawLine1()
          this.drawLine2()
        } else {
          this.$message({
            type: 'error',
            message: data.message
          })
        }
      })
    },
    changeMonth(){
      console.log(this.valueMonth)
    },
    animatePage(){
      $(".component-page").animate({
      　　"opacity":"1",
      　　"left":"220px"
      },500);
    },
    // 1
    drawLine1(){
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      let option = {
        title : {
            text: this.time +'各项指数平均值',
            textStyle:{
              fontSize:16,
            },
            x:'center',
            top:0,
        },
        xAxis: {
            type: 'category',
            data: ['学习指数', '读书指数', '企业文化', '出勤指数', 'HSE', '精益指数', ],
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value'
        },
        tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        series: [{
            data: this.dataChart1,
            type: 'bar',
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        }]
      };
      myChart.setOption(option);
    },
    // 2
    drawLine2(){
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      let option2 = {
        title : {
            text: this.time +'各项指数占比',
            x:'center',
            textStyle:{
              fontSize:16,
            },
            top:0,
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: ['企业文化', '学习指数', '精益指数', '读书指数', 'HSE', '出勤指数',],

            selected: ['企业文化', '学习指数', '精益指数', '读书指数', 'HSE', '出勤指数',],
        },
        series : [
            {
                name: '详情：',
                type: 'pie',
                radius : '55%',
                center: ['40%', '50%'],
                data: this.dataChart2,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]

      };
      myChart2.setOption(option2);
    },
    // 3
    drawLine3(){
      let myChart3 = this.$echarts.init(document.getElementById('myChart3'))
      let option3 = {
            
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['企业文化', '学习指数', '精益指数', '读书指数', 'HSE', '出勤指数',],
            },
            toolbox: {
                show: true,
                feature: {
                    // dataZoom: {
                    //     yAxisIndex: 'none'
                    // },
                    // dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: this.seriesData
        };
      myChart3.setOption(option3);
    },
    // 4
    drawLine4(){
      let myChart4 = this.$echarts.init(document.getElementById('myChart4'))
      let option4 = {
            
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['企业文化', '学习指数', '精益指数', '读书指数', 'HSE', '出勤指数',],
            },
            toolbox: {
                show: true,
                feature: {
                    // dataZoom: {
                    //     yAxisIndex: 'none'
                    // },
                    // dataView: {readOnly: false},
                    magicType: {type: ['line', 'bar']},
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: this.seriesData2
        };
      myChart4.setOption(option4);
    },
    // 5
    drawLine5(){
      let myChart5 = this.$echarts.init(document.getElementById('myChart5'))
      let option5 = {
        title : {
            text: '班组各项指数占比',
            x:'center',
            textStyle:{
              fontSize:16,
            },
            top:0,
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            data: ['企业文化', '学习指数', '精益指数', '读书指数', 'HSE', '出勤指数',],

            selected: ['企业文化', '学习指数', '精益指数', '读书指数', 'HSE', '出勤指数',],
        },
        series : [
            {
                name: '详情：',
                type: 'pie',
                radius : '55%',
                center: ['40%', '50%'],
                data: this.dataChart3,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]

      };
      myChart5.setOption(option5);
    },
   
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title1{text-align: center;font-size: 25px;font-weight: 800;border-bottom: 1px solid #B6B6B6;padding-bottom: 30px;margin-bottom: 30px;position: relative;}
.ranking-all{background-color: #4F77AB;color:#fff;width: 25%;border-radius: 20px;box-shadow: 0px 0px 10px rgba(0,0,0,0.9);padding:30px;height: 90%;}
.ranking-all-ul{width: 100%;padding:0;margin:0;}
.ranking-all-title{display:flex;justify-content:space-between;font-size: 18px;border-bottom: 1px solid #eee;margin-bottom: 10px;font-weight: 600;padding:0 5px 10px 5px;}
.ranking-all-ul li{height: 35px;line-height: 35px;cursor: pointer;padding:0 5px;}
.ranking-all-ul li:hover{
  background-color: #fff;
  color:#65737E;
}
.part3-title{background-color:#4F77AB;color:#fff;text-align:center;font-size:20px;padding:20px 0;font-weight:700;}
</style>
