// @ts-ignore

export class LinkIsland {
    heartbeat: number;
    heartbeatrate: number = 6000;
    callback_heartbeat: Function;
    tronWebInstance: any;

    constructor() {
        if (!this.heartbeat) {
            // @ts-ignore
            this.heartbeat = setInterval(() => {
                if (this.callback_heartbeat) {
                    this.callback_heartbeat()
                }
                this.detectTronWeb()
            }, this.heartbeatrate)

        }
        if (window && !window.hasOwnProperty("__TronIsland__")) {
            // @ts-ignore
            window.__TronIsland__ = this
        }
        this.detectTronWeb()
    }

    private detectTronWeb(): void {
        if (window && window.hasOwnProperty("tronWeb") && !this.tronWebInstance) {
            // @ts-ignore
            this.tronWebInstance = window.tronWeb
        }
    }

    public heart_beat(callback): void {
        this.callback_heartbeat = callback
    }

    public static Instance(): (LinkIsland | any | boolean) {
        if (window && window.hasOwnProperty("__TronIsland__")) {
            // @ts-ignore
            const obj = window.__TronIsland__
            if (obj instanceof LinkIsland) {
                return (obj) as LinkIsland
            } else {
                return (obj) as LinkIsland
            }
        } else {
            return new LinkIsland()
        }
    }
}
