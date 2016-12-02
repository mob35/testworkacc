(function () {
  'use strict';

  angular
    .module('quotations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Quotations',
      state: 'quotations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'quotations', {
      title: 'List Quotations',
      state: 'quotations.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'quotations', {
      title: 'Create Quotation',
      state: 'quotations.create',
      roles: ['user']
    });
  }
}());
