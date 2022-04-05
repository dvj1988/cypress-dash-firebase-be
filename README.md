# Cypress Dashboard BE

This repository contains all the API required for cypress dashboard. This repo is meant to be deployed as firebase functions.

Package manager : `yarn`

## How to install and develop

- Install the dependencies

    `yarn`
- Install firebase tools CLI package globally

    `yarn add global firebase-tools`
- Login to firebase

    `firebase login`
- Run the server locally

    `yarn develop`

## Scripts

`yarn build`

Compiles the typescript project to javascript.

`yarn emulate`

Starts the Firebase functions in emulator mode.

`yarn develop`

Compiles the typescript files in watch mode and runs the emulator.
