import { Vault, App, Editor,Command, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { readFile } from 'fs'
import { join } from 'path'

// Remember to rename these classes and interfaces!

interface CopyImageSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: CopyImageSettings = {
	mySetting: 'default'
}

export default class CopyImage extends Plugin {
	settings: CopyImageSettings;

			//add command to right-click menu
	addMenuItem(command: Command) {
		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu) => {
				menu.addItem((item) => {
					item.setTitle(command.name)
					// .setIcon(command.icon)
					.onClick(() => {
						//@ts-ignore
						this.app.commands.executeCommandById(command.id);
					});
				});
			})
		);
	}
	
	async onload() {
		await this.loadSettings();


		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('Hello Frontend party');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'copy-current-image',
			name: 'Copy current image',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
		    const sel = editor.getSelection()
		    console.log(`You have selected: ${sel}`);
		    const extractPath = /\!\[\[(.*)\]\]/g;
		    const matches = [...sel.matchAll(extractPath)]
		    console.log('Matches:', matches)
		    const path = (matches.length > 0) ? matches[1].toString() : sel
		    console.log(`Image path: ${path}`);
		    const tFile = this.app.vault.getAbstractFileByPath(path)
		    if (!tFile) { return }
		    if (tFile instanceof TFile) {
			    const pngBytes = await this.app.vault.readBinary(tFile)
			    console.log(`Read: ${pngBytes}`);
		    }
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: CopyImage;

	constructor(app: App, plugin: CopyImage) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
