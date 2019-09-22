

import Router from  'vue-router'
const Home = require( '@/components/views/Home').default
const Logout = require( '@/components/views/Logout').default
const Members = require( '@/components/views/Members').default
const Events = require( '@/components/views/Events').default
const Attendee = require( '@/components/views/Attendee').default
const Organization = require( '@/components/views/Organization').default
const StatisticsPage = require( '@/components/views/ZStatistics').default
const InnerSchedule = require( '@/components/views/InnerSchedule').default


export default  new Router({
  mode: 'history',
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
    {
      path: '/api/innerSchedule',
      name: 'innerSchedule',
      component: InnerSchedule,
    },
    {
      path: '/data/dataInnerSchedule/:start/:end/:belongs',
      name: 'dataInnerSchedule',
      component: InnerSchedule,
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
