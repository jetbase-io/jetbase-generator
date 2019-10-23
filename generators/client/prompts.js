module.exports = {
  askForClient
};

function askForClient(meta) {
  const choices = [
    {
      value: 'react',
      name: 'React'
    },
    {
      value: 'vue-nuxt',
      name: 'Vue/Nuxt'
    }
  ];

  const PROMPT = {
    type: 'list',
    name: 'clientFramework',
    message: 'Which framework would you like to use for the client?',
    choices,
    default: 'react'
  };

  const done = this.async();

  this.prompt(PROMPT).then((prompt) => {
    this.clientFramework = prompt.clientFramework;
    done();
  });
}
