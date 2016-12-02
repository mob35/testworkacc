(function () {
  'use strict';

  angular
    .module('quotations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('quotations', {
        abstract: true,
        url: '/quotations',
        template: '<ui-view/>'
      })
      .state('quotations.list', {
        url: '',
        templateUrl: 'modules/quotations/client/views/list-quotations.client.view.html',
        controller: 'QuotationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Quotations List'
        }
      })
      .state('quotations.create', {
        url: '/create',
        templateUrl: 'modules/quotations/client/views/form-quotation.client.view.html',
        controller: 'QuotationsController',
        controllerAs: 'vm',
        resolve: {
          quotationResolve: newQuotation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Quotations Create'
        }
      })
      .state('quotations.edit', {
        url: '/:quotationId/edit',
        templateUrl: 'modules/quotations/client/views/form-quotation.client.view.html',
        controller: 'QuotationsController',
        controllerAs: 'vm',
        resolve: {
          quotationResolve: getQuotation
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Quotation {{ quotationResolve.name }}'
        }
      })
      .state('quotations.view', {
        url: '/:quotationId',
        templateUrl: 'modules/quotations/client/views/view-quotation.client.view.html',
        controller: 'QuotationsController',
        controllerAs: 'vm',
        resolve: {
          quotationResolve: getQuotation
        },
        data: {
          pageTitle: 'Quotation {{ quotationResolve.name }}'
        }
      });
  }

  getQuotation.$inject = ['$stateParams', 'QuotationsService'];

  function getQuotation($stateParams, QuotationsService) {
    return QuotationsService.get({
      quotationId: $stateParams.quotationId
    }).$promise;
  }

  newQuotation.$inject = ['QuotationsService'];

  function newQuotation(QuotationsService) {
    return new QuotationsService();
  }
}());
