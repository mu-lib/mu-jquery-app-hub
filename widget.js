(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-app-hub/widget"] = factory.apply(root, modules.map(function (m) {
      return root[m.replace(/^\./, "mu-jquery-app-hub")];
    }));
  }
})(["./create", "mu-jquery-widget/widget"], this, function (create, widget) {
  var slice = Array.prototype.slice;

  return create(widget.concat(), function ($element, ns, opt) {
    var me = this;
    var hub = opt.hub;
    var subscriptions = [];

    me.subscribe = function (topic, handler) {
      subscriptions.push({
        "topic": topic,
        "handler": handler
      });

      hub(topic).subscribe.call(this, handler);
    };

    me.unsubscribe = function (topic, handler) {
      hub(topic).unsubscribe.call(this, handler);
    };

    me.publish = function (topic) {
      hub(topic).publish.apply(this, slice.call(arguments, 1));
    };

    me.on("finalize", function () {
      me.$.each(subscriptions, function (index, s) {
        me.unsubscribe(s.topic, s.handler);
      });
    });
  },
    {
      "on/initialize": function () {
        var me = this;

        me.$.each(me.constructor.hub, function (index, op) {
          me.subscribe(op.topic, op.handler);
        });
      }
    });
});
