# Discourse Sidebar Plugin

EXPERIMENTAL!!!!!!!

**Attention**: this plugin only works if you applied the [handlebars_injector patches](https://github.com/ligthyear/discourse_patches/tree/master/handlebars_injector)

---

This plugin wraps the main content and adds a configurable sidebar to the right. On-top, it allows other plugins to add other widgets to the sidebar.

## Patching

For this plugin to work, you need to patch discourse. For that check out lightyears patches directory and apply the handlebars_injector patches. From your mainline discourse checkout do:

    cd plugins
    git clone https://github.com/ligthyear/discourse_patches.git
    cd ..
    git apply plugins/patches/handlebars_injector/*.patch

## Installation

**Attention**: only works after the handlebar_injector patches have been applied successfully.

Just three simple steps. From your main discourse do:

    cd plugins
    git clone https://github.com/ligthyear/discourse-plugin-sidebar.git   # clone the repo here
    cd ..
    RAILS_ENV=production rake assets:precompile

Then restart your discourse and refresh your browser.

Enjoy.

## Configuration

This plugin comes with to configuration options, to be found under the `uncategorized` section in the admin SiteSettings:

They work as follows:

 - **sidebar widgets**: is a '|'-separated list of the widgets to load. What is not listed here won't be loaded in the sidebar. The order is from top to bottom. _Attention_: not all widgets show up on all pages.
 - **sidebar fb page**: add the facebook page of the sidebar Facebook-Page-Widget is supposed to use


## Changelog:

 * 2012-05-15:
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
Benjamin Kampmann <me @ create-build-execute . com>

## License (BSD):
Copyright (c) 2014, Benjamin Kampmann
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
