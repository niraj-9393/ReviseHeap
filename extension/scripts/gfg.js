const gfgDataExtraction = () => {
    const url = window.location.href;

    const difficultyElement = document.querySelector(
        '.problems_header_description__t_8PB strong'
    );

    const titleElement = document.querySelector('.g-m-0');

    const title = titleElement
        ? titleElement.textContent.trim()
        : null;

    const difficulty = difficultyElement
        ? difficultyElement.textContent.trim()
        : null;

    const data = {
        title,
        difficulty,
        url,
        platform: "GeeksforGeeks"
    };

    console.log("GFG data:", data);

    return data;
};

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        console.log("GFG received:", message);

        if (message.type === "GET_GFG_DATA") {

            const data = gfgDataExtraction();

            console.log("GFG sending:", data);

            sendResponse(data);
        }

        return true;
    }
);