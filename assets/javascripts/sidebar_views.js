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

    var CategoryViewMixing = Ember.Mixin.create({
        classNameBindings: ["shouldBeHidden:hidden"],
        didInsertElement: function(){
            Discourse.CategoryList.list('categories'
                ).then(function(resp){
                    this.set("categories", resp.categories);
                }.bind(this));
        },

        shouldBeHidden: function(){
            // we only show up on category pages
            return this.get("currentControllerName").indexOf("category") === -1;
        }.property("currentControllerName")

    });

    var SubcategoriesView = Ember.View.extend(CategoryViewMixing, {
        templateName: "sidebar_subcategories",
        tagName: "div",

        subcategories: function() {
            var category_id = this.get("currentController").context.id,
                categories = this.get("categories");
            if (!category_id || !categories) return;
            var category = categories.findBy('id', category_id);
            return category ? category.subcategories : []
        }.property("handlerInfos", "categories"),

    });

    var CategoryFeaturedUsers = Ember.View.extend(CategoryViewMixing, {
        templateName: "sidebar_featured_users",
        tagName: "div",

        featured_users: function() {
            var category_id = this.get("currentController").context.id,
                categories = this.get("categories");
            if (!category_id || !categories) return;
            var category = categories.findBy('id', category_id);
            console.log(category);
            return category ? category.featured_users : []
        }.property("handlerInfos", "categories"),

    });


    Discourse.SidebarView.reopen({
        facebook_page: FacebookPageView.create(),
        subcategories: SubcategoriesView.create(),
        category_featured_users: CategoryFeaturedUsers.create(),
        topic_stats: TopicStatsPageView.create()
    });

})();