<template>
  <v-container fluid text-xs-center>
    <v-row row wrap>
      <v-col>
        <h2>안녕하세요 </h2>
        <div class="title">{{userName}}님 환영 합니다</div>
        <div class="title">메뉴가 보이지 않으면 logout 해주세요</div>
        <router-link to="/logout">Logout</router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const apiService = require( '@/Services/ApiService')

module.exports ={
  name: 'Home',
  components: {},
   computed: {
    userName: {
      get: () => {
        return localStorage.getItem('apellidos')
      }
    },
    userGrade: {
      get: () => {
        return localStorage.getItem('grade')
      }
    }
  },
  data () {
    return {    
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

