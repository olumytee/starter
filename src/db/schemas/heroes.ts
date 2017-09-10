import { Document, Model, model, Schema } from 'mongoose';
import logger from '../../logger';
import { IHero } from '../interfaces/heroes';

export interface IHeroModel extends IHero, Document {}

export const heroSchema: Schema = new Schema(
  {
    name: { type: String, unique: true },
    aliases: Array,
    occupation: String,
    gender: String
  },
  { timestamps: true }
);

const handleE11000 = (error, res, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    logger.error(error);
    next(new Error('There was a duplicate key error'));
  } else {
    next();
  }
};

heroSchema.post('save', handleE11000);
heroSchema.post('update', handleE11000);
heroSchema.post('findOneAndUpdate', handleE11000);
heroSchema.post('insertMany', handleE11000);

export const Heroes: Model<IHeroModel> = model<IHeroModel>(
  'Heroes',
  heroSchema
);
