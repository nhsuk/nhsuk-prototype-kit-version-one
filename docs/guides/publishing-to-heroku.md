# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Publishing to Heroku
The Prototype Kit supports simple publishing to [Heroku](https://heroku.com). Once you have installed
the [Heroku command-line tool](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
and committed your prototype code to the local Git repository, follow the
instructions for [deploying to Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app).

### Setting a username and password
When deployed in a production environment, the Prototype Kit requires that a username and
password be set to prevent members of the public stumbling upon your prototype
and mistaking it for a real service.

Use the Heroku CLI to set the `AUTH_USERNAME` and `AUTH_PASSWORD` configuration variables
to your preferred values. For example;

```bash
$ heroku config:set AUTH_USERNAME=spartacus AUTH_PASSWORD=letmein1
```

## Publishing to Azure
Follow the [Azure Node.js Quick Start](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-get-started-nodejs).

For production deployment, set the username and password for the basic authentication that protects the site in the Application Settings section of the Azure console. Add variables named `AUTH_USERNAME` and `AUTH_PASSWORD` to the App Settings list.
