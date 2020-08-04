import { Block } from "@contentarchitect/editor"
import view from "./view.vue"
import settings from "./settings.vue"
import icon from "./icon.svg"

export default class Spacer extends Block {
	static get viewComponent () {
		return view;
	}

	static get settingsComponent () {
		return settings;
	}

	static get icon () {
		return icon;
	}

	static defaultData () {
		return {
			height: 80
		}
	}

	static defaultSettings = {
		minHeight: 20,
		maxHeight: 200
	}

	toHTML () {
		return `<div style="height: ${this.height}px"></div>`;
	}
	
	static serializeFromHTML (html) {
		let height = 0,
			cssString = html.getElementsByTagName("div")[0].getAttribute("style");
		

		function css2obj (css) {
			const result = {},
				  attributes = css.split(';');

			attributes.forEach(attr => {
				const [key, value] = attr.split(':');
				result[key.trim()] = value.trim()
			});

			return result;
		}

		height = css2obj(cssString)["height"]
		height = Number(/\d+/.exec(height)[0])

		return {
			height
		}
	}
}