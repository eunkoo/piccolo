// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


require("babel-core/register");
require("babel-polyfill");


import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'
import router  from './router'
import axios  from 'axios'
import VueAxios  from 'vue-axios'
import Router from  'vue-router'

import { Line } from  'vue-chartjs'
import VueSweetalert2 from 'vue-sweetalert2';

import VueImg from 'v-img'

import vuescroll from 'vue-scroll'
import '@mdi/font/css/materialdesignicons.css' 



const vuetifyOptions = { }
const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674'
}


Vue.use(VueAxios, axios)
Vue.use(VueSweetalert2, options)
Vue.use(Line)
Vue.use(VueImg);
// Vue.use(VueMaterial)
Vue.use(vuescroll)
Vue.use(Router)
Vue.use(Vuetify)

export default new Vuetify({ 
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
})


Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
 router,
 components: { App },
 vuetify: new Vuetify(vuetifyOptions),
 template: '<App/>',
//  render :(h) =>  h(App)
 
})
