<template>
<div>
  <v-container fill-height fluid ma-0 pa-2>
    <v-layout fill-height>
   <v-flex :key="6" >
    <td class="text-xs-left">{{tableinfo}}</td>
    <v-data-table
      :headers="headers"
      :items="attendee1"
      hide-actions
       fix-header 
      class="table" >
      <template slot="headers" slot-scope="props">
        <tr v-if="!isHeader" style="display:none">
            </tr>
            <tr v-else>
            <th v-for="header in props.headers" :key="header.text" >
                {{ header.text }}
            </th>
        </tr>
    </template>
        <template slot="items" slot-scope="props">
        <td class="text-xs-left" width="100px">{{ props.item.name }}</td>
        <td > <img :src="isMorningAttended(props.item.attended)" width="20px" height="20px" /> </td>
        <td > <img :src="isNoonAttended(props.item.attended)"  width="20px" height="20px" /></td>
          <td>
           {{ props.item.comment }}
        </td>
        
      </template>
    </v-data-table>
   </v-flex>
    <v-flex :key="12" xs6>  
    <td class="text-xs-left">&nbsp;</td> 
    <v-data-table
      :headers="headers"
      :items="attendee2"
      hide-actions
      fix-header 
      class="table" >
      <template slot="headers" slot-scope="props">
        <tr v-if="!isHeader" style="display:none">
            </tr>
            <tr v-else>
            <th v-for="header in props.headers" :key="header.text" >
                {{ header.text }}
            </th>
        </tr>
    </template>
      <template slot="items" slot-scope="props" >
        <td class="text-xs-left" width="100px">{{ props.item.name }}</td>
         <td > <img :src="isMorningAttended(props.item.attended)" width="20px" height="20px"/> </td>
         <td > <img :src="isNoonAttended(props.item.attended)"  width="20px" height="20px" /></td>
        <td>
          {{ props.item.comment }}
        </td>
      </template>
    </v-data-table>
    </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
