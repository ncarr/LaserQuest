'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('tag service', function() {
  it('registered the tags service', () => {
    assert.ok(app.service('tags'));
  });
});
