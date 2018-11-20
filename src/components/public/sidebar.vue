<template>
  <div class="sidebar" style="height:100%;position:relative;width:100%;">
    
    <el-menu  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" background-color="#1B2B34"
      @select="handleSelect"
      text-color="#fff"
      active-text-color="#4D95FD"
      :default-active="this.$route.path" router>
      <el-menu-item index="/HelloWorld">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span slot="title">数据管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">{{ item.navItem }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span slot="title">会员数据</span>
        </template>
        <el-menu-item-group>
          <el-menu-item  v-for="(item,i) in navList1" :key="i" :index="item.name" >{{ item.navItem }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-time"></i>
          <span slot="title">部门数据</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(item,i) in navList2" :key="i" :index="item.name">{{ item.navItem }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>  

      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-time"></i>
          <span slot="title">历史记录</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(item,i) in navList3" :key="i" :index="item.name">{{ item.navItem }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span slot="title">网站管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="(item,i) in navList4" :key="i" :index="item.name">{{ item.navItem }}</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>

    <!-- top --> 
    <el-menu
      
      class="el-menu-demo"
      mode="horizontal"
      @select="tuichu"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-radio-group v-model="isCollapse" class="zhankaiTab" :class="isCollapse?'zhankaiTab2':'' ">
       <!--  <img :src="zhankaiUrl" @click="zhankai()"> -->
      </el-radio-group>
      <div style="display:flex;position:absolute;right:0;">
        <el-submenu index="0">
          <template slot="title">
            <div class="headUrl-title">
              <img src="/static/headUrl.png" class="headUrl">
              <div>{{userInfo.name}}</div>
            </div>
          </template>
          <el-menu-item index="0-1" key="0-1">退出登录</el-menu-item>
          <el-menu-item index="0-2" key="0-2">忘记密码</el-menu-item>
        </el-submenu>
       
      </div>
    </el-menu>
    
 
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      userInfo: {},
      navList:[
        {name:'/addData',navItem:'添加数据',xitong:1},
      ],
      navList1:[
        {name:'/wechatsList',navItem:'微信会员列表',xitong:2},
        {name:'/systemList',navItem:'系统会员列表',xitong:3},
      ],
      navList2:[
        {name:'/totalHistory',navItem:'公司总值历史纪录',xitong:4},
        {name:'/departmentList',navItem:'部门列表',xitong:4},
        {name:'/departmentHistory',navItem:'部门历史数据',xitong:4},
        {name:'/teamList',navItem:'班组列表',xitong:4},
        {name:'/teamHistory',navItem:'班组历史数据',xitong:4},
      ],
      navList3:[
        {name:'/indexRecord',navItem:'指数记录'},
        {name:'/dataRecord',navItem:'导入数据记录'},
        {name:'/messageRecord',navItem:'消息推送记录'},
      ],
      navList4:[
        {name:'/backupData',navItem:'数据库管理'},
      ],
      isCollapse: false,
      activeIndex: '1',
      zhankaiUrl:'/static/shouqi.png'
    }
  },
  watch: {
   
  },
  mounted(){
    this.userInfo = this.$store.state.userInfo
    console.log(this.userInfo)
    console.log(this.$route.path)
  },
  methods: {
    zhankai(){
      console.log(this.isCollapse)
      if(this.isCollapse){
        this.isCollapse = false
        this.zhankaiUrl = "/static/shouqi.png"
      }else{
        this.isCollapse = true
        this.zhankaiUrl = "/static/zhanki.png"
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
      // console.log(key);
      // console.log(keyPath)
    },
    // 退出登录
    tuichu(key, keyPath){
      console.log(key)
      if(key == "0-1"){
      this.$http.get('/huoli/login/loadOut').then(({ data }) => {
        console.log(data)
          if (data) {
            this.$notify.success({
              title: '成功',
              message: '退出成功',
              offset: 100
            })
            this.$store.commit('setUserInfo')
            this.$router.push({name: 'login'})
          } else {
            this.$notify.error({
              title: '错误',
              message: '已退出',
              offset: 100
            })
          }
        })
      }else{
        // 修改密码
        var that = this
        const h = this.$createElement
        this.$msgbox({
          title: '修改',
          message: "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>原密码：</span><input style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>" + "<div><span style='width:100px;display: inline-block;text-align: right;height:40px;line-height:40px;margin-right:20px;'>修改后密码：</span><input style='height:30px;border:1px solid #878A90;border-radius:5px;padding:0 10px;color:#878A90;'></div>" ,
          dangerouslyUseHTMLString:true,
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.el-menu-vertical-demo{
  position: absolute;
  left: 0;
  height: 100%;
  z-index: 99;

}

/deep/ .el-menu{border:none;}
.el-menu-demo{
    display: flex;
    background-color: rgb(84, 92, 100);
    width: 100%;
    justify-content:space-between;
    z-index: 98;
    position: relative;
    height: 58px;
    padding-top:0px;
}
:focus{


outline:0;


}

.zhankaiTab{position: absolute;left:210px;transition:all 0.5s ease;}
.zhankaiTab img{height: 30px;width: 30px;margin-top:10px;}
.zhankaiTab2{left: 65px;}
.headUrl{height: 40px;width: 40px;border-radius: 50%;margin-right: 20px;margin-top:10px;}
.headUrl-title{display: flex;width: 170px;}
/deep/ .el-menu-item-group__title{padding:0px;}
/deep/ .el-submenu .el-menu-item{height: 42px;line-height: 42px;font-size: 12px;}
/deep/ [data-v-9b739eb4] .el-submenu .el-menu-item{padding-left: 62px !important;}
</style>
