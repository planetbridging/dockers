import { obj } from "./obj";

export class oExample extends obj {
  moustImport = `<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/4.0.1/mustache.min.js"></script>`;
  axiosImport = `<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.1/axios.js" integrity="sha512-58Cj9pM2ndGHIIY58rq330v1/LuFmUBapU2f7LQjEy0WGTsCkVsF02MFcMsKP31lKwEWOEyygaj7vlXUOpJyUw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>`;
  selfObj = `<script src="obj.js"></script>`;
  selfOexample = `<script src="oExample.js"></script>`;
  selfRun = `<script>

    document.addEventListener('DOMContentLoaded', function() {
        var tmpOExample = new oExample();
        console.log("hello");
        document.body.innerHTML += tmpOExample.createPage();
    });
    
  </script>`;

  createPage() {
    var renderType = this.detectEnvironment();
    var htmlList = this.eList(renderType);
    var pContent = [`<h1>hello</h1>`, `<p>yay</p>`, htmlList];

    const data = {
      pageTitle: "Example home page",
      head: [
        this.moustImport,
        this.axiosImport,
        this.selfObj,
        this.selfOexample,
        this.selfRun,
      ],
      content: pContent,
    };

    if (renderType == "Browser") {
      return this.renderContent(pContent);
    }

    return this.renderPage(data);
  }

  eList(detect) {
    const items = [detect, "Item 2", "Item 3"];
    const ulClass = "my-ul-class";
    const liClass = "my-li-class";

    const htmlList = this.generateList(items, ulClass, liClass);
    return htmlList;
  }
}
