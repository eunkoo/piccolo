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
    <!-- <v-layout xs12 sm6 md4>
      <v-flex :key="2" xs12 sm6 md6>

      <v-dialog v-model="dialog" max-width="800px">
          <input onkeyup="enterkey" type="text"  value="" />
        <v-btn fab color="primary" dark slot="activator" class="mb-2" v-if="userGrade==0">
          <v-icon dark>add</v-icon>
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline grey lighten-2" primary-title>{{ formTitle }}</span>
          </v-card-title>

          <v-alert
            :value="alert"
            color="error"
            icon="error_circle"
            outline
          >
            {{alertMsg}}
          </v-alert>


            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <div v-if="cPhoto">
                      <img img width="60px" height="80px" :src="cPhoto">
                    </div>
                    <div v-else>
                      <img img width="60px" height="80px" :src="getImgUrl(editedItem.photo)">
                    </div>
                    <input type="file" @change="onFileChange">
                  </v-flex>


                <v-flex xs12 sm6 md4>
                  <v-text-field label="이름" v-model="editedItem.name"></v-text-field>
                </v-flex>

                <v-flex xs6>
                  {{ editedItem.gender }}
                  {{ gender_items[editedItem.gender] }}
                  <v-radio-group v-model="gender_items[editedItem.gender]" row>
                    <v-radio label="남자" :value="gender_items[0]"></v-radio>
                    <v-radio label="여자" :value="gender_items[1]"></v-radio>
                  </v-radio-group>
                </v-flex>


                <v-flex xs12 sm6 md4>
                  <v-text-field label="주소" v-model="editedItem.address"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="휴대폰" v-model="editedItem.phone"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
               <v-select
                  label="성별"
                  :items="gender_items"
                  v-model="gender_items[editedItem.gender]"
                  single-line
                  item-text="text"
                  item-value="id"
                  return-object
                  persistent-hint
                  @change="changeGender" 
                ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
               <v-select
                  label="등록상태"
                  :items="grade_items"
                  v-model="grade_items[editedItem.grade]"
                  single-line
                  item-text="text"
                  item-value="id"
                  return-object
                  persistent-hint
                  @change="changeGrade" 
                ></v-select>
                </v-flex>
                 <v-flex xs12 sm6 md4>

                    <v-menu
                      ref="date_menu"
                      :close-on-content-click="false"
                      v-model="date_menu"
                      :nudge-right="40"
                      :return-value.sync="editedItem.birth"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="editedItem.birth"
                        label="생년월일"
                        readonly
                      ></v-text-field>
                      <v-date-picker locale="ko-KR" v-model="editedItem.birth" no-title scrollable>
                        <v-btn flat color="primary" @click="date_menu = false">취소</v-btn>
                        <v-btn
                          flat
                          color="primary"
                          @click="$refs.date_menu.save(editedItem.birth)"
                        >확인</v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-flex>
                <v-flex xs12 sm6 md4>
                   <v-select
                    label="부서"
                    :items="belong_items"
                    v-model="belong_items[editedItem.belong]"
                    single-line
                    item-text="text"
                    item-value="id"
                    return-object
                    persistent-hint
                    @change="changeBelong" 
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="조" v-model="editedItem.connected"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                   <v-select
                    label="세례여부"
                    :items="baptism_items"
                    v-model="baptism_items[editedItem.baptism]"
                    single-line
                    item-text="text"
                    item-value="id"
                    return-object
                    persistent-hint
                    @change="changeBaptism" 
                  ></v-select>
                </v-flex>

                <v-flex xs12>
                  <v-textarea
                    box
                    name="input-7-4"
                    v-model="editedItem.tag"
                    :rows="3"
                    label="기타"
                    value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>



          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="save">저장</v-btn>
            <v-btn color="blue darken-1" flat @click.native="close">취소</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      </v-flex>
    </v-layout> -->
    <v-layout>
      <v-flex>
        <v-chip
          v-for="v in added_word"
          :key="v.id"
          v-model="v.active"
          close
          color="black"
          @input="onChipClose(v)"
          outline
        >{{v.search}}</v-chip>
        <v-text-field
          label="검색 후 엔터를 치세요"
          v-model="search"
          @input="search_text"
          @keyup.enter="add_word"
        ></v-text-field>
      </v-flex>
    </v-layout>


    <!-- 검색/필터 패널 -->
    <v-layout row wrap>
      <v-flex xs12 >
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
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs6 sm6 md4>
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
        </v-flex>
        &nbsp;&nbsp;
        <v-flex>
       <v-text-field label="이름, 연락처 또는 조이름으로 찾기" v-model="search" @input="search_text"></v-text-field>
        </v-flex>
     </v-layout>

   
    <v-layout row wrap>
      <v-flex xs12>
        <v-btn @click="createMember"> <v-icon class="pr-3"> person_add </v-icon> 회원 추가 </v-btn>
      </v-flex>
      <v-flex xs12>
        <!-- 회원정보 데이터 테이블 -->
        <v-data-table 
          :loading="membersLoading"
          :pagination.sync="pagination"
          :rows-per-page-items="pagination.rowsPerPageItems"
          :total-items="pagination.totalItems"
          :headers="memberHeader"
          :items="members">
          <v-progress-linear v-slot:progress color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <!-- <tr :class="[`belong_${props.item.belong}` ]"> -->
            <tr>
              <!-- <td :width="80" class="zguide"> {{ props.item.photo }} </td> -->
              <td :width="80" class="zguide"> 
                <v-img :src="props.item.photo" v-if="props.item.photo"> </v-img>
              </td>
              <td> <strong class="headline">{{ props.item.name }} </strong></td>
              <td> {{ props.item.phone }} </td>
              <!-- <td> {{ props.item.photo }} </td> -->
              <td> 
                <v-chip dark :color="belongChipStyle[props.item.belong]" text-color="white"> 
                  {{ descBelong[props.item.belong] }} 
                </v-chip>
              </td>
              <td> {{ descGrade[props.item.grade] }} </td>
              <td> {{ props.item.connected }} </td>
              <td>
                <v-btn small flat icon color="primary" @click="editMember(props.item)">
                  <v-icon> edit </v-icon>
                </v-btn>
                <v-btn small flat icon color="deep-orange" @click="openRemoveDialog(props.item)">
                  <v-icon> delete </v-icon>
                </v-btn>
              
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>



    <!-- 회원삭제 대화상자 -->
    <v-dialog v-model="removeDialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="headline pt-3">선택한 회원을 삭제하시겠습니까? </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs3 class="zguide">
              <v-img  max-height="125" contain :src="selectedMember.photo"></v-img>
            </v-flex>
            <v-flex xs9 class="px-3">
              <p> 삭제한 회원정보는 되돌릴 수 없으니 <strong class="red--text">주의</strong>하세요. </p>
              <p> 이름 : {{ selectedMember.name }} </p>
              <p> 부서 : {{ descBelong[selectedMember.belong] }} </p>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>          
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat outline @click="removeDialog = false"> 취소 </v-btn>
          <v-btn color="red darken-1" flat outline @click="removeMember(selectedMember)" > 삭제 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    
    
    
    <!-- 회원정보 추가/수정 대화상자 -->
    <v-dialog v-model="editDialog" persistent max-width="700px">
      <v-card >
        <v-layout>
          <v-flex xs4 class="zguide py-4 px-3 orange lighten-3">
            <v-img :src="imageUrl" min-height="200" max-height="440" v-if="imageUrl"></v-img>
            <v-text-field label="사진 선택" readonly hide-details prepend-icon="attach_file"
              @click='pickImageFile' v-model='imageName'></v-text-field>
            
            <v-spacer></v-spacer>
            <input type="file" style="display: none" ref="image" accept="image/*"
                name="photo"
                id="photo"
               @change="onImageFilePicked">
          </v-flex>


          <v-flex xs8>
            <v-card-title primary-title>
              <span class="headline"> 회원정보 수정 </span>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <!-- 이름 -->
                <v-flex xs6 pa-1 ma-0>
                  <v-text-field color="blue" hide-details label="이름" v-model="selectedMember.name"> </v-text-field>
                </v-flex>
                <!-- 성별 (남:0 여:1) -->
                <v-flex xs2 pa-1 ma-0>
                  <v-select 
                    color="blue"
                    hide-details 
                    dense 
                    v-model="selectedMember.gender"
                    :items="[0,1]"
                    attach 
                    label="성별" 
                    persistent-hint>
                    <template slot="item" slot-scope="props">
                      {{ descGender[props.item] }}                      
                    </template>
                    <template slot="selection" slot-scope="props">
                      {{ descGender[props.item] }}
                    </template>
                  </v-select>
                </v-flex>
                <!-- 부서 (유치부:0, 유초등부:1, 중고등부:2, 청년부:3) -->
                <v-flex xs4 pa-1 ma-0>
                  <v-select 
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.belong" 
                    :items="[0,1,2,3]"
                    attach 
                    label="부서"                    
                    persistent-hint > 
                    <template slot="item" slot-scope="props">
                      {{ descBelong[props.item] }}
                    </template>                
                    <template slot="selection" slot-scope="props">
                      {{ descBelong[props.item] }}
                    </template>
                  </v-select>
                </v-flex>

                <!-- 조 -->
                <v-flex xs12 pa-1>
                  <v-text-field color="blue" hide-details label="조" v-model="selectedMember.connected"></v-text-field>
                </v-flex>

                <!-- 주소 -->
                <v-flex xs12 pa-1>
                  <v-text-field color="blue" hide-details label="주소" v-model="selectedMember.address"></v-text-field>
                </v-flex>
                <!-- 연락처 -->
                <v-flex xs6 pa-1>                  
                  <v-text-field color="blue" hide-details label="연락처" v-model="selectedMember.phone"></v-text-field>
                </v-flex>
                <!-- 등록상태 (등록:0, 새신자:1, 장기결석:2, 기타:3) -->
                <v-flex xs6 pa-1>
                  <v-select 
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.grade" 
                    :items="[0,1,2,3]"
                    attach 
                    label="등록상태"                    
                    persistent-hint > 
                    <template slot="item" slot-scope="props">
                      {{ descGrade[props.item] }}
                    </template>                
                    <template slot="selection" slot-scope="props">
                      {{ descGrade[props.item] }}
                    </template>
                  </v-select>
                </v-flex>

                <!-- 생년월일 -->
                <v-flex xs6 pa-1 ma-0>
                  <v-menu
                    color="blue"
                    ref="menuBirthday"
                    v-model="menuBirthday"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="selectedMember.birth"
                    lazy
                    offset-y
                    full-width
                    min-width="200px"
                  >
                    <v-text-field
                      hide-details
                      slot="activator"
                      v-model="selectedMember.birth"
                      label="생년월일"
                      prepend-icon="event"
                      readonly 
                      hint="select birthday"
                      persistent-hint
                    ></v-text-field>
                    <v-date-picker 
                      v-model="selectedMember.birth" 
                      :show-current="true"
                      @input="$refs.menuBirthday.save(selectedMember.birth)"></v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6 pa-1>
                  <!-- 세례 (세례:0, 입교:1, 학습:2, 유아:3) -->
                  <v-select 
                    color="blue"
                    hide-details
                    dense
                    v-model="selectedMember.baptism" 
                    :items="[0,1,2,3]"
                    attach 
                    label="세례여부"                    
                    persistent-hint > 
                    <template slot="item" slot-scope="props">
                      {{ descBoptism[props.item] }}
                    </template>                
                    <template slot="selection" slot-scope="props">
                      {{ descBoptism[props.item] }}
                    </template>
                  </v-select>

                </v-flex>

                <v-flex xs12 pa-1> 
                  <v-textarea color="blue" hide-details label="기타" rows="2" hint="Hint text"></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider light></v-divider>
            <v-card-actions class="pa-3">
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" outline flat @click="save"> <v-icon class="pr-2"> save </v-icon> 저장 </v-btn>
              <v-btn color="black darken-1" outline flat @click="close"> 취소 </v-btn>
            </v-card-actions>


          </v-flex>
        </v-layout>
      </v-card>


    </v-dialog >
  </div>
