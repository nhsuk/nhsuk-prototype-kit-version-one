// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

module.exports = {
  app: {
    // Service name used in header. Eg: 'Renew your passport'
    serviceName: 'Service name goes here',

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
      public: 'public/',
      assets: 'app/assets/',
      docsAssets: 'docs/assets/',
      nhsAssets: 'govuk_modules/',
      nodeModules: 'node_modules/',
      lib: 'lib/'
    }
  }

}
