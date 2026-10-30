import axios from "axios";
import {
  ArrowDownWideNarrow,
  Bookmark,
  ExternalLink,
  FileUp,
  LoaderCircle,
  Search,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/landing/Navbar";
import "./Dashboard.css";

type Revision = {
  id: string;
  revisionCount: number;
  revisionRemark: string | null;
  revisitedAt: string;
};

type Question = {
  id: string;
  name: string;
  url: string;
  platform: string;
  difficulty: string | null;
  userDifficulty: string | null;
  remark: string | null;
  solvedRemark: string | null;
  createdAt: string;
  revisions: Revision[];
  tags: { tag: { name: string } }[];
};

type SortOrder = "newest" | "oldest" | "most-revised" | "least-revised";

const API_URL = "http://localhost:5000/api/question";

const Dashboard = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await axios.get(`${API_URL}/`, {
          withCredentials: true,
        });
        const loadedQuestions: unknown = response.data.data;
        if (!Array.isArray(loadedQuestions)) {
          throw new Error("Unexpected response while loading saved problems.");
        }
        console.log("check 1", response);
        setQuestions(
          loadedQuestions.map((question: Question) => ({
            ...question,
            revisions: Array.isArray(question.revisions)
              ? question.revisions
              : [],
            tags: Array.isArray(question.tags) ? question.tags : [],
          })),
        );
      } catch (error) {
        console.error("Could not load saved problems:", error);
        setLoadError(
          axios.isAxiosError(error)
            ? (error.response?.data?.message ?? "Could not load your problems.")
            : "Could not load your problems.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadQuestions();
  }, []);

  const availableTags = useMemo(
    () =>
      [
        ...new Set(
          questions.flatMap((question) =>
            question.tags.map(({ tag }) => tag.name),
          ),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [questions],
  );

  const visibleQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = questions.filter((question) => {
      const matchesTag =
        selectedTag === "all" ||
        question.tags.some(({ tag }) => tag.name === selectedTag);
      const searchableText = [
        question.name,
        question.platform,
        question.difficulty,
        question.userDifficulty,
        question.remark,
        question.solvedRemark,
        ...question.tags.map(({ tag }) => tag.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesTag && (!query || searchableText.includes(query));
    });

    return filtered.sort((a, b) => {
      if (sortOrder === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      if (sortOrder === "most-revised") {
        return b.revisions.length - a.revisions.length;
      }
      if (sortOrder === "least-revised") {
        return a.revisions.length - b.revisions.length;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [questions, search, selectedTag, sortOrder]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="revise-dashboard mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <section className="dashboard-hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              YOUR REVISION WORKSPACE
            </div>
            <h1>Keep the wins. Revisit the hard ones.</h1>
            <p>
              Every solved problem is progress. Keep your approach, lessons, and
              next review in one place.
            </p>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <Bookmark size={26} />
            <span />
          </div>
        </section>

        <section className="problem-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <Bookmark size={14} /> YOUR PROBLEM LIBRARY
              </div>
              <h2>Saved problems</h2>
              <p>
                Find a problem, remember your approach, and log what you learn.
              </p>
            </div>
            <button
              type="button"
              className="migration-button"
              title="Sheet import is not available yet"
              disabled
            >
              <FileUp size={16} />
              Migrate existing sheet
              <span>Coming soon</span>
            </button>
          </div>

          <div className="library-toolbar">
            <label className="search-field">
              <Search size={17} />
              <input
                type="search"
                placeholder="Search problems, notes, or tags..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="clear-search"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <label className="filter-field">
              <Tag size={15} />
              <select
                aria-label="Filter by topic tag"
                value={selectedTag}
                onChange={(event) => setSelectedTag(event.target.value)}
              >
                <option value="all">All topics</option>
                {availableTags.map((tag) => (
                  <option value={tag} key={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-field sort-field">
              <ArrowDownWideNarrow size={16} />
              <select
                aria-label="Sort problems"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
              >
                <option value="newest">Recently added</option>
                <option value="oldest">Oldest first</option>
                <option value="most-revised">Most revised</option>
                <option value="least-revised">Least revised</option>
              </select>
            </label>
          </div>

          {loadError && (
            <div className="dashboard-message error-message" role="alert">
              {loadError}
            </div>
          )}
          {isLoading ? (
            <div className="empty-library">
              <LoaderCircle className="loading-icon" size={25} />
              <p>Loading your saved problems...</p>
            </div>
          ) : !loadError && visibleQuestions.length === 0 ? (
            <div className="empty-library">
              <div className="empty-icon">
                <Bookmark size={22} />
              </div>
              <h3>
                {questions.length
                  ? "No problems match those filters"
                  : "Your next win starts here"}
              </h3>
              <p>
                {questions.length
                  ? "Try another search or choose a different topic."
                  : "Save a solved problem with the Revise DSA extension and it will appear here."}
              </p>
              {(search || selectedTag !== "all") && (
                <button
                  className="text-button"
                  onClick={() => {
                    setSearch("");
                    setSelectedTag("all");
                  }}
                  type="button"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="question-table-scroll">
              <table className="question-table">
                <thead>
                  <tr>
                    <th scope="col">Question</th>
                    <th scope="col">Difficulty</th>
                    <th scope="col">Platform</th>
                    <th scope="col">Revision count</th>
                    <th scope="col">Review</th>
                    <th scope="col">Tags</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleQuestions.map((question) => {
                    const latestRevision = [...question.revisions].sort(
                      (a, b) => b.revisionCount - a.revisionCount,
                    )[0];
                    const review =
                      latestRevision?.revisionRemark ||
                      question.solvedRemark ||
                      question.remark;

                    return (
                      <tr key={question.id}>
                        <td>
                          <a
                            className="problem-title"
                            href={question.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {question.name}
                            <ExternalLink size={14} />
                          </a>
                        </td>
                        <td>
                          {question.difficulty || question.userDifficulty ? (
                            <span
                              className={`difficulty-label ${(question.difficulty || question.userDifficulty || "").toLowerCase()}`}
                            >
                              {question.difficulty || question.userDifficulty}
                            </span>
                          ) : (
                            <span className="table-muted">—</span>
                          )}
                        </td>
                        <td>
                          <span className="platform-label">
                            {question.platform}
                          </span>
                        </td>
                        <td>
                          <span className="table-revision-count">
                            {question.revisions.length}
                          </span>
                        </td>
                        <td className="review-cell">
                          {review || <span className="table-muted">—</span>}
                        </td>
                        <td>
                          {question.tags.length > 0 ? (
                            <div className="problem-tags">
                              {question.tags.map(({ tag }) => (
                                <button
                                  className="topic-tag"
                                  key={tag.name}
                                  onClick={() => setSelectedTag(tag.name)}
                                  type="button"
                                >
                                  <Tag size={11} /> {tag.name}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="table-muted">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
