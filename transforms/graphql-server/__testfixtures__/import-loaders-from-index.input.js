// @flow

import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';

import JobType from './JobType';
import JobLoader from './loader/JobLoader';

import GroupType from './GroupType';
import GroupLoader from './loader/GroupLoader';

import ProfileImageType from './ProfileImageType';

import { ProfileImageLoader } from './loader';

export default new GraphQLObjectType({
  name: 'Person',
  description: 'Represents Person',
  fields: () => ({
    id: globalIdField('Person'),
    name: {
      type: GraphQLString,
      description: 'Name of this Person',
      resolve: obj => obj.name,
    },
    job: {
      type: JobType,
      description: 'Person job',
      resolve: (obj, args, context) => JobLoader.load(context, obj.job),
    },
    group: {
      type: GroupType,
      description: 'Person group',
      resolve: (obj, args, context) => GroupLoader.load(context, obj.group),
    },
    profileImage: {
      type: ProfileImageType,
      description: 'Person profile image',
      resolve: (obj, args, context) => ProfileImageLoader.load(context, obj.profileImage),
    },
  }),
  interfaces: () => [NodeInterface],
});
