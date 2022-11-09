import formValidator, { rule, error } from "../index";


let baseRules: Map<string, rule> = new Map()
baseRules.set('required', {
	validator: (validatorField: field) => {
		return validatorField.getHTMLField.value !== ''
	},
	error: {
		priority: 1,
		message: 'This is a required field.'
	}
})
baseRules.set('email', {
	validator: (validatorField: field) => {
		const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return email_regex.test(validatorField.getHTMLField.value);
	},
	error: {
		priority: 0,
		message: 'Enter a proper email address.'
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


		if (this.htmlField.hasAttribute('vldx-rules')) { 
			let htmlRules: string = this.htmlField.getAttribute('vldx-rules')
			htmlRules = (htmlRules?.replace(/\s+/g, ''));

			for (const ruleName of htmlRules?.split(`|`)) {
				if (baseRules.has(ruleName)) this.rules.set(ruleName, baseRules.get(ruleName)!)
				else console.log('An invalid rule has been provided.')
			}
		}
	}

	public addCustomRule(ruleName: string, rule: rule) {
		if (!this.rules.has(ruleName)) this.rules.set(ruleName, rule)
		else console.error('This field already has a rule with that name.')
	}

	public fieldValidation(): void {
		let loggedError: error | undefined

		this.rules.forEach((rule) => {
			if (!rule.validator.call(this, this) &&
				(rule.error.priority > loggedError?.priority || rule.error.priority > 0)) {
				loggedError = rule.error
			}
		});

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
			this.fieldValidation();
			break;
		default:
			break;
	}
}

