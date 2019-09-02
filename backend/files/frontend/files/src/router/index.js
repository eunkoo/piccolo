

import Router from  'vue-router'
const Home = require( '@/components/views/Home').default
const Logout = require( '@/components/views/Logout').default
const Members = require( '@/components/views/Members').default
const Events = require( '@/components/views/Events').default
const Attendee = require( '@/components/views/Attendee').default
const Organization = require( '@/components/views/Organization').default
const StatisticsPage = require( '@/components/views/ZStatistics').default


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
