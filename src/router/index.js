import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import wechatsList from '@/components/wechatsList'
import systemList from '@/components/systemList'
import totalHistory from '@/components/totalHistory'
import departmentList from '@/components/departmentList'
import departmentHistory from '@/components/departmentHistory'
import teamList from '@/components/teamList'
import teamHistory from '@/components/teamHistory'
import indexRecord from '@/components/indexRecord'
import dataRecord from '@/components/dataRecord'
import messageRecord from '@/components/messageRecord'
import addData from '@/components/addData'
import backupData from '@/components/backupData'
import login from '@/components/login'
import $ from 'jquery'


Vue.use(Router)

export default new Router({
  routes: [
  	{ path: '/', redirect: '/login' },
    { path: '/HelloWorld',name: 'HelloWorld',component: HelloWorld },
    { path: '/wechatsList',name: 'wechatsList',component: wechatsList },
    { path: '/systemList',name: 'systemList',component: systemList },
    { path: '/totalHistory',name: 'totalHistory',component: totalHistory },
    { path: '/departmentList',name: 'departmentList',component: departmentList },
    { path: '/departmentHistory',name: 'departmentHistory',component: departmentHistory },
    { path: '/teamList',name: 'teamList',component: teamList },
    { path: '/teamHistory',name: 'teamHistory',component: teamHistory },
    { path: '/indexRecord',name: 'indexRecord',component: indexRecord },
    { path: '/dataRecord',name: 'dataRecord',component: dataRecord },
    { path: '/messageRecord',name: 'messageRecord',component: messageRecord },
    { path: '/addData',name: 'addData',component: addData },
    { path: '/backupData',name: 'backupData',component: backupData },
    { path: '/login',name: 'login',component: login },    
  ]
})
