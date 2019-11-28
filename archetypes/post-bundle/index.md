---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
publishDate: {{ dateFormat "2006-01-02" now }}
archives: "{{ dateFormat "2006" now }}"
drafts: true
tags: []
resources:
    - name: hero
      src: "<image filename>"
      title: "<image title>"
      params:
        credits:
            Markdown image credits
---
