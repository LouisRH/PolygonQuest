var app = angular.module('equipment', ['ngRoute']);
app.controller('equipmentCtrl', function($scope, $http, $window) {
    $scope.playerData;
    var sendData = {
        messageType: "load"
    }

    $http.post('/equipment', sendData).then((responseGood) => {
        $scope.playerData = responseGood.data.playerData;
    }, (responseBad) => {
        alert("Error: Page load failed");
    });

    $scope.submit = function() {
        sendData.messageType = "loadPlayer";
        $http.post('/game', sendData).then((responseGood) => {
            var url = "http://" + $window.location.host + "/game";
            $window.location.href = url;
        }, (responseBad) => {
            alert(responseBad.data);
        });
    }
})