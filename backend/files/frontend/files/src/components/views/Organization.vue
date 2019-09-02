<template>
  <v-container grid-list-xl>
    <v-layout flex-child wrap>
      <v-layout wrap fill-height>
        <v-flex xs12 sm3 md3>
          <v-select
            id="selected_year"
            :items="years_items"
            v-model="default_year"
            single-line
            item-text="value"
            item-value="year"
            return-object
            @change="changeYear"
          ></v-select>
        </v-flex>
      </v-layout>

      <v-flex xs12 md12 :key="belong.id" v-for=" belong in belong_items">
        <v-flex xs12 md12>
          <v-sheet :color="belong.color" max-width="520" min-height="520" :elevation="ele">
            <v-flex xs12 md12>
              <v-flex xs12 md12 class="card-outter">
                <sheet-footer>{{belong.text}}</sheet-footer>
              </v-flex>

              <v-img contain height="400" :src="getImgUrl(belong.data.photo)" v-if="belong.data">
                <v-flex xs12 md12 class="card-actions">
                  <v-btn fab small @click="onChangeBgImge(belong.data)">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>
                  <v-btn
                    fab
                    small
                    slot="activator"
                    color="grey lighten-1"
                    class="mb-2"
                    @click="onAdded(belong.id)"
                  >
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-flex>
              </v-img>
            </v-flex>
          </v-sheet>

          <v-layout wrap>
            <v-flex :key="org.name" xs12 md3 v-for=" org in belongData(belong.id)">
              <v-card>
                <v-flex xs12 md12>
                  <v-img :src="getImgUrl(org.photo)" height="210" contain :class="org.color">
                    <v-btn fab small @click="onEdited(org)">
                      <v-icon>keyboard_arrow_up</v-icon>
                    </v-btn>
                  </v-img>
                  <v-card-title class="title white lighten-4">{{org.role}} : {{org.name}}</v-card-title>
                </v-flex>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-dialog v-model="bgDialong" max-width="500px">
      <v-card>
        <v-card-text>
          <v-alert outlined color="error" icon="warning" :value="alert" v-text="alertMsg"></v-alert>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 class="grey lighten-3">
                <v-img :src="imageUrl" min-height="200" max-height="440" v-if="imageUrl"></v-img>
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
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="primary" @click.native="save">저장</v-btn>
          <v-btn flat color="primary" @click.native="close">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addDialog" max-width="300px">
      <v-card>
        <v-card-text>
          <v-alert outlined color="error" icon="warning" :value="alert" v-text="alertMsg"></v-alert>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 class="grey lighten-3">
                <v-img :src="imageUrl" min-height="200" max-height="440" v-if="imageUrl"></v-img>
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
              </v-flex>

              <v-flex xs12 sm12 md12>
                <div class="title">{{belong_items[selectedMember.belongs].text}}</div>
                <v-text-field label="직책" v-model="selectedMember.role"></v-text-field>
                <v-text-field label="이름" v-model="selectedMember.name"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="editMode" flat color="secondary" @click.native="delOrgs">삭제</v-btn>
          <v-btn flat color="primary" @click.native="save">저장</v-btn>
          <v-btn flat color="primary" @click.native="close">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
const apiService = require( "@/Services/ApiService");
require('../../assets/css/organization.css')

