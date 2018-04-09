// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions,
  VTooltip,
  VForm,
  VCard,
  VTextField,
  VDivider,
  VJumbotron,
  VDataTable,
  VDatePicker,
  VPagination,
  VProgressLinear,
  VDialog,
  VAlert,
  VMenu,
} from 'vuetify';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueCookie from 'vue-cookie';

import 'babel-polyfill';
import cfg from '../static/cfg';
import App from './App';
import router from './router';
import '../node_modules/vuetify/src/stylus/app.styl';

moment.locale('ko');

if (process.env.NODE_ENV === 'development') cfg.path.api = 'http://localhost:3000/api/';

const token = VueCookie.get('token');
if (token) axios.defaults.headers.common.Authorization = VueCookie.get('token');
// axios.defaults.headers.common.Authorization = null;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.response.use((res) => {
  // console.log(res.headers);
  // if (res.data.token) {
  //   VueCookie.set('token', res.data.token, { expires: '2m' });
  //   axios.defaults.headers.common.Authorization = VueCookie.get('token');
  // }
  const rtk = res.headers['www-authenticate'];
  if (rtk) {
    VueCookie.set('token', rtk, { expires: '1h' });
    axios.defaults.headers.common.Authorization = VueCookie.get('token');
  }
  // console.log(res);
  return Promise.resolve(res);
}, (err) => {
  // console.log(err.response.status);
  if (err.response.status === 401) {
    // swal({
    //   icon: 'warning',
    //   title: '실패',
    //   text: '다시 로그인 해주세요',
    //   timer: 2000,
    // })
    //   .then(() => {
    //     location.href = '/#/sign';
    //     // return Promise.resolve({ success: true });
    //   })
    //   .catch((e) => {
    //     Promise.reject(e);
    //   });
    // return Promise.reject(err);
    // Promise.reject(err);
    location.href = '/#/sign';
  } else {
    Promise.reject(err);
  }
});

Vue.prototype.$axios = axios;
Vue.prototype.$cfg = cfg;
Vue.prototype.$moment = moment;
Vue.prototype.$swal = swal;
Vue.prototype.$cookie = VueCookie;

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions,
    VTooltip,
    VForm,
    VCard,
    VTextField,
    VDivider,
    VJumbotron,
    VDataTable,
    VDatePicker,
    VPagination,
    VProgressLinear,
    VDialog,
    VAlert,
    VMenu,
  },
});

Vue.use(VueGoogleMaps, {
  load: {
    key: cfg.google.mapKey,
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
  // installComponents: true,
});

Vue.config.productionTip = true;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
