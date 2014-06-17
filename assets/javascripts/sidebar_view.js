
Discourse.SidebarView = Discourse.ContainerView.extend({
    init: function(){
        this._super();
        var widgets = Discourse.SiteSettings.sidebar_widgets.split("|") || ["stats"];
        widgets.forEach(function(item, idx){
            if (!item) return;
            var view = this.get(item);
            if (!view) return;
            this.pushObject(view);
        }.bind(this));

        var router = Discourse.URL.get("router");
        router.addObserver("url", this, "urlChanged");
        this.urlChanged(router); // initial call
    },

    urlChanged: function(router) {
        var url = router.get("url"),
            handlerInfos = router.router.currentHandlerInfos,
            deepest = handlerInfos.length ? handlerInfos[handlerInfos.length -1] : "",
            controllerName = deepest.name,
            data = {url: url, handlerInfos: handlerInfos,
                    currentControllerName: controllerName,
                    currentController: deepest};

        if (url.indexOf("/admin/") === 0){
            // we are on admin-pages. HIDE!
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
