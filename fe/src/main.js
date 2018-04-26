// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import moment from 'moment';
import swal from 'sweetalert';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueCookie from 'vue-cookie';
import VeeValidate from 'vee-validate';
import wysiwyg from 'vue-wysiwyg';

import 'babel-polyfill';
import cfg from '../static/cfg';
import App from './App';
import router from './router';
import '../node_modules/vuetify/dist/vuetify.min.css';
import '../node_modules/vue-wysiwyg/dist/vueWysiwyg.css';

moment.locale('ko');

if (process.env.NODE_ENV === 'development') cfg.path.api = 'http://localhost:3000/api/';

// const token = VueCookie.get('token');
// if (token) axios.defaults.headers.common.Authorization = VueCookie.get('token');

axios.interceptors.request.use((config) => {
  const token = VueCookie.get('token');
  // if (token)
  config.headers.Authorization = token;
  return config;
}, (err) => {
  return Promise.reject(err);
});

axios.interceptors.response.use((res) => {
  const rtk = res.headers['www-authenticate'];
  if (rtk) {
    VueCookie.set('token', rtk, { expires: cfg.cookie.expiresIn });
    axios.defaults.headers.common.Authorization = VueCookie.get('token');
  }
  return Promise.resolve(res);
}, (err) => {
  // if (err.response.status === 401) {
  //   // location.href = '/#/sign';
  //   err.message = 'authInvalid';
  // }
  // else {
  //   Promise.reject(err);
  // }
  return Promise.reject(err);
});

Vue.prototype.$axios = axios;
Vue.prototype.$cfg = cfg;
Vue.prototype.$moment = moment;
Vue.prototype.$swal = swal;
Vue.prototype.$cookie = VueCookie;
Vue.prototype.$user = {
  _id: '',
  id: '',
  name: '',
  email: '',
};

Vue.use(Vuetify);
Vue.use(VeeValidate);
Vue.use(VueGoogleMaps, {
  load: {
    key: cfg.google.mapKey,
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  },
  // installComponents: true,
});
Vue.use(wysiwyg, {
  hideModules: {
    orderedList: true,
    unorderedList: true,
    image: true,
    table: true,
    removeFormat: true,
    separator: true,
  },
});
// Vue.use(VueLodash, {});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
