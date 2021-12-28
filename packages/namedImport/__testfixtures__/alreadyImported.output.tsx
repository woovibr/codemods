import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@repo/test';
import { graphql } from 'graphql';

import { createJobExam, createJobExamQuestion, createUser, getContext } from '../../../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);
