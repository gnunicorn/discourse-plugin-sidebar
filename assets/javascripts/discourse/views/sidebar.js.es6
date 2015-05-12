//= require ../helpers/sidebar_widgets
/**
  This view acts as container for sidebar widgets

  @class ContainerView
  @extends Discourse.ContainerView
  @namespace Discourse
  @module Discourse
  **/

var SIDEBAR_DEBUG = false;

import Widgets from "discourse/plugins/sidebar/discourse/helpers/sidebar_widgets";

export default Discourse.ContainerView.extend({
  name: "global",
  updateOnRouting: true,
  classNames: ['sidebar-view'],
  init: function(){
    this._super();

    SIDEBAR_DEBUG && console.log("Init Sidebar");

    var widgets = Discourse.SiteSettings.sidebar_widgets.split("|") || ["stats"],
    externalSidebarWidgets = Discourse['external:SidebarWidgets'] || {},
    sidebar = this;

    widgets.forEach(function(item, idx){
      if (!item) return;
      var view = externalSidebarWidgets[item] || sidebar.get(item) || Widgets[item];
      SIDEBAR_DEBUG && console.log(view, item);
      if (!view) return;
      sidebar.pushObject(sidebar.createChildView(view));
    }.bind(this));
  },

  willInsertElement: function() {
    if (this.get("updateOnRouting")) {
      var router = Discourse.URL.get("router");
      router.addObserver("url", this, "urlChanged");
    }
  },

  didInsertElement: function() {
    this.urlChanged(Discourse.URL.get("router"));
  },

  urlChanged: function(router) {
    Ember.run.next(function() {
      if (this._state != "inDOM") return;

      var url = router.get("url"),
      name = this.get("name"),
      hide = false,
      me = this,
      handlerInfos = router.router.currentHandlerInfos,
      deepest = handlerInfos.length ? handlerInfos[handlerInfos.length -1] : "",
      controllerName = deepest.name,
      data = {
        url: url, handlerInfos: handlerInfos,
        currentControllerName: controllerName,
        currentController: deepest
      };

      if (handlerInfos.length){
        hide = !!handlerInfos.find(function(info) {
          return info.handler.controller.get("hide_" + name + "_sidebar")
        });
      }

      if (this.get("_last_hide_state") !== hide) {
        this.set("_last_hide_state", hide);
        try {
          if (hide){
            SIDEBAR_DEBUG &&  console.debug("hiding Sidebar: " + name);
            this.get("controller").send("hideSidebar", name);
          } else {
            SIDEBAR_DEBUG &&  console.debug("showing Sidebar: " + name);
            this.get("controller").send("showSidebar", name);
          }
        } catch (e) {
          SIDEBAR_DEBUG && console.error("No one is interested in hiding " + name + " sidebar", e);
        }
      }

      this.forEach(function(view) {
        view.setProperties(data);
        view.trigger("urlChanged");
      });
    }.bind(this));
  }
});
