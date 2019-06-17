<template>
  <v-container fluid text-xs-center>
    <v-layout row wrap>
      <v-flex>
        Home 
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {en, ko} from 'vuejs-datepicker/dist/locale'
import apiService from '@/Services/ApiService'

export default {
  name: 'Home',
  components: {},
  data () {
    return {       
      en:en,
      ko:ko,
      belong_items: [
        { text: '유치부', id: 0 },
        { text: '유초등부', id: 1 },
        { text: '중고등부', id: 2 },
        { text: '청년부', id: 3 },
        { text: '면려회', id: 4 }
      ],
      cbelong:2,
      editedIndex: -1,
      editedItem: {
        id: '',
        title: '',
        day: '',
        place:'',
        belongs:0
      },
      msg: '출결 보고 자료', 

      loaded: false,
      statisticsData: [
        [], [], [], [], []
      ], 

      category: [
        { text: '유치부' }, 
        { text: '유초등부'}, 
        { text: '중고등부'},
        { text: '청년부'},
        { text: '면려회'},
      ],
    }
  },
  mounted() {
  },
  methods:{
  }

}
</script>

<style scoped>
</style>

