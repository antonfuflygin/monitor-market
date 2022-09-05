<template>
  <div id="monitor-market-app">
    <div class="content" v-if="isVerified">
      <img :src="srcIcon" alt="">
      <button id="monitor-market-app-btn" @click="showPopup = !showPopup">Автоматическое управление ставками</button>
      <control-panel v-show="showPopup" @close-popup="() => this.showPopup = false"></control-panel>
    </div>
    <div class="content" v-else>
      <img :src="srcIcon" alt="">
      <span id="verification-exception">Ключ не активен</span>
    </div>
  </div>
</template>
<script>
import ControlPanel from "@/components/ControlPanel";

export default {
  name: "App",
  components: {ControlPanel},
  data() {
    return {
      srcIcon: chrome.runtime.getURL('img/logo48.png'),
      showPopup: false,
      isVerified: false,
    }
  },
  methods: {
    async getVerificationUrl() {
      const data = await chrome.storage.sync.get(['myKey']);

      return 'https://monitor-market.ru/check_token/?user_token=' + data.myKey;
    },
    async checkVerification() {
      const verificationUrl = await this.getVerificationUrl();

      let verification = false;
      let response = await fetch(verificationUrl, {mode: "cors"});

      if (response.status === 200) {
        verification = true;
      }

      this.isVerified = verification;
    }
  },
  async mounted() {
    await this.checkVerification();
  }
}
</script>

<style lang="scss" scoped>
#monitor-market-app-btn {
  height: 44px;
  font-weight: 400;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #d1cfd7;
  background: #fff;
  padding: 10px;
  cursor: pointer;

  &:active {
    background: #3a0078;
    color: #fff;
  }
}

#verification-exception {
  font-weight: 400;
  font-size: 16px;
  margin: 10px;
}

.content {
  display: flex;
  align-items: center;
}
</style>