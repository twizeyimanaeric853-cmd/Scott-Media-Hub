/* ==========================================================================
   SCOTT MEDIA HUB — Shared Content Data
   Edit this file to add/update videos and blog posts. Every page reads
   from here, so you only ever need to update content in one place.
   ========================================================================== */

// Helper: pull a YouTube video ID out of any youtu.be / youtube.com link
function getYouTubeId(url) {
  const match = url.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const CATEGORY_LABELS = {
  comedy: { label: "Comedy", tagClass: "tag-comedy", emoji: "😂" },
  drama: { label: "Drama / Gossip", tagClass: "tag-drama", emoji: "🔥" },
  music: { label: "Music", tagClass: "tag-music", emoji: "🎵" },
  relationships: { label: "Relationships", tagClass: "tag-relationships", emoji: "💔" }
};

// ---- VIDEOS (real content) -------------------------------------------
const VIDEOS = [
  {
    id: "v1",
    title: "Dore ibyo katabilora bamukoreye nyuma yo gusambanya umukobwa wa Yves",
    url: "https://youtu.be/NIce9qx_1iU",
    category: "drama",
    description: "The fallout nobody saw coming — find out what happened next.",
    date: "2026-06-01"
  },
  {
    id: "v2",
    title: "Dore noneho gifaru ibyaboneye kwa Chania",
    url: "https://youtu.be/-gQAQ40erRk",
    category: "drama",
    description: "Things got real at Chania's place. Watch how it unfolded.",
    date: "2026-06-05"
  },
  {
    id: "v3",
    title: "Gukundana ni cyirara",
    url: "https://youtu.be/2ohNpdjA_mE",
    category: "relationships",
    description: "A look at love, loyalty, and everything in between.",
    date: "2026-06-10"
  },
  {
    id: "v4",
    title: "Umusambanyi birangiye yimwe 🙊😂",
    url: "https://youtu.be/cM2DrGjYAfA",
    category: "comedy",
    description: "It ended exactly how you'd expect — and it's hilarious.",
    date: "2026-06-14"
  },
  {
    id: "v5",
    title: "Birangiye Scott yisubije umukunzi we",
    url: "https://youtu.be/SUAqu-_xhJ0",
    category: "relationships",
    description: "Scott takes their ex back — here's the full story.",
    date: "2026-06-18"
  }
];

// ---- BLOG POSTS (placeholders — replace with real write-ups) ----------
// To add a real post, fill in title/excerpt/body and set placeholder: false.
const BLOG_POSTS = [
  {
    id: "b0",
    title: "Welcome to Scott Media Hub",
    category: "comedy",
    excerpt: "Entertainment, comedy, stories, music, and real conversations — here's what Scott Media Hub is all about.",
    body: "Welcome to Scott Media Hub — your destination for exciting entertainment, creative storytelling, comedy videos, blogs, music updates, and relationship conversations that connect with everyday life. We believe content should do more than fill time — it should make people laugh, think, and enjoy every moment online. Whether you're here for comedy, trending topics, music, or relationship discussions, you're in the right place. Explore. Enjoy. Stay connected.",
    relatedVideo: null,
    date: "2026-06-20",
    placeholder: false
  },
  {
    id: "b1",
    title: "Katabilora's Reckoning: The Fallout After Crossing Yves",
    category: "drama",
    excerpt: "What happens when a serious relationship mistake catches up with you? Katabilora finds out the hard way.",
    body: "Some mistakes don't stay quiet for long. In this story, Katabilora gets caught up in a serious relationship misstep involving Yves' girlfriend — and once it comes to light, there's no smoothing it over. What follows is a wave of conflict, confrontation, and consequences that nobody walks away from clean. It's the kind of story that spreads fast because everyone's seen a version of it before: trust broken, secrets exposed, and a reckoning that was always coming. Watch the full video to see exactly how it plays out.",
    relatedVideo: "v1",
    date: "2026-06-01",
    placeholder: false
  },
  {
    id: "b2",
    title: "Chaos at Chania's: Gifaru's Unexpected Trouble",
    category: "drama",
    excerpt: "Gifaru walks into more than he bargained for at Chania's place — and the reactions don't disappoint.",
    body: "Nobody expects the night to go sideways, but that's exactly what happens to Gifaru in this one. A visit to Chania's place turns into a moment of shock and unexpected trouble, and the people around him don't hold back their reactions. It's dramatic, it's tense, and it's the kind of scene that gets people talking the next day. If you've been following the story, this is the chapter everyone's been waiting to see play out. Catch the full clip for all the details.",
    relatedVideo: "v2",
    date: "2026-06-05",
    placeholder: false
  },
  {
    id: "b3",
    title: "Gukundana Ni Cyirara: When Love Gets Complicated",
    category: "relationships",
    excerpt: "Love isn't always simple. This story digs into the misunderstandings and emotional weight that come with it.",
    body: "\"Gukundana ni cyirara\" — love is a gamble, and this story leans all the way into that idea. It's a relationship tale built around misunderstanding, emotional strain, and the kind of betrayal that makes you question everything you thought you knew about a person. There's no easy resolution here, just an honest look at how complicated love can get when trust starts to crack. If you've ever felt torn between your heart and your head, this one will hit close to home. Watch the full story to see how it unfolds.",
    relatedVideo: "v3",
    date: "2026-06-10",
    placeholder: false
  },
  {
    id: "b4",
    title: "Umusambanyi Birangiye Yimwe: Caught, Cornered, and Comedy Gold",
    category: "comedy",
    excerpt: "Cheating catches up with him in the funniest way possible — this one's a rollercoaster from start to finish.",
    body: "Some endings write themselves. In this one, a man caught up in cheating and questionable behavior finally faces the music — and gets rejected and called out in a way that's equal parts dramatic and hilarious. It's the kind of story where you can't help but laugh even while shaking your head, because the ending feels almost poetic. If you need a clip that mixes drama with genuine comedy, this is it. Watch the full video for the moment everyone's been quoting.",
    relatedVideo: "v4",
    date: "2026-06-14",
    placeholder: false
  },
  {
    id: "b5",
    title: "Second Chances: A Story of Getting Back Together",
    category: "relationships",
    excerpt: "Not every breakup is the end. Sometimes the story comes full circle — here's a look at one reconciliation.",
    body: "Breakups don't always mean goodbye for good. This story follows a couple working their way back to each other after a rough patch — the kind of conflict that makes you question whether it's really over, followed by the moment things start to mend. It's an emotional ride, ending in reconciliation rather than heartbreak, which makes a nice change of pace from the usual drama. Relationships are messy, but sometimes they're worth fighting for. Watch the full story to see how it comes together.",
    relatedVideo: "v5",
    date: "2026-06-18",
    placeholder: false
  }
];

// ---- SOCIAL LINKS -------------------------------------------------------
// Set a link to null to hide that icon from the site until you have one.
const SOCIAL_LINKS = {
  whatsapp: { url: "https://wa.me/250798529877", label: "WhatsApp" },
  facebook: { url: "https://www.facebook.com/eric.scott.twizeyimana.7", label: "Facebook" },
  instagram: { url: "https://www.instagram.com/t_eric03", label: "Instagram" },
  tiktok: { url: "https://vm.tiktok.com/ZS9jwoEX4vdHh-WO8z7/", label: "TikTok" },
  telegram: { url: "https://t.me/ericscott_3", label: "Telegram" },
  youtube: { url: "https://www.youtube.com/@COMERWATV", label: "YouTube" }
};

// ---- TICKER headlines (auto-built from latest videos + posts) ---------
function buildTickerHeadlines() {
  const items = [...VIDEOS]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map(v => `${CATEGORY_LABELS[v.category].emoji} ${v.title}`);
  return items;
}
