import { NextFunction, Request, Response, Router } from 'express';
import { Heroes, IHeroModel } from '../db/schemas/heroes';
import logger from '../logger';

import {
  heroSchema,
  idSchema,
  validateBody,
  validateParams
} from '../helpers/validation';

export class HeroRouter {
  public router: Router;

  /**
   * Initialize the HeroRouter
   */
  constructor() {
    this.router = Router();
    this.init();
  }

  /**
   * GET all Heroes.
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   *
   * @memberOf HeroRouter
   */
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const heroes = await Heroes.find({});
      res.status(200).send({
        status: 'success',
        heroes: heroes
      });
    } catch (e) {
      logger.error(e);
      const message = e.message ? e.message : 'There was an error';
      res.status(500).send({
        message: message
      });
    }
  }

  /**
   * Create one
   */
  public async createOne(
    req: Request | any,
    res: Response,
    next: NextFunction
  ) {
    try {
      const hero = new Heroes(req.value.body);
      const newHero = await hero.save();
      res.status(200).send({
        message: 'success',
        hero: newHero
      });
    } catch (e) {
      logger.error(e);
      const message = e.message ? e.message : 'There was an error';
      res.status(500).send({
        message: message
      });
    }
  }
  /**
   * GET one hero by id
   */
  public async getOne(req: Request | any, res: Response, next: NextFunction) {
    try {
      const { id } = req.value.params;
      const hero = await Heroes.findById(id);
      if (hero) {
        res.status(200).send({
          message: 'success',
          hero: hero
        });
      } else {
        res.status(404).send({
          message: 'No hero found with the given id.',
          status: res.status
        });
      }
    } catch (e) {
      logger.error(e);
      const message = e.message ? e.message : 'There was an error';
      res.status(500).send({
        message: message
      });
    }
  }

  /**
   * Take each handler, and attach to one of the Express.Router's
   * endpoints.
   */
  public init() {
    this.router.get('/', this.getAll);
    this.router.get('/:id', validateParams(idSchema, 'id'), this.getOne);
    this.router.post('/', validateBody(heroSchema), this.createOne);
  }
}

// Create the HeroRouter, and export its configured Express.Router
const heroRoutes = new HeroRouter();
heroRoutes.init();

export default heroRoutes.router;
