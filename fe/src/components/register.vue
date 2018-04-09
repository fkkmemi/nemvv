<template>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="deep-orange">
                <v-toolbar-title>
                  <v-tooltip bottom>
                    <span slot="activator">LKSS 회원가입</span>
                    <span>LOOP Kids Safe School<br>루프 어린이 안심통학 서비스<br>가입후 관리자의 승인후에 사용할 수 있습니다.</span>
                  </v-tooltip>
                </v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="person"
                    label="아이디"
                    type="text"
                    v-model="form.id"
                    :rules="idRules"
                    :counter="20"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    label="비밀번호"
                    type="password"
                    v-model="form.pwd"
                    :rules="pwdRules"
                    :counter="20"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="lock"
                    label="비밀번호 확인"
                    type="password"
                    v-model="pwdCf"
                    :rules="pwdCfRules"
                    :counter="20"
                    required
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="email"
                    label="이메일"
                    type="email"
                    v-model="form.email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="submit">가입</v-btn>
                <v-btn color="info" href="/#/sign">로그인</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
</template>

<script>
  export default {
    name: 'register',
    data: () => ({
      path: 'auth/register',
      form: {
        id: '',
        pwd: '',
        email: '',
      },
      pwdCf: '',
      idRules: [
        v => !!v || '아이디를 입력해주세요',
        v => (v && v.length <= 20) || '아이디는 20자 보다 클 수 없습니다',
      ],
      pwdRules: [
        v => !!v || '비밀번호를 입력해주세요',
        v => (v && v.length <= 20) || '비밀번호는 20자 보다 클 수 없습니다',
        v => (v && v.length >= 4) || '비밀번호는 4자 보다 작을 수 없습니다',
      ],
      pwdCfRules: [
        v => !!v || '비밀번호를 입력해주세요',
        v => (v && v.length <= 20) || '비밀번호는 20자 보다 클 수 없습니다',
        v => (v && v.length >= 4) || '비밀번호는 4자 보다 작을 수 없습니다',
      ],
      emailRules: [
        v => !!v || '이메일을 입력해주세요',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '이메일 형식이 아닙니다',
      ],
    }),
    props: {
      source: String,
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
        if (this.form.pwd !== this.pwdCf) return this.swalError('비밀번호를 다시 확인하세요');
        this.$axios.post(`${this.$cfg.path.api}${this.path}`, this.form)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('회원가입 성공 관리자의 승인을 기다려주세요');
          })
          .then(() => {
            location.href = '/#/sign';
          })
          .catch((err) => {
            this.swalError(err.message);
          });
      },
    },
  };
</script>
