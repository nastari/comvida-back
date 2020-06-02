import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();
    this.middewares();
    this.use();
  }

  middewares() {
    this.server.use(express.json());
  }

  use() {
    this.server.use(routes);
  }
}

export default new App().server;
