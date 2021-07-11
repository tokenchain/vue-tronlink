export default class CoinDetail {
    constructor(address, dec, sym, name) {
        this.address = address;
        this.decimal = dec;
        this.tokenName = name;
        this.tokenSymbol = sym;
        this.holder = {};
        this.spender = {};
    }
    setHolder(address, bal) {
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = bal;
        }
        else {
            this.holder[address] = bal;
        }
    }
    setSpender(coin_owner, spender, allowance) {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                this.spender[coin_owner][spender] = allowance;
            }
            else {
                this.spender[coin_owner][spender] = allowance;
            }
        }
        else {
            this.spender[coin_owner][spender] = allowance;
        }
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
    bySun(address) {
        return this.holder[address];
    }
    byFloat(address) {
        return this.holder[address] / this.decimal;
    }
}
