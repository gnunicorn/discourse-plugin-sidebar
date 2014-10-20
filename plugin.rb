# name: sidebar
# about: Introduces a configurable sidebar in discourse
# version: 0.1
# authors: Benjamin Kampmann

require File.expand_path('../lib/discourse-plugin-sidebar/engine', __FILE__)

register_asset "javascripts/reply-new-menu.js"

register_asset 'stylesheets/sidebar_styles.scss'

after_initialize do
    if SiteSetting.sidebar_overwrite_template
        register_asset "javascripts/application.js.handlebars"
    end

	::ApplicationController.send(:include, SidebarConcern)
end
