---
title: "Working on a Remote VM"
date: 2019-10-12T09:47:38-04:00
publishDate: 2019-10-12
archives: "2019"
draft : true
tags: ["crostini", "virtualbox"]
---

Logging into a remove VM from a local VM: A twisted story

<!--more-->

## The Problem

My main development system is [ArchLinux](https://www.archlinux.org/) running
in a [VirtualBox](https://www.virtualbox.org/) VM on a Windows 10 machine.

My mobile platform is a crostini VM running on a Samsung Chromebook.

For now, if I want to work on my main system while mobile, I do so by using
[Chrome Remote Desktop](https://remotedesktop.google.com/access/).

This works reasonably well, but there are two problems:

1. My desktop screen has a vastly different Aspect Ratio from my chromebook.
   The resulting letterboxing makes the desktop tiny and hard to deal with.

2. If I have to work tethered to my cell phone, bandwith limitation can do
   weird things to the screen and cause usability problems.

My main "IDE" is vim, so I really don't need graphics that much.

## The Goal

Use `ssh` (or something) to get from the crostini VM on my chromebook to the
VirtualBox VM on my desktop. Major extra credit if X can be tunnelled back. But
I'm comfortable with plain old tmux/vim.

## The Journey

I decided to tackle this a small step at a time. I assumed that the two biggest
pieces were going to be making the Win10 box visible on the internet and
forwarding from there to the Virtualbox VM.

### Step 1 - Chromebook to Win10

**Chromebook client**
Google makes an [SSH client for the chrome
OS](https://chrome.google.com/webstore/detail/secure-shell-app/pnhechapfaindjhompbnflcldabbghjo?hl=en).
So that is easy.

**Windows 10 Server**
Windows 10 has an SSH server available, but it is a bit of a task to install. I
finally found a [microsoft
document](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse) that gave the following two commands.

They need to run in a powershell window with admin privileges.
Note also that this takes a while.

```powershell
Get-WindowsCapability -Online | ? Name -like 'OpenSSH*'
Add-WindowsCapability -Online -Name 'Server name from above'
```

You'll need to reboot afterwards, even though the output of the command says
you don't.

Now, go to the services settings and start the server. And then immediately
stop it. This is needed to get it to create some directories.

Then from an elevated shell - do -

```powershell
cd C:\windows\system32\OpenSSH
ssh-keygen -A
```

The permissions on the key files need to be set. Fortunately, Microsoft has
provided a hack for that:

```powershell
Install-Module -Force OpenSSHUtils
Repair-SshdHostKeyPermission -FilePath C:\ProgramData\ssh\ss_host_ed25519_key
```

Now, back to the services menu and restart the server.

And boom! we're in.

Note, to get the local area IP for your Win 10 box, you can use `ifconfig`

### Step 2 - crostini to Windows 10

I figured this would be a no brainer. Just fire up the ssh and do it.`


### Resource

Here are some articles I found helpful while doing the research for this.

**windows 10 ssh server**
https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_server_configuration
https://winaero.com/blog/enable-openssh-server-windows-10/
https://poweruser.blog/enabling-the-hidden-openssh-server-in-windows-10-fall-creators-update-1709-and-why-its-great-51c9d06db8df
