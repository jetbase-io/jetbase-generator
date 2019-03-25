module.exports = {
  askForModuleName,
  askForServerPort,
};

function askForModuleName() {
  this.askModuleName(this);
}

function askForServerPort() {
  const defaultPort = '9999';

  const prompts = [
    {
      type: 'input',
      name: 'serverPort',
      validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
      message: 'Which port would like your server to run? It should be unique to avoid port conflicts.',
      default: defaultPort
    },
  ];

  const done = this.async();

  this.prompt(prompts).then((props) => {
    this.serverPort = props.serverPort;
    if (this.serverPort === undefined) {
      this.serverPort = defaultPort;
    }
    done();
  });
}
