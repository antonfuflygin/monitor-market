/* Advert's types: 4 - catalog; 5 - carousel; 6 - search */

export default function Advert(id, name, maxPosition, advType, subject) {
    this.id = id;
    this.name = name;
    this.maxPosition = maxPosition;
    this.advType = advType;
    this.subject = subject;
    this.cpmLimit = 50;
    this.currentCpm = null;
    this.isActive = false;
}