# Teleport Challenge

Frontend challenge for the interview process at Teleport.

## Design Document

If you'd like to learn more about what we're building and why, check out the [design document](design-document/design-document.md).

## Run

In order to run the project, clone this repo and then, in the root directory, simply:

```sh
docker-compose up
```

Once the container starts up, the app will be waiting for you at https://localhost:8080. Accept the risky certificate — or import it as a trusted one from `./server/tls` — and you're good to go.

## Dev

If you prefer the development version of the project, run:

```sh
yarn

# then, either dev version (hot reload and such)
yarn dev

# or something closer to production
yarn build
yarn start:prod
```

To see the tests pass (🤞), go with the standard:

```sh
yarn test
```

 Note that right now, we only have tests for the server, but it's about to change soon enough.