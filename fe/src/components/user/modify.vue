<template>
  <v-container fluid>
    <v-layout>
      <v-flex xs12>
        <v-card>
          <!--<v-card-media src="/static/doc-images/cards/desert.jpg">-->
          <!--</v-card-media>-->
          <v-card-title primary-title>
            <h3 class="headline mb-0">회원 정보 수정</h3>
          </v-card-title>
          <v-card-text>
            <v-alert type="info" dismissible v-model="alert">
              비밀번호는 암호화되어 보관되어집니다.<br>
              비밀번호 분실시 관리자도 알 수 없으므로 주의해서 변경하세요.
            </v-alert>
          </v-card-text>
          <v-card-title>
            <v-chip color="primary" text-color="white">
              <v-avatar>
                <v-icon>person</v-icon>
              </v-avatar>
              {{info.id}}
            </v-chip>
            <v-chip color="green" text-color="white">
              <v-avatar>
                <v-icon>email</v-icon>
              </v-avatar>
              {{info.email}}
            </v-chip>
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container grid-list-xl fluid>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field
                      id="pwd"
                      prepend-icon="lock"
                      v-model="form.pwd"
                      label="비밀번호 변경"
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
                      label="비밀번호 변경 확인"
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
                </v-layout>
              </v-container>
              <!--
                -->

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="warning" @click="submit">수정</v-btn>
              </v-card-actions>

            </v-form>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import ko from 'vee-validate/dist/locale/ko';

  export default {
    $_veeValidate: {
      validator: 'new',
    },
    name: 'userModify',
    data: () => ({
      path: 'data/user/id',
      alert: true,
      info: {
        id: '',
        email: '',
        pwd: '1234567890',
      },
      form: {
        pwd: '1234567890',
        name: {
          first: '',
          last: '',
        },
        birth: '1970-01-01',
      },
      pwdCf: '1234567890',
      termsCheck: null,
      termsDialog: false,
      temrsContent: `
        LOOP-OTA 사이트 약관을 읽어주세요\n
        읽어야 가입 됩니다.\n
        글: ㅇㅇ
      `,
      dictionary: {
        messages: ko.messages,
        attributes: {
          'form.pwd': '비밀번호 확인',
          pwdCf: '비밀번호 확인',
          'form.name.first': '성',
          'form.name.last': '이름',
          'form.birth': '생일',
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
    mounted() {
      this.$validator.localize('ko', this.dictionary);
      this.read();
    },
    methods: {
      onError(err) {
        if (err.response) {
          if (err.response.status === 401) {
            return this.swalError('인증시간이 만료되었습니다. 다시 로그인해주세요')
              .then(() => {
                location.href = '/#/sign';
              });
          }
        }
        this.swalError(err.message);
      },
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
      read() {
        this.$axios.get(`${this.$cfg.path.api}${this.path}`)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            this.info = res.data.d;
            this.info.pwd = this.form.pwd;
            this.form.name.first = res.data.d.name.first;
            this.form.name.last = res.data.d.name.last;
            this.form.birth = res.data.d.birth;
          })
          .catch((err) => {
            this.onError(err);
          });
      },
      submit() {
        this.$validator.validateAll()
          .then((vr) => {
            if (!vr) throw new Error('유효하지 않은 데이터 입니다');
            const usr = {};

            if (this.info.pwd !== this.form.pwd) {
              this.info.pwd = this.form.pwd;
              usr.pwd = this.form.pwd;
            }
            if (this.info.name.first !== this.form.name.first) {
              if (!Object.keys(usr).length) usr.name = {};
              usr.name.first = this.form.name.first;
            }
            if (this.info.name.last !== this.form.name.last) {
              if (!Object.keys(usr).length) usr.name = {};
              usr.name.last = this.form.name.last;
            }
            if (this.info.birth !== this.form.birth) usr.birth = this.form.birth;

            if (!Object.keys(usr).length) throw new Error('변경사항이 없습니다');

            return this.$axios.put(`${this.$cfg.path.api}${this.path}`, usr);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('회원정보 수정 완료');
          })
          .then(() => {
            this.read();
          })
          .catch((err) => {
            this.onError(err);
          });
      },
      save(date) {
        this.$refs.menu.save(date);
      },
    },
  };
</script>

<style scoped>

</style>
