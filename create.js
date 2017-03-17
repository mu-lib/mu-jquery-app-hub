(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.apply(root, modules.map(require));
  } else {
    root["mu-jquery-app-hub/create"] = factory.apply(root, modules.map(function (m) {
      return root[m.replace(/^\./, "mu-jquery-app-hub")];
    }));
  }
})(["mu-jquery-app/create", "./hub"], this, function (create, hub) {
  return create.extend(hub);
});