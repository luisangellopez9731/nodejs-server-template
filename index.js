const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

const libFile = require("./lib/data");
const config = require("./config");
const routes = require("./routes/routes");

const Server = http.createServer((req, res) => {
  try {
    // some important data of req
    const path = url.parse(req.url, true);
    const pathTrim = path.pathname.replace(/^\/|\/$|\?.+/g, "");
    const pathWDir = (config.baseDir || "root") + "/" + pathTrim;
    const query = path.query;
    const headers = req.headers;
    const method = req.method.toLowerCase();
    const decoder = new StringDecoder("utf-8");
    var buffer = "";

    req.on("data", (data) => {
      buffer += decoder.write(data);
    });

    var data_ = {
      path: pathTrim,
      query,
      headers,
      method,
    };

    req.on("end", () => {
      buffer += decoder.end();
      libFile.readFile(pathWDir, async (err, data) => {
        if (err == "nofile") {
          const route =
            typeof routes[data_.path] != "undefined"
              ? routes[data_.path]
              : null;

          if (route == null) {
            res.writeHead(404);
            res.end("path no match");
            return false;
          }

          const routeMethod =
            typeof route[method] != "undefined" ? route[method] : null;

          if (routeMethod == null) {
            res.writeHead(405);
            res.end("no method allowed");
            return false;
          }

          var writeHead = false;
          var ended = false;
          const resObject = {
            writeHead: (status, headers) => {
              writeHead = true;
              res.writeHead(status, headers);
            },
            end: (data) => {
              ended = true;
              res.end(data);
            },
          };

          await routeMethod(data_, resObject);
          if (!writeHead) res.writeHead(200);
          if (!ended) res.end();
        } else {
          const extension = pathWDir.match(/\.(.+)/)
            ? pathWDir.match(/\.(.+)/)[0].replace(".", "")
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
        }
      });
    });
  } catch (error) {
    res.end(error);
  }
});

const PORT = config.port || 3000;
Server.listen(PORT, () => {
  console.log(`server listening in port ${PORT} in ${config.envName} mode!`);
});
