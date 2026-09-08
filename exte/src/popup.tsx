import cssText from "data-text:~style.css"
import "~style.css"

import axios from "axios"
import {
  Bookmark,
  Hash,
  HelpCircle,
  Layers,
  Link2,
  Sparkles,
  Tag,
  Wand2,
} from "lucide-react"
import { useEffect, useState } from "react"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function IndexPopup() {
  const [problemName, setProblemName] = useState("")
  const [problemUrl, setProblemUrl] = useState("")
  const [platform, setPlatform] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [yourLevel, setYourLevel] = useState("")
  const [solveMode, setSolveMode] = useState("")
  const [remark, setRemark] = useState("")
  const [tags, setTags] = useState<string[]>([])

  const [isProblemDataLoaded, setIsProblemDataLoaded] = useState(false)

  // NEW
  // true = problem already exists in DB
  // false = problem has not been saved yet
  const [isAlreadySolved, setIsAlreadySolved] = useState(false)

  // Used to show loading while checking backend
  const [isCheckingSolved, setIsCheckingSolved] = useState(false)

  // --------------------------------------------------
  // 1. Get problem information from current tab
  // --------------------------------------------------

  useEffect(() => {
    const loadActiveTab = async () => {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      })

      if (!activeTab) return

      if (!activeTab.id) return

      try {
        const problemData = await chrome.tabs.sendMessage(activeTab.id, {
          type: "GET_PROBLEM_DATA",
        })

        if (problemData) {
          setProblemName(problemData.title ?? "")
          setProblemUrl(problemData.problemUrl ?? activeTab.url ?? "")
          setPlatform(problemData.platform ?? "")
          setDifficulty(problemData.difficulty ?? "")
          setIsProblemDataLoaded(true)

          return
        }
      } catch (error) {
        console.error(
          "Could not read problem data from the active tab",
          error
        )
      }

      // Fallback
      setProblemName(activeTab.title ?? "")
      setProblemUrl(activeTab.url ?? "")
    }

    loadActiveTab().catch((error) => {
      console.error("Could not load the active tab", error)
    })
  }, [])

  // --------------------------------------------------
  // 2. Check if this problem is already solved
  // --------------------------------------------------

  useEffect(() => {
    if (!problemName || !problemUrl) return

    const checkIfSolved = async () => {
      console.log("Checking whether problem is already solved...")

      setIsCheckingSolved(true)

      try {
        const response = await axios.post(
          "http://localhost:5000/api/question/solved",
          {
            title: problemName,
            url: problemUrl,
          },
          {
            withCredentials: true,
          }
        )

        console.log("Solved response:", response.data)

        // This is the important part
        setIsAlreadySolved(response.data.solved === true)

        if (response.data.solved === true) {
          console.log("Problem already solved -> Revision Mode")
        } else {
          console.log("Problem not solved -> Solved Mode")
        }
      } catch (error) {
        console.error("Could not check solved status:", error)

        // If request fails, don't accidentally show Revision Mode
        setIsAlreadySolved(false)
      } finally {
        setIsCheckingSolved(false)
      }
    }

    checkIfSolved()
  }, [problemName, problemUrl])

  // --------------------------------------------------
  // 3. Add tag
  // --------------------------------------------------

  const handleAddTag = () => {
    const tag = window.prompt("Enter tag")

    if (!tag) return

    const trimmedTag = tag.trim()

    if (!trimmedTag) return

    if (tags.includes(trimmedTag)) return

    setTags((prev) => [...prev, trimmedTag])
  }

  // --------------------------------------------------
  // 4. Submit
  // --------------------------------------------------

  const handleSubmit = () => {
    if (isAlreadySolved) {
      console.log("Updating existing problem for revision...")

      // TODO:
      // Call your update/revision backend API here
      //
      // Example concept:
      //
      // PUT /api/question/revision
      //
      // {
      //   title: problemName,
      //   url: problemUrl,
      //   remark,
      //   tags
      // }

      return
    }

    console.log("Saving new solved problem...")

    // TODO:
    // Call your create question API here
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="plasmo-w-[340px] plasmo-bg-gradient-to-b plasmo-from-[#0c1017] plasmo-to-[#080a10] plasmo-px-4 plasmo-py-4">
      {/* Header */}
      <div className="plasmo-flex plasmo-items-start plasmo-justify-between">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2.5">
          <div className="plasmo-relative plasmo-w-8 plasmo-h-8 plasmo-rounded-xl plasmo-bg-cyan-400/10 plasmo-border plasmo-border-cyan-400/30 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-shadow-[0_0_14px_-4px_rgba(34,211,238,0.6)]">
            <Bookmark className="plasmo-w-4 plasmo-h-4 plasmo-text-cyan-300" />

            <span className="plasmo-absolute -plasmo-top-0.5 -plasmo-right-0.5 plasmo-w-2 plasmo-h-2 plasmo-bg-cyan-400 plasmo-rounded-full plasmo-shadow-[0_0_5px_1px_rgba(34,211,238,0.9)]" />
          </div>

          <div>
            <h1 className="plasmo-text-white plasmo-font-semibold plasmo-text-[14px] plasmo-leading-tight">
              Revise DSA
            </h1>

            <p className="plasmo-text-neutral-400 plasmo-text-[10.5px] plasmo-leading-tight">
              Capture once. Master forever.
            </p>
          </div>
        </div>

        <HelpCircle className="plasmo-w-3.5 plasmo-h-3.5 plasmo-text-neutral-500 plasmo-mt-1" />
      </div>

      {/* Status row */}
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-mt-2.5">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
          <span className="plasmo-w-1.5 plasmo-h-1.5 plasmo-rounded-full plasmo-bg-cyan-400 plasmo-shadow-[0_0_5px_1px_rgba(34,211,238,0.9)]" />

          <span className="plasmo-text-cyan-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
            {isCheckingSolved
              ? "CHECKING..."
              : isAlreadySolved
                ? "REVISION MODE"
                : "READY TO SAVE"}
          </span>
        </div>

        <span className="plasmo-text-neutral-500 plasmo-text-[10px] plasmo-tracking-wider">
          {isAlreadySolved ? "REVISIT PROBLEM" : "REVISION SHEET"}
        </span>
      </div>

      {/* Problem details */}
      <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mt-3 plasmo-mb-1.5">
        <Layers className="plasmo-w-3 plasmo-h-3 plasmo-text-cyan-400" />

        <span className="plasmo-text-cyan-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
          PROBLEM DETAILS
        </span>
      </div>

      <div className="plasmo-rounded-xl plasmo-border plasmo-border-white/10 plasmo-bg-white/[0.02] plasmo-p-2 plasmo-space-y-2">
        <input
          type="text"
          value={problemName}
          disabled={isProblemDataLoaded}
          onChange={(e) => setProblemName(e.target.value)}
          placeholder="Problem name"
          className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white placeholder:plasmo-text-neutral-500 focus:plasmo-outline-none focus:plasmo-border-cyan-400/50"
        />

        <div className="plasmo-relative">
          <Link2 className="plasmo-w-3 plasmo-h-3 plasmo-text-neutral-500 plasmo-absolute plasmo-left-3 plasmo-top-1/2 plasmo--translate-y-1/2" />

          <input
            type="text"
            value={problemUrl}
            disabled={isProblemDataLoaded}
            onChange={(e) => setProblemUrl(e.target.value)}
            placeholder="Problem URL"
            className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-pl-8 plasmo-pr-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white placeholder:plasmo-text-neutral-500 focus:plasmo-outline-none focus:plasmo-border-cyan-400/50"
          />
        </div>

        <div className="plasmo-flex plasmo-gap-2">
          <select
            value={platform}
            disabled={isProblemDataLoaded}
            onChange={(e) => setPlatform(e.target.value)}
            className="plasmo-flex-1 plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none"
          >
            <option value="" disabled>
              Platform
            </option>

            <option value="leetcode">LeetCode</option>
            <option value="gfg">GeeksforGeeks</option>
          </select>

          <select
            value={difficulty}
            disabled={isProblemDataLoaded}
            onChange={(e) => setDifficulty(e.target.value)}
            className="plasmo-flex-1 plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none"
          >
            <option value="" disabled>
              Difficulty
            </option>

            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* NORMAL SOLVED MODE */}
      {/* -------------------------------------------------- */}

      {!isAlreadySolved && (
        <>
          {/* Your level / solve mode */}
          <div className="plasmo-flex plasmo-gap-2 plasmo-mt-3">
            <div className="plasmo-flex-1">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mb-1">
                <Sparkles className="plasmo-w-3 plasmo-h-3 plasmo-text-orange-400" />

                <span className="plasmo-text-orange-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
                  YOUR LEVEL
                </span>
              </div>

              <select
                value={yourLevel}
                onChange={(e) => setYourLevel(e.target.value)}
                className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none"
              >
                <option value="" disabled>
                  How hard?
                </option>

                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="plasmo-flex-1">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mb-1">
                <Wand2 className="plasmo-w-3 plasmo-h-3 plasmo-text-purple-400" />

                <span className="plasmo-text-purple-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
                  SOLVE MODE
                </span>
              </div>

              <select
                value={solveMode}
                onChange={(e) => setSolveMode(e.target.value)}
                className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none"
              >
                <option value="" disabled>
                  Select one
                </option>

                <option value="own">Solved on my own</option>
                <option value="hint">Solved with a hint</option>
                <option value="solution">
                  Looked at the solution
                </option>
              </select>
            </div>
          </div>

          {/* What did you learn */}
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mt-3 plasmo-mb-1.5">
            <Hash className="plasmo-w-3 plasmo-h-3 plasmo-text-emerald-400" />

            <span className="plasmo-text-emerald-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
              WHAT DID YOU LEARN?
            </span>
          </div>

          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Leave a useful note for your future self..."
            rows={2}
            className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-xl plasmo-px-3 plasmo-py-2 plasmo-text-[12.5px] plasmo-text-white placeholder:plasmo-text-neutral-500 focus:plasmo-outline-none focus:plasmo-border-emerald-400/40 plasmo-resize-none"
          />

          {/* Topic tags */}
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mt-3 plasmo-mb-1.5">
            <Tag className="plasmo-w-3 plasmo-h-3 plasmo-text-pink-400" />

            <span className="plasmo-text-pink-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
              TOPIC TAGS
            </span>
          </div>

          <div className="plasmo-flex plasmo-flex-wrap plasmo-gap-1.5 plasmo-rounded-xl plasmo-border plasmo-border-dashed plasmo-border-white/15 plasmo-bg-white/[0.02] plasmo-px-3 plasmo-py-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="plasmo-text-[11px] plasmo-border plasmo-border-white/15 plasmo-rounded-full plasmo-px-2 plasmo-py-0.5 plasmo-text-neutral-300"
              >
                {tag}
              </span>
            ))}

            <button
              type="button"
              onClick={handleAddTag}
              className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-text-[12px] plasmo-text-neutral-400 hover:plasmo-text-neutral-200"
            >
              <span className="plasmo-text-sm plasmo-leading-none">
                +
              </span>

              Add tag
            </button>
          </div>
        </>
      )}

      {/* -------------------------------------------------- */}
      {/* REVISION MODE */}
      {/* -------------------------------------------------- */}

      {isAlreadySolved && (
        <div className="plasmo-mt-3">
          <div className="plasmo-rounded-xl plasmo-border plasmo-border-purple-400/20 plasmo-bg-purple-400/[0.04] plasmo-p-3">
            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
              <Wand2 className="plasmo-w-4 plasmo-h-4 plasmo-text-purple-400" />

              <div>
                <p className="plasmo-text-purple-300 plasmo-text-[11px] plasmo-font-semibold plasmo-tracking-wider">
                  REVISION MODE
                </p>

                <p className="plasmo-text-neutral-400 plasmo-text-[10px] plasmo-mt-0.5">
                  You have already solved this problem.
                </p>
              </div>
            </div>

            <div className="plasmo-mt-3">
              <p className="plasmo-text-neutral-500 plasmo-text-[9px] plasmo-uppercase plasmo-tracking-wider">
                What did you learn this time?
              </p>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add a new revision note..."
                rows={3}
                className="plasmo-w-full plasmo-mt-1.5 plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-text-[12px] plasmo-text-white placeholder:plasmo-text-neutral-500 focus:plasmo-outline-none focus:plasmo-border-purple-400/50 plasmo-resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isCheckingSolved}
        className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-mt-3.5 plasmo-py-2 plasmo-rounded-full plasmo-font-semibold plasmo-text-[13px] plasmo-text-[#05070d] plasmo-bg-gradient-to-r plasmo-from-cyan-400 plasmo-to-cyan-300 plasmo-shadow-[0_0_22px_-6px_rgba(34,211,238,0.7)] hover:plasmo-opacity-90 plasmo-transition-opacity disabled:plasmo-opacity-50"
      >
        <Bookmark className="plasmo-w-3.5 plasmo-h-3.5" />

        {isCheckingSolved
          ? "Checking..."
          : isAlreadySolved
            ? "Update Revision"
            : "Add to ReviseDsa"}
      </button>

      <p className="plasmo-text-center plasmo-text-neutral-500 plasmo-text-[9.5px] plasmo-mt-2">
        You can edit this entry anytime from your revision sheet.
      </p>
    </div>
  )
}

export default IndexPopup