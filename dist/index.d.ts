declare class field {
    private form;
    private htmlField;
    private rules;
    inputHandler: (e: Event) => void;
    handleInput(e: Event): void;
    constructor(htmlField: HTMLInputElement, form: vldxForm, customRules?: Array<rule>);
    fieldValidation(htmlField: HTMLInputElement): void;
    get getHTMLField(): HTMLInputElement;
}

type customValidatorFunction = ((inputField: field) => boolean);
type error = {
    priority: number;
    message: string;
};
type rule = {
    name: string;
    validator: customValidatorFunction;
    error: error;
};
declare class vldx {
    private forms;
    constructor(form?: HTMLFormElement);
    vldxInitAll(): void;
    vldxInitForm(form: HTMLFormElement): vldxForm;
    get getForms(): Array<vldxForm>;
}
declare class vldxForm {
    private formContainer;
    private submitButton?;
    private honeyPot;
    private recaptchaKey?;
    private fields;
    private responseField?;
    private successMessage;
    private errors;
    buttonHandler: (e: Event) => void;
    buttonInput(e: Event): void;
    /**
     * Creates a Contact Form Validator instance.
     * @param {HTMLFormElement} formContainer
     * @param {string} [recaptchaKey] If provided will verify using Google recaptcha V3.
     * @memberof formValidator
     */
    constructor(formContainer: HTMLFormElement);
    /**
     * Provide a submission button for the form.
     *
     * @param {HTMLButtonElement} submitButton
     * @param {EventListener} [customSubmitListener] Adding a custom listener will override all default submission validation.
     * @memberof formValidator
     */
    addSubmissionButton(submitButton: HTMLButtonElement, customSubmitListener?: EventListener): void;
    /**
     *
     *
     * @param {HTMLElement} inputField
     * @memberof formValidator
     */
    addField(inputField: HTMLInputElement, customRules?: Array<rule>): void;
    set setHoneyPotField(honeyPotField: HTMLInputElement);
    updateErrors(source?: string, error?: error): void;
    get getErrors(): Map<string, error>;
    get getFields(): Array<field>;
    get getFormContainer(): HTMLFormElement;
    get getRecaptchaKey(): string | undefined;
    get getHoneyPot(): HTMLInputElement | null;
    get getResponseField(): HTMLElement | null;
    get getSuccessMessage(): string;
}

export { customValidatorFunction, vldx as default, error, rule, vldxForm };
