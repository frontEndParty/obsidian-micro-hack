import { Menu, Notice, Plugin } from 'obsidian';

export default class CopyImageShortcut extends Plugin {
  private clickImage = (event: MouseEvent) => {
    console.log('click');
  }

  async onload() {
   
    this.addRibbonIcon('copy', 'Open menu', (event) => {
      const menu = new Menu();

      menu.addItem((item) =>
        item
          .setTitle('Copy Image')
          .setIcon('documents')
          .onClick(() => {
            new Notice('Copied');
          })
      );

      menu.showAtMouseEvent(event);
    });
  }
}