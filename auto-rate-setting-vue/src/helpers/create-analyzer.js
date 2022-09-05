import {SearchAdvertCpmAnalyzer, CatalogAdvertCpmAnalyzer, CarouselAdvertCpmAnalyzer} from "../classes/cpm-analyzers";

export function createAnalyzer(id, maxPosition, cpmLimit, subject, advType, totalTime) {

    if (advType === 4) {

        return new CatalogAdvertCpmAnalyzer(id, maxPosition, cpmLimit);
    } else if (advType === 5) {

        return new CarouselAdvertCpmAnalyzer(id, maxPosition, cpmLimit);
    }

    return new SearchAdvertCpmAnalyzer(id, maxPosition, cpmLimit, subject, totalTime);
}
