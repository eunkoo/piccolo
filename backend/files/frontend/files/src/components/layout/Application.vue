<template>
  <div>
    <v-app>
      
      <v-navigation-drawer app  v-model="drawer">
        <v-list dense v-if="loggedIn && (userGrade==1)">
          <v-list-item v-for="(item, i) in menu_guest" :key="i" :to="{path: item.path}">
            <v-list-item-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.label"> {{ item.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list dense v-if="loggedIn && userGrade==0">
          <v-list-item v-for="(item, i) in menu_director" :key="i" :to="{path: item.path}">
            <v-list-item-action>
              <v-icon v-html="item.icon"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.label"> {{ item.label }} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="blue" >
        <v-app-bar-nav-icon  @click.stop="drawer = !drawer" ><strong >{{appTitle}}</strong ></v-app-bar-nav-icon>
        <v-toolbar-title style="width: 300px" class="ml-0 pl-3"></v-toolbar-title>
        <!-- <v-text-field
          flat
          solo-inverted
          prepend-icon="search"
          label="Search"
          class="hidden-sm-and-down"
        ></v-text-field>-->
        <v-spacer></v-spacer>
        <v-menu v-if="!loggedIn" open-on-hover top offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">
              <v-avatar size="32px" tile>
                <img src="../../assets/user-icon.svg" alt="Login" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item :key="items.login.title" @click.stop="dialogLogin = true, error=false">
              <v-list-item-title v-text="items.login.title"></v-list-item-title>
            </v-list-item>
            <v-list-item
              :key="items.register.title"
              @click.stop="dialogRegister = true, error=false"
            >
              <v-list-item-title v-text="items.register.title"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-dialog v-model="dialogLogin" max-width="800px">
          <v-card>
            <v-card-text>
              <v-card-title>
                <span class="headline">로그인</span>
              </v-card-title>
              <v-alert outlined color="error" icon="warning" :value="error" v-text="error"></v-alert>
              <v-form v-model="valid" ref="formLogin" lazy-validation>
                <v-text-field
                  prepend-icon="person"
                  label="E-mail"
                  v-model="email"
                  :rules="emailRules"
                  required
                  type="text"
                  placeholder="example@gmail.com"
                  @keyup.enter="login"
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  label="Password"
                  v-model="password"
                  :rules="passwordRules"
                  :counter="10"
                  required
                  type="password"
                  placeholder="비밀번호"
                  @keyup.enter="login"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn depressed large color="primary" @click.prevent="login">로그인</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogRegister" max-width="800px">
          <v-card>
            <v-card-text>
              <v-card-title>
                <span class="headline">가입</span>
              </v-card-title>
              <v-alert outlined color="error" icon="warning" :value="error" v-text="error"></v-alert>
              <v-form v-model="valid2" ref="formRegister" lazy-validation>
                <v-text-field
                  prepend-icon="face"
                  label="Name"
                  v-model="register.name"
                  :rules="nameRules"
                  required
                  type="text"
                  placeholder="이름"
                  @keyup.enter="checkUser"
                ></v-text-field>
                <v-text-field
                  prepend-icon="person"
                  label="Nick name"
                  v-model="register.apellidos"
                  required
                  type="text"
                  placeholder="별명"
                  @keyup.enter="checkUser"
                ></v-text-field>
                <v-text-field
                  prepend-icon="room"
                  label="Age"
                  v-model="register.edad"
                  required
                  type="text"
                  placeholder="나이"
                  @keyup.enter="checkUser"
                ></v-text-field>
                <v-text-field
                  prepend-icon="person"
                  label="E-mail"
                  v-model="register.email"
                  :rules="emailRules"
                  required
                  type="text"
                  placeholder="example@gmail.com"
                  @keyup.enter="checkUser"
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  label="Password"
                  v-model="register.password"
                  :rules="passwordRules"
                  :counter="10"
                  required
                  type="password"
                  placeholder="비밀번호"
                  @keyup.enter="checkUser"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn depressed large color="primary" dark @click.prevent="checkUser">등록</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app-bar>


      <v-content>
        <v-container fluid v-if="!loggedIn" fill-height>
          <v-row style="height: 1000px" align="center" justifyCenter >
            <v-col>


              <h2 class="display-3">00교회 교육부서</h2>
              <!-- <span class="subheading" v-text="msg"></span> -->
              <v-divider class="my-3"></v-divider>
              <div class="title mb-3">오른쪽 상단을 눌러 로그인을 해주세요</div>


            </v-col>
          </v-row>
        </v-container>
        <v-container fluid>
          <transition>
            <keep-alive>
              <router-view v-if="loggedIn"></router-view>
            </keep-alive>
          </transition>
        </v-container>
      </v-content>

      <v-footer app color="blue">
        <span>&copy; 2019 00교회</span>
      </v-footer>
      </v-app>
  </div>
