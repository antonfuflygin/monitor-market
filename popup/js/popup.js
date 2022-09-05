document.addEventListener('DOMContentLoaded', () => {
    let saveButton = document.getElementById('save-btn');
    let input = document.getElementById('input');
    let popupContainer = document.getElementById('container');
    let message = document.createElement('div');

    chrome.storage.sync.get(['myKey']).then(data => {
        if (data.myKey) {
            input.value = data.myKey
        }
    })

    saveButton.addEventListener('click', function () {
        let key = input.value

        if (key) {
            fetch('https://monitor-market.ru/check_token/?user_token=' + key, {mode: "cors"})
                .then(response => response.status)
                .then(data => {
                    if (data === 200) {
                        message.remove();
                        chrome.storage.sync.set({'myKey': key});
                        message.className = 'confirmed';
                        message.innerText = 'Ключ сохранён!';
                        popupContainer.prepend(message);
                    }
                    else {
                        message.remove();
                        message.className = 'confirmation-failure';
                        message.innerText = 'Неверный ключ!';
                        popupContainer.prepend(message)
                    }
                })
        }

    }, false)
}, false)