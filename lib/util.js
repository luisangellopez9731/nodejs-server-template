const lib = {};

lib.jsonTryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {}
};

lib.formatRoutes = (routesDef) => {
  let routesPlusBaseDir = {};
  const baseDir =
    typeof routesDef.baseDir === "string" && routesDef.baseDir.length > 0
      ? `${routesDef.baseDir}/`
      : "";
  var routes = routesDef.routes;
  for (var i = 0; i < routes.length; i++) {
    const route = routes[i];
    routesPlusBaseDir[baseDir + route.path] = route.use;
  }

  return routesPlusBaseDir;
};

module.exports = lib;
