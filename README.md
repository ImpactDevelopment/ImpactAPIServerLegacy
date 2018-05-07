# Impact API Server

An API for Impact...

## Installing

First ensure nodejs and npm are correctly installed by running `node -v` and `npm -v`. If not follow instructions for your OS [here][install-node].

Next make sure to clone this repo. If you have git installed you can run `git clone https://github.com/ImpactDevelopment/ImpactAPIServer.git`. If not you can still [download][download-repo-zip] the repo as a zip archive instead.

Finally you want to install the project's dependencies using npm. `cd` a terminal iside of the repo directory and run `npm install`.

## Running

To start the server run `npm start`. You should see something like this:

```bash
$ npm start

> impact-api@0.0.1 start /path/to/ImpactAPIServer
> node index.js

info: util:logger: ENV LOG_LEVEL = info
info: app:main: initializing
info: app:main: ready. listening on PORT  8080
```

You can now send requests to `localhost` using the port printed by the server (in the example above that's `localhost:8080`)

_Note: it is important to use `npm start` instead of `node index.js` because we set a custom `NODE_PATH` and require [`esm`](https://github.com/standard-things/esm)_

## Credits

- [node-restify-jwt-sample][nrjs-example] by @supermamon

[nrjs-example]: https://github.com/supermamon/node-restify-jwt-sample
[install-node]: https://nodejs.org/en/download/package-manager
[download-repo-zip]: https://github.com/ImpactDevelopment/ImpactAPIServer/archive/master.zip
