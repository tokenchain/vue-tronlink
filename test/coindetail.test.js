import CoinDetail from "../src/abi/CoinDetail"


// Invalid address format tests
test("Set Spender Amount", () => {
    let spend = "TP4AuNEjCwddrqUPDNHENxus3EC2P4Jn5H"
    let ow = "TH48niZfbwHMyqZwEB8wmHfzcvR8ZzJKC6"
    let coindetail = new CoinDetail("adiojiojdias", 8, "SymbolX", "Token Summer")
    coindetail.setSpender(ow, spend, 2909324092039)
    expect(() => {
            //let n=90
            let n = coindetail.showAllowance(ow, spend)
            console.log(n)
            return n
        }
    ).toBeDefined()
})


