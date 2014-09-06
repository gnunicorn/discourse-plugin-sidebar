/**
  This view acts as container for sidebae widgets

  @class ContainerView
  @extends Discourse.ContainerView
  @namespace Discourse
  @module Discourse
**/

import Widgets from "discourse/plugins/sidebar/discourse/sidebar_widgets";

export default Discourse.ContainerView.extend({
    willInsertElement: function(){
        // trigger the urlChanged for the first time
        for (name in Widgets){
            this.set(name, Widgets[name].create());
        }

        var widgets = Discourse.SiteSettings.sidebar_widgets.split("|") || ["stats"];
        widgets.forEach(function(item, idx){
            if (!item) return;
            var view = this.get(item);
            if (!view) return;
            this.pushObject(view);
        }.bind(this));


        var router = Discourse.URL.get("router");
        router.addObserver("url", this, "urlChanged");
        this.urlChanged(Discourse.URL.get("router"));
    },

    urlChanged: function(router) {
        var url = router.get("url"),
            handlerInfos = router.router.currentHandlerInfos,
            deepest = handlerInfos.length ? handlerInfos[handlerInfos.length -1] : "",
            controllerName = deepest.name,
            data = {url: url, handlerInfos: handlerInfos,
                    currentControllerName: controllerName,
                    currentController: deepest};

        if (url.match(/^\/(users|admin|tagger\/admin)\//)){
            // we are on admin and user profiles pags. HIDE!
            $(".sidebar").hide();
            $(".main-outlet-wrap").css("width", "100%");
        } else {
            $(".sidebar").show();
            $(".main-outlet-wrap").css("width", "");
        }

        this.forEach(function(view){
            view.setProperties(data);
            view.trigger("urlChanged");
        });
    }
});
