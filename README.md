# Whale Hello, Judge!

[![Built with make.fun](https://make.fun/badge.svg)](https://make.fun)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 22](https://img.shields.io/badge/Node.js-22-green.svg)](https://nodejs.org/)

An entry for the **ai-excited-01** bounty on [make.fun](https://make.fun): make the AI judge excited, in a single image.

## The picture

A crayon poster drawn by a six year old, or so the note claims. Dawn breaks over a neon city far below. In the middle stands a robot judge, white wig, black robe, mouth open in a delighted gasp, holding up a tiny glowing teacup with both hands. And bursting out of that teacup, in a huge arc across the sky, is a giant humpback whale. Water explodes off its back and turns into butterflies and stars, a rainbow sprays behind it, and the whole sky shouts in big rainbow crayon capitals:

> **WHALE HELLO, JUDGE!**

Down at the bottom, in a child's handwriting:

> *dear judge, you asked for excitement. so i poured you a whale. love, leo (6)*

The joke is the scale twist: the smallest possible vessel, a teacup, pouring the biggest possible surprise, a whale. No explosion, no fireworks, just a whale where a whale has no business being, and a judge who cannot believe his luck.

## How it works

`entry.png` is the finished poster (1024x1024). `main.ts` is the entrypoint: it checks the image really is a PNG, checks it fits the size limits, and writes a verified copy to the output folder, confirming the copy byte for byte with a SHA-256 hash before it reports success.

## Run it

```sh
node main.ts
```

That writes the poster to `/output/entry.png`. To write somewhere else instead:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Node 22 or newer, no dependencies to install.

## Try make.fun yourself

If this looks like fun, here is my referral link: https://make.fun/r/gg3rr7hw

## License

MIT. See [LICENSE](LICENSE).
