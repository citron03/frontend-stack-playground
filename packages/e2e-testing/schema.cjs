const TC_ACTIONS = [
  'goto',
  'click',
  'fill',
  'press',
  'waitForElement',
  'expectText',
  'expectVisible',
  'expectUrlContains',
];

const TC_ACTION_EXAMPLES = {
  goto: { action: 'goto', url: '/login' },
  click: { action: 'click', selector: '#submit-btn' },
  fill: { action: 'fill', selector: '#username', value: 'testuser' },
  press: { action: 'press', selector: '#password', key: 'Enter' },
  waitForElement: { action: 'waitForElement', selector: '.loading' },
  expectText: { action: 'expectText', selector: '.message', text: 'Success' },
  expectVisible: { action: 'expectVisible', selector: '.modal' },
  expectUrlContains: { action: 'expectUrlContains', value: 'dashboard' },
};

module.exports = { TC_ACTIONS, TC_ACTION_EXAMPLES };
