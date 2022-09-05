
//TODO: Нужен рефактор!!!

function createItem(product) {
    let itemDiv = document.createElement('div')
    let positionDiv = document.createElement('div')
    let brandDiv = document.createElement('div')
    let cpmDiv = document.createElement('div')

    itemDiv.className = 'monitor-market-info-list__item'

    positionDiv.innerHTML = ('<span>Позиция: </span>')
    brandDiv.innerHTML = ('<span>Бренд: </span>')
    cpmDiv.innerHTML = ('<span>Ставка: </span>')

    positionDiv.append(product.advStatFields.position)
    brandDiv.append(product.brand)
    cpmDiv.append(product.advStatFields.cpm)
    itemDiv.append(...[positionDiv, brandDiv, cpmDiv])

    return itemDiv
}

function compareFunctionDescSort(a, b) {
    if (a.filters.length < b.filters.length) {
        return 1
    }

    if (a.filters.length > b.filters.length) {
        return -1
    }

    return 0
}

function provideData(catalogNode) {
    let advertsFiltered = JSON.parse(localStorage.advertCatalog).pagedProducts.filter(elem =>
        window.location.search.includes(elem.filters.slice(1))).sort(compareFunctionDescSort)[0].pagedGoods

    let infoListElements = document.getElementsByClassName('monitor-market-info-list')
    let info = document.createElement('div')

    if (document.getElementById('monitor-market-warning')) {
        document.getElementById('monitor-market-warning').remove()
    }

    if(infoListElements[0]) {
        infoListElements[0].remove()
    }

    info.className = 'monitor-market-info-list'
    info.id = 'monitor-market-info-list'
    
    Object.values({...advertsFiltered}).forEach(products => {
        let page = document.createElement('div')
        page.className = 'monitor-market-info-list__page'

        products.forEach(product => {
            page.append(createItem(product))
            info.append(page)
        })
    })
    catalogNode.prepend(info)
}

function exceptionMessage(catalogNode, message) {
    let warning = document.createElement('div')
    let img = document.createElement('img')
    let txtSpan = document.createElement('span')

    let warningListElements = document.getElementsByClassName('monitor-market-warning')

    if(warningListElements[0]) {
        warningListElements[0].remove()
    }

    warning.className = 'monitor-market-warning'
    warning.id = 'monitor-market-warning'
    img.src = chrome.runtime.getURL('logo96.png')

    txtSpan.append(message)
    warning.append(img)
    warning.append(txtSpan)
    catalogNode.prepend(warning)
}

function checkProductCards() {
    try {
        let advertCards = document.getElementsByClassName('j-advert-card-item')
        let storageAdverts = JSON.parse(localStorage.advertCatalog).pagedProducts.filter(elem =>
            window.location.search.includes(elem.filters.slice(1))).sort(compareFunctionDescSort)[0].pagedGoods

        let a = Object.values({...storageAdverts})
        let positionList = a.map(products => products.map(product => new Object({
            position: product.advStatFields.position - 1,
            nmId: product.nmId
        })))

        if (a[0].length !== advertCards.length) {
            return false
        }

        for (let i = 0; i < a[0].length; i++) {
            if (a[0][i].nmId !== Number(advertCards[i].getAttribute('data-popup-nm-id'))) {
                return false
            }
        }
        return true
    } catch (e) {
        return false
    }
}

function getCpmWorker() {
    let stateLocalStorage = localStorage.advertCatalog

    let timer = setInterval(() => {
        let catalogElements = document.getElementsByClassName('catalog-page__main')
        let advertItems = document.getElementsByClassName('j-advert-card-item')
        let catalogNode = catalogElements[0]

        if (document.getElementsByClassName('j-advert-card-item').length > 0
            && (!document.getElementById('monitor-market-info-list') && checkProductCards())
            || (stateLocalStorage !== localStorage.advertCatalog && checkProductCards())) {
            stateLocalStorage = localStorage.advertCatalog
            console.log('second timer')
            chrome.storage.sync.get(['myKey'])
                .then(data => {
                    fetch('https://monitor-market.ru/check_token/?user_token=' + data.myKey, {mode: "cors"})
                        .then(response => {
                            if (catalogNode && response.status === 200 && [...advertItems].length !== 0) {
                                provideData(catalogNode)
                            } else if (catalogNode && response.status !== 200) {
                                exceptionMessage(catalogNode, 'Ключ не активен!')
                                clearInterval(timer)
                            }
                        })
                        // .catch((e) => clearInterval(timer))
                })
                .catch()
        } else if (document.getElementsByClassName('j-advert-card-item').length === 0
            && document.getElementById('monitor-market-info-list')) {
            document.getElementById('monitor-market-info-list').remove()
        } else if (document.getElementsByClassName('j-advert-card-item').length > 0
            && !document.getElementById('monitor-market-info-list')
            && !document.getElementById('monitor-market-warning')) {
            exceptionMessage(catalogNode, 'Внутренняя ошибка wildberries. Перезагрузите страницу')
        }
    }, 1000)
}

if (location.href.includes('https://www.wildberries.ru/')) {
    getCpmWorker();
}

