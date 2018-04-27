# nemvv
Node Express Mongo Vue Vuetify

# cfg파일 작성

## ./cfg/cfg.js

```javascript
module.exports = {
  db: {
    url : "mongodb://id:password@xxx.com:27017/nemvv"
  },
  web: {
    host: 'localhost:3000',
    cors: true,
    secret_key : 'VeryUltraKey',
    http : {
      use : true,
      port : 3000,
      redirect : false
    },
    https : {
      use : true,
      port : 3001,
      key : './cfg/key/xxx.com.key',
      cert : './cfg/key/7d205546d3cd579e.crt',
      ca : './cfg/key/gd_bundle-g2-g1.crt'
    },
    jwt: {
      expiresIn: '7d',
      reTokenTime: 60*60*1,// 60*10,
    },
  },
  pm2: {
    deploy: {
      production: {
        user: 'root',
        host : [
          {
            host: 'xxx.com',
            port: '20002',
          }
        ],
        ref  : 'origin/master',
        repo : 'git@github.com:fkkmemi/nemvv.git',
        path : '/var/www/nemvv',
        'post-deploy' : 'yarn && cd fe && yarn && npm run build',
      },
      dev : {
        user: 'root',
        host : [
          {
            host: 'xxx.com',
            port: '20002',
          }
        ],
        ref  : 'origin/master',
        repo : 'git@github.com:fkkmemi/nemvv.git',
        path : '/var/www/nemvv',
        'post-deploy' : 'yarn && cd fe && yarn && npm run build && cd .. && pm2 startOrRestart ecosystem.config.js',
      }
    },
  },
  mail: {
    host: 'mail.xxx.com',
    port: 25,
    secure: false,
    auth: {
      user: 'admin@xxx.com',
      pass: 'emailpwd',
    },
  },
  dev : {
    log : true,
  },
};

```