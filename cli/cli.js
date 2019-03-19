const program = require('commander');
const chalk = require('chalk');

const packageJson = require('../package.json');
const {
  CLI_NAME, initHelp, logger, createYeomanEnv, toString, getCommand, getCommandOptions, getArgs, done
} = require('./utils');
const SUB_GENERATORS = require('./commands');

const version = packageJson.version;
const JETBASE_NS = CLI_NAME;
const env = createYeomanEnv();

logger.init(program);

const runYoCommand = (cmd, args, options, opts) => {
  logger.debug(`cmd: ${toString(cmd)}`);
  logger.debug(`args: ${toString(args)}`);
  logger.debug(`opts: ${toString(opts)}`);
  const command = getCommand(cmd, args, opts);
  logger.info(chalk.yellow(`Executing ${command}`));
  logger.info(chalk.yellow(`Options: ${toString(options)}`));
  try {
    env.run(command, options, done);
  } catch (e) {
    logger.error(e.message, e);
  }
};

program
  .version(version)
  .usage('[command] [options]')
  .allowUnknownOption();

Object.keys(SUB_GENERATORS).forEach((key) => {
  const opts = SUB_GENERATORS[key];
  const command = program.command(`${key} ${getArgs(opts)}`, '', { isDefault: opts.default });
  if (opts.alias) {
    command.alias(opts.alias);
  }
  command
    .allowUnknownOption()
    .description(opts.desc)
    .action((args) => {
      const options = getCommandOptions(packageJson, process.argv.slice(2));
      if (opts.cliOnly) {
        logger.debug('Executing CLI only script');
        require(`./${key}`)(program.args, options, env); // eslint-disable-line
      } else {
        runYoCommand(key, program.args, options, opts);
      }
    })
    .on('--help', () => {
      if (opts.help) {
        logger.info(opts.help);
      } else {
        logger.debug('Adding additional help info');
        env.run(`${JETBASE_NS}:${key} --help`, done);
      }
    });
});

initHelp(program, CLI_NAME);

program.parse(process.argv);

if (program.args.length < 1) {
  logger.debug('No command specified. Running default');
  logger.info(chalk.yellow('Running default command'));
  const options = getCommandOptions(packageJson, process.argv.slice(2));
  runYoCommand('app', [], options, {});
}
