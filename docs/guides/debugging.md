# NHSUK Prototype Kit
[Table of Contents](/docs/guides/index.md)

## Debugging

There are several methods available for debugging your prototypes.

### console.log

The simplest debugging method is to place calls to
[console.log](https://nodejs.org/api/console.html#console_console_log_data_args)
within your code to inspect the values of variables. In server-side logic you can combine
this with the Node.js [util.inspect](https://nodejs.org/api/util.html#util_util_inspect_object_options)
method to expand and pretty-print objects.

For example;

```js
function mayBeBuggy (input) {
  console.log('Input to mayBeBuggy:', require('util').inspect(input))

  // ... rest of function
}
```

### Running the prototype kit server in debug mode

For more control over the execution of your prototype's server-side logic, such
as single-stepping and setting breakpoints, the prototype kit server can be
started in debug mode and attached to using Chrome DevTools.

```bash
$ npm run debug
```

To attach to the debug server, open Google Chrome and navigate to the URL
[chrome://inspect](chrome://inspect). Under the heading "Remote Targets" is an
entry for `server.js`. Click this to attach the developer tools to the running
server. Using the tools you can set breakpoints, inspect variables and single-step
through your code to help you find faults.

Note that the server-side logic files for your prototype are loaded on-demand, so
if you have not yet run a page of your prototype, its logic file will not appear
in Chrome Devtools.

### Manually adding breakpoints to your code

In combination with using Chrome Devtools for single-stepping, you can insert
explicit breakpoints in your code using the `debugger` statement.

```js
function hasManualBreakpoint (input, req) {
  if (req.method === 'POST') {
    debugger // If attached, DevTools will pause your code here

    // ... rest of method
  }
}
```

Note that when running in debug mode, the prototype kit server will not automatically
reload when your code changes. You must manually stop the server, restart it and
reattach the Devtools for the manual breakpoint to take effect.
