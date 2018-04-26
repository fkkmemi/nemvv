<template>
  <v-container fluid grid-list-md>
    <v-layout row>
      <v-flex xs8 sm4>
        <v-text-field
          label="검색"
          v-model="search"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-data-iterator
      content-tag="v-layout"
      row
      wrap
      :items="items"
      :rows-per-page-items="perPages"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :search="search"
      rows-per-page-text=""
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg3
      >
        <v-card>
          <v-card-title><h4>{{ props.item.id }}</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>등록일:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ id2time(props.item._id).toLocaleString() }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>이름:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ nameSum(props.item.name) }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>이메일:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.email }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>등급:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ `${props.item.lv} (${lv2Str(props.item.lv)})` }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
          <v-card-actions>
            <!--<div class="text-xs-right mr-3">-->
            <v-btn color="warning" fab small @click.native.stop="mdModOpen(props)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn color="error" fab small @click.native.stop="del(props.item)">
              <v-icon>delete</v-icon>
            </v-btn>
            <!--</div>-->
          </v-card-actions>
        </v-card>
      </v-flex>
      <template slot="pageText" slot-scope="props">
        전체 {{ props.itemsLength }} : {{ props.pageStart }} - {{ props.pageStop }}
      </template>
    </v-data-iterator>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <v-dialog v-model="md" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="md = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>수정</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="mdFormClear">초기화</v-btn>
            <v-btn dark flat @click="mod" :disabled="!mdValid">저장</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form v-model="mdValid" ref="mdForm" lazy-validation class="ma-3">
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
                <v-select
                  :items="lvs"
                  v-model="form.lv"
                  v-validate="'required|min:0|max:9'"
                  label="모델 목록"
                  single-line
                  required
                ></v-select>
                <!--
                  auto
                  append-icon="map"
                  hide-details-->
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>




  <!--<v-container fluid class="pa-0">-->
    <!--<v-card flat>-->
      <!--<v-card-text>-->
        <!--<v-layout row>-->
          <!--<v-flex xs8 sm4>-->
            <!--<v-text-field-->
              <!--label="검색"-->
              <!--v-model="search"-->
            <!--&gt;</v-text-field>-->
          <!--</v-flex>-->
          <!--<v-flex class="text-xs-right">-->
            <!--&lt;!&ndash;<v-btn color="primary" fab small @click.native.stop="dialog = true">&ndash;&gt;-->

            <!--&lt;!&ndash;<v-btn&ndash;&gt;-->
            <!--&lt;!&ndash;color="primary"&ndash;&gt;-->
            <!--&lt;!&ndash;fab&ndash;&gt;-->
            <!--&lt;!&ndash;small&ndash;&gt;-->
            <!--&lt;!&ndash;@click.native.stop="mdAddOpen">&ndash;&gt;-->
            <!--&lt;!&ndash;<v-icon>add</v-icon>&ndash;&gt;-->
            <!--&lt;!&ndash;</v-btn>&ndash;&gt;-->
          <!--</v-flex>-->
        <!--</v-layout>-->

        <!--<v-data-table-->
          <!--:headers="headers"-->
          <!--:items="items"-->
          <!--:search="search"-->
          <!--:loading="loading"-->
          <!--:total-items="totalItems"-->
          <!--:pagination.sync="pagination"-->
          <!--:rows-per-page-items="perPages"-->
          <!--item-key="_id"-->
          <!--rows-per-page-text=""-->
          <!--class="elevation-1"-->
        <!--&gt;-->
          <!--<template slot="no-data">-->
            <!--<v-alert :value="true" color="info" icon="info">-->
              <!--게시글이 하나도 없습니다-->
            <!--</v-alert>-->
          <!--</template>-->
          <!--<template slot="headerCell" slot-scope="props">-->
            <!--<v-tooltip bottom>-->
              <!--<span slot="activator">-->
                <!--{{ props.header.text }}-->
              <!--</span>-->
              <!--<span>-->
                <!--{{ props.header.text }}-->
              <!--</span>-->
            <!--</v-tooltip>-->
          <!--</template>-->
          <!--<template slot="items" slot-scope="props">-->
            <!--<td>{{ id2time(props.item._id).toLocaleString() }}</td>-->
            <!--<td>{{ props.item.id }}</td>-->
            <!--<td>{{ props.item.name }}</td>-->
            <!--<td>{{ props.item.email }}</td>-->
            <!--<td>{{ props.item.lv }}</td>-->
          <!--</template>-->

          <!--<template slot="pageText" slot-scope="props">-->
            <!--전체 {{ props.itemsLength }} : {{ props.pageStart }} - {{ props.pageStop }}-->
          <!--</template>-->
        <!--</v-data-table>-->
        <!--<div class="text-xs-center pt-2">-->
          <!--<v-pagination v-model="pagination.page" :length="pages"></v-pagination>-->
        <!--</div>-->
      <!--</v-card-text>-->
    <!--</v-card>-->



  <!--</v-container>-->
