const responses = {
  dsa: [
    "Start with **Arrays & Hashing** — they cover 35% of interview questions. Solve 15 easy problems before touching medium ones. LeetCode's NeetCode 150 list is the gold standard.",
    "For **Binary Trees**, master these 5 patterns: Level Order (BFS), Path Sum (DFS), LCA, Serialize/Deserialize, and Morris Traversal. These cover 80% of tree problems you'll see.",
    "**Dynamic Programming** tip: always identify if it's 1D or 2D DP first. Draw the recurrence relation before coding. Start with Fibonacci → Climbing Stairs → Coin Change → Longest Common Subsequence.",
    "**Graph problems** in interviews almost always use BFS/DFS + visited set. Learn topological sort (course schedule), union-find (redundant connection), and Dijkstra (network delay). That's 90% of graph questions.",
  ],
  roadmap: [
    "For **Frontend**, the order is: HTML/CSS → JavaScript → TypeScript → React → Next.js → Testing → System Design. Don't skip TypeScript — it's non-negotiable in 2024 interviews.",
    "**Backend roadmap**: Node.js → Express → Databases (SQL + MongoDB) → REST APIs → Auth (JWT/OAuth) → Caching (Redis) → Message Queues → Docker. Build 2 real APIs before System Design.",
    "**System Design** is best studied after you have 2+ real projects. Read: Designing Data-Intensive Applications (Kleppmann), then study Grokking the System Design Interview. Do 1 mock SD per week.",
    "Your learning path should follow: Theory (20%) → Hands-on coding (60%) → Building projects (20%). Most students get this ratio backwards and wonder why they can't interview well.",
  ],
  placement: [
    "**6-month placement formula**: Month 1-2: DSA fundamentals (150 problems). Month 3: Projects + GitHub. Month 4: DSA medium/hard. Month 5: System Design + Core CS. Month 6: Mock interviews daily.",
    "For campus placements, the top 3 things that matter: 1) DSA (LeetCode 150+), 2) 2 strong projects with live demo links, 3) CGPA above 7.5 for shortlisting. CS fundamentals are asked in tech rounds.",
    "**Interview prep checklist**: OS (processes, threads, memory), DBMS (normalization, indexes, queries), CN (TCP/IP, HTTP, DNS), OOPs (SOLID, design patterns). These appear in 70% of tech interviews.",
  ],
  study: [
    "The **Feynman technique** works best for CS: learn a concept → explain it to yourself as if teaching → identify gaps → re-learn the gaps. Repeat until you can explain it in simple terms.",
    "**Spaced repetition** beats cramming. Review DSA patterns: Day 1 → Day 3 → Day 7 → Day 21. Use your Notes module to track concepts that need revision.",
    "Protect your **2-hour deep work block** — no phone, no social media. Studies show most developers do their best thinking in 90-minute uninterrupted sessions. Use the Deep Work timer in Levelify.",
  ],
  general: [
    "Consistency is your biggest competitive advantage. **2 focused hours daily** beats 10 scattered hours on weekends. Protect your streak — it's compounding.",
    "Document everything on **GitHub** with good READMEs. Recruiters literally scroll your contribution graph. Even small daily commits add up to an impressive profile over 6 months.",
    "Join **competitive programming** contests: LeetCode Weekly, Codeforces Div. 2, AtCoder Beginner. They force you to solve under pressure — exactly what interviews simulate.",
    "Build projects that **solve real problems**, not tutorial clones. A working expense tracker you built from scratch impresses more than a cloned Netflix UI. Add features incrementally.",
  ],
}

const suggestions = [
  { type: 'dsa',   icon: '💻', text: "You haven't logged any DSA problems today. Try solving 2 easy problems to keep your streak alive!" },
  { type: 'study', icon: '📚', text: "Peak performance tip: schedule your hardest topics between 9-11 AM when cognitive load is highest." },
  { type: 'focus', icon: '🎯', text: "Start a 25-minute Focus session. Research shows the first 25 minutes of deep work breaks through cognitive resistance." },
  { type: 'note',  icon: '📝', text: "Add a quick revision note after each DSA session. Notes you write in your own words retain 70% better." },
]

const aiService = {
  sendMessage: async (message) => {
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600))
    const msg = message.toLowerCase()
    let pool = responses.general
    if (msg.includes('dsa') || msg.includes('data structure') || msg.includes('algorithm') || msg.includes('leetcode') || msg.includes('array') || msg.includes('tree') || msg.includes('graph') || msg.includes('dp')) pool = responses.dsa
    else if (msg.includes('roadmap') || msg.includes('learn') || msg.includes('path') || msg.includes('frontend') || msg.includes('backend') || msg.includes('system design')) pool = responses.roadmap
    else if (msg.includes('placement') || msg.includes('interview') || msg.includes('job') || msg.includes('campus') || msg.includes('company')) pool = responses.placement
    else if (msg.includes('study') || msg.includes('focus') || msg.includes('productivity') || msg.includes('tips')) pool = responses.study
    return { reply: pool[Math.floor(Math.random() * pool.length)] }
  },
  getSuggestions: async () => {
    await new Promise(r => setTimeout(r, 300))
    return suggestions.sort(() => Math.random() - 0.5).slice(0, 3)
  },
}
export default aiService
