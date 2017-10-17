# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Providing data using asynchronous APIs
The Prototype Kit supports building very high-fidelity prototypes that make use of asynchronous
APIs such as [Google Maps](https://github.com/googlemaps/google-maps-services-js).

## Consider the alternatives first
It is not always necessary for a prototype to use a real API in order to
be sufficient. Before committing to using an API, consider whether simple canned data
will suffice.

## Calling an API from a handler
Calling an API is an inherently asynchronous operation, which means that the
rendering of a template that uses data from an API needs to be correctly scheduled.

The Prototype Kit supports this by allowing a handler to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
that resolves to the input required for the template.

Here is a simple example that waits for 3 seconds before returning the data
for the template.

```js
module.exports = function (input) {
  input.title = 'A waiting page'

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

  return wait(3000).then(() => {
    input.variable = 'Waited for 3 seconds'
    return input
  })
}
```

Although contrived, the above example shows how straightforward calling an API can
be. In the next example, the `wait(3000)` is replaced with a call to a hypothetical
function that returns a Promise resolving to API data.

```js
// note this is purely hypothetical
const postcodeFinder = require('postcode-finder')

module.exports = function (input) {
  input.title = 'Address finder'

  if (input.postcode) {
    return postcodeFinder(input.postcode)
      .then(addresses => {
        input.addresses = addresses
        return input
      })
      .catch(msg => {
        input.errorMessage = `Could not find address: ${msg}`
        return input
      })
  }

  return input
}
```
