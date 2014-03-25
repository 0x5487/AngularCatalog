/**
 * Created by jalee on 3/25/14.
 */

function homeController($scope, $window)
{

    $scope.login = function()
    {

        if($scope.username == "jason" && $scope.password == "123123"){

            $window.location = "/AngularCatalog/views/main.html";
        }

    }

}

