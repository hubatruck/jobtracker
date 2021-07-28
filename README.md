# JobTrack - track things

---

### TLDR: [DEMO](https://hubatruck.github.io/jobtracker/)

## Intro

This application is basically a TODO app.

The purpose of it is for me to learn the usage of ReactJS (with Typescript).

## Details

### Packages used during development

- [ReactJS](https://reactjs.org/): framework
- [Ant Design](https://ant.design/): components and icons

### Features

- Add/Edit/Delete tasks
- Store tasks in browser storage (if clearing cache is not disabled), in case you want to use this app more than one time
- Store settings in browser storage
- Ability to make URLs clickable
- Hide completed tasks
- Sort by active tasks first

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

**Note**: The project is built assuming it gets hosted at `/jobtracker/`. You can change this by editing the `homepage`
field in `package.json`.

#### Deploying

If you want to deploy the app to a web server on the current machine, make sure the `REACT_APP_REDIRECT_DAEMON_URL`
environment variable is set to a valid folder.

The following command 

```shell
$ npm run build-and-deploy
```

will do basically what the name suggests, build the application and copy the complied files to the specified folder by
the environment variable

## Legal things

### License

The project is under the [MIT](https://mit-license.org/) license. ([local version](LICENSE.md))

### Additional disclaimer

The code found in this repository should not be taken as general best-practices. I'm still learning on how to use this
framework so there will be plenty of bad code to laugh at.


*Thanks for checking out the repo c:*
