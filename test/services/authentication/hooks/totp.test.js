'use strict';

const assert = require('assert');
const totp = require('../../../../src\services\authentication\hooks\totp.js');

describe('authentication totp hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'after',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    totp()(mockHook);

    assert.ok(mockHook.totp);
  });
});
