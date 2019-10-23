const chalk = require('chalk');
const BaseBlueprintGenerator = require('../generator-base-blueprint');
const prompts = require('./prompts');
const writeFiles = require('./files').writeFiles;

module.exports = class extends BaseBlueprintGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.configOptions = this.options.configOptions || {};
    this.setupSharedOptions(this);
  }

  _initializing() {
    return {
      setupClientconsts() {
        this.serverPort = this.configOptions.serverPort;
        this.applicationType = this.configOptions.applicationType;
        if (!this.applicationType) {
          this.applicationType = 'rails';
        }
        this.clientFramework = this.configOptions.clientFramework;
        if (!this.clientFramework) {
          this.clientFramework = 'react';
        }
        const baseName = this.configOptions.baseName;
        if (baseName) {
          this.baseName = baseName;
        }
      },
    };
  }

  get initializing() {
    return this._initializing();
  }

  _prompting() {
    return {
      askForClient: prompts.askForClient,
      setSharedConfigOptions() {
        this.configOptions.clientFramework = this.clientFramework;
      }
    };
  }

  get prompting() {
    return this._prompting();
  }

  _configuring() {
    return {
      saveConfig() {
        const config = {
          applicationType: this.applicationType,
          baseName: this.baseName,
          clientFramework: this.clientFramework,
        };
        this.config.set(config);
      }
    };
  }

  get configuring() {
    return this._configuring();
  }

  _writing() {
    return {
      write() {
        writeFiles.call(this);
      }
    };
  }

  get writing() {
    return this._writing();
  }

  _install() {
    return {
      installing() {
        this.log(chalk.bold('\nInstalling client locally using npm'));
      }
    };
  }

  get install() {
    return this._install();
  }

  _end() {
    return {
      end() {
        if (this.clientFramework === 'react') {
          this.log(chalk.green.bold('\nClient React application generated successfully.\n'));
          this.log(chalk.green(`Install dependencies with:\n ${chalk.yellow.bold('npm install')}\n`));
          this.log(chalk.green(`Start your Webpack development server with:\n ${chalk.yellow.bold('npm start')}\n`));
        } else if (this.clientFramework === 'vue-nuxt') {
          this.log(chalk.green.bold('\nClient Vue/Nuxt application generated successfully.\n'));
          this.log(chalk.green(`Install dependencies with:\n ${chalk.yellow.bold('npm install')}\n`));
          this.log(chalk.green(`Start your Nuxt development server with:\n ${chalk.yellow.bold('npm run dev')}\n`));
        }
      }
    };
  }

  get end() {
    return this._end();
  }
};
