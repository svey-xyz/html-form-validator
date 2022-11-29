import { field } from './handlers/fieldValidation';
import { submitForm } from './handlers/submitForm'

export type customValidatorFunction = ((inputField: field) => boolean)
export type error = { priority: number, message: string }
export type rule = { name: string, validator: customValidatorFunction, error: error }

export default class vldx {
	private forms: Array<vldxForm> = [];

	constructor(form?:HTMLFormElement) {
		if (typeof form == 'undefined') this.vldxInitAll();
		else this.vldxInitForm(form);
	}

	vldxInitAll(): void {
		document.querySelectorAll('.vldx-form').forEach(form => {
			(this.vldxInitForm(form as HTMLFormElement));
		});
	}

	vldxInitForm(form: HTMLFormElement): vldxForm {
		let vxf = new vldxForm(form)
		this.forms.push(vxf)
		return vxf;
	}

	public get getForms(): Array<vldxForm> {
		return this.forms;
	}
}

export class vldxForm {
	private formContainer: HTMLFormElement
	private submitButton?: HTMLButtonElement
	private honeyPot: HTMLInputElement | null
	private recaptchaKey?: string
	private fields: Array<field> = new Array
	private responseField?: HTMLElement

	private successMessage: string = "The form has been submitted successfully!"
	private errors: Map<string, error> = new Map
	
	buttonHandler: (e: Event) => void;
	buttonInput(e: Event): void { 
		submitForm(e, this);
	};

	/**
	 * Creates a Contact Form Validator instance.
	 * @param {HTMLFormElement} formContainer
	 * @param {string} [recaptchaKey] If provided will verify using Google recaptcha V3.
	 * @memberof formValidator
	 */
	constructor(formContainer: HTMLFormElement) {
		this.buttonHandler = this.buttonInput.bind(this);

		this.formContainer = formContainer;
		this.formContainer.setAttribute('novalidate', 'true');

		this.recaptchaKey = this.formContainer.dataset.vldxRecaptcha;
		
		this.honeyPot = this.formContainer.querySelector('.vldx-honeypot')
		this.responseField = this.formContainer.querySelector('.vldx-response')
		this.successMessage = this.formContainer.dataset.vldxSuccessMessage ? this.formContainer.dataset.vldxSuccessMessage : this.successMessage

		for (const field of this.formContainer.querySelectorAll('.vldx-field')) {
			this.addField(field as HTMLInputElement)
		}

		this.addSubmissionButton(this.formContainer.querySelector('.vldx-submit') as HTMLButtonElement)
	}

	/**
	 * Provide a submission button for the form.
	 *
	 * @param {HTMLButtonElement} submitButton
	 * @param {EventListener} [customSubmitListener] Adding a custom listener will override all default submission validation.
	 * @memberof formValidator
	 */
	addSubmissionButton(submitButton: HTMLButtonElement, customSubmitListener?: EventListener) {
		this.submitButton = submitButton;
		if (typeof customSubmitListener == 'undefined') this.submitButton.addEventListener('click', this.buttonHandler);
		else this.submitButton.addEventListener('click', customSubmitListener);
	}

	/**
	 *
	 *
	 * @param {HTMLElement} inputField
	 * @memberof formValidator
	 */
	public addField(inputField: HTMLInputElement, customRules?: Array<rule>) {
		this.fields.push(new field(inputField, this, customRules))
	}

	public set setHoneyPotField(honeyPotField: HTMLInputElement) {
		this.honeyPot = honeyPotField;
	}

	public updateErrors(source?: string, error?: error) {
		if (typeof error !== 'undefined' && typeof source !== 'undefined') this.errors.set(source, error);
		else if (this.errors.has(source as string)) this.errors.delete(source as string);
	}

	public get getErrors() {
		return this.errors;
	}

	public get getFields(): Array<field> {
		return this.fields;
	}
	
	public get getFormContainer(): HTMLFormElement {
		return this.formContainer;
	}

	public get getRecaptchaKey(): string | undefined {
		return this.recaptchaKey;
	}

	public get getHoneyPot(): HTMLInputElement | null {
		return this.honeyPot;
	}

	public get getResponseField(): HTMLElement | null {
		return this.responseField;
	}

	public get getSuccessMessage(): string {
		return this.successMessage;
	}
	
}