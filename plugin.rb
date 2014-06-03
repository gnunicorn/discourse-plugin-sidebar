# name: sidebar
# about: Introduces a configurable sidebar in discourse
# version: 0.1
# authors: Benjamin Kampmann


register_asset 'javascripts/sidebar_injects.js.erb', :template_injector

register_asset "javascripts/discourse/templates/sidebar_fb_page.js.handlebars"
register_asset "javascripts/discourse/templates/sidebar_signup.js.handlebars"
register_asset "javascripts/discourse/templates/sidebar_topic_stats.js.handlebars"
register_asset "javascripts/discourse/templates/sidebar_subcategories.js.handlebars"
register_asset "javascripts/discourse/templates/sidebar_featured_users.js.handlebars"
register_asset "javascripts/discourse/templates/sidebar_suggested_topics.js.handlebars"
register_asset "javascripts/discourse/templates/sidebar_category_info.js.handlebars"
register_asset "javascripts/sidebar_views.js"
register_asset "javascripts/reply-new-menu.js"

register_asset 'stylesheets/sidebar_styles.scss'