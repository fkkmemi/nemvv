<template>
  <v-container fluid>
    <div class="text-xs-center">
      <v-tooltip left>
        <v-btn dark color="primary" slot="activator">Left</v-btn>
        <span>Left tooltip</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn dark color="primary" slot="activator">Top</v-btn>
        <span>Top tooltip</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn dark color="primary" slot="activator">Bottom</v-btn>
        <span>Bottom tooltip</span>
      </v-tooltip>
      <v-tooltip right>
        <v-btn dark color="primary" slot="activator">Right</v-btn>
        <span>Right tooltip</span>
      </v-tooltip>
    </div>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
