<template>
  <div class="popup" @click.self="$emit('close-popup')">
      <div class="wrapper" ref="wrapper">
        <span class="wrapper__close" @click="$emit('close-popup')">Закрыть</span>
        <div class="wrapper__logo">
          <img :src="srcIcon" alt="">
          <h3>MonitorMarket</h3>
        </div>
        <div class="wrapper__content">
          <div class="id column">
            <div class="id__label label">Id</div>
            <advert-id v-for="advert in allAdverts"
                :key="advert.id"
                :id="advert.id"></advert-id>
          </div>
          <div class="name column">
            <div class="name__label label">Название кампании</div>
            <advert-name v-for="advert in allAdverts"
                  :key="advert.id"
                  :name="advert.name"
                  :adv-type="advert.advType"></advert-name>
          </div>
          <div class="max-position column">
            <div class="max-position__label label">Позиция в категории</div>
            <advert-max-position v-for="advert in allAdverts"
                          :key="advert.id"
                          :id="advert.id"></advert-max-position>
          </div>
          <div class="cpm-limit column">
            <div class="cpm-limit__label label">Лимит</div>
            <advert-cpm-limit v-for="advert in allAdverts"
                       :key="advert.id"
                       :id="advert.id"></advert-cpm-limit>
          </div>
          <div class="auto-control column">
            <div class="auto-control__label-container">
              <div class="auto-control__label label">Текущая ставка</div>
            </div>
            <advert-auto-control v-for="advert in allAdverts"
                          :key="advert.id"
                          :id="advert.id"></advert-auto-control>
          </div>
        </div>
        <div class="wrapper__note-btn" @click="showNote = !showNote">Почему я не могу найти свою рекламу?</div>
        <div v-show="showNote" class="wrapper__note" v-html="noteText"></div>
      </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import AdvertId from "./AdvertId";
import AdvertName from "./AdvertName";
import AdvertMaxPosition from "./AdvertMaxPosition";
import AdvertCpmLimit from "./AdvertCpmLimit";
import AdvertAutoControl from "./AdvertAutoControl";
import noteText from "../helpers/note-text";

export default {
  name: "ControlPanel",
  components: {
    AdvertAutoControl,
    AdvertCpmLimit,
    AdvertMaxPosition,
    AdvertName,
    AdvertId
  },
  data() {
    return {
      srcIcon: chrome.runtime.getURL('img/logo48.png'),
      checkClickWrapper: false,
      showNote: false,
      showDeliveryHours: false,
      noteText: noteText
    }
  },
  methods: {
    ...mapActions(['getAdverts']),
  },
  computed: {
    ...mapGetters(['allAdverts'])
  },
  mounted() {
    this.getAdverts()
  }
}
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.6);
  z-index: 1000;
}

.wrapper {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 5px;
  width: 50%;
  z-index: 99999;

  &__close {
    color: #aaa;
    float: right;
    font-size: 14px;
    cursor: pointer;
  }

  &__logo {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    & img {
      width: 30px;
      height: 30px;
    }

    & h3 {
      color: #043141;
    }
  }

  &__content {
    display: flex;
    flex-flow: row;
    justify-content: stretch;
    overflow: auto;
  }

  &__note p{
    text-indent: 20px;
  }

  &__note-btn {
    color: #2AA3E3;
    font-size: 12px;
    cursor: pointer;
  }
}

.name {
  min-width: 170px;
  overflow: auto;
}

.auto-control {
  width: 45%;

  &__label {
    width: 50%;
  }
}
</style>