export default class CoinDetail {
    constructor(address, dec, sym, name) {
        this.address = address;
        this.decimal = dec;
        this.tokenName = name;
        this.tokenSymbol = sym;
        this.holder = {};
        this.spender = {};
        this.unlimited = {};
    }
    setHolder(address, bal) {
        this._setDeep(this.holder, [address], bal);
    }
    setSpender(coin_owner, spender, allowance) {
        this._setDeep(this.spender, [coin_owner, spender], allowance);
    }
    setSpenderAllowed(coin_owner, spender, isAll) {
        this._setDeep(this.unlimited, [coin_owner, spender], isAll);
    }
    name() {
        return this.tokenName;
    }
    symbol() {
        return this.tokenSymbol;
    }
    showAllowance(coin_owner, spender) {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                return this.spender[coin_owner][spender];
            }
        }
        return 0;
    }
    showAllowed(coin_owner, spender) {
        if (this.unlimited.hasOwnProperty(coin_owner)) {
            if (this.unlimited[coin_owner].hasOwnProperty(spender)) {
                return this.unlimited[coin_owner][spender];
            }
        }
        return false;
    }
    balance(address) {
        return this.holder[address];
    }
    byFloat(address) {
        return this.holder[address] / this.decimal;
    }
    _setDeep(obj, path, value, setrecursively = false) {
        let properties = Array.isArray(path) ? path : path.split(".");
        if (properties.length > 1) {
            if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== "object")
                obj[properties[0]] = {};
            return this._setDeep(obj[properties[0]], properties.slice(1), value);
        }
        else {
            obj[properties[0]] = value;
            return true;
        }
    }
}
