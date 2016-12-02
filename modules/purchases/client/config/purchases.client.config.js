(function () {
  'use strict';

  angular
    .module('purchases')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Purchases',
      state: 'purchases',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'purchases', {
      title: 'List Purchases',
      state: 'purchases.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'purchases', {
      title: 'Create Purchase',
      state: 'purchases.create',
      roles: ['user']
    });
  }
}());
