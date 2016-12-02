'use strict';

describe('Quotations E2E Tests:', function () {
  describe('Test Quotations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/quotations');
      expect(element.all(by.repeater('quotation in quotations')).count()).toEqual(0);
    });
  });
});
