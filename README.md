# Petite

This tiny, or shall we say _petite_, file browser was created as part of the frontend challenge for the interview process at [Teleport](https://goteleport.com).

I did not end up pursuing that path in the end. The code, however, is pretty much as clean as I can make it, using few dependencies, and taking into account all sorts of edge cases. So why not keep it here as a reference?

See a demo at: [https://petite-file-browser.herokuapp.com/](https://petite-file-browser.herokuapp.com/). Give the pod a sec to load, it might have been hybernating for quite some time ;)

## Design Document

If you'd like to learn more about what was built and why, check out the [design document](design-document/design-document.md).

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
yarn start
```

To see the tests pass (🤞), go with the standard:

```sh
yarn test
```