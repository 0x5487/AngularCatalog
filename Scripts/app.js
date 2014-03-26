/**
 * Created by jalee on 3/25/14.
 */
var catalogApp = angular.module('catalogApp', [
    'ngRoute'
]);

catalogApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/category', {
                templateUrl: '/angularCatalog/views/collection.html',
                controller: 'categoryController'
            }).
            when('/category/add', {
                templateUrl: '/angularCatalog/views/add_collection.html',
                controller: 'addCollectionController'
            }).
            when('/category/:collectionId', {
                templateUrl: '/angularCatalog/views/display_collection.html',
                controller: 'displayCollectionController'
            }).
            when('/products', {
                templateUrl: '/angularCatalog/views/products.html',
                controller: 'productController'
            }).
            otherwise({
                redirectTo: '/main.html'
            });
    }]);