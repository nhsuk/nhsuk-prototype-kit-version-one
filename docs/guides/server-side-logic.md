# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Server-side logic
Although the Prototype Kit uses the Express server engine under the hood, you do not need to
know about that in order to add server-side logic to your prototypes. Most requirements
can be handled by manipulating the input and sending variables into the templates.
The Prototype Kit makes this model of logic easy to implement.

## Adding an input handler to a template
To add an input handler to a template, simple create a file with the same name
as the template, in the same directory, but with a `.js` extension. For example,
the input handler for a template named `app/views/prototype.hbs` would be
`app/views/prototype.js`.

The simplest input handler, and a good template to start all files with, looks
like the following;

```js
module.exports = function (input, req) {
  return input
}
```

An input handler for a template is a Node.js module which exports a single function
as the default. Whatever that function returns will be passed to the template to
set the value of all the variables.

The `input` parameter to the handler function contains all the inputs provided by
forms in your template. The `req` parameter is the Express request object which
you can use to differentiate between GET and POST requests, access cookies and
other advanced features. If you do not need that, you can omit the parameter.

## Setting the page title
If you provide a `title` variable to a template, the Prototype Kit will automatically use it
to set the page's title in the browser. For example,

```js
module.exports = function (input) {
  input.title = 'My first prototype'
  return input
}
```

## Adding conditional logic
By combining server-side logic and Handlebars conditional blocks, you can create
quite complex behaviours. For example, the following template and input handler
create a simple guessing game.

### app/views/game.hbs
```handlebars
<form>
  <label>What number am I thinking of? <input type=text name=guess></label>
  <input type=submit value=Submit>
</form>

{{#if correct}}
<p>Correct! I was thinking of {{guess}}!</p>
{{/if}}

{{#if incorrect}}
<p>Sorry, {{guess}} isn't the number I was thinking of. Try again!
{{/if}}
```

### app/views/game.js
```js
module.exports = function (input) {
  input.title = 'Guessing game'

  if (input.guess) {
    if (parseInt(input.guess) === Math.floor(Math.random() * 10) + 1) {
      input.correct = true
    } else {
      input.incorrect = true
    }
  }

  return input
}
```
