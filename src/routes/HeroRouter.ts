import {Router, Request, Response, NextFunction} from 'express';
import { IHeroModel, Heroes } from '../db/schemas/heroes';
import logger from '../logger'

export class HeroRouter {
  router: Router

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Heroes.
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const heroes = await Heroes.find({})
      res.status(200)
        .send({
          status: 'success',
          heroes: heroes
        })
    } catch(e){
      logger.error(e)
      const message = e.message ? e.message: 'There was an error'
      res.status(500)
        .send({
          message: message
        })
    }
  }

  /**
   * GET one hero by id
   */
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parseInt(req.params.id)
      const hero = await Heroes.findOne({id: query});
      if (hero) {
        res.status(200)
          .send({
            message: 'success',
            hero: hero
          });
      }
      else {
        res.status(404)
          .send({
            message: 'No hero found with the given id.',
            status: res.status
          });
      }
    } catch(e){
      logger.error(e)
      const message = e.message ? e.message: 'There was an error'
      res.status(500)
        .send({
          message: message
        })      
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  init() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', this.getOne);
  }

}

// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();

export default heroRoutes.router;
