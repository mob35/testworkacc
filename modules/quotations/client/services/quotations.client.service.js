// Quotations service used to communicate Quotations REST endpoints
(function () {
  'use strict';

  angular
    .module('quotations')
    .factory('QuotationsService', QuotationsService);

  QuotationsService.$inject = ['$resource'];

  function QuotationsService($resource) {
    return $resource('api/quotations/:quotationId', {
      quotationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
