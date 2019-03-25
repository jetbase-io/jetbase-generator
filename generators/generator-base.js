const chalk = require('chalk');
const download = require('download-git-repo');
const packagejs = require('../package.json');
const utils = require('./utils');
const PrivateBase = require('./generator-base-private');

module.exports = class extends PrivateBase {
  replaceContent(filePath, pattern, content, regex) {
    try {
      utils.replaceContent(
        {
          file: filePath,
          pattern,
          content,
          regex
        },
        this
      );
    } catch (e) {
      this.log(
        chalk.yellow('\nUnable to find ') + filePath + chalk.yellow(' or missing required pattern. File rewrite failed.\n') + e
      );
      this.debug('Error:', e);
    }
  }

  createContent(filePath, content) {
    utils.createContent(
      { file: filePath, content },
      this
    );
  }

  error(msg) {
    this.env.error(`${chalk.red.bold('ERROR!')} ${msg}`);
  }

  warning(msg) {
    this.log(`${chalk.yellow.bold('WARNING!')} ${msg}`);
  }

  info(msg) {
    this.log.info(msg);
  }

  printJetBaseLogo() {
    this.log('\n');
    this.log(`${chalk.yellow('        ██╗ ████████╗ ████████╗ ███████╗   ██████╗   ██████╗ ████████╗')}`);
    this.log(`${chalk.yellow('        ██║ ██╔═════╝ ╚══██╔══╝ ██╔═══██╗ ██╔═══██╗ ██╔════╝ ██╔═════╝')}`);
    this.log(`${chalk.yellow('        ██║ ██████╗      ██║    ███████╔╝ ████████║ ╚█████╗  ██████╗  ')}`);
    this.log(`${chalk.yellow('  ██╗   ██║ ██╔═══╝      ██║    ██╔═══██╗ ██╔═══██║  ╚═══██╗ ██╔═══╝  ')}`);
    this.log(`${chalk.yellow('  ╚██████╔╝ ████████╗    ██║    ███████╔╝ ██║   ██║ ██████╔╝ ████████╗')}`);
    this.log(`${chalk.yellow('   ╚═════╝  ╚═══════╝    ╚═╝    ╚══════╝  ╚═╝   ╚═╝ ╚═════╝  ╚═══════╝')}\n`);
    this.log(chalk.white.bold('                            https://www.jetbase.io\n'));
    this.log(chalk.white('Welcome to JetBase ') + chalk.yellow(`v${packagejs.version}`));
    this.log(chalk.white(`Application files will be generated in folder: ${chalk.yellow(process.cwd())}`));

    this.log(
      chalk.green(
        ' _______________________________________________________________________________________________________________\n'
      )
    );
    this.log(
      chalk.white(`  Documentation for creating an application is at ${chalk.yellow('https://docs.jetbase.io/')}`)
    );
    this.log(
      chalk.green(
        ' _______________________________________________________________________________________________________________\n'
      )
    );
  }

  askModuleName(generator) {
    const done = generator.async();
    const defaultAppBaseName = this.getDefaultAppName();
    generator
      .prompt({
        type: 'input',
        name: 'baseName',
        validate: (input) => {
          if (!/^([a-zA-Z0-9_]*)$/.test(input)) {
            return 'Your base name cannot contain special characters or a blank space';
          }
          return true;
        },
        message: 'What is the base name of your application?',
        default: defaultAppBaseName
      })
      .then((prompt) => {
        generator.baseName = prompt.baseName;
        done();
      });
  }

  downloadFromRepo(repo, destination, cb) {
    download(repo, destination, cb);
  }

  setupSharedOptions(generator, context = generator, dest = context) {
    dest.baseName = context.configOptions.baseName;
    dest.logo = context.configOptions.logo;
    dest.isDebugEnabled = context.configOptions.isDebugEnabled || context.options.debug;
  }
};
