const EMPTY_COUNTS = {
  api: 0,
  render: 0,
  network: 0,
  assertion: 0,
};

function attachErrorCollector(page, options) {
  const errors = [];

  const push = (next) => {
    errors.push({
      ...next,
      timestamp: new Date().toISOString(),
      stepId: options.getCurrentStepId?.(),
    });
  };

  const onResponse = (response) => {
    if (response.status() >= 400) {
      push({
        category: 'api',
        message: `HTTP ${response.status()} from ${response.url()}`,
        status: response.status(),
        method: response.request().method(),
        url: response.url(),
      });
    }
  };

  const onRequestFailed = (request) => {
    const type = request.resourceType();
    const failureText = request.failure()?.errorText ?? 'unknown request failure';
    const category = type === 'xhr' || type === 'fetch' ? 'api' : 'network';

    push({
      category,
      message: `Request failed (${type}): ${failureText}`,
      method: request.method(),
      url: request.url(),
    });
  };

  const onPageError = (error) => {
    push({
      category: 'render',
      message: error.message,
      stack: error.stack,
    });
  };

  const onConsole = (message) => {
    if (message.type() === 'error') {
      push({
        category: 'render',
        message: message.text(),
        extra: { type: message.type() },
      });
    }
  };

  page.on('response', onResponse);
  page.on('requestfailed', onRequestFailed);
  page.on('pageerror', onPageError);
  page.on('console', onConsole);

  return {
    list: errors,
    addAssertionError(error) {
      const normalized = normalizeError(error);
      push({
        category: 'assertion',
        message: normalized.message,
        stack: normalized.stack,
      });
    },
    detach() {
      page.off('response', onResponse);
      page.off('requestfailed', onRequestFailed);
      page.off('pageerror', onPageError);
      page.off('console', onConsole);
    },
    summarize() {
      const byCategory = { ...EMPTY_COUNTS };
      for (const error of errors) {
        byCategory[error.category] += 1;
      }

      return {
        total: errors.length,
        byCategory,
      };
    },
  };
}

function normalizeError(error) {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }

  return { message: String(error) };
}

module.exports = { attachErrorCollector };
