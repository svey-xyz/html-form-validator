import { vldxForm ,error } from "..";
import { load } from 'recaptcha-v3'

export async function submitForm(e: Event, form: vldxForm) {
	e.preventDefault();
	e.stopPropagation();

	for (const field of form.getFields) {
		field.fieldValidation(field.getHTMLField)
	}

	if (form.getHoneyPot?.value !== '') form.updateErrors(form.getHoneyPot?.id, { priority: 2, message: 'Are you a bot? A honey pot field has been filled!' });
	else form.updateErrors(form.getHoneyPot?.id)

	let loggedError: error | undefined
	form.getErrors.forEach(error => {
		let priority = loggedError?.priority ? loggedError?.priority : -1;
		if (error.priority > priority) loggedError = error
	});

	loggedError ? updateResponse(form, false, loggedError.message) : await submissionFunction(form);
}

function updateResponse(form: vldxForm, passStatus: boolean, message?: string): void {
	let responseField = form.getResponseField;
	responseField.innerText = (passStatus && form.getSuccessMessage) ? form.getSuccessMessage : message;
	passStatus ?
		(() => { responseField.classList.remove('vldx-failure'); responseField.classList.add('vldx-success') })() :
		(() => { responseField.classList.remove('vldx-success'); responseField.classList.add('vldx-failure') })();
	responseField.classList.remove('hidden');
}

let submissionFunction = async (form: vldxForm) => {
	const formData = new FormData(form.getFormContainer);

	if (typeof form.getRecaptchaKey !== 'undefined') {
		const recaptchaKey: string = form.getRecaptchaKey;
		const recaptcha = await load(recaptchaKey, { autoHideBadge: true })
		const token = await recaptcha.execute('submit')

		formData.append('g-token', token)
	}

	const url = form.getFormContainer.getAttribute('action')!;
	const request = new XMLHttpRequest();
	request.responseType = "json"
	request.open("POST", url, true);

	let data: any = {};

	for (let [key, prop] of formData) {
		data[key] = prop;
	}

	request.onreadystatechange = () => { responseHandler(form, request) }

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data, null, 2))
}

function responseHandler(form: vldxForm, request: XMLHttpRequest) {
	if (request.readyState === 4) {
		updateResponse(form, request.status == 200, request.response.message)
	}
}