// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  Sidebar: function test(browser) {
    const hubLink = `${browser.globals.devServerURL}/hub`;

    browser
      .url(hubLink)
      .assert.elementPresent('.hub-container', 'hub is reachable')
      .assert.elementPresent('.hub-sidebar-left > .group-list', 'group list is visible')
      .assert.elementPresent('.group-list-container .group-list-item:nth-child(1)', 'has at least one group')
      .end();
  },
};
