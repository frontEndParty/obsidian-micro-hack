import { Menu, Notice, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerDomEvent(document, 'auxclick', (evt: MouseEvent) => {
      const img = evt.target as HTMLImageElement;
      const menu = new Menu();

      menu.addItem((item) =>
        item
          .setTitle('Copy')
          .setIcon('documents')
          .onClick(() => {
            new Notice('Copied');
            fetch(img.src)
              .then(response => response.blob())
              .then(blob => {
                copyImageToClipboard(blob)
              });
          })
      );
      menu.showAtMouseEvent(evt);
    });

  }
}

async function copyImageToClipboard(imageBlob: Blob) {
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