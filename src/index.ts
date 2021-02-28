#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'

import { npmInstallLatest } from './commands/npm-install-latest.command.js';

const argv = yargs(hideBin(process.argv))
  .usage('Usage: npm-install-latest [options]')
  .options('global', {
    alias: 'g',
    description: 'Update global packages to latest',
    type: 'boolean'
  })
  .options('force', {
    alias: 'f',
    description: 'Will force npm to fetch remote resources even if a local copy exists on disk',
    type: 'boolean'
  })
  .example('npm-install-latest --global', 'Update global packages instead of the ones defined in the local package.json')
  .help('h')
  .alias('h', 'help')
  .epilog('copyright 2021')
  .argv;

npmInstallLatest(argv.global).then(() => process.exit(0));
