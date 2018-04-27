const crypto = require('crypto');
const nodemailer = require('nodemailer');

const cfg = require('../cfg/cfg');

const transporter = nodemailer.createTransport(cfg.mail);

exports.v = { //variables
  db: {
    conn: null,
  },
};

exports.f = { //functions
  cfg: {
    check: (cfg) => {
      if (cfg.db === undefined) return 'cfg : db undefined';
      if (cfg.db.url === undefined) return 'cfg : db.url undefined';
      if (cfg.web === undefined) return 'cfg : web undefined';
      if (cfg.web.host === undefined) return 'cfg : web.host undefined';
      if (cfg.web.http === undefined) return 'cfg : web.http undefined';
      if (cfg.web.http.use === undefined) return 'cfg : web.http.use undefined';
      if (cfg.web.http.port === undefined) return 'cfg :web.http.port undefined';
      if (cfg.web.http.redirect === undefined) return 'cfg :web.http.redirect undefined';

      if (cfg.web.https === undefined) return 'cfg : web.https undefined';
      if (cfg.web.https.use === undefined) return 'cfg : web.https.use undefined';

      if (cfg.web.http.redirect && !cfg.web.https.use) return 'cfg : redirect must https.use true';

      if (cfg.web.https.port === undefined) return 'cfg :web.https.port undefined';
      if (cfg.web.https.key === undefined) return 'cfg :web.https.key undefined';
      if (cfg.web.https.cert === undefined) return 'cfg :web.https.cert undefined';
      if (cfg.web.https.ca === undefined) return 'cfg :web.https.ca undefined';

      if (cfg.web.secret_key === undefined) return 'cfg :web.secret_key undefined';

      if (cfg.web.cors === undefined) return 'cfg : web.cors undefined';

      if (cfg.dev === undefined) return 'cfg : dev undefined';
      if (cfg.dev.log === undefined) return 'cfg : dev.log undefined';

      return 'OK'
    },
  },
  encrypt : (p) => {
    return crypto.createHmac('sha1', cfg.web.secret_key).update(p).digest('base64');
  },
  mail: (from, to, subject, html) => {
    const m = {
      from: from,
      to: to,
      subject: subject,
      html: html,
    };
    transporter.sendMail(m, function(err, info){
      if (err) return console.error(err);
      console.log('Email sent: ' + info.response);
    });
  },
};
