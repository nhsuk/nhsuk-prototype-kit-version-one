# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Page transitions
The Prototype Kit allows you to build prototypes that model a sequence of pages. HTML links
can be used to model simple transitions between pages and more complex transitions
involving forms, validation and redirection can be modelled using server-side
handlers.

## Simple transitions with links
As the URL for any template is fixed by the name of the template and the directory
in which it is placed, simple page transitions with links are easy to create.

For example;
```html
<a href="/page-2" class="button">Go to page 2</a>
```

This method, however, does not allow variables to be passed to the next template.

## Simple transitions with forms
To pass form data to a different page, use the `action` attribute for a form element
to specify the page to transition to, much like the link example above. All the
inputs on the form will have their values passed to the next template.

### app/views/page-1.hbs
```html
<form action="/page-2">
  <p><label>Your name: <input type=text name=my_name></label>
  <p><label>Your address: <textarea name=my_address></textarea></label>
  <p><input type=submit value=Submit>
</form>
```

### app/views/page-2.hbs
```handlebars
<p>You entered...
<p><strong>Name: </strong>{{my_name}}
<p><strong>Address: </strong>{{my_address}}
```

## Complex transitions with forms, validation and redirection
To create higher fidelity prototypes with form validation, a server-side handler
is required that differentiates between GET and POST requests. On GET requests,
the form variables are initialised and the template shown. The form in the template
uses the POST method to send the data back to the server for validation. On a POST
request, the handler validates the data and, if successful, stores the validated
values and redirects to the next page.

To pass variables between pages in this way, the server's session must be used.
The session variable `validated` is automatically merged into the input for each
handler to keep validated data separate from unvalidated data.

A handler can indicate that instead of showing a template, the browser should
redirect elsewhere by setting the special variable `redirect` on the returned
data. It can be set to a string to redirect to that URL or it can be a function
that returns a string to redirect to.

Extending the example above, validation and session storage can be implemented as
follows;

### app/views/page-1.hbs
```handlebars
<form action="/page-1" method="POST">
  <p><label>Your name: <input type=text name=my_name value="{{my_name}}"></label>
    {{#if error.my_name}}<span class="error">{{error.my_name}}</span>{{/if}}
  <p><label>Your address: <textarea name=my_address>{{my_address}}</textarea></label>
    {{#if error.my_address}}<span class="error">{{error.my_address}}</span>{{/if}}
  <p><input type=submit value=Submit>
</form>
```

### app/views/page-1.js
```js
module.exports = function (input, req) {
  input.title = 'Form validation'

  if (req.method === 'POST') {
    // set up the inputs for validation
    input.error = {}
    input.my_name = (input.my_name || '').trim()
    input.my_address = (input.my_address || '').trim()

    // validate the inputs
    if (!input.my_name) {
      input.error.my_name = 'Name is required'
    }

    if (!input.my_address) {
      input.error.my_address = 'Address is required'
    }

    // if validation succeeded, store the validated values in the session and
    // redirect to the next page
    if (input.my_name && input.my_address) {
      // merge the validated input with any existing validated input
      req.session.validated = Object.assign({}, req.session.validated, {
        my_name: input.my_name,
        my_address: input.my_address
      })

      input.redirect = '/page-2'
    }
  }

  return input
}
```

### app/views/page-2.hbs
```handlebars
<p>You entered...
<p><strong>Name: </strong>{{validated.my_name}}
<p><strong>Address: </strong>{{validated.my_address}}
```

Note how this example preserves the values the user had already typed so that
nothing is lost if validation fails.

The validated data will now persist for the entirety of the user's session with
the prototype. This can be used to create high-fidelity prototypes modelling
forms with complex validation and many pages.
