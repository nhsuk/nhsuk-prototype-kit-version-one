## app/views/examples/simple-page-flow.hbs
```handlebars
{{> components/local-header
  title=title
  text="Simple choice-based page flow using radio buttons to set 'redirect' variable"
}}

{{#if validated.complexVisited}}
<p>You have chosen this page {{validated.complexVisited}} time(s)</p>
{{/if}}

<form>
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
      A more complex page flow example
      <input type=radio name=redirect value="complex-page-flow" class="multiple-choice__input">
    </label>
  </div>
</fieldset>
<input class="button" type=submit value=Submit>
</form>
```

## app/views/examples/simple-page-flow.js
```js
module.exports = function (input) {
  input.title = 'Simple page flow'
  return input
}
```
