var app = angular.module('activeGame', ['ngRoute']);
app.controller('activeGameCtrl', function($scope, $http, $window) {
    $scope.gameData;
    $scope.currPlayerStats;
    $scope.currEnemyStats;
    $scope.playerLevelUp = false;
    $scope.enemyLevelUp = 0;
    $scope.playerDamage = 0;
    $scope.playerHeal = 0;
    $scope.enemyDamage = 0;
    $scope.enemyHeal = 0;
    $scope.message1 = "";
    $scope.message2 = "";
    $scope.weak = "???";
    $scope.resist = "???";
    $scope.playerHP = 100;
    $scope.playerMP = 100;
    $scope.enemyHP = 100;
    $scope.enemyMP = 100;
    $scope.exp = 0;
    $scope.cureExp = 0;
    $scope.fireExp = 0;
    $scope.waterExp = 0;
    $scope.windExp = 0;
    $scope.earthExp = 0;
    $scope.disabled = {
        attack: false,
        cure: false,
        fire: false,
        water: false,
        wind: false,
        earth: false,
        equipment: true,
        next: true
    }

    var sendData = {
        messageType: "loadPlayer"
    }

    $http.post('/game', sendData).then((responseGood) => {
        $scope.gameData = responseGood.data;
        $scope.updateScreen();
    }, (responseBad) => {
        alert("Error: Page load failed");
    });

    $scope.updateScreen = function() {
        $scope.currEnemyStats = {
            name: $scope.gameData.enemyData.name,
            level: $scope.gameData.playerData.enemyLevel,
            MaxHP: Math.round(($scope.gameData.playerData.enemyHP + $scope.gameData.playerData.enemyItemHP) * ($scope.gameData.enemyData.HPScale / 100)),
            MaxMP: Math.round(($scope.gameData.playerData.enemyMP + $scope.gameData.playerData.enemyItemMP) * ($scope.gameData.enemyData.MPScale / 100)),
            HP: Math.round(($scope.gameData.playerData.enemyHP + $scope.gameData.playerData.enemyItemHP) * ($scope.gameData.enemyData.HPScale / 100)),
            MP: Math.round(($scope.gameData.playerData.enemyMP + $scope.gameData.playerData.enemyItemMP) * ($scope.gameData.enemyData.MPScale / 100)),
            str: Math.round(($scope.gameData.playerData.enemyStr + $scope.gameData.playerData.enemyItemStr) * ($scope.gameData.enemyData.strScale / 100)),
            def: Math.round(($scope.gameData.playerData.enemyDef + $scope.gameData.playerData.enemyItemDef) * ($scope.gameData.enemyData.defScale / 100)),
            agi: Math.round(($scope.gameData.playerData.enemyAgi + $scope.gameData.playerData.enemyItemAgi) * ($scope.gameData.enemyData.agiScale / 100)),
            aiVals: {
                attack: $scope.gameData.enemyData.aiVals.attack,
                cure: $scope.gameData.enemyData.aiVals.cure,
                fire: $scope.gameData.enemyData.aiVals.fire,
                water: $scope.gameData.enemyData.aiVals.water,
                wind: $scope.gameData.enemyData.aiVals.wind,
                earth: $scope.gameData.enemyData.aiVals.earth
            },
            weak: $scope.gameData.playerData.enemyWeak,
            resist: $scope.gameData.playerData.enemyResist
        }

        $scope.currPlayerStats = {
            name: $scope.gameData.playerData.name,
            level: $scope.gameData.playerData.level,
            MaxHP: $scope.gameData.playerData.HP + $scope.gameData.playerData.itemHP,
            MaxMP: $scope.gameData.playerData.MP + $scope.gameData.playerData.itemMP,
            HP: $scope.gameData.playerData.HP + $scope.gameData.playerData.itemHP,
            MP: $scope.gameData.playerData.MP + $scope.gameData.playerData.itemMP,
            str: $scope.gameData.playerData.str + $scope.gameData.playerData.itemStr,
            def: $scope.gameData.playerData.def + $scope.gameData.playerData.itemDef,
            agi: $scope.gameData.playerData.agi + $scope.gameData.playerData.itemAgi,
            cureMP: $scope.gameData.playerData.MPCost - $scope.gameData.playerData.cureMPReduction,
            fireMP: $scope.gameData.playerData.MPCost - $scope.gameData.playerData.fireMPReduction,
            waterMP: $scope.gameData.playerData.MPCost - $scope.gameData.playerData.waterMPReduction,
            windMP: $scope.gameData.playerData.MPCost - $scope.gameData.playerData.windMPReduction,
            earthMP: $scope.gameData.playerData.MPCost - $scope.gameData.playerData.earthMPReduction,
            exp: $scope.gameData.playerData.exp
        }

        $scope.changeHPMPBars();
        $scope.checkMP();
    }

    $scope.changeHPMPBars = function() {
        $scope.playerHP = Math.round(($scope.currPlayerStats.HP / $scope.currPlayerStats.MaxHP) * 100);
        $scope.playerMP = Math.round(($scope.currPlayerStats.MP / $scope.currPlayerStats.MaxMP) * 100);
        $scope.enemyHP = Math.round(($scope.currEnemyStats.HP / $scope.currEnemyStats.MaxHP) * 100);
        $scope.enemyMP = Math.round(($scope.currEnemyStats.MP / $scope.currEnemyStats.MaxMP) * 100);
        $scope.exp = $scope.currPlayerStats.exp;
    }

    $scope.checkMP = function() {
        if ($scope.currPlayerStats.MP < $scope.currPlayerStats.cureMP) {
            $scope.disabled.cure = true;
        } else {
            $scope.disabled.cure = false;
        }

        if ($scope.currPlayerStats.MP < $scope.currPlayerStats.fireMP) {
            $scope.disabled.fire = true;
        } else {
            $scope.disabled.fire = false;
        }

        if ($scope.currPlayerStats.MP < $scope.currPlayerStats.waterMP) {
            $scope.disabled.water = true;
        } else {
            $scope.disabled.water = false;
        }

        if ($scope.currPlayerStats.MP < $scope.currPlayerStats.windMP) {
            $scope.disabled.wind = true;
        } else {
            $scope.disabled.wind = false;
        }

        if ($scope.currPlayerStats.MP < $scope.currPlayerStats.earthMP) {
            $scope.disabled.earth = true;
        } else {
            $scope.disabled.earth = false;
        }
    }

    $scope.action = function(action) {
        if (action !== "equipment" && action !== "next") {
            $scope.disabled.attack = true;
            $scope.disabled.cure = true;
            $scope.disabled.fire = true;
            $scope.disabled.water = true;
            $scope.disabled.wind = true;
            $scope.disabled.earth = true;
            $scope.disabled.equipment = true;
            $scope.disabled.next = true;
            sendData = {
                messageType: action,
                currPlayerStats: $scope.currPlayerStats,
                currEnemyStats: $scope.currEnemyStats,
                baseStats: $scope.gameData.playerData
            }
            $http.post('/game', sendData).then((responseGood) => {
                $scope.currPlayerStats = responseGood.data.turn1.currPlayerStats;
                $scope.currEnemyStats = responseGood.data.turn1.currEnemyStats;
                $scope.playerDamage = responseGood.data.turn1.damage;
                $scope.playerHeal = responseGood.data.turn1.cureVal;
                $scope.message1 = responseGood.data.turn1.message;
                $scope.changeHPMPBars();

                if (responseGood.data.death === 0) {
                    $scope.currPlayerStats = responseGood.data.turn2.currPlayerStats;
                    $scope.currEnemyStats = responseGood.data.turn2.currEnemyStats;
                    $scope.enemyDamage = responseGood.data.turn2.damage;
                    $scope.enemyHeal = responseGood.data.turn2.cureVal;
                    $scope.message2 = responseGood.data.turn2.message;
                    $scope.disabled.attack = false;
                    $scope.checkMP();
                } else {
                    $scope.disabled.equipment = false;
                    $scope.disabled.next = false;

                    if (responseGood.data.death === 1) {
                        $scope.enemyLevelUp = 1;
                        if (responseGood.data.levelUp === true) {
                            $scope.playerLevelUp = true;
                        }
                    } else if (responseGood.data.death === -1) {
                        $scope.enemyDamage = responseGood.data.turn2.damage;
                        $scope.enemyHeal = responseGood.data.turn2.cureVal;
                        $scope.message2 = responseGood.data.turn2.message;
                        $scope.enemyLevelUp = -1;
                    }
                }
            }, (responseBad) => {
                alert("Error: Attack failed");
            })
        } else if (action === "equipment" || (action === "next" && $scope.enemyLevelUp === 1)) {
            $scope.disabled.equipment = true;
            $scope.disabled.next = true;
            sendData = {
                messageType: "save",
                playerID: $scope.gameData.playerData._id,
                playerLevelUp: $scope.playerLevelUp,
                enemyLevelUp: $scope.enemyLevelUp,
                exp: $scope.currPlayerStats.exp
            }
            $http.post('/equipment', sendData).then((responseGood) => {
                var url = "http://" + $window.location.host + "/equipment";
                $window.location.href = url;
            }, (responseBad) => {
                alert(responseBad.data);
            })
        } else {
            $scope.disabled.equipment = true;
            $scope.disabled.next = true;
            sendData = {
                messageType: "next",
                playerID: $scope.gameData.playerData._id,
                playerLevelUp: $scope.playerLevelUp,
                enemyLevelUp: $scope.enemyLevelUp,
                exp: $scope.currPlayerStats.exp
            }
            $http.post('/game', sendData).then((responseGood) => {
                $scope.gameData = responseGood.data;
                $scope.updateScreen();
                $scope.playerLevelUp = false;
                $scope.enemyLevelUp = 0;
                $scope.disabled.attack = false;
                $scope.checkMP();
                $scope.disabled.equipment = true;
                $scope.disabled.next = true;
            }, (responseBad) => {
                alert("Error: Next failed");
            })
        }
    }
})