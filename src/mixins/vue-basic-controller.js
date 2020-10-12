import tronlink from "./vue-tronlink"

export default {
    mixins: [tronlink],
    computed: {
        class_hash_approval() {
            if (this.token_send_approval_hash.length > 0) {
                const index = this.txHashToIndex[this.token_send_approval_hash];
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
            return this.getVal("wallet/QueryNowBalance", this._debug)
        },
        coin_symbol() {
            return this.getVal("wallet/QueryNowSymbol", this._debug)
        },
        contractAddress() {
            return this.getVal("wallet/addressContract", this._debug)
        },
        mywalletaddress() {
            return this.getVal("wallet/user_account", this._debug)
        },
        contractBalance() {
            return this.getVal("wallet/QueryContractBalance", this._debug)
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
            _debug: true,
            _contract: false,
            _scan_error: false,
            _worker_process: false,
        }
    },
    methods: {
        /**
         * trigger when the scan has error
         * @param e
         */
        report_scan_error(e) {
            console.log(e);
            this._scan_error = true;
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
         *
         * @param cb
         * @returns {*}
         * @constructor
         */
        InviteCodeGenerator(cb) {
            // let hex = Math.floor (Math.random () * 0xFFFFFFF);
            // let strCode = hex.toString (16).toUpperCase ();
            // let strCode = generateCode (true, 6, 6);
            const wallet_address = this.mywalletaddress;
            const pubKey = this.W3.utils.keccak256(wallet_address);
            const sub = String(pubKey).substring(3, 8).toUpperCase();
            console.log("hash invite code generated", sub);
            this.dispatch("masonic/gen_code", sub);
            return cb(sub);
        },
        isDebug() {
            return this.__debug;
        },
        getVal(val, debug, format = "") {
            if (debug) {
                return "00000"
            } else {
                return this.storeget(val)
            }
        },
        storeget(key) {
            if (this.$store) {
                this.$store.getters[key];
            }
        },
        dispatch(key, content) {
            if (this.$store) {
                this.$store.dispatch(key, content);
            }
        }
    }
}
