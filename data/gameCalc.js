const gameData = require("./gameData");
const enemyData = require("./enemyData");

function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createTurns(gameState) {
    // Both the player's turn and the enemy's turn are computed before the data is sent back to the front end.
    let turns = {
        turn1: {
            currPlayerStats: gameState.currPlayerStats,
            currEnemyStats: gameState.currEnemyStats,
            damage: -1,
            cureVal: -1,
            crit: false,
            weak: false,
            resist: false,
            miss: false,
            message: ""
        },
        turn2: {
            currPlayerStats: gameState.currPlayerStats,
            currEnemyStats: gameState.currEnemyStats,
            damage: -1,
            cureVal: -1,
            crit: false,
            miss: false,
            message: ""
        },
        death: 0,
        levelUp: false
    }
    
    // Turn 1 (Player acts)
    turns = calculatePlayerTurn(gameState, turns);
    if (turns.death === 1) {
        return turns;
    }
    
    // Turn 2 (Enemy acts)
    turns = calculateEnemyTurn(gameState, turns);
    return turns;
}

function calculatePlayerTurn(gameState, turns) {
    if (gameState.messageType === "attack") {
        turns.turn1.message = "Attack";
        let miss = calculateMiss(gameState.currPlayerStats.agi, gameState.currEnemyStats.agi);
        if (!miss) {
            let playerDamage = calculateDamage(gameState.currPlayerStats.str, gameState.currEnemyStats.def, 1);
            let crit = calculateCrit(gameState.currPlayerStats.crit);
            if (crit === true) {
                playerDamage = Math.round(playerDamage * 1.5);
                turns.turn1.crit = true;
            }
            turns.turn1.currEnemyStats.HP -= playerDamage;
            turns.turn1.damage = playerDamage;
            if (turns.turn1.currEnemyStats.HP <= 0) {
                turns.turn1.currEnemyStats.HP = 0;
                turns.death = 1;
                let expResult = expCalc(turns.turn1.currPlayerStats.exp, turns.turn1.currPlayerStats.level, turns.turn1.currEnemyStats.level);
                turns.turn1.currPlayerStats.exp = expResult.exp;
                turns.levelUp = expResult.levelUp;
                turns.turn2 = null;
                return turns;
            }
        } else {
            turns.turn1.miss = true;
        }
    } else if (gameState.messageType === "cure") {
        turns.turn1.message = "Cure";
        let cureVal = calculateCure(turns.turn1.currPlayerStats.str);
        turns.turn1.currPlayerStats.HP += cureVal;
        if (turns.turn1.currPlayerStats.HP > gameState.currPlayerStats.MaxHP) {
            turns.turn1.currPlayerStats.HP = gameState.currPlayerStats.MaxHP;
        }
        turns.turn1.currPlayerStats.MP -= (gameState.baseStats.MPCost - gameState.baseStats.cureMPReduction);
        if (turns.turn1.currPlayerStats.MP < 0) {
            turns.turn1.currPlayerStats.MP = 0
        }
        turns.turn1.cureVal = cureVal;
    } else if (gameState.messageType === "fire") {
        turns.turn1.message = "Fire";
        let playerDamage = calculateDamage(gameState.currPlayerStats.str, gameState.currEnemyStats.def, 1.2);
        if (turns.turn1.currEnemyStats.weak === 1) {
            turns.turn1.weak = true;
            playerDamage = Math.round(playerDamage * 1.5);
        } else if (turns.turn1.currEnemyStats.resist === 1) {
            turns.turn1.resist = true;
            playerDamage = Math.round(playerDamage * 0.5);
        }
        turns.turn1.currEnemyStats.HP -= playerDamage;
        turns.turn1.currPlayerStats.MP -= (gameState.baseStats.MPCost - gameState.baseStats.fireMPReduction);
        if (turns.turn1.currPlayerStats.MP < 0) {
            turns.turn1.currPlayerStats.MP = 0
        }
        turns.turn1.damage = playerDamage;
        if (turns.turn1.currEnemyStats.HP <= 0) {
            turns.turn1.currEnemyStats.HP = 0;
            turns.death = 1;
            let expResult = expCalc(turns.turn1.currPlayerStats.exp, turns.turn1.currPlayerStats.level, turns.turn1.currEnemyStats.level);
            turns.turn1.currPlayerStats.exp = expResult.exp;
            turns.levelUp = expResult.levelUp;
            turns.turn2 = null;
            return turns;
        }
    } else if (gameState.messageType === "water") {
        turns.turn1.message = "Water";
        let playerDamage = calculateDamage(gameState.currPlayerStats.str, gameState.currEnemyStats.def, 1.2);
        if (turns.turn1.currEnemyStats.weak === 2) {
            turns.turn1.weak = true;
            playerDamage = Math.round(playerDamage * 1.5);
        } else if (turns.turn1.currEnemyStats.resist === 2) {
            turns.turn1.resist = true;
            playerDamage = Math.round(playerDamage * 0.5);
        }
        turns.turn1.currEnemyStats.HP -= playerDamage;
        turns.turn1.currPlayerStats.MP -= (gameState.baseStats.MPCost - gameState.baseStats.waterMPReduction);
        if (turns.turn1.currPlayerStats.MP < 0) {
            turns.turn1.currPlayerStats.MP = 0
        }
        turns.turn1.damage = playerDamage;
        if (turns.turn1.currEnemyStats.HP <= 0) {
            turns.turn1.currEnemyStats.HP = 0;
            turns.death = 1;
            let expResult = expCalc(turns.turn1.currPlayerStats.exp, turns.turn1.currPlayerStats.level, turns.turn1.currEnemyStats.level);
            turns.turn1.currPlayerStats.exp = expResult.exp;
            turns.levelUp = expResult.levelUp;
            turns.turn2 = null;
            return turns;
        }
    } else if (gameState.messageType === "wind") {
        turns.turn1.message = "Wind";
        let playerDamage = calculateDamage(gameState.currPlayerStats.str, gameState.currEnemyStats.def, 1.2);
        if (turns.turn1.currEnemyStats.weak === 3) {
            turns.turn1.weak = true;
            playerDamage = Math.round(playerDamage * 1.5);
        } else if (turns.turn1.currEnemyStats.resist === 3) {
            turns.turn1.resist = true;
            playerDamage = Math.round(playerDamage * 0.5);
        }
        turns.turn1.currEnemyStats.HP -= playerDamage;
        turns.turn1.currPlayerStats.MP -= (gameState.baseStats.MPCost - gameState.baseStats.windMPReduction);
        if (turns.turn1.currPlayerStats.MP < 0) {
            turns.turn1.currPlayerStats.MP = 0
        }
        turns.turn1.damage = playerDamage;
        if (turns.turn1.currEnemyStats.HP <= 0) {
            turns.turn1.currEnemyStats.HP = 0;
            turns.death = 1;
            let expResult = expCalc(turns.turn1.currPlayerStats.exp, turns.turn1.currPlayerStats.level, turns.turn1.currEnemyStats.level);
            turns.turn1.currPlayerStats.exp = expResult.exp;
            turns.levelUp = expResult.levelUp;
            turns.turn2 = null;
            return turns;
        }
    } else if (gameState.messageType === "earth") {
        turns.turn1.message = "Earth";
        let playerDamage = calculateDamage(gameState.currPlayerStats.str, gameState.currEnemyStats.def, 1.2);
        if (turns.turn1.currEnemyStats.weak === 4) {
            turns.turn1.weak = true;
            playerDamage = Math.round(playerDamage * 1.5);
        } else if (turns.turn1.currEnemyStats.resist === 4) {
            turns.turn1.resist = true;
            playerDamage = Math.round(playerDamage * 0.5);
        }
        turns.turn1.currEnemyStats.HP -= playerDamage;
        turns.turn1.currPlayerStats.MP -= (gameState.baseStats.MPCost - gameState.baseStats.earthMPReduction);
        if (turns.turn1.currPlayerStats.MP < 0) {
            turns.turn1.currPlayerStats.MP = 0
        }
        turns.turn1.damage = playerDamage;
        if (turns.turn1.currEnemyStats.HP <= 0) {
            turns.turn1.currEnemyStats.HP = 0;
            turns.death = 1;
            let expResult = expCalc(turns.turn1.currPlayerStats.exp, turns.turn1.currPlayerStats.level, turns.turn1.currEnemyStats.level);
            turns.turn1.currPlayerStats.exp = expResult.exp;
            turns.levelUp = expResult.levelUp;
            turns.turn2 = null;
            return turns;
        }
    }

    return turns;
}

