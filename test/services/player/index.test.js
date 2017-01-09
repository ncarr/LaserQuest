'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('player service', function() {
  it('registered the players service', () => {
    assert.ok(app.service('players'));
  });
});
