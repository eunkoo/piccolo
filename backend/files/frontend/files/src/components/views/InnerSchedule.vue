<template>
  <v-container container--fluid text-xs-center>
    <div class="text-xs-center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-snackbar :value="alert" top color="success" icon="check_circle" outlined>저장 되었습니다</v-snackbar>
    <v-row v-if="!printing " wrap fill-height justify-center>
      <v-col :key="1" cols="12" xs="12" sm="6" md="6">
        <v-select
          ref="current_select"
          :items="belong_items"
          v-model="defaultSelected"
          single-line
          item-text="text"
          item-value="id"
          return-object
          @change="changeBelong"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="!printing ">
      <v-row justify="start">
        <v-col :key="6" xs="4">
          <v-btn label="prev" small fab @click="onPrev">
            <v-icon large color="black">chevron_left</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <v-col xs="6">
        <v-row justify="center" align="start">
          <v-col xs="4" sm="6" md="6">
            <v-menu
              ref="date_menu"
              :close-on-content-click="false"
              v-model="date_menu"
              :nudge-right="40"
              :return-value.sync="cdateFormat"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field class="text-xs-center" text v-on="on" v-model="cdateFormat" readonly />
              </template>
              <v-date-picker
                class="mydatepicker"
                locale="ko-KR"
                v-model="cdateFormat"
                no-title
                scrollable
                @input="chooseDate(cdateFormat)"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>

      <v-col :key="7" xs="4">
        <v-row justify="end">
          <v-btn label="next" fab small @click="onNext">
            <v-icon large color="black">chevron_right</v-icon>
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-col xs="12">
      <schedule-detail
        v-if="!printing "
        ref="scheduleDetail"
        v-bind:start_day="cdateFormat"
        v-bind:end_day="edateFormat"
        cal_type="week"
      ></schedule-detail>
    </v-col>

    <v-col xs="12" sm="4">

    </v-col>
    
    <v-col xs="12" >
        <attendee 
            ref="attendee"
            :cdate='cdate'
            :edate='edate'
            :cbelong='Number(cbelong)'
        ></attendee>
    </v-col>

  </v-container>
</template>

<script>
const apiService = require("@/Services/ApiService");
// const datepicker = require("vuejs-datepicker").defalt;
// const test = require("vue-json-excel").defalt;
import ScheduleDetail from "./ScheduleDetail";
import Attendee from "./Attendee";
const { en, ko } = require("vuejs-datepicker/dist/locale");

// const Vue = require( "vue");
// require("../../assets/css/attendee.css").defalt;

