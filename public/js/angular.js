var app = angular.module('startGame', []);
app.controller('startGameCtrl', function($scope, $http, $window) {
    $scope.gameData = {
        messageType: "newGame",
        name: ""
    };

    $scope.submit = function() {
        $http.post('/game', $scope.gameData).then((responseGood) => {
            var url = "http://" + $window.location.host + "/game";
            $window.location.href = url;
        }, (responseBad) => {
            alert(responseBad.data);
        });
    }
});