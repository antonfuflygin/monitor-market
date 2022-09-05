import ApiClient from "./api-client";
import supplierId from "../helpers/supplier-id";

export class SearchAdvertCpmAnalyzer {
    constructor(advertId, advertMaxPosition, advertCpmLimit, subject) {
        this.advertId = advertId;
        this.advertMaxPosition = advertMaxPosition;
        this.advertCpmLimit = advertCpmLimit;
        this.subject = subject;
    }

    async getRelevantCpm() {
        const strType = 'search';
        const client = new ApiClient(supplierId);
        let keywords, currentCpm, result, initialCpm = 50;

        keywords = await client.getSearchKeywords(this.advertId);
        currentCpm = initialCpm;

        if (keywords.length > 0) {

            for (let keyword of keywords.slice(0, 10)) {
                result = await this.#calcCpmForKeyword(keyword.keyword, currentCpm);

                if (result === undefined) {
                    result = currentCpm;
                    continue;
                }

                currentCpm = result;
            }
        }
        else {
            let placement = await client.getPlacement(this.advertId, strType);
            let keyword = placement.place[0].keyWord;

            result = await this.#calcCpmForKeyword(keyword, currentCpm);

            if (result === undefined) {
                result = initialCpm;
            }
        }

        return result;
    }

    async #calcCpmForKeyword(keyword, currentCpm) {
        let result, i = this.advertMaxPosition - 1;
        let targetAdverts = await this.#getTargetAdverts(keyword, this.subject);

        if (targetAdverts === undefined) {
            return;
        }

        i = i > targetAdverts.length - 1 ? targetAdverts.length - 1: i;

        if (targetAdverts[i].advertId !== this.advertId) {
            result = targetAdverts[i].cpm + 1;
            result = currentCpm > result ? currentCpm : result;
            result = this.advertCpmLimit > result ? result : this.advertCpmLimit;
        } else {
            result = targetAdverts[i].cpm;
            result = currentCpm > result ? currentCpm : result;
            result = this.advertCpmLimit > result ? result : this.advertCpmLimit;
        }

        return result;
    }

    async #getTargetAdverts(keyword) {
        const client = new ApiClient(supplierId);
        let adverts, targetAdverts;

        adverts = await client.getCatalogAdsSearch(keyword);

        if (adverts === null){
            return;
        }

        if (adverts.length === 0) {
            return;
        }

        targetAdverts = adverts.filter(advert => advert.subject === this.subject);

        if (targetAdverts.length === 0) {
            return;
        }

        return targetAdverts;
    }

    #delay(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

export class CatalogAdvertCpmAnalyzer {
    constructor(advertId, advertMaxPosition, advertCpmLimit) {
        this.advertId = advertId;
        this.advertMaxPosition = advertMaxPosition;
        this.advertCpmLimit = advertCpmLimit;
    }

    async getRelevantCpm() {
        const strType = 'catalog';
        const client = new ApiClient(supplierId);
        const placement = await client.getPlacement(this.advertId, strType);
        const menuId = placement.catalogs[0].menuId;

        let adverts, result = 50, i = this.advertMaxPosition - 1;

        adverts = await client.getAdsCatalog(menuId);

        if (adverts.length === 0) {
            return result;
        }

        i = i > adverts.length - 1 ? adverts.length - 1 : i;


        if (adverts[i].advertId !== this.advertId) {
            result = adverts[i].cpm + 1;
            result = this.advertCpmLimit > result ? result : this.advertCpmLimit;
        } else {
            result = adverts[i].cpm;
            result = this.advertCpmLimit > result ? result : this.advertCpmLimit;
        }

        return result;
    }
}

export class CarouselAdvertCpmAnalyzer {
    constructor(advertId, advertMaxPosition, advertCpmLimit) {
        this.advertId = advertId;
        this.advertMaxPosition = advertMaxPosition;
        this.advertCpmLimit = advertCpmLimit;
    }

    async getRelevantCpm() {
        const client = new ApiClient(supplierId)
        const strType = 'carousel-auction';
        const placement = await client.getPlacement(this.advertId, strType);
        const nmId = placement.place[0].carouselElements[0].nm;

        let adverts, result = 50, i = this.advertMaxPosition - 1;

        adverts = await client.getCarouselAds(nmId);

        if (adverts.length === 0) {
            return result;
        }

        i = i > adverts.length - 1 ? adverts.length - 1 : i;

        if (adverts[i].advertId !== this.advertId) {
            result = adverts[i].cpm + 1;
            result = this.advertCpmLimit > result ? result : this.advertCpmLimit;
        } else {
            result = adverts[i].cpm;
            result = this.advertCpmLimit > result ? result : this.advertCpmLimit;
        }

        return result;
    }
}