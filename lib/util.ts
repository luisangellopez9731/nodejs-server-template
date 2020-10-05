import { routeDef, routeUse } from './interfaces';

export const jsonTryParse = (str: string): string => {
  try {
    return JSON.parse(str);
  } catch (e) { return '' }
};

export const formatRoutes = (routesDef: routeDef) => {
  let routesPlusBaseDir:{[key:string]: routeUse} = {};
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
