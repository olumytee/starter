import * as path from 'path';
import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import mongoose = require("mongoose");
import * as cors from 'cors'
import logger from './logger'
import HeroRouter from './routes/HeroRouter';


const whitelist = ['http://localhost:8080', 'chrome-extension://fhbjgbiflinjbdggehcddcbncdddomop']
var corsOptions = {
  origin: function (origin, callback) {
    logger.info(`Origin ${origin}`)
    if (whitelist.indexOf(origin) !== -1 || origin == undefined) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.database()
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(morgan('dev', {"stream": logger.stream })); // pipe morgan outputs through logger
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  //configure database connection
  private database(): void {

    const MONGODB_CONNECTION: string = process.env.MONGODB_URI;
    //use q promises
    global.Promise = require("q").Promise;
    mongoose.Promise = global.Promise;
    mongoose.connect( MONGODB_CONNECTION );
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      // we're connected!
      console.log("db connected");
    })   

  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // enable cors
    router.all('*', cors(corsOptions));
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });
    this.express.use('/', router);
    this.express.use('/v1/heroes', HeroRouter);
  }

}

export default new App().express;
