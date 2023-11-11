const Mustache = require("mustache");

export class obj {
  renderPage(data) {
    // Convert head and content arrays to strings
    const headHtml = data.head.join("");
    const contentHtml = data.content.join("");

    const template = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>{{pageTitle}}</title>
            {{{headHtml}}}
        </head>
        <body>
            {{{contentHtml}}}
        </body>
        </html>
    `;

    return Mustache.render(template, {
      pageTitle: data.pageTitle,
      headHtml: headHtml,
      contentHtml: contentHtml,
    });
  }

  renderContent(content) {
    const contentHtml = content.join("");
    const template = `
        <div>
        {{{contentHtml}}}
        </div>
    `;

    return Mustache.render(template, {
      contentHtml: contentHtml,
    });
  }

  //----------page items-----------
  mListTemplate = `
  <ul class="{{ulClass}}">
  {{#list}}
  <li class="{{className}}">{{text}}</li>
  {{/list}}
</ul>
      `;

  generateList(items, ulClass = "", liClass = "") {
    const data = {
      list: items.map((item) => ({
        text: item, // Assuming 'item' is a string
        className: liClass,
      })),
      ulClass: ulClass,
    };
    return Mustache.render(this.mListTemplate, data);
  }

  //----------Data processing-----------

  getNestedValues(data, paths) {
    const result = new Map();

    paths.forEach((path) => {
      const keys = path.split("."); // Split the path into keys and indices
      let currentData = data;

      try {
        keys.forEach((key) => {
          if (key.startsWith("item")) {
            // If the key starts with 'item', it's an index in an array
            const index = parseInt(key.slice(4)) - 1; // Convert 'itemX' to an array index (0-based)
            if (Number.isNaN(index)) throw new Error("Invalid index");
            currentData = currentData[index];
          } else {
            // Otherwise, it's a key in an object
            if (!(key in currentData)) throw new Error("Key not found");
            currentData = currentData[key];
          }
        });

        result.set(path, currentData);
      } catch (error) {
        console.error(`Error accessing path '${path}':`, error);
        // If you want to ignore the error and not store anything, just comment out the next line
        // result.set(path, undefined);
      }
    });

    return result;
  }

  mapToJson(map) {
    const result = {};
    for (const [key, value] of map) {
      // Since JSON keys must be strings, we need to ensure the key is in string format
      result[String(key)] = value;
    }
    return result;
  }

  SEPARATOR = "->"; // Custom separator to avoid conflict with dots in values

  mapUniqueKeys(obj, map = new Map(), currentPath = []) {
    // Iterate over each property in the object
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Handle the case where the property is another object or an array
        if (typeof obj[key] === "object" && obj[key] !== null) {
          this.mapUniqueKeys(obj[key], map, currentPath.concat(key));
        } else {
          // Handle the case where the property is a value
          const path = currentPath.concat(key).join(SEPARATOR);
          if (!map.has(path)) {
            map.set(path, new Set()); // Use Set to avoid duplicates
          }
          // If the value is an array, add each element to the Set
          if (Array.isArray(obj[key])) {
            obj[key].forEach((item) => map.get(path).add(item));
          } else {
            map.get(path).add(obj[key]);
          }
        }
      }
    }

    // If the currentPath is empty, we are at the root, return the combined map
    if (currentPath.length === 0) {
      const combinedMap = new Map();
      for (const [path, valuesSet] of map.entries()) {
        // Extract the key from the path, considering custom separator
        const key = path.split(SEPARATOR).pop();
        if (!combinedMap.has(key)) {
          combinedMap.set(key, new Set());
        }
        // Combine Sets of values
        valuesSet.forEach((value) => combinedMap.get(key).add(value));
      }
      // Convert Sets to Arrays
      for (const [key, valueSet] of combinedMap.entries()) {
        combinedMap.set(key, Array.from(valueSet));
      }
      return combinedMap;
    }

    return map;
  }

  //----------miscellaneous----------

  detectEnvironment() {
    if (typeof window === "object" && typeof window.document === "object") {
      return "Browser";
    } else {
      return "Server";
    }
  }
}
