import type { UIStrings } from "../types";

/** 英文 */
const en: UIStrings = {
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    about: "About",
    archives: "Archives",
    search: "Search",
  },
  post: {
    publishedAt: "Published on {{date}}",
    updatedAt: "Updated on {{date}}",
    sharePostIntro: "Share this post:",
    sharePostOn: "Share on {{name}}",
    sharePostViaEmail: "Share via email",
    tagLabel: "Tags:",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit on GitHub",
    previousPost: "Previous post",
    nextPost: "Next post",
    tableOfContents: "Table of contents",
    copyCode: "Copy",
    copied: "Copied",
    zoomImage: "Zoom image",
    imagePreview: "Image preview: ",
    closeImagePreview: "Close image preview",
  },
  pagination: {
    prev: "Previous",
    next: "Next",
    page: "Page {{current}} of {{total}}",
  },
  home: {
    socialLinks: "Social links",
    featured: "Featured",
    recentPosts: "Recent posts",
    allPosts: "View all posts",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    tagTitle: "#{{tag}}",
    tagDesc: "All posts tagged with {{tag}}",
    tagsTitle: "All tags",
    tagsDesc: "Browse all post tags",
    postsTitle: "All posts",
    postsDesc: "Browse all posts",
    archivesTitle: "Archives",
    archivesDesc: "Browse all posts by timeline",
    searchTitle: "Search",
    searchDesc: "Search posts on this site",
    aboutTitle: "About",
    aboutDesc: "About this site",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
    languageSwitcher: "Switch language",
  },
  notFound: {
    title: "Page not found",
    message: "The page you are looking for does not exist or has been moved.",
    goHome: "Go home",
  },
};

export default en;
