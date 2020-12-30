import tronlink from "./vue-tronlink"
import imtoken from "./vue-imtoken"
import {Base64} from "../utils/base64";

export default {
    mixins: [tronlink, imtoken],
    computed: {
        class_hash_approval() {
            if (this.token_send_approval_hash.length > 0) {
                const index = this.txHashToIndex[this.token_send_approval_hash]
                if (this.txs[index].status === "mined") {
                    return "is-success"
                } else if (this.txs[index].status === "error") {
                    return "is-err"
                } else {
                    return "is-progress"
                }
            } else {
                return "hide"
            }
        },
        wallet_coin() {
            return this.getVal("wallet/QueryNowBalance", this.tronlink_controller_debug)
        },
        coin_symbol() {
            return this.getVal("wallet/QueryNowSymbol", this.tronlink_controller_debug)
        },
        contractAddress() {
            return this.getVal("wallet/addressContract", this.tronlink_controller_debug)
        },
        mywalletaddress() {
            return this.getVal("wallet/user_account", this.tronlink_controller_debug)
        },
        contractBalance() {
            return this.getVal("wallet/QueryContractBalance", this.tronlink_controller_debug)
        }
    },
    data() {
        return {
            contractInstance: "",
            tronClient: false,
            tronUtils: false,
            tronTrx: false,
            txObject: {},
            basicOptions: {},
            networkName: "",
            txs: [],
            txHashToIndex: [],
            token_send_approval_hash: "",
            tronlink_controller_debug: true,
            _contract: false,
            _scan_error: false,
            _worker_process: false
        }
    },
    methods: {
        /**
         * trigger when the scan has error
         * @param e
         */
        report_scan_error(e) {
            console.log(e)
            this._scan_error = true
        },
        /**
         * keep the heart beat checker
         * @returns {boolean}
         */
        keep_hb() {
            return !this._contract || this._scan_error || this._worker_process
        },
        /**
         * checker for enabled the first instance init
         */
        init_contract_checker() {
            return !this._contract && this.tronWeb
        },
        /**
         * allow letter and numbers
         * @param cb
         * @returns {*}
         * @constructor
         */
        CodeGenerator(rexp) {
            const address = this.tronLink.getAccountAddress()
            const check = this.tronWeb.toHex(address)
            const pubKey = this.tronWeb.utils.keccak256(check)
            const b64 = new Base64()
            const base64 = b64.encode(pubKey)
            return base64.match(rexp).join("").toUpperCase()
        },
        /**
         * only allow letters
         * @constructor
         */
        BasedAddressCodeGenNumbic() {
            const onlyLetters = this.CodeGenerator(/[a-zA-Z0-9]+/g)
            const onlyUniqueLetters5 = onlyLetters.split("").filter(function (item, i, ar) {
                return ar.indexOf(item) === i
            }).join("").substring(0, 5)
            if (this.isDebug()) {
                console.log("the gen code is now at", onlyUniqueLetters5)
            }
            return onlyUniqueLetters5
        },
        /**
         * only allow letters
         * @constructor
         */
        BasedAddressCodeGen() {
            const onlyLetters = this.CodeGenerator(/[a-zA-Z]+/g)
            const onlyUniqueLetters5 = onlyLetters.split("").filter(function (item, i, ar) {
                return ar.indexOf(item) === i
            }).join("").substring(0, 5)
            if (this.isDebug()) {
                console.log("the gen code is now at", onlyUniqueLetters5)
            }
            return onlyUniqueLetters5
        },
        isDebug() {
            return this.__debug
        },
        getVal(val, debug, format = "") {
            if (debug) {
                return "00000"
            } else {
                return this.loadLocal(val)
            }
        },
        loadLocal(key) {
            if (this.$store) {
                this.$store.getters[key]
            }
        },
        saveLocal(key, content) {
            if (this.$store) {
                this.$store.dispatch(key, content)
            }
        },
        reqs(key, content) {
            if (this.$store) {
                this.$store.dispatch(key, content)
            }
        }
    }
}