function calculateEnemyTurn(gameState, turns, defend) {
    turns.turn2.currPlayerStats = turns.turn1.currPlayerStats;
    turns.turn2.currEnemyStats = turns.turn1.currEnemyStats;

    let MPCost = 5 + (5 * turns.turn2.currEnemyStats.level);
    let action = calculateAI(turns, MPCost);

    if (action === "attack") {
        turns.turn2.message = "Attack";
        miss = calculateMiss(turns.turn2.currEnemyStats.agi, turns.turn2.currPlayerStats.agi);
        if (!miss) {
            let enemyDamage = calculateDamage(turns.turn2.currEnemyStats.str, turns.turn2.currPlayerStats.def, 1);
            let crit = calculateCrit(30);
            if (crit === true) {
                enemyDamage = Math.round(enemyDamage * 1.5);
                turns.turn2.crit = true;
            }
            if (turns.turn2.currPlayerStats.MaxHP === turns.turn2.currPlayerStats.HP && enemyDamage >= turns.turn2.currPlayerStats.HP) {
                enemyDamage = turns.turn2.currPlayerStats.MaxHP - 1;
            }
            turns.turn2.currPlayerStats.HP -= enemyDamage;
            turns.turn2.damage = enemyDamage;
            if (turns.turn2.currPlayerStats.HP <= 0) {
                turns.turn2.currPlayerStats.HP = 0;
                turns.death = -1;
            }
        } else {
            turns.turn2.miss = true;
        }
    } else if (action === "cure") {
        turns.turn2.message = "Cure";
        let cureVal = calculateCure(turns.turn2.currEnemyStats.str);
        turns.turn2.currEnemyStats.HP += cureVal;
        if (turns.turn2.currEnemyStats.HP > gameState.currEnemyStats.MaxHP) {
            turns.turn2.currEnemyStats.HP = gameState.currEnemyStats.MaxHP;
        }
        turns.turn2.currEnemyStats.MP -= MPCost;
        if (turns.turn2.currEnemyStats.MP < 0) {
            turns.turn2.currEnemyStats.MP = 0
        }
        turns.turn2.cureVal = cureVal;
    } else if (action === "fire") {
        turns.turn2.message = "Fire";
        let enemyDamage = calculateDamage(turns.turn2.currEnemyStats.str, turns.turn2.currPlayerStats.def, 1.2);
        if (turns.turn2.currPlayerStats.MaxHP === turns.turn2.currPlayerStats.HP && enemyDamage >= turns.turn2.currPlayerStats.HP) {
            enemyDamage = turns.turn2.currPlayerStats.MaxHP - 1;
        }
        turns.turn2.currPlayerStats.HP -= enemyDamage;
        turns.turn2.currEnemyStats.MP -= MPCost;
        if (turns.turn2.currEnemyStats.MP < 0) {
            turns.turn2.currEnemyStats.MP = 0;
        }
        turns.turn2.damage = enemyDamage;
        if (turns.turn2.currPlayerStats.HP <= 0) {
            turns.turn2.currPlayerStats.HP = 0;
            turns.death = -1;
        }
    } else if (action === "water") {
        turns.turn2.message = "Water";
        let enemyDamage = calculateDamage(turns.turn2.currEnemyStats.str, turns.turn2.currPlayerStats.def, 1.2);
        if (turns.turn2.currPlayerStats.MaxHP === turns.turn2.currPlayerStats.HP && enemyDamage >= turns.turn2.currPlayerStats.HP) {
            enemyDamage = turns.turn2.currPlayerStats.MaxHP - 1;
        }
        turns.turn2.currPlayerStats.HP -= enemyDamage;
        turns.turn2.currEnemyStats.MP -= MPCost;
        if (turns.turn2.currEnemyStats.MP < 0) {
            turns.turn2.currEnemyStats.MP = 0;
        }
        turns.turn2.damage = enemyDamage;
        if (turns.turn2.currPlayerStats.HP <= 0) {
            turns.turn2.currPlayerStats.HP = 0;
            turns.death = -1;
        }
    } else if (action === "wind") {
        turns.turn2.message = "Wind";
        let enemyDamage = calculateDamage(turns.turn2.currEnemyStats.str, turns.turn2.currPlayerStats.def, 1.2);
        if (turns.turn2.currPlayerStats.MaxHP === turns.turn2.currPlayerStats.HP && enemyDamage >= turns.turn2.currPlayerStats.HP) {
            enemyDamage = turns.turn2.currPlayerStats.MaxHP - 1;
        }
        turns.turn2.currPlayerStats.HP -= enemyDamage;
        turns.turn2.currEnemyStats.MP -= MPCost;
        if (turns.turn2.currEnemyStats.MP < 0) {
            turns.turn2.currEnemyStats.MP = 0;
        }
        turns.turn2.damage = enemyDamage;
        if (turns.turn2.currPlayerStats.HP <= 0) {
            turns.turn2.currPlayerStats.HP = 0;
            turns.death = -1;
        }
    } else if (action === "earth") {
        turns.turn2.message = "Earth";
        let enemyDamage = calculateDamage(turns.turn2.currEnemyStats.str, turns.turn2.currPlayerStats.def, 1.2);
        if (turns.turn2.currPlayerStats.MaxHP === turns.turn2.currPlayerStats.HP && enemyDamage >= turns.turn2.currPlayerStats.HP) {
            enemyDamage = turns.turn2.currPlayerStats.MaxHP - 1;
        }
        turns.turn2.currPlayerStats.HP -= enemyDamage;
        turns.turn2.currEnemyStats.MP -= MPCost;
        if (turns.turn2.currEnemyStats.MP < 0) {
            turns.turn2.currEnemyStats.MP = 0;
        }
        turns.turn2.damage = enemyDamage;
        if (turns.turn2.currPlayerStats.HP <= 0) {
            turns.turn2.currPlayerStats.HP = 0;
            turns.death = -1;
        }
    }
    return turns;
}

