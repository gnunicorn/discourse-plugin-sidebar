# Discourse Sidebar Plugin Widget Development Documentation

**For general installation instruction, please see Readme.md**

## Introduction

The Sidebar Plugin itself is pluggable by design and allows third parties to provider further widgets through extension. These widgets are just common Ember-Views that just need to register with the plugin in a certain way and provide some more helper methods to make interaction easier.

## Concept

Essentially when the plugin starts it replaces the main view with a wrapper adding the `Discourse.SidebarView` (as defined in `javascript/sidebar_injects.js.erb`) in an `<aside>` element to the right (might be configurable later).

So the only thing to register a new Widget means adding it onto SidebarView

```
Discourse.SidebarView.reopen({
        myAwesomeWidget: MyWidgetView
});
```

And from that point on `SidebarView` will load `MyWidgetView` when it finds `myAwesomeWidget` as a configured Widget in the site settings.

### Initializing

When rendered, the SidebarView reads the `|`-separated list of widgets in the `Discourse.SiteSettings.sidebar_widgets`-Setting and attaches these widgets in that order. For that it is just doing a lookup via `this.get(widget_name)` and if found just adds it as a Childview.

These Childviews are autonomous from that point on and can do everything a normal View can in the Discourse Context.


### Change of routes

The SidebarView has one more feature: it observes the router and informs all widgets about changes of the url. This is purely done using setProperty and event triggers and doesn't require any further methods on the widget. The following properties will be changed per url:

 - `url`: The url the router is going to
 - `currentController`: The new controller that is "in charge" of handling this URL if found (actual instance)
 - `handlerInfos`: any further information send to the route (like parameters)
 - `currentControllerName`: handy-mapper of currentController.name,

After every update the event `urlChanged` will be triggered, allowing the view to rerender on every url change by connecting to this event.

## Example

The following Widget demonstrates some of the features described above. For once, it should only be visible on topic pages. Then it should render the topic-details-statistics for which it will be looking up the loaded model data using the `handler.context` bound to the `handlerInfos`-property.

```
var TopicStatsPageViewWidget = Ember.View.extend({
    templateName: "sidebar_topic_stats",
    tagName: "div",
    classNameBindings: ["shouldBeHidden:hidden"],

    shouldBeHidden: function(){
        // we only show up on topic pages
        return this.get("currentControllerName").indexOf("topic") !== 0;
    }.property("currentControllerName"),

    // what is the current topic
    topic: function(){
        var handler = this.get("handlerInfos").find(function(x){ return x.name === "topic"})
        if (!handler) return;
        return handler.context;
    }.property("handlerInfos")
});
```

## Staying compatible

As Widgets are normal Ember Views so far nothing sidebar specific has been needed and your plugin should work even without Sidebar being there. Only the reference for registration changes that. Which is why I recommend to wrap that into an appropriate `if` as a best practice:

```
if (Discourse.SidebarView){
    Discourse.SidebarView.reopen({
        topicStats: TopicStatsPageViewWidget
    });
}
```

## Further reading

You can find more widget examples in the preshipped `javascript/sidebar_views.js`. Another example case is the [Tagger Plugin](https://github.com/werweisswas/discourse-plugin-tagger/blob/injector/assets/javascripts/sidebar_tags.js). 
