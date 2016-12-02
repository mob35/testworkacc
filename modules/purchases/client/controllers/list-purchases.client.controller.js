(function () {
  'use strict';

  angular
    .module('purchases')
    .controller('PurchasesListController', PurchasesListController);

  PurchasesListController.$inject = ['PurchasesService'];

  function PurchasesListController(PurchasesService) {
    var vm = this;

    vm.purchases = PurchasesService.query();
  }
}());
