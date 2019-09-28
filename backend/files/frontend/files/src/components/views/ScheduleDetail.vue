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
          max-width="450"
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

                <v-menu :close-on-content-click="false" :nudge-width="200" offset-x>
                  <template v-slot:activator="{ on }">
                    <v-btn text icon color="white" dark v-on="on">                      
                      <v-icon>
                        mdi-arrow-up-bold-box-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title> attached file list here </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    
                    <v-divider></v-divider>
                    
                    <v-list>
                      <v-list-item>
                        <v-list-item-action>

                        </v-list-item-action>
                        <v-list-item-title>

                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card>

                  <v-card-actions>
                    <v-btn> cancel </v-btn>
                    <v-btn> save </v-btn>
                  </v-card-actions>
                </v-menu>
            </v-toolbar>


            <v-card-text v-if="editedItem.attachments">
              <span> Attachments ( {{ editedItem.attachments.length }} ) </span>
              <v-divider></v-divider>
              <v-chip 
                v-for="file in editedItem.attachments" 
                :key="file.name"
                color="cyan"
                text-color="white"
                close
                label 
                small
                class="mr-1 mb-1"
                >
                {{ file.name }}
              </v-chip>
            </v-card-text>            
            <v-card-text>

              file upload 
              <v-file-input 
                label="select file to upload..."
                filled
                chips
                clearable 
                solo 
                hide-details
                @change="fileSelected"
                v-model="selectedFile"
                prepend-icon="mdi-camera">
              </v-file-input>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-text>
              {{ editedItem.start }} ~ {{ editedItem.end }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                small
                outlined
                color="secondary"
                @click="cancelEvent"
              >
                취소
              </v-btn>
               <v-btn
                text
                small
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


    <v-col cols="12">
      test 
      <v-img  witdh="100" :src="testPath"></v-img>
      {{ testPath }}
    </v-col>
  </v-row>
</template>


<script>
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
        files: [],
      },
      selectedElement: null,
      selectedOpen: false,
      isMouseDown : false,
      currentEvent : null,


      selectedFile: null,

      testPath: '',
   }
  },
  mounted() {
    console.log('Schedule detail loaded')
    this.$refs.calendar.checkChange()
    this.$refs.calendar.scrollToTime('08:00')
  },
  methods: {

    fileSelected(file) {
      if (!this.editedItem.files) {
        this.editedItem.files = [];
      }
      if (file) {
        this.editedItem.files.push(file);
        console.log(`editedItem.files length: ${this.editedItem.files.length}`);
        console.log(file);
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
      // });

      console.log(`schedule list`);
      console.log(this.schedules)
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
        console.log(event);
        if(event.eid == undefined){
          this.changeEvent(event);
          return;
        }
        
        
        const open = () => {
          this. isEdit = true;
          this.editedItem = event
          this.selectedElement = nativeEvent.target
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
      
      async saveEvent(){
        this.selectedOpen = false
        if(!this.isEdit){  // newItem
          await apiService.addSchedule( Object.assign(this.editedItem,{color:this.color[this.currentEvent.belongs] }))
          .then(res => {
            this.editedItem = res.data;
            this.editedItem.resetContent
            // console.log(res.data);
          }).catch(err =>{
            console.log(err);
            var index = this.schedules.indexOf(this.editedItem);
                this.schedules.splice(index, 1);
          });
        }else{
          await apiService.updateSchedule( this.editedItem )
          .then(res => {
              this.editedItem.resetContent
          }).catch(err =>{
            console.log(err);
            var index = this.schedules.indexOf(this.editedItem);
                this.schedules.splice(index, 1);
          });
        }

        // upload attached files ----------------------------------//
        if (this.editedItem.files) {
          console.log(`try files upload------- eid:${this.editedItem.eid} id:${this.editedItem.id}`);
          console.log(this.editedItem);

          for (let index = 0; index < this.editedItem.files.length; index += 1) {
            const file = this.editedItem.files[index];
            console.log(` * filename: ${file.name}`);

            let formData = new FormData();
            formData.append('file', file, file.name);
            formData.append('eid', this.editedItem.eid);
            formData.append('id', this.editedItem.id);
            formData.append('headers', ['Content-Type', 'multipart/form-data']);
            await apiService.uploadScheduleAttachments(formData)
              .then(res => {
                console.log(` ---> upload response`);
                console.log(res);
                this.editedItem.attachments = res.data.attachments;
              })
              .catch(err => {
                console.log(` ---x upload failed`);
                console.log(err);
              });
          }
          this.editedItem.files = [];
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
      },

  }
};
</script>
