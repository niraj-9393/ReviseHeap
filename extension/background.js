
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
                        let scriptFile;
                        let messageType;

                        if (tab.url.includes("leetcode.com/problems/")) {

                            scriptFile = "scripts/leetcode.js";
                            messageType = "GET_LC_DATA";

                        } else if (
                            tab.url.includes("geeksforgeeks.org/problems/")
                        ) {

                            scriptFile = "scripts/gfg.js";
                            messageType = "GET_GFG_DATA";

                        } else {

                            sendResponse({
                                error: "Unsupported platform"
                            });

                            return;
                        }

                        try {

                            data = await chrome.tabs.sendMessage(
                                tab.id,
                                {
                                    type: messageType
                                }
                            );

                        } catch (error) {

                            console.log(
                                "Content script not found. Injecting it..."
                            );

                            await chrome.scripting.executeScript({
                                target: {
                                    tabId: tab.id
                                },
                                files: [scriptFile]
                            });

                            data = await chrome.tabs.sendMessage(
                                tab.id,
                                {
                                    type: messageType
                                }
                            );
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
        }else if(message.type === "saveToDb"){
            setTimeout(()=>{
             sendResponse("saved✔️");
            },3000)
            return true;
        }
    }

);

