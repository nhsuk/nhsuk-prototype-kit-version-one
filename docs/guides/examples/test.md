## app/views/examples/test.hbs
```handlebars
{{> components/local-header
  title="Test Prototype"
  text="Checks that the prototyping kit is operating correctly."}}
<p>Check that the page's title in the browser is "{{title}}"</p>
```

## app/views/examples/test.js
```js
module.exports = function (input) {
  input.title = 'Test Prototype'
  return input
}
```
