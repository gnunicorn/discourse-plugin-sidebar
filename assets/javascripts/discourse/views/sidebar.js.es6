/**
  This view acts as container for sidebar widgets

  @class ContainerView
  @extends Discourse.ContainerView
  @namespace Discourse
  @module Discourse
**/

import Widgets from "discourse/plugins/sidebar/discourse/sidebar_widgets";

export default Discourse.ContainerView.extend({
    name: "global",
    updateOnRouting: true,
    init: function() {
        this._super();

        var widgets = Discourse.SiteSettings.sidebar_widgets.split("|") || ["stats"],
            sidebar = this;

        widgets.forEach(function(item, idx){
            if (!item) return;
            var view = sidebar.get(item) || Widgets[item];
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
        if (this.state != "inDOM") return;

        var url = router.get("url"),
            name = this.get("name"),
            hide = false,
            me = this,
            handlerInfos = router.router.currentHandlerInfos,
            deepest = handlerInfos.length ? handlerInfos[handlerInfos.length -1] : "",
            controllerName = deepest.name,
            data = {url: url, handlerInfos: handlerInfos,
                    currentControllerName: controllerName,
                    currentController: deepest};

        if (handlerInfos.length){
            hide = !!handlerInfos.find(function(info){
                return info.handler.controller.get("hide_" + name + "_sidebar")
            });
        }

        if (this.get("_last_hide_state") !== hide){
            this.set("_last_hide_state", hide);
            try {
                if (hide){
                    this.get("controller").send("hideSidebar", name);
                } else {
                    this.get("controller").send("showSidebar", name);
                }
            } catch (e) {
                if (console) {
                    console.error("No one is interested in hiding " + name + " sidebar", e);
                }
            }
        }

        this.forEach(function(view){
                view.setProperties(data);
                view.trigger("urlChanged");
        });
    }
});
