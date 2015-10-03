Legal-Kosher!!!
Is your repo legal? Are you writing an amazing project that will end up being FORCED to be open sourced, all because of a nested dependency on a license you didn't know about?

Find out now!

***

## Quick Start

Install Node.js and then:

```sh
$ sudo npm -g install grunt-cli bower
$ npm install
$ bower install
$ grunt watch
```

start node server by running ...

```sh
$ node server.js
```

in the /server directory.

Finally, open `http://localhost:8008/` in your browser.


## Dev

After going through quickstart...
src/app contains app logic
src/assets contains external thingys
src/less contains all styling

only edit src/ files

Grunt watch will compile

Server reads from /build directory
