(function(){
    var FacebookPageView = Ember.View.extend({
        templateName: "sidebar_fb_page",
        tagName: "div",
        fb_page: function(){
            return Discourse.SiteSettings.sidebar_fb_page;
        }.property()
    });

    var TopicStatsPageView = Ember.View.extend({
        templateName: "sidebar_topic_stats",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden"],
        // only show on list pages
        shouldBeHidden: function(){
            // we only show up on topic pages
            return this.get("currentControllerName").indexOf("topic") !== 0;
        }.property("currentControllerName"),

        topic: function(){
            var handler = this.get("handlerInfos").find(function(x){ return x.name === "topic"})
            if (!handler) return;
            return handler.context;

        }.property("handlerInfos")
    });


    Discourse.SidebarView.reopen({
        facebook_page: FacebookPageView.create(),
        topic_stats: TopicStatsPageView.create()
    });

})();