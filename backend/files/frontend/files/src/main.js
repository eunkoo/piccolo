// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


// import 'babel-polyfill';
// if (!global._babelPolyfill) {
//   // require('babel-polyfill');
//   import 'babel-polyfill';
// }

// import 'es6-promise/auto'
// __webpack_nonce__ = '<%=nonce%>';

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



// import 'material-design-icons-iconfont/dist/material-design-icons.css'
// import 'vue-material/dist/vue-material.min.css'
// import './styles/main.sass'
import VueImg from 'v-img'

// import VueMaterial from 'vue-material'
import vuescroll from 'vue-scroll'


const vuetifyOptions = { }

Vue.use(VueAxios, axios)
// Vue.use(VueSweetalert2)
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


// __webpack_nonce__ = '<%=nonce%>';
// __webpack_nonce__ = 'c29tZSBjb29sIHN0cmluZyB3aWxsIHBvcCB1cCAxMjM=';

/* eslint-disable no-new */
new Vue({
  el: '#app',
 router,
 components: { App },
 vuetify: new Vuetify(vuetifyOptions),
 template: '<App/>',
//  render :(h) =>  h(App)
 
})
