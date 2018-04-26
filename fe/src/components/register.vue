<template>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8>
            <v-card class="elevation-12">
              <v-toolbar dark color="indigo">
                <v-icon>star</v-icon>
                <v-toolbar-title>
                  <v-tooltip bottom>
                    <span slot="activator">NEMVV 로그인</span>
                    <span>Node Express MongoDB Vue Vuetify<br>테스트 사이트</span>
                  </v-tooltip>
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-container grid-list-xl fluid>
                    <v-layout wrap>
                      <v-flex xs12 sm6>
                        <v-text-field
                          prepend-icon="person"
                          v-model="form.id"
                          label="아이디"
                          :counter="20"
                          :error-messages="errors.collect('form.id')"
                          v-validate="'required|min:4|max:20'"
                          data-vv-name="form.id"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          prepend-icon="email"
                          v-model="form.email"
                          label="이메일"
                          :counter="80"
                          :error-messages="errors.collect('form.email')"
                          v-validate="'required|email|max:80'"
                          data-vv-name="form.email"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          id="pwd"
                          prepend-icon="lock"
                          v-model="form.pwd"
                          label="비밀번호"
                          :error-messages="errors.collect('form.pwd')"
                          v-validate="'required|min:6|max:20|'"
                          data-vv-name="form.pwd"
                          :counter="20"
                          type="password"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          prepend-icon="lock"
                          v-model="pwdCf"
                          label="비밀번호 확인"
                          :error-messages="errors.collect('pwdCf')"
                          v-validate="'required|min:6|max:20|confirmed:#pwd'"
                          data-vv-name="pwdCf"
                          :counter="20"
                          type="password"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          prepend-icon="nature_people"
                          v-model="form.name.last"
                          label="성"
                          :counter="20"
                          :error-messages="errors.collect('form.name.last')"
                          v-validate="'required|min:1|max:20'"
                          data-vv-name="form.name.last"
                          required
                        ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field
                          prepend-icon="face"
                          v-model="form.name.first"
                          label="이름"
                          :counter="20"
                          :error-messages="errors.collect('form.name.first')"
                          v-validate="'required|min:1|max:20'"
                          data-vv-name="form.name.first"
                          required
                        ></v-text-field>


                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-menu
                          ref="menu"
                          lazy
                          :close-on-content-click="false"
                          v-model="menu"
                          transition="scale-transition"
                          offset-y
                          full-width
                          :nudge-right="40"
                          min-width="290px"
                        >
                          <v-text-field
                            slot="activator"
                            label="생년월일"
                            v-model="form.birth"
                            prepend-icon="event"
                            readonly
                          ></v-text-field>
                          <v-date-picker
                            ref="picker"
                            v-model="form.birth"
                            locale="ko"
                            @change="save"
                            min="1900-01-01"
                            :max="new Date().toISOString().substr(0, 10)"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                      <v-flex xs12>
                        <v-checkbox
                          v-model="termsCheck"
                          :error-messages="errors.collect('termsCheck')"
                          v-validate="'required'"
                          data-vv-name="termsCheck"
                          type="checkbox"
                          value="1"
                          readonly
                        >
                          <div slot="label" @click.stop="">
                            <a href="javascript:;" @click.stop="termsDialog = true">이용약관</a>에 동의합니다.*
                          </div>
                        </v-checkbox>
                      </v-flex>
                    </v-layout>
                  </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="submit">가입</v-btn>
                    <!--<v-btn color="info" href="/#/sign">로그인</v-btn>-->
                    <v-btn color="secondary" @click="clear">초기화</v-btn>
                  </v-card-actions>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    이미 회원이신가요? <v-btn flat color="primary" href="/#/sign">로그인페이지</v-btn>
                  </v-card-actions>
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-dialog v-model="termsDialog" width="70%">
        <v-card>
          <v-card-title class="title">이용약관</v-card-title>
          <v-card-text>
            {{ temrsContent }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              flat
              color="warning"
              @click="termsDialog = false"
            >동의 안함</v-btn>
            <v-btn
              flat
              color="success"
              @click="agree"
            >동의</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-content>
</template>

<script>
  import ko from 'vee-validate/dist/locale/ko';

  export default {
    $_veeValidate: {
      validator: 'new',
    },
    name: 'register',
    data: () => ({
      path: 'auth/register',
      form: {
        id: '',
        pwd: '',
        email: '',
        name: {
          first: '',
          last: '',
        },
        birth: '1970-01-01',
      },
      pwd: '',
      pwdCf: '',
      termsCheck: null,
      termsDialog: false,
      temrsContent: `
        사이트 약관을 읽어주세요\n
        읽어야 가입 됩니다.\n
        글: ㅇㅇ
      `,
      dictionary: {
        messages: ko.messages,
        attributes: {
          'form.id': '아이디',
          'form.pwd': '비밀번호',
          'form.email': '이메일',
          'form.name.first': '성',
          'form.name.last': '이름',
          pwdCf: '비밀번호 확인',
          'form.birth': '생일',
          termsCheck: '이용약관',
        },
        custom: {
          // name: {
          //   required: () => 'Name can not be empty',
          //   max: 'The name field may not be greater than 10 characters',
          //   // custom messages
          // },
        },
      },
      menu: false,
    }),
    watch: {
      menu(val) {
        val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'));
      },
    },
    mounted() {
      this.$validator.localize('ko', this.dictionary);
    },
    methods: {
      swalSuccess(msg) {
        return this.$swal({
          icon: 'success',
          title: '성공',
          text: msg,
          timer: 2000,
        });
      },
      swalWarning(msg) {
        return this.$swal({
          icon: 'warning',
          title: '실패',
          text: msg,
          timer: 2000,
        });
      },
      swalError(msg) {
        return this.$swal({
          icon: 'error',
          title: '에러',
          text: msg,
          timer: 2000,
        });
      },
      submit() {
        this.$validator.validateAll()
          .then((vr) => {
            if (!vr) throw new Error('유효하지 않은 데이터 입니다');
            return this.$axios.post(`${this.$cfg.path.api}${this.path}`, this.form);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('회원가입 성공 이메일 확인 후 로그인 해주세요');
          })
          .then(() => {
            location.href = '/#/sign';
          })
          .catch((err) => {
            // this.clear();
            this.swalError(err.message);
          });

        // this.$axios.post(`${this.$cfg.path.api}${this.path}`, this.form)
        //   .then((res) => {
        //     if (!res.data.success) throw new Error(res.data.msg);
        //     return this.swalSuccess('회원가입 성공 이메일 확인 후 로그인 해주세요');
        //   })
        //   .then(() => {
        //     location.href = '/#/sign';
        //   })
        //   .catch((err) => {
        //     this.swalError(err.message);
        //   });
      },
      clear() {
        this.form.id = '';
        this.form.pwd = '';
        this.pwdCf = '';
        this.form.email = '';
        this.form.name.first = '';
        this.form.name.last = '';
        this.form.birth = '1970-01-01';
        this.$validator.reset();
      },
      save(date) {
        this.$refs.menu.save(date);
      },
      agree() {
        this.termsCheck = '1';
        this.termsDialog = false;
      },
    },
  };
</script>
