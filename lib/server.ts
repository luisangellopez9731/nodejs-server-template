const http = require("http");
import * as url from "url";
import { StringDecoder } from "string_decoder";
import { createServer, ServerResponse } from 'http';
import { readFile } from './data';
import * as util from "./util";
const routesDef = require("../routes/routes") || {};

import { request, route, routeMethod, routeOptions, routeUse } from './interfaces';

const routes = util.formatRoutes(routesDef);

const lib = {};

let Server;
let staticFiles: string[] = [];
let baseDir: string;

let serveNotFound: routeMethod = (data, res) => {
  res.writeHead(404);
  res.end("path no match");
};

const getRouteMethod = (route: routeUse, method: string): routeMethod | null | undefined => {
  const loweredCase = method.toLowerCase();
  return method == 'post' ? route.post : method == 'get' ? route.get : method == 'delete' ? route.delete : method == 'update' ? route.update : null;
}

const serveApiEndPoint = (route: routeUse | null, data: request, res: ServerResponse) => {
  if (route == null) {
    return serveNotFound(data, res);
  }
  Object.keys(route)
  const routeMethod =
    Object.keys(route).indexOf(data.method) != -1 ? getRouteMethod(route, data.method) : null;

  if (routeMethod == null) {
    res.writeHead(405);
    res.end("no method allowed");
    return false;
  }

  routeMethod(data, res);
};

const serveStaticFile = (path: string, data: Buffer | undefined, res: ServerResponse) => {
  const extension = path.match(/\.(.+)/)
    ? (path.match(/\.(.+)/) || [])[0].replace(".", "")
    : null;
  var ContentType = "";
  if (extension == "html" || extension == "htm") {
    ContentType = "text/html";
  } else if (extension == "css") {
    ContentType = "text/css";
  } else if (extension == "js") {
    ContentType = "application/javascript";
  } else if (extension == "json") {
    ContentType = "application/json";
  }
  res.writeHead(200, {
    "Content-Type": ContentType,
  });
  res.write(data);
  res.end();
};

const checkpathForApiOrStatic = (path: string, routes: any, pathDir: string) => {
  console.log('routes: ', routes)
  return new Promise((resolve) => {
    const route = typeof routes[path] != "undefined" ? routes[path] : null;

    if (route === null) {
      if (staticFiles[0] === '*') {
        readFile(staticFiles[0], (err, data) => {
          resolve({ static: { file: staticFiles[0], data } });
        });
      } else {
        resolve(false);
      }

    } else {
      resolve({ route });
    }
  });
};



export const start = (port: Number, callback: () => void): void => {
  Server = createServer(async (req, res) => {
    try {
      const path = url.parse(req.url || '', true);
      const pathTrim = (path.pathname || '').replace(/^\/|\/$|\?.+/g, "");
      const pathDir = pathTrim;
      const query = path.query;
      const headers = req.headers;
      const method = (req.method || '').toLowerCase();
      const decoder = new StringDecoder("utf-8");
      var buffer = "";
      const isStatic = pathTrim.indexOf('.') != -1 ? true : false;

      req.on("data", (data) => {
        buffer += decoder.write(data);
      });

      req.on("end", async () => {
        buffer += decoder.end();
        const bufferToJson = util.jsonTryParse(buffer);
        var data: request = {
          path: pathTrim,
          query,
          headers,
          method,
          payload: bufferToJson || {},
        };

        if (isStatic) {
          const path = typeof baseDir === 'undefined' ? data.path : `${baseDir}/${data.path}`;
          readFile(path, (err, data_) => {
            if (err == 'nofile') {
              serveNotFound(data, res);
            } else {
              serveStaticFile(data.path, data_, res);
            }
          });
        } else {
          const route: routeUse | null = typeof routes[path.pathname || ''] != "undefined" ? routes[path.pathname || ''] : null;
          serveApiEndPoint(route, data, res);
        }
      });
    } catch (error) {
      res.writeHead(500);
      res.end(error.message);
    }
  });

  Server.listen(port, callback);
};

export function serveStatic(path: string, data: request, res: any): void {
  readFile(path, (err, data_) => {
    if (err == 'nofile') {
      res.writeHead(404);
      res.end('path no match')
    } else {
      serveStaticFile(data.path, data_, res);
    }
  })
}

export function setBaseDir(basedir: string) {
  baseDir = basedir;
}

export function notFoundRoute(fun: routeMethod) {
  serveNotFound = fun;
}