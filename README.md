# frontend-poc

Server for directing the API calls and serving the content for Tangelo's master server

## Download

Get the code using this git command. It will not only clone the repository, but initialize the git submodules.
```bash
git clone --recursive https://github.com/ProjectTangelo/frontend-poc.git
```

## Install
After you have cloned the repository with the previous command, install all the packages through NPM (Node Package Manager) with the following command.
```bash
npm install
```

Note that if you are on Linux, you might need to enable sudo access to install some of the packages. You can do this with by prepending ```sudo``` to the previous command as shown below.

```bash
sudo npm install
```

## Run the Server
Once you have downloaded the repository and submodules and installed all packages, you can run the server by running the following command at the project's root directory.

```bash
npm start
```
#### Stop
```bash
npm stop
```

#### Restart
```bash
npm restart
```

## Testing
Testing available via the npm test script
```bash
npm test
```
