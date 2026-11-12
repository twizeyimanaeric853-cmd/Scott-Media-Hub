import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (name) => fileURLToPath(new URL(name, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: page('./index.html'),
        about: page('./about.html'),
        blog: page('./blog.html'),
        videos: page('./videos.html'),
        categories: page('./categories.html'),
        'submit-tip': page('./submit-tip.html'),
        contact: page('./contact.html'),
        privacy: page('./privacy.html'),
        404: page('./404.html'),
      },
    },
  },
});
