module.exports = {
  askForServerSideOpts,
};

function askForServerSideOpts() {
  const prompts = [
    {
      type: 'list',
      name: 'applicationType',
      message: 'Which backend do you want to use?',
      choices: [
        {
          value: 'express',
          name: 'Express.js + MongoDB'
        },
        {
          value: 'rails',
          name: 'Ruby on Rails + PostgreSQL'
        },
        {
          value: 'laravel',
          name: 'Laravel + PostgreSQL'
        }
      ],
      default: 'rails'
    },
  ];

  const done = this.async();

  this.prompt(prompts).then((props) => {
    this.applicationType = props.applicationType;
    done();
  });
}
