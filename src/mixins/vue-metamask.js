/*

if (!window.ethereum) {
    state.install_state = 1
    return false
}
const InstanceW3 = new core(window.ethereum)
state.network_name = await InstanceW3.eth.net.getNetworkType()
try {
    await window.ethereum.enable()
    state.install_state = 3
} catch (error) {
    // User denied account access...
    console.log("Please login or have the network switched.", error)
    state.install_state = 2
    return false
}
return InstanceW3*/
