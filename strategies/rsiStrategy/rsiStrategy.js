const highLowVariance = require("../../indicators/highLowVariance");
const relativeStrengthIndex = require('../../indicators/rsi')

const { DataBuffer, BarsTransformer } = require("../../utils/dataBuffer");
const { CrossoverMode } = require("../common/crossoverMode");
const { onProductFound } = require("../common/onProductFound");
const { Strategy } = require("../strategy/strategy");
const { TdEvent } = require("../strategy/tdEvent");
const { drawEffect } = require("./drawEffect");
const { onChart } = require("./onChart");
const { onProps } = require("./onProps");
const { onUserSync } = require("./onUserSync");


class RsiStrategy extends Strategy {
    constructor(props) {
        super(props)
    }

    init(props) {
        this.addMiddleware(drawEffect)
        return {
            mode: CrossoverMode.Watch,
            strengthIndex: relativeStrengthIndex(props.longPeriod),
            hlv: highLowVariance(props.longPeriod),
            product: null,
            position: null,
            realizedPnL: 0,
            buffer: new DataBuffer(BarsTransformer)
        }
    }

    next(prevState, [event, payload]) {
        switch(event) {
            case TdEvent.Chart: {
                return onChart(prevState, payload)
            }

            case TdEvent.Props: {
                return onProps(prevState, payload)
            }

            case TdEvent.UserSync: {
                return onUserSync(prevState, payload)
            }

            case 'product/found': {
                return onProductFound(prevState, payload)
            }

            default: {
                return { state: prevState }
            }
        }
    }

    static params = {
        ...super.params,
        period:     'int',
        orderQuantity:  'int',
    }
}

module.exports = { RsiStrategy }