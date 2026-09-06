import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "https://leetcode.com/problems/*",
    "https://www.geeksforgeeks.org/problems/*"
  ]
}

const leetCodeData = () => {
  
  const difficultyElement = document.querySelector(
    '[class*="text-difficulty-"]'
  )
  const url = new URL(window.location.href);
  const parts = url.pathname.split("/");
  const slug = parts[2];
  


  const title = document.title.replace(" - LeetCode", "").trim()
  const difficulty =  difficultyElement.textContent.trim();
  const problemUrl = `${url.origin}/problems/${slug}/description/`;
  const data = {
    title,
    difficulty,
    problemUrl,
    platForm:"LeetCode"
  }
  return data;
}
let res = leetCodeData();
console.log(res);


const gfgData = () => {
  const difficultyElement = document.querySelector(
    ".problems_header_description__t_8PB strong"
  );

  const titleElement = document.querySelector(".g-m-0");

  const url = new URL(window.location.href);

  const title = titleElement
    ? titleElement.textContent.trim()
    : null;

  const difficulty = difficultyElement
    ? difficultyElement.textContent.trim()
    : null;

  const problemUrl = `${url.origin}${url.pathname}`;

  const data = {
    title,
    difficulty,
    problemUrl,
    platform: "GeeksforGeeks",
  };

  return data;
};



