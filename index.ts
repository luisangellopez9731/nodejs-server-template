import {getConfig} from './environment';
import { setBaseDir, start } from './lib/server';

const config = getConfig();

// setBaseDir('root');

// Server.notFoundRoute((req, res) => {
//   // Server.serveStatic('client/build/index.html', req, res);
// })


const PORT = config.port || 3001;
start(PORT, () => {
  console.log(`server listening in port ${PORT} in ${config.envName} mode!`);
})