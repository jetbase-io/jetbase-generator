const shelljs = require('shelljs');

const configs = {
  react: {
    repo: 'github:jetbase-io/jetbase-react'
  },
  'vue-nuxt': {
    repo: 'github:jetbase-io/jetbase-vue'
  }
};

module.exports = {
  writeFiles,
};

function writeFiles() {
  const that = this;
  this.downloadFromRepo(configs[this.clientFramework].repo, `${that.baseName}/client`, (err) => {
    that.replaceContent(`${that.baseName}/client/package.json`, 'jetbase', that.baseName, false);
    that.replaceContent(`${that.baseName}/client/package-lock.json`, 'jetbase', that.baseName, false);
    that.createContent(`${that.baseName}/client/.env`, `REACT_APP_API_SERVER=http://localhost:${that.serverPort}`);
  });
}
