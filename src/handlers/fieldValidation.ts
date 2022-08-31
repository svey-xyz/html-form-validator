export type customValidatorFunction = ((inputField: field) => boolean)
export type inputFieldArgs = { genericErrorMessage?: string, customValidator?: customValidatorFunction, customErrorMessage?: Map<string,string> } | undefined

const ruleSets = ['required', 'email']


/**TODO
 *  Allow the adding of custom rule sets with custom validators
 */
export class field {
	private validity: string = '';
	private htmlField: HTMLInputElement;

	private fieldRuleSets: Map<string, { errorMessage: string, validator: customValidatorFunction }> = new Map();

	inputHandler: (e: Event) => void;
	handleInput(e: Event): void { };

	constructor(htmlField: HTMLInputElement, args?: inputFieldArgs) {
		this.inputHandler = this.handleInput.bind(this);

		this.htmlField = htmlField;

		this.htmlField.addEventListener('blur', this.inputHandler)

		let fieldName = this.htmlField.getAttribute('name')

		for (const ruleSet of ruleSets) {
			let errorMessage: string = '';

			let validator: customValidatorFunction = (validatorField: field) => { return true };
			switch (ruleSet) {
				case ('required'):
					validator = (validatorField: field) => { return validatorField.getHTMLField.value !== '' }
					errorMessage = `${fieldName} is a required value.`;
					break;
				case ('email'):
					validator = (validatorField: field) => { return validatorField.emailTest(validatorField.getHTMLField.value) }
					errorMessage = `Enter a proper email address.`;
					break;
				default:
					break;
			}


			let customErrorMessage = args?.customErrorMessage?.get(ruleSet)
			errorMessage = typeof customErrorMessage !== 'undefined' ? customErrorMessage :
				(typeof args?.genericErrorMessage !== 'undefined' ? args?.genericErrorMessage : errorMessage);

			this.fieldRuleSets.set(ruleSet, { errorMessage: errorMessage, validator: validator })
		}
	}

	public get getHTMLField(): HTMLInputElement {
		return this.htmlField;
	}

	public fieldValidation(): boolean | null {
	 	let loggedErrors: Array<string> = new Array
		let validity: boolean = true;

		const rules = this.htmlField.getAttribute('rules')?.split('|')

		if (rules) {
			for (const rule of rules) {
				let components: Array<string> = rule.split(':');
				if (components.length <= 0) components.push(rule);
				let ruleSet: string = components[0]

				validity = validity && this.fieldRuleSets.get(ruleSet)!.validator.call(this, this) ? true : false;
				if (!validity) loggedErrors.push(this.fieldRuleSets.get(ruleSet)!.errorMessage)
			}
		}

		let error = loggedErrors?.length > 0 ? loggedErrors[0] : ''
		this.htmlField.setCustomValidity(error)
		this.htmlField.reportValidity()
		console.log(`Validity: ${this.htmlField.reportValidity()}, Logged Errors: ${loggedErrors.length}`);

		// form.updateValidity(validity)
		// form.updateErrorResponse(response, validity)
		return validity;
	}

	private emailTest(fieldValue: string): boolean {
		const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return email_regex.test(fieldValue);
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

