import ApiClient from "../../classes/api-client";
import supplierId from "../../helpers/supplier-id";
import {SearchAdvertCpmAnalyzer} from "../../classes/cpm-analyzers";
import {
    createAnalyzer,
    autoSetCpmCarouselType,
    autoSetCpmCatalogType,
    autoSetCpmSearchType
} from "../../helpers/create-analyzer";

const client = new ApiClient(supplierId)

export default {
    state: {
        adverts: []
    },
    mutations: {
        ACTIVE(state, payload) {
            state.adverts.find(advert => advert.id === payload.id).isActive = payload.value;
        },
        SET_CPM(state, payload) {
            state.adverts.find(advert => advert.id === payload.id).currentCpm = payload.currentCpm;
        },
        EDIT_CPM_LIMIT(state, payload) {
            state.adverts.find(advert => advert.id === payload.id).cpmLimit = payload.cpmLimit;
        },
        EDIT_MAX_POSITION(state, payload) {
            state.adverts.find(advert => advert.id === payload.id).maxPosition = payload.maxPosition;
        },
        SET_ADVERTS(state, payload) {
            state.adverts = payload.items;
        }
    },
    actions: {
        activateItem(store, payload) {
            store.commit('ACTIVE', {id: payload.id, value: payload.value});
        },
        resetCpm(store, payload) {
            store.commit('SET_CPM', {id: payload.id, currentCpm: null});
        },
        setCpmAutoMode(store, payload) {
            const totalTime = 240000;

            let analyzer, timer;
            let adverts = [...store.state.adverts];
            let target = adverts.find(advert => advert.id === payload.id);

            if (target.isActive) {
                analyzer = createAnalyzer(
                    target.id, target.maxPosition, target.cpmLimit, target.subject, target.advType
                );
                analyzer.getRelevantCpm()
                    .then(cpm => {
                        client.setNewCpm(target.id, cpm, target.advType)
                            .then(() => store.commit('SET_CPM', {id: target.id, currentCpm: cpm}));

                        timer = setInterval(() => {
                            adverts = [...store.state.adverts];
                            target = adverts.find(advert => advert.id === analyzer.advertId);

                            if (target.isActive) {
                                analyzer.advertMaxPosition = target.maxPosition;
                                analyzer.advertCpmLimit = target.cpmLimit;
                                analyzer.getRelevantCpm()
                                    .then(cpm => client.setNewCpm(target.id, cpm, target.advType)
                                        .then(() => store.commit('SET_CPM', {id: target.id, currentCpm: cpm})));
                            } else {
                                clearInterval(timer);
                            }
                        }, totalTime)
                    });
            }
        },
        editCpmLimit(store, payload) {
            store.commit('EDIT_CPM_LIMIT', {id: payload.id, cpmLimit: payload.cpmLimit});
        },
        editMaxPosition(store, payload) {
            store.commit('EDIT_MAX_POSITION', {id: payload.id, maxPosition: payload.maxPosition});
        },
        getAdverts(store) {
            client.getActiveAdverts()
                .then(adverts => store.commit('SET_ADVERTS', {items: adverts}));
        }
    },
    getters: {
        allAdverts(state) {
            return state.adverts;
        },
        getAdvert(state) {
            return id => state.adverts.find(advert => advert.id === id)
        }
    },
}