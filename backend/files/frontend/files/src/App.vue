<template>
  <div id="app">
    <v-app id="inspire">
      <app-application></app-application>
    </v-app>
  </div>
</template>

<script>
const AppApplication = require( './components/layout/Application').default
// const AppApplication = () => import('./components/layout/Application').then(m => m.default)
// export default {
module.exports = {
  name: 'app',
  components: {
    AppApplication
  },
  //  template: '<AppApplication/>',
}
</script>