<template>
  <v-row>
    <v-col>
      <v-sheet height="600">
        <v-calendar
        locale="ko"
          ref="calendar"
          :value="start_day"
          :events="schedules"
          color="primary"
          :type="cal_type"
          @mouseenter:time="mouseCellEntered($event)"
          @mouseleave:time="mouseCellLeaved($event)"
          @mouseenter:event="mouseOnEvent=true"
          @mouseleave:event="mouseOnEvent=false"
          @click:event ="editEvent"

          @mousedown:time="timeMouseDown"
          @mousemove:time="timeMouseMove"
          @mouseup:time="timeMouseUp($event)"

          :event-color="getEventColor"
          >

        </v-calendar>



        <v-dialog
        persistent
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          width="800"
          max-width="850"
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="editedItem.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="editedItem.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

               <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                      v-on="on"
                    >
                    <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item >
                      <v-list-item-title>이동</v-list-item-title>
                    </v-list-item>
                    <v-list-item >
                      <v-list-item-title>첨부</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeEvent">
                      <v-list-item-title>삭제</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </v-toolbar>

            <v-card-text class="pt-3">
              <h2> {{ editedItem.name }} </h2>
              <h3> {{ editedItem.start }} ~ {{ editedItem.end }} </h3>
            </v-card-text>

            <v-divider inset></v-divider>
            <v-card-text v-if="editedItem.attachments">
              <p> Attachments : {{ testMessage }} </p>
              <v-chip 
                v-for="file in editedItem.attachments" 
                :key="file.name"
                @click:close="deleteAttachments(file.name)"
                color="cyan"
                text-color="white"
                close
                label                 
                class="mr-1 mb-1"
                >
                {{ file.name }}
              </v-chip>
            </v-card-text>
            <v-card-text v-else>
              The attached file does not exist.
            </v-card-text>

            <v-card-text>
              <v-row>
                <v-col cols="2">
                  file upload 
                </v-col>
                <v-col cols="8">
                  <v-file-input 
                    :disabled="editedItem.id < 0"
                    label="select file to upload..."
                    filled
                    chips
                    clearable 
                    solo 
                    hide-details
                    v-model="selectedFile"
                    prepend-icon="mdi-camera">
                  </v-file-input>
                </v-col>
                <v-col cols="2">

                  eid: {{ editedItem.eid }}
                  id: {{ editedItem.id }}
                  <v-btn 
                    :disabled="!selectedFile"
                    color="blue"
                    class="white--text"
                    @click="uploadAttachments" 
                    small>
                    upload
                  </v-btn>
                </v-col>
              </v-row>

            </v-card-text>


            <v-divider></v-divider>

            <v-card-text>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                outlined
                color="secondary"
                @click="cancelEvent"
              >
                취소
              </v-btn>
               <v-btn
                text
                outlined
                color="pramary"
                @click="saveEvent"
              >
                저장
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-sheet>
    </v-col>

  </v-row>
</template>


<script>
import Vue from 'vue';
const apiService = require( "@/Services/ApiService");
require('../../assets/css/eventdayspan.css').default