</template>

  
<script>
import apiService from "@/Services/ApiService";
import axios from "axios";
import downloadExcel from "vue-json-excel";
import Api from '@/Services/Api'

export default {
  name: "members",
  components: {
    downloadExcel
  },
  data() {
    return {
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
     
      gender_items: [{ text: "남", id: 0 }, { text: "여", id: 1 }],
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
        { text: '사진', value: 'photo' },
        { text: '이름', value: 'name' }, 
        { text: '연락처', value: 'phone' },
        { text: '소속', value: 'belong' },
        { text: '등록', value: 'grade' }, 
        { text: '조', value: 'group' },
        { text: '수정/삭제', value: '' },
      ],
      belongChipStyle: [ 'lime darken-2', 'orange lighten-2', 'deep-orange lighten-2', 'light-blue lighten-2' ],
      descBelong: ['유치부', '유초등부', '중고등부', '청년부'],
      descGrade: ['등록', '새신자', '장기결석', '보류'],
      descGender: ['남', '여'],
      descBoptism: ['세례', '입교', '학습', '유아'],
      selectedMember: { name: '', gender: 0 },      
      
      selectedBelongs: [0,1,2,3],


      itemsBelong: [ 
        { no: 0, text: '유치부' },
        { no: 1, text: '유초등부' },
        { no: 2, text: '중고등부' },
        { no: 3, text: '청년부' },
      ],

      imageName: '',
      imageUrl: '', 
      imageFile: null,


      headers: [
        {
          text: "사진",
          align: "center",
          sortable: false,
          value: "photo",
          grade: 1
        },
        {
          text: "이름",
          align: "left",
          sortable: true,
          value: "name",
          grade: 1
        },
        // {
        //   text: '주소',
        //   align: 'left',
        //   sortable: false,
        //   value: 'address'
        // },
        {
          text: "연락처",
          align: "left",
          sortable: false,
          value: "phone",
          grade: 0
        },
        {
          text: "소속",
          align: "left",
          sortable: true,
          value: "belong",
          grade: 1
        },
        {
          text: "등록",
          align: "left",
          sortable: true,
          value: "grade",
          grade: 1
        },
        {
          text: "조",
          align: "left",
          sortable: true,
          value: "connected",
          grade: 1
        },
        // {
        //   text: 'Gender',
        //   align: 'left',
        //   sortable: true,
        //   value: 'gender'
        // },
        // {
        //   text: 'Birth',
        //   align: 'left',
        //   sortable: true,
        //   value: 'birth'
        // },

        // {
        //   text: 'Belong',
        //   align: 'left',
        //   sortable: true,
        //   value: 'belong'
        // },
        // {
        //   text: 'offrate',
        //   align: 'left',
        //   sortable: false,
        //   value: 'offrate'
        // },
        // {
        //   text: 'tag',
        //   align: 'left',
        //   sortable: false,
        //   value: 'tag'
        // },
        { text: "편집", value: "name", sortable: false, grade: 0 }
      ]
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
    onImageFilePicked(e){
      console.log(`image file picked `);
      console.log(e.target.files);

      const files = e.target.files;
      if (files[0] !== undefined) {
        this.imageName = files[0].name;
        if (this.imageName.lastIndexOf('.') <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(files[0]);
        fr.addEventListener('load', () => {
          console.log('load complete');
          this.imageUrl = fr.result;
          this.imageFile = files[0];          

          console.log(`imageFile : ${this.imageFile.name}`);
          console.log(this.imageFile);

        });
      } else {
        this.imageName = '';
        this.imageFile = '';
        this.imageUrl = '';
      }
    },

    createMember(){
      console.log(`create new member`);
      this.isEditMode = false;
      this.selectedMember = { id: -1};
      this.imageUrl = null;
      this.editDialog = true;
    },
    editMember(_member){
      console.log(`try edit member. name:${_member.name} id:${_member.id}`);
      this.isEditMode = true;
      this.selectedMember = _member;
      this.imageUrl = this.selectedMember.photo;
      this.editDialog = true;
    },
    removeMember(_member){
      apiService.deleteMembers(_member.id)
        .then(res => {
          const index = this.members.indexOf(_member)
          console.log(`삭제할 회원 아이템의 인덱스는 :${index}`);
          this.members.splice(index, 1)
          this.removeDialog = false;
        });
    },

    openRemoveDialog(_member){
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

      if(this.added_word.length > 0 ){
        for (var i = 0; i < this.added_word.length; i++) {
          console.log(this.added_word[i]);
          this.members = this.filtered_member_data(this.added_word[i].search)
          this.pre_categorized_items = this.members;
        }
      }
      else
        this.members = this.members_org
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
      //await this.getmembers();
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
        if (item.name !== null) ret = item.name.toLowerCase().includes(search);
        if (item.phone !== null) ret += item.phone.includes(search);
        if (item.connected !== null)
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
      // var response = await apiService.fetchMember(this.current_belong);

      // this.members = response.data;
      // this.members_org = response.data;
    },
    belongAll() {
      console.log(this.$refs.current_select);
      this.getmembers();
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
      if (pic === undefined) return pic;
      if (pic !== null) {
        try {
          return require("../../assets/img/" + pic);
        } catch (e) {
          return undefined;
        }
      }
    },

    async getmembers () {
      // this.loading = true;
      this.membersLoading = true;
      const response = await apiService.fetchMembers()
      console.log(response);

      this.memberData = response.data;

      this.members = response.data
      this.members_org = response.data
      this.membersLoading = false;
      // this.loading = false;
    },

    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      // this.createImage(files[0]);
      this.selected_image = files[0];

      var reader = new FileReader();

      reader.readAsDataURL(this.selected_image);
      reader.onload = e => {
        this.cPhoto = e.target.result;
      };
    },


    removeImage: function(e) {
      this.image = "";
    },
    checkMem() {},
    

    saveImage(memberId) {
      console.log(`--- save image . id:${memberId}`);
      if(this.imageFile !== null  ){
        console.log(`---> saveImage. item_id:${memberId} name:${this.imageFile.name}`);
        let formData = new FormData();
        formData.append('file',this.imageFile , this.imageName)
        formData.append("headers", ['Content-Type', 'multipart/form-data']);
        return apiService.uploadPhoto(formData, memberId);
      }
      this.imageFile = null;
      this.imageName = '';
      this.cPhoto = null;
    },
    // 회원정보 저장 
    async save () {

      try {
        this.loading = true;

        console.log(`회원정보 저장을 시도합니다.`);
        console.log(this.selectedMember.id);
        console.log(this.selectedMember.name);

        apiService.checkMembers(this.selectedMember)
          .then((result) => {
            if(result.data != "") { //already added name
              this.alert = true
              console.log("already exist member. ")
              this.alertMsg = "이미 등록된 이름입니다"
              setTimeout(() => {
                  this.alert = !this.alert
              }, 3000)
            } else {
              // 새로운 회원 추가
              if (this.selectedMember.id === -1) {
                console.log(`--- add member ---`);

                apiService.addMembers(this.selectedMember)
                  .then(res => {
                    console.log(res);
                    console.log(`새로생성된 회원의 아이디는 : ${res.data.id}`);


                    this.selectedMember.id = res.data.id;
                    this.saveImage(res.data.id)
                      .then(resImage => {
                        console.log(`이미지 저장 응답`);
                        console.log(resImage);

                        this.selectedMember.id = res.data.id;
                        this.selectedMember.photo = resImage.data.photo_url;
                        this.members.push(this.selectedMember);
                        // this.members[this.selectedMember.id] = this.selectedMember;
                        // Object.assign(this.members[this.selectedMember.id], this.selectedMember);
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  })
                  .finally(() => {
                    this.close();
                  });
              } else {

                console.log(`---- update member id:${this.selectedMember.id}`);
                axios.all([ apiService.updateMembers(this.selectedMember), this.saveImage(this.selectedMember.id)])
                  .then(axios.spread((resUpdate, resImage) => {
                    console.log(resUpdate);
                    console.log(resImage);

                    // 파일명 (경로)가 동일할 경우 갱신되지 않는다.)
                    console.log(resImage.data.photo_url);
                    this.selectedMember.photo =  resImage.data.photo_url;

                  }))
                  .catch((error) => {
                    console.log(error);
                  })
                  .finally(() => {
                    this.close();
                  });
              }             
            }
          });
        
      } catch (err) {
        return console.log(err.message);
      } finally {
      }

    },


    close () {

      this.editDialog = false;
      console.log('close dialog')

      this.dialog = false
      this.loading = false;
      setTimeout(() => {
        this.selected_image = null;
        this.cPhoto = null;
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>

<style>
th {
  background-color: #dedede;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.zguide {
  border: 1px dashed dodgerblue;
}


</style>
