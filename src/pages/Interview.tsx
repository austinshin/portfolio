import { useState } from 'react'

// AlgoMonster "Monster 50" — https://algo.monster/practice
interface Question {
  name: string
  slug: string
}

interface Section {
  title: string
  questions: Question[]
}

const SECTIONS: Section[] = [
  {
    title: 'Arrays, Sorting & Hashing',
    questions: [
      { name: 'Two Sum', slug: 'two-sum' },
      { name: 'Contains Duplicate', slug: 'contains-duplicate' },
      { name: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock' },
      { name: 'Group Anagrams', slug: 'group-anagrams' },
      { name: 'Top K Frequent Elements', slug: 'top-k-frequent-elements' },
      { name: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence' },
    ],
  },
  {
    title: 'Two Pointers',
    questions: [
      { name: 'Valid Palindrome', slug: 'valid-palindrome' },
      { name: 'Container With Most Water', slug: 'container-with-most-water' },
      { name: '3Sum', slug: 'three-sum' },
      { name: 'Trapping Rain Water', slug: 'trapping-rain-water' },
    ],
  },
  {
    title: 'Sliding Window',
    questions: [
      {
        name: 'Longest Substring Without Repeating Characters',
        slug: 'longest-substring-without-repeating-characters',
      },
      {
        name: 'Longest Repeating Character Replacement',
        slug: 'longest-repeating-character-replacement',
      },
      { name: 'Minimum Window Substring', slug: 'minimum-window-substring' },
    ],
  },
  {
    title: 'Stack',
    questions: [
      { name: 'Valid Parentheses', slug: 'valid-parentheses' },
      { name: 'Min Stack', slug: 'min-stack' },
      { name: 'Daily Temperatures', slug: 'daily-temperatures' },
    ],
  },
  {
    title: 'Binary Search',
    questions: [
      { name: 'Binary Search', slug: 'binary-search' },
      { name: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array' },
      { name: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array' },
    ],
  },
  {
    title: 'Linked List',
    questions: [
      { name: 'Reverse Linked List', slug: 'reverse-linked-list' },
      { name: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists' },
      { name: 'Linked List Cycle', slug: 'linked-list-cycle' },
      { name: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list' },
    ],
  },
  {
    title: 'Intervals',
    questions: [
      { name: 'Merge Intervals', slug: 'merge-intervals' },
      { name: 'Insert Interval', slug: 'insert-interval' },
      { name: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals' },
    ],
  },
  {
    title: 'Trees',
    questions: [
      { name: 'Same Tree', slug: 'same-tree' },
      { name: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree' },
      { name: 'Invert Binary Tree', slug: 'invert-binary-tree' },
      { name: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal' },
      { name: 'Validate Binary Search Tree', slug: 'valid-bst' },
      { name: 'Kth Smallest Element in a BST', slug: 'kth-smallest-number-in-bst' },
      { name: 'Lowest Common Ancestor of a Binary Tree', slug: 'lowest-common-ancestor' },
    ],
  },
  {
    title: 'Graphs',
    questions: [
      { name: 'Number of Islands', slug: 'number-of-islands' },
      { name: 'Clone Graph', slug: 'clone-graph' },
      { name: 'Graph Valid Tree', slug: 'graph-valid-tree' },
      { name: 'Course Schedule', slug: 'course-schedule' },
      { name: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow' },
      { name: 'Word Ladder', slug: 'word-ladder' },
    ],
  },
  {
    title: 'Heap / Priority Queue',
    questions: [
      { name: 'K Closest Points to Origin', slug: 'k-closest-points' },
      { name: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists' },
      { name: 'Find Median from Data Stream', slug: 'find-median-from-data-stream' },
    ],
  },
  {
    title: 'Backtracking',
    questions: [
      { name: 'Combination Sum', slug: 'combination-sum' },
      { name: 'Word Search', slug: 'word-search' },
      { name: 'N-Queens', slug: 'n-queens' },
    ],
  },
  {
    title: 'Dynamic Programming',
    questions: [
      { name: 'Climbing Stairs', slug: 'climbing-stairs' },
      { name: 'House Robber', slug: 'house-robber' },
      { name: 'Coin Change', slug: 'coin-change' },
      { name: 'Word Break', slug: 'word-break' },
      { name: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence' },
    ],
  },
]

const TOTAL = SECTIONS.reduce((n, s) => n + s.questions.length, 0)

const STORAGE_KEY = 'monster50-progress'

// slug -> local date completed ("YYYY-MM-DD")
type Progress = Record<string, string>

const loadProgress = (): Progress => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

const todayLocal = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const Interview = () => {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  const toggle = (slug: string) => {
    const next = { ...progress }
    if (next[slug]) {
      delete next[slug]
    } else {
      next[slug] = todayLocal()
    }
    setProgress(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // private browsing — progress just won't persist
    }
  }

  const doneCount = Object.keys(progress).length

  return (
    <>
      <h1>Interview Prep</h1>
      <p className="muted">
        The{' '}
        <a href="https://algo.monster/practice" target="_blank" rel="noopener noreferrer">
          Monster 50
        </a>{' '}
        — 50 high-frequency interview questions. Progress is saved in this browser.
      </p>

      <div className="check-progress">
        <span className="check-progress-count">
          {doneCount} / {TOTAL} completed
        </span>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${(doneCount / TOTAL) * 100}%` }} />
        </div>
      </div>

      {SECTIONS.map((section) => {
        const sectionDone = section.questions.filter((q) => progress[q.slug]).length
        return (
          <section key={section.title}>
            <h3>
              {section.title}{' '}
              <span className="check-section-count">
                {sectionDone}/{section.questions.length}
              </span>
            </h3>
            <ul className="check-list">
              {section.questions.map((q) => {
                const date = progress[q.slug]
                return (
                  <li key={q.slug} className={date ? 'done' : undefined}>
                    <input
                      type="checkbox"
                      checked={!!date}
                      onChange={() => toggle(q.slug)}
                      aria-label={`Mark "${q.name}" as done`}
                    />
                    <a
                      className="check-name"
                      href={`https://algo.monster/p/${q.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {q.name}
                    </a>
                    {date && <span className="check-date">{formatDate(date)}</span>}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}

export default Interview
