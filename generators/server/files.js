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
      this.downloadFromRepo(configs[this.applicationType].repo, 'server', (err) => {
        if (that.applicationType === 'express') {
          shelljs.exec(`npm install ${process.cwd()}/server/ --prefix ${process.cwd()}/server`, () => {
            that.replaceContent('server/package.json', 'jetbase', that.baseName, false);
            that.replaceContent('server/package-lock.json', 'jetbase', that.baseName, false);
            that.createContent('server/.env', `PORT=${that.serverPort}`);
          });
        } else {
          shelljs.exec(`${process.cwd()}/server/bin/bundle install`);
        }
      });
    }
  };
}

module.exports = {
  writeFiles,
};
