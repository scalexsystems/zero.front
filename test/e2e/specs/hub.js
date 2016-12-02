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
      .waitForElementPresent('.group-list-container .group-list-item:nth-child(1)', 2000, 'has at least one group')
      .click('.group-list-container .group-list-item:nth-child(1)')
      .waitForElementPresent('.hub-group-preview', 200, 'open first group')
      .assert.evaluate(function () {
        return (
          document.querySelector('.group-list-container .group-list-item:nth-child(1) .grop-list-name').textContent
          === document.querySelector('.hub-group-preview .activity-box-title').textContent
        );
      }, null, 'visiting correct group')

      // Click on `Private` link
      .click('.hub-sidebar-left > .btn-group:nth-child(1) a:nth-child(1)')
      .assert.elementPresent('.hub-sidebar-left > .user-list', 'user list is visible')
      .end();
  },
};