module.exports = {
  name: "eventdayspan",
  props : { cal_type:String},
  computed: {

    },
 data(){
   return{
     mouseOnEvent:false,
     start_day:"",
     end_day:"",
    schedules: [],
    // eIndex: 0,
    color: ["#3F51B5", "#4CAF50", "#2196F3", "#1976d2", "#4CAF50"],
    isEdit : false,
    parentItems:null,
    editedItem: {
        id: -1,
        eid: -1,
        mid: -1,
        belongs: -1,
        name: "",
        start:"",// new Date().toISOString().slice(0,10),
        end: "",//new Date().toISOString().slice(0,10),
        // time: "09:00",
        // duration: 90,
        // color: "aaaaaa",
        // link:"www.google.com"
         resetContent: function (){
           this.start = "";
           this.end = "";
           this.name = ""; 
        },
      },
      selectedElement: null,
      selectedOpen: false,
      isMouseDown : false,
      currentEvent : null,


      selectedFile: null,

      testPath: '',
      testMessage: '',
   }
  },
  mounted() {
    this.$refs.calendar.checkChange()
    this.$refs.calendar.scrollToTime('08:00')
  },
  methods: {
    deleteAttachmentsAll(event_id, schedule_id) {
      console.log(`delete attachments all`);
      apiService.deleteScheduleAttachmentsAll({ 'eid': event_id, 'id': schedule_id })
      .then(res => {
        console.log(` ---> received delete all attachments response`);
        console.log(res);
        this.editedItem.attachments = [];
        this.testMessage = res.data.attachments.length;
      })
      .catch(err => {
        console.log(` ---x delete all attachments failed`);
        console.log(err);
      });
    },
    deleteAttachments(filename) {
      console.log(`delete attachments filename:${filename}`);
      apiService.deleteScheduleAttachments({ 'eid': this.editedItem.eid, 'id': this.editedItem.id, 'test': filename })
      .then(res => {
        console.log(` ---> received delete response`);
        console.log(res);
        this.editedItem.attachments = res.data.attachments;
        console.log(this.editedItem.attachments);
        this.testMessage = res.data.attachments.length;
      })
      .catch(err => {
        console.log(` ---x delete attachments failed`);
        console.log(err);
      });
    },
    uploadAttachments() {
      if (this.selectedFile) {
        console.log(` try upload attachments. eid:${this.editedItem.eid}  id:${this.editedItem.id} file:${this.selectedFile.name}`);
        let formData = new FormData();
        formData.append('test', this.selectedFile, this.selectedFile.name);
        formData.append('eid', this.editedItem.eid);
        formData.append('id', this.editedItem.id);
        formData.append('headers', ['Content-Type', 'multipart/form-data']);
        apiService.uploadScheduleAttachments(formData)
        .then(res => {
          console.log(` ---> received upload response`);
          console.log(res);
          this.editedItem.attachments = res.data.attachments;
          this.testMessage = res.data.attachments.length;
          this.selectedFile = null;
        })
        .catch(err => {
          console.log(` ---x upload attachments failed`);
          console.log(err);
        });
      }
    },

    getEventColor (event) {
        return this.color[event.belongs]
        // return event.color
      },
    viewDay ({ date }) {
        this.focus = date

      },
    mouseCellEntered({date}){
      // console.log(event)
      // console.log(" cell date "+ (new Date(date).setHours(0,0,0,0) +" "+ (new Date(this.end_day).setHours(0,0,0,0))))
      if( ( +(new Date(date).setHours(0,0,0,0)) >= +(new Date(this.start_day).setHours(0,0,0,0)) ) && (+(new Date(date).setHours(0,0,0,0)) <= +(new Date(this.end_day).setHours(0,0,0,0)) )  )
        event.target.style.backgroundColor = "rgba(128, 255, 128, 0.3)"
      else
        event.target.style.backgroundColor = "rgba(255, 128, 128, 0.3)"
    },
    mouseCellLeaved({date}){
      // console.log(event.target)
      event.target.style.backgroundColor = "rgba(255, 255, 255, 1)"
    },
    timeMouseUp( {hour, minute,date, year}){
      if(this.isMouseDown == false ) return
      minute = Math.round(minute/10)*10
      if(minute==60){
        minute = 0;
        hour++;
      }
      console.log("timeMouseUp : " + date+" "+hour+":"+minute)
      this.editedItem.end = date+" "+hour+":"+minute;
      this.isMouseDown = false;
      this.newEvent(  this.editedItem )

    },
    timeMouseMove({hour, minute, date, year}){
      if(this.isMouseDown == false  ) return;
      // console.log("timeMouseMove time : " + date+" "+time)
      this.editedItem.end = date+" "+hour+":"+minute

    },
    timeMouseDown({ date, year, hour, minute}){
      if(!this.currentEvent ) return
      if(this.mouseOnEvent) return
      if( ( +(new Date(date).setHours(0,0,0,0)) >= +(new Date(this.start_day).setHours(0,0,0,0)) ) && (+(new Date(date).setHours(0,0,0,0)) <= +(new Date(this.end_day).setHours(0,0,0,0)) )  )
      {
        minute = Math.round(minute/10)*10
        if(minute==60){
          minute = 0;
          hour++;
        }
        console.log("dayMouseDown time : " + date+" "+hour+":"+minute)
        // var temp = JSON.parse(JSON.stringify(this.editedItem));
        this.editedItem = Object.assign( {}, {  eid:this.currentEvent.id, 
                                                id : -1,
                                                createdAt:"",
                                                updateddAt:"",
                                                belongs:this.currentEvent.belongs,  
                                                start:date+" "+hour+":"+minute, 
                                                end: date+" "+hour+":"+minute,  
                                                name:"새 일정", 
                                                color:"pink" }) 
        // this.editedItem = JSON.parse(JSON.stringify(temp));
        this.schedules.push( this.editedItem )
        this.isMouseDown = true;
      }
      
    },
    changeEvent(e){
      // this.start_day = e.start;
      // this.end_day = e.end;
      this.getSchedules(this.parentItems, e)
      this.$emit("changeEvent", e);
    },
    async getSchedules( items, current ) {
      console.log(items)
      this.loading = true;
      this.parentItems = items;
      await apiService.fetchScheduleForEvent({eid:current.id})
      .then(res =>{
        console.log('get schedules response is ');
        console.log(res.data);
        this.currentEvent = Object.assign( current );
        // console.log(this.currentEvent)
        this.schedules = items.concat(res.data)        
      })
      .catch(err =>{
        console.log(err);
      });
      
      // ----------------------- get attached file info 
      console.log(` * event name: ${current.name} `);
      // this.schedules.forEach(item => {
      for (let index = 0; index < this.schedules.length; index += 1 ){
        const item = this.schedules[index];
        
        console.log(`   try get attachments list. eid:${item.eid} id:${item.id}`);
        await apiService.fetchScheduleAttachments({ eid: item.eid, id:item.id })
          .then(res => {
            console.log(` ---> get attachments response `);
            console.log(res);

            if (res.data.attachments.length > 1) {
              this.testPath = res.data.attachments[1].fullpath;
              console.log(` test path : ${this.testPath}`);
            }
            this.schedules[index].attachments = res.data.attachments;
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.loading = false;
      this.start_day = current.start;
      this.end_day = current.end;
      console.log(current.start+" ~ "+current.end+" : "+current.id)
      return this.schedules
    },
    clearData(){
      this.schedules = [];
      this.currentEvent = null;
      this.editedItem = {
        eid: -1,
        mid: -1,
        belongs: -1,
        name: "",
        start: new Date().toISOString().slice(0,10),
        end: new Date().toISOString().slice(0,10),
        // time: "09:00",
        // duration: 90,
        color: "",
        link:"", 
        files: [],
      };
    },
    // open (event) {
    //     alert(event.title)
    //   },

      newEvent ( e ) {
        console.log("newEvent");
        const open = () => {
          this. isEdit = false;
          this.editedItem = e
          this.selectedElement = event != undefined ? event.target : this.$refs.calendar //nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
      },
      
      editEvent({ nativeEvent, event }){
        console.log("editEvent");
        console.log(`native event is`);
        console.log(nativeEvent);
        console.log(`event`);
        console.log(event);
        if(event.eid == undefined){
          this.changeEvent(event);
          return;
        }
        const open = () => {
          this.isEdit = true;
          this.editedItem = event;
          this.selectedElement = nativeEvent.target;
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
      },
      cancelEvent(){
          this.selectedOpen = false
            if(!this.isEdit){ // newItem
              var index = this.schedules.indexOf(this.editedItem);
              this.schedules.splice(index, 1);
              
            }
            // this.editedItem.resetContent
      },
      
      saveEvent(){

        console.log(`--- save event button clicked ---`);
        this.selectedOpen = false
        if(!this.isEdit){  // newItem

          console.log(`  request add new schedule. event:${this.editedItem.eid} schedule:${this.editedItem.id}`);
          apiService.addSchedule( Object.assign(this.editedItem,{color:this.color[this.currentEvent.belongs] }))
            .then(res => {
              this.editedItem = res.data;
              this.editedItem.resetContent

              console.log(`  ---> received response for add new schedule `);
              console.log(res.data);
              console.log(` editedItem eid: ${this.editedItem.eid} id:${this.editedItem.id} `);
              console.log(this.editedItem);

              this.schedules.forEach(item =>{
                console.log(`  *** schedule eid:${item.eid} id:${item.id}`);
                if (item.id === -1) {
                  item.id = res.data.id;
                }
              });
            }).catch(err =>{
              console.log(err);
              var index = this.schedules.indexOf(this.editedItem);
                  this.schedules.splice(index, 1);
            });
        }else{

          console.log(`  request edit schedule. event:${this.editedItem.eid} schedule:${this.editedItem.id}`);
          apiService.updateSchedule( this.editedItem )
            .then(res => {

              this.editedItem.resetContent
              console.log(`  ---> received response for edit schedule `);
            }).catch(err =>{
              console.log(err);
              var index = this.schedules.indexOf(this.editedItem);
                  this.schedules.splice(index, 1);
            });
        }
      },
      removeEvent(){
         console.log("removeEvent "+this.editedItem.id);
          this.selectedOpen = false
          apiService.deleteSchedule(this.editedItem.id).then(
            res =>{
              this.editedItem.resetContent
            }
          ).catch(e=>{
               console.log(e)
          })
          var index = this.schedules.indexOf(this.editedItem);
          this.schedules.splice(index, 1);

          // when schedule is deleted, related attachments are also deleted
          this.deleteAttachmentsAll(this.editedItem.eid, this.editedItem.id);
      },

  }
};
</script>
