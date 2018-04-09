const cfg = require('./cfg/cfg');

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'nemvv',
      script    : 'bin/www',
      // watch: ["bin","routes","views","system"],
      ignore_watch : ["node_modules","cfg"],
      watch_options: {
          "followSymlinks": false
      },
      max_memory_restart : "2G",
      env: {
        COMMON_VARIABLE: 'true'
      },
      // env_production : {
      //   NODE_ENV: 'production'
      // },
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : cfg.pm2.deploy
};
