chrome.windows.getCurrent(function (w) {
    w.width = 300;
    w.height = 200;
})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
            console.log("background =========>", request.data);
        if (request.data.length) {
            fetch("https://topwebdev.pro/index", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request.data),
            })
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            sendResponse({ farewell: "ready to send mail" });
        }
    }
);