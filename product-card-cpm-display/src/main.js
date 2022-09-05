import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

function getProductCardAdvertCpm() {
    let container = document.createElement('div');

    setInterval(() => {
        if (location.href.match(/www.wildberries.ru\/catalog\/\d+\/detail\.aspx/) !== null) {
            let carouselWrapper = document.querySelector('.j-promo-carousel-wrapper');

            if (carouselWrapper !== null && document.querySelector('.monitor-market-app') === null) {
                carouselWrapper.prepend(container);
                new Vue({
                    store,
                    render: h => h(App)
                }).$mount(container);
            }
        }
    })
}

getProductCardAdvertCpm();