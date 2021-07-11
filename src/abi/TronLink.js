import { Address } from "./base/Address";
import { TokenTrc20 } from "./TokenTrc20";
import { txtUnit } from "./../utils/bnx";
import CoinDetail from "./CoinDetail";
export default class TronLink {
    constructor(tronWeb) {
        this.tronWeb = tronWeb;
        this.tokens = {};
        this.selected_function_human_operation = "";
        if (window && !window.hasOwnProperty("__tronlinksupportcodex")) {
            window.__tronlinksupportcodex = this;
        }
    }
    static Instance() {
        if (window && window.hasOwnProperty("__tronlinksupportcodex")) {
            const obj = window.__tronlinksupportcodex;
            if (obj instanceof TronLink) {
                return (obj);
            }
            else {
                return (obj);
            }
        }
        else {
            return false;
        }
    }
    isInstalled() {
        return !!this.tronWeb;
    }
    isLoggedIn() {
        return this.tronWeb && this.tronWeb.ready;
    }
    isUnlocked() {
        return this.isLoggedIn();
    }
    getAccountAddress() {
        return this.tronWeb.defaultAddress.base58;
    }
    getAccountAddressHex() {
        return this.tronWeb.defaultAddress.hex;
    }
    getAccountAddress0x() {
        return "0x" + this.getAccountAddressHex().substr(2);
    }
    NewContract(abi = [], address = false) {
        return new this.tronWeb.Contract(this.tronWeb, abi, address);
    }
    removeAllFunctionCalls() {
        this.selected_function_human_operation = "";
    }
    convertAddress(address, fromFormat, toFormat) {
        if (fromFormat == toFormat) {
            throw "From and To address formats are equal";
        }
        switch (toFormat) {
            case "hex":
                switch (fromFormat) {
                    case "base58":
                    case "tron":
                    case "trx":
                        return "0x" + this.tronWeb.address.toHex(address);
                }
                break;
            case "base58":
            case "tron":
            case "trx":
                switch (fromFormat) {
                    case "hex":
                        if (!Address.isHexAddress(address)) {
                            throw "Invalid hex address";
                        }
                        if (address.startsWith("0x")) {
                            address = address.substr(2);
                        }
                        return this.tronWeb.address.fromHex(address);
                }
                break;
        }
        throw "Invalid address formats";
    }
    async coinTRX() {
        let wallet_trx_coin = 0;
        wallet_trx_coin = await this.tronWeb.trx.getBalance(this.getAccountAddress());
        return wallet_trx_coin;
    }
    getCoinTRX(cb, cberr) {
        this.tronWeb.trx.getBalance(this.getAccountAddress(), (err, x) => {
            if (err == null) {
                cb(x);
            }
            else {
                cberr(err);
            }
        });
    }
    async getCoin(trc20_coin) {
        return await this.getThirdTokenBalanceSun(this.getAccountAddress(), trc20_coin);
    }
    async getCoinFlo(trc20_coin) {
        return await this.getThirdTokenBalanceFloat(this.getAccountAddress(), trc20_coin);
    }
    async coinDPFlo() {
        return await this.getCoinFlo("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLAFlo() {
        return await this.getCoinFlo("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTCFlo() {
        return await this.getCoinFlo("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETHFlo() {
        return await this.getCoinFlo("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUNFlo() {
        return await this.getCoinFlo("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDTFlo() {
        return await this.getCoinFlo("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async coinDP() {
        return await this.getCoin("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLA() {
        return await this.getCoin("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTC() {
        return await this.getCoin("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETH() {
        return await this.getCoin("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUN() {
        return await this.getCoin("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDT() {
        return await this.getCoin("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async getCoinDetail(trc20_coin) {
        return await this.getThirdTokenBalance(this.getAccountAddress(), trc20_coin);
    }
    async coinDPDetail() {
        return await this.getCoinDetail("TXHvwxYbqsDqTCQ9KxNFj4SkuXy7EF2AHR");
    }
    async coinCOLADetail() {
        return await this.getCoinDetail("TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG");
    }
    async coinBTCDetail() {
        return await this.getCoinDetail("TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9");
    }
    async coinETHDetail() {
        return await this.getCoinDetail("THb4CqiFdwNHsWsQCs4JhzwjMWys4aqCbF");
    }
    async coinSUNDetail() {
        return await this.getCoinDetail("TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9");
    }
    async coinUSDTDetail() {
        return await this.getCoinDetail("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t");
    }
    async getThirdTokenBalance(address, trc20) {
        if (!this.isLoggedIn()) {
            throw "wallet is not login";
        }
        const contract = await this.NewToken(trc20);
        if (!this.tokens.hasOwnProperty(trc20)) {
            const a = await contract.balanceOf(address);
            const d = await contract.decimals();
            const n = await contract.name();
            const s = await contract.symbol();
            const detail = new CoinDetail(trc20, d, s, n);
            detail.setHolder(address, txtUnit(a));
            this.tokens[trc20] = detail;
        }
        else {
            const b = await contract.balanceOf(address);
            this.tokens[trc20].setHolder(address, txtUnit(b));
        }
        return this.tokens[trc20];
    }
    async getTokenBalanceDetail(address, trc20) {
        return this.getThirdTokenBalance(address, trc20);
    }
    async getUpdateAllowanceAmount(ins, myaddress, spender) {
        if (!this.isLoggedIn()) {
            throw "wallet is not login";
        }
        const contract = await this.NewToken(ins.address);
        const allowance = await contract.allowance(myaddress, spender);
        const nm = txtUnit(allowance);
        ins.setSpender(myaddress, spender, nm);
        return ins.showAllowance(myaddress, spender);
    }
    async getThirdTokenBalanceSun(address, trc20_address) {
        const conver = await this.getThirdTokenBalance(address, trc20_address);
        return conver.bySun(address);
    }
    async getThirdTokenBalanceFloat(address, trc20_address) {
        const conver = await this.getThirdTokenBalance(address, trc20_address);
        return conver.byFloat(address);
    }
    async ApproveSpendingToken(trc20_address, spender_address, amount_sun) {
        const token = await this.NewToken(trc20_address);
        return await token.approve(spender_address, String(amount_sun));
    }
    async NewToken(trc20_address) {
        const contract = new TokenTrc20(this.tronWeb);
        contract.setDebug(false);
        await contract.init(trc20_address);
        return contract;
    }
    getListedCoins() {
        return this.tokens;
    }
    explainTrc20(payload) {
        const me = this.getAccountAddress();
        return payload.holder[me];
    }
    setCallbackFunctionCall(function_selector, caller) {
        this.selected_function_human_operation = function_selector;
        this.selected_function_caller = caller;
    }
    __signOp(payload) {
        if (this.selected_function_human_operation == payload.data.input.function_selector) {
            this.selected_function_caller.signer(payload);
            return true;
        }
        else {
            return false;
        }
    }
    __signReply(payload) {
        if (this.selected_function_caller != undefined && this.selected_function_human_operation != "") {
            this.selected_function_caller.reply(payload);
            this.selected_function_human_operation = "";
            return true;
        }
        else {
            return false;
        }
    }
    __debugMessage(data_message_raw) {
        if (this.selected_function_caller) {
            this.selected_function_caller.debug(data_message_raw);
            return true;
        }
        else {
            return false;
        }
    }
    eventListener(message, tronLinkInitialData, vueInstance) {
        if (message.action === 'setNode') {
            vueInstance.announce_node_name(message.data.node.fullNode);
            vueInstance.$emit("notify_tron_node_change", message.data.node.fullNode);
        }
        if (message.action === 'setAccount') {
            if (message.hasOwnProperty("data")) {
                if (vueInstance.hasOwnProperty("account_name") && vueInstance.account_name !== message.data.name) {
                    vueInstance.$emit("notify_tron_account_set", message.data.name, message.data.address);
                }
                if (message.data.name === false) {
                    vueInstance.$emit("notify_tron_account_logout");
                }
            }
        }
        if (message.action === 'tunnel') {
            if (message.data.hasOwnProperty("action") && message.data.action === 'sign') {
                if (message.data.hasOwnProperty("input") && message.data.input.hasOwnProperty("function_selector")) {
                    if (!this.__signOp(message.data)) {
                        vueInstance.$emit("notify_tron_opensign", message.uuid, message.data.input.function_selector, message.data);
                    }
                }
                else {
                    if (!this.__signOp(message.data)) {
                        vueInstance.$emit("notify_tron_opensign", message.uuid, message.data);
                    }
                }
            }
        }
        if (message.action === 'tabReply') {
            if (message.data.hasOwnProperty("success")) {
                if (message.data.success === true) {
                    if (!this.__signReply(message.data)) {
                        vueInstance.$emit("notify_tron_sign_success_broadcast", message.data, message.uuid);
                    }
                }
                else {
                    this.removeAllFunctionCalls();
                }
            }
            if (!tronLinkInitialData) {
                if (typeof message === "object" && message.hasOwnProperty("data")) {
                    if (message.data.hasOwnProperty("data")) {
                        tronLinkInitialData = message.data.data;
                        if (message.data.hasOwnProperty("node")) {
                            vueInstance.announce_node_name(message.data.node.full_node);
                        }
                        vueInstance.$emit("notify_tron_initialization", tronLinkInitialData);
                    }
                    else {
                        console.log(message.data);
                    }
                }
            }
        }
        if (vueInstance.hasOwnProperty("_debug_tronlink") && vueInstance._debug_tronlink) {
            console.group("TronLink Message 🖼");
            console.log("Action:", message.action);
            console.log(message.data);
            this.__debugMessage(message);
            console.groupEnd();
        }
    }
}
