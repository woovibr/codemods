import DataLoader from 'dataloader';

import type { GraphQLContext } from '../../TypeDefinition';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';

import PersonModel from '../models/Person';

type PersonType = {
  id: string,
  _id: string,
  name: string,
  job: string,
  group: string,
  profileImage: string,
};

export default class Person {
  id: string;
  _id: string;
  name: string;
  job: string;
  group: string;
  profileImage: string;

  constructor(data: PersonType) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.job = data.job;
    this.group = data.group;
    this.profileImage = data.profileImage;
  }
}
const viewerCanSee = () => true;
export const getLoader = () => new DataLoader(ids => mongooseLoader(PersonModel, ids));

export const load = async ({ user: viewer, dataloaders }: GraphQLContext, id) => {
  if (!id) {
    return null;
  }

  const data = await dataloaders.PersonLoader.load(id.toString());

  return viewerCanSee(viewer, data) ? new Person(data) : null;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id) => dataloaders.PersonLoader.clear(id.toString());

export const loadPersonsOnGroup = async (context: GraphQLContext, args, group) => {
  const conditions = {
    group: group._id,
  };

  const persons = PersonModel.find(conditions);

  return connectionFromMongoCursor({
    cursor: persons,
    context,
    args,
    loader: load,
  });
};
