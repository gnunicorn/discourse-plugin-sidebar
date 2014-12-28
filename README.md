# Discourse Sidebar Plugin

This plugins provides a sidebar as a third-party tool to be used for discourse. The sidebar is widget oriented, can be configured from the backend and allows other plugins to add other widgets to the sidebar.

**Attention**: By itself this plugin _does not_ add a sidebar to discourse. It merely allows other plugins to _use_ the sidebar and add it to discourse. If you want to have the entire app wrapped with the sidebar, make sure to install [simple-sidebar-theme-plugin](https://github.com/ligthyear/discourse-plugin-simple-sidebar-theme).

## Installation

### Docker

To install in docker, add the following to your app.yml in the plugins section:

```
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - mkdir -p plugins
          - git clone https://github.com/discourse/docker_manager.git
          - git clone https://github.com/ligthyear/discourse-plugin-sidebar.git sidebar
```

and rebuild docker via

```
cd /var/discourse
./launcher rebuild app
```

## Manually

Just three simple steps. From your main discourse do:

    cd plugins
    git clone https://github.com/ligthyear/discourse-plugin-sidebar.git   # clone the repo here
    cd ..
    RAILS_ENV=production rake assets:precompile


** You might also want to add the [simple-sidebar-theme-plugin](https://github.com/ligthyear/discourse-plugin-simple-sidebar-theme)**.

## Configuration

This plugin comes with to configuration options, to be found under the `Sidebar` section in the admin SiteSettings:

They work as follows:

 - **sidebar widgets**: is a '|'-separated list of the widgets to load. What is not listed here won't be loaded in the sidebar. The order is from top to bottom. _Attention_: not all widgets show up on all pages.
 - **sidebar free text**: you can add your own free-field text here to be rendered in the 'freetext' plugin.
 - **sidebar fb page**: add the facebook page of the sidebar Facebook-Page-Widget is supposed to use
 - **sidebar forum news category**: give the category-slug to the category to be used by the "forum_news"-widget


### Reply as New topic

As when the sidebar is wrapped around the topic, it reduces the space and drops the right gutter (if the other plugins does enforce that), it drops the `reply as new topic feature`. To bring it back, the plugins provides this as a post-menu-action. Add it to the action menu to get it back.

## Compability

 - [Curated Home](https://github.com/ligthyear/discourse-curated-home) allows you to configure a sidebar using this plugin.

## Changelog:

 * 2014-12-25:
   - fix naming issue of files to make sure sidebar can import the widgets
   - clean ups
   - update docs
   - use all widgets per default

 * 2014-11-27:
   - plenty of more widgets
   - plenty of design fixes

 * 2014-05-15:
   - Update Readme
   - Add docs for Plugin-Plugin-Developers

 * 2014-04-22:
   - add Readme

 * 2014-04-19:
   - initial version

## TODO

(in order of importance)

### other Limitations:

 (none)

Found a bug? Please report it on github!

## Authors:
Benjamin Kampmann <ben @ create-build-execute . com>

## License (BSD):
Copyright (c) 2014, Benjamin Kampmann
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
