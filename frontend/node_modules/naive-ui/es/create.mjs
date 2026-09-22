import version_default from "./version.mjs";
//#region src/create.ts
function create({
  componentPrefix = "N",
  components = []
} = {}) {
  const installTargets = [];
  function registerComponent(app, name, component) {
    if (!app.component(componentPrefix + name)) app.component(componentPrefix + name, component);
  }
  function install(app) {
    if (installTargets.includes(app)) return;
    installTargets.push(app);
    components.forEach(component => {
      const {
        name,
        alias
      } = component;
      registerComponent(app, name, component);
      if (alias) alias.forEach(aliasName => {
        registerComponent(app, aliasName, component);
      });
    });
  }
  return {
    version: version_default,
    componentPrefix,
    install
  };
}
//#endregion
export { create as default };