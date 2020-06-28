var app = angular.module('equipment', ['ngRoute']);
app.controller('equipmentCtrl', function($scope, $http, $window) {
    $scope.playerData;
    $scope.newItem = null;
    var sendData = {
        messageType: "load",
        equipChange: false,
        newEquips: {
            weapon: null,
            shield: null,
            helmet: null,
            chestplate: null,
            boots: null
        }
    }

    $http.post('/equipment', sendData).then((responseGood) => {
        $scope.playerData = responseGood.data.playerData;
        $scope.newItem = responseGood.data.newItem;
        console.log(responseGood.data.newItem)
    }, (responseBad) => {
        alert("Error: Page load failed");
    });

    $scope.equip = function() {
        if ($scope.newItem !== null) {
            console.log($scope.newItem)
            sendData.equipChange = true;
            if ($scope.newItem.itemType === "weapon") {
                sendData.newEquips.weapon = $scope.newItem;
            } else if ($scope.newItem.itemType === "shield") {
                sendData.newEquips.shield = $scope.newItem;
            } else if ($scope.newItem.itemType === "helmet") {
                sendData.newEquips.helmet = $scope.newItem;
            } else if ($scope.newItem.itemType === "chestplate") {
                sendData.newEquips.chestplate = $scope.newItem;
            } else if ($scope.newItem.itemType === "boots") {
                sendData.newEquips.boots = $scope.newItem;
            }
        }
    }

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