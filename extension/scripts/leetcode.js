const lcDataExtraction = () => {
    const url = window.location.href;

    const title = document.title
        .replace(" - LeetCode", "")
        .trim();

    const difficultyElement = document.querySelector(
        '[class*="text-difficulty-"]'
    );

    const difficulty = difficultyElement
        ? difficultyElement.textContent.trim()
        : null;

    const data = {
        title,
        difficulty,
        url,
        platform: "LeetCode"
    };

    console.log("LC data:", data);

    return data;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_LC_DATA") {
        const data = lcDataExtraction();

        sendResponse(data);
    }

    return true;
});