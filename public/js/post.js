/* ==========================================================================
   SCOTT MEDIA HUB — Single blog post page
   Reads ?id= from the URL and renders that post from data.js.
   ========================================================================== */

function renderPost() {
  const id = new URLSearchParams(window.location.search).get('id');
  const post = typeof BLOG_POSTS !== 'undefined' ? BLOG_POSTS.find(p => p.id === id) : null;

  const article = document.getElementById('postArticle');
  const missing = document.getElementById('postMissing');
  if (!post) {
    article.hidden = true;
    missing.hidden = false;
    document.title = 'Post not found — Scott Media Hub';
    return;
  }

  const cat = CATEGORY_LABELS[post.category];
  const video = post.relatedVideo ? VIDEOS.find(v => v.id === post.relatedVideo) : null;
  const ytId = video ? getYouTubeId(video.url) : null;

  document.title = `${post.title} — Scott Media Hub`;
  document.getElementById('postTitle').textContent = post.title;
  document.getElementById('postDate').textContent = formatDate(post.date);

  const tag = document.getElementById('postTag');
  tag.className = `tag ${cat.tagClass}`;
  tag.textContent = `${cat.emoji} ${catLabel(post.category)}`;

  const thumb = document.getElementById('postThumb');
  thumb.replaceChildren();
  if (ytId) {
    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
    img.alt = video.title;
    img.loading = 'lazy';
    thumb.appendChild(img);
    thumb.hidden = false;
  } else {
    thumb.hidden = true;
  }

  document.getElementById('postPlaceholder').hidden = !post.placeholder;

  document.getElementById('postBody').textContent = post.body;

  const videoLink = document.getElementById('postVideoLink');
  videoLink.hidden = !video;
  if (video) videoLink.href = video.url;

  article.hidden = false;
  missing.hidden = true;
}

renderPost();
document.addEventListener('languageChanged', renderPost);
