import TronLink from "../TronLink"
import {
    CONF_MAINNET, CONF_NILE,
    CONF_SHASTA, DEFAULT_NODES,
    FULL_NAMES, CONF_TRONEX,
    CONF_NILE_CLASSIC
} from "../utils/const";

/**
 * events:
 * notify_tron_not_install
 * notify_tron_installed
 * notify_tron_node_change
 * notify_tron_account_set
 * notify_tron_initialization
 */
export default {
    data() {
        return {
            tronLink: false,
            tronWeb: false,
            // object json
            tronLinkInitialData: false,
            // node name NILE, MAINNET
            connectedNode: false,
            // wallet account name
            account_name: false,
            // TB9M9KdCvee3qnRtKE7GACZpTh3oiTX9JL
            authorized_address: false,
            //module debug on core tronlink only
            _debug_tronlink: false,
            node_version: "",
        }
    },
    methods: {
        checkTronLink() {
            if (window && window.hasOwnProperty("tronWeb")) {
                if (!this.tronWeb) {
                    this.tronWeb = window.tronWeb
                }
                if (!this.tronLink) {
                    this.tronLink = new TronLink(window.tronWeb)
                }
                this.notify_tron_installed()
                return true
            }
            this.notify_tron_not_install()
            return false
        },
        notify_tron_not_install() {
            console.log("TronLink is not installed")
            this.$emit("notify_tron_not_install", this.tronLinkInitialData, this.connectedNode)
        },
        prenodenume(data_full_node) {
            if (data_full_node === CONF_NILE.full_node) {
                this.connectedNode = FULL_NAMES.NILE
            } else if (data_full_node === CONF_MAINNET.full_node) {
                this.connectedNode = FULL_NAMES.MAINNET
            } else if (data_full_node === CONF_SHASTA.full_node) {
                this.connectedNode = FULL_NAMES.SHASTA
            } else if (data_full_node === DEFAULT_NODES.full_node) {
                this.connectedNode = FULL_NAMES.MAINNET
            } else if (data_full_node === CONF_TRONEX.full_node) {
                this.connectedNode = FULL_NAMES.TRONEX
            } else if (data_full_node === CONF_NILE_CLASSIC.full_node) {
                this.connectedNode = FULL_NAMES.TRONEX
            } else {
                this.connectedNode = ""
            }
        },
        async notify_tron_installed() {
            window.addEventListener('message', ({data: {isTronLink = false, message}}) => {
                if (isTronLink) {
                    if (message.action === 'tabReply' && !this.tronLinkInitialData) {
                        this.tronLinkInitialData = message.data.data;
                        this.prenodenume(this.tronLinkInitialData.node.full_node)
                        this.$emit("notify_tron_initialization", this.tronLinkInitialData)
                    }
                    if (message.action === 'setNode') {
                        this.prenodenume(message.data.node.fullNode)
                        this.$emit("notify_tron_node_change", this.connectedNode)
                    }
                    if (message.action === 'setAccount') {
                        if (this.account_name !== message.data.name) {
                            this.account_name = message.data.name
                            this.authorized_address = message.data.address
                            this.$emit("notify_tron_account_set", this.account_name, this.authorized_address)
                        }
                    }
                    if (this._debug_tronlink) {
                        console.group("Wallet action received")
                        console.log("checker messsage result - ", message.action)
                        console.log(message.data)
                        console.groupEnd()
                    }

                }
            })
            await this.updateNodeVersion()
            //ts-ignore
            let provider = this.tronWeb.currentProvider().full_node.host
            this.prenodenume(provider)
            console.log("TronLink is OK! ✅ ")
            this.$emit("notify_tron_installed")
        },
        async updateNodeVersion() {
            let version = await this.tronWeb.getFullnodeVersion()
            this.node_version = version
        },
        debugTronLink(bool) {
            this._debug_tronlink = bool
        },
        isInstalled() {
            return this.tronLink && this.tronWeb
        },
        isNile() {
            return this.connectedNode === FULL_NAMES.NILE
        },
        isMainnet() {
            return this.connectedNode === FULL_NAMES.MAINNET
        },
        isShasta() {
            return this.connectedNode === FULL_NAMES.SHASTA
        },
        isTronex() {
            return this.connectedNode === FULL_NAMES.TRONEX
        },
    },
    mounted() {
        let _this = this
        setTimeout(function tick() {
            _this.checkTronLink()
            if (!this.tronWeb) {
                setTimeout(tick, 1000)
            }
        }, 0)
    },
}
