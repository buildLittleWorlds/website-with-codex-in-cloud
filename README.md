# The shadow & the deep

A three-page static site about noir and Lovecraftian cosmic horror, hosted on GitHub Pages.

## Develop

The HTML and CSS can be edited directly. Serve the repository with `npm start`,
then open the local server in a browser.

The home page's decorative tentacle is a looping Remotion Player. Its React
source lives in `animation/`; the production bundle lives in `assets/` and is
committed so GitHub Pages can serve it without a build server or external CDN.

To install dependencies and rebuild after changing the animation:

```sh
npm ci
npm run build
```

If the cloud machine's default npm cache is not writable, use
`npm ci --cache /tmp/aesthetic-npm-cache` instead.

Commit the animation source, lockfile, and rebuilt bundle together. The animation
has a pause/play control, starts paused with reduced motion enabled, and pauses
when the browser tab is hidden.
