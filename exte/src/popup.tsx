import cssText from "data-text:~style.css"

import "~style.css"

import axios from "axios"
import {
  Bookmark,
  Hash,
  HelpCircle,
  Layers,
  Link2,
  Loader2,
  Sparkles,
  Tag,
  Wand2
} from "lucide-react"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

function IndexPopup() {
  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  const [problemName, setProblemName] = useState("")
  const [problemUrl, setProblemUrl] = useState("")
  const [platform, setPlatform] = useState("")
  const [difficulty, setDifficulty] = useState("")

  const [yourDifficulty, setYourDifficulty] = useState("")
  const [solveRemark, setSolveRemark] = useState("")
  const [remark, setRemark] = useState("")
  const [tags, setTags] = useState<string[]>([])

  // Revision mode
  const [revisionStatus, setRevisionStatus] = useState("")

  // --------------------------------------------------
  // LOADING / STATUS
  // --------------------------------------------------

  const [isProblemDataLoaded, setIsProblemDataLoaded] = useState(false)

  // Actual API loading state
  const [isLoading, setIsLoading] = useState(false)

  // Backend check
  const [isCheckingSolved, setIsCheckingSolved] = useState(false)

  // Whether question already exists
  const [isAlreadySolved, setIsAlreadySolved] = useState(false)
  const [questionId, setQuestionId] = useState<string | null>(null)

  // --------------------------------------------------
  // RELOAD
  // --------------------------------------------------

  const forcePageReload = () => {
    window.location.reload()
  }

  // --------------------------------------------------
  // LOAD ACTIVE TAB
  // --------------------------------------------------

  useEffect(() => {
    const loadActiveTab = async () => {
      const [activeTab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      })

      if (!activeTab) return
      if (!activeTab.id) return

      try {
        const problemData = await chrome.tabs.sendMessage(activeTab.id, {
          type: "GET_PROBLEM_DATA"
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
        console.error("Could not read problem data from the active tab", error)
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
  // CHECK IF QUESTION IS ALREADY SOLVED
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
            url: problemUrl
          },
          {
            withCredentials: true
          }
        )

        console.log("Solved response:", response.data)

        const solved = response.data.solved === true
        setIsAlreadySolved(solved)
        setQuestionId(solved ? response.data.questionId ?? null : null)

        if (response.data.solved === true) {
          console.log("Problem already solved -> Revision Mode")
        } else {
          console.log("Problem not solved -> Solved Mode")
        }
      } catch (error) {
        console.error("Could not check solved status:", error)

        // Don't accidentally show revision mode
        setIsAlreadySolved(false)
      } finally {
        setIsCheckingSolved(false)
      }
    }

    checkIfSolved()
  }, [problemName, problemUrl])

  // --------------------------------------------------
  // ADD TAG
  // --------------------------------------------------

  const handleAddTag = () => {
    const tag = window.prompt("Enter tag")

    if (!tag) return

    const trimmedTag = tag.trim()

    if (!trimmedTag) return

    // Case-insensitive duplicate check
    const alreadyExists = tags.some(
      (existingTag) => existingTag.toLowerCase() === trimmedTag.toLowerCase()
    )

    if (alreadyExists) return

    setTags((prev) => [...prev, trimmedTag])
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // VERY IMPORTANT
    // Prevent normal browser page reload
    e.preventDefault()

    // Don't submit while checking question status
    if (isCheckingSolved) {
      return
    }

    // Don't allow double submission
    if (isLoading) {
      return
    }

    // --------------------------------------------------
    // NATIVE HTML VALIDATION
    // --------------------------------------------------

    const form = e.currentTarget

    if (!form.reportValidity()) {
      return
    }

    // --------------------------------------------------
    // REVISION MODE
    // --------------------------------------------------

    if (isAlreadySolved) {
      console.log("Updating existing problem for revision...")

      setIsLoading(true)

      try {
        const data = {
          questionId,
          name: problemName,
          url: problemUrl,
          revisionRemark: revisionStatus
        }

        console.log("Revision data:", data)

        const res = await axios.post(
          "http://localhost:5000/api/question/revision",
          data,
          { withCredentials: true }
        )
        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("Revision updated successfully")

        forcePageReload()
      } catch (error) {
        console.error("Failed to update revision:", error)

        if (axios.isAxiosError(error)) {
          console.log("Backend error:", error.response?.data)

          alert(error.response?.data?.message || "Failed to update revision")
        } else {
          alert("Something went wrong")
        }
      } finally {
        setIsLoading(false)
      }

      return
    }

    // --------------------------------------------------
    // NORMAL SOLVED MODE
    // --------------------------------------------------

    setIsLoading(true)

    try {
      const data = {
        name: problemName,
        url: problemUrl,
        platform,
        difficulty,
        userDifficulty: yourDifficulty,
        remark,
        solvedRemark: solveRemark,
        tags
      }

      console.log("Sending:", data)

      const res = await axios.post("http://localhost:5000/api/question", data, {
        withCredentials: true
      })

      console.log("Added successfully:", res.data)

      forcePageReload()
    } catch (error) {
      console.error("Failed to add problem:", error)

      if (axios.isAxiosError(error)) {
        console.log("Backend error:", error.response?.data)

        alert(error.response?.data?.message || "Failed to add problem")
      } else {
        alert("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="plasmo-w-[340px] plasmo-bg-gradient-to-b plasmo-from-[#0c1017] plasmo-to-[#080a10] plasmo-px-4 plasmo-py-4">
      {/* -------------------------------------------------- */}
      {/* HEADER */}
      {/* -------------------------------------------------- */}

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

      {/* -------------------------------------------------- */}
      {/* STATUS ROW */}
      {/* -------------------------------------------------- */}

      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-mt-2.5">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5">
          <span className="plasmo-w-1.5 plasmo-h-1.5 plasmo-rounded-full plasmo-bg-cyan-400 plasmo-shadow-[0_0_5px_1px_rgba(34,211,238,0.9)]" />

          <span className="plasmo-text-cyan-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
            {isCheckingSolved
              ? "CHECKING..."
              : isLoading
                ? "SAVING..."
                : isAlreadySolved
                  ? "REVISION MODE"
                  : "READY TO SAVE"}
          </span>
        </div>

        <span className="plasmo-text-neutral-500 plasmo-text-[10px] plasmo-tracking-wider">
          {isAlreadySolved ? "REVISIT PROBLEM" : "REVISION SHEET"}
        </span>
      </div>

      {/* -------------------------------------------------- */}
      {/* PROBLEM DETAILS */}
      {/* -------------------------------------------------- */}

      <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mt-3 plasmo-mb-1.5">
        <Layers className="plasmo-w-3 plasmo-h-3 plasmo-text-cyan-400" />

        <span className="plasmo-text-cyan-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
          PROBLEM DETAILS
        </span>
      </div>

      <div className="plasmo-rounded-xl plasmo-border plasmo-border-white/10 plasmo-bg-white/[0.02] plasmo-p-2 plasmo-space-y-2">
        {/* Problem Name */}

        <input
          type="text"
          value={problemName}
          disabled={isProblemDataLoaded}
          required
          onChange={(e) => setProblemName(e.target.value)}
          placeholder="Problem name"
          className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white placeholder:plasmo-text-neutral-500 focus:plasmo-outline-none focus:plasmo-border-cyan-400/50"
        />

        {/* Problem URL */}

        <div className="plasmo-relative">
          <Link2 className="plasmo-w-3 plasmo-h-3 plasmo-text-neutral-500 plasmo-absolute plasmo-left-3 plasmo-top-1/2 plasmo--translate-y-1/2" />

          <input
            type="url"
            value={problemUrl}
            disabled={isProblemDataLoaded}
            required
            onChange={(e) => setProblemUrl(e.target.value)}
            placeholder="Problem URL"
            className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-pl-8 plasmo-pr-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white placeholder:plasmo-text-neutral-500 focus:plasmo-outline-none focus:plasmo-border-cyan-400/50"
          />
        </div>

        {/* Platform + Difficulty */}

        <div className="plasmo-flex plasmo-gap-2">
          <select
            value={platform}
            disabled={isProblemDataLoaded}
            required
            onChange={(e) => setPlatform(e.target.value)}
            className="plasmo-flex-1 plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none">
            <option value="" disabled>
              Platform
            </option>

            <option value="leetcode">LeetCode</option>
            <option value="gfg">GeeksforGeeks</option>
          </select>

          <select
            value={difficulty}
            disabled={isProblemDataLoaded}
            required
            onChange={(e) => setDifficulty(e.target.value)}
            className="plasmo-flex-1 plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none">
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
            {/* YOUR DIFFICULTY */}

            <div className="plasmo-flex-1">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mb-1">
                <Sparkles className="plasmo-w-3 plasmo-h-3 plasmo-text-orange-400" />

                <span className="plasmo-text-orange-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
                  YOUR DIFFICULTY
                </span>
              </div>

              <select
                value={yourDifficulty}
                required
                onChange={(e) => setYourDifficulty(e.target.value)}
                className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none focus:plasmo-border-orange-400/50">
                <option value="" disabled>
                  How hard?
                </option>

                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* HOW DID YOU SOLVE */}

            <div className="plasmo-flex-1">
              <div className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-mb-1">
                <Wand2 className="plasmo-w-3 plasmo-h-3 plasmo-text-purple-400" />

                <span className="plasmo-text-purple-300 plasmo-text-[10px] plasmo-font-semibold plasmo-tracking-wider">
                  HOW DID YOU SOLVE IT?
                </span>
              </div>

              <select
                value={solveRemark}
                required
                onChange={(e) => setSolveRemark(e.target.value)}
                className="plasmo-w-full plasmo-bg-[#12161f] plasmo-border plasmo-border-white/10 plasmo-rounded-lg plasmo-px-3 plasmo-py-1.5 plasmo-text-[12.5px] plasmo-text-white plasmo-appearance-none focus:plasmo-outline-none focus:plasmo-border-purple-400/50">
                <option value="" disabled>
                  Select closest option
                </option>

                <option value="instantly_solved">Instantly solved</option>

                <option value="solved_comfortably">Solved comfortably</option>

                <option value="solved_but_struggled">
                  Solved but struggled
                </option>

                <option value="brute_force_optimization_help">
                  Brute force solved, optimization needed help
                </option>

                <option value="brute_force_couldnt_optimize">
                  Brute force solved, couldn't optimize
                </option>

                <option value="solved_with_hint">Solved with a hint</option>

                <option value="solved_with_ai">
                  Solved with AI assistance
                </option>

                <option value="solved_with_tutorial">
                  Solved with tutorial/explanation
                </option>

                <option value="couldnt_solve">Couldn't solve</option>
              </select>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* WHAT DID YOU LEARN */}
          {/* -------------------------------------------------- */}

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

          {/* -------------------------------------------------- */}
          {/* TOPIC TAGS */}
          {/* -------------------------------------------------- */}

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
                className="plasmo-text-[11px] plasmo-border plasmo-border-white/15 plasmo-rounded-full plasmo-px-2 plasmo-py-0.5 plasmo-text-neutral-300">
                {tag}
              </span>
            ))}

            <button
              type="button"
              onClick={handleAddTag}
              disabled={isLoading}
              className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-text-[12px] plasmo-text-neutral-400 hover:plasmo-text-neutral-200 disabled:plasmo-opacity-50">
              <span className="plasmo-text-sm plasmo-leading-none">+</span>
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
              <div className="plasmo-mb-2">
                <p className="plasmo-text-neutral-500 plasmo-text-[9px] plasmo-uppercase plasmo-tracking-wider">
                  What happened this time?
                </p>

                <p className="plasmo-text-[10px] plasmo-text-white/35 plasmo-mt-0.5">
                  Affects revision priority
                </p>
              </div>

              <select
                value={revisionStatus}
                required
                onChange={(e) => setRevisionStatus(e.target.value)}
                className="
                  plasmo-w-full
                  plasmo-h-10
                  plasmo-bg-[#12161f]
                  plasmo-border
                  plasmo-border-white/10
                  plasmo-rounded-xl
                  plasmo-px-3
                  plasmo-text-[12px]
                  plasmo-text-white
                  plasmo-appearance-none
                  focus:plasmo-outline-none
                  focus:plasmo-border-purple-400/50
                  plasmo-cursor-pointer
                ">
                <option value="" disabled>
                  Select what happened
                </option>

                <option value="solved_instantly">Solved instantly</option>

                <option value="solved_comfortably">Solved comfortably</option>

                <option value="solved_with_struggle">
                  Solved with some struggle
                </option>

                <option value="needed_hint">Needed a hint</option>

                <option value="needed_review">
                  Needed to review the approach
                </option>

                <option value="needed_tutorial">
                  Needed a tutorial/explanation
                </option>

                <option value="needed_ai">Needed AI assistance</option>

                <option value="couldnt_solve">Couldn't solve</option>

                <option value="forgot_approach">
                  Forgot the approach completely
                </option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* SUBMIT */}
      {/* -------------------------------------------------- */}

      <button
        type="submit"
        disabled={isCheckingSolved || isLoading}
        className="
          plasmo-w-full
          plasmo-flex
          plasmo-items-center
          plasmo-justify-center
          plasmo-gap-2
          plasmo-mt-3.5
          plasmo-py-2
          plasmo-rounded-full
          plasmo-font-semibold
          plasmo-text-[13px]
          plasmo-text-[#05070d]
          plasmo-bg-gradient-to-r
          plasmo-from-cyan-400
          plasmo-to-cyan-300
          disabled:plasmo-opacity-50
          disabled:plasmo-cursor-not-allowed
        ">
        {isCheckingSolved ? (
          <>
            <Loader2 className="plasmo-w-3.5 plasmo-h-3.5 plasmo-animate-spin" />
            Checking...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="plasmo-w-3.5 plasmo-h-3.5 plasmo-animate-spin" />
            {isAlreadySolved ? "Updating..." : "Adding..."}
          </>
        ) : (
          <>
            <Bookmark className="plasmo-w-3.5 plasmo-h-3.5" />

            {isAlreadySolved ? "Update Revision" : "Add to ReviseDsa"}
          </>
        )}
      </button>

      {/* -------------------------------------------------- */}
      {/* FOOTER */}
      {/* -------------------------------------------------- */}

      <p className="plasmo-text-center plasmo-text-neutral-500 plasmo-text-[9.5px] plasmo-mt-2">
        You can edit this entry anytime from your revision sheet.
      </p>
    </form>
  )
}

export default IndexPopup
