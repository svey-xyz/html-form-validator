import { baseRules } from "rules";
import { vldxForm, rule, error } from "../index";

export class field {
	private form: vldxForm;
	private htmlField: HTMLInputElement;
	private rules: Map<string, rule> = new Map()

	inputHandler: (e: Event) => void;
	handleInput(e: Event): void { };

	constructor(htmlField: HTMLInputElement, form: vldxForm, customRules: Array<rule> =[]) {
		this.inputHandler = this.handleInput.bind(this);
		this.htmlField = htmlField;
		this.form = form;

		this.htmlField.addEventListener('blur', this.inputHandler)


		if (this.htmlField.dataset.vldxRules) { 
			let htmlRules: string = this.htmlField.dataset.vldxRules;
			htmlRules = (htmlRules?.replace(/\s+/g, ''));

			for (const ruleName of htmlRules?.split(`|`)) {
				if (baseRules.has(ruleName)) this.rules.set(ruleName, baseRules.get(ruleName)!)
				else console.log('An invalid rule has been provided.')
			}
		}

		for (const customRule of customRules) {
			if (this.rules.has(customRule.name)) throw new Error(`${customRule.name} already exists on this field- ${this.htmlField.id}!`);
			else this.rules.set(customRule.name, customRule);
		}
	}

	public fieldValidation(htmlField: HTMLInputElement): void {
		let loggedError: error | undefined

		this.rules.forEach((rule) => {
			let priority = loggedError?.priority ? loggedError?.priority : -1;
			if (!rule.validator.call(this, this) && rule.error.priority > priority) {
				loggedError = rule.error
			}
		});

		loggedError = {
			priority: loggedError?.priority,
			message: loggedError?.message.replaceAll('$name', `'${htmlField.name[0].toUpperCase() + htmlField.name.substring(1)}'`)
		}

		this.htmlField.setCustomValidity(loggedError?.message ? loggedError!.message : '')
		this.htmlField.reportValidity()
		this.form.updateErrors(this.htmlField.id, loggedError);
	}

	public get getHTMLField(): HTMLInputElement {
		return this.htmlField;
	}
}

field.prototype.handleInput = function (e: Event) {
	switch (e.type) {
		case ('blur'):
			this.fieldValidation(e.target);
			break;
		default:
			break;
	}
}

