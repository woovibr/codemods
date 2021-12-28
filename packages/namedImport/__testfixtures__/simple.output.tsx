import { createJobExam, createJobExamQuestion, createUser, getContext } from '../../../../../test/helper';

import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  sanitizeTestObject,
} from '@repo/test';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);
