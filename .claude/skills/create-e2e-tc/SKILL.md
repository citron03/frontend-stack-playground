# create-e2e-tc

## Overview
This skill generates E2E test cases (TC) for the `apps/web` Next.js app using Playwright. It creates JSON-based TC files in `apps/web/e2e/tc/` based on user-described scenarios.

## Workflow
1. **Input**: User provides a test scenario description (e.g., "Test login flow: navigate to /login, enter credentials, click submit, verify dashboard").
2. **Analysis**: Analyze the scenario to extract steps (navigate, click, type, assert, etc.).
3. **Generation**: Create a valid TC JSON file with `name`, `description`, and `steps` array.
4. **Validation**: Ensure selectors and actions are plausible; suggest improvements if needed.
5. **Output**: Write the file to `apps/web/e2e/tc/` and provide usage instructions.

## Supported Actions
- `navigate`: URL navigation.
- `click`: Element click.
- `type`: Text input.
- `waitForElement`: Wait for element visibility.
- `assertText`: Text assertion.
- `wait`: Time delay.

## Usage
- Invoke when user asks to "create an E2E test case" or "generate TC for [scenario]".
- Example prompt: "Create a TC for testing the home page smoke test."

## Tools Used
- `semantic_search`: Find relevant page/components for selectors.
- `create_file`: Generate the TC JSON file.
- `read_file`: Reference existing TC examples.

## Best Practices
- Keep steps simple and sequential.
- Use CSS selectors (e.g., `.class`, `#id`).
- Test the TC after creation with `pnpm web:e2e`.