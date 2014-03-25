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
                templateUrl: '/angularCatalog/views/category.html',
                controller: 'categoryController'
            }).
            when('/products', {
                templateUrl: '/angularCatalog/views/products.html',
                controller: 'productController'
            }).
            otherwise({
                redirectTo: '/main.html'
            });
    }]);