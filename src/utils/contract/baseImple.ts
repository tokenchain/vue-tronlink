import {BigNumber, utils, version, Contract} from "tronweb"
import {EventEmitter} from "eventemitter3"

export default class BaseContract extends EventEmitter {
    protected decodeValues(params) {
        const results = []
        if (utils.isArray(params)) {
            const l = params.length
            for (let h = 0; h < l; h++) {
                if (utils.isBigNumber(params[h])) {
                    results.push(params[h].toNumber())
                } else {
                    console.log("parse outside :: ", params[h])
                }
            }
        }
        return results
    }
}