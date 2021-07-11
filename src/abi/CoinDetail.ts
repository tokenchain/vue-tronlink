import {Balancer, Spending, TronTRC20Token} from "./base/types";

export default class CoinDetail implements TronTRC20Token {
    address: string;
    decimal: number;
    tokenName: string;
    tokenSymbol: string;
    holder: Balancer;
    spender: Spending;

    constructor(address: string, dec: number, sym: string, name: string) {
        this.address = address
        this.decimal = dec
        this.tokenName = name
        this.tokenSymbol = sym
        this.holder = {}
        this.spender = {}
    }

    setHolder(address: string, bal: number) {
        if (this.holder.hasOwnProperty(address)) {
            this.holder[address] = bal
        } else {
            this.holder[address] = bal
        }
    }

    setSpender(coin_owner: string, spender: string, allowance: number) {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                this.spender[coin_owner][spender] = allowance
            } else {
                this.spender[coin_owner][spender] = allowance
            }
        } else {
            this.spender[coin_owner][spender] = allowance
        }
    }

    name(): string {
        return this.tokenName
    }

    symbol(): string {
        return this.tokenSymbol
    }

    showAllowance(coin_owner: string, spender: string): number {
        if (this.spender.hasOwnProperty(coin_owner)) {
            if (this.spender[coin_owner].hasOwnProperty(spender)) {
                return this.spender[coin_owner][spender]
            }
        }
        return 0
    }

    bySun(address: string): number {
        return this.holder[address]
    }

    byFloat(address: string): number {
        return this.holder[address] / this.decimal
    }
}
