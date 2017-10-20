# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Accessibility testing

The Prototype Kit includes the functionality to test prototypes for WCAG 2.0 AAA conformance using [Pa11y](http://pa11y.org/). The Prototype Kit tests a list of pages for WCAG conformance and outputs the results as HTML reports.

### Configuring tests

By default, the configuration only tests the Prototype Kit's home page and example page. To test your prototype's pages they must be added to the `testUrls` array in `/tests/pa11y/pa11y.js`.


```js
const testUrls = [
    {name: 'Homepage', url: 'http://localhost:3000/'},
    {name: 'Test page', url: 'http://localhost:3000/examples/test'}
]
```

### Running tests

Tests are run using the terminal. Make sure you're in the directory where you cloned the Prototype Kit and run the following command;

```bash
$ npm run test-pa11y
```

This command outputs the results of the tests to the terminal window and creates a HTML report for each URL in the config's `testUrls` array.

### Reviewing results

The HTML reports are written to the `/tests/pa11y/reports/` directory. Once they've been created they can be opened in any browser.
