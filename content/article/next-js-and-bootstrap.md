---
title: "Next.js and Bootstrap"
date: 2023-09-09T18:42:01-04:00
publishDate: 2023-09-14
archives: "2023"
tags: [ 'bootstrap', 'nextjs', 'sass', 'css']
cvtype: "article"
resources:
    - name: hero
      src: "<image name here>"
      title: "<title here>"
      params:
        credits: "<Markdown credit string here>"
---

# Before You Start

I will be assuming the following :

- You will be using Next.js >= 13 with `app` routing rather than the legacy
  `page` routing.
- You will be using Boostrap >= 5.3 so that `jquery` is not required.
- You already know a fair amount about Next.js
- You are starting fresh with a new Next.js project. These instructions can be
  used to retrofit Boostrap into an existing project, however.

# Install

## NPM
Create a new Next.js project and install the needed modules. I use `npm` in the
instructions, but obviously `yarn` can be used as well.


The `--no-tailwind` and `--app` are require. The rest can be changed to suit
your preferences.

```bash
# create the new project without tailwind using the app router.
npx create-next-app@latest test-cna --no-tailwind --app \
    --use-npm --ts --eslint --no-src-dir

# Install the bootstrap source files
npm install bootstrap bootstrap-icons

# Install saas so that Next.js will know to transpile.
npm install --save-dev sass 
```

Next.js natively knows how to minify. Instructions for `purgeCSS` will come
later.

## Update next.config.js

This is a matter of choice. Since Next.js will not accidently route to a scss
file, you can add all your style files into the same directory where the
`globals.scss` is located. This is especially true since Bootstrap (and
Tailwind, for that matter) discourage the use of CSS modules
(e.g. [Like here](https://tailwindcss.com/docs/reusing-styles))

```js
const path = require('path')

const nextConfig = {
sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
```

## global.scss

Rename `global.css` to `global.scss` and use the below as the content.

Note the use of the tilde ("~") to resolve the path into the
`node_modules` directory.

See the [Bootstrap
documentation](https://getbootstrap.com/docs/5.3/customize/sass/) for more
information on options for the content here.

```scss
@import "overrides.scss";

@import "~bootstrap/scss/bootstrap";

@import "styles.scss";

```

## overrides.scss and styles.scss
This is where you put your customizations. `overrides.scss` is used to change
the bootstrap scss varible to affect things like primary color, etc.
`styles.scss` is for any additional styling you may need.

## layout.tsx

change import of `globals.css` to `globals.scss`

# Bootstrap Javacript

Some components available in Bootstrap require the use of javascript in order
to properly render. Unfortunately, you cannot include that js into your Next.js
application.

Instead, use [React Bootstrap](https://react-bootstrap.netlify.app/)

```bash
npm install react-bootstrap
```

# PurgeCSS

Given the size of bootstrap, it is definitely a win to "tree shake" the css
bundle and remove all the class, etc that are not actually used.

Next.js knows about postCSS, so we will integrate PurgeCSS via postCSS.

```bash
npm install --save-dev postcss @fullhuman/postcss-purgecss
npm install --save-dev postcss-flexbugs-fixes postcss-preset-env
```

Put the following in `postcss.config.js`

```js
module.exports = {
  plugins: [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ],

    [
      '@fullhuman/postcss-purgecss', 
      process.env.NODE_ENV === 'production'
        ? {
          content: [
            "./app/*.{js,jsx,ts,tsx}",
            "./app/**/*.{js,jsx,ts,tsx}",
            "./components/**/*.{js,jsx,ts,tsx}"
          ],
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
          safelist: ["html", "body"]
        } : false
    ]
  ],
};
```

See also the [Nextjs PurgeCSS Guide](https://purgecss.com/guides/next.html).

Check the [PurgeCSS Documentation](https://purgecss.com/plugins/postcss.html)
for the complete list of options.
```
