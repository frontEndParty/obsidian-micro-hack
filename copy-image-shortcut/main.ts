import { Menu, Notice, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('dice', 'Open menu', (event) => {
      const menu = new Menu();

      menu.addItem((item) =>
        item
          .setTitle('Copy')
          .setIcon('documents')
          .onClick(() => {
            new Notice('Copied');
          })
      );

      menu.addItem((item) =>
        item
          .setTitle('Paste')
          .setIcon('paste')
          .onClick(() => {
            new Notice('Pasted');
          })
      );

      menu.showAtMouseEvent(event);
      
     });
     this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      // if event target is image 
      console.log('WE CLICKED!', evt.target.alt);


      
      fetch(evt.target.src)
      .then(response => response.blob())
      .then(blob => {
        const fileExt = evt.target.alt.split('.').pop()
        // setClipboard(blob, fileExt)
        copyImageToClipboard(blob)

      });
      
      
      

      // navigator.clipboard.write()
    });
  }
}

async function setClipboard(img: any, extension: string) {
  const type = "img/" + extension;
  // const blob = new Blob([img], { type });
  const data = [new ClipboardItem({ [type]: img })];
  await navigator.clipboard.write(data);
}


// persis pasted this:

async function copyImageToClipboard(imageBlob) {
  try {
      // Create a ClipboardItem with the image blob
      const clipboardItem = new ClipboardItem({
          [imageBlob.type]: imageBlob
      });

      // Write the ClipboardItem to the clipboard
      await navigator.clipboard.write([clipboardItem]);
      console.log("Image copied to clipboard successfully!");
  } catch (error) {
      console.error("Failed to copy image to clipboard:", error);
  }
}

// Example usage: Fetch an image and copy it to the clipboard
async function fetchAndCopyImage() {
  try {
      const response = await fetch("https://example.com/image.png");
      const imageBlob = await response.blob();
      await copyImageToClipboard(imageBlob);
  } catch (error) {
      console.error("Error fetching or copying image:", error);
  }
}

fetchAndCopyImage();