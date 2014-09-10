export default {
  name: "hide-sidebar-defaults",

  initialize: function(container, application) {
    var AdminController = container.lookupFactory("controller:admin"),
        ApplicationController = container.lookupFactory("controller:application"),
        TaggerAdminController = container.lookupFactory("controller:tagger_admin");

    ApplicationController.reopen({
        hideSidebar: false,
        actions: {
            showSidebar: function(name){
                if (name === "global"){
                    this.set("hideSidebar", false);
                }
            },
            hideSidebar: function(name){
                if (name === "global"){
                    this.set("hideSidebar", true);
                }
            }
        }
    });

    AdminController && AdminController.reopen({
      hide_global_sidebar: true
    });
    TaggerAdminController && TaggerAdminController.reopen({
      hide_global_sidebar: true
    });
  }
};
