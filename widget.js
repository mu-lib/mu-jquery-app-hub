(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-app-hub/widget"] = factory.apply(root, modules.map(function (m) {
      return root[m];
    }));
  }
})(["mu-jquery-app/widget"], this, function (widget) {
  var slice = Array.prototype.slice;

  return Array.prototype.concat.call(
    widget,
    function ($element, ns, opt) {
      var me = this;
      var $ = $element.constructor;
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
        $.each(subscriptions, function (index, s) {
          me.unsubscribe(s.topic, s.handler);
        });

        me.off("." + me.ns);
      });
    },
    {
      "on/initialize": function () {
        var me = this;

        me.$element.constructor.each(me.constructor.hub, function (index, op) {
          me.subscribe(op.topic, op.handler);
        });
      }
    });
});
