(function () {
  'use strict';

  // Invoices controller
  angular
    .module('invoices')
    .controller('InvoicesController', InvoicesController);

  InvoicesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'invoiceResolve','ProductsService', 'CompaniesService'];

  function InvoicesController($scope, $state, $window, Authentication, invoice,ProductsService, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.invoice = invoice;
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
    vm.addItem = addItem;
    vm.init = init;
    vm.selectedProduct = selectedProduct;
    vm.selectedProductss = null;
    vm.removeItem = removeItem;
    vm.productChanged = productChanged;

    var dat = new Date();
    Date.prototype.addDays = function (days) {
      var dat = new Date(vm.invoice.docdate);
      dat.setDate(dat.getDate() + days);
      return dat;
    };

    function creditdayChanged(docdate) {
      vm.invoice.drilldate = dat.addDays(vm.invoice.creditday);
    }

    function setData() {
      if (!vm.invoice._id) {
        vm.invoice.docdate = new Date();
        vm.invoice.drilldate = new Date();
        vm.invoice.items = [{
          product: new ProductsService(),
          qty: 1
        }];
      } else {
        vm.invoice.docdate = new Date(vm.invoice.docdate);
        vm.invoice.drilldate = new Date(vm.invoice.drilldate);
        console.log(vm.invoice);
      }
    }

    function readClient() {

      vm.client = CompaniesService.query();

    }

    function selectCustomer() {

      vm.invoice.creditday = vm.invoice.client.creditday;
      vm.invoice.drilldate = dat.addDays(vm.invoice.creditday);
      creditdayChanged();
      //vm.invoice.drilldate = vm.invoice.client.creditday + vm.invoice.docdate;
    }


    function readProduct() {

      vm.products = ProductsService.query();

    }

    function calculate(item) {

      item.unitprice = item.unitprice || item.product.priceexcludevat;
      item.qty = item.qty || 1;
      item.amount = item.unitprice * item.qty;
      item.whtamount = item.whtamount || 0;
      item.vatamount = item.amount * 0.07;
      if (item.product.category === 'S') {
        item.whtamount = item.amount * 0.03;
      } else if (item.product.category === 'R') {
        item.whtamount = item.amount * 0.05;
      }
      item.totalamount = (item.amount + item.vatamount) - item.whtamount;



      sumary();

    }
    function sumary() {
      vm.invoice.amount = 0;
      vm.invoice.vatamount = 0;
      vm.invoice.whtamount = 0;
      vm.invoice.totalamount = 0;
      vm.invoice.items.forEach(function (itm) {
        vm.invoice.amount += itm.amount || 0;
        vm.invoice.vatamount += itm.vatamount || 0;
        vm.invoice.whtamount += itm.whtamount || 0;
        vm.invoice.totalamount += itm.totalamount || 0;
      });
    }
    function addItem() {
      vm.invoice.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }
    function removeItem(item) {
      //vm.invoice.items.splice(item);
      vm.invoice.items.splice(vm.invoice.items.indexOf(item), 1);

      sumary();
    }
    function productChanged(item) {
      item.unitprice = item.product.priceexcludevat;
      item.qty = item.qty || 1;
      item.amount = item.unitprice * item.qty;
      item.whtamount = item.whtamount || 0;
      item.vatamount = item.amount * 0.07;
      if (item.product.category === 'S') {
        item.whtamount = item.amount * 0.03;
      } else if (item.product.category === 'R') {
        item.whtamount = item.amount * 0.05;
      }
      item.totalamount = (item.amount + item.vatamount) - item.whtamount;



      sumary();
    }
    function init() {

      vm.setData();
      vm.readClient();
      vm.readProduct();

    }

    function selectedProduct() {
      console.log(vm.selectedProductss);
      vm.invoice.items.push({
        product: new ProductsService(),
        qty: 1
      });
    }



    // Remove existing Invoice
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.invoice.$remove($state.go('invoices.list'));
      }
    }

    // Save Invoice
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.invoiceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.invoice._id) {
        vm.invoice.$update(successCallback, errorCallback);
      } else {
        vm.invoice.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('invoices.view', {
          invoiceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());
