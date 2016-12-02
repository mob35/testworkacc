// Purchases service used to communicate Purchases REST endpoints
(function () {
  'use strict';

  angular
    .module('purchases')
    .factory('PurchasesService', PurchasesService);

  PurchasesService.$inject = ['$resource'];

  function PurchasesService($resource) {
    return $resource('api/purchases/:purchaseId', {
      purchaseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