</template>

<script>
  import ko from 'vee-validate/dist/locale/ko';

  export default {
    $_veeValidate: {
      validator: 'new',
    },
    name: 'user',
    // components: {
    //   VueEditor,
    // },
    data() {
      return {
        dialog: false,
        path: 'data/user',
        search: '',
        totalItems: 0,
        pagination: {},
        selected: [],
        loading: false,
        headers: [
          { text: '등록일', value: '_id' },
          { text: '아이디', value: 'id' },
          { text: '이름', sortable: false, value: 'name' },
          { text: '이메일', value: 'email' },
          { text: '등급', value: 'lv' },
        ],
        items: [],
        lvs: [
          { text: '최고관리자', value: 0 },
          { text: '개발자', value: 1 },
          { text: '임직원', value: 2 },
          { text: '회사관리자:대량', value: 3 },
          { text: '회사관리자:단일', value: 4 },
          { text: '그룹관리자', value: 5 },
          { text: '그룹멤버', value: 6 },
          { text: '게스트:테스트회사', value: 7 },
          { text: '게스트:테스트그룹', value: 8 },
          { text: '게스트', value: 9 },
        ],
        perPages: [3, 6, 12, 24],
        draw: 0,
        form: {
          _id: '',
          id: '',
          name: {
            first: '',
            last: '',
          },
          email: '',
          lv: '',
        },
        row: {},
        idRules: [
          v => !!v || '제목을 입력해주세요',
          v => (v && v.length <= 80) || '제목는 80자보다 클 수 없습니다.',
        ],
        emailRules: [
          v => !!v || '내용을 입력해주세요',
          v => (v && v.length <= 1000) || '내용은 1000자보다 클 수 없습니다.',
        ],
        dictionary: {
          messages: ko.messages,
          attributes: {
            'form.id': '아이디',
            'form.email': '이메일',
            'form.name.first': '성',
            'form.name.last': '이름',
            'form.lv': '등급',
          },
          custom: {
            // name: {
            //   required: () => 'Name can not be empty',
            //   max: 'The name field may not be greater than 10 characters',
            //   // custom messages
            // },
          },
        },
        md: false,
        mdValid: false,
      };
    },
    watch: {
      pagination: {
        handler() {
          // this.getDataFromApi()
          //   .then(data => {
          //     this.items = data.items
          //     this.totalItems = data.total
          //   })
          // console.log('here');
          this.list();
        },
        deep: true,
      },
    },
    mounted() {
      this.$validator.localize('ko', this.dictionary);
      // this.list();
      // this.test();
    },
    computed: {
      setSkip() {
        if (this.pagination.page <= 0) return 0;
        return (this.pagination.page - 1) * this.pagination.rowsPerPage;
      },
      setOrder() {
        let order = this.pagination.sortBy;
        if (!this.pagination.sortBy) order = '_id';
        return order;
      },
      setSort() {
        return this.pagination.descending ? -1 : 1;
      },
      pages() {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0;

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
      },
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
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      mdModOpen(p) {
        this.form._id = p.item._id;
        this.form.id = p.item.id;
        this.form.email = p.item.email;
        this.form.name = p.item.name;
        this.form.lv = p.item.lv;
        this.row = p;
        this.md = true;
      },
      ago(t) {
        if (!t) return 'unknown';
        return this.$moment(t).fromNow();
      },
      id2time(_id) {
        if (!_id) return 'unknown';
        return new Date(parseInt(_id.substring(0, 8), 16) * 1000);
      },
      nameSum(name) {
        return `${name.last} ${name.first}`;
      },
      lv2Str(lv) {
        let s = '';
        this.lvs.forEach((v) => {
          if (v.value === lv) {
            s = v.text;
            return true;
          }
        });
        return s;
      },
      mdFormClear() {
        this.$refs.mdForm.reset();
      },
      list() {
        // let { sortBy, descending, page, rowsPerPage } = this.pagination;
        // if (!descending) descending = 1;
        // if (!sortBy) sortBy = 'id';
        this.loading = true;
        const p = this.$axios.get(`${this.$cfg.path.api}${this.path}`, {
          params: {
            draw: (this.draw += 1),
            search: this.search,
            skip: this.setSkip,
            limit: this.pagination.rowsPerPage,
            order: this.setOrder,
            sort: this.setSort,
          },
        });
        return p.then((res) => {
          if (!res.data.success) throw new Error(res.data.msg);
          this.totalItems = res.data.d.cnt;
          this.items = res.data.d.ds;
          this.loading = false;
        })
          .catch((err) => {
            this.swalError(err.message);
            this.items = [];
            this.loading = false;
          });
      },
      read(r) {
        r.expanded = true;
        // if (r.expanded) {
        //   r.expanded = false;
        //   return;
        // }
        // const _id = r.item._id;
        // this.loading = true;
        // this.$axios.get(`${this.$cfg.path.api}${this.path}/${_id}`)
        //   .then((res) => {
        //     if (!res.data.success) throw new Error(res.data.msg);
        //     r.item.title = res.data.d.title;
        //     r.item.cntView = res.data.d.cntView;
        //     r.item.content = res.data.d.content;
        //     r.item.cmt_ids = res.data.d.cmt_ids;
        //     this.loading = false;
        //     r.expanded = true;
        //   })
        //   .catch((err) => {
        //     this.loading = false;
        //     this.swalError(err.message);
        //   });
      },
      mod() {
        if (!this.$refs.mdForm.validate()) return this.swalError('모두 입력 해주세요');
        this.$swal({
          title: '정말 수정하시겠습니까?',
          dangerMode: true,
          buttons: {
            cancel: {
              text: '취소',
              visible: true,
            },
            confirm: {
              text: '수정',
            },
          },
        })
          .then((sv) => {
            if (!sv) throw new Error('');
            this.md = false;
            return this.$axios.put(`${this.$cfg.path.api}${this.path}`, this.form);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            // this.row.expanded = false;
            return this.swalSuccess('글 수정 완료');
          })
          .then(() => {
            // this.read(this.row);
            this.list();
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('글 수정 취소');
          });
      },
      del(v) {
        this.$swal({
          title: '정말 삭제하시겠습니까?',
          dangerMode: true,
          buttons: {
            cancel: {
              text: '취소',
              visible: true,
            },
            confirm: {
              text: '삭제',
            },
          },
        })
          .then((sv) => {
            if (!sv) throw new Error('');
            return this.$axios.delete(`${this.$cfg.path.api}${this.path}`, {
              params: { _id: v._id },
            });
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('삭제 완료');
          })
          .then(() => {
            this.list();
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('삭제 취소');
          });
      },
    },
  };
</script>

<style scoped>
</style>