function calculateAI(turns, MPCost) {
    let currAiVals = turns.turn2.currEnemyStats.aiVals;

    if (turns.turn2.currEnemyStats.MP < MPCost) {
        currAiVals.cure = 0;
        currAiVals.fire = 0;
        currAiVals.water = 0;
        currAiVals.wind = 0;
        currAiVals.earth = 0;
    } else {
        if (turns.turn2.currEnemyStats.HP < (turns.turn2.currEnemyStats.MaxHP * 0.3)) {
            currAiVals.cure = 7;
        } else if (turns.turn2.currEnemyStats.HP < (turns.turn2.currEnemyStats.MaxHP * 0.5)) {
            currAiVals.cure = 5;
        } else if (turns.turn2.currEnemyStats.HP < (turns.turn2.currEnemyStats.MaxHP * 0.7)) {
            currAiVals.cure = 3;
        }
    }

    for (let i in currAiVals) {
        if (currAiVals[i] !== 0) {
            currAiVals[i] = rand(currAiVals[i], 11);
        }
    }

    let action = "";
    let maxVal = 0;

    for (let i in currAiVals) {
        if (currAiVals[i] > maxVal) {
            maxVal = currAiVals[i];
            action = i;
        }
    }

    return action;
}

function calculateDamage(attackerStat, targetStat, modifier) {
    attackerStat = Math.round(attackerStat * modifier);
    let baseDamage = ((attackerStat * 7) - (targetStat * 5));
    let damage = baseDamage + rand(0, Math.round(baseDamage / 3));
    if (damage <= 0) {
        damage = 1;
    }
    return damage;
}

