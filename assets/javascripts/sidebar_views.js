//= require_tree ./discourse/templates

(function(){
    var FacebookPageView = Ember.View.extend({
        templateName: "sidebar_fb_page",
        tagName: "div",
        fb_page: function(){
            return Discourse.SiteSettings.sidebar_fb_page;
        }.property()
    });

    var SignupController = Ember.Controller.extend({
        actions: {
            showLogin: function(){
              Discourse.Route.showModal(this, 'login');
              this.controllerFor('login').resetForm();
          }
        }
    });

    var SignupView = Ember.View.extend({
        templateName: "sidebar_signup",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden"],
        shouldBeHidden: function(){
            return Discourse.User.current() != null;
        }.property()
    });

    var SuggestedTopicsWidget = Ember.View.extend({
        templateName: "sidebar_suggested_topics",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden", "sidebar-suggested"],
        shouldBeHidden: function(){
            return !this.get("suggestedTopics");
        }.property("suggestedTopics"),

        suggestedTopics: function() {
            var handler = this.get("handlerInfos").find(function(x){ return x.name === "topic"})
            if (!handler) return;
            return handler.context.get("details.suggested_topics");
        }.property("handlerInfos")
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


    var UnansweredTopicsWidget = Ember.View.extend({
        templateName: "sidebar_unanswered_topics",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden", "sidebar-unanswered"],
        didInsertElement: function() {
            Discourse.ajax("/latest.json?max_posts=1").then(function(resp){
                this.set("unansweredTopics", resp.topic_list.topics);
            }.bind(this)).catch(function(x){
                console.error(x);
            });
        },
        shouldBeHidden: function(){
            return !this.get("unansweredTopics");
        }.property("unansweredTopics")
    });

    var CategoryViewMixing = Ember.Mixin.create({
        classNameBindings: ["shouldBeHidden:hidden"],
        didInsertElement: function(){
            Discourse.CategoryList.list('categories'
                ).then(function(resp){
                    this.set("categories", resp.categories);
                }.bind(this));
        },

        category: function() {
            var category_id = this.get("currentController.context.id"),
                categories = this.get("categories");
            if (!category_id || !categories) return;
            var category = categories.findBy('id', category_id);
            return category;
        }.property("handlerInfos", "categories"),

        shouldBeHidden: function(){
            // we only show up on category pages
            return this.get("currentControllerName").indexOf("category") === -1;
        }.property("currentControllerName")

    });

    var SubcategoriesView = Ember.View.extend(CategoryViewMixing, {
        templateName: "sidebar_subcategories",
        tagName: "div",

        subcategories: function() {
            var category = this.get("category");
            return category ? category.subcategories : []
        }.property("category"),

    });

    var CategoryFeaturedUsers = Ember.View.extend(CategoryViewMixing, {
        templateName: "sidebar_featured_users",
        tagName: "div",

        featured_users: function() {
            var category = this.get("category");
            return category ? category.featured_users : [];
        }.property("category"),

    });

    var UserStatsView = Ember.View.extend({
        templateName: "sidebar_user_stats",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden"],
        didInsertElement: function(){
            this.set("user", Discourse.User.current());
            if (this.get("user")){
                Discourse.ajax("/users/" + this.get("user").username + ".json"
                    ).then(function(resp){
                        this.set("badges", resp.badges);
                        this.set("user", resp.user);
                        for (key in Discourse.UserAction.TYPES){
                            this.set(key, this.get_stat(Discourse.UserAction.TYPES[key]))
                        }
                    }.bind(this)).catch(function(resp){
                        console.error(resp);
                    });
            }
        },
        shouldBeHidden: function(){
            return !this.get("user");
        }.property("user"),
        get_stat: function(id){
            return ((this.get("user.stats") || []).findBy("action_type", id) || {}).count
        }
    });

    var UserNotificationsView = Ember.View.extend({
        templateName: "sidebar_user_notifications",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden"],
        didInsertElement: function(){
            Discourse.ajax("/notifications").then(function(result) {
                console.log(result);
                this.set("notifications", result);
            }.bind(this));
        },
        shouldBeHidden: function(){
            return Discourse.User.current() === null;
        }.property()
    })

    var CategoryInfoView = Ember.View.extend(CategoryViewMixing, {
        templateName: "sidebar_category_info",
        tagName: "div",
        classNameBindings: ["shouldBeHidden:hidden"],
        shouldBeHidden: function(){
            return !this.get("category.topic.excerpt")
        }.property("category")
    });


    Discourse.SidebarView.reopen({
        facebook_page: FacebookPageView.create(),
        subcategories: SubcategoriesView.create(),
        signup: SignupView.create(),
        user_stats: UserStatsView.create(),
        unanswered_topics: UnansweredTopicsWidget.create(),
        user_notifications: UserNotificationsView.create(),
        suggested_topics: SuggestedTopicsWidget.create(),
        category_featured_users: CategoryFeaturedUsers.create(),
        category_info: CategoryInfoView.create(),
        topic_stats: TopicStatsPageView.create()
    });

})();