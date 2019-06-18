<template>
  <v-container fluid text-xs-center>
    <div class="text-xs-center">
      <v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-alert :value="alert" color="success" icon="check_circle" outline>저장 되었습니다</v-alert>
    <v-layout v-if="!printing " wrap fill-height justify-center>
      <v-flex :key="1" xs12 sm3 md3>
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
      </v-flex>
      <v-flex :key="2" xs3 sm3 md3 v-if="userGrade==0">
        <div class="formodal">
          <v-dialog v-model="dialog" max-width="500px">
            <v-btn fab slot="activator" class="mb-2">수동</v-btn>
            <v-card>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="이름" v-model="addAttendName"></v-text-field>
                      <v-text-field label="조" v-model="addAttendConnected"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn flat color="primary" @click.native="addAttendee">추가 또는 삭제</v-btn>
                <v-btn flat color="primary" @click.native="close">취소</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-flex>
      <v-flex :key="3" xs3 sm3 md3 v-if="userGrade==0">
        <download-excel
          class="btn btn-default"
          :data="attendee"
          :fields="attendee_fields"
          type="csv"
          name="출결현황.xls"
        >
          <v-btn fab>엑셀</v-btn>
        </download-excel>
      </v-flex>

      <v-flex :key="5" xs3 sm3 md3 v-if="userGrade==0">
        <v-btn fab color="primary" @click="save">저장</v-btn>
      </v-flex>
    </v-layout>
    <v-layout v-if="!printing " justify-center align-center>
      <v-flex :key="6" xs4>
        <v-btn label="prev" small fab @click="onPrev">
          <v-icon large color="black">chevron_left</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs4>
        <v-layout justify-center>
          <v-flex xs12 sm6 md4>
            <v-menu
              ref="date_menu"
              :close-on-content-click="false"
              v-model="date_menu"
              :nudge-right="40"
              :return-value.sync="cdateFormat"
              lazy
              transition="scale-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field text-xs-center flat slot="activator" v-model="cdateFormat" readonly></v-text-field>
              <v-date-picker locale="ko-KR" v-model="cdateFormat" no-title scrollable>
                <v-btn flat color="primary" @click="date_menu = false">취소</v-btn>
                <v-btn flat color="primary" @click="chooseDate(cdateFormat)">확인</v-btn>
              </v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex :key="7" xs4>
        <v-btn label="next" fab small @click="onNext">
          <v-icon large color="black">chevron_right</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-flex v-if="!printing && userGrade==0">
      <!-- <v-container class="guide_layout">
      <v-layout class="guide">-->
      <event-detail
        ref="detail"
        :printing="true"
        @changeOffering="changeOffering"
        v-bind:datas="editedItem"
      ></event-detail>
      <!-- </v-layout>
      </v-container>-->
      <editable-attendee
        ref="editable"
        :attendee="attendee"
        @changeNoon="changeNoonAtt"
        @changeMorning="changeMorningAtt"
      ></editable-attendee>
    </v-flex>
    <v-flex v-else>
      <v-layout class="guide" justify-center align-center>
        <div id="printMe" class="page-wrapper">
          <div class="page">
            <div class="page-inner">
              <v-flex>
                <twin-table
                  :isHeader="true"
                  @changeNoon="changeNoonAtt"
                  @changeMorning="changeMorningAtt"
                  :tableinfo="table_info_text"
                  :attendee1="attendee1"
                  :attendee2="attendee2"
                ></twin-table>
                <twin-table
                  :isHeader="false"
                  @changeNoon="changeNoonEx"
                  @changeMorning="changeMorningEx"
                  :tableinfo="'새신자 및 장기 결석'"
                  :attendee1="expectee1"
                  :attendee2="expectee2"
                ></twin-table>
                <event-notice v-bind:datas="editedItem" v-bind:printingview="true"></event-notice>
              </v-flex>
            </div>
          </div>
        </div>
      </v-layout>
    </v-flex>
    <event-notice
      v-if="!printing && userGrade==0"
      @changeNotice="changeNotice"
      v-bind:printingview="false"
      ref="notice"
      v-bind:datas="editedItem"
    ></event-notice>
    <!-- <v-layout class="guide"  justify-center align-center >
         <event-notice  v-if='printing' @changeNotice='changeNotice'  ref='notice' v-bind:datas="editedItem"></event-notice>
    </v-layout>-->
    <v-flex :key="8" xs2>
      <v-btn fab @click="print" v-if="userGrade==0">보기</v-btn>
    </v-flex>
  </v-container>
