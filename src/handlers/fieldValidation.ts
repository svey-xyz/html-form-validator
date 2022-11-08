import formValidator from "../index";

export type customValidatorFunction = ((inputField: field) => boolean)
type rule = { priority: number, errorMessage: string, validator: customValidatorFunction }

let baseRules: Map<string, rule> = new Map()
baseRules.set('required', {
	priority: 1,
	errorMessage: 'This is a required field.',
	validator: (validatorField: field) => {
		return validatorField.getHTMLField.value !== ''
	}
})
baseRules.set('email', {
	priority: 0,
	errorMessage: 'Enter a proper email address.',
	validator: (validatorField: field) => {
		const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return email_regex.test(validatorField.getHTMLField.value);
	}
})

export class field {
	private form: formValidator;
	private htmlField: HTMLInputElement;
	private rules: Map<string, rule> = new Map()

	inputHandler: (e: Event) => void;
	handleInput(e: Event): void { };

	constructor(htmlField: HTMLInputElement, form: formValidator) {
		this.inputHandler = this.handleInput.bind(this);
		this.htmlField = htmlField;
		this.form = form;

		this.htmlField.addEventListener('blur', this.inputHandler)

		const htmlRules: string = this.htmlField.getAttribute('rules') !== null ? this.htmlField.getAttribute('rules')! : ''
		for (const ruleName of htmlRules.split('|')) {
			if (baseRules.has(ruleName)) this.rules.set(ruleName, baseRules.get(ruleName)!)
			else console.log('An invalid rule has been provided.')
		}
	}

	public addCustomRule(ruleName: string, rule: rule) {
		if (!this.rules.has(ruleName)) this.rules.set(ruleName, rule)
		else console.error('This field already has a rule with that name.')
	}

	public fieldValidation(): boolean {
		let validity: boolean = true;
		let errorMessage: string = ''
		let loggedPriority: number = 0;


		this.rules.forEach((rule) => {
			validity = validity && rule.validator.call(this, this) ? true : false;
			if (!validity && rule.priority > loggedPriority ) {
				loggedPriority = rule.priority
				errorMessage = rule.errorMessage
			}
		});

		this.htmlField.setCustomValidity(errorMessage)
		this.htmlField.reportValidity()
		this.form.updateValidity = validity;
		return validity;
	}

	public get getHTMLField(): HTMLInputElement {
		return this.htmlField;
	}
}

field.prototype.handleInput = function (e: Event) {
	switch (e.type) {
		case ('blur'):
			this.fieldValidation();
			break;
		default:
			break;
	}
}

