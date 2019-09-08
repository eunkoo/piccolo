<template>
  <div>
    <v-container fluid ma-0 pa-2>
      <v-row >
        <v-col >
          <v-card>
            <v-card-title>
              {{tableinfo}}
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="이름 또는 조"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>

            <v-data-table
              :headers="headers"
              :items="attendee"
              :items-per-page="10"
              :search="search"
              class="table"
            >
              <template v-slot:item.attendedm="{ item }">
                  <v-img
                    :src="isMorningAttended(item.attended)"
                    width="20"
                    height="20"
                    @click="onMorning($event,item)"
                  />
              </template>
               <template v-slot:item.attendedn="{ item }">
                  <v-img
                    :src="isNoonAttended(item.attended)"
                    width="20"
                    height="20"
                    @click="onNoon($event,item)"
                  />
               </template>
                <template v-slot:item.bible="{ item }">
                <v-row xs="3" justify="center">
                    <v-text-field
                      type="number"
                      v-model.number="item.bible"
                      label="장수"
                      single-line
                      counter
                    >{{ item.bible }}</v-text-field>
                </v-row>
                </template>
                 <template v-slot:item.paragraph="{ item }">
                <v-row xs="3" justify="center">
                  <v-switch @change="closeEdit" v-model="item.paragraph"></v-switch>
                </v-row>
                 </template>

                  <template v-slot:item.comment="{ item }">
                <v-row xs="3" justify="center">
                      <v-text-field
                      width="120"
                      v-model="item.comment"
                      label="비고"
                      single-line
                      counter/>
                </v-row>
                  </template>
             
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
const apiService = require( "@/Services/ApiService")
require('../../assets/css/editableattendee.css').default

 module.exports ={
  name: "EditableAttendee",
  props: ['attendee'],
  components: {},
  data() {
    return {
      //   attend1: [],
      //   attend2: [],
      pagination: {
        rowsPerPage: 10
      },
      search: "",
      dialog: false,
      changed: false,
      tableinfo: "",
      //   total:0,
      check_img: require("../../assets/checked.png"),
      uncheck_img: require("../../assets/unchecked.png"),
      editedIndex: -1,
      editedItem: {
        id: -1,
        name: "",
        attended: 0,
        mid: -1,
        eid: -1,
        bible: 0,
        paragraph: false,
        comment: ""
      },

      headers: [
        {
          text: "조",
          align: "left",
          sortable: true,
          value: "connected",
          color: "black"
        },
        {
          text: "이름",
          align: "left",
          sortable: false,
          value: "name",
          color: "black"
        },
        {
          text: "오전",
          align: "center",
          sortable: false,
          value: "attendedm",
          color: "black",
          height: "20px"
        },
        {
          text: "오후",
          align: "center",
          sortable: false,
          value: "attendedn",
          color: "black",
          height: "20px"
        },
        {
          text: "성경",
          align: "left",
          sortable: false,
          value: "bible",
          width: "120"
        },
        {
          text: "암송",
          align: "left",
          sortable: false,
          value: "paragraph"
        },

        {
          text: "비고",
          align: "left",
          sortable: false,
          value: "comment",
          width: "120"
        }
      ]
    };
  },
  mounted() {
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
    // isMorningAttended(attended){
    //     if(attended == 0 || attended == 2){

    //         return false;//this.uncheck_img;
    //     }else{
    //         return true;//this.check_img;
    //     }
    // },
    //  isNoonAttended(attended){
    //     if(attended == 0 || attended == 1){
    //         return false//this.uncheck_img;
    //     }else{
    //         return true//this.check_img;
    //     }
    // },
    getMorning() {
      var t = 0;
      this.attendee.forEach(el => {
        t += el.attended == 1 || el.attended == 3 ? 1 : 0;
      });
      console.log("init attend " + t);
      return t;
    },
    getNoon() {
      var t = 0;
      this.attendee.forEach(el => {
        t += el.attended == 2 || el.attended == 3 ? 1 : 0;
      });
      console.log("init attend " + t);
      return t;
    },
    changeMorning() {
      this.$emit("changeMorning", this.getMorning());
    },
    changeNoon() {
      this.$emit("changeNoon", this.getNoon());
    },
    isMorningAttended(attended) {
      if (attended == 0 || attended == 2) {
        return this.uncheck_img;
      } else {
        return this.check_img;
      }
    },
    isNoonAttended(attended) {
      if (attended == 0 || attended == 1) {
        return this.uncheck_img;
      } else {
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
    onNoon(event, item) {
      // console.log(event)
      // console.log(item)
      if (item.attended === 0) {
        // 불참
        item.attended = 2;
        // this.total++;
        event.target.src = this.check_img;
        // event.target.style.backgroundColor = "#98EE98"
      } else if (item.attended === 1) {
        // 오후 참석
        item.attended = 3;
        // this.total++;
        event.target.src = this.check_img;
        // event.target.style.backgroundColor = "#98EE98"
      } else if (item.attended === 2) {
        // 오후 참석
        item.attended = 0;
        // this.total--;
        event.target.src = this.uncheck_img;
        // event.target.style.backgroundColor = "#ffffff"
      } else if (item.attended === 3) {
        //전부 참석
        item.attended = 1;
        // this.total--;
        event.target.src = this.uncheck_img;
        // event.target.style.backgroundColor = "#ffffff"
      }

      this.editedItem = item; //Object.assign({}, item)
      this.changeNoon();
      this.changed = true;
      // this.save();
    },
    onMorning(event, item) {
      // console.log(event)
      // console.log(item)
      if (item.attended === 0) {
        // 불참
        item.attended = 1;
        event.target.src = this.check_img;
        // this.total++;
        // event.target.style.backgroundColor = "#98EE98"
      } else if (item.attended === 1) {
        // 오전 참석
        item.attended = 0;
        event.target.src = this.uncheck_img;
        // this.total--;
        // event.target.style.backgroundColor = "#ffffff"
      } else if (item.attended === 2) {
        // 전체 참석
        item.attended = 3;
        event.target.src = this.check_img;
        // this.total++;
        // event.target.style.backgroundColor = "#98EE98"
      } else if (item.attended === 3) {
        // 전체 참석
        item.attended = 2;
        event.target.src = this.uncheck_img;
        // this.total--;
        // event.target.style.backgroundColor = "#ffffff"
      }

      this.editedItem = item; // Object.assign({}, item)
      this.changeMorning();
      this.changed = true;
      // this.save();
    },
    async save() {
      try {
        if (this.changed) {
          //   await apiService.addAttendee(this.editedItem)
          //   this.events.push(this.editedItem)
          // } else {
          console.log("EditableAttendee save");
          // await apiService.updateAttendee(this.editedItem)
          // var saved = []
          // this.attendee1.forEach(e => {
          //   saved.push(e)
          // });
          // this.attendee2.forEach(e => {
          //   saved.push(e)
          // });
          await apiService.addAttendees(this.attendee);
          //   Object.assign(this.events[this.editedIndex], this.editedItem)
        }
      } catch (err) {
        // return console.log(err.message)
      } finally {
        this.changed = false;
        this.close();
      }
    },
    closeEdit() {
      this.changed = true;
    },
    closeBible(item) {
      this.changed = true;
      if (item.bible === "") item.bible = 0;
      this.editedItem = item;
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

    editItem(item) {
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      //   this.dialog = true
    }, close() {
      this.dialog = false;
      //   setTimeout(() => {
      //     this.editedItem = Object.assign({}, this.defaultItem)
      //     this.editedIndex = -1
      //   }, 300)
    }
  }
};
</script>