</template>

<script>
import apiService from "@/Services/ApiService";
import Datepicker from "vuejs-datepicker";
import EventDetail from "./EventDetail";
import EventNotice from "./EventNotice";
import TwinTable from "./TwinTable";
import downloadExcel from "vue-json-excel";
import { en, ko } from "vuejs-datepicker/dist/locale";
import EditableAttendee from "./EditableAttendee";
import Vue from "vue";

export default {
  name: "attendee",
  components: {
    Datepicker,
    EventDetail,
    EventNotice,
    TwinTable,
    downloadExcel,
    EditableAttendee
  },
  data() {
    return {
      events: [],
      attendee: [],
      names: [],
      en: en,
      ko: ko,
      dateClicked: false,
      table_info_text: "출석 인원",
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
      addAttendName: "",
      addAttendConnected: "",
      cbelong: 0,
      cdate: null,
      cdateFormat: this.formatDate(new Date()),
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
      editedItem: {
        id: "",
        title: "",
        day: "",
        place: "",
        offering: 0,
        totalmorning: 0,
        totalnoon: 0,
        newes: "",
        birthes: "",
        belongs: 0
      },
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
    this.getevents(0);
    this.cdate = this.prevDay(new Date(), 7);
    this.cdateFormat = this.formatDate(this.cdate);
    console.log(this.cdate);
    console.log(this.cdateFormat);
  },
  computed: {
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
      // this.editedItem.totalnoon = nt
      // this.editedItem.attendee_total = this.editedItem.attendee_total + t;
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
    async addAttendee() {
      var item = this.attendee.filter(ev => {
        return ev.name === this.addAttendName;
      });
      // console.log(this.attendee)
      if (item.length === 0) {
        var tmp = Object.assign({}, this.attendee[0]);
        var ndata = Object.assign(tmp, {
          id: "",
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
      console.log("setInfoText " + belong);
      console.log(this.belong_items[belong].text);
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
    },
    changeNotice(notice) {
      console.log("changeNotice " + notice);
      if (this.events[this.editedIndex])
        this.events[this.editedIndex].notice = notice;
    },
    changeOffering(offering) {
      console.log("chagneOffering " + offering);
      if (this.events[this.editedIndex])
        this.events[this.editedIndex].offering = offering;
    },
    changeMorningAtt(t) {
      console.log(t);
      this.att_morning = t;
      this.editedItem.totalmorning = this.att_morning + this.ex_morning;
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
      this.editedItem.totalnoon = this.att_noon + this.ex_noon;
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
    async getevents(belong) {
      this.loading = true;
      this.clearDatas();
      const response = await apiService.fetchEvent(belong);
      this.events = response.data;
      if (this.events.length === 0) {
        this.editedItem = {
          day: this.cdate,
          belongs: belong,
          title: this.ctitle,
          place: this.cplace
        };
        this.attendee = [];
        return;
      }

      this.cbelong = this.editedItem.belongs;
      this.ctitle = this.editedItem.title;
      this.cplace = this.editedItem.place;
      await this.loadEventData(belong, this.cdate);
      this.getAttendee(belong, this.cdate);
      this.loading = false;
    },
    onSelected(selected) {
      this.cdate = selected;
      this.getevents(this.cbelong);
    },
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
      const response = await apiService.fetchNames(belong);
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
      await apiService.addAttendees(this.attendee).then(result => {
        this.attendee = result.data; //Object.assign({}, result.data)
      });
      console.log(this.attendee);
    },
    loadEventData(belong, cdate) {
      console.log("loadEventData ");
      var item = this.events.filter(ev => {
        return new Date(ev.day).toDateString() === cdate.toDateString();
      });

      if (item.length > 0) {
        this.editedItem = Object.assign(
          {
            totalmorning: this.att_morning + this.ex_morning,
            totalnoon: this.att_noon + this.ex_noon,
            newes: "",
            birthes: ""
          },
          item[0]
        );
        this.editedIndex = this.events.indexOf(item[0]);
        // console.log(this.editedIndex)
      } else {
        this.editedItem = {
          day: this.cdate.toDateString(),
          belongs: this.cbelong,
          title: this.ctitle,
          place: this.cplace
        };
        this.editedIndex = -1;
      }
      this.cbelong = this.editedItem.belongs;
      this.ctitle = this.editedItem.title;
      this.cplace = this.editedItem.place;
      console.log(this.editedItem);
    },
    async saveNewes(belong, month) {
      console.log("saveNewes");
      const response = await apiService.fetchNewes(belong, month + 1);
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
      const response = await apiService.fetchBirthes(belong, month + 1);
      var births = response.data;
      var names = "";
      births.forEach(el => {
        names += " " + el.name;
      });
      this.editedItem.birthes = names;
      // this.events.birthes = this.editedItem.birthes;
      apiService.updateEvents(this.editedItem);
      console.log(this.events);
    },
    async getAttendee(belong, date) {
      console.log("getAttendee " + this.editedItem.id);
      this.setInfoText(belong);
      if (this.editedItem.id === undefined) {
        this.attendee = [];
        return;
      }
      const response = await apiService.fetchAttendee(this.editedItem.id);
      this.attendee = response.data;
      if (this.attendee.length == 0) {
        // to be created
        this.saveNames(belong);
        this.saveBirthes(belong, date.getMonth());
        this.saveNewes(belong, date.getMonth());
      } else {
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
    async changeBelong(selectObj) {
      this.cbelong = selectObj.id;
      await this.getevents(this.cbelong);
    },

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
        await apiService.updateEvents(this.editedItem);
        //   Object.assign(this.events[this.editedIndex], this.editedItem)
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
    // async saveAttendee () {
    //   try {
    //       await apiService.addAttendee(this.editedItem)
    //       this.attendee.push(this.editedItem)
    //   } catch (err) {
    //     return console.log(err.message)
    //   } finally {
    //     this.close()
    //   }
    // },

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
      // new Vue({
      //     el: '#print',
      //     components: { TwinTable, EventDetail },
      //     template: '<event-detail></event-detail><twin-table></twin-table>',
      //     render: h => h(EventDetail,TwinTable)
      // }).$mount("#app")
      // // window.print();
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
    nextDay(d, dow) {
      d.setDate(d.getDate() + ((dow + (7 - d.getDay())) % 7));
      return d;
    },
    onPrev() {
      //  console.log(this.cdate)
      this.cdate.setDate(this.cdate.getDate() - 1);
      this.cdate = new Date(this.prevDay(this.cdate, 7));
      this.cdateFormat = this.formatDate(this.cdate);
      this.loadEventData(this.cbelong, this.cdate);
      this.getAttendee(this.cbelong, this.cdate);
    },
    onNext() {
      // console.log(this.cdate)
      this.cdate.setDate(this.cdate.getDate() + 1);
      this.cdate = new Date(this.nextDay(this.cdate, 7));
      this.cdateFormat = this.formatDate(this.cdate);
      this.loadEventData(this.cbelong, this.cdate);
      this.getAttendee(this.cbelong, this.cdate);
    }
  }
};
</script>
<style scoped>
.page-inner {
  height: 100%;
  width: 100%;
}
.page-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  background: #cccccc;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact;
  box-sizing: border-box;
}
.resume {
  height: 100%;
  width: 100%;
}
.page {
  background: white;
  position: relative;
  width: 21cm;
  height: 100%;
  display: block;
  page-break-after: auto;
  overflow: auto;
}
.guide {
  position: relative;
  width: 21cm;
}
.guide_layout {
  overflow-x: scroll;
  max-width: 100%;
}
</style>