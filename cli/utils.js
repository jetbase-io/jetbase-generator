const chalk = require('chalk');
const didYouMean = require('didyoumean');
const meow = require('meow');
const yeoman = require('yeoman-environment');

const SUB_GENERATORS = require('./commands');

const CLI_NAME = 'jetbase';

const debug = function (msg) {
  if (this.debugEnabled) {
    console.log(`${chalk.blue('DEBUG!')}  ${msg}`);
  }
};

const info = function (msg) {
  console.info(`${chalk.green.bold('INFO!')} ${msg}`);
};

const log = function (msg) {
  console.log(msg);
};

const error = function (msg, trace) {
  console.error(`${chalk.red.bold('ERROR!')} ${chalk.red(msg)}`);
  if (trace) {
    console.log(trace);
  }
  process.exit(1);
};

const init = function (program) {
  program.option('-d, --debug', 'enable debugger');

  const argv = program.normalize(process.argv);
  this.debugEnabled = program.debug = argv.includes('-d') || argv.includes('--debug');

  if (this.debugEnabled) {
    info('Debug logging is on');
  }
};

const logger = {
  init,
  debug,
  info,
  log,
  error
};

const toString = (item) => {
  if (typeof item == 'object') {
    if (Array.isArray(item)) {
      return item.map(it => toString(it)).join(', ');
    }
    return Object.keys(item)
      .map(k => `${k}: ${typeof item[k] != 'function' && typeof item[k] != 'object' ? toString(item[k]) : 'Object'}`)
      .join(', ');
  }
  return item ? item.toString() : item;
};

const initHelp = (program, cliName) => {
  program.on('--help', () => {
    logger.debug('Adding additional help info');
    logger.info(`  For more info visit ${chalk.blue('https://www.jetbase.io')}`);
    logger.info('');
  });

  program.on('command:*', (name) => {
    logger.error(`${chalk.yellow(name)} is not a known command. See '${chalk.white(`${cliName} --help`)}'.`);
    const d = didYouMean(name.toString(), program.commands, '_name');
    if (d) {
      logger.info(`Did you mean: ${chalk.yellow(d)}?`);
    }
    process.exit(1);
  });
};

const getArgs = (opts) => {
  if (opts.argument) {
    return `[${opts.argument.join(' ')}]`;
  }
  return '';
};

const getOptionsFromArgs = (args) => {
  const options = [];
  args.forEach((item) => {
    if (typeof item == 'string') {
      options.push(item);
    } else if (typeof item == 'object') {
      if (Array.isArray(item)) {
        options.push(...item);
      }
    }
  });
  return options;
};

const getCommand = (cmd, args, opts) => {
  let options = [];
  if (opts && opts.argument && opts.argument.length > 0) {
    logger.debug('Arguments found');
    options = getOptionsFromArgs(args);
  }
  if (args && args.length === 1) {
    logger.debug('No Arguments found.');
  }
  const cmdArgs = options.join(' ').trim();
  logger.debug(`cmdArgs: ${cmdArgs}`);
  return `${CLI_NAME}:${cmd}${cmdArgs ? ` ${cmdArgs}` : ''}`;
};

const getCommandOptions = (pkg, argv) => {
  const options = meow({ help: false, pkg, argv });
  const flags = options ? options.flags : null;
  if (flags) {
    flags['from-cli'] = true;
    Object.keys(flags).forEach((key) => {
      const legacyKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      flags[legacyKey] = flags[key];
    });
    return flags;
  }
  return { 'from-cli': true };
};

const done = () => {
  logger.info(chalk.green.bold('Congratulations, Jetbase execution is complete!'));
};

const createYeomanEnv = () => {
  const env = yeoman.createEnv();
  Object.keys(SUB_GENERATORS)
    .filter(command => !SUB_GENERATORS[command].cliOnly)
    .forEach((generator) => {
      logger.info(generator);
      env.register(require.resolve(`../generators/${generator}`), `${CLI_NAME}:${generator}`);
    });
  return env;
};

module.exports = {
  CLI_NAME,
  toString,
  logger,
  initHelp,
  getArgs,
  getOptionsFromArgs,
  getCommand,
  getCommandOptions,
  done,
  createYeomanEnv
};
