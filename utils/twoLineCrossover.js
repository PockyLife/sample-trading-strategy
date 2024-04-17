const EMA = require("./EMA");

module.exports = function twoLineCrossover(shortPeriod, longPeriod) {
    function nextTLC(prevState, data) {

        const shortEMA = EMA(shortPeriod)
        const longEMA = EMA(longPeriod)
        const distance = shortEMA - longEMA

        next = {
            shortEMA,
            longEMA,
            distance,
            positiveCrossover: distance > 0 && prevState.distance < 0,
            negativeCrossover: distance < 0 && prevState.distance > 0
        }         

        nextTLC.state = next

        return next       
    }

    nextTLC.init = () => {
        nextTLC.state = {
            shortEMA: 0,
            longEMA: 0,
            distance: 0,
            positiveCrossover: false,
            negativeCrossover: false,
        }
    }

    nextTLC.init()

    return nextTLC
}