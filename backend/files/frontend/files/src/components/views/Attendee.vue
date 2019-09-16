<template>
  <v-container container--fluid text-xs-center>
    
    <v-btn v-if="!isLoadedAttendee" v-model="isLoadedAttendee" @click.native='insertAttendee'>출석부 추가하기</v-btn>
    <div v-if="isLoadedAttendee">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>

      <v-snackbar :value="alert" top color="success" icon="check_circle" outlined>저장 되었습니다</v-snackbar>

      <v-row v-if="!printing " wrap justify-center>
        <v-col :key="2" xs="4" sm="4" md="4" v-if="userGrade==0">
          <v-row justify="center">
            <div class="formodal">
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn fab v-on="on" class="mb-2">수동</v-btn>
                </template>
                <v-card>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-row wrap>
                        <v-col xs="12" sm="6" md="4">
                          <v-text-field label="이름" v-model="addAttendName"></v-text-field>
                          <v-text-field label="조" v-model="addAttendConnected"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text color="primary" @click.native="addOrDel">추가 또는 삭제</v-btn>
                    <v-btn text color="primary" @click.native="close">취소</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-row>
        </v-col>
        <v-col :key="3" xs="4" sm="4" md="4" v-if="userGrade==0">
          <v-row justify="center">
            <downloadexcel
              class="btn btn-default"
              :data="attendee"
              :fields="attendee_fields"
              type="csv"
              name="출결현황.xls"
            >
              <v-btn fab>엑셀</v-btn>
            </downloadexcel>
          </v-row>
        </v-col>
        <v-col :key="5" xs="4" sm="4" md="4" v-if="userGrade==0">
          <v-row justify="center">
            <v-btn fab color="primary" @click="save">저장</v-btn>
          </v-row>
        </v-col>
      </v-row>

      <v-col v-if="!printing && userGrade==0">
        <eventdetail
          ref="detail"
          v-bind:printing="true"
          :changeOffering="changeOffering"
          v-bind:datas="editedItem"
        ></eventdetail>
        <editableattendee
          ref="editable"
          v-bind:attendee="attendee"
          @changeNoon="changeNoonAtt"
          @changeMorning="changeMorningAtt"
        ></editableattendee>
      </v-col>
      <v-col v-else>
        <v-row class="guide" justify-center align-center>
          <div id="printMe" class="page-wrapper">
            <div class="page">
              <div class="page-inner">
                <v-col>
                  <twintable
                    :isHeader="true"
                    :changeNoon="changeNoonAtt"
                    :changeMorning="changeMorningAtt"
                    :tableinfo="table_info_text"
                    :attendee1="attendee1"
                    :attendee2="attendee2"
                  ></twintable>
                  <twintable
                    :isHeader="false"
                    :changeNoon="changeNoonEx"
                    :changeMorning="changeMorningEx"
                    :tableinfo="'새신자 및 장기 결석'"
                    :attendee1="expectee1"
                    :attendee2="expectee2"
                  ></twintable>
                  <eventnotice v-bind:datas="editedItem" v-bind:printingview="true"></eventnotice>
                </v-col>
              </div>
            </div>
          </div>
        </v-row>
      </v-col>
      <eventnotice
        v-if="!printing && userGrade==0"
        :changeNotice="changeNotice"
        v-bind:printingview="false"
        ref="notice"
        v-bind:datas="editedItem"
      ></eventnotice>
      <v-col :key="8" xs="2">
        <v-btn fab @click="print" v-if="userGrade==0">보기</v-btn>
      </v-col>
    </div>
  </v-container>
</template>

<script>
const apiService = require("@/Services/ApiService");
// const datepicker = require("vuejs-datepicker").defalt;
// const test = require("vue-json-excel").defalt;
import downloadexcel from "vue-json-excel";
import editableattendee from "./EditableAttendee";
// import eventdayspan from "./EventDayspan";
import eventdetail from "./EventDetail";
import eventnotice from "./EventNotice";
import twintable from "./TwinTable";
const { en, ko } = require("vuejs-datepicker/dist/locale");

// const Vue = require( "vue");
require("../../assets/css/attendee.css").defalt;

