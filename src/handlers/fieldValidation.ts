import formValidator from "../index";

export type customValidatorFunction = ((inputField: field) => boolean)
type rule = { errorMessage: string, validator: customValidatorFunction }


/**TODO
 *  Allow the adding of custom rule sets with custom validators
 */
export class field {
	private form: formValidator;
	private htmlField: HTMLInputElement;
	private appliedRules: Array<string> = [];

	private ruleValidators: Map<string, rule> = new Map()


	inputHandler: (e: Event) => void;
	handleInput(e: Event): void { };

	constructor(htmlField: HTMLInputElement, form: formValidator) {
		this.inputHandler = this.handleInput.bind(this);
		this.htmlField = htmlField;
		this.form = form;

		this.htmlField.addEventListener('blur', this.inputHandler)

		this.initBaseRules()
		for (const ruleName of this.htmlField.getAttribute('rules')!.split('|')) {
			if (this.ruleValidators.has(ruleName)) this.appliedRules.push(ruleName)
			else console.log('An invalid rule has been provided.')
		}
	}

	private initBaseRules(): void {
		this.ruleValidators.set('required', {
			errorMessage: 'This is a required field.',
			validator: (validatorField: field) => {
				return validatorField.getHTMLField.value !== ''
			}
		})
		this.ruleValidators.set('email', {
			errorMessage: 'Enter a proper email address.',
			validator: (validatorField: field) => {
				const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				return email_regex.test(validatorField.getHTMLField.value);
			}
		})
	}

	public get getHTMLField(): HTMLInputElement {
		return this.htmlField;
	}

	public fieldValidation(): boolean | null {
	 	let loggedErrors: Array<string> = new Array
		let validity: boolean = true;

		for (const rule of this.appliedRules) {
			validity = validity && this.ruleValidators.get(rule)!.validator.call(this, this) ? true : false;
			if (!validity) loggedErrors.push(this.ruleValidators.get(rule)!.errorMessage)
		}

		let error = loggedErrors.length > 0 ? loggedErrors[0] : ''
		this.htmlField.setCustomValidity(error)
		this.htmlField.reportValidity()
		console.log(`Validity: ${this.htmlField.reportValidity()}, Logged Errors: ${loggedErrors.length}`);

		this.form.updateValidity = validity;
		// form.updateErrorResponse(response, validity)
		return validity;
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

