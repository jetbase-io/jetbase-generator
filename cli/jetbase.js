#!/usr/bin/env node
const semver = require('semver');
const packageJson = require('../package.json');
const { logger } = require('./utils');

const currentNodeVersion = process.versions.node;
const minimumNodeVersion = packageJson.engines.node;

if (!semver.satisfies(currentNodeVersion, minimumNodeVersion)) {
  logger.error(
    `You are running Node version ${currentNodeVersion}\nJetBase requires Node version ${minimumNodeVersion}\nPlease update your version of Node.`
  );
}

require('./cli');
