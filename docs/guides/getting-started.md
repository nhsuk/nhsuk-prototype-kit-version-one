# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Getting Started

### Installing the prerequisite tools
To run and develop on the Prototype Kit you need to have Node.js and the bundled
package manager npm installed. We recommend installing version 8 or higher of
Node.js. [Download Node.js](https://nodejs.org/en/download/current/)

You also need the Git version control system installed. [Download Git](https://git-scm.com/downloads)

```bash
$ node -v
v8.6.0
$ npm -v
5.4.2
$ git --version
git version 2.11.0
```

For best results during development you should also install an editor or
Integrated Development Environment that supports HTML and Javascript.

### Cloning the Git repository
The Prototype Kit code is maintained in a [public Git repository on Github](https://github.com/nhsuk/nhsuk-prototype-kit). Clone this into a
directory on your development system like so;

```bash
$ git clone --single-branch https://github.com/nhsuk/nhsuk-prototype-kit.git prototype
```

This clones the master branch (which always represents the latest public release
of the platform) into a subdirectory named `prototype`. Refer to the
[Git documentation](https://git-scm.com/doc) to clone a different branch or use a different directory.

### Running the prototype kit for the first time
After you clone the repository, and any time you pull new updates, you need to
run the kit's setup script. Switch to the directory in which you cloned the repository
and run the following command;

```bash
$ npm run setup
```

This will install all the necessary Node.js package dependencies, build the
styles and start the kit's local server. Once this process is complete, your browser
will automatically be opened and navigate to http://localhost:3000.

You should see the kit's homepage and you're now ready to build your own prototypes!
