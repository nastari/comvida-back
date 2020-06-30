import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';

require('dotenv').config();

class App {
  constructor() {
    this.server = express();
    this.middewares();
    this.use();
  }

  middewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));

    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );

    this.server.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', true);
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Options,Authorization'
      );
      res.header('Access-Control-Allow-Methods', [
        'POST',
        'GET',
        'PUT',
        'DELETE',
        'OPTIONS',
      ]);
      this.server.use(cors({ origin: 'www.comvida.online' }));
      next();
    });
  }

  use() {
    this.server.use(routes);
  }
}

export default new App().server;
