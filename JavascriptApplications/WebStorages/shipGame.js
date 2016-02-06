var windowOnLoadGame = window.onload;
window.onload = function () {
    if (windowOnLoadGame) {
        windowOnLoadGame();
    }

    var shipGame = (function (storage) {
        var shipGame = {},
            highScore = storage.getObject('highScore') || [],
            CONSTANTS = {
                CONST_GUESSED_NUMBER_ERROR_NAME: "Guessed number",
                CONST_GUESSED_NUMBER_MIN: 1000,
                CONST_GUESSED_NUMBER_MAX: 9999,
                CONST_GUESSED_NUMBER_LENGTH: 4,
            };

        Object.defineProperty(shipGame, 'init', {
            value: function (playerName, endCallback) {
                this.playerName = playerName;
                this.endCallback = endCallback;
                this.hasStarted = true;
                this.numberToGuess = generateShipGameNumber();
                return this;
            },
            enumerable: true
        });

        Object.defineProperty(shipGame, 'guess', {
            value: function (number) {
                var guessResult;
                if (!shipGame.hasStarted) {
                    throw new Error('Game is not initiated!');
                }

                validator.validateNumberRange(number, CONSTANTS.CONST_GUESSED_NUMBER_ERROR_NAME, CONSTANTS.CONST_GUESSED_NUMBER_MIN, CONSTANTS.CONST_GUESSED_NUMBER_MAX);

                guessResult = getGameMatches(number, shipGame.numberToGuess);

                return this;
            }
        });

        function generateShipGameNumber() {
            var numericString = '';
            numericString += generateDigit({ min: 1, max: 9 });
            numericString += generateDigit({ min: 0, max: 9 });
            numericString += generateDigit({ min: 0, max: 9 });
            numericString += generateDigit({ min: 0, max: 9 });

            return (numericString | 0);
        }

        function generateDigit(options) {
            options = options || {};
            min = options.min || 0;
            max = options.max || 9;

            return ((Math.random() * (max - min + 1)) + min) | 0;
        }

        function getGameMatches(guessNumber, numberToGuess) {
            guessNumberAsString = '' + guessNumber;
            numberToGuess = '' + numberToGuess;
            var ramsIndexes = Array.apply(null, Array(CONSTANTS.CONST_GUESSED_NUMBER_LENGTH)).map(Boolean.prototype.valueOf, false), // [false, false, false, false ]                
                rams = countRams(guessNumberAsString, numberToGuess, ramsIndexes),
                sheeps = countSheeps(guessNumberAsString, numberToGuess, ramsIndexes);
            //console.log(numberToGuess + ' N');
            //console.log(guessNumber + ' G');
            return {
                sheeps: sheeps,
                rams: rams,
            }
        }

        function countRams(guessNumberAsString, numberToGuess, ramsIndexes) {
            var i,
                length,
                rams = 0;
            for (i = 0, length = guessNumberAsString.length; i < length; i += 1) {
                if (guessNumberAsString[i] === numberToGuess[i]) {
                    rams += 1;
                    ramsIndexes[i] = true;
                }
            }

            //console.log('rams: ' + rams);
            //console.log('R ' + ramsIndexes);
            return rams;
        }

        function countSheeps(guessNumberAsString, numberToGuess, ramsIndexes) { // ramsIndexes === takenIndexes
            var i,
                j,
                length,
                sheeps = 0,
            sheepsIndexes = ramsIndexes.slice();

            for (i = 0, length = guessNumberAsString.length; i < length; i += 1) {
                for (j = 0; j < length; j += 1) {
                    if (i !== j && ramsIndexes[i] === false && sheepsIndexes[j] === false && guessNumberAsString[j] === numberToGuess[i]) {
                        sheeps += 1;
                        ramsIndexes[i] = true;
                        sheepsIndexes[j] = true;
                        break;
                    }
                }
            }

            //console.log('sheeps: ' + sheeps);
            //console.log('S ' + sheepsIndexes);

            return sheeps;
        }

        validator = {
            validateIfUndefined: function (val, name) {
                name = name || 'Value';
                if (val === undefined) {
                    throw new Error(name + ' cannot be undefined');
                }
            },
            validateIfNumber: function (val, name) {
                name = name || 'Value';
                this.validateIfUndefined(val, name);
                if (typeof val !== 'number') {
                    throw new Error(name + ' must be a number');
                }
            },
            validateNumberRange: function (val, name, min, max) {
                name = name || 'Value';
                this.validateIfNumber(val, name);
                if (val < min || max < val) {
                    throw new Error(name + ' must be in range [' + min + ', ' + max + ']');
                }
            },
        };

        return shipGame;
    }(localStorage));

    shipGame.init('BOB');
    shipGame.guess(1234);
}

