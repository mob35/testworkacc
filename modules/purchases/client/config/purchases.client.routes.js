(function () {
  'use strict';

  angular
    .module('purchases')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('purchases', {
        abstract: true,
        url: '/purchases',
        template: '<ui-view/>'
      })
      .state('purchases.list', {
        url: '',
        templateUrl: 'modules/purchases/client/views/list-purchases.client.view.html',
        controller: 'PurchasesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Purchases List'
        }
      })
      .state('purchases.create', {
        url: '/create',
        templateUrl: 'modules/purchases/client/views/form-purchase.client.view.html',
        controller: 'PurchasesController',
        controllerAs: 'vm',
        resolve: {
          purchaseResolve: newPurchase
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Purchases Create'
        }
      })
      .state('purchases.edit', {
        url: '/:purchaseId/edit',
        templateUrl: 'modules/purchases/client/views/form-purchase.client.view.html',
        controller: 'PurchasesController',
        controllerAs: 'vm',
        resolve: {
          purchaseResolve: getPurchase
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Purchase {{ purchaseResolve.name }}'
        }
      })
      .state('purchases.view', {
        url: '/:purchaseId',
        templateUrl: 'modules/purchases/client/views/view-purchase.client.view.html',
        controller: 'PurchasesController',
        controllerAs: 'vm',
        resolve: {
          purchaseResolve: getPurchase
        },
        data: {
          pageTitle: 'Purchase {{ purchaseResolve.name }}'
        }
      });
  }

  getPurchase.$inject = ['$stateParams', 'PurchasesService'];

  function getPurchase($stateParams, PurchasesService) {
    return PurchasesService.get({
      purchaseId: $stateParams.purchaseId
    }).$promise;
  }

  newPurchase.$inject = ['PurchasesService'];

  function newPurchase(PurchasesService) {
    return new PurchasesService();
  }
}());
