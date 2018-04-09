<template>
  <div>
  <v-navigation-drawer
    fixed
    v-model="drawer"
    app
  >
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>memi</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    <v-list>
      <v-list-group
        v-model="item.active"
        v-for="item in items"
        :key="item.title"
        :prepend-icon="item.action"
        no-action
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-for="subItem in item.items" :key="subItem.title" :to="subItem.to">
          <v-list-tile-content>
            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>{{ subItem.action }}</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
  <v-toolbar color="deep-orange" dark fixed app>
    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
    <!--<img src="/static/logo.png" height="40" />-->
    <v-icon>tag_faces</v-icon>
    <v-toolbar-title>
      <v-tooltip bottom>
        <span slot="activator">NEMVV</span>
        <span>Node.js Express.js MongoDB Vue Vuetify<br>https://github.com/fkkmemi/nemvv.git</span>
      </v-tooltip>
      <span class="hidden-sm-and-down"> Project</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>more_vert</v-icon>
    </v-btn>
  </v-toolbar>
  <v-content>
    <router-view/>
  </v-content>
  <v-footer color="blue-grey darken-4" dark inset app>
    <v-flex xs12 py-3 text-xs-center white--text>
      &copy;2018 — <strong>LOOP</strong>
    </v-flex>
    <!--<span class="white&#45;&#45;text">&copy; 2017 LOOP</span>-->
  </v-footer>
  </div>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      active: true,
      items: [
        {
          action: 'feedback',
          title: '게시판',
          items: [
            {
              title: '공지사항',
              to: {
                path: '/',
              },
            },
            {
              title: 'FAQ',
              to: {
                path: '/faq',
              },
            },
            {
              title: 'Q&A',
              to: {
                path: '/qna',
              },
            },
            {
              title: '이야기',
              to: {
                path: '/talk',
              },
            },
          ],
        },
        {
          action: 'developer_board',
          title: '개발자 도구',
          items: [
            {
              title: 'test',
              to: {
                path: '/test',
              },
            },
            {
              title: 'HelloWorld',
              to: {
                path: '/HelloWorld',
              },
            },
          ],
        },
      ],
    }),
    props: {
      source: String,
    },
  };
</script>
