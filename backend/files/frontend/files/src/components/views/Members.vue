<template>
  <div class="members">
    <div class="text-xs-center">
      <v-progress-linear
        v-if="loading"
        background-color="blue-grey"
        height="3"
        color="lime"
        indeterminate
      ></v-progress-linear>
    </div>
    <v-alert :value="alert" color="error" icon="error_circle" outlined>{{alertMsg}}</v-alert>

    <v-row class="ma-2">
      <v-col :key="1" cols="3" v-if="userGrade==0">
        <download-excel
          class="btn btn-default"
          :data="members"
          :fields="member_fields"
          type="csv"
          name="선택된 명단.xls"
        >
          <v-btn fab>엑셀</v-btn>
        </download-excel>
      </v-col>
    </v-row>
    <v-row class="ma-2">
      <v-col cols="3">
        <v-btn fab class="primary" @click="createMember">
          <v-icon>person_add</v-icon>
        </v-btn>
      </v-col>
      <v-col xs12 cols="12">
        <v-row>
          <v-col>
            <v-chip
              class="ma-1"
              v-for="v in added_word"
              :key="v.id"
              v-model="v.active"
              @click="onChipClose(v)"
            >{{v.search}}</v-chip>
            <v-text-field
              label="검색 후 엔터를 치세요"
              v-model="search"
              @input="search_text"
              @keyup.enter="add_word"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- 검색/필터 패널 -->
        <!-- <v-row row wrap>
      <v-col xs12 >
        <v-select 
          color="blue"
          hide-details
          dense
          v-model="selectedBelongs" 
          :items="[0,1,2,3]"
          attach 
          chips
          multiple
          label="부서"                    
          persistent-hint > 
          <template slot="item" slot-scope="props">
            {{ descBelong[props.item] }}
          </template>                
          <template slot="selection" slot-scope="props">
            {{ descBelong[props.item] }},
          </template>
        </v-select>
      </v-col>
        </v-row>-->

        <!-- <v-row>
      <v-col xs6 sm6 md4>
            <v-select
            label="부서"
            ref="current_select"
            :items="belong_items"
            v-model="belong_items[current_belong]"
            single-line
            item-text="text"
            item-value="id"
            return-object
            persistent-hint
            @change="changeCurrentBelong" 
            >
            <v-list-tile
                slot="prepend-item"
                ripple
                @click="belongAll" >
                <v-list-tile-title>전체</v-list-tile-title>
            </v-list-tile>
            <v-divider
                slot="prepend-item"
                class="mt-2"
            />
            </v-select>
        </v-col>
        &nbsp;&nbsp;
        <v-col>
       <v-text-field label="이름, 연락처 또는 조이름으로 찾기" v-model="search" @input="search_text"></v-text-field>
        </v-col>
        </v-row>-->

        <!-- 회원정보 데이터 테이블 -->
        <v-data-table
          :loading="membersLoading"
          :headers="memberHeader"
          :expanded.sync="expanded"
          :single-expand="false"
          :items-per-page="10"
          :items="members"
          class="elevation-1"
        >
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>

          <template v-slot:item.expand="{ item }">
            <v-btn x-small @click="expanded = [item]" v-if="!expanded.includes(item)">details</v-btn>
            <v-btn x-small @click="expanded = []" v-if="expanded.includes(item)">close</v-btn>
          </template>

          <template v-slot:item.photo="{ item }" >
            <v-card :width="120" :height="80" class="zguide">
              <v-img :width="120" :src="getImgUrl(`${item.photo}`)" v-if="item.photo"></v-img>
            </v-card>
          </template>
          <template v-slot:item.name="{ item }">
            <td :width="120">
              <strong class="headline">{{ item.name }}</strong>
            </td>
          </template>
          <template v-slot:item.grade="{ item }">
            <td>{{ descGrade[item.grade] }}</td>
          </template>
          <template v-slot:item.belong="{ item }">
            <v-chip
              dark
              :color="belongChipStyle[item.belong]"
              text-color="white"
            >{{ descBelong[item.belong] }}</v-chip>
          </template>

          <template v-slot:item.action="{ item }">
            <v-icon icon color="primary" class="mr-2" @click="editMember(item)">edit</v-icon>
            <v-icon icon color="deep-orange" @click="openRemoveDialog(item)">delete</v-icon>
          </template>

          <template v-slot:no-data>
            <td>"인원이 없습니다"</td>
          </template>

          <template v-slot:expanded-item="{ item, headers }">
            <td :colspan="headers.length">
              <v-card>
                <div>상태 : {{ grade_text(item.grade ) }}</div>
                <div>생년월일 : {{ item.birth }}</div>
                <div>세례여부 : {{baptism_text( item.baptism ) }}</div>
                <div>비고 : {{ item.tag }}</div>
              </v-card>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 회원삭제 대화상자 -->
    <v-dialog v-model="removeDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline pt-3">선택한 회원을 삭제하시겠습니까?</v-card-title>
        <v-card-text>
          <v-row row wrap>
            <v-col cols="3" class="zguide">
              <v-img
                max-height="125"
                contain
                :src="getImgUrl(`${selectedMember.photo}`)"
                v-if="selectedMember.photo"
              ></v-img>
            </v-col>
            <v-col cols="9" class="px-3">
              <p>
                삭제한 회원정보는 되돌릴 수 없으니
                <strong class="red--text">주의</strong>하세요.
              </p>
              <p>이름 : {{ selectedMember.name }}</p>
              <p>부서 : {{ descBelong[selectedMember.belong] }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text outlined @click="removeMember(selectedMember)">삭제</v-btn>
          <v-btn color="green darken-1" text outlined @click="removeDialog = false">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 회원정보 추가/수정 대화상자 -->
    <v-dialog v-model="editDialog" persistent width="700px">
      <v-card>
        <v-row>
          <v-row cols="12" class="zguide py-4 px-3 orange lighten-3">
            <v-col pa-2>
              <v-img :src="imageUrl" justify="center" height="210" max-width="340" v-if="imageUrl"></v-img>
              <v-text-field
                label="사진 선택"
                readonly
                hide-details
                prepend-icon="attach_file"
                @click="pickImageFile"
                v-model="imageName"
              ></v-text-field>

              <v-spacer></v-spacer>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                name="photo"
                id="photo"
                @change="onImageFilePicked"
              />
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-card-title primary-title>
              <span class="headline">회원정보 수정</span>
            </v-card-title>
            <v-card-text>
              <v-row row wrap>
                <!-- 이름 -->
                <v-col cols="4" pa-1 ma-0>
                  <v-text-field color="blue" hide-details label="이름" v-model="selectedMember.name"></v-text-field>
                </v-col>
                <!-- 성별 (남:0 여:1) -->
                <v-col cols="3" pa-1 ma-0>
                  <v-select
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.gender"
                    :items="[0,1]"
                    attach
                    label="성별"
                    persistent-hint
                    single-line
                  >
                    <template v-slot:item="{ item, index }">{{ descGender[item] }}</template>
                    <template v-slot:selection="{ item, index }">{{ descGender[item] }}</template>
                  </v-select>
                </v-col>
                <!-- 부서 (유치부:0, 유초등부:1, 중고등부:2, 청년부:3) -->
                <v-col cols="5" pa-1 ma-0>
                  <v-select
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.belong"
                    :items="[0,1,2,3]"
                    attach
                    label="부서"
                    persistent-hint
                    single-line
                  >
                    <template v-slot:item="{ item, index }">{{ descBelong[item] }}</template>
                    <template v-slot:selection="{ item, index }">{{ descBelong[item] }}</template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row row wrap>
                <!-- 조 -->
                <v-col cols="4" pa-1>
                  <v-text-field
                    color="blue"
                    hide-details
                    label="조"
                    v-model="selectedMember.connected"
                  ></v-text-field>
                </v-col>

                <!-- 주소 -->
                <v-col cols="8" pa-1>
                  <v-text-field
                    color="blue"
                    hide-details
                    label="주소"
                    v-model="selectedMember.address"
                  ></v-text-field>
                </v-col>
                <!-- 연락처 -->
                <v-col cols="8" pa-1>
                  <v-text-field
                    color="blue"
                    hide-details
                    label="연락처"
                    v-model="selectedMember.phone"
                  ></v-text-field>
                </v-col>
                <!-- 등록상태 (등록:0, 새신자:1, 장기결석:2, 기타:3) -->
                <v-col cols="4" pa-1>
                  <v-select
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.grade"
                    :items="[0,1,2,3]"
                    attach
                    label="등록상태"
                    persistent-hint
                    single-line
                  >
                    <template v-slot:item="{ item, index }">{{ descGrade[item] }}</template>
                    <template v-slot:selection="{ item, index }">{{ descGrade[item] }}</template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row row wrap>
                <!-- 생년월일 -->
                <v-col cols="6" pa-1 ma-0>
                  <v-menu
                    color="blue"
                    ref="menuBirthday"
                    v-model="menuBirthday"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="selectedMember.birth"
                    offset-y
                    full-width
                    min-width="200px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        hide-details
                        v-on="on"
                        v-model="selectedMember.birth"
                        label="생년월일"
                        prepend-icon="event"
                        readonly
                        hint="select birthday"
                        persistent-hint
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      class="mydatepicker"
                      locale="ko-kr"
                      no-title
                      v-model="selectedMember.birth"
                      :show-current="true"
                      @input="$refs.menuBirthday.save(selectedMember.birth)"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="6" pa-1>
                  <!-- 세례 (세례:0, 입교:1, 학습:2, 유아:3) -->

                  <v-select
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.baptism"
                    :items="[0,1,2,3]"
                    attach
                    label="세례여부"
                    persistent-hint
                    single-line
                  >
                    <template v-slot:item="{ item, index }">{{ descBoptism[item] }}</template>
                    <template v-slot:selection="{ item, index }">{{ descBoptism[item] }}</template>
                  </v-select>
                </v-col>

                <v-col cols="12" pa-1>
                  <v-textarea color="blue" hide-details label="기타" rows="2"></v-textarea>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" outlined text @click="save">
                <v-icon class="pr-2">save</v-icon>저장
              </v-btn>
              <v-btn color="black darken-1" outlined text @click="close">취소</v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

  
<script>
const apiService = require("@/Services/ApiService");
const axios = require("axios").default;
const downloadExcel = require("vue-json-excel").default;
const Api = require("@/Services/Api");

require("../../assets/css/members.css").default;

module.exports = {
  name: "members",
  components: {
    downloadExcel
  },
  data() {
    return {
      expanded: [],
      singleExpand: false,
      alertMsg: "",
      alert: false,
      loading: false,
      search: "",
      members: [],
      members_org: [],
      added_word: [],
      pre_categorized_items: [],
      dialog: false,
      selected_image: null,
      cPhoto: null,
      current_belong: -1,

      member_fields: {
        이름: "name",
        소속: {
          field: "belong",
          callback: value => {
            console.log("execel field belong : " + value);
            if (value === 0) return "유치부";
            if (value === 1) return "유초등부";
            if (value === 2) return "중고등부";
            if (value === 3) return "청년부";
          }
        },
        조: "connected",
        주소: "address",
        전화: "phone",
        생년월일: "birth",
        성별: {
          field: "gender",
          callback: value => {
            if (value === 0) return "남";
            else return "여";
          }
        },
        등록여부: {
          field: "grade",
          callback: value => {
            console.log("execel field grade : " + value);
            if (value === 0) return "등록";
            if (value === 1) return "새신자";
            if (value === 2) return "장기결석";
            if (value === 3) return "보류";
          }
        },
        세례여부: {
          field: "baptism",
          callback: value => {
            console.log("execel field baptism : " + value);
            if (value === 0) return "세례";
            if (value === 1) return "입교";
            if (value === 2) return "학습";
            if (value === 3) return "유아";
          }
        }
      },

      gender_items: [{ text: "남", id: 0 }, { text: "여", id: 1 }],
      gender_text: function(grade) {
        if (grade === 0) return "남";
        if (grade === 1) return "여";
      },
      belong_items: [
        { text: "유치부", id: 0 },
        { text: "유초등부", id: 1 },
        { text: "중고등부", id: 2 },
        { text: "청년부", id: 3 }
        // { text: '면려회', id: 4 }
      ],
      belong_text: function(belong) {
        if (belong === 0) return "유치부";
        if (belong === 1) return "유초등부";
        if (belong === 2) return "중고등부";
        if (belong === 3) return "청년부";
      },
      grade_items: [
        { text: "등록", id: 0 },
        { text: "새신자", id: 1 },
        { text: "장기결석", id: 2 },
        { text: "보류", id: 3 }
      ],
      grade_text: function(grade) {
        if (grade === 0) return "등록";
        if (grade === 1) return "새신자";
        if (grade === 2) return "장기결석";
        if (grade === 3) return "보류";
      },
      baptism_items: [
        { text: "세례", id: 0 },
        { text: "입교", id: 1 },
        { text: "학습", id: 2 },
        { text: "유아", id: 3 }
      ],
      baptism_text: function(baptism) {
        if (baptism === 0) return "세례";
        if (baptism === 1) return "입교";
        if (baptism === 2) return "학습";
        if (baptism === 3) return "유아";
      },
      selectedBelong: ["유치부", "유초등부", "중고등부", "청년부"],
      date_menu: false,
      // tempimg: require('../../assets/img/25.jpeg'),//'/home/edo/piccolo/res/img/18.jpg',

      pagination: {
        page: 1,
        rowsPerPage: 10,
        totalItems: 0,
        rowsPerPageItems: [5, 10, 15, 20, 25]
      },
      //   bdate: ("1990-01-01").substr(0, 10),
      editedIndex: -1,
      defaultItem: {
        id: -1,
        name: "",
        address: "",
        phone: "",
        gender: 0,
        birth: null,
        photo: null,
        offrate: 0,
        belong: -1,
        tag: "",
        connected: "",
        grade: -1,
        baptism: -1
      },
      editedItem: {
        id: -1,
        name: "",
        address: "",
        phone: "",
        gender: 0,
        birth: null,
        photo: null,
        offrate: 0,
        belong: -1,
        tag: "",
        connected: "",
        grade: -1,
        baptism: -1
        //info: 'adf'//'이름 :'+this.name+" 주소 : "+this.address+" 전화번호 : "+this.phone
      },

      // ------- zz test --------------
      editDialog: false,
      removeDialog: false,
      membersLoading: false,
      menuBirthday: false,
      isEditMode: false,
      memberData: [],
      memberHeader: [
        { text: "", value: "expand", align: "end" },
        { text: "사진", value: "photo", sortable: false, align: "center" },
        { text: "이름", value: "name", sortable: true, align: "center" },
        { text: "연락처", value: "phone", sortable: false, align: "center" },
        { text: "소속", value: "belong", sortable: true, align: "center" },
        { text: "등록", value: "grade", sortable: true, align: "center" },
        { text: "조", value: "connected", sortable: true, align: "center" },
        { text: "수정/삭제", value: "action", sortable: false, align: "center" }
      ],
      belongChipStyle: [
        "lime darken-2",
        "orange lighten-2",
        "deep-orange lighten-2",
        "light-blue lighten-2"
      ],
      descBelong: ["유치부", "유초등부", "중고등부", "청년부"],
      descGrade: ["등록", "새신자", "장기결석", "보류"],
      descGender: ["남", "여"],
      descBoptism: ["세례", "입교", "학습", "유아"],
      selectedMember: { name: "", gender: 0 },

      selectedBelongs: [0, 1, 2, 3],

      itemsBelong: [
        { no: 0, text: "유치부" },
        { no: 1, text: "유초등부" },
        { no: 2, text: "중고등부" },
        { no: 3, text: "청년부" }
      ],

      imageName: "",
      imageUrl: "",
      imageFile: null
    };
  },
  mounted() {
    this.getmembers();
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "새 친구" : "정보 수정";
    },
    filteredHeaders() {
      return this.headers.filter(h => h.grade >= this.userGrade);
    },
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
    pickImageFile() {
      this.$refs.image.click();
    },

    onImageFilePicked(e) {
      console.log(`image file picked `);
      console.log(e.target.files);

      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener("load", () => {
          console.log("load complete ");
          console.log(fr);
          this.imageUrl = fr.result;
          this.imageFile = files[0];

          console.log(`imageFile : ${this.imageFile.name}`);
          console.log(this.imageFile);
        });
      } else {
        this.imageName = "";
        this.imageFile = "";
        this.imageUrl = "";
      }
    },

    createMember() {
      console.log(`create new member`);
      this.isEditMode = false;
      this.selectedMember = { id: -1 };
      this.imageUrl = null;
      this.editDialog = true;
    },
    editMember(_member) {
      console.log(`try edit member. name:${_member.name} id:${_member.id}`);
      this.imageFile = null;
      this.isEditMode = true;
      this.selectedMember = _member;
      this.editedIndex = this.members.indexOf(_member);
      this.imageUrl = this.getImgUrl(this.selectedMember.photo);
      this.editDialog = true;
      this.clearImages();
    },
    removeMember(_member) {
      apiService.deleteMembers(_member.id).then(res => {
        var index = this.members.indexOf(_member);
        console.log(`삭제할 회원 아이템의 인덱스는 :${index}`);
        if (index > -1) this.members.splice(index, 1);

        index = this.members_org.indexOf(_member);
        if (index > -1) this.members_org.splice(index, 1);

        this.removeDialog = false;
      });
    },

    openRemoveDialog(_member) {
      console.log(`try remove member. name:${_member.name}`);
      this.selectedMember = _member;
      this.removeDialog = true;
    },

    onChipClose(chip) {
      console.log("onChipClose" + chip.search);
      const index = this.added_word.indexOf(chip);
      this.added_word.splice(index, 1);
      this.pre_categorized_items = this.members_org;
      this.members = [];

      if (this.added_word.length > 0) {
        for (var i = 0; i < this.added_word.length; i++) {
          console.log(this.added_word[i]);
          this.members = this.filtered_member_data(this.added_word[i].search);
          this.pre_categorized_items = this.members;
        }
      } else this.members = this.members_org;
    },
    add_word() {
      if (this.search == "") return;
      console.log("add word");
      this.pre_categorized_items = this.members;
      // this.added_word.push(Object()( id= this.added_word.length+1, active=true, search= this.search.trim().toLowerCase()))
      this.added_word.push(
        Object.assign(
          {},
          {
            id: this.added_word.length + 1,
            active: true,
            search: this.search.trim().toLowerCase(),
            data: this.members
          }
        )
      );
      this.search = "";
    },
    async search_text() {
      let search = this.search.trim().toLowerCase();
      // console.log(search);
      this.members =
        this.pre_categorized_items.length == 0
          ? this.members_org
          : this.pre_categorized_items;

      // let item_array = Array.from(items);
      // console.log(items)
      if (search) {
        // console.log(items)
        this.members = this.filtered_member_data(search);
      }
    },

    filtered_member_data(search) {
      console.log("filtered_member_data " + search);
      let items =
        this.pre_categorized_items.length == 0
          ? this.members_org
          : this.pre_categorized_items;
      items = items.filter(item => {
        var ret = [];
        if (item.name !== null && item.name!= undefined) ret = item.name.toLowerCase().includes(search);
        if (item.phone !== null && item.phone!= undefined) ret += item.phone.includes(search);
        if (item.connected !== null && item.connected != undefined)
          ret += item.connected.toLowerCase().includes(search);
        if (item.grade !== null && this.grade_text(item.grade) !== undefined)
          ret += this.grade_text(item.grade)
            .toLowerCase()
            .includes(search);
        if (
          item.baptism !== null &&
          this.baptism_text(item.baptism) !== undefined
        ) {
          ret += this.baptism_text(item.baptism)
            .toLowerCase()
            .includes(search);
        }
        if (
          item.belong !== null &&
          this.belong_text(item.belong) !== undefined
        ) {
          ret += this.belong_text(item.belong)
            .toLowerCase()
            .includes(search);
        }
        return ret;
      });
      return items;
    },

    changeBaptism(selectObj) {
      //  console.log(selectObj.id)
      this.editedItem.baptism = selectObj.id;
      console.log(this.editedItem);
    },
    changeBelong(selectObj) {
      console.log(selectObj.id);
      this.editedItem.belong = selectObj.id;
    },
    async changeCurrentBelong(selectObj) {
      console.log(selectObj);
      // this.selectedBelong.push(selectObj.id)
      // // this.$refs.current_select.item_text = '전체'

      // this.current_belong = selectObj.id;
      // var response = await apiService.fetchBelongMembers(this.current_belong);

      // this.members = response.data;
      // this.members_org = response.data;
    },
    belongAll() {
      // console.log(this.$refs.current_select);
      // this.getmembers();
    },
    changeGender(selectObj) {
      console.log(selectObj.id);
      this.editedItem.gender = selectObj.id;
    },
    changeGrade(selectObj) {
      console.log(selectObj.id);
      this.editedItem.grade = selectObj.id;
    },
    getImgUrl(pic) {
      // console.log('getImgUrl '+pic);
      if (pic === undefined) return pic;
      if (pic !== null) {
        try {
          return require(`../../../uploads/${pic}`);
          // return ''
        } catch (e) {
          return undefined;
        }
      }
    },

    async getmembers() {
      this.loading = true;
      this.membersLoading = true;
      const response = await apiService.fetchMembers();
      console.log(response);

      this.memberData = response.data;

      this.members = response.data;
      this.members_org = response.data;
      this.membersLoading = false;
      this.loading = false;
    },

    // onFileChange(e) {
    //   var files = e.target.files || e.dataTransfer.files;
    //   if (!files.length) return;
    //   // this.createImage(files[0]);
    //   this.selected_image = files[0];

    //   var reader = new FileReader();

    //   reader.readAsDataURL(this.selected_image);
    //   reader.onload = e => {
    //     this.cPhoto = e.target.result;
    //   };
    // },

    removeImage: function(e) {
      this.image = "";
    },
    checkMem() {},

    saveImage(memberId) {
      console.log(`--- save image . id:${memberId}`);
      let formData = new FormData();
      if (this.imageFile !== null) {
        console.log(
          `---> saveImage. item_id:${memberId} name:${this.imageFile.name}`
        );

        formData.append("file", this.imageFile, this.imageName);
        formData.append("id", memberId);
        formData.append("headers", ["Content-Type", "multipart/form-data"]);
      }
      return apiService.uploadMemPhoto(formData);
    },
    // 회원정보 저장

    clearImages() {
      this.imageName = "";
      this.cPhoto = null;
    },
    async save() {
      try {
        this.loading = true;

        console.log(`회원정보 저장을 시도합니다.`);
        console.log(this.selectedMember.id);
        console.log(this.selectedMember.name);

        apiService.checkMembers(this.selectedMember).then(result => {
          if (result.data != "") {
            //already added name
            this.alert = true;
            console.log("already exist member. ");
            this.alertMsg = "이미 등록된 이름입니다";
            this.alert = true;
            setTimeout(() => {
              this.alert = !this.alert;
            }, 3000);
          } else {
            // 새로운 회원 추가
            if (this.selectedMember.id === -1) {
              console.log(`--- add member ---`);

              apiService
                .addMembers(this.selectedMember)
                .then(res => {
                  console.log(res);
                  console.log(`새로생성된 회원의 아이디는 : ${res.data.id}`);

                  this.selectedMember.id = res.data.id;
                  this.saveImage(res.data.id)
                    .then(resImage => {
                      console.log(`이미지 저장 응답`);
                      console.log(resImage);
                      this.selectedMember.photo = resImage.data.photo_url;
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  this.members.push(this.selectedMember);
                })
                .catch(error => {
                  console.log(error);
                  this.alertMsg = "생성에 예외가 발생했습니다 " + error;
                  this.alert = true;
                  setTimeout(() => {
                    this.alert = !this.alert;
                  }, 3000);
                })
                .finally(() => {
                  this.close();
                });
            } else {
              console.log(`---- update member id:${this.selectedMember.id}`);

              apiService
                .updateMembers(this.selectedMember)
                .then(resUpdate => {
                  console.log(resUpdate);
                  this.saveImage(this.selectedMember.id)
                    .then(resImage => {
                      console.log(`이미지 저장 응답`);
                      console.log(resImage);
                      this.selectedMember.photo = resImage.data.photo_url;
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  Object.assign(
                    this.members[this.editedIndex],
                    this.selectedMember
                  );
                })
                .catch(error => {
                  console.log(error);
                  this.alertMsg = "변경에 예외가 발생했습니다 " + error;
                  this.alert = true;
                  setTimeout(() => {
                    this.alert = !this.alert;
                  }, 3000);
                })
                .finally(() => {
                  this.close();
                });
              // 파일명 (경로)가 동일할 경우 갱신되지 않는다.)
            }
          }
        });
      } catch (err) {
        this.alertMsg = " 예외가 발생했습니다 " + error;
        this.alert = true;
        setTimeout(() => {
          this.alert = !this.alert;
        }, 3000);
        return console.log(err.message);
      } finally {
      }
    },

    close() {
      this.editDialog = false;
      console.log("close dialog");

      this.dialog = false;
      this.loading = false;
      setTimeout(() => {
        this.clearImages();
        this.selected_image = null;
        this.cPhoto = null;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>
