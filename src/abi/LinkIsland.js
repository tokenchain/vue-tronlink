export class LinkIsland {
    constructor() {
        this.heartbeatrate = 6000;
        if (!this.heartbeat) {
            this.heartbeat = setInterval(() => {
                if (this.callback_heartbeat) {
                    this.callback_heartbeat();
                }
                this.detectTronWeb();
            }, this.heartbeatrate);
        }
        if (window && !window.hasOwnProperty("__TronIsland__")) {
            window.__TronIsland__ = this;
        }
        this.detectTronWeb();
    }
    detectTronWeb() {
        if (window && window.hasOwnProperty("tronWeb") && !this.tronWebInstance) {
            this.tronWebInstance = window.tronWeb;
        }
    }
    heart_beat(callback) {
        this.callback_heartbeat = callback;
    }
    static Instance() {
        if (window && window.hasOwnProperty("__TronIsland__")) {
            const obj = window.__TronIsland__;
            if (obj instanceof LinkIsland) {
                return (obj);
            }
            else {
                return (obj);
            }
        }
        else {
            return new LinkIsland();
        }
    }
}
