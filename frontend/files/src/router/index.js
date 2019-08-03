


import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/views/Home'
import Logout from '@/components/views/Logout'

import Members from '@/components/views/Members'
import Events from '@/components/views/Events'
import EventDayspan from '@/components/views/EventDayspan'
import Attendee from '@/components/views/Attendee'
import Organization from '@/components/views/Organization'
import StatisticsPage from '@/components/views/ZStatistics'


import Vuetify from 'vuetify'
import VueSweetalert2 from 'vue-sweetalert2'
import 'vuetify/dist/vuetify.min.css'
import { Line } from 'vue-chartjs'

import 'material-design-icons-iconfont/dist/material-design-icons.css'

import VueImg from 'v-img';

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import vuescroll from 'vue-scroll'

// import PrintLayout from '@/PrintLayout'


Vue.config.productionTip = false


Vue.use(Vuetify, {
  theme: {
    primary: '#7986CB',
    secondary: '#e57373',
    accent: '#9c27b0',
    error: '#f44336',
    warning: '#ffeb3b',
    info: '#2196f3',
    success: '#4caf50'
  }
})
Vue.use(VueSweetalert2)
Vue.use(Line)
Vue.use(VueImg);
Vue.use(VueMaterial)
Vue.use(vuescroll)


Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/api/zstatistics',
      name: 'Statistics',
      component: StatisticsPage,
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout
    },
    {
        path: '/api/members',
        name: 'members',
        component: Members
    },
    {
        path: '/api/worship',
        name: 'worship',
        component: Events
    },
    //     {
    //     path: '/api/events',
    //     name: 'events',
    //     component: EventDayspan
    // },
    {
        path: '/api/attendee',
        name: 'attendee',
        component: Attendee,
    },
    {
      path: '/data/attendee/:day/:eday/:belongs',
      name: 'DataAttendee',
      component: Attendee,
      props: true,
    },
    {
        path: '/api/organization',
        name: 'organization',
        component: Organization
    },
    {
      path: '*',
      redirect: '/',
    }
  ]
})
