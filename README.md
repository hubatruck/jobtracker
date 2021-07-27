# JobTrack - track things

---

## Intro

This application's is basically a TODO app.
The purpose of it is for me to learn the usage of ReactJS (with Typescript).

## Details

### Packages used to build the app

- [ReactJS](https://reactjs.org/): framework
- [Ant Design](https://ant.design/): components and icons

### Features of the application

- Add/Edit/Delete tasks
- Store tasks in browser storage (if clearing cache is not disabled), in case you want to use this more than one time

## Technical stuff

### Running this thing on your machine

All things first, you should clone the code, otherwise things will be hard

```shell
$ git clone https://github.com/hubatruck/jobtracker.git
```

After that, install dependencies
```shell
$ cd jobtracker
$ npm install # yarn install
```

Run the app in developer mode

```shell
$ npm start
```

Open the URL in your browser, to access the dev server: http://localhost:3000/

You are all set, enjoy.

### Building

For all those weirdos who actually put their app in *production* state, you can do it by typing in these magic words:

```shell
$ npm run build
```

## Legal things

### License

The project is under the [MIT](https://mit-license.org/) license. ([local version](LICENSE.md))
