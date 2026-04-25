const { expect } = require('@playwright/test');

async function runTcStep(page, step) {
  switch (step.action) {
    case 'goto': {
      await page.goto(step.url);
      return;
    }
    case 'click': {
      await page.locator(step.selector).click();
      return;
    }
    case 'fill': {
      await page.locator(step.selector).fill(step.value);
      return;
    }
    case 'press': {
      await page.locator(step.selector).press(step.key);
      return;
    }
    case 'waitForElement': {
      await page.waitForSelector(step.selector);
      return;
    }
    case 'expectText': {
      await expect(page.locator(step.selector)).toContainText(step.text);
      return;
    }
    case 'expectVisible': {
      await expect(page.locator(step.selector)).toBeVisible();
      return;
    }
    case 'expectUrlContains': {
      await expect(page).toHaveURL(new RegExp(escapeRegex(step.value)));
      return;
    }
    default: {
      throw new Error(`Unsupported TC action: ${JSON.stringify(step)}`);
    }
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { runTcStep };
