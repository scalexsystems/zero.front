const glob = require('glob');
const fs = require('fs');

const requests = {};
const files = glob.sync(`${__dirname}/**/*.json`);

files.forEach((filename) => {
  filename = filename.replace(__dirname+'/', '');

  const key = filename.replace(/GET|POST|PUT|DELETE|PATCH/i, match => `${match} `)
                      .replace(/\.json$/i, '')
                      .replace('\\', '/');
  requests[key] = require(`${__dirname}/${filename}`);
});

fs.writeFileSync(`${__dirname}/index.js`, `/* This file is autogenerated.
Use: \`yarn run mocks:http\` to re-generate. */
export default ${JSON.stringify(requests)};\n`);
