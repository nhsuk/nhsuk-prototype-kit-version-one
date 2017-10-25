# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Creating your first prototype
The simplest prototype is a single page with HTML content. The Prototype Kit takes care
of adding a standard header and footer to your content. Any and all HTML is
allowed within templates. You can also add CSS and Javascript inline with your
content. Templates can also use variables provided by forms within your content.

Additional guides deal with the advanced features of the Prototype Kit such as
server-side logic, page transitions, validation and calling asynchronous APIs.

## Adding a template
The Prototype Kit uses the [Handlebars](http://handlebarsjs.com/) templating engine by default.

Create a file in `app/views` with a `.hbs` extension. The Prototype Kit will automatically expose it at localhost:3000/_your-template-name_ without the .hbs extension. Subdirectories are also supported. For example, a template at `app/views/subdir/template.hbs` will be exposed as localhost:3000/subdir/template

## Viewing the page
To view the page you created, the Prototype Kit server must be started if it is not already.

In the directory you cloned the kit, run the following command to start the server;
```bash
$ npm start
```

Your browser will automatically open and navigate to http://localhost:3000. To
view your prototype page, manually navigate to its name. For example, if you named
the file `app/views/prototype.hbs`, navigate to http://localhost:3000/prototype.

## Adding a form

The Prototype Kit automatically passes incoming form data through to templates without requiring
you to write server-side logic. The Handlebars
engine makes it easy to use these variables to create dynamic page content.

For example, the following template code asks the user to enter their name and greets
them when they submit the form.

```handlebars
<form>
  <label>What is your name? <input type=text name=who_to_greet></label>
  <input type=submit value=Submit>
</form>

{{#who_to_greet}}
<p>Hello {{.}}!</p>
{{/who_to_greet}}
```

The `name` attribute of the input sets the name of the template variable which
contains the value, in this case `who_to_greet`. The greeting message is conditional
on there being a value in the variable. Within this conditional block, the `.`
variable is a Handlebars shortcut for referring to the variable in the conditional.

## Adding styles

The Prototype Kit has built-in styles for basic typography and presentation that matches the
NHS standards. As the templating system allows any HTML, you can freely add styles
inline with your content using `style` attributes. For more general styling such
as adding CSS classes, you can using `<style>` blocks anywhere within your content.

## Adding client-side Javascript

You can add client-side Javascript into a page using `<script>` tags. These work
as they would in a static HTML page.

## Committing your changes to Git

We recommend that you use the Git version control tool to help you keep track of
your progress as you make changes to a prototype, build new prototypes and make
new versions of existing prototypes. Git can also be used for quick and easy publication
of prototypes to platforms such as Heroku and Azure.

For help on the basic use of Git and links to tutorials, see [Setting up git and
doing your first commit](https://govuk-prototype-kit.herokuapp.com/docs/setting-up-git)
from the GOV.UK prototype kit.
