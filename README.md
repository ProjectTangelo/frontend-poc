# frontend-poc

## Download

Get the code using this git command. It will not only clone the repository, but initialize the git submodules.
```
git clone --recursive https://github.com/ProjectTangelo/frontend-poc.git
```

## Install
After you have cloned the repository with the previous command, install all the packages through npm (Node Package Manager) with the following command.
```
npm install
```

Note that if you are on linux, you might need to enable sudo access to install some of the packages. You can do this with by prepending ```sudo``` to the previous command as shown below.

```
sudo npm install
```

## Run the Server
Once you have downloaded the repository and submodules and installed all packages, you can run the server by running the following command at the project's root directory.

```
node keystone.js
```
