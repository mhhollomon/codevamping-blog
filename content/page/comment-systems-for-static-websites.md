---
title: "Comment Systems for Static Websites"
date: 2018-12-21T08:40:22-05:00
publishDate: "2018-12-30"
description: "A listing of comment systems for use with static websites"
tags: ["Website Tech"]
---

**updated 2019-10-09**

Static websites are fast and tend to be simple to maintain. But the lack of
processing on the server side means that comments (and other interaction) is a
bit of a hassle. 

Below is a list - by no means complete - of the systems for doing comments on a
static website. In the end, they all amount to the same thing; using a server
to serve comments. The differences are all around who's server are you using.

For each system, I try to give a neutral description. Afterwards, in italics,
I've given my very subjective opinions. Those should be taken with a grain of
salt.

I expect to continue to add to this list as I have time. Please see the
References at the end for other lists.

Note: the below list is in alphabetical order.

<table>
<thead>
<tr><th>System</th><th>description</th></tr>
</thead>
<tbody>
<tr>
    <td><a href="https://commento.io/">Commento</a></td>
    <td><a href="https://gitlab.com/commento">Open Source</a>. Hosted with Up to
    50,000 page views per month for about 5$/month. Or DIY hosting. No free tier.
    But makes promises about privacy. Full OAuth support, so google, etc. Integrates with Akismet.
    Possible to integrate with your own auth system.
    <br>[<i>I Don't see a way to specify the page to comment linkage.</i>]
    </td>
</tr>
<tr>
    <td><a href="https://commentbox.io/">CommentBox</a></td>
    <td>Closed Source. Free plan only allows 100 comments per month (but
    unlimited views). Page to comment linkage can be specified in the
    Javascript.
    <br>[<i>One of the nicer privacy policy pages. Penalty for going over the
    free limit is pretty steep.</i>]
    </td>
</tr>
<tr>
    <td><a href="https:/disqus.com">Disqus</a></td>
    <td>Probably the best known of the services. Free, but ad-based. Comment
    data resides in their servers. User authentication is done. The user can
    sign-up using a Google account, A Facebook account, or an email and
    password.  The user's identity will follow to all sites using Disqus.
    <br>[<i>Lots of privacy concerns. And the <b>types</b> of ads are also
    concerning.</i>]
    </td>
</tr>
<tr>
    <td><a href="https:/discourse.org">Discourse</a></td>
    <td>The software is open-source hosted on <a
    href="https://github.com/discourse/discourse">Github</a>. Login can be
    integrated with most social sites. There is a really comprehensive api for
    automating tasks or keeping stats. Your hosting choices are
        <ul>
        <li>Host it yourself</li>
            <ul><li>The lowest hosted plan is $100/month.</li></ul>
        <li>Pay Discourse to install it on <a
        href="https://www.digitalocean.com/">Digital Ocean</a> -  no support after
        the install</li>
        <li>Pay Discourse to host it</li>
        </ul>
</tr>
<tr>
    <td><a href="https://github.com/imsun/gitment">Gitment</a></td>
    <td>Open Source. Stores comments as github issues similar to utterances. You 
    have to initialize each page as it is published.
    </br>[<i>Utterances wears it better</i>]
    </td>
</tr>
<tr>
    <td><a href="https://graphcomment.com/en/">GraphComment</a></td>
    <td>Free up to a million page views. Integrates login with social sites.
    Has support to do sharing without redirection to the GraphComment servers.
    The free tier spam filtering is all manual. 
    </br>[<i>Unconfirmed, but some sources say it injects a Facebook script.</i>]
    </td>
</tr>
<tr>
    <td><a href="https://intensedebate.com/home">IntenseDebate</a></td>
    <td>Closed Source. By Automattic - the company behind Wordpress.Com (not org) and Akismet.
    <br>[<i>Sorry can't take that name seriously. Also, nothing on the site
    about pricing.</i>]
    </td>
</tr>
<tr>
    <td><a href="https://posativ.org/isso/">isso</a></td>
    <td>Do-it-yourself to the max. Written in python. Comments stored in
    SQLite. You figure out the hosting.
    <br>[<i>I <b>love</b> the hacker mentality.</i>]
    </td>
</tr>
<tr>
    <td><a href="https://just-comments.com/">JustComments</a></td>
    <td><a href="https://github.com/JustComments">Open Source</a>. Hosted option.
    Integrates login with social sites or you can provide an auth end point
    for them to call.  Anonymous posting is possible, but can be disabled.
    The page id is settable from the html.
    <br>[<i>The description of the pricing is a bit disjointed, but for a small
    website, it looks like it will run $6/month. Do note that the email feature is
    relatively expensive.</i>]
    </td>
</tr>
<tr>
    <td><a href="https://muut.com/">Muut</a></td>
    <td>Closed Source. Lowest plan is $16/month.
    <br>[<i>Way more than a simple blog post commenting system</i>]
    </td>
</tr>
<tr>
    <td><a href="https://remark42.com/">Remark42</a></td>
    <td><a href="https://github.com/umputun/remark">Open Source</a>. Self-hosted.
    Has integration with many major Social Media sites as well as email login 
    and (configurable) anonymous
    posting. Very complete moderating tools. Page id can be set in the page's
    javascript.
    <br>[<i></i>]
    </td>
<tr>
    <td><a href="https://staticman.net/">StaticMan</a></td>
    <td>Stores comments as text files in your github repository. Has integration
    to Akismet and reCaptcha. It can be used for any interaction with the user.
    This is just a backend. You get to code the submission form and figure out
    how to display the comments. Code is hosted on <a
    href="https://github.com/eduardoboucas/staticman">GitHub</a>. Good
    information on configuring with hugo is <a
    href="https://binarymist.io/blog/2018/02/24/hugo-with-staticman-commenting-and-subscriptions/">
    here</a>.
    <br>[<i>I don't mind the set up work - it only needs to be done once. But
    the actual work binarymist goes through for each post (see comments on the
    post) is a bit much. Can it be automated a bit? Also, <a
    href="https://github.com/eduardoboucas/staticman/issues/243">GitHub
    limits</a></i>]
    </td>
</tr>
<tr>
    <td><a href="https://coralproject.net/talk/">Talk by the Coral
    Project</a></td>
    <td>Founded by Mozilla, democracy fund, and others. <a
    href="https://github.com/coralproject/talk">Open Source</a>. For a small
    blog, this would definitely be a DYI process.
    </td>
<tr>
    <td><a href="https://www.talkyard.io/">TalkYard</a></td>
    <td><a href="https://github.com/debiki/talkyard">Open Source</a> so you
    could host yourself. Hosted option has a low cost (1 Euro/month) plan for
    100 new comments per month.
    <br>[<i>Assuming this is hosted in Europe, is there a GDPR implications for
    US citizens?</i>]
    </td>
</tr>
<tr>
    <td><a href="https://utteranc.es/">Utterances</a></td>
    <td><a href="https://github.com/utterance">Open Source</a>
    Stores the comments as comments against github issues. Each issue will
    represent the comments for a particular page. You can control association. The
    workflow is done by calling GitHub API in javascript directly from your page.
    <br>[<i>Does require that the commenter be a GitHub user. This is what I am
    currently using on this wesite.</i>]
    </td>
</tr>
</tbody>
</table>

## References

- [Hugo comment system
  listing](https://gohugo.io/content-management/comments/#comments-alternatives)
- [Derek Kay blog post](https://darekkay.com/blog/static-site-comments/)
- [Static Man Example Site](https://mademistakes.com/) and the [GitHub
  Repo](https://github.com/mmistakes/made-mistakes-jekyll)
- [List on Shifter.io](https://www.getshifter.io/static-site-comments/)
