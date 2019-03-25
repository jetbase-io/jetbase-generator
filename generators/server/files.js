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
          shelljs.exec(`npm install ${process.cwd()}/${that.baseName}/server/ --prefix ${process.cwd()}/${that.baseName}/server`, () => {
            that.replaceContent(`${that.baseName}/server/package.json`, 'jetbase', that.baseName, false);
            that.replaceContent(`${that.baseName}/server/package-lock.json`, 'jetbase', that.baseName, false);
            that.createContent(`${that.baseName}/server/.env`, `PORT=${that.serverPort}`);
          });
        } else {
          shelljs.exec(`${process.cwd()}/${that.baseName}/server/bin/bundle install`);
        }
      });
    }
  };
}

module.exports = {
  writeFiles,
};
