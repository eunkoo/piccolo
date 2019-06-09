<template>
  <div class="members">
      <div class="text-xs-center">
      <v-progress-circular
       v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-circular>
      </div>
    <v-layout xs12 sm6 md4 >
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
        >{{alertMsg}}</v-alert>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                    <div v-if="cPhoto">
                       <img img width="60px" height="80px"  :src="cPhoto" />
                    </div>
                    <div v-else>
                       <img img width="60px" height="80px"  :src="getImgUrl(editedItem.photo)" />
                    </div>
                     <input type="file" @change="onFileChange"/>
                </v-flex>

                <v-flex xs12 sm6 md4>
                  <v-text-field label="이름" v-model="editedItem.name"></v-text-field>
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
                    min-width="290px">
                    <v-text-field
                        slot="activator"
                        v-model="editedItem.birth"
                        label="생년월일"
                        readonly
                    ></v-text-field>
                    <v-date-picker locale='ko-KR' v-model="editedItem.birth" no-title scrollable>
                        <v-btn flat color="primary" @click="date_menu = false">취소</v-btn>
                        <v-btn flat color="primary" @click="$refs.date_menu.save(editedItem.birth)">확인</v-btn>
                    </v-date-picker>
                    </v-menu>
                </v-flex>
                <!-- <v-flex xs12 sm6 md4>
                  <v-date-picker label="Birth" v-model="editedItem.birth"></v-date-picker>
                </v-flex> -->
                <!-- <v-flex xs12 sm6 md4>
                    :v-model="belong_items[editedItem.belong]"
                  <v-text-field label="Photo" v-model="editedItem.photo"></v-text-field>
                </v-flex> -->
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
                <v-flex xs6 sm6 md4>
                  <v-text-field label="기타" v-model="editedItem.tag"></v-text-field>
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
      <v-flex :key="1" xs12 sm6 md6 v-if="userGrade==0">
            <download-excel
                class   = "btn btn-default"
                :data   = "members"
                :fields = "member_fields"
                type    = "csv"
                name    = "선택된 명단.xls"> 
                <v-btn fab >엑셀</v-btn>
            </download-excel>
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
     <v-data-table
      :headers="filteredHeaders"
      :pagination.sync="pagination"
      :rows-per-page-items="pagination.rowsPerPageItems"
      :total-items="pagination.totalItems"
      :items="members">
      
      <template slot="items" slot-scope="props">
        <td >
          <!-- <v-img  width="50px" height="50px"  :lazy-src="this.tempimg"></v-img> -->
          <img img width="60px" height="80px" :lazy-src="getImgUrl(props.item.photo)" :src="getImgUrl(props.item.photo)"/>
        </td>
          <!-- <td><img v-bind:src="this.tempimg" style="width:20px; height:auto;"></td> -->
          <!-- <tr class="text-xs-left">{{ props.item.name }}</tr> -->
          
        <!-- <td class="text-xs-left">{{ props.item.id}}</td> -->
        <td class="text-xs-left" style="min-width:80px">{{ props.item.name }}</td>
        <!-- <td class="text-xs-left">{{ props.item.address }}</td> -->
        <td class="text-xs-left" v-if="userGrade==0">{{ props.item.phone }}</td>
        <td class="text-xs-left" style="min-width:100px">{{ belong_text( props.item.belong) }}
        <td class="text-xs-left" style="min-width:100px">{{grade_text( props.item.grade)}}
        <td class="text-xs-left" style="min-width:90px">{{ props.item.connected }}</td>

        <td class="justify-center layout px-0" v-if="userGrade==0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteMembers(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="getmembers">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
  
</template>

  
<script>
import apiService from '@/Services/ApiService'
import axios from 'axios'
import downloadExcel from 'vue-json-excel'

