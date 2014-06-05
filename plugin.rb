# name: sidebar
# about: Introduces a configurable sidebar in discourse
# version: 0.1
# authors: Benjamin Kampmann


register_asset 'javascripts/sidebar_injects.js.erb', :template_injector
register_asset "javascripts/sidebar_views.js"
register_asset "javascripts/reply-new-menu.js"

register_asset 'stylesheets/sidebar_styles.scss'