function calculateCure(str) {
    return (str * 10) + rand(1, str);
}

function calculateMiss(attackerAgi, targetAgi) {
    if (attackerAgi > targetAgi * 10) {
        return false;
    } else if (attackerAgi * 15 < targetAgi) {
        return true;
    }
    let agiInverse = attackerAgi - targetAgi;
    if (agiInverse < (attackerAgi * -1)) {
        agiInverse = attackerAgi * -1;
    }
    let missChance = agiInverse + rand(0, Math.round(attackerAgi * 2));
    if (missChance >= 0) {
        return false;
    } else {
        return true;
    }
}

function calculateCrit(crit) {
    let rngVal = rand(1, 101);
    if (rngVal <= crit) {
        return true;
    } else {
        return false;
    }
}

function expCalc(currExp, playerLevel, enemyLevel) {
    // Awards more exp if player is a lower level than the enemy, and less exp if they are a higher level
    let exp = 0;
    if (playerLevel === enemyLevel) {
        exp = (50 + rand(-5, 6));
    } else if (playerLevel > enemyLevel) {
        exp = 50 - Math.round((Math.abs(playerLevel - enemyLevel) * 5) * (rand(10, 21) / 10));
        if (exp === 0) {
            exp = 1;
        }
    } else if (playerLevel < enemyLevel) {
        exp = 50 + Math.round((Math.abs(playerLevel - enemyLevel) * 5) * (rand(10, 21) / 10));
        if (exp > 100) {
            exp = 100;
        }
    }
    exp += currExp;
    exp += 10; // Small boost to reduce difficulty
    if (exp > 100) {
        exp = exp - 100;
        return {
            exp: exp,
            levelUp: true
        }
    } else {
        return {
            exp: exp,
            levelUp: false
        }
    }
}

