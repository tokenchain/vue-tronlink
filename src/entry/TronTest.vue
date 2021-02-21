<template>
  <section id="indexbox" class="container indexcolor">
    <button @click="goto_main">CONNECT</button>
  </section>
</template>
<script>
import tronlink from "../mixins/vue-tronlink"
import TronAnchor from "../components/TronAnchor";

export default {
  name: "Tronmasonic",
  components: {TronAnchor},
  comments: {},
  mixins: [tronlink],
  data() {
    return {
      sheet: false,
      tronlinkinstalled: false
    }
  },
  mounted() {
    this.debugTronLink(true)
    this.$nextTick(() => {
      this.$on("notify_tron_not_install", () => {
        this.tronlinkinstalled = false
        console.log("detect done nil  🔔️")
      })

      this.$on("notify_tron_installed", () => {
        this.tronlinkinstalled = true
        console.log("detect done ok 🔔️")
      })

      this.$on("notify_tron_initialization", () => {
        console.log("detect done notify_tron_initialization 🔔️️")
      })

      this.$on("notify_tron_account_set", () => {
        console.log("detect done notify_tron_account_set 🔔️")
      })

      this.$on("notify_tron_node_change", () => {
        console.log("detect done notify_tron_node_change 🔔️️")
        if (!this.isNile()) {
          console.log("⛔️ This is not NILE network now please go back..")
        }
      })

      this.checkTronLink()
    })
  },
  methods: {
    goto_main() {
      if (this.tronlinkinstalled) {
        if (this.isNile()) {
          console.log("test passed")
        } else {
          console.log("This contract requires Nile network")
        }
      } else {
        console.log("tronweb is installed")
      }
    }
  }
}
</script>