const apiService = require( '@/Services/ApiService')
require('../../assets/css/twintable.css')
module.exports ={
  name: 'TwinTable',
  props: {attendee1: Array, attendee2:Array,tableinfo:String, isHeader:Boolean},
  components:{
  },
  data () {
    return {
    //   attend1: [],
    //   attend2: [],
      dialog: false,
      changed : false,
    //   total:0,
      check_img:require('../../assets/checked.png'),
      uncheck_img:require('../../assets/unchecked.png'),
      editedIndex: -1,
      editedItem: {
          id:-1,
        name: '',
        attended: 0,
        mid: -1,
        eid: -1,
        comment:''
      },
      headers: [
        {
          text: '이름',
          align: 'left',
          sortable: false,
          value: 'name',
          color:'black',
           visibility:'isHeader'
        },
        {
          text: '오전',
          align: 'center',
          sortable: false,
          value: 'attended',
          color:'black',
          visibility:'isHeader'
        },
        {
          text: '오후',
          align: 'center',
          sortable: false,
          value: 'attended',
          color:'black',
          visibility:'isHeader'
        },
         {
          text: '비고',
          align: 'left',
          sortable: false,
          visibility:'isHeader'
        }
      ]
      
    }
  },
  mounted () {
    // this.getevents()
    
  },
  computed: {
     
    // formTitle () {
    //   return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    // }
  },
//   watch: {
//     // dialog (val) {
//     //   val || this.close()
//     // }
//   },
  methods: {
    // async getevents () {
    //   const response = await apiService.fetchEvents()
    //   this.events = response.data
    // },
    getMorning() {
        var t = 0;
        this.attendee1.forEach(el => {
            t+= (el.attended ==1 || el.attended ==3 ) ? 1 : 0;
        });
        this.attendee2.forEach(el => {
            t+= (el.attended ==1 || el.attended ==3 ) ? 1 : 0;
        });
        console.log("init attend "+t)
        return t 
         
      },
    getNoon() {
        var t = 0;
        this.attendee1.forEach(el => {
            t+= (el.attended ==2 || el.attended ==3 ) ? 1 : 0;
        });
        this.attendee2.forEach(el => {
            t+= (el.attended ==2 || el.attended ==3 ) ? 1 : 0;
        });
        console.log("init attend "+t)
        return t 

    },
    changeMorning(){
        this.$emit('changeMorning',this.getMorning())
    },
    changeNoon(){
        this.$emit('changeNoon',this.getNoon())
    },
    isMorningAttended(attended){
        if(attended == 0 || attended == 2){
            
            return this.uncheck_img;
        }else{
            return this.check_img;
        }
    },
     isNoonAttended(attended){
        if(attended == 0 || attended == 1){
            return this.uncheck_img;
        }else{
            return this.check_img;
        }
    },
    //    morning_label(attended){
    //         if(attended === 1 || attended === 3)
    //             return '출석'
    //         else if(attended === 0 )
    //             return '결석'
    //       },
    
    //   noon_label(attended){
    //         if(attended === 2 || attended === 3)
    //             return '출석'
    //         else if(attended === 0 )
    //             return '결석'
    //       },
    onNoon(event, item){
        // console.log(event)
        // console.log(item)
        if(item.attended===0){ // 불참
            item.attended = 2;
            // this.total++;
            event.target.src = this.check_img;
            // event.target.style.backgroundColor = "#98EE98"
        }else if(item.attended===1){ // 오후 참석
            item.attended = 3;
            // this.total++;
            event.target.src = this.check_img;
            // event.target.style.backgroundColor = "#98EE98"
        }else if(item.attended===2){ // 오후 참석
            item.attended = 0;
            // this.total--;
            event.target.src = this.uncheck_img;
            // event.target.style.backgroundColor = "#ffffff"
        }else if(item.attended===3){ //전부 참석
            item.attended = 1;
            // this.total--;
            event.target.src = this.uncheck_img;
            // event.target.style.backgroundColor = "#ffffff"
        }

        this.editedItem = item//Object.assign({}, item)
        // this.changeNoon()
        this.changed = true;
        // this.save();
    },
    onMorning(event, item){
        // console.log(event)
        // console.log(item)
        if(item.attended===0){ // 불참
            item.attended = 1;
            event.target.src = this.check_img;
            // this.total++;
            // event.target.style.backgroundColor = "#98EE98"
        }else if(item.attended===1){ // 오전 참석
            item.attended = 0;
            event.target.src = this.uncheck_img;
            // this.total--;
            // event.target.style.backgroundColor = "#ffffff"
        }else if(item.attended===2){ // 전체 참석
            item.attended = 3;
            event.target.src = this.check_img;
            // this.total++;
            // event.target.style.backgroundColor = "#98EE98"
        }else if(item.attended===3){ // 전체 참석
            item.attended = 2;
            event.target.src = this.uncheck_img;
            // this.total--;
            // event.target.style.backgroundColor = "#ffffff"
        }
        
        this.editedItem = item// Object.assign({}, item)
        // this.changeMorning()
        this.changed = true;
        // this.save();
    },
    async save () {
      // try {
      //   if (this.changed) 
      //   {
      //   //   await apiService.addAttendee(this.editedItem)
      //   //   this.events.push(this.editedItem)
      //   // } else {
      //       console.log("TwinTable save")
      //       // await apiService.updateAttendee(this.editedItem)
      //       var saved = []
      //       this.attendee1.forEach(e => {
      //         saved.push(e)
      //       });
      //       this.attendee2.forEach(e => {
      //         saved.push(e)
      //       });
      //       await apiService.addAttendees( saved )
      //   //   Object.assign(this.events[this.editedIndex], this.editedItem)
      //   }
      // } catch (err) {
      //   // return console.log(err.message)
      // } finally {
      //   this.changed = false;
      //   this.close()
      // }
    },
    closeEdit(){
      this.changed = true;
    },

    // async deleteEvents (events) {
    //   const $this = this
    //   $this.$swal({
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     type: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, delete it!'
    //   }).then((result) => {
    //     if (result.value) {
    //       apiService.deleteEvents(events.id)
    //       const index = this.events.indexOf(events)
    //       this.events.splice(index, 1)
    //     }
    //   })
    // },

    editItem (item) {
      this.editedIndex = this.events.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close () {
      this.dialog = false
    //   setTimeout(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   }, 300)
    }
  }
}
</script>