</template>

<script>
const apiService = require("@/Services/ApiService");

module.exports = {
  mounted() {
    this.path = this.$route.path;
  },
  data() {
    return {
      tabs: null,
      dialogLogin: false,
      dialogRegister: false,
      drawer: null,
      appTitle: " 메뉴 ",
      loginTitle: "로그인",
      path: "/",
      menu_guest: [
        { path: "/", label: "홈", icon: "home" },
        { path: "/api/zstatistics", label: "통계", icon: "show_chart" },
        { path: "/api/members", label: "구성원", icon: "people" },
        { path: "/api/attendee", label: "주일 보고", icon: "description" },
        { path: "/logout", label: "로그아웃", icon: "lock" }
      ],
      menu_director: [
        { path: "/", label: "홈", icon: "home" },
        { path: "/api/zstatistics", label: "통계", icon: "show_chart" },
        { path: "/api/members", label: "구성원", icon: "people" },
        { path: "/api/organization", label: "교육 부서", icon: "business" },
        // {path: '/api/events', label: '부서 일정', icon: 'event'},
        { path: "/api/worship", label: " 예배 정보", icon: "info" },
        { path: "/api/attendee", label: "주일 보고", icon: "description" },
        { path: "/logout", label: "로그아웃", icon: "lock" }
      ],
      menu_master: [
        { path: "/", label: "홈", icon: "home" },
        { path: "/api/zstatistics", label: "통계", icon: "show_chart" },
        { path: "/api/members", label: "구성원", icon: "people" },
        { path: "/api/organization", label: "교육 부서", icon: "business" },
        // {path: '/api/events', label: '부서 일정', icon: 'event'},
        { path: "/api/worship", label: " 예배 정보", icon: "info" },
        { path: "/api/attendee", label: "주일 보고", icon: "description" },
        { path: "/logout", label: "로그아웃", icon: "lock" }
      ],
      items: {
        login: { title: "로그인" },
        register: { title: "가입" }
      },
      register: {
        name: "",
        apellidos: "",
        edad: "",
        email: "",
        password: ""
      },
      valid: true,
      valid2: true,
      nameRules: [
        v => !!v || "이름을 넣어주세요",
        v => (v && v.length <= 10) || "Name must be less than 10 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "이메일을 넣어주세요",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "이메일 형식이 아닙니다"
      ],
      password: "",
      passwordRules: [
        v => !!v || "비밀번호를 넣어주세요",
        v => v.length <= 10 || "비밀번호는 10자 이내로 넣어주세요"
      ],
      error: false
    };
  },
  computed: {
    loggedIn: {
      get: () => {
        return Boolean(localStorage.getItem("user"));
        // return true;
      }
    },
    userGrade: {
      get: () => {
        return localStorage.getItem("grade");
        // return 0;
      },
      userName: {
        get: () => {
          return localStorage.getItem("apellidos");
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      this.path = to.path;
    }
  },
  methods: {
    login() {
      if (this.$refs.formLogin.validate()) {
        apiService
          .userLogin({
            email: this.email,
            password: this.password
          })
          .then(response => this.loginSuccessful(response))
          .catch(response => this.loginFailed(response));
      }
    },
    loginSuccessful(response) {
      this.error = false;
      console.log("login success");
      console.log(response);
      localStorage.user = JSON.stringify(response.data);
      localStorage.apellidos = JSON.stringify(response.data.apellidos);
      if (response.data.grade == undefined)
        localStorage.grade = JSON.stringify(1);
      else localStorage.grade = JSON.stringify(response.data.grade);
      console.log(localStorage.getItem("loggedIn"));
      console.log(localStorage.getItem("grade"));

      window.history.replaceState(null, "", "/");
      window.history.go("/");
    },
    loginFailed(response) {
      console.log("login failed");
      console.log(response);
      this.error = response.response.data.message || "로그인에 실패했습니다";
      delete localStorage.token;
    },
    addUser() {
      if (this.$refs.formRegister.validate()) {
        apiService
          .addUser({
            name: this.register.name,
            apellidos: this.register.apellidos,
            edad: this.register.edad,
            email: this.register.email,
            password: this.register.password,
            grade: 1
          })
          .then(response => this.loginSuccessful(response))
          .catch(response => this.loginFailed(response));
      }
    },
    checkUser() {
      apiService
        .checkUser({
          name: this.register.name,
          apellidos: this.register.apellidos,
          edad: this.register.edad,
          email: this.register.email,
          password: this.register.password
        })
        .then(response => {
          console.log(response);
          if (response.data == "") this.addUser();
          else this.error = "동일한 이멜일이 존재합니다";
          delete localStorage.token;
        })
        .catch(response => console.log(response));
    }
  }
};
</script>
