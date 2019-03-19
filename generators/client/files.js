const shelljs = require('shelljs');

const configs = {
  react: {
    repo: 'github:jetbase-io/jetbase-react'
  }
};

module.exports = {
  writeFiles,
};

function writeFiles() {
  const that = this;
  this.downloadFromRepo(configs[this.clientFramework].repo, 'client', (err) => {
    shelljs.exec(`npm install ${process.cwd()}/client/ --prefix ${process.cwd()}/client`, () => {
      that.replaceContent('client/package.json', 'jetbase', that.baseName, false);
      that.replaceContent('client/package-lock.json', 'jetbase', that.baseName, false);
      that.createContent('client/.env', `REACT_APP_API_SERVER=http://localhost:${that.serverPort}`);
    });
  });
}
