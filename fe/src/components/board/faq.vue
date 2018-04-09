<template>
  <v-container fluid>
    <v-card flat>
      <v-card-text>
        <v-layout row>
          <v-flex xs8 sm4>
            <v-text-field
              label="검색"
              v-model="search"
            ></v-text-field>
          </v-flex>
          <v-flex class="text-xs-right">
            <!--<v-btn color="primary" fab small @click.native.stop="dialog = true">-->

            <!--<v-btn-->
            <!--color="primary"-->
            <!--fab-->
            <!--small-->
            <!--@click.native.stop="mdAddOpen">-->
            <!--<v-icon>add</v-icon>-->
            <!--</v-btn>-->
          </v-flex>
        </v-layout>

        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          :loading="loading"
          :total-items="totalItems"
          :pagination.sync="pagination"
          :rows-per-page-items="perPages"
          item-key="_id"
          rows-per-page-text=""
          class="elevation-1"
        >
          <template slot="no-data">
            <v-alert :value="true" color="info" icon="info">
              게시글이 하나도 없습니다
            </v-alert>
          </template>
          <template slot="headers" slot-scope="props">
            <tr>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable',
                          pagination.descending ? 'desc' : 'asc',
                          header.value === pagination.sortBy ? 'active' : '',
                          header.value === '_id' ? 'hidden-sm-and-down' : '',
                          header.value === 'u_id' ? 'hidden-sm-and-down' : '' ,
                          header.value === 'cmt_ids' ? 'hidden-md-and-down' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template slot="headerCell" slot-scope="props">
            <v-tooltip bottom>
              <span slot="activator">
                {{ props.header.text }}
              </span>
              <span>
                {{ props.header.text }}
              </span>
            </v-tooltip>
          </template>
          <template slot="items" slot-scope="props">
            <td class="hidden-sm-and-down">{{ id2time(props.item._id) }}</td>
            <td class="hidden-sm-and-down">{{ props.item.u_id.id }}</td>
            <td>{{ props.item.title }}</td>
            <td class="text-xs-right">{{ props.item.cntView }}</td>
            <td class="hidden-md-and-down text-xs-right">{{ props.item.cmt_ids.length }}</td>
            <td class="text-xs-right">
              <v-btn
                v-if="props.expanded"
                @click="props.expanded = false"
                color="info" fab small
              >
                <v-icon>keyboard_arrow_up</v-icon>
              </v-btn>
              <v-btn
                v-else
                @click="read(props)"
                color="info" fab small
              >
                <!--{{ props.expanded ? '보기' : '접기'}}-->
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="expand" slot-scope="props">
            <v-card>
              <v-card-title>
                <span class="hidden-md-and-up"><strong>등록일:</strong> {{ id2time(props.item._id) }}</span>
              </v-card-title>
              <v-card-title>
                <span class="hidden-lg-and-up"><strong>작성자:</strong> {{ props.item.u_id.id }}</span>
              </v-card-title>
              <v-card-title>
                <div v-html="props.item.content"></div>
              </v-card-title>
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


              <v-list two-line>
                <template v-for="(item, index) in props.item.cmt_ids">
                  <v-divider></v-divider>
                  <v-list-tile v-if="item.content" avatar :key="item._id" @click="">
                    <v-list-tile-avatar>
                      <img :src="`https://randomuser.me/api/portraits/men/${index}.jpg`" >
                    </v-list-tile-avatar>
                    <v-list-tile-content @click="mdReadCmtOpen(props, item)">
                      <v-list-tile-title v-html="item.u_id.id"></v-list-tile-title>
                      <!--<v-list-tile-sub-title style="white-space: pre;" v-html="item.content"></v-list-tile-sub-title>-->
                      <v-list-tile-sub-title v-html="item.content.substr(0,10)"></v-list-tile-sub-title>
                      <v-list-tile-sub-title v-html="id2time(item._id)"></v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" fab small @click="mdModCmtOpen(props, item)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn color="error" fab small @click="delCmt(props, item, index)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </v-list-tile>
                </template>
                <v-divider></v-divider>
                <v-list-tile @click="">
                  <v-list-tile-content>
                    <v-list-tile-title>새로운 댓글 작성</v-list-tile-title>
                  </v-list-tile-content>
                  <v-btn color="primary" fab small @click="mdAddCmtOpen(props)">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-list-tile>
              </v-list>
            </v-card>
          </template>
          <template slot="pageText" slot-scope="props">
            전체 {{ props.itemsLength }} : {{ props.pageStart }} - {{ props.pageStop }}
          </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
          <v-pagination v-model="pagination.page" :length="pages"></v-pagination>



        </div>
      </v-card-text>
      <v-btn
        absolute
        dark
        fab
        bottom
        right
        color="pink"
        @click.native.stop="mdAddOpen"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-card>

    <v-dialog v-model="md" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="md = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title v-if="mdMode">글 수정</v-toolbar-title>
          <v-toolbar-title v-else>새글 작성</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="mdFormClear">초기화</v-btn>
            <v-btn v-if="mdMode" dark flat @click="mod" :disabled="!mdValid">글수정</v-btn>
            <v-btn v-else dark flat @click="add" :disabled="!mdValid">글쓰기</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form v-model="mdValid" ref="mdForm" lazy-validation class="ma-3">
          <v-text-field
            label="제목"
            v-model="form.title"
            :rules="titleRules"
            :counter="80"
            required
          ></v-text-field>
          <!--<v-text-field-->
          <!--label="내용"-->
          <!--v-model="form.content"-->
          <!--:rules="contentRules"-->
          <!--:counter="10"-->
          <!--required-->
          <!--&gt;</v-text-field>-->
          <vue-editor v-model="form.content"></vue-editor>


          <!--<v-btn @click="clear">clear</v-btn>-->
        </v-form>

      </v-card>
    </v-dialog>

    <v-dialog v-model="mdCmt" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="mdCmt = false" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title v-if="mdCmtMode">댓글 수정</v-toolbar-title>
          <v-toolbar-title v-else>새댓글 작성</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click="mdCmtFormClear">초기화</v-btn>
            <v-btn v-if="mdCmtMode" dark flat @click="modCmt" :disabled="!mdCmtValid">댓글 수정</v-btn>
            <v-btn v-else dark flat @click="addCmt" :disabled="!mdCmtValid">댓글 쓰기</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-form v-model="mdCmtValid" ref="mdCmtForm" lazy-validation class="ma-3">
          <v-text-field
            label="내용"
            v-model="formCmt.content"
            :rules="contentRules"
            :counter="1000"
            multi-line
            required
          ></v-text-field>
          <!--<vue-editor v-model="formCmt.content"></vue-editor>-->
        </v-form>

      </v-card>
    </v-dialog>
    <v-dialog v-model="mdCmtRead" max-width="300">
      <v-card>
        <v-card-title class="headline">{{readCmt.u_id.id}}</v-card-title>
        <v-card-text style="white-space: pre;">{{readCmt.content}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="mdCmtRead = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import { VueEditor } from 'vue2-editor';

  export default {
    name: 'faq',
    components: {
      VueEditor,
    },
    data() {
      return {
        dialog: false,
        path: 'data/board/faq',
        search: '',
        totalItems: 0,
        pagination: {},
        selected: [],
        loading: false,
        headers: [
          { text: '등록일', value: '_id' },
          { text: '작성자', value: 'u_id' },
          { text: '제목', value: 'title' },
          { text: '조회', value: 'cntView' },
          { text: '댓글', sortable: false, value: 'cmt_ids' },
          { text: '내용', sortable: false, value: 'actions' },
        ],
        items: [],
        perPages: [5, 10, 20, 100],
        draw: 0,
        form: {
          _id: '',
          title: '',
          content: '',
        },
        formCmt: {
          bd_id: '',
          _id: '',
          content: '',
        },
        readCmt: {
          bd_id: '',
          _id: '',
          u_id: '',
          content: '',
        },
        row: {},
        rowCmt: {},
        titleRules: [
          v => !!v || '제목을 입력해주세요',
          v => (v && v.length <= 80) || '제목는 80자보다 클 수 없습니다.',
        ],
        contentRules: [
          v => !!v || '내용을 입력해주세요',
          v => (v && v.length <= 1000) || '내용은 1000자보다 클 수 없습니다.',
        ],
        md: false,
        mdValid: false,
        mdMode: false,
        mdCmt: false,
        mdCmtValid: false,
        mdCmtMode: false,
        mdCmtRead: false,
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
          this.list();
        },
        deep: true,
      },
    },
    mounted() {
      this.list();
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
      mdAddOpen() {
        this.form._id = '';
        this.form.title = '';
        this.form.content = '';
        this.mdFormClear();
        this.mdMode = false;
        this.md = true;
      },
      mdModOpen(p) {
        this.form._id = p.item._id;
        this.form.title = p.item.title;
        this.form.content = p.item.content;
        this.row = p;
        this.mdMode = true;
        this.md = true;
      },
      mdAddCmtOpen(p) {
        this.formCmt.bd_id = p.item._id;
        this.formCmt._id = '';
        this.formCmt.content = '';
        this.mdCmtFormClear();
        this.row = p;
        this.mdCmtMode = false;
        this.mdCmt = true;
      },
      mdModCmtOpen(p, v) {
        this.formCmt.bd_id = p.item._id;
        this.formCmt._id = v._id;
        this.formCmt.content = v.content;
        this.row = p;
        this.rowCmt = v;
        this.mdCmtMode = true;
        this.mdCmt = true;
      },
      mdReadCmtOpen(p, v) {
        this.readCmt.bd_id = p.item._id;
        this.readCmt._id = v._id;
        this.readCmt.u_id = v.u_id;
        this.readCmt.content = v.content;
        this.row = p;
        this.rowCmt = v;
        this.mdCmtRead = true;
      },
      ago(t) {
        if (!t) return 'unknown';
        return this.$moment(t).fromNow();
      },
      id2time(_id) {
        if (!_id) return 'unknown';
        return new Date(parseInt(_id.substring(0, 8), 16) * 1000).toLocaleString();
      },
      mdFormClear() {
        this.$refs.mdForm.reset();
      },
      mdCmtFormClear() {
        this.$refs.mdCmtForm.reset();
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
          this.loading = false;
          this.items = res.data.d.ds;
        })
          .catch((err) => {
            this.loading = false;
            this.swalError(err.message);
            this.items = [];
          });
      },
      read(r) {
        // if (r.expanded) {
        //   r.expanded = false;
        //   return;
        // }
        const _id = r.item._id;
        this.loading = true;
        this.$axios.get(`${this.$cfg.path.api}${this.path}/${_id}`)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            r.item.title = res.data.d.title;
            r.item.cntView = res.data.d.cntView;
            r.item.content = res.data.d.content;
            r.item.cmt_ids = res.data.d.cmt_ids;
            this.loading = false;
            r.expanded = true;
          })
          .catch((err) => {
            this.loading = false;
            this.swalError(err.message);
          });
      },
      add() {
        if (!this.$refs.mdForm.validate()) return this.swalError('모두 입력 해주세요');
        if (!this.form.content) return this.swalError('글 내용을 작성해 주세요');
        this.md = false;
        this.$axios.post(`${this.$cfg.path.api}${this.path}`, this.form)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('글 작성 완료');
          })
          .then(() => {
            this.list();
          })
          .catch((err) => {
            this.swalError(err.message);
          });
      },
      mod() {
        if (!this.$refs.mdForm.validate()) return this.swalError('모두 입력 해주세요');
        if (!this.form.content) return this.swalError('글 내용을 작성해 주세요');
        this.$swal({
          title: '작성한 글을 수정하시겠습니까?',
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
            this.read(this.row);
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('글 수정 취소');
          });
      },
      del(v) {
        this.$swal({
          title: '글 삭제',
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
            return this.swalSuccess('글 삭제 완료');
          })
          .then(() => {
            this.list();
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('글 삭제 취소');
          });
      },
      addCmt() {
        if (!this.$refs.mdCmtForm.validate()) return this.swalError('모두 입력 해주세요');
        if (!this.formCmt.content) return this.swalError('글 내용을 작성해 주세요');
        this.mdCmt = false;
        this.$axios.post(`${this.$cfg.path.api}${this.path}/comment`, this.formCmt)
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            this.row.item.cmt_ids.push(res.data.d);
            return this.swalSuccess('댓글 추가 완료');
          })
          .then(() => {
            // this.$refs.mdAddCmt.hide();
          })
          .catch((err) => {
            this.swalError(err.message);
          });
      },
      modCmt() {
        this.$swal({
          title: '댓글 수정 변경',
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
          .then((res) => {
            if (!res) throw new Error('');
            return this.$axios.put(`${this.$cfg.path.api}${this.path}/comment`, this.formCmt);
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            this.mdCmt = false;
            return this.swalSuccess('댓글 수정 완료');
          })
          .then(() => {
            // this.rowCmt.id = this.formCmt.id;
            this.rowCmt.content = this.formCmt.content;
            this.rowCmt.ut = new Date();
            // this.refresh();
          })
          .catch((err) => {
            if (err.message) this.swalError(err.message);
            else this.swalWarning('댓글 수정 취소');
          });
      },
      delCmt(p, cmt, i) {
        this.$swal({
          title: '댓글 삭제',
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
          .then((res) => {
            if (!res) throw new Error('');
            return this.$axios.delete(`${this.$cfg.path.api}${this.path}/comment`, {
              params: { _id: cmt._id },
            });
          })
          .then((res) => {
            if (!res.data.success) throw new Error(res.data.msg);
            return this.swalSuccess('댓글 삭제 완료');
          })
          .then(() => {
            p.item.cmt_ids.splice(i, 1);
          })
          .catch((err) => {
            if (err.message) return this.swalError(err.message);
            this.swalWarning('댓글 삭제 취소');
          });
      },
    },
  };
</script>

<style scoped>
</style>
