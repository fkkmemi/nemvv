import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/index';
import sign from '@/components/sign';
import register from '@/components/register';
import e404 from '@/components/e404';
import notice from '@/components/board/notice';
import faq from '@/components/board/faq';
import qna from '@/components/board/qna';
import talk from '@/components/board/talk';
import HelloWorld from '@/components/test/HelloWorld';
import test from '@/components/test/test';

Vue.use(Router);

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
        },
        {
          path: '/faq',
          name: 'faq',
          component: faq,
        },
        {
          path: '/qna',
          name: 'qna',
          component: qna,
        },
        {
          path: '/talk',
          name: 'talk',
          component: talk,
        },
        {
          path: '/HelloWorld',
          name: 'HelloWorld',
          component: HelloWorld,
        },
        {
          path: '/test',
          name: 'test',
          component: test,
        },
      ],
    },
    {
      path: '/sign',
      name: 'sign',
      component: sign,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '*',
      name: 'e404',
      component: e404,
    },
  ],
});
