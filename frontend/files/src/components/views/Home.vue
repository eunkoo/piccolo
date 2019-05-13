<template>
      <v-container   fluid text-xs-center  >
        <v-layout  fill-height justify-center>
            <v-flex  :key="1" xs12 sm6 md4 >
                <p h2 class="text-xs-left">시작</p>
                <datepicker :language="ko" v-model="start_date"  @selected="onSelectedStart" ></datepicker>
            </v-flex>
            <v-flex  :key="2" xs12 sm6 md4>
                <p  h2 class="text-xs-left">종료</p>
                <datepicker :language="ko" v-model="end_date"  @selected="onSelectedEnd" ></datepicker>
            </v-flex>
            <v-flex  :key="3" xs12 sm6 md4 >
                <v-select 
                :items="belong_items"
                v-model="belong_items[cbelong]"
                single-line
                item-text="text"
                item-value="id"
                return-object
                persistent-hint
                @change="changeBelong" 
                ></v-select>
            <td >&nbsp;</td> 
            </v-flex>
        </v-layout>
         <v-layout  fill-height fluid>
             <chart-container  :belong="cbelong" :start="start_date" :end="end_date"></chart-container>
         </v-layout>
      </v-container>
</template>

<script>
import ChartContainer from './ChartContainer.vue'
import {en, ko} from 'vuejs-datepicker/dist/locale'
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'Home',
  components: { ChartContainer,Datepicker},
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
        start_date: this.initDate(),
        end_date:new Date(),
        cbelong:2,
        editedIndex: -1,
        editedItem: {
        id: '',
        title: '',
        day: '',
        place:'',
        belongs:0
        },
      msg: '출결 보고 자료'
    }
  
  },
  methods:{
      initDate(){
        //    return new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        var s = new Date( new Date().setDate(1) )
         s = (s.setMonth(0))
        return new Date(s)

        //    console.log( this.start_date)
      },
    async changeBelong(selectObj) {
        console.log(selectObj.id)
        this.cbelong = selectObj.id
     },
     onSelectedStart(selected){
         this.start_date = selected
     },
     onSelectedEnd(selected){
         this.end_date = selected
     }
  }

}
</script>

<style>

</style>
