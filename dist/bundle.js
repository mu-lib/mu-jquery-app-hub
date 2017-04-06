(function (umd) {
  umd("mu-jquery-app-hub/hub")(["mu-create/regexp"], function (regexp) {
    return regexp(/^hub\/(.+)/, function (result, data, topic) {
      (result.hub = result.hub || []).push({
        "topic": topic,
        "handler": data.value
      });

      return false;
    });
  });

  umd("mu-jquery-app-hub/create")(["mu-jquery-widget/create", "./hub"], function (create, hub) {
    return create.extend(hub);
  });

  umd("mu-jquery-app-hub/widget")(["./create", "mu-jquery-widget/widget"], function (create, widget) {
    var slice = Array.prototype.slice;

    return create(widget.concat(), function ($element, ns, opt) {
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
})(function (name) {
  var prefix = name.replace(/\/.+$/, "");
  var root = this;

  return function (modules, factory) {
    if (typeof define === "function" && define.amd) {
      define(name, modules, factory);
    } else {
      root[name] = factory.apply(root, modules.map(function (m) {
        return root[m.replace(/^\./, prefix)] || m;
      }));
    }
  }
});
