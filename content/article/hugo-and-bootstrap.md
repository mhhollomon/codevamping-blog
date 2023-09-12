---
title: "Hugo and Bootstrap"
date: 2023-09-07T12:05:54-04:00
publishDate: 2023-09-08
archives: "2023"
tags: ['hugo', 'bootstrap', 'css', 'sass']
cvtype: "article"
---


Setting hugo to use bootstrap in a way that allows for customization is not
difficult, but isn't transparent either.

<!--more-->

## Overview

**Bootstrap** is a Sass based CSS framework. It has been wrapped into a Node
package so that it can be "installed" just like any other node package. 

`Hugo` has a a `Sass` compiler built into it. So, all we need to do is make the
files available to Hugo during rendering.

## Pre-requisite

I will assume you already have a hugo project started.

I will also assume you already know a fair bit about `hugo` and can, for
instance, find where the htnl `head` tag matter is defined for your site.

So, go `cd` into the hugo project directory and we'll start there.

## Install bootstrap

We'll need `npm`, so lets let it initialize itself. We're really only using it
as a package manager, so the actual answers to the questions that it asks are not
important.

```bash
# use -y to take all the defaults
npm init -y
```

Make sure that you update your `.gitignore` file so that the
node_modules directory is not checked in.

```bash
echo 'node_modules/' >> .gitignore
```

Now install the needed modules

```bash
npm install bootstrap
```

## Mount Bootstrap files in hugo filesystem

We need to make the bootstrap files - both SCSS and Javascript - available to
hugo during the rendering process. But we don't want to copy since that will
make it difficult to update Bootstrap.

Instead, we are going to use Hugo modules to form a union filesystem - leaving
the Bootstrap files in their original place in `node_modules` so that `npm` can
update for us.

Add the following to the `hugo.toml` file. This will tell hugo to pretend that
the bootstrap js file is actually located in the 'assets/js' directory.

```toml
[[module.mounts]]
    source = "assets"
    target = "assets"
[[module.mounts]]
    source = "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    target = "assets/js/bootstrap.bundle.min.js"
```

## Add Bootstrap Javascript

Add the following to your html near the bottom of the body. For a "normal" hugo
site this will probably be in the file `layouts/partials/footer.html`

If you have other javascript for your site, you can use
`resources.Concat` to bundle it with the bootstrap js. This will make the site
load faster since only one minified file will need to be loaded.

```html
<!-- JavaScript libs are placed at the end of the document so the pages load faster -->

{{ $bootstrap := resources.Get "js/bootstrap.bundle.min.js" }}
{{ $js := $bootstrap | fingerprint }}

<script src="{{ $js.Permalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
```

## Add Sass files and configuration

Look at the [Bootstrap Documentation](https://getbootstrap.com/docs/5.2/customize/sass/)
to see what the sass file should look like. For this article, we will use the
simpler of the two options.

**Note** That the Bootstrap documents use paths such as `../node_modules/some_path` - you
will need to use simply `../some_path` instead.

First the "main" sass file that brings in bootstrap.

```sass
@import "overrides.scss";

@import "node_modules/bootstrap/scss/bootstrap";

@import "styles.scss";

```

Then add the two custom files `overrides.scss` and `styles.scss`

All three files should be put into `assets/sass` directory.

Now lets add the css files to header of the site. This will normally be in
`layouts/partials/head.html` or similar.

```html
{{ $options := (dict "targetPath" "css/styles.css" "outputStyle" "compressed") }}
{{ $styles := resources.Get "sass/main.css" }}
{{ $css := toCSS $styles $options | minify | fingerprint }}

<link rel="stylesheet" href="{{ $css.RelPermalink }}" integrity="{{ $css.Data.Integrity }}">
```

## PurgeCSS
The boostrap css file - even minified - is over 200Kib. Most sites will only use a
small fraction of the utility classes defined. It makes sesnse to use the `purgeCSS`
utility to strip out unused classes.

To help with this, `hugo` can be made to create a file that contains all the classes and tags
that it finds in the html it renders.

### Install needed modules

```bash
npm install --save-dev "@fullhuman/postcss-purgecss" postcss postcss-cli postcss-flexbugs-fixes
```

### Update hugo configuration

The exact change needed in `hugo.toml` will depend on exactly which version of hugo you
have installed. If you are using `v115.3.0` or above the you need the `build.buildStats` lines.
If you are using something below that version, you will need the `writeStats` line.

The block below contains both and it is fine (for now) to include both.

```toml

[build]
  writeStats = true
  [build.buildStats]
    enable = true
```

### create postcss configuration.

Put the following in the postcss.config.js file.

```js
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [ './hugo_stats.json' ],
  defaultExtractor: (content) => {
      let els = JSON.parse(content).htmlElements;
      return els.tags.concat(els.classes, els.ids);
  }
});

module.exports = {
  plugins: [
       purgecss,
  ]
};
```

{{< side-note >}}If you only want the purgeCSS to run in production
please see the [PurgeCSS with Hugo documentation](https://purgecss.com/guides/hugo.html#postcss-config-file)
{{< /side-note >}}

### Update the header

We need to change the template we wrote [above](#add-sass-files-and-configuration) 
in order to force hugo to run the PostCSS process.

We will also use `resources.PostProcess` to tell hugo to wait to run this bit until very
last. We need the other pages to be rendered in order to make sure the `hugo_stats.json`
file contains data for everything.

```html
#replace this:
{{ $css := toCSS $styles $options | minify | fingerprint }}

# with this:
{{ $css := $styles | toCSS $options | postCSS | minify | fingerprint | resources.PostProcess }}
```


## Conclusion

And that is it!

Study the Bootstrap documentation on how to change colors, etc.
