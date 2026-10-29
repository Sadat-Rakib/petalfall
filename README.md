# Petalfall 花吹雪

A cherry blossom tree that grows itself in your browser. Petals fall from the crown, drift on a
wandering wind, settle in the grass and fade — and every time you regrow it, the tree is different.
There is also a bonsai, growing out of a mossy rock.

It is both an app you can open and a small package you can put on your own site (`npm i petalfall`).

Plain TypeScript and Canvas 2D, **no runtime dependencies**. The whole app is about 29 KB gzipped,
and the package on its own, without the control bar, is about 21 KB.

<p align="center">
  <img src="docs/preview-weeping-rain.jpg" alt="A lavender weeping cherry in the rain, under moonlight" width="100%">
</p>

## Why I built this

As a visual learner, I've always wanted to make things more interactive instead of just staring at
static content. I wanted something I could actually play around with, customise, and experience
visually — especially on my own pages, where a hero image just sits there doing nothing.

So I built this: a scene that grows a tree procedurally, drops petals when the wind moves it, lets
you shake blossom loose with a click, change the weather, and regrow a completely different tree on
a whim. A simple idea, turned into something interactive, visually engaging, and honestly just fun
to fiddle with.

A note on where it comes from: the tree-growing engine started life as
[sakura-tree](https://github.com/Andrew-Velox/nozomi) by Andrew-Velox, released under the MIT
licence. I rebuilt the project under my own name — new identity, new documentation, updated
packaging and deployment — and I maintain it from here. All credit for the engine and the original
design belongs where it belongs; see [Credits](#credits--license) and `NOTICE.md`.

## The problem it solves

Static banners and hero images are dead weight, and a video background costs megabytes for a loop
you stop noticing after five seconds. I wanted a background that is *alive* but nearly free:

- **Tiny.** ~21 KB gzipped for the package, zero dependencies, one canvas, no images or audio files.
- **Cheap to run.** You can cap the frame rate (24/30/45/60 fps), it stops drawing when scrolled out
  of view, and it quiets down for people who prefer reduced motion.
- **Flexible.** Use it as a fullscreen ambient wallpaper, a hero section, a card on your page, or a
  transparent overlay drawn *over* your existing background.

## Features

- **Two looks.** *Cell mode* is blocky, in the style of a terminal. *Detail mode* is a fully
  branched pixel tree whose limbs fork and taper into twigs.
- **Two trees.** A cherry in blossom, and a bonsai with a gnarled trunk and layered pads of leaves,
  growing from a mossy rock, with boulders and wild flowers.
- **Eleven bonsai styles** (moyogi, chokkan, shakan, fukinagashi, sokan, hokidachi, ishitsuki,
  nejikan, hankengai, kengai, bunjin) and **three kinds of cherry** (yoshino, bush, shidare) — or
  let it pick randomly. No two trees are alike.
- **Alive.** Petals sway and tumble as they fall, blossom clusters ripple, and clicking or dragging
  on the tree shakes blossom loose and sends ripples through it.
- **Wind and weather.** A wind that wanders and gusts; clear, sunset, moonlight, overcast and mist
  skies; a rain switch that works on top of any of them.
- **16 colours** for blossom and leaves, from sakura pink to lavender, mint, gold, maple and autumn.
- **Ambient mode** as a wallpaper: fullscreen, controls fade when idle, live fps readout.
- **Synthesised sound** — wind, rain and a chime on click, all generated with the Web Audio
  API. Nothing loads until you switch it on.
- **Works on a phone.** The controls collapse into a small menu button and open as a bottom panel.
- Settings are remembered between visits.

## Demo and screenshots

Regrow the tree, change the weather, switch to the bonsai — the app itself is the demo:

**Live demo: [petalfall-cyn.pages.dev](https://petalfall-cyn.pages.dev)**

| A kengai bonsai in maple, under moonlight | Cell mode, sunset |
| --- | --- |
| ![A bonsai cascading over its rock in maple colours](docs/preview-bonsai.jpg) | ![A peach bush cherry at sunset in the blocky cell style](docs/preview-cell-sunset.jpg) |

## Tech stack

- **TypeScript** — the whole thing, strict mode.
- **Canvas 2D** — every frame is drawn, nothing is a recorded animation or a sprite sheet.
- **Web Audio API** — wind, rain and chimes are synthesised on the fly.
- **Vite** — dev server and builds, for the app and the npm package.
- **Zero runtime dependencies.**

## Run it locally

```bash
git clone https://github.com/Sadat-Rakib/petalfall
cd petalfall
npm install
npm run dev       # http://localhost:5173
```

Other scripts:

```bash
npm run build     # type-check and build the site into dist/
npm run preview   # serve the built site locally
npm run build:lib # build the npm package into lib/
```

Node 20 or newer is recommended.

## Use it on your site

```bash
npm i petalfall
```

**In any element:**

```js
import { createPetalfall } from "petalfall";

const petalfall = createPetalfall("#hero", { palette: "lavender", form: "shidare", weather: "moonlight" });
```

**As a page background** (only the tree, petals and rain are drawn, so your page shows through, and
clicks still reach your page):

```js
createPetalfall(document.body, { background: "transparent", interactive: false });
```

**As a web component:**

```html
<script type="module">import "petalfall/element";</script>

<petalfall palette="peach" form="bush" weather="sunset" rain style="height: 420px"></petalfall>
```

**From a script tag, with no build step:**

```html
<script src="https://unpkg.com/petalfall"></script>
<petalfall palette="sakura" detail></petalfall>

<!-- a bonsai, in maple leaves -->
<petalfall tree="bonsai" form="kengai" palette="maple"></petalfall>
```

Change anything later with `petalfall.set({ palette: "mint", rain: true })`, or by changing the
attributes of the element. When you are done, `petalfall.destroy()` removes it.

### Options

Every option is optional.

| Option | Default | What it does |
| --- | --- | --- |
| `tree` | `"sakura"` | `"sakura"` (a cherry in blossom) or `"bonsai"` (a tree on a mossy rock). Switching grows a new tree, with that tree's own colour and form unless you pass them too. |
| `palette` | `"sakura"` (`"pine"` for the bonsai) | Blossom or leaf colour: `sakura` `blush` `rose` `peach` `coral` `gold` `lavender` `violet` `sky` `mint` `matcha` `white` `pine` `juniper` `maple` `autumn`. |
| `form` | `"yoshino"` (`"moyogi"` for the bonsai) | The cherry: `yoshino`, `bush`, `shidare` (weeping) or `random`. The bonsai: `moyogi`, `chokkan`, `shakan`, `fukinagashi`, `sokan`, `hokidachi`, `ishitsuki`, `nejikan`, `hankengai`, `kengai`, `bunjin` or `random`. Changing it grows a new tree. |
| `detail` | `false` | `true` for the finely branched pixel tree, `false` for the blocky cell style. (The bonsai is always drawn finely.) |
| `petals` | `5` | How many petals, 1 to 10. |
| `wind` | `3` | Wind strength, 0 to 10, or `false` for still air. |
| `weather` | `"clear"` | `clear`, `sunset`, `moonlight`, `overcast` or `mist`. |
| `rain` | `false` | Rain falling through the weather. |
| `background` | `"sky"` | `"sky"` draws its own night sky; `"transparent"` draws only the tree, petals and rain. |
| `fps` | `60` | Draw at most this many frames per second (5 to 60). |
| `seed` | random | The same seed grows the same tree. |
| `sound` | `false` | Wind and rain sound, and a chime on click. Browsers only allow it after a click or key press. |
| `interactive` | `true` | Clicking or dragging shakes the blossom. Turn it off to let clicks through to your page. |
| `cursor` | `true` | The arrowhead cursor in the blossom colour over the scene. |

When you create a scene you can also pass `fixed` (fill the whole window; the default when the
container is `document.body`), `zIndex`, `touchAction` (default `"pan-y"`, so a finger can still
scroll the page) and `respectReducedMotion` (default `true`).

### Methods

`set(options)` · `regrow(seed?)` · `gust(strength?)` · `pause()` · `resume()` ·
`screenshot()` (a PNG blob) · `destroy()` · and the read-only `options`, `fps`, `canvas` and
`container`.

The scene needs a browser, so create it on the client — in a framework, inside an effect or
`onMount`.

### Keyboard and controls (in the app)

Everything is in the bar at the bottom; on a phone it collapses into a menu button that opens the
controls as a bottom panel. The keyboard works too: `space` gust, `r` regrow, `t` switch tree,
`s` style, `c` colour, `d` detail mode, `p`/`P` petals, `w` wind, `e` weather, `y` rain, `m` sound,
`f` ambient mode. Click or tap the tree to shake blossom loose.

![The control bar at the bottom of the screen](docs/preview-detail.jpg)

## Deploying your own copy

It is a static site, so any static host works — build with `npm run build` and serve `dist/`.
The build uses relative asset paths, so it also works from a sub-folder.

**Cloudflare Pages** (how I host it): create a Pages project, set the build command to
`npm run build` and the output directory to `dist`. Or deploy straight from the CLI:

```bash
npm run build
npx wrangler pages deploy dist
```

This repository also ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys
to Cloudflare Pages on every push to `main` once you opt in: add `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` as repository secrets, set the repository variable `CLOUDFLARE_DEPLOY=on`,
and it takes over from there.

## Credits & license

- **[sakura-tree](https://github.com/Andrew-Velox/nozomi)** by Andrew-Velox — the original project
  and the tree-growing engine behind this one, released under the MIT licence. Petalfall is a
  rebuild of it, and the engine's design is entirely their work.
- **[csakura](https://github.com/realstrawhat/csakura)** — the look and the approach to growing the
  trees were inspired by, and follow, its web demo. Its licence is reproduced in `NOTICE.md`.
- **[nagomi](https://github.com/msk1039/nagomi)** by Mayank Kadam — the inspiration for a calm
  procedural scene with weather and a single control bar.

Code and additions in this repository are released under the MIT licence — see `LICENSE` for the
copyright notices, and `NOTICE.md` for third-party attributions.
