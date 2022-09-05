import Advert from "../helpers/advert";

export default class ApiClient {
    constructor(supplierId) {
        this.headers = {
            'Cookie': 'x-supplier-id=' + supplierId,
            'Content-Type': 'application/json'
        };
    };

    async #sendRequest(url, method, body = null) {
        let response;

        if (method === 'GET') {
            response = await fetch(url, {
                method: method,
                headers: this.headers,
            });
        }

        if (method === 'PUT') {
            await fetch(url, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(body)
            });

            return {};
        }

        if (response.status === 204) {

            return {};
        }

        return await response.json();
    };

    async #getAdvertsSubjects(advertProductsInfoUrls) {
        let advertsSubjects = [];

        for (const item of advertProductsInfoUrls) {
            let response = await fetch(item.value);
            let wbData = await response.json();

            await advertsSubjects.push({id: item.id, value: wbData.data.subject_id});
        }

        return advertsSubjects;
    }

    async getActiveAdverts() {
        const activeAdvertsUrl = 'https://seller.wildberries.ru/ns/campaigns-api/ads/api/v3/atrevds?' +
            'pageNumber=1&pageSize=100&search=&status=%5B9%5D&order=createDate&direction=desc&type=%5B4,5,6%5D';
        const productInfoUrl = 'https://wbx-content-v2.wbstatic.net/ru/';

        let data = await this.#sendRequest(activeAdvertsUrl, 'GET');
        let advertProductsInfoUrls = data.content.map(d => {
            return {id: d.id, value: productInfoUrl + String(d.products[0].nm) + '.json'}
        });
        let advertsSubjects = await this.#getAdvertsSubjects(advertProductsInfoUrls);
        let items = data.content.map(d => {
            let maxPosition = d.type === 5 ? 28 : 5;
            let targetSubject = advertsSubjects.find(subject => subject.id === d.id);
            return new Advert(d.id, d.campaignName, maxPosition, d.type, targetSubject.value);
        });

        return items;
    };

    async getSearchKeywords(id) {
        const getCampSearchKeywordsUrl = 'https://seller.wildberries.ru/ns/campaigns-api/ads/api/v2/search/' +
            id + '/words';

        let data = await this.#sendRequest(getCampSearchKeywordsUrl, 'GET');

        return data.keywords;
    };

    async getCatalogAdsSearch(keyword) {
        const getCatalogAdsSearchUrl = 'https://catalog-ads.wildberries.ru/api/v5/search?keyword=' + keyword;

        let response = await fetch(getCatalogAdsSearchUrl);
        let data = await response.json();

        return data.adverts;
    };

    async getAdsCatalog(menuId) {
        const getCatalogAdsCatalogUrl = 'https://catalog-ads.wildberries.ru/api/v5/catalog?menuid=' + menuId;

        let response = await fetch(getCatalogAdsCatalogUrl);
        let data = await response.json();

        return data.adverts;
    };

    async getCarouselAds(nm) {
        const getCarouselAdsUrl = 'https://carousel-ads.wildberries.ru/api/v4/carousel?nm=' + nm;

        let response = await fetch(getCarouselAdsUrl);

        return await response.json();
    }

    async getPlacement(id, strType) {
        const getCpmPlacementsUrl = 'https://seller.wildberries.ru/ns/campaigns-api/ads/api/v2/' + strType + '/' +
            id + '/placement';

        return await this.#sendRequest(getCpmPlacementsUrl, 'GET');
    };

    async setNewCpmCatalog(id, cpm) {
        const type = 'catalog';
        const url = 'https://seller.wildberries.ru/ns/campaigns-api/ads/api/v2/catalog/' + id + '/save';

        let placement = await this.getPlacement(id, type);

        placement.catalogs[0].price = cpm;

        return await this.#sendRequest(url, 'PUT', placement);
    }

    async setNewCpm(id, cpm, type) {
        if (type === 4) {
            const url = 'https://seller.wildberries.ru/ns/campaigns-api/ads/api/v2/catalog/' + id + '/save';

            let placement = await this.getPlacement(id, 'catalog');

            placement.catalogs[0].price = cpm;

            return await this.#sendRequest(url, 'PUT', placement);
        }

        const strType = type === 5 ? 'carousel-auction' : 'search';
        const url = 'https://seller.wildberries.ru/ns/campaigns-api/ads/api/v2/' + strType + '/' + id + '/save';

        let placement = await this.getPlacement(id, strType);

        placement.place[0].price = cpm;
        console.log('placement: ', placement);

        return await this.#sendRequest(url, 'PUT', placement);
    };
}