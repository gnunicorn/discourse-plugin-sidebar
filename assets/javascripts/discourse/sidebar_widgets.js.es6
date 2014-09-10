//= require_tree ./templates

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
    handlerInfos: [],

    shouldBeHidden: function(){
        return !this.get("suggestedTopics");
    }.property("suggestedTopics"),

    suggestedTopics: function() {
        var handler = this.get("handlerInfos").find(function(x){ return x.name === "topic"})
        if (!handler) return;
        return handler.context.get("details.suggested_topics");
    }.property("handlerInfos.@each.details.suggested_topics")
});

var TopicStatsPageView = Ember.View.extend({
    templateName: "sidebar_topic_stats",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden"],
    participantsCollapsed: true,
    classNames: ["topic_stats"],
    currentControllerName: "",
    handlerInfos: [],
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
          var unanswered_topics = Em.A();
          resp.topic_list.topics.forEach(function(topic){
            unanswered_topics.addObject(Discourse.Topic.create(topic));
          });
          this.set("unansweredTopics", unanswered_topics);
        }.bind(this)).catch(function(x){
            console.error(x);
        });
    },
    shouldBeHidden: function(){
        return !this.get("unansweredTopics");
    }.property("unansweredTopics")
});

var CategoryViewMixing = Ember.Mixin.create({
    currentControllerName: "",
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
    }.property("category")

});

var CategoryFeaturedUsers = Ember.View.extend(CategoryViewMixing, {
    templateName: "sidebar_featured_users",
    tagName: "div",

    featured_users: function() {
        var category = this.get("category");
        return category ? category.featured_users : [];
    }.property("category")

});


var CreateButtonView = Ember.View.extend({
    classNameBindings: ["shouldBeHidden:hidden"],
    templateName: "sidebar_create_button",
    currentControllerName: "",
    tagName: "div",

    canCreateTopic: function() {
        var controller = this.get("controller");
        if (this.get("isCategoryView")) {
            return controller.controllerFor('navigation/category').get("canCreateTopic");
        } else if (this.get("currentControllerName").indexOf("discovery") !== -1) {
            return controller.controllerFor('navigation/default').get("canCreateTopic");
        }
    }.property("currentControllerName"),

    canChangeCategoryNotificationLevel: function() {
        return this.get("isCategoryView") && Discourse.User.current();
    }.property("isCategoryView"),

    canEditCategory: function() {
        return this.get("isCategoryView") && Discourse.User.currentProp('staff');
    }.property("isCategoryView"),

    canCreateCategory: function() {
        return this.get("isCategoriesView") && Discourse.User.currentProp('staff');
    }.property("isCategoriesView"),

    category: function(){
        return this.get("isCategoryView") && this.get("currentController.context");
    }.property("isCategoryView", "currentController.context"),

    isCategoriesView: function() {
        return this.get("currentControllerName").indexOf("categories") !== -1;
    }.property("currentControllerName"),

    isCategoryView: function() {
        return this.get("currentControllerName").indexOf("category") !== -1;
    }.property("currentControllerName"),

    shouldBeHidden: function(){
        // we only show up on category pages
        return this.get("currentControllerName").indexOf("discovery") === -1;
    }.property("currentControllerName")


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
                    for (var key in Discourse.UserAction.TYPES){
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


export default {
    facebook_page: FacebookPageView,
    subcategories: SubcategoriesView,
    signup: SignupView,
    user_stats: UserStatsView,
    unanswered_topics: UnansweredTopicsWidget,
    user_notifications: UserNotificationsView,
    suggested_topics: SuggestedTopicsWidget,
    category_featured_users: CategoryFeaturedUsers,
    category_info: CategoryInfoView,
    create_button: CreateButtonView,
    topic_stats: TopicStatsPageView
};
