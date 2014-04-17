(function(){
    var FacebookPageView = Ember.View.extend({
        templateName: "sidebar_fb_page",
        tagName: "div",
        fb_page: function(){
            return Discourse.SiteSettings.sidebar_fb_page;
        }.property()
    });


    Discourse.SidebarView.reopen({
        facebook_page: FacebookPageView.create()
    });

})();