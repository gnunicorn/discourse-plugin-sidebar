export default {
  name: "hide-sidebar-defaults",

  initialize: function(container, application) {
    var AdminController = container.lookupFactory("controller:admin"),
        ApplicationController = container.lookupFactory("controller:application"),
        UserController = container.lookupFactory("controller:user"),
        TaggerAdminController = container.lookupFactory("controller:tagger_admin");

    ApplicationController.reopen({
        hideSidebar: function(){
            return Discourse.Mobile.mobileView || this.get("askedToHideSidebar");
        }.property("askedToHideSidebar"),
        askedToHideSidebar: false,
        actions: {
            showSidebar: function(name){
                if (name === "global"){
                    this.set("askedToHideSidebar", false);
                }
            },
            hideSidebar: function(name){
                if (name === "global"){
                    this.set("askedToHideSidebar", true);
                }
            }
        }
    });

    UserController.reopen({
        hide_global_sidebar: true
    });

    AdminController && AdminController.reopen({
      hide_global_sidebar: true
    });
    TaggerAdminController && TaggerAdminController.reopen({
      hide_global_sidebar: true
    });
  }
};
