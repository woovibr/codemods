import { clearDbAndRestartCounters } from '@repo/test';
import { graphql } from 'graphql';

import {
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
