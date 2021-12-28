import { graphql } from 'graphql';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  createJobExam,
  createJobExamQuestion,
  createUser,
  disconnectMongoose,
  getContext,
  sanitizeTestObject,
} from '../../../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);