function nextEnemy(messageData, playerData, newEnemy) {
    playerData.enemyID = newEnemy._id;
    playerData.exp = messageData.exp;
    let newPlayerStats = null;
    let newEnemyStats = null;
    if (messageData.playerLevelUp === true) {
        newPlayerStats = applyPlayerLevelUp(playerData);
    }
    if (messageData.enemyLevelUp !== 0) {
        newEnemyStats = applyEnemyLevelChange(playerData, messageData.enemyLevelUp);
    }
    let updatedGame = updatePlayerData(playerData, newPlayerStats, newEnemyStats);
    return updatedGame;
}

function applyPlayerLevelUp(playerData) {
    // Stats are recalculated based on a base value and a multiplier
    let HP = 75 * Math.pow(1.22, playerData.level + 1);// item: 122, 124
    let MP = 25 * Math.pow(1.17, playerData.level + 1);// item: 117, 119
    let str = 10 * Math.pow(1.2, playerData.level + 1);// item: 119, 121
    let def = 10 * Math.pow(1.2, playerData.level + 1);// item: 119, 121
    let agi = 10 * Math.pow(1.2, playerData.level + 1);// item: 119, 121

    let newStats = {
        level: playerData.level + 1,
        HP: Math.round(HP),
        MP: Math.round(MP),
        str: Math.round(str),
        def: Math.round(def),
        agi: Math.round(agi)
    }

    return newStats;
}

