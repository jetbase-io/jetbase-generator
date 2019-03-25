const BaseGenerator = require('../generator-base');
const prompts = require('./prompts');

module.exports = class extends BaseGenerator {
  constructor(args, opts) {
    super(args, opts);
    this.configOptions = {};
    this.isDebugEnabled = this.configOptions.isDebugEnabled = this.options.debug;
  }

  get initializing() {
    return {
      displayLogo() {
        this.printJetBaseLogo();
      },

      setupconsts() {
        this.applicationType = this.config.get('applicationType');
        this.baseName = this.config.get('baseName');
        this.serverPort = this.config.get('serverPort');
      }
    };
  }

  get prompting() {
    return {
      askForModuleName: prompts.askForModuleName,
      askForServerPort: prompts.askForServerPort,
      setSharedConfigOptions() {
        this.configOptions.applicationType = this.applicationType;
        this.configOptions.baseName = this.baseName;
        this.configOptions.serverPort = this.serverPort;
      }
    };
  }

  get configuring() {
    return {
      setup() {
        this.configOptions.applicationType = this.applicationType;
        this.configOptions.baseName = this.baseName;
        this.configOptions.serverPort = this.serverPort;
        this.configOptions.logo = false;
        this.generatorType = 'app';
      },

      composeServer() {
        const options = this.options;
        const configOptions = this.configOptions;

        this.composeWith(require.resolve('../server'), {
          ...options,
          configOptions,
          'client-hook': true,
          debug: this.isDebugEnabled
        });
      },

      composeClient() {
        const options = this.options;
        const configOptions = this.configOptions;

        this.composeWith(require.resolve('../client'), {
          ...options,
          configOptions,
          debug: this.isDebugEnabled
        });
      },
    };
  }

  get default() {
    return {
      saveConfig() {
        const config = {
          applicationType: this.applicationType,
          baseName: this.baseName,
          serverPort: this.serverPort,
        };
        this.config.set(config);
      },
    };
  }
};
