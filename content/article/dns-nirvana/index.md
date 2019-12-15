---
title: "Journey to DNS Nirvana (almost)"
date: 2019-12-14T14:01:35-05:00
publishDate: 2019-12-14
archives: "2019"
draft: true
tags: []
resources:
    - name: hero
      src: "<image filename>"
      title: "<image title>"
      params:
        credits:
            Markdown image credits
---

During my various hikes through the woods of the internet, I came across [DNS
Spy](https://dnsspy.io) one of the many dns checkers like, well, [DNS
Checker](https://dnschecker.org). But it offers constant monitoring like, for
example [Thousand Eyes](https://www.thousandeyes.com/lps/dns-monitoring).

codevamping.com is definitely a "vanity site" that I am not trying to monetize in any
way. The only thing that would really be hurt if things go south is my ego. But
DNS Spy offered a free scan, so why not.

<!--more-->

{{< resource_figure "dnsspy_first_scan.png" >}}

Okay, thats not ... _bad_. 

Okay. Maybe I'm more attached to my ego than I thought. Lets see if we can make
DNS Spy happy and reach DNS Nirvana.

The detailed results of the scan are divided into 4 categories with warnings
and recommendations for each section. Lets walk through them in turn.

## Connectivity

{{< resource_figure "dnsspy_connectivity_score.png" >}}

Only one warning.

### (Warning) No IPv6 reachable nameservers were found

Okkaaay. Hmmm. How would I fix this? [Google Domains](https://domains.google/)
is my domain registrar, but the name servers are provided by
[Netlify](https://netlify.com). Netlify hosts this blog and it was just easier
to let them handle the name services as well.

So, I head over to Netlify, open the dashboard for the codevamping domain (as
opposed to the site) and - hey, what do you know - there is a big ol' button
"Enable ipv6".

```txt
$ dig codevamping.com AAAA +noall +answer
codevamping.com.        20      IN      AAAA    2604:a880:400:d1::89c:7001
```

Well, there is a AAAA record, but can I resolve using ipv6 ?

```txt
$ dig -6 codevamping.com AAAA +noall +answer

; <<>> DiG 9.14.8 <<>> -6 codevamping.com AAAA +noall +answer
;; global options: +cmd
;; connection timed out; no servers could be reached
```

No. Interestingly, if I give the exact address of the ipv6 name server as
defined in the router, I get:

```txt
$ dig -6 @2001:558:feed::1 codevamping.com AAAA +noall +answer
codevamping.com.        20      IN      AAAA    2604:a880:400:d1::89c:7001
```

So, I did what I wanted, but uncovered another issue. Apparently, none of my
computers is picking up the ipv6 name servers via dhcp - or the router isn't
sending them, even though the configuration says to do so.

More digging. Netlify does not seem to have ipv6 name servers.


## Performance

{{<resource_figure "dnsspy_performance_score.png" >}}

No warnings or recommendations. Moving on ...

## Resiliency and Security

{{<resource_figure "dnsspy_res_n_sec_score.png" >}}

### (Warning) All IPv4 nameservers are hosted by the same provider 

Well, yes. Netlify is a reseller for [NS1](https://www.ns1.com). They would be
happy to provide all sorts of redundancy for the right price. Not worth the
price for me. I totally understand why you might want this if you are trying
make money and can't afford to go down.

### (Warning) No DNSSEC records found.
{{<side-note>}}TBD{{</side-note>}}

### (Warning) All the nameservers are being operated from a single domain (nsone.net).

See above.

### (Recomendation) All IPv4 nameservers appear to be hosted in the same country (US). You might want to consider spreading the nameservers geographically.

See above.

Well, I won't reach total Nirvana because I can't afford it. Oh, well.

### (Recommendation) No CAA records found.
{{<side-note>}}TBD{{</side-note>}}

## DNS Records

{{<resource_figure "dnsspy_records_score.png">}}

### (Recommendation) No SPF records were found.

I had no clue what [SPF - Sender Policy
Framework](https://en.wikipedia.org/wiki/Sender_Policy_Framework) record was.

The idea is simple enough. The SPF records says what computers can send email
showing as coming from the domain in question. If the sending domain/ip is not
listed in the SPF record for domain it claims to be coming from, many mail
gateways will mark the message as spam. Or at the very least, the message will
be marked as "via" the true sending domain as you can see below.

{{<resource_figure "redeploy-email.png">}}

My outgoing email is handled by [SendGrid](https://sendgrid.com/).
After the reading I knew that I needed to add a TXT record that looked something
like:

```txt
v=spf1 include:something.sendgrid.net ~all
```

which says that a computer on sendgrid.net can send email for my domain but
nobody else (`~all`) can [^1].

[^1]: To be exact the `~` means to "view with suspicion" - not totally reject.
  To get a reject, use a minus sign : `-` (hard spf check failure).

Figuring out what that `something` required a support ticket with SendGrid
which took 3 days for them to action. Fair enough - I'm not giving them any
money.

After that, it was a quick trip to Netlify to update the domain records.

Dig shows the SPF record, but to really test, I had to wait until the [next
status email came from the domain]({{<relref
"getting-started-with-google-cloud-functions/index" >}}).


### (Recommendation) No DMARC records have been found.

{{<side-note>}}TBD{{</side-note>}}

### (Recommendation)No IPv6 record has been found on the zone apex (codevamping.com).

We took care of this as a part of ipv6 name server thing above. So, nothing
more to do.

## Rescan


## Thoughts

Well, I certainly learned more about DNS and email/spam. And I set things up
better for my domain.
