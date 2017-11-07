# Setting a username and password for production

Any prototype published on the web (production) should be protected by a username and password.

Protecting a prototype prevents the case where a member of the public mistakes a prototype for a live service.

## On Heroku

> This presumes you have already followed our guide for [publishing on heroku]() and have the Heroku toolbelt installed.

To add a username, in the root directory of your app in terminal enter the command:

```
heroku config:set AUTH_USERNAME=username_here
```

To add a password, from the same place, enter the command:
```
heroku config:set AUTH_PASSWORD=password_here
```

## On Azure

In the Azure console, access the application, go to Application Settings and add the variables AUTH_USERNAME and AUTH_PASSWORD into the list under App Settings.

## Any other platform

If, for any reason, you need to publish your prototype on any other platform, you can add a username and password by adding the following entries to you `.env` file.

```
AUTH_USERNAME=username_here
AUTH_PASSWORD=password_here
```

The `.env` file can be found in the root directory of your app.

> You should never commit your `.env` file to source control. This should live on your production environment.
