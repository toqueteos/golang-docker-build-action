const core = require('@actions/core');
const cp = require('child_process');
const path = require('path');
const docker = require('./docker');

// Convert buildArgs from String to Array, as GH Actions currently does not support Arrays
const processBuildArgsInput = buildArgsInput => {
  let buildArgs = null;
  if (buildArgsInput) {
    buildArgs = buildArgsInput.split(',');
  }

  return buildArgs;
};

const gitcredentials = () => {
  const username = core.getInput('username');
  const password = core.getInput('password');

  core.info(`Setting up git credentials for user ${username} ...`);
  cp.execSync(
    `git config --global credential.helper '!f() { sleep 1; echo "username=${username}"; echo "password=${password}"; }; f'`
  );
};

const gomodules = () => {
  core.info(`Running go mod download ...`);

  const penv = process.env;
  penv.GOPATH = path.join(process.cwd(), '_local');
  penv.GOCACHE = '/tmp/';

  cp.execSync(`go mod download`, penv);
};

const run = () => {
  try {
    // Get GitHub Action inputs
    const image = core.getInput('image', { required: true });
    const registry = core.getInput('registry', { required: true });
    const tag = core.getInput('tag') || docker.createTag();
    const buildArgs = processBuildArgsInput(core.getInput('buildArgs'));

    const imageName = `${registry}/${image}:${tag}`;

    gitcredentials();
    gomodules();
    docker.login();
    docker.build(imageName, buildArgs);
    docker.push(imageName);

    core.setOutput('imageFullName', imageName);
  } catch (error) {
    core.setFailed(error.message);
  }
};

module.exports = run;
