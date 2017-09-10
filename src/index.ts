// tslint:disable-next-line
require('dotenv').config({ silent: false });
import * as debug from 'debug';
import * as http from 'http';
import logger from './logger';

import App from './App';

debug('ts-express:server');

const nPort = normalizePort(process.env.PORT || 3001);
App.set('port', nPort);

const server = http.createServer(App);
server.listen(nPort);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | boolean {
  const port: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  } else if (port >= 0) {
    return port;
  } else {
    return false;
  }
}

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof nPort === 'string' ? 'Pipe ' + nPort : 'Port ' + nPort;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`);
  debug(`Listening on ${bind}`);
}
