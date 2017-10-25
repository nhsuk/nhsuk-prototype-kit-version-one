// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

const srcPath = './assets/'
const destPath = './public/'

module.exports = {
  app: {
    // Default port that prototype runs on
    port: '3000',

    // Enable or disable password protection on production
    useAuth: 'true',

    // Automatically stores form data, and send to all views
    useAutoStoreData: 'true',

    // Enable or disable built-in docs and examples.
    useDocumentation: 'true',

    // Force HTTP to redirect to HTTPs on production
    useHttps: 'true',

    // Cookie warning - update link to service's cookie page.
    cookieText: 'GOV.UK uses cookies to make the site simpler. <a href="#">Find out more about cookies</a>',

    // Enable or disable Browser Sync
    useBrowserSync: 'true'
  },

  gulp: {
    paths: {
      public: destPath,
      assets: srcPath,
      docsAssets: 'docs/assets/',
      // nhsukAssets: 'govuk_modules/',
      nodeModules: 'node_modules/',
      lib: 'lib/'
    },
    css: {
      // src: srcPath + 'scss/**/[!_]*.scss',
      src: [srcPath + 'scss/app/**/*.scss', srcPath + 'scss/nhsuk/**/*.scss'],
      dest: destPath
    },
    scripts: {
      src: [srcPath + 'scripts/app/**/*.js', srcPath + 'scripts/nhsuk/**/*.js'],
      dest: destPath
    }
  }

}
