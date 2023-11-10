import { obj } from "./obj";

export class oExample extends obj {
  moustImport = `<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.0.1/mustache.min.js"></script>`;

  createPage() {
    const data = {
      pageTitle: "Example home page",
      head: this.moustImport,
      content: "hello",
    };
    return this.renderPage(data);
  }
}
