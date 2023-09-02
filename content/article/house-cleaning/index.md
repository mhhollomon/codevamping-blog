---
title: "House Cleaning"
date: 2023-09-02T14:25:06-04:00
publishDate: 2023-09-03
archives: "2023"
drafts: false
tags: [ "site", "cloudflare" ]
cvtype: "article"
resources:
    - name: hero
      src: "house-cleaning.jpg"
      title: "House Cleaning"
      params:
        credits: Photo by <a href="https://unsplash.com/@jeshoots?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">JESHOOTS.COM</a> on <a href="https://unsplash.com/photos/__ZMnefoI3k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
---

Haven't posted here in a while, but thought it was time to do a little cleaning.

<!--more-->

Almost 3 years since the last post. Lots of water under the bridge and lots of changes in technology.

Getting this website back up and running took a few updates.

## npm

Yea, lots of updates in the last 3 years, but this really wasn't a big issues. Run `npm update` and I was done.

## hugo

Again, lots of changes, but I actuall haven't had to change anything to website
source in order to get it "compile". Kudos to the team.

## Tailwind

This was pain. I had to update from v1.something to v3. A lot has changed in
tailwind and I had to spend a fair amount of time getting the css nice and 
the website looking okay.

Also, the recommended way to integrate tailwind with hugo shifted. Originally,
tailwind and hugo were both being run via npm scripts. But now, tailwind is
being run via hugo iteslf and the postcss integration. It does make things
a bit nicer.

During the deploy builds, I still kick off hugo via an `npm` script, but that is
just to make sure that everything is installed for tailwind and postcss.

There is still work to be done on this front. The website isn't fully onboard
with tailwind. I still have some custom css. But I'll save fixing that when I
do a total redesign the website.

## DNS

I originally bought the domain via Google Domains. It was the easiest thing to
do given that the site runs on Firebase. This also let me do some stuff around
automating the deploys so I could schedule posts.

Buuut - Google Domains is shutting down and the assets (e.g. my domain) are being
sold to SquareSpace. Didn't really want any part of that to be honest. So, I
decided to move my domain to [Cloudflare](https://www.cloudflare.com/products/registrar/).

This turned out to be a bit of a problem. Actually moving the registration and
getting all the records set up was supereasy. But when it was all over, the
website went into a redirect loop.

Turns out that Cloudflare, by default "proxies" the DNS record (
  [See here](https://developers.cloudflare.com/dns/manage-dns-records/reference/proxied-dns-records/)) 
which basically puts Cloudflare in the middle of every transaction. This was
breaking Firebase with a continual redirect loop. A few trips through the docs
and I finally found the page I just linked and how to fix the issue.

No problems since.

##  Firebase/ GCP/ Github

I had set up a series of Github workflow actions to automate Firebase deploy
and gather the information needed to do schedule posts. Of course, everything
about this was now wrong. Mostly it was how to go about authentication the two
sides (github and firebase/gcp) to each other and was solved fairly quickly.

## Conclusion

All-in-all, not too terrible. The tailwind/ccs stuff was the most anger inducing.

More to come.