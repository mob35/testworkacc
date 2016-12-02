(function () {
  'use strict';

  angular
    .module('receipts')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Receipts',
      state: 'receipts',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'receipts', {
      title: 'List Receipts',
      state: 'receipts.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'receipts', {
      title: 'Create Receipt',
      state: 'receipts.create',
      roles: ['user']
    });
  }
}());
