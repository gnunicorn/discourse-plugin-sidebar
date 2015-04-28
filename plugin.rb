# name: sidebar
# about: Introduces a configurable sidebar in discourse
# version: 0.1
# authors: Benjamin Kampmann

require File.expand_path('../lib/discourse-plugin-sidebar/engine', __FILE__)

register_asset "javascripts/reply-new-menu.js"

register_asset 'stylesheets/sidebar_styles.scss'
register_asset 'javascripts/discourse/helpers/sidebar_widgets.js.es6'

after_initialize do
	::ApplicationController.send(:include, SidebarConcern)
end
