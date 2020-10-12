import TronLink from "../TronLink"
import {CONF_MAINNET, CONF_NILE, CONF_SHASTA, DEFAULT_NODES, FULL_NAMES} from "../utils/const";

/**
 * events:
 * notify_tron_not_install
 * notify_tron_installed
 * notify_tron_node_change
 * notify_tron_account_set
 */
export default {
    data() {
        return {
            tronLink: null,
            tronWeb: null,
            // object json
            tronLinkInitialData: false,
            // node name NILE, MAINNET
            connectedNode: false,
            // wallet account name
            account_name: false,
            // TB9M9KdCvee3qnRtKE7GACZpTh3oiTX9JL
            authorized_address: false,
        }
    },
    methods: {
        checkTronLink() {
            if (window && window.hasOwnProperty("tronWeb")) {
                this.tronWeb = window.tronWeb
                this.tronLink = new TronLink(this.tronWeb)
                this.notify_tron_installed()
                return true
            }
            this.notify_tron_not_install()
            return false
        },
        notify_tron_not_install() {
            console.log("TronLink is not installed")
            this.$emit("notify_tron_not_install")
        },
        notify_tron_installed() {
            window.addEventListener('message', ({data: {isTronLink = false, message}}) => {
                if (isTronLink) {
                    if (message.action === 'tabReply' && !this.tronLinkInitialData) {
                        this.tronLinkInitialData = message.data.data;
                    }
                    if (message.action === 'setNode') {
                        if (message.data.node.fullNode === CONF_NILE.full_node) {
                            this.connectedNode = FULL_NAMES.NILE
                        } else if (message.data.node.fullNode === CONF_MAINNET.full_node) {
                            this.connectedNode = FULL_NAMES.MAINNET
                        } else if (message.data.node.fullNode === CONF_SHASTA.full_node) {
                            this.connectedNode = FULL_NAMES.SHASTA
                        } else if (message.data.node.fullNode === DEFAULT_NODES.full_node) {
                            this.connectedNode = FULL_NAMES.MAINNET
                        } else if (message.data.node.fullNode === CONF_TRONEX.full_node) {
                            this.connectedNode = FULL_NAMES.TRONEX
                        } else {
                            this.connectedNode = ""
                        }
                        this.$emit("notify_tron_node_change", this.connectedNode)
                    }
                    if (message.action === 'setAccount') {
                        if (this.account_name !== message.data.name) {
                            this.account_name = message.data.name
                            this.authorized_address = message.data.address
                            this.$emit("notify_tron_account_set", this.account_name, this.authorized_address)
                        }
                    }
                    //console.log("checker messsage result ", message.action)
                    //console.log(message.data)
                }
            })
            console.log("TronLink is OK! ✅ ")
            this.$emit("notify_tron_installed")
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
