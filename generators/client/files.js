const shell = require('shelljs');

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
    if (this.clientFramework === 'react') {
      that.replaceContent(`${that.baseName}/client/package.json`, 'jetbase', that.baseName, false);
      that.replaceContent(`${that.baseName}/client/package-lock.json`, 'jetbase', that.baseName, false);
      that.createContent(`${that.baseName}/client/.env`, `REACT_APP_API_SERVER=http://localhost:${that.serverPort}`);
    } else if (this.clientFramework === 'vue-nuxt') {
      that.replaceContent(`${that.baseName}/client/package.json`, 'jetbase', that.baseName, false);
      that.replaceContent(`${that.baseName}/client/package-lock.json`, 'jetbase', that.baseName, false);
      shell.cp(`${that.baseName}/client/.env.sample`, `${that.baseName}/client/.env`);
    }
  });
}
