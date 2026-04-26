# create-e2e-tc

## Overview
This skill generates E2E test cases (TC) for the `apps/web` Next.js app using Playwright and the shared `@practice/e2e-testing` schema. It creates JSON-based TC files in `apps/web/e2e/tc/` based on user-described scenarios.

## Workflow
1. **Input**: User provides a test scenario description (e.g., "Test login flow: navigate to /login, enter credentials, click submit, verify dashboard").
2. **Analysis**: Analyze the scenario to extract steps (`goto`, `click`, `fill`, `press`, `waitForElement`, `expectText`, `expectVisible`, `expectUrlContains`).
3. **Generation**: Create a valid TC JSON file with `name`, `description`, and `steps` array.
4. **Validation**: Ensure selectors and actions are plausible and match the shared TC schema.
5. **Output**: Write the file to `apps/web/e2e/tc/` and provide usage instructions.

## Supported Actions
- `goto`: URL navigation.
- `click`: Element click.
- `fill`: Text input.
- `press`: Keyboard action.
- `waitForElement`: Wait for element visibility.
- `expectText`: Text assertion.
- `expectVisible`: Visibility assertion.
- `expectUrlContains`: URL assertion.

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