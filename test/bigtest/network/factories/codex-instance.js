import { faker } from '@bigtest/mirage';

import Factory from './application';

const {
  lorem,
  name,
  random,
} = faker;

export default Factory.extend({
  title: () => lorem.sentence(),
  contributor: () => [
    {
      type: 'Personal name',
      name: `${name.lastName()}, ${name.firstName()}`,
    },
    {
      type: 'Personal name',
      name: `${name.lastName()}, ${name.firstName()}`,
    },
  ],
  source: () => 'local',
  identifier: () => [
    {
      value: random.number(),
      type: 'ISBN',
    },
    {
      value: random.number(),
      type: 'ISBN',
    },
  ],
  type: () => 'books',
  language: () => [],
});
