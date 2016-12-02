'use strict';

describe('Purchases E2E Tests:', function () {
  describe('Test Purchases page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/purchases');
      expect(element.all(by.repeater('purchase in purchases')).count()).toEqual(0);
    });
  });
});
