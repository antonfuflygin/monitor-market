import Vue from 'vue';
import Vuex from 'vuex';
import adverts from "./modules/adverts";

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    modules: {
        adverts
    }
})