module.exports = {
  name: "organization",
  computed: {
    years_items() {
      const year = new Date().getFullYear();
      return Array.from(
        { length: year - 2000 },
        (value, index) => year - index
      );
    }
  },
  data: () => ({
    editedIndex: -1,
    alertMsg: "",
    alert: false,
    imageName: "",
    imageUrl: "",
    imageFile: null,
    editMode: false,
    addDialog: false,
    bgDialong: false,
    selectedMember: { name: "", role: "", belongs: 0 },
    ele: 30,
    loading: false,
    belong_items: [
      { text: "유치부", id: 0, color: "blue lighten-3", data: null },
      { text: "유초등부", id: 1, color: "yellow lighten-3", data: null },
      { text: "중고등부", id: 2, color: "purple lighten-3", data: null },
      { text: "청년부", id: 3, color: "pink lighten-3", data: null }
      // { text: '면려회', id: '4' }
    ],
    default_year: new Date().getFullYear(),
    organizationData: []
  }),
  mounted() {
    this.getOrganization(new Date().getFullYear());
  },
  methods: {
    async getOrganization(year) {
      this.loading = true;
      const response = await apiService.fetchOrganization({ year: year });
      console.log(response);

      this.organizationData = response.data.filter(data => {
        return data.id > 3;
      });
      this.belong_items[0].data = response.data.filter(data => {
        return data.id == 0;
      })[0];
      this.belong_items[1].data = response.data.filter(data => {
        return data.id == 1;
      })[0];
      this.belong_items[2].data = response.data.filter(data => {
        return data.id == 2;
      })[0];
      this.belong_items[3].data = response.data.filter(data => {
        return data.id == 3;
      })[0];

      this.loading = false;
    },
    async changeYear(selectObj) {
      console.log("changeYear :" + selectObj);
      this.getOrganization(selectObj);
    },
    belongData(belongs) {
      // console.log("belongData :" + belongs);
      return this.organizationData.filter(o => {
        return o.belongs === belongs;
      });
    },
    onAdded(belongs) {
      console.log("onAdded " + belongs);
      this.clearImages();

      this.selectedMember = Object.assign(
        { name: "", role: "", belongs: 0, photo: "" },
        {
          belongs: belongs
        }
      );
      this.editMode = false;
      this.addDialog = true;
    },
    save() {
      if (this.selectedMember.name === "") {
        this.alertMsg = "이름을 입력하세요";
        this.alert = true;
        setTimeout(() => {
          this.alert = !this.alert;
        }, 3000);
        return;
      } else {
        if (this.editMode) {
          apiService
            .updateOrganization(Object.assign({}, this.selectedMember))
            .then(resUpdate => {
              console.log(resUpdate);
              Object.assign(this.selectedMember, resUpdate.data);
              this.saveImage(resUpdate.data.id)
                .then(resImage => {
                  console.log(`이미지 저장 응답`);
                  console.log(resImage);
                  this.selectedMember.photo = resImage.data.photo_url;
                })
                .catch(error => {
                  console.log(error);
                });

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
        } else {
          apiService
            .addOrganization(
              Object.assign({ year: this.default_year }, this.selectedMember)
            )
            .then(res => {
              console.log(res);
              console.log(`새로생성된 회원의 아이디는 : ${res.data.id}`);

              Object.assign(this.selectedMember, res.data);
              
              this.saveImage(res.data.id)
                .then(resImage => {
                  console.log(`이미지 저장 응답`);
                  console.log(resImage);
                  this.selectedMember.photo = resImage.data.photo_url;
                })
                .catch(error => {
                  console.log(error);
                });
              this.organizationData.push(this.selectedMember);
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
        }
      }
      this.close();
    },
    delOrgs() {
      apiService.deleteOrganization(this.selectedMember.id);
      const index = this.organizationData.indexOf(this.selectedMember);
      this.organizationData.splice(index, 1);
      this.close();
    },
    onEdited(org) {
      console.log("onEdited ");
      this.selectedMember = org;
      this.imageFile = null;
      this.editedIndex = this.organizationData.indexOf(this.selectedMember);
      console.log("index :" + this.editedIndex);

      this.imageUrl = this.getImgUrl(this.selectedMember.photo);
      this.editMode = true;
      this.addDialog = true;
    },
    getImgUrl(pic) {
      // console.log('getImgUrl '+pic);
      if (pic === undefined) return pic;
      if (pic !== null) {
        try {
          return require(`../../../uploads/org/${pic}`);
          // return ''
        } catch (e) {
          return undefined;
        }
      }
    },
    onChangeBgImge(data) {
      console.log("onChangeBgImge ");
      console.log(data);
      this.selectedMember = data;
      this.imageFile = null;
      // this.editedIndex = this.organizationData.indexOf(this.selectedMember);
      // console.log( "index :"+ this.editedIndex);

      this.imageUrl = this.getImgUrl(this.selectedMember.photo);
      this.editMode = true;
      this.bgDialong = true;
    },
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
    saveImage(orgId) {
      console.log(`--- save image . id:${orgId}`);
      let formData = new FormData();
      if (this.imageFile !== null) {
        console.log(
          `---> saveImage. item_id:${orgId} name:${this.imageFile.name}`
        );

        formData.append("file", this.imageFile, this.imageName);
        formData.append("id", orgId);
        formData.append("headers", ["Content-Type", "multipart/form-data"]);
      }
      return apiService.uploadOrgPhoto(formData);
    },
    // 회원정보 저장

    clearImages() {
      this.imageName = "";
      this.imageUrl = "";
    },
    close() {
      this.addDialog = false;
      this.bgDialong = false;
      this.editedIndex = -1;
      this.selectedMember = { name: "", role: "", belongs: 0, photo: "" };
      this.clearImages();
    }
  },
  components: {
    SheetFooter: {
      functional: true,

      render(h, { children }) {
        return h(
          "v-sheet",
          {
            staticClass: "mt-auto align-center  title justify-center d-flex ",
            props: {
              color: "rgba(0, 0, 0, .36)",
              dark: true,
              height: 50
            }
          },
          children
        );
      }
    }
  }
};
</script>
