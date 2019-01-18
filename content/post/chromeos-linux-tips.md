---
layout: post
title:  "Chrome OS Linux Container (crostini) tips"
date: "2018-11-18"
publishDate: "2018-11-18"
archives: "2018"
tags: ["crostini", "Chrome OS", "ChromeBook", "tip"]
---
The new Linux Containers available on some ChromeBooks are manna from heaven if you are developer. Having a full blown Debian based distribution just a click away makes supported ChromeBooks very usable development platforms. And getting such a device can be cheap.

Here is a set of tips to help make things a little nicer.

<!--more-->

## Clock Drift on ARM

**latest update 2019-01-18** : M72 has hit the Beta channel and I have tested
and the fix seems to work!
**update 2018-11-28** : Fix is merged and should be in M72 (which is scheduled
for beta on Dec 13 and stable on Feb 5),

[According to this issue](https://bugs.chromium.org/p/chromium/issues/detail?id=823406), the ARM ecosystem does not virtualize the clock. So, if the system goes to sleep, the clock will simply stop.

I can certainly confirm this on my Samsung ChromeBook Plus (as of 2018-11-21).

It looks like they are working on a work-around, no telling when that will hit the channels.

The work-around for now is in the issue, stop/start the virtual machine (see below).

## Viewing local servers.

Many systems these days come with a bundled local webserver to allow you test you changes without having to stage to a external host. BY default, these always want to listen on localhost (127.0.01). But hthe Linux container is a full-fledge VM and some localhost is, well, local. THi means that you can't use the "main" browser and point it to the localhost and have anything useful happen.

One solution is to install the browser of your choice into the VM and use that. But you have a perfectly good browser already installed, so why take up the space to install another.

In order to use the main browser, you need to coax the local webserver to listen on the external interface. To get the external interface, you can use the command `hostname -I` (note the capital I). 

As an example here is the command to make jekyll use the external interface.
~~~~
jekyll serve --server `hostname -I`
hugo server --bind `hostname -I` --baseURL `hostname -I`
~~~~

To view the server, point the browser to
~~~~
http://penguin.linux.test:<port>
~~~~

ChromeOS points that synthetic domain to your Linux VM.

## Configure the terminal

While in the terminal hit `ctrl-shift-P`. This will bring up a browser tab with settings such a font and colors.

## Force shutdown the VM

IN recent version beta versions, there is actually a menu item to do this. 
Right click on the terminal icon and you should see a "Shut Down Linux (Beta)" item.

If not, you can do it in crosh.

`Ctrl-At-T` to bring up `crosh` shell.

Enter the command: `vmc stop termina`

It will automatically restart when you start Terminal app.

The default VM name is **termina**
The default container is **penguin**

## Access the distribution from crosh

~~~
Ctrl-Alt-T                                 # open crosh
vsh termina                                # start the VM and get a command prompt
lxc exec penguin -- /bin/login -f <userid> # start the container
~~~
