const shelljs = require('shelljs');

const configs = {
  express: {
    repo: 'github:jetbase-io/jetbase-express-mongo'
  },
  rails: {
    repo: 'github:jetbase-io/jetbase-rails'
  }
};

function writeFiles() {
  return {
    writeFiles() {
      const that = this;
      this.downloadFromRepo(configs[this.applicationType].repo, `${that.baseName}/server`, (err) => {
        if (that.applicationType === 'express') {
          that.replaceContent(`${that.baseName}/server/package.json`, 'jetbase', that.baseName, false);
          that.replaceContent(`${that.baseName}/server/package-lock.json`, 'jetbase', that.baseName, false);
          that.createContent(`${that.baseName}/server/.env`, `PORT=${that.serverPort}\nJWT_SECRET=shhhhhhared-secret\nDB_URL=mongodb://admin:jetbase@127.0.0.1:27017/jetbase`);
        }
      });
    }
  };
}

module.exports = {
  writeFiles,
};
