<template>
  <v-container grid-list-xl>
    <v-layout flex-child wrap>
      <v-flex xs12 md12 d-flex>
        <v-flex xs12 md4 d-flex>
          <v-sheet class="d-flex" color="grey lighten-3" height="434" :elevation="ele">
            <sheet-footer>#1: (3r x 2c)</sheet-footer>
          </v-sheet>
        </v-flex>
      </v-flex>

      <v-flex xs12 md12 d-flex>
        <v-layout wrap>
          <v-flex xs12 md4 v-for=" sh in sheetData1">
            <v-card>
              <!-- <v-img
              :src="require('../../assets/img/who.jpg')"
              max-height="225"
              contain
              :class="sh.color"
              ></v-img>-->
              <v-card-title class="title white lighten-4">{{sh.text}}</v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 md12 d-flex>
        <v-layout wrap>
          <v-flex xs12 md4 v-for=" sh in sheetData2">
            <v-card>
              <!-- <v-img
              :src="require('../../assets/img/who.jpg')"
              max-height="225"
              contain
              :class="sh.color"
              ></v-img>-->
              <v-card-title class="title white lighten-4">{{sh.text}}</v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    ele: 12,
    sheetData1: [
      { color: "teal lighten-5", height: "300", text: "hi" },
      { color: "yellow lighten-5", height: "300", text: "hello" },
      { color: "purple lighten-5", height: "300", text: "yes" },
      { color: "pink lighten-5", height: "300", text: "ok" },
      { color: "brown lighten-5", height: "300", text: "hello" },
      { color: "green lighten-5 ", height: "300", text: "hello" },
      { color: "#874597 ", height: "300", text: "nice" }
    ],
    sheetData2: [
      { color: "teal lighten-5", height: "300", text: "hi" },
      { color: "blue lighten-5", height: "300", text: "hello" },
      { color: "purple lighten-5", height: "300", text: "happy" },
      { color: "green lighten-5", height: "300", text: "hello" },
      { color: "red lighten-5", height: "300", text: "awesome" },
      { color: "brown lighten-5 ", height: "300", text: "hello" },
      { color: "yellow lighten-5 ", height: "300", text: "hello" }
    ]
  }),
  components: {
    SheetFooter: {
      functional: true,

      render(h, { children }) {
        return h(
          "v-sheet",
          {
            staticClass: "mt-auto align-center justify-center d-flex",
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