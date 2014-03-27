/**
 * Created by jalee on 3/25/14.
 */
var catalogApp = angular.module('catalogApp', [
    'ngRoute'
]);

catalogApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/collection', {
                templateUrl: '/views/collection.html',
                controller: 'collectionController'
            }).
            when('/collection/add', {
                templateUrl: '/views/add_collection.html',
                controller: 'addCollectionController'
            }).
            when('/collection/:collectionId', {
                templateUrl: '/views/display_collection.html',
                controller: 'displayCollectionController'
            }).
            when('/products', {
                templateUrl: '/views/products.html',
                controller: 'productController'
            }).
            otherwise({
                redirectTo: '/collection'
            });
    }]);