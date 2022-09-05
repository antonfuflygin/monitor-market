import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    strict: true,
    state: {
        adverts: []
    },
    mutations: {
        SET_ADVERTS(state, payload) {
            state.adverts = payload.items;
        }
    },
    actions: {
        getCarouselAdverts(store) {
            const nmId = location.href.split('/')[4];
            const url = 'https://carousel-ads.wildberries.ru/api/v4/carousel?nm=' + nmId;

            fetch(url, {headers: {'wb-apptype': '1'}})
                .then(response => response.json())
                .then(data => store.commit('SET_ADVERTS', {items: data}));
        }
    },
    getters: {
        allCarouselAdverts(state) {
            return state.adverts;
        }
    }
})
