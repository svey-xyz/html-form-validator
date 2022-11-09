import { field } from './handlers/fieldValidation';
import { submitForm } from './handlers/submitForm'

type error = {message: string, priority: number}

export default class formValidator {
	private formContainer: HTMLFormElement
	private submitButton?: HTMLButtonElement
	private honeyPot: HTMLInputElement | null
	private recaptchaKey?: string
	private fields: Array<field> = new Array
	private validity: boolean = false;
	
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
	constructor(formContainer: HTMLFormElement, recaptchaKey?: string) {
		this.buttonHandler = this.buttonInput.bind(this);

		this.formContainer = formContainer

		this.recaptchaKey = recaptchaKey

		this.formContainer.setAttribute('novalidate', 'true');

		this.honeyPot = this.formContainer.querySelector('.vldx-honeypot')

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
	private addField(inputField: HTMLInputElement) {
		this.fields.push(new field(inputField, this))
	}

	public set setHoneyPotField(honeyPotField: HTMLInputElement) {
		this.honeyPot = honeyPotField;
	}

	public set updateValidity(validity: boolean) {
		this.validity = this.validity && validity ? true : false;
	}

	public get getValiditiy() {
		return this.validity;
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
	
}