(function () {
  'use strict';

  describe('Quotations List Controller Tests', function () {
    // Initialize global variables
    var QuotationsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      QuotationsService,
      mockQuotation;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _QuotationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      QuotationsService = _QuotationsService_;

      // create mock article
      mockQuotation = new QuotationsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Quotation Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Quotations List controller.
      QuotationsListController = $controller('QuotationsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockQuotationList;

      beforeEach(function () {
        mockQuotationList = [mockQuotation, mockQuotation];
      });

      it('should send a GET request and return all Quotations', inject(function (QuotationsService) {
        // Set POST response
        $httpBackend.expectGET('api/quotations').respond(mockQuotationList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.quotations.length).toEqual(2);
        expect($scope.vm.quotations[0]).toEqual(mockQuotation);
        expect($scope.vm.quotations[1]).toEqual(mockQuotation);

      }));
    });
  });
}());
