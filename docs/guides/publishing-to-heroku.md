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

Use the Azure Portal or other tool to add tbe following to the App Settings list
in Application Settings.
- `WEBSITE_NODE_DEFAULT_VERSION` set to the version of Node.js in package.json
- `AUTH_USERNAME` and `AUTH_PASSWORD` set to the username and password used to protect the prototype

![Screenshot of Azure Portal showing the settings](/docs/assets/azure-settings.png)
