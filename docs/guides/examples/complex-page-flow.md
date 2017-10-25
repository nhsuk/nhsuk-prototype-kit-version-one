## app/views/examples/complex-page-flow.hbs
```handlebars
{{> components/local-header
  title=title
  text="More complex page flow using server-side logic"
 }}

<form method="POST">
<fieldset>
  <legend>Which page next?</legend>
  <div class="multiple-choice__container">
    <label class="multiple-choice multiple-choice--radio">
      Homepage
      <input type=radio name=redirect value="/" class="multiple-choice__input">
    </label>
    <label class="multiple-choice multiple-choice--radio">
      Test prototype
      <input type=radio name=redirect value="test" class="multiple-choice__input">
    </label>
    <label class="multiple-choice multiple-choice--radio">
      A simpler page flow example
      <input type=radio name=redirect value="simple-page-flow" class="multiple-choice__input">
    </label>
  </div>
</fieldset>
<input class="button" type=submit value=Submit>
</form>
```

## app/views/examples/complex-page-flow.js
```js
module.exports = function (input, req) {
  input.title = 'Complex page flow'

  if (req.method === 'POST') {
    // if the redirect variable is for the simple page flow example,
    // increment a counter in the session that it will pick up
    if (input.redirect === 'simple-page-flow') {
      const validated = req.session.validated || {}

      req.session.validated = Object.assign({}, validated, {
        complexVisited: (validated.complexVisited || 0) + 1
      })
    }
  }

  return input
}
```
