

document.addEventListener("DOMContentLoaded", () => {

    const nameField = document.getElementById("name");
    const urlField = document.getElementById("url");
    const platformField = document.getElementById("platform");
    const difficultyField = document.getElementById("difficulty");

    chrome.runtime.sendMessage(
        {
            type: "GET_DATA"
        },
        (data) => {

            if (chrome.runtime.lastError) {
                console.error(
                    "Popup error:",
                    chrome.runtime.lastError.message
                );
                return;
            }

            console.log("Popup received:", data);

            if (!data || data.error) {
                console.error(data?.error);
                return;
            }

            nameField.value = data.title || "";
            urlField.value = data.url || "";
            platformField.value = data.platform || "";
            difficultyField.value = data.difficulty || "";
        }
    );



    // when btn clicked logic 
   const addBtn = document.getElementById("addToSheet");

console.log(addBtn);

addBtn.addEventListener("click", () => {
  addBtn.textContent = "Saving...";
  addBtn.disabled = true;

  chrome.runtime.sendMessage(
    {
      type: "saveToDb"
    },
    (data) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Popup error:",
          chrome.runtime.lastError.message
        );

        addBtn.textContent = "Try Again";
        addBtn.disabled = false;
        return;
      }

      if (!data || data.error) {
        console.error(data?.error);

        addBtn.textContent = "Try Again";
        addBtn.disabled = false;
        return;
      }

      addBtn.textContent = data;

      setTimeout(() => {
        addBtn.textContent = "Add to ReviseHeap";
        addBtn.disabled = false;
      }, 1500);
    }
  );
});
});
