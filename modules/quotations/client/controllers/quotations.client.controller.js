(function () {
    'use strict';

    // Quotations controller 
    angular
        .module('quotations')
        .controller('QuotationsController', QuotationsController);

    QuotationsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'quotationResolve', 'ProductsService', 'CompaniesService'];

    function QuotationsController($scope, $state, $window, Authentication, quotation, ProductsService, CompaniesService) {
        var vm = this;

        vm.authentication = Authentication;
        vm.quotation = quotation;
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
            var dat = new Date(vm.quotation.docdate);
            dat.setDate(dat.getDate() + days);
            return dat;
        };

        function creditdayChanged(docdate) {
            vm.quotation.drilldate = dat.addDays(vm.quotation.creditday);
        }

        function setData() {
            if (!vm.quotation._id) {
                vm.quotation.docdate = new Date();
                vm.quotation.drilldate = new Date();
                vm.quotation.items = [{
                    product: new ProductsService(),
                    qty: 1
                }];
            } else {
                vm.quotation.docdate = new Date(vm.quotation.docdate);
                vm.quotation.drilldate = new Date(vm.quotation.drilldate);
                console.log(vm.quotation);
            }
        }

        function readClient() {

            vm.client = CompaniesService.query();

        }

        function selectCustomer() {
            vm.quotation.creditday = vm.quotation.client.creditday;
            vm.quotation.drilldate = dat.addDays(vm.quotation.creditday);
            creditdayChanged();
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
            vm.quotation.amount = 0;
            vm.quotation.vatamount = 0;
            vm.quotation.whtamount = 0;
            vm.quotation.totalamount = 0;
            vm.quotation.items.forEach(function (itm) {
                vm.quotation.amount += itm.amount || 0;
                vm.quotation.vatamount += itm.vatamount || 0;
                vm.quotation.whtamount += itm.whtamount || 0;
                vm.quotation.totalamount += itm.totalamount || 0;
            });
        }
        function addItem() {
            vm.quotation.items.push({
                product: new ProductsService(),
                qty: 1
            });
        }
        function removeItem(item) {
            //vm.quotation.items.splice(item); 
            vm.quotation.items.splice(vm.quotation.items.indexOf(item), 1);

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
            vm.quotation.items.push({
                product: new ProductsService(),
                qty: 1
            });
        }


        // Remove existing Quotation 
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.quotation.$remove($state.go('quotations.list'));
            }
        }

        // Save Quotation 
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.quotationForm');
                return false;
            }

            // TODO: move create/update logic to service 
            if (vm.quotation._id) {
                vm.quotation.$update(successCallback, errorCallback);
            } else {
                vm.quotation.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('quotations.view', {
                    quotationId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
} ());