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

I will assume you already have a hugo project started and that it is in the
directory `${HUGO_PROJECT}`

I will also assume you already know a fair bit about `hugo` and can, for
instance, find where the htnl `head` tag matter is defined for your site.

So, go `cd` into that directory and we'll start there.

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

Add the following to the `hugo.toml` file. Note that since we are only
mounting a single subdirectory, the other subdirectories need to be mounted on
themselves.

```toml
[module]
[[module.mounts]]
    source = "node_modules/bootstrap/dist/js"
    target = "assets/bootstrap/js"
    includeFiles = "bootstrap.bundle.min.js"
[[module.mounts]]
    source = "node_modules/bootstrap/scss"
    target = "assets/bootstrap/scss"

# This is where our customizations will go.
[[module.mounts]]
    source = "assets/sass"
    target = "assets/sass"

# Add any others as necessary
[[module.mounts]]
    source = "assets/images"
    target = "assets/images"
```

## Add Bootstrap Javascript

Add the following to your html near the bottom of the body. For a "normal" hugo
site this will probably be in the file `layouts/partials/footer.html`

If you have other javascript for your site, you can use
`resources.Concat` to bundle it with the bootstrap js. This will make the site
load faster since only one minified file will need to be loaded.

```html
<!-- JavaScript libs are placed at the end of the document so the pages load faster -->

{{ $bootstrap := resources.Get "bootstrap/js/bootstrap.bundle.min.js" }}
{{ $js := $bootstrap | minify | fingerprint }}

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

@import "../bootstrap/scss/bootstrap";

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


## Conclusion

And that is it!

Study the Bootstrap documentation on how to change colors, etc.
