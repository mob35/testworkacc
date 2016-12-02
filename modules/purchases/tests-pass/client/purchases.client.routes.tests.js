(function () {
  'use strict';

  describe('Purchases Route Tests', function () {
    // Initialize global variables
    var $scope,
      PurchasesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _PurchasesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      PurchasesService = _PurchasesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('purchases');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/purchases');
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
          PurchasesController,
          mockPurchase;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('purchases.view');
          $templateCache.put('modules/purchases/client/views/view-purchase.client.view.html', '');

          // create mock Purchase
          mockPurchase = new PurchasesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Purchase Name'
          });

          // Initialize Controller
          PurchasesController = $controller('PurchasesController as vm', {
            $scope: $scope,
            purchaseResolve: mockPurchase
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:purchaseId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.purchaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            purchaseId: 1
          })).toEqual('/purchases/1');
        }));

        it('should attach an Purchase to the controller scope', function () {
          expect($scope.vm.purchase._id).toBe(mockPurchase._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/purchases/client/views/view-purchase.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          PurchasesController,
          mockPurchase;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('purchases.create');
          $templateCache.put('modules/purchases/client/views/form-purchase.client.view.html', '');

          // create mock Purchase
          mockPurchase = new PurchasesService();

          // Initialize Controller
          PurchasesController = $controller('PurchasesController as vm', {
            $scope: $scope,
            purchaseResolve: mockPurchase
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.purchaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/purchases/create');
        }));

        it('should attach an Purchase to the controller scope', function () {
          expect($scope.vm.purchase._id).toBe(mockPurchase._id);
          expect($scope.vm.purchase._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/purchases/client/views/form-purchase.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          PurchasesController,
          mockPurchase;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('purchases.edit');
          $templateCache.put('modules/purchases/client/views/form-purchase.client.view.html', '');

          // create mock Purchase
          mockPurchase = new PurchasesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Purchase Name'
          });

          // Initialize Controller
          PurchasesController = $controller('PurchasesController as vm', {
            $scope: $scope,
            purchaseResolve: mockPurchase
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:purchaseId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.purchaseResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            purchaseId: 1
          })).toEqual('/purchases/1/edit');
        }));

        it('should attach an Purchase to the controller scope', function () {
          expect($scope.vm.purchase._id).toBe(mockPurchase._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/purchases/client/views/form-purchase.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
