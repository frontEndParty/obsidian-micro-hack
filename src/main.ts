/**
 * Make your Plugin here!
 * GLHF!
 */
import { Notice, Plugin } from "obsidian";

export default class MyPlugin extends Plugin {
  async onload() {
    this.addRibbonIcon("dice", "Greet", () => {
      new Notice("Hello, world! 2");
    });

    setTimeout(() => {
      const images = document.querySelectorAll(".internal-embed img");
      console.log(images);

      images[0].addEventListener("contextmenu", async (e) => {
        const responsePromise = fetch(e.target.src);
        try {
          if ("write" in navigator.clipboard) {
            await navigator.clipboard.write([
              new ClipboardItem({
                "image/png": new Promise(async (resolve) => {
                  const blob = await responsePromise.then((response) =>
                    response.blob()
                  );
                  resolve(blob);
                }),
              }),
            ]);
            // Image copied as image.
          } else {
            const text = await responsePromise.then((response) =>
              response.text()
            );
            await navigator.clipboard.writeText(text);
            // Image copied as source code.
          }
          console.log("image copied");
        } catch (err) {
          console.error(err.name, err.message);
        }
      });
    }, 1000);
  }
}
