(function () {
  'use strict';

  describe('Quotations Route Tests', function () {
    // Initialize global variables
    var $scope,
      QuotationsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _QuotationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      QuotationsService = _QuotationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('quotations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/quotations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          QuotationsController,
          mockQuotation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('quotations.view');
          $templateCache.put('modules/quotations/client/views/view-quotation.client.view.html', '');

          // create mock Quotation
          mockQuotation = new QuotationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Quotation Name'
          });

          // Initialize Controller
          QuotationsController = $controller('QuotationsController as vm', {
            $scope: $scope,
            quotationResolve: mockQuotation
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:quotationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.quotationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            quotationId: 1
          })).toEqual('/quotations/1');
        }));

        it('should attach an Quotation to the controller scope', function () {
          expect($scope.vm.quotation._id).toBe(mockQuotation._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/quotations/client/views/view-quotation.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          QuotationsController,
          mockQuotation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('quotations.create');
          $templateCache.put('modules/quotations/client/views/form-quotation.client.view.html', '');

          // create mock Quotation
          mockQuotation = new QuotationsService();

          // Initialize Controller
          QuotationsController = $controller('QuotationsController as vm', {
            $scope: $scope,
            quotationResolve: mockQuotation
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.quotationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/quotations/create');
        }));

        it('should attach an Quotation to the controller scope', function () {
          expect($scope.vm.quotation._id).toBe(mockQuotation._id);
          expect($scope.vm.quotation._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/quotations/client/views/form-quotation.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          QuotationsController,
          mockQuotation;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('quotations.edit');
          $templateCache.put('modules/quotations/client/views/form-quotation.client.view.html', '');

          // create mock Quotation
          mockQuotation = new QuotationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Quotation Name'
          });

          // Initialize Controller
          QuotationsController = $controller('QuotationsController as vm', {
            $scope: $scope,
            quotationResolve: mockQuotation
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:quotationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.quotationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            quotationId: 1
          })).toEqual('/quotations/1/edit');
        }));

        it('should attach an Quotation to the controller scope', function () {
          expect($scope.vm.quotation._id).toBe(mockQuotation._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/quotations/client/views/form-quotation.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