export default {
  name: 'members',
  components:{
    downloadExcel
  },
  data () {
    return {
      alertMsg:"",
      alert:false,
       loading:false,
      search:'',
      members: [],
      members_org: [],
      dialog: false,
      selected_image:null,
      cPhoto:null,
      current_belong:-1,
       member_fields: {
            '이름': 'name',
            '소속':{
                field: 'belong',
                callback: (value) => {
                  console.log('execel field belong : '+ value)
                  if(value === 0 ) return '유치부'
                  if(value === 1 ) return '유초등부'
                  if(value === 2 ) return '중고등부'
                  if(value === 3 ) return '청년부'
                }
            },
            '조': 'connected',
            '주소':'address',
            '전화':'phone',
            '생년월일':'birth',
            '성별' : {
                field: 'gender',
                callback: (value) => {
                    if(value ===0) return '남'
                    else return '여'
                }
            },
            '등록여부': {
                field: 'grade',
                callback: (value) => {
                  console.log('execel field grade : '+ value)
                  
                    if(value ===0) return '등록'
                    if(value ===1) return'새신자'
                    if(value ===2) return'장기결석'
                    if(value ===3) return '보류'
                }
            },
            '세례여부' : {
                field: 'baptism',
                callback: (value) => {
                  console.log('execel field baptism : '+ value)
                  
                    if(value ===0) return'세례'
                    if(value ===1) return '입교'
                    if(value ===2) return'학습'
                    if(value ===3) return'유아'
                }
            },
    },
      gender_items: [
          { text: '남', id: 0 },
          { text: '여', id: 1 }
        ],
      belong_items: [
        { text: '유치부', id: 0 },
        { text: '유초등부', id: 1 },
        { text: '중고등부', id: 2 },
        { text: '청년부', id: 3 },
        // { text: '면려회', id: 4 }
      ],
      belong_text:function(belong){
          if(belong===0) return  '유치부'
          if(belong===1) return  '유초등부'
          if(belong===2) return  '중고등부'
          if(belong===3) return  '청년부'
      },
      grade_items:[
        { text: '등록', id: 0 },
        { text: '새신자', id: 1 },
        { text: '장기결석', id: 2 },
        { text: '보류', id: 3 }
      ],
      grade_text:function(grade){
          if(grade===0) return  '등록'
          if(grade===1) return  '새신자'
          if(grade===2) return  '장기결석'
          if(grade===3) return  '보류'
      },
      baptism_items:[
        { text: '세례', id: 0 },
        { text: '입교', id: 1 },
        { text: '학습', id: 2 },
        { text: '유아', id: 3 }
      ],
      baptism_text:function(baptism){
          if(baptism===0) return  '세례'
          if(baptism===1) return  '입교'
          if(baptism===2) return  '학습'
          if(baptism===3) return  '유아'
      },
      date_menu:false,
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
        name: '',
        address:'',
        phone:'',
        gender:0,
        birth:null,
        photo:null,
        offrate:0,
        belong:-1,
        tag:'',
        connected:'',
        grade:-1,
        baptism:-1
        //info: 'adf'//'이름 :'+this.name+" 주소 : "+this.address+" 전화번호 : "+this.phone
      },
      headers: [
          {
          text: "사진",
          align: 'center',
          sortable: false,
          value: 'photo'
          ,grade:1
        },
        {
          text: '이름',
          align: 'left',
          sortable: true,
          value: 'name'
          ,grade:1
        },
        // {
        //   text: '주소',
        //   align: 'left',
        //   sortable: false,
        //   value: 'address'
        // },
        {
          text: '연락처',
          align: 'left',
          sortable: false,
          value: 'phone'
          ,grade:0
        },
        {
          text: '소속',
          align: 'left',
          sortable: true,
          value: 'belong'
          ,grade:1
        },
         {
          text: '등록',
          align: 'left',
          sortable: true,
          value: 'grade'
          ,grade:1
        },
        {
          text: '조',
          align: 'left',
          sortable: true,
          value: 'connected',
          grade:1
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
        { text: '편집', value: 'name', sortable: false ,grade:0}
      ]
    }
  },
  mounted () {
    this.getmembers()
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? '새 친구' : '정보 수정'
    },filteredHeaders(){
    return this.headers.filter(h =>h.grade>=this.userGrade)
    },
    userGrade: {
      get: () => {
        return localStorage.getItem('grade')
      }
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    //   getCurBelong(){
    //       console.log(this.editedItem.belong)
    //       if(this.editedItem.belong===1)    return '유치부'
    //       else if(this.editedItem.belong===2)    return '유초등부'
    //       else if(this.editedItem.belong===4)    return '중고등부'
    //       else if(this.editedItem.belong===8)    return '청년부'
    //       else if(this.editedItem.belong===16)    return '면려회'
    //   },
     async search_text(){
      let search = this.search.trim().toLowerCase();
      console.log(search)
      //await this.getmembers();
      this.members = this.members_org
      let items =   this.members_org//this.getmembers();
      // let item_array = Array.from(items);
      // console.log(items)
      if (search) {
          items = items.filter(item => {
            var ret = []
            if(item.name !== null)
              ret = item.name.toLowerCase().includes(search) 
            if(item.phone !== null)
              ret += item.phone.includes(search) 
            if(item.connected !== null)
              ret += item.connected.toLowerCase().includes(search) 
            if(item.grade !== null && this.grade_text(item.grade)!== undefined)
              ret += this.grade_text(item.grade).toLowerCase().includes(search) 
            if(item.baptism !== null &&  this.baptism_text(item.baptism)!==undefined){
              ret = this.baptism_text(item.baptism).toLowerCase().includes( search ) 
            }
            return ret
          })
          // console.log(items)
           this.members = items
      }
     
     
      // const total = items.length;

      // setTimeout(() => {
      //     this.loading = false;
      //     resolve({
      //         items,
      //         total
      //     });
      // }, 300);
    },
    changeBaptism(selectObj){
        //  console.log(selectObj.id)
        this.editedItem.baptism = selectObj.id
        console.log(this.editedItem)
    },
    changeBelong(selectObj) {
        console.log(selectObj.id)
        this.editedItem.belong = selectObj.id
     },
     async changeCurrentBelong(selectObj) {
        // console.log( this.$refs.current_select)
        
        // this.$refs.current_select.item_text = '전체'

        this.current_belong = selectObj.id
        var response = await apiService.fetchMember(this.current_belong)
        
        this.members = response.data
        this.members_org = response.data

     },
     belongAll(){
         console.log( this.$refs.current_select)
         this.getmembers()
     },
    changeGender(selectObj) {
        console.log(selectObj.id)
        this.editedItem.gender = selectObj.id
     },
     changeGrade(selectObj){
        console.log(selectObj.id)
        this.editedItem.grade = selectObj.id
     },
   getImgUrl(pic) {
        if(pic === undefined) return pic
        if(pic !== null){
          try{
            return require('../../assets/img/'+pic);
          }catch(e){
            return undefined
          }
        }
       
    },
    async getmembers () {
      this.loading = true;
      const response = await apiService.fetchMembers()
      this.members = response.data
      this.members_org = response.data
      this.loading = false;
    },
   onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length)
        return;
      // this.createImage(files[0]);
      this.selected_image = files[0];

      var reader = new FileReader();

      reader.readAsDataURL(this.selected_image);
      reader.onload = (e) => {
        this.cPhoto = e.target.result;
      };
    },
    saveImage(items){
         console.log('saveImage')
      if(this.selected_image !== null  ){
           
          let formData = new FormData();
          formData.append('file',this.selected_image ,this.selected_image.name)
          // formData.append('tempFilePath','/home/edo/piccolo/res/img/')
          formData.append("headers", ['Content-Type', 'multipart/form-data']);
          // console.log(nid)
          apiService.uploadPhoto(formData,items.id)
        }
          this.selected_image = null;
          this.cPhoto = null;
    },
  
    removeImage: function (e) {
      this.image = '';
    },
    checkMem(){
      
    },
    async save () {
      try {
          this.loading = true;
          console.log("editIndex : "+this.editedIndex )
          apiService.checkMembers(this.editedItem)
          .then((result) => {
            if(result.data != "") {//already added name
              this.alert = true
              console.log("이미 등록됨")
              this.alertMsg = "이미 등록된 이름입니다"
              setTimeout(() => {
                  this.alert = !this.alert
              }, 3000)
            }else{
              if (this.editedIndex === -1) {
                 apiService.addMembers(this.editedItem)
                  .then((result) => {
                      this.editedItem = Object.assign({}, result.data)
                      this.members.push( this.editedItem)
                      this.saveImage(this.editedItem)
                  })
              } else {
                apiService.updateMembers(this.editedItem)
                .then((result) => {
                  this.saveImage(this.editedItem)
                })
                Object.assign(this.members[this.editedIndex], this.editedItem)
              }
              this.close()
            }
          })
      } catch (err) {
        return console.log(err.message)
      } finally {
        
      }
    },

    async deleteMembers (members) {
      const $this = this
      $this.$swal({
        title: '삭제 하시겠습니까',
        text: "삭제되면 다시 되돌릴 수 없습니다",
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: '아니요',
        confirmButtonText: '네 삭제 합니다'
      }).then((result) => {
        if (result.value) {
          apiService.deleteMembers(members.id)
          const index = this.members.indexOf(members)
          this.members.splice(index, 1)
        }
      })
    },

    editItem (item) {
      this.editedIndex = this.members.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
        // console.log(this.editedItem.belong)
    },

    close () {
      this.dialog = false
      this.loading = false;
      setTimeout(() => {
        this.selected_image = null
        this.cPhoto = null;
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    }
  }
}
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
</style>
