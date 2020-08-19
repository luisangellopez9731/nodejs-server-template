const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const libFile = require("./data");
const util = require("./util");
const routesDef = require("../routes/routes") || {};

const routes = util.formatRoutes(routesDef);

const lib = { };

let Server;
let staticFiles = [];
let baseDir;

let serveNotFound = (data, res) => {
  res.writeHead(404);
  res.end("path no match");
};

const serveApiEndPoint = (route, data, res) => {
  if(route == null) {
    return serveNotFound(data, res);
  }
  const routeMethod =
    typeof route[data.method] != "undefined" ? route[data.method] : null;

  if (routeMethod == null) {
    res.writeHead(405);
    res.end("no method allowed");
    return false;
  }

  routeMethod(data, (bodyToSend = {}, options = {}) => {
    try {
      if (typeof bodyToSend != "object") throw new Error("body must be a json");
      const status = typeof options.status == "number" ? options.status : 200;
      const headers = typeof options.headers == "object" ? options.headers : {};
      headers["Content-Type"] =
        typeof headers["Content-Type"] == "string"
          ? headers["Content-Type"]
          : "application/json";

      res.writeHead(status, headers);
      res.end(JSON.stringify(bodyToSend));
    } catch (error) {
      res.writeHead(500);
      res.end(error.toString());
    }
  });
};

const serveStaticFile = (path, data, res) => {
  const extension = path.match(/\.(.+)/)
    ? path.match(/\.(.+)/)[0].replace(".", "")
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

const checkpathForApiOrStatic = (path, routes, pathDir) => {
  return new Promise((resolve) => {
    const route = typeof routes[path] != "undefined" ? routes[path] : null;
    
    if (route === null) {
      if(staticFiles[0].path === '*') {
        libFile.readFile(staticFiles[0].file, (err, data) => {
          resolve({ static: {file: staticFiles[0].file, data} });
        });
      }else {
        resolve(false);
      }
      
    } else {
      resolve({ route });
    }
  });
};



lib.start = ((port, callback) => {
  Server = http.createServer(async (req, res) => {
    try {
      const path = url.parse(req.url, true);
      const pathTrim = path.pathname.replace(/^\/|\/$|\?.+/g, "");
      const pathDir = pathTrim;
      const query = path.query;
      const headers = req.headers;
      const method = req.method.toLowerCase();
      const decoder = new StringDecoder("utf-8");
      var buffer = "";
      const isStatic = pathTrim.indexOf('.') != -1 ? true : false;
  
      req.on("data", (data) => {
        buffer += decoder.write(data);
      });
  
      req.on("end", async () => {
        buffer += decoder.end();
        const bufferToJson = util.jsonTryParse(buffer);
        var data = {
          path: pathTrim,
          query,
          headers,
          method,
          payload: bufferToJson || {},
        };
  
        if(isStatic) {
          const path = typeof baseDir === 'undefined' ? data.path : `${baseDir}/${data.path}`; 
          libFile.readFile(path, (err, data_) => {
            if(err == 'nofile') {
              serveNotFound(data, res);
            }else {
              serveStaticFile(data.path, data_, res);
            }
          });
        }else {
          const route = typeof routes[path] != "undefined" ? routes[path] : null;
          serveApiEndPoint(route, data, res);
        }
      });
    } catch (error) {
      res.writeHead(500);
      res.end(error.message);
    }
  });

  Server.listen(port, callback);
});

lib.serveStatic = (path, data, res) => {
  libFile.readFile(path, (err, data_) => {
    if(err == 'nofile') {
      res.writeHead(404);
      res.end('path no match')
    }else {
      serveStaticFile(data.path, data_, res);
    }
  })
}

lib.baseDir = (basedir) => {
  baseDir = basedir;
}

lib.notFoundRoute = (fun) => {
  serveNotFound = fun;
}

module.exports = lib