function applyEnemyLevelChange(playerData, change) {
    let newStats = {
        level: playerData.enemyLevel,
        HP: playerData.enemyHP,
        MP: playerData.enemyMP,
        str: playerData.enemyStr,
        def: playerData.enemyDef,
        agi: playerData.enemyAgi,
        itemHP: playerData.enemyItemHP,
        itemMP: playerData.enemyItemMP,
        itemStr: playerData.enemyItemStr,
        itemDef: playerData.enemyItemDef,
        itemAgi: playerData.enemyItemAgi,
        rarity: playerData.enemyRarity,
        weak: 0,
        resist: 0
    };

    if (change === 1) {
        // Enemy level up
        newStats.level = playerData.enemyLevel + 1;
    } else if (change === -1 && playerData.enemyLevel > 1) {
        // Enemy level down, cannot go below 1
        newStats.level = playerData.enemyLevel - 1;
    }

    let weak = rand(1,5);
    newStats.weak = weak;

    if (weak === 1) {
        newStats.resist = 2;
    } else if (weak === 2) {
        newStats.resist = 1;
    } else if (weak === 3) {
        newStats.resist = 4;
    } else if (weak === 4) {
        newStats.resist = 3;
    }

    let rarityMult = 1;

    if (newStats.level <= 10) {
        newStats.rarity = 1;
        rarityMult = 1;
    } else if (newStats.level > 10 && newStats.level <= 20) {
        newStats.rarity = 2;
        rarityMult = 1.2;
    } else if (newStats.level > 20 && newStats.level <= 30) {
        newStats.rarity = 3;
        rarityMult = 1.4;
    } else if (newStats.level > 30 && newStats.level <= 40) {
        newStats.rarity = 4;
        rarityMult = 1.6;
    } else if (newStats.level > 40) {
        newStats.rarity = 5;
        rarityMult = 1.8;
    }

    newStats.HP = Math.round(75 * Math.pow((rand(121, 123) / 100), newStats.level));
    newStats.MP = Math.round(25 * Math.pow((rand(116, 118) / 100), newStats.level));
    newStats.str = Math.round(10 * Math.pow((rand(119, 121) / 100), newStats.level));
    newStats.def = Math.round(10 * Math.pow((rand(119, 121) / 100), newStats.level));
    newStats.agi = Math.round(10 * Math.pow((rand(119, 121) / 100), newStats.level));

    newStats.itemHP = Math.round(rarityMult * (75 * Math.pow((rand(121, 123) / 100), newStats.level)));
    newStats.itemMP = Math.round(rarityMult * (25 * Math.pow((rand(116, 118) / 100), newStats.level)));
    newStats.itemStr = Math.round(rarityMult * (10 * Math.pow((rand(119, 121) / 100), newStats.level)));
    newStats.itemDef = Math.round(rarityMult * (10 * Math.pow((rand(119, 121) / 100), newStats.level)));
    newStats.itemAgi = Math.round(rarityMult * (10 * Math.pow((rand(119, 121) / 100), newStats.level)));

    return newStats;
}

async function updatePlayerData(playerData, newPlayerStats, newEnemyStats) {
    if (newPlayerStats !== null) {
        playerData.level = newPlayerStats.level;
        playerData.HP = newPlayerStats.HP;
        playerData.MP = newPlayerStats.MP;
        playerData.str = newPlayerStats.str;
        playerData.def = newPlayerStats.def;
        playerData.agi = newPlayerStats.agi;
    }
    if (newEnemyStats !== null) {
        playerData.enemyLevel = newEnemyStats.level;
        playerData.enemyHP = newEnemyStats.HP;
        playerData.enemyMP = newEnemyStats.MP;
        playerData.enemyStr = newEnemyStats.str;
        playerData.enemyDef = newEnemyStats.def;
        playerData.enemyAgi = newEnemyStats.agi;
        playerData.enemyItemHP = newEnemyStats.itemHP;
        playerData.enemyItemMP = newEnemyStats.itemMP;
        playerData.enemyItemStr = newEnemyStats.itemStr;
        playerData.enemyItemDef = newEnemyStats.itemDef;
        playerData.enemyItemAgi = newEnemyStats.itemAgi;
        playerData.enemyRarity = newEnemyStats.rarity;
        playerData.enemyWeak = newEnemyStats.weak;
        playerData.enemyResist = newEnemyStats.resist;
    }
    return playerData;
}

module.exports = {
    rand: rand,
    createTurns: createTurns,
    calculatePlayerTurn: calculatePlayerTurn,
    calculateEnemyTurn: calculateEnemyTurn,
    calculateAI: calculateAI,
    calculateDamage: calculateDamage,
    calculateCure: calculateCure,
    calculateMiss: calculateMiss,
    calculateCrit: calculateCrit,
    expCalc: expCalc,
    nextEnemy: nextEnemy,
    applyPlayerLevelUp: applyPlayerLevelUp,
    applyEnemyLevelChange: applyEnemyLevelChange,
    updatePlayerData: updatePlayerData
}