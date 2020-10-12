import TronLink from "../TronLink"

export default {
    data() {
        return {
            tronLink: null,
            tronWeb: null,
            tronLinkInitialData: false,
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
                    console.log("checker messsage result ", message.action)
                    console.log(message.data.data)
                }
            })
            console.log("TronLink is OK!")
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