module.exports = {
  name: "attendee",
  props: { cdate: Date, edate: Date, cbelong: Number },
  components: {
    downloadexcel,
    // test,
    // datepicker,
    eventdetail,
    eventnotice,
    twintable,
    editableattendee
    // eventdayspan,
    // test1,
    // test2,
    // test3,
    // test4
  },
  data() {
    return {
      events: [],
      attendee: [],
      names: [],
      // en: en,
      // ko: ko,
      dateClicked: false,
      table_info_text: "출석 인원",
      belong_items: [
        { text: "유치부", id: 0 },
        { text: "유초등부", id: 1 },
        { text: "중고등부", id: 2 },
        { text: "청년부", id: 3 }
        // { text: '면려회', id: '4' }
      ],
      // defaultSelected: {
      //   text: "유치부",
      //   id: 0
      // },

      alert: false,
      loading: false,
      printing: false,
      addAttendName: "",
      addAttendConnected: "",
      // cbelong: 0,
      // cdate: null,
      cdateFormat: this.formatDate(new Date()),
      // edate: null,
      edateFormat: this.formatDate(new Date()),
      dialog: false,
      cplace: "",
      ctitle: "",
      editedIndex: -1,
      att_morning: 0,
      ex_morning: 0,
      att_noon: 0,
      ex_noon: 0,
      date_menu: false,
      newAtt: {
        eid: -1,
        mid: -1,
        grade: 0,
        attended: 0,
        name: ""
      },
      editedItem: null,
      attendee_fields: {
        이름: "name",
        조: "connected",
        "오전 출석": {
          field: "attended",
          callback: value => {
            return value === 1 || value === 3 ? "O" : "";
          }
        },
        "오후 출석": {
          field: "attended",
          callback: value => {
            return value === 2 || value === 3 ? "O" : "";
          }
        },
        성경: {
          field: "bible",
          callback: value => {
            return value === "" ? 0 : value;
          }
        },
        암송: {
          field: "paragraph",
          callback: value => {
            return value ? "O" : "";
            // return value
          }
        }
      }

      //   df_attendee:{
      //       id=-1,
      //       eid:-1,
      //       mid:-1,
      //       attended:0,
      //       name:'',
      //       grade:-1
      //   }
    };
  },
  mounted() {
    console.log("mounted");
    console.log(this.editedItem);
  },
  computed: {
    isLoadedAttendee: function() {
      return  this.attendee && this.attendee.length > 0;
    },
    userGrade: {
      get: () => {
        return localStorage.getItem("grade");
      }
    },
    attendee1: function() {
      var enMember = this.attendee.filter(m => {
        return m.grade === 0;
      });
      var mid = enMember.length / 2;
      var en = enMember.slice(0, mid);
      var mt = 0,
        nt = 0;
      enMember.forEach(el => {
        mt += el.attended == 1 || el.attended == 3 ? 1 : 0;
        nt += el.attended == 2 || el.attended == 3 ? 1 : 0;
      });
      this.att_morning = mt;
      this.att_noon = nt;
      return en;
    },
    attendee2: function() {
      var enMember = this.attendee.filter(m => {
        return m.grade === 0;
      });
      var mid = enMember.length / 2;
      if (mid === 0) return [];
      return enMember.slice(mid, enMember.length);
    },
    expectee1: function() {
      var exMember = this.attendee.filter(m => {
        return m.grade > 0;
      });
      var mid = exMember.length / 2;
      var ex = exMember.slice(0, mid);
      var mt = 0,
        nt = 0;
      exMember.forEach(el => {
        mt += el.attended == 1 || el.attended == 3 ? 1 : 0;
        nt += el.attended == 2 || el.attended == 3 ? 1 : 0;
      });
      this.ex_morning = mt;
      this.ex_noon = nt;
      return ex;
    },
    expectee2: function() {
      var exMember = this.attendee.filter(m => {
        return m.grade > 0;
      });
      var mid = exMember.length / 2;
      if (mid === 0) return [];
      return exMember.slice(mid, exMember.length);
    }
    // formTitle () {
    //   return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    // }
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
    async addOrDel() {
      var item = this.attendee.filter(ev => {
        return ev.name === this.addAttendName;
      });
      // console.log(this.attendee)
      if (item.length === 0) {
        var tmp = Object.assign({}, this.attendee[0]);
        var ndata = Object.assign(tmp, {
          id: -1,
          eid: this.editedItem.id,
          mid: -1,
          name: this.addAttendName,
          grade: 0,
          connected: this.addAttendConnected,
          bible: 0,
          paragraph: false,
          attended: 0
        });
        try {
          await apiService.addAttendee(ndata).then(result => {
            console.log(result.data);
            this.attendee.push(Object.assign({}, result.data));
          });
        } catch (err) {
          return console.log(err.message);
        } finally {
          this.close();
          this.addAttendName = "";
        }
      } else {
        try {
          var satt = item[0];
          await apiService.deleteAttendee(satt.id).then(result => {
            console.log(result.data);
            const index = this.attendee.indexOf(satt);
            this.attendee.splice(index, 1);
          });
        } catch (err) {
          return console.log(err.message);
        } finally {
          this.close();
          this.addAttendName = "";
        }
      }
    },
    setInfoText(belong) {
      // console.log("setInfoText " + belong);
      // console.log(this.belong_items[belong].text);
      this.table_info_text =
        this.cdateFormat +
        " " +
        this.belong_items[belong].text +
        " " +
        "출결 - 재적 : " +
        (this.editedItem.totalmember == undefined
          ? 0
          : this.editedItem.totalmember) +
        ", 오전 : " +
        (this.editedItem.totalmorning == undefined
          ? 0
          : this.editedItem.totalmorning) +
        ", 오후 : " +
        (this.editedItem.totalnoon == undefined
          ? 0
          : this.editedItem.totalnoon);

          console.log("setInfoText :" + this.table_info_text);
    },
    changeNotice(notice) {
      console.log("changeNotice " + notice);
      if (this.events[this.editedIndex]) {
        this.events[this.editedIndex].notice = notice;
        this.editedItem.notice = notice;
      }
    },
    changeOffering(offering) {
      console.log("chagneOffering " + offering);
      if (this.events[this.editedIndex]) {
        this.editedItem.offering = offering;
        this.events[this.editedIndex].offering = offering;
      }
    },
    changeMorningAtt(t) {
      console.log(t);
      this.att_morning = t;
      this.editedItem.totalmorning = this.att_morning; //+ this.ex_morning;
      console.log(this.att_morning);
      console.log(this.ex_morning);
      console.log(this.editedItem.totalmorning);
      // this.save()
    },
    changeMorningEx(t) {
      console.log(t);
      this.ex_morning = t;
      this.editedItem.totalmorning = this.att_morning + this.ex_morning;
      // this.save()
    },
    changeNoonAtt(t) {
      console.log(t);
      this.att_noon = t;
      this.editedItem.totalnoon = this.att_noon; //+ this.ex_noon;
      // this.save()
    },
    changeNoonEx(t) {
      console.log(t);
      this.ex_noon = t;
      this.editedItem.totalnoon = this.att_noon + this.ex_noon;
      // this.save()
    },
    clearDatas() {
      this.att_morning = 0;
      this.ex_morning = 0;
      this.att_noon = 0;
      this.ex_noon = 0;
      this.cbelong = 0;
      this.ctitle = "";
      this.cplace = "";
    },

    dateClick() {
      this.dateClicked = true;
    },
    onOpened() {},
    // onClosed() {
    //   this.dateClicked = false;
    // },
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
      // if (!this.names || this.names.length == 0)
        await apiService.addAttendees(this.attendee).then(result => {
          this.attendee = result.data; //Object.assign({}, result.data)
        });
      console.log(this.attendee);
    },

    async saveNewes(belong, month) {
      console.log("saveNewes");
      const response = await apiService.fetchNewes({
        belong: belong,
        month: month + 1
      });
      var newes = response.data;
      var names = "";
      newes.forEach(el => {
        names += " " + el.name;
      });
      this.editedItem.newes = names;
      // this.events.newes = this.editedItem.newes;
      apiService.updateEvents(this.editedItem);

      console.log(newes);
    },
    async saveBirthes(belong, month) {
      console.log("saveBirthes");
      const response = await apiService.fetchBirthes({
        belong: belong,
        month: month + 1
      });
      var births = response.data;
      var names = "";
      births.forEach(el => {
        names += " " + el.name;
      });
      this.editedItem.birthes = names;
      // this.events.birthes = this.editedItem.birthes;
      apiService.updateEvents(this.editedItem);
      console.log(births);
    },
    insertAttendee() {
      console.log("insertAttendee "+this.editedItem.id);
      if (this.editedItem.id == undefined || this.editedItem.id <0) {
       this.attendee = [];
       return;
      }
      this.saveNames(this.cbelong);
      this.saveBirthes(this.cbelong, this.cdate.getMonth());
      this.saveNewes(this.cbelong, this.cdate.getMonth());
    },
    async getAttendee(inputItem, belong, date) {
      console.log("getAttendee " + inputItem.id);
      this.editedItem = inputItem;
      if (inputItem.id == undefined || inputItem.id <0) {
       this.attendee = [];
       return;
      }
      this.cdateFormat = this.formatDate(this.cdate);
      this.edateFormat = this.formatDate(this.edate);
      
      this.setInfoText(belong);
      // if (this.editedItem.id === undefined) {
      //   this.attendee = [];
      //   return;
      // }
      const response = await apiService.fetchAttendee({
        id: this.editedItem.id
      });
      this.attendee = response.data;
      // if (this.attendee.length == 0) {
      //   // to be created

      //   this.saveNames(belong);
      //   this.saveBirthes(belong, date.getMonth());
      //   this.saveNewes(belong, date.getMonth());
      // } else {
      if (this.attendee.length > 0) {
        var mt = 0,
          nt = 0;
        this.attendee.forEach(el => {
          mt += el.attended == 1 || el.attended == 3 ? 1 : 0;
          nt += el.attended == 2 || el.attended == 3 ? 1 : 0;
        });
        this.editedItem.totalmorning = mt;
        this.editedItem.totalnoon = nt;
      }
    },
    // async changeBelong(selectObj) {
    //   this.cbelong = selectObj.id;
    //   await this.getevents(this.cbelong);
    // },

    async save() {
      console.log("Attendee view save()");
      try {
        // if (this.editedIndex === -1) {
        // console.log(this.editedItem)
        //   await apiService.addEvents(this.editedItem)
        //   this.events.push(this.editedItem)
        // } else {
        this.$refs.editable.save();
        this.$refs.detail.save();
        //   this.$refs.att_table.save()
        //   this.$refs.ex_table.save()
        this.$refs.notice.save();
        await apiService.updateEvents(this.editedItem).then(result => {
          // Object.assign(this.events[this.editedIndex], this.editedItem)
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
    }
  }
};
</script>
