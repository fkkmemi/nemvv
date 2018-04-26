<template>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-alert type="warning" dismissible v-model="alert" class="mb-3">
              새로운 디비로 변경했습니다.<br>
              기존 nembv site의 계정은 접속이 안됩니다.<br>
              회원가입을 하시거나(이메일 인증 필요)<br>
              id: guest / pwd: 123456 으로 접속하시면 됩니다.
            </v-alert>
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
                  <v-text-field
                    prepend-icon="person"
                    label="아이디"
                    v-model="form.id"
                    :counter="20"
                    :error-messages="errors.collect('form.id')"
                    v-validate="'required|min:4|max:20'"
                    data-vv-name="form.id"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    label="비밀번호"
                    type="password"
                    v-model="form.pwd"
                    :error-messages="errors.collect('form.pwd')"
                    v-validate="'required|min:6|max:20|'"
                    data-vv-name="form.pwd"
                    required
                    @keyup.enter="submit"
                  ></v-text-field>
                  <v-checkbox
                    v-model="remember"
                    label="로그인 정보 저장(개인 장치에서만 사용하세요)"
                    value="1"
                  >
                    <div slot="label">
                      <v-tooltip bottom>
                        <span slot="activator">로그인 정보 저장</span>
                        <span>7일간 보관됩니다.<br>개인 장치에서만 사용하세요</span>
                      </v-tooltip>

                    </div>
                  </v-checkbox>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="submit">로그인</v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-spacer></v-spacer>
                이곳이 처음인가요? <v-btn flat color="primary" href="/#/register">회원가입</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</template>

<script>
  import ko from 'vee-validate/dist/locale/ko';

  export default {
    data: () => ({
      $_veeValidate: {
        validator: 'new',
      },
      path: 'auth/sign/in',
      alert: true,
      form: {
        id: '',
        pwd: '',
      },
      remember: null,
      // idRules: [
      //   v => !!v || '아이디를 입력해주세요',
      //   v => (v && v.length >= 2) || '아이디는 2자 보다 작을 수 없습니다',
      //   v => (v && v.length <= 20) || '아이디는 20자 보다 클 수 없습니다',
      // ],
      // pwdRules: [
      //   v => !!v || '비밀번호를 입력해주세요',
      //   v => (v && v.length >= 4) || '비밀번호는 4자 보다 작을 수 없습니다',
      //   v => (v && v.length <= 20) || '비밀번호는 20자 보다 클 수 없습니다',
      // ],
      dictionary: {
        messages: ko.messages,
        attributes: {
          'form.id': '아이디',
          'form.pwd': '비밀번호',
        },
        custom: {
          // name: {
          //   required: () => 'Name can not be empty',
          //   max: 'The name field may not be greater than 10 characters',
          //   // custom messages
          // },
        },
      },
    }),
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
            if (!this.remember) this.$cookie.set('token', res.headers['www-authenticate'], { expires: this.$cfg.rememberNotTime });
            // return this.swalSuccess(`token: ${res.data.token}`);
            // return this.swalSuccess(`token: ${res.headers['www-authenticate']}`);
            this.$user._id = res.data.d._id;
            this.$user.id = res.data.d.id;
            this.$user.name = res.data.d.name;
            this.$user.email = res.data.d.email;
            return this.swalSuccess('로그인 되었습니다. 메인페이지로 이동합니다');
          })
          .then(() => {
            location.href = '/#/';
          })
          .catch((err) => {
            this.swalError(err.message);
          });
      },
    },
  };
</script>
