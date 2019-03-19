const chalk = require('chalk');
const prompts = require('./prompts');
const BaseBlueprintGenerator = require('../generator-base-blueprint');
const writeFiles = require('./files').writeFiles;

module.exports = class extends BaseBlueprintGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.configOptions = this.options.configOptions || {};
    this.setupSharedOptions(this);
  }

  _initializing() {
    return {
      setupServerconsts() {
        const configuration = this.getAllConfig(this, true);
        this.applicationType = configuration.get('applicationType') || this.configOptions.applicationType;
        if (!this.applicationType) {
          this.applicationType = 'rails';
        }
        this.serverPort = configuration.get('serverPort');
        if (this.serverPort === undefined) {
          this.serverPort = '8080';
        }
        const baseName = configuration.get('baseName');
        if (baseName) {
          this.baseName = baseName;
        }
      }
    };
  }

  get initializing() {
    return this._initializing();
  }

  _prompting() {
    return {
      askForServerSideOpts: prompts.askForServerSideOpts,
      setSharedConfigOptions() {
        this.configOptions.applicationType = this.applicationType;
        this.configOptions.serverPort = this.serverPort;
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
          serverPort: this.serverPort,
        };
        this.config.set(config);
      }
    };
  }

  get configuring() {
    return this._configuring();
  }

  _writing() {
    return writeFiles();
  }

  get writing() {
    return this._writing();
  }

  _install() {
    return {
      installing() {
        this.log(chalk.bold('\nInstalling server locally using npm'));
      }
    };
  }

  get install() {
    return this._install();
  }

  _end() {
    return {
      end() {
        this.log(chalk.green.bold('\nServer application generated successfully.\n'));
        if (this.applicationType === 'rails') {
          const logMsg = `Start your server with:\n ${chalk.yellow.bold(`bundle exec rails s -p ${this.serverPort}`)}\n`;
          this.log(chalk.green(logMsg));
        } else {
          const logMsg = `Start your server with:\n ${chalk.yellow.bold('npm start')}\n`;
          this.log(chalk.green(logMsg));
        }
      }
    };
  }

  get end() {
    return this._end();
  }
};