module.exports = {
  name: "innerschedule",
  components: {
    // downloadexcel,
    // test,
    // datepicker,
    // eventdetail,
    // eventnotice,
    // twintable,
    // editableattendee,
    Attendee,
    ScheduleDetail
    // test1,
    // test2,
    // test3,
    // test4
  },
  data() {
    return {
      //   events: [],
      //   attendee: [],
      //   names: [],
      en: en,
      ko: ko,
      dateClicked: false,
      //   table_info_text: "출석 인원",
      belong_items: [
        { text: "유치부", id: 0 },
        { text: "유초등부", id: 1 },
        { text: "중고등부", id: 2 },
        { text: "청년부", id: 3 }
        // { text: '면려회', id: '4' }
      ],
      defaultSelected: {
        text: "유치부",
        id: 0
      },
      alert: false,
      loading: false,
      printing: false,
      //   addAttendName: "",
      //   addAttendConnected: "",
      cbelong: 0,
      cdate: new Date(),
      cdateFormat: this.formatDate(new Date()),
      edate: new Date(Date.now+6),
      edateFormat: this.formatDate(new Date(Date.now+6)),
      dialog: false,
      //   cplace: "",
      //   ctitle: "",
      //   editedIndex: -1,
      //   att_morning: 0,
      //   ex_morning: 0,
      //   att_noon: 0,
      //   ex_noon: 0,
      date_menu: false,
      //   newAtt: {
      //     eid: -1,
      //     mid: -1,
      //     grade: 0,
      //     attended: 0,
      //     name: ""
      //   },
      editedItem: {
        id: -1,
        name: "",
        start: "",
        end: "",
        place: "",
        offering: 0,
        totalmorning: 0,
        totalnoon: 0,
        newes: "",
        birthes: "",
        belongs: 0
      }
    
    };
  },
  mounted() {
    if (this.$route.params.start == null) {
      var after7even = new Date();
      after7even.setDate(after7even.getDate() + 7);
      this.cdate = this.prevDay(new Date(), 7);
      this.cdateFormat = this.formatDate(this.cdate);
      this.edate = this.prevDay(after7even, 6);
      this.edateFormat = this.formatDate(this.edate);
      this.getevents(0);
    } else {
      console.log(this.$route.params.belongs);
      console.log(this.belong_items[this.$route.params.belongs].text);
      this.defaultSelected = {
        text: this.belong_items[this.$route.params.belongs].text,
        id: parseInt(this.$route.params.belongs)
      };
      this.cbelong = this.$route.params.belongs;
      
      this.cdate = new Date(this.$route.params.start);
      this.cdateFormat = this.formatDate(this.cdate);
      this.edate = new Date(this.$route.params.end);
      this.edateFormat = this.formatDate(this.edate);
      this.getevents(this.cbelong);
    }

    // console.log(this.cdate);
    console.log(this.cdateFormat);
    console.log(this.edateFormat);
  },
  computed: {
    userGrade: {
      get: () => {
        return localStorage.getItem("grade");
      }
    }
   
  },
  watch: {
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    formatDate(date) {
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
    
    clearDatas() {
      this.att_morning = 0;
      this.ex_morning = 0;
      this.att_noon = 0;
      this.ex_noon = 0;
      this.cbelong = 0;
      this.cname = "";
      this.cplace = "";
    },
    async getevents(belong) {
      console.log("getevents " + belong);
      this.loading = true;
      this.clearDatas();
      const response = await apiService.fetchEventForBelong({
        belongs: belong
      });
      this.events = response.data;
      if (this.events.length === 0) {
        this.editedItem = {
          start: this.cdate,
          end: this.edate,
          belongs: belong,
          name: this.cname,
          place: this.cplace
        };
        this.attendee = [];
        return;
      }

      // 교육부서를
      this.cbelong = belong; //this.editedItem.belongs;
      await this.loadEventData(belong, this.cdate, this.edate);
      //   this.getAttendee(belong, this.cdate);

      this.loading = false;
    },
    // onSelected(selected) {
    //   this.cdate = selected;
    //   this.getevents(this.cbelong);
    // },
    chooseDate(date) {
      this.cdate = new Date(date);
      this.$refs.date_menu.save(date);
      this.getevents(this.cbelong);
    },
    dateClick() {
      this.dateClicked = true;
    },
    onOpened() {},
    onClosed() {
      this.dateClicked = false;
    },
    async saveNames(belong) {
      console.log("saveNames " + belong);
      const response = await apiService.fetchNames({ belong: belong });
      this.names = response.data;
      // console.log(this.names)
      await this.names.forEach(item => {
        var ndata = {
          eid: this.editedItem.id,
          mid: item.id,
          name: item.name,
          grade: item.grade,
          connected: item.connected,
          bible: 0,
          paragraph: false,
          attended: 0,
          comment: ""
        };
        this.attendee.push(ndata);
      });
      if (!this.names || this.names.length == 0)
        await apiService.addAttendees(this.attendee).then(result => {
          this.attendee = result.data; //Object.assign({}, result.data)
        });
      console.log(this.attendee);
    },

    loadEventData(belong, cdate , edate) {
      console.log("loadEventData " + belong + ", " + cdate.toISOString().slice(0, 10) +" ~ " + edate.toISOString().slice(0, 10));
      var items = this.events.filter(ev => {
        //  console.log(ev.start)
        return (ev.start >= cdate.toISOString().slice(0, 10)&& ev.start <= edate.toISOString().slice(0, 10) );
      });

      if (items.length > 0) {
        this.editedItem = Object.assign(
          {
            totalmorning: this.att_morning + this.ex_morning,
            totalnoon: this.att_noon + this.ex_noon,
            newes: "",
            birthes: ""
          },
          items[0]
        );
        this.editedIndex = this.events.indexOf(items[0]);
        // console.log(this.editedIndex)
      } else {
        this.editedItem = {
          id:-1,
          start: this.formatDate(this.cdate),
          // day: this.cdate.toDateString(),
          belongs: this.cbelong,
          name: this.cname,
          place: this.cplace
        };
        this.editedIndex = -1;
      }

      if (this.editedItem.id > -1){
        this.$refs.scheduleDetail.getSchedules( 
          items,
        {
          eid: this.editedItem.id,
          name: this.editedItem.name,
          belongs: this.editedItem.belongs,
          start: this.editedItem.start,
          end: this.editedItem.end
        });
      }else{
          this.$refs.scheduleDetail.clearData();
      }

      this.$refs.attendee.getAttendee(this.editedItem,this.cbelong, this.cdate);
      this.cname = this.editedItem.name;
      this.cplace = this.editedItem.place;
      console.log(this.editedItem);
    },
   
    async changeBelong(selectObj) {
      this.cbelong = selectObj.id;
      await this.getevents(this.cbelong);
    },

    async save() {
      console.log("inner Schedule view save()");
      try {
        await apiService.updateEvents(this.editedItem).then(result => {
          Object.assign(this.events[this.editedIndex], this.editedItem);
        });

        // }
        this.alert = true;
        setTimeout(() => {
          this.alert = !this.alert;
        }, 3000);
      } catch (err) {
        return console.log(err.message);
      } finally {
        // this.close()
      }
    },
    async deleteEvents(events) {
      const $this = this;
      $this
        .$swal({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          type: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!"
        })
        .then(result => {
          if (result.value) {
            apiService.deleteEvents(events.id);
            const index = this.events.indexOf(events);
            this.events.splice(index, 1);
          }
        });
    },

    print() {
      // window.open("/#/api/attendee", "_blank")
      this.setInfoText(this.cbelong);
      this.printing = !this.printing;
    },
    editItem(item) {
      this.editedIndex = this.events.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      //   setTimeout(() => {
      //     this.editedItem = Object.assign({}, this.defaultItem)
      //     this.editedIndex = -1
      //   }, 300)
    },
    prevDay(d, dow) {
      d.setDate(d.getDate() + ((dow + (-7 - d.getDay())) % 7));
      return d;
    },
    currDay(d,dow){
      d.setDate(d.getDate() + ((dow + ( - d.getDay())) % 7));
      return d;
    },
    nextDay(d, dow) {
      d.setDate(d.getDate() + ((dow + (7 - d.getDay())) % 7));
      return d;
    },
    onPrev() {
      console.log("onPrev " + this.formatDate(this.cdate));
      this.cdate.setDate(this.cdate.getDate() - 1);
      this.cdate = new Date(this.prevDay(this.cdate, 7));
      this.cdateFormat = this.formatDate(this.cdate);

      this.edate.setDate(this.edate.getDate() -7);
      this.edate = new Date(this.currDay(this.edate, 6));
      this.edateFormat = this.formatDate(this.edate);

      if(this.cdate > this.edate){
        this.edate.setDate(this.edate.getDate() +1);
        this.edate = new Date(this.nextDay(this.edate, 6));
        this.edateFormat = this.formatDate(this.edate);
      }

      this.loadEventData(this.cbelong, this.cdate, this.edate);
      //   this.getAttendee(this.cbelong, this.cdate);
    },
    onNext() {
      console.log("onNext " + this.formatDate(this.cdate));
      this.cdate.setDate(this.cdate.getDate() + 1);
      this.cdate = new Date(this.currDay(this.cdate, 7));
      this.cdateFormat = this.formatDate(this.cdate);

      this.edate.setDate(this.edate.getDate() + 7);
      this.edate = new Date(this.nextDay(this.edate, 6));
      this.edateFormat = this.formatDate(this.edate);

      this.loadEventData(this.cbelong, this.cdate, this.edate);
      //   this.getAttendee(this.cbelong, this.cdate);
    }
  }
};
</script>
