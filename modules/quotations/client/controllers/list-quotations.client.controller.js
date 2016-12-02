(function () {
  'use strict';

  angular
    .module('quotations')
    .controller('QuotationsListController', QuotationsListController);

  QuotationsListController.$inject = ['QuotationsService'];

  function QuotationsListController(QuotationsService) {
    var vm = this;

    vm.quotations = QuotationsService.query();
  }
}());
