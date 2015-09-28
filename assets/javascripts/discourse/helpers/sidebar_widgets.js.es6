//= require_tree ../templates/sidebar

var FacebookPageView = Ember.View.extend({
    templateName: "sidebar/fb_page",
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

var FreeTextView = Ember.View.extend({
    templateName: "sidebar/free_text",
    tagName: "div"
});

var CategoryListView = Ember.View.extend({
    templateName: "sidebar/category_list",
    tagName: "div",
    categories: function(){
        return Discourse.Category.list().reject(
                function(x){ return x.parent_id == 0});
    }.property()
});


var SignupView = Ember.View.extend({
    templateName: "sidebar/signup",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden"],
    shouldBeHidden: function(){
        return Discourse.User.current() != null;
    }.property()
});

var SuggestedTopicsWidget = Ember.View.extend({
    templateName: "sidebar/suggested_topics",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden", ":sidebar-suggested"],
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


var ForumNewsWidget = Ember.View.extend({
    templateName: "sidebar/forum_news",
    tagName: "div",
    loading: true,
    classNameBindings: ["shouldBeHidden:hidden", ":sidebar-suggested"],
    handlerInfos: [],

    shouldBeHidden: function(){
        return !Discourse.SiteSettings.sidebar_forum_news_category || this.get("currentControllerName") === "full-page-search";
    }.property("suggestedTopics", "currentControllerName"),

    didInsertElement: function() {
        if (!Discourse.SiteSettings.sidebar_forum_news_category) {return};
        this.set("loading", true);
        Discourse.ajax("/c/" + Discourse.SiteSettings.sidebar_forum_news_category + "/l/latest.json", {cache: true}).then(function(resp){
          var topics = resp.topic_list.topics.map(function(topic){
            return Discourse.Topic.create(topic);
          }).slice(0, 3);
          this.setProperties({"topics": topics, loading: false});
        }.bind(this)).catch(function(x){
            console.error(x);
        });
    }
});

var TopicStatsPageView = Ember.View.extend({
    templateName: "sidebar/topic_stats",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden"],
    classNames: ["topic_stats"],
    currentControllerName: "",
    handlerInfos: [],
    // only show on list pages
    shouldBeHidden: function(){
      return Discourse.Mobile.mobileView || this.get("currentControllerName").indexOf("topic") !== 0;
    }.property("currentControllerName"),

    category: function(){
        return Discourse.Category.findById(this.get("topic.category_id"));
    }.property("topic.category_id"),

    topic: function(){
        var handler = this.get("handlerInfos").find(function(x){ return x.name === "topic"})
        if (!handler) return;
        return handler.context;
    }.property("handlerInfos"),

    participants: function() {
      if (!this.get('topic.details.participants')) return null;
      return this.get('topic.details.participants').filter(function(participant) {
        return participant.get('id') > 0; // filter anonymous (system) participants
      }).slice(0, 6);
    }.property('topic.details.participants'),
});


var UnansweredTopicsWidget = Ember.View.extend({
    templateName: "sidebar/unanswered_topics",
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
    templateName: "sidebar/subcategories",
    tagName: "div",

    subcategories: function() {
        var category = this.get("category");
        return category ? category.subcategories : []
    }.property("category")

});

var CategoryFeaturedUsers = Ember.View.extend(CategoryViewMixing, {
    templateName: "sidebar/featured_users",
    tagName: "div",

    featured_users: function() {
        var category = this.get("category");
        return category ? category.featured_users : [];
    }.property("category")

});


var CreateButtonView = Ember.View.extend({
    classNameBindings: ["shouldBeHidden:hidden"],
    templateName: "sidebar/create_button",
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

var AdminMenuView = CreateButtonView.extend({
    classNameBindings: [':no-margin'],

    shouldBeHidden: function(){
        // we only show up for admins
        return Ember.get(Discourse.User.current(), "admin") !== true;
    }.property("currentControllerName")
})

var UserStatsView = Ember.View.extend({
    templateName: "sidebar/user_stats",
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
    templateName: "sidebar/user_notifications",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden", ":notifications-widget"],
    didInsertElement: function() {
        this.set("loading", true);
        if (Discourse.User.current()) {
          Discourse.ajax("/notifications").then(function(result) {
              this.set('loading', false);
              if (typeof(result) != 'undefined' && typeof(result.rejectBy) === 'function') {
                this.set("notifications", result.rejectBy("read").slice(0, 5));
              }
          }.bind(this));
        }
    },
    shouldBeHidden: function(){
      if (this.get('url') && Discourse.User.current()) {
        return this.get("url") !== "/" && this.get("url").indexOf('/latest') !== 0 && this.get("url").indexOf('/tag') !== 0;
      } else {
        return true;
      }
    }.property("url")
})

var CategoryInfoView = Ember.View.extend({
    templateName: "sidebar/category_info",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden", ":category-info"],
    currentControllerName: "",
    defaultModerator: Discourse.computed.setting('default_moderator'),
    shouldBeHidden: function() {
        if (this.get("currentControllerName") === "discovery.category" || this.get("currentControllerName") === "discovery.parentCategory") {
          return false;
        }
        return true;
    }.property("currentControllerName"),
    category: function() {
      var category_id = this.get("currentController.context.id"), category = Discourse.Category.findById(category_id);
      if (!category_id || !category)
        return;
      else
        return category;
    }.property("handlerInfos"),
    total_reply_count: function() {
      return this.get('category.post_count') - this.get('category.topic_count');
    }.property("category.post_count", "category.topic_count")
});

var SearchHelp = Ember.View.extend({
    templateName: "sidebar/search_help",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden", ":search-help"],
    shouldBeHidden: function() {
        return this.get("currentControllerName") !== "full-page-search";
    }.property("currentControllerName")
});

export default {
    facebook_page: FacebookPageView,
    subcategories: SubcategoriesView,
    category_list: CategoryListView,
    signup: SignupView,
    user_stats: UserStatsView,
    free_text: FreeTextView,
    unanswered_topics: UnansweredTopicsWidget,
    user_notifications: UserNotificationsView,
    suggested_topics: SuggestedTopicsWidget,
    category_featured_users: CategoryFeaturedUsers,
    category_info: CategoryInfoView,
    create_button: CreateButtonView,
    admin_menu: AdminMenuView,
    forum_news: ForumNewsWidget,
    topic_stats: TopicStatsPageView,
    search_help: SearchHelp
};
