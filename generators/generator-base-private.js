const path = require('path');
const _ = require('lodash');
const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this._ = _;
  }

  getDefaultAppName() {
    return /^[a-zA-Z0-9_]+$/.test(path.basename(process.cwd())) ? path.basename(process.cwd()) : 'jetbase';
  }

  debug(msg, ...args) {
    if (this.isDebugEnabled || (this.options && this.options.debug)) {
      this.log(`${chalk.yellow.bold('DEBUG!')} ${msg}`);
      args.forEach(arg => this.log(arg));
    }
  }
};
