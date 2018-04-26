import Vue from 'vue';
import Router from 'vue-router';
import VueCookie from 'vue-cookie';
import axios from 'axios';
import index from '@/components/index';
import sign from '@/components/sign';
import register from '@/components/register';
import e404 from '@/components/e404';
import user from '@/components/manage/user';
import userModify from '@/components/user/modify';
import notice from '@/components/board/notice';
import faq from '@/components/board/faq';
import qna from '@/components/board/qna';
import talk from '@/components/board/talk';
import HelloWorld from '@/components/test/HelloWorld';
import test from '@/components/test/test';
import cfg from '../../static/cfg';

Vue.use(Router);

const checkAuth = (to, from, next) => {
  // const token = VueCookie.get('token');
  //
  // if (token) {
  //   // axios.post()
  //   return next();
  // }
  //
  // next({
  //   path: '/sign',
  //   query: { redirect: to.fullPath },
  // });
  axios.post(`${cfg.path.api}page`, { page: to.path })
    .then((res) => {
      // throw new Error('test');
      // if (!res.data.success) return next(false); // throw new Error('api');
      // console.log(from.path);
      if (!res.data.d) return next(false);
      next();
    })
    .catch(() => {
      // console.log(err);
      // if (err.message === 'api') {
      //   return next(false);
      // }
      next('/sign');
      // if (VueCookie.get('token')) VueCookie.delete('token');
      // next('/sign');
      // return location.href = '/#/sign';
    });
};

const redirectPath = (to, from, next) => {
  // if (VueCookie.get('token')) return next('/'); // location.href = '/#/';
  VueCookie.delete('token');
  next();
};

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'index',
      component: index,
      children: [
        {
          path: '/',
          name: 'notice',
          component: notice,
          beforeEnter: checkAuth,
        },
        {
          path: '/faq',
          name: 'faq',
          component: faq,
          beforeEnter: checkAuth,
        },
        {
          path: '/qna',
          name: 'qna',
          component: qna,
          beforeEnter: checkAuth,
        },
        {
          path: '/talk',
          name: 'talk',
          component: talk,
          beforeEnter: checkAuth,
        },
        {
          path: '/user',
          name: 'user',
          component: user,
          beforeEnter: checkAuth,
        },
        {
          path: '/userModify',
          name: 'userModify',
          component: userModify,
          beforeEnter: checkAuth,
        },
        {
          path: '/HelloWorld',
          name: 'HelloWorld',
          component: HelloWorld,
          beforeEnter: checkAuth,
        },
        {
          path: '/test',
          name: 'test',
          component: test,
          beforeEnter: checkAuth,
        },
      ],
    },
    {
      path: '/sign',
      name: 'sign',
      component: sign,
      beforeEnter: redirectPath,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      beforeEnter: redirectPath,
    },
    {
      path: '*',
      name: 'e404',
      component: e404,
    },
  ],
});
