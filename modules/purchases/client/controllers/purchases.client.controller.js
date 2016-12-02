(function () {
  'use strict';

  // Purchases controller
  angular
    .module('purchases')
    .controller('PurchasesController', PurchasesController);

  PurchasesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'purchaseResolve', 'ProductsService', 'CompaniesService'];

  function PurchasesController($scope, $state, $window, Authentication, purchase, ProductsService, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.purchase = purchase;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.setData = setData;
    vm.readClient = readClient;
    vm.readProduct = readProduct;
    vm.selectCustomer = selectCustomer;
    vm.creditdayChanged = creditdayChanged;
    vm.calculate = calculate;
    vm.init = init;
    vm.selectedProduct = selectedProduct;
    vm.selectedProductss = null;
    vm.changeUnitPrice = changeUnitPrice;
    vm.removeProduct = removeProduct;

    var dat = new Date();
    Date.prototype.addDays = function (days) {
      var dat = new Date(vm.purchase.docdate);
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function creditdayChanged(docdate) {
      vm.purchase.drilldate = dat.addDays(vm.purchase.creditday);

      // var noMath = (vm.purchase.drilldate - vm.purchase.docdate) / 86400000;
      // var parse = parseInt((vm.purchase.drilldate - vm.purchase.docdate) / 86400000);
      // vm.purchase.creditday = parse + 1;


    }

    function setData() {

      if (vm.purchase.drilldate) {
        vm.purchase.docdate = new Date(vm.purchase.docdate);
        vm.purchase.drilldate = new Date(vm.purchase.drilldate);
      } else {
        vm.purchase.docdate = new Date();
        vm.purchase.drilldate = new Date();
      }
      if (!vm.purchase.items) {
        vm.purchase.items = [{
          product: new ProductsService(),
          qty: 1
        }];
      }

    }

    function readClient() {

      vm.client = CompaniesService.query();

    }

    function selectCustomer() {
      vm.purchase.creditday = vm.purchase.client.creditday;
      vm.purchase.drilldate = dat.addDays(vm.purchase.creditday);
    }


    function readProduct() {

      vm.products = ProductsService.query();

    }

    function calculate(item) {
      // item.unitprice = item.product.priceexcludevat;
      // item.qty = 1;
      if (item) {
        item.amount = item.unitprice * item.qty;
        item.vatamount = item.amount * 0.07;
        if (item.product.category === 'S') {
          item.whtamount = item.amount * 0.03;
        } else if (item.product.category === 'R') {
          item.whtamount = item.amount * 0.05;
        } else {
          item.whtamount = 0;
        }
        item.totalamount = (item.amount + item.vatamount) - item.whtamount;
      }

      vm.purchase.amount = 0;
      vm.purchase.vatamount = 0;
      vm.purchase.whtamount = 0;
      vm.purchase.totalamount = 0;

      vm.purchase.items.forEach(function (itm) {

        vm.purchase.amount += itm.amount;
        vm.purchase.vatamount += itm.vatamount;
        vm.purchase.whtamount += itm.whtamount;
        vm.purchase.totalamount += itm.totalamount;

      });

    }

    function changeUnitPrice(item) {
      item.unitprice = item.product.priceexcludevat;
      calculate(item);
    }

    function init() {

      vm.setData();
      vm.readClient();
      vm.readProduct();

    }

    function selectedProduct() {
      vm.purchase.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }

    function removeProduct(index) {
      vm.purchase.items.splice(index, 1);
      calculate();
    }
    // Remove existing Purchase
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.purchase.$remove($state.go('purchases.list'));
      }
    }

    // Save Purchase
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.purchaseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.purchase._id) {
        vm.purchase.$update(successCallback, errorCallback);
      } else {
        vm.purchase.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('purchases.view', {
          purchaseId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
