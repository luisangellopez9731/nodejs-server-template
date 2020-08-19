const config = require('./config');
const Server = require('./lib/server');

Server.baseDir('root');

// Server.notFoundRoute((req, res) => {
//   // Server.serveStatic('client/build/index.html', req, res);
// })


const PORT = config.port || 3001;
Server.start(PORT, () => {
  console.log(`server listening in port ${PORT} in ${config.envName} mode!`);
})