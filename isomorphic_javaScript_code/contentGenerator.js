// contentGenerator.js

class ContentGenerator {
  constructor(title) {
    this.title = title;
  }

  generate() {
    return `<h1>${this.title}</h1><p>This is a paragraph.</p>`;
  }
}

if (typeof module !== "undefined" && module.exports) {
  // Export for Node.js
  module.exports = ContentGenerator;
} else {
  // Export for browser, adding to window object
  window.ContentGenerator = ContentGenerator;
}
