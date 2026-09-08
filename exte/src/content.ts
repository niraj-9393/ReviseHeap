import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "https://leetcode.com/problems/*",
    "https://www.geeksforgeeks.org/problems/*"
  ]
}

export const leetCodeData = () => {
  const difficultyElement = document.querySelector(
    '[class*="text-difficulty-"]'
  )
  const url = new URL(window.location.href)
  const parts = url.pathname.split("/")
  const slug = parts[2]

  const title = document.title.replace(" - LeetCode", "").trim()
  const difficulty = difficultyElement?.textContent?.trim().toLowerCase() ?? ""
  const problemUrl = `${url.origin}/problems/${slug}/description/`
  const data = {
    title,
    difficulty,
    problemUrl,
    platform: "leetcode"
  }
  return data
}

export const gfgData = () => {
  const difficultyElement = document.querySelector(
    ".problems_header_description__t_8PB strong"
  )

  const titleElement = document.querySelector(".g-m-0")

  const url = new URL(window.location.href)

  const title = titleElement ? titleElement.textContent.trim() : null

  const difficulty = difficultyElement?.textContent?.trim().toLowerCase() ?? ""

  const problemUrl = `${url.origin}${url.pathname}`

  const data = {
    title,
    difficulty,
    problemUrl,
    platform: "gfg"
  }

  return data
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type !== "GET_PROBLEM_DATA") return

  const problemData = window.location.hostname.includes("leetcode.com")
    ? leetCodeData()
    : gfgData()

  sendResponse(problemData)
})

// console.log("bakendURL--->",backendUrl);

console.log("hello lc")
