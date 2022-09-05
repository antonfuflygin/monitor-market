import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

function getVerificationException() {
    let container = document.createElement('div');
    let img = document.createElement('img');
    let text = document.createElement('span');

    img.src = chrome.runtime.getURL('logo48.png');
    text.innerText = 'Ключ не активен';

    container.append(img, text);

    return container;
}

function getControlPanel() {
    let container = document.createElement('div');

    setInterval(() => {
        if (location.href === 'https://seller.wildberries.ru/cmp/campaigns/list/active') {
            let topBar = document.querySelector('.top-bar');

            if (topBar !== null && document.querySelector('#monitor-market-app') === null) {
                topBar.after(container);
                new Vue({
                    store,
                    render: h => h(App)
                }).$mount(container);
            }
        }
    }, 1000)
}

getControlPanel();
