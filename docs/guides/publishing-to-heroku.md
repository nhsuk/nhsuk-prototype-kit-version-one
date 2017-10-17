# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Publishing to Heroku
The Prototype Kit supports simple publishing to [Heroku](https://heroku.com). Once you have installed
the [Heroku command-line tool](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
and committed your prototype code to the local Git repository, follow the
instructions for [deploying to Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app).

## Setting a username and password
When deployed in a production environment, the Prototype Kit requires that a username and
password be set to prevent members of the public stumbling upon your prototype
and mistaking it for a real service.

Use the Heroku CLI to set the `USERNAME` and `PASSWORD` configuration variables
to your preferred values. For example;

```bash
$ heroku config:set USERNAME=spartacus PASSWORD=letmein1
```
