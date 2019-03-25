const path = require('path');
const fs = require('fs');

module.exports = {
  createContent,
  replaceContent,
};


function createContent(args, generator) {
  args.path = args.path || process.cwd();
  const fullPath = path.join(args.path, args.file);
  fs.writeFile(fullPath, args.content, function(err) {
    if (err) throw err;
  });
}

function replaceContent(args, generator) {
  args.path = args.path || process.cwd();
  const fullPath = path.join(args.path, args.file);
  const re = args.regex ? new RegExp(args.pattern, 'g') : args.pattern;
  let body = generator.fs.read(fullPath);
  body = body.replace(re, args.content);
  fs.writeFile(fullPath, body, function(err) {
    if (err) throw err;
  });
}
