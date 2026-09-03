chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.type === "GET_DATA") {

            chrome.tabs.query(
                {
                    active: true,
                    currentWindow: true
                },
                async (tabs) => {

                    const tab = tabs[0];

                    console.log("Active tab:", tab.url);

                    try {

                        let data;

                        if (tab.url.includes("leetcode.com/problems/")) {

                            data = await chrome.tabs.sendMessage(
                                tab.id,
                                {
                                    type: "GET_LC_DATA"
                                }
                            );

                        } else if (
                            tab.url.includes("geeksforgeeks.org/problems/")
                        ) {

                            data = await chrome.tabs.sendMessage(
                                tab.id,
                                {
                                    type: "GET_GFG_DATA"
                                }
                            );

                        } else {

                            sendResponse({
                                error: "Unsupported platform"
                            });

                            return;
                        }

                        console.log("Background received:", data);

                        sendResponse(data);

                    } catch (error) {

                        console.error("Background error:", error);

                        sendResponse({
                            error: error.message
                        });
                    }
                }
            );

            return true;
        }
    }
);