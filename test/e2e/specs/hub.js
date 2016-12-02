// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Sidebar': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const hubLink = browser.globals.devServerURL + '/hub';

    browser
      .url(hubLink)
      .assert.elementPresent('.hub-container', 'hub is reachable')
      .assert.elementPresent('.hub-sidebar-left > .group-list', 'group list is visible')
      .assert.elementPresent('.group-list-container .group-list-item:nth-child(1)', 'has at least one group')

      .click('.group-list-container .group-list-item:nth-child(1)').pause(500)
      .assert.elementPresent('.layout-box', 'open first group')
      .assert.containsText('.hub-content .message-box-title', 'A Private', 'visiting correct group')

      // Click on `Private` link
      .click('.hub-sidebar-left > .btn-group:nth-child(1) a:nth-child(1)')
      .assert.elementPresent('.hub-sidebar-left > .user-list', 'user list is visible')
      .end();
  },
};
