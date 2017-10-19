# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Adding custom CSS
There may be scenarios where styles in the Frontend Library do not cover UI necessary for your prototype, or you may be adding a new component that has never been used before. This will require you to write custom CSS.

### Where to put the custom CSS
The folder `assets/scss/nhsuk` is ignored by git as this is pulled in as a dependency and should not be modified locally. If you need to add custom CSS you can do so in the file `assets/scss/app/app.scss`. If you wish to use partials these would live in the same directory - `assets/scss/app/`.

### How to make your custom CSS available
If you started your application using the `gulp`, `npm setup`, or `npm start` command your styles are already being watched for changes and will therefore be automatically compiled.

By default there is a reference to `app.css` in `app/views/layouts/nhsuk_layout.hbs` making it available to all your pages.
