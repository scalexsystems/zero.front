process.env.NODE_ENV = 'testing';

require('phantomjs-prebuilt').path = '/usr/local/bin/phantomjs';
// 1. start the dev server using production config
var server = require('../../build/dev-server.js');

server.devMiddleware.waitUntilValid(function () {
  // 2. run the nightwatch test suite against it
  // to run in additional browsers:
  //    1. add an entry in test/e2e/nightwatch.conf.json under "test_settings"
  //    2. add it to the --env flag below
  // or override the environment flag, for example: `npm run e2e -- --env chrome,firefox`
  // For more information on Nightwatch's config file, see
  // http://nightwatchjs.org/guide#settings-file
  var opts = process.argv.slice(2);
  if (opts.indexOf('--config') === -1) {
    opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js']);
  }
  if (opts.indexOf('--env') === -1) {
    opts = opts.concat(['--env', process.env.CIRCLECI ? 'phantomjs' : 'chrome'])
  }
  if (opts.indexOf('phantomjs') > -1) {
    process.env.PHANTOMJS = true
  }

  var spawn = require('cross-spawn');
  var runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

  runner.on('exit', function (code) {
    server.close();
    process.exit(code);
  });

  runner.on('error', function (err) {
    server.close();
    throw err;
  });
});
