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
          <v-sheet class="d-flex" :color="belong.color" height="434" :elevation="ele">
            <sheet-footer>
              {{belong.text}}
              <v-flex xs3 sm3 md3 right>
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
            </sheet-footer>
          </v-sheet>

          <v-layout wrap>
            <v-flex :key="org.name" xs12 md3 v-for=" org in belongData(belong.id)">
              <v-card>         
                <v-img
                  :src="require('../../assets/logo.png')"
                  max-height="225"
                  contain
                  :class="org.color"
                >
                <v-btn fab small  @click="onEdited(org)">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>

                </v-img>
                <v-card-title class="title white lighten-4">
                  {{org.role}} : {{org.name}}
                </v-card-title>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>

    <v-dialog v-model="addDialog" max-width="300px">
      <v-card>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <div class="title">{{belong_items[selectedMember.belongs].text}}</div>
                <v-text-field label="직책" v-model="selectedMember.role"></v-text-field>
                <v-text-field label="이름" v-model="selectedMember.name"></v-text-field>                
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if='editMode' flat color="secondary" @click.native="delOrgs">삭제</v-btn>
          <v-btn flat color="primary" @click.native="addOrgs">저장</v-btn>
          <v-btn flat color="primary" @click.native="close">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import apiService from "@/Services/ApiService";
export default {
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
    editMode: false,
    addDialog: false,
    selectedMember: { name: "", role: "", belongs: 0 },
    ele: 30,
    loading: false,
    belong_items: [
      { text: "유치부", id: 0, color: "blue lighten-3" },
      { text: "유초등부", id: 1, color: "yellow lighten-3" },
      { text: "중고등부", id: 2, color: "purple lighten-3" },
      { text: "청년부", id: 3, color: "pink lighten-3" }
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
      const response = await apiService.fetchOrganization(year);
      console.log(response);

      this.organizationData = response.data;
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
      this.selectedMember = Object.assign(this.selectedMember, {
        belongs: belongs
      });
      this.editMode = false;
      this.addDialog = true;
    },
    addOrgs() {
      if (this.selectedMember.name === "") {
        console.log("이름을 입력하세요");
      } else {
        if (this.editMode) {
          apiService.updateOrganization(this.selectedMember);
        } else {
          apiService.addOrganization(
            Object.assign({ year: this.default_year }, this.selectedMember)
          );
           this.organizationData[this.organizationData.length] = this.selectedMember;
        }
      }
      this.close();
    },
    delOrgs(){
      apiService.deleteOrganization(this.selectedMember.id);
      const index = this.organizationData.indexOf(this.selectedMember);
      this.organizationData.splice(index, 1);
      this.close();
    },
    onEdited(org) {
      this.selectedMember = org;
      this.editMode = true;
      this.addDialog = true;
    },
    close() {
      this.addDialog = false;
      this.selectedMember = { name: "", role: "", belongs: 0 };
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