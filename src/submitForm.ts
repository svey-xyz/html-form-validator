import formValidator from "..";
import { load } from 'recaptcha-v3'

export async function submitForm(e: Event, form: formValidator) {
	e.preventDefault();
	e.stopPropagation();

	const formData = new FormData(form.getFormContainer);

	if (typeof form.getRecaptchaKey !== 'undefined') {
		const recaptchaKey: string = form.getRecaptchaKey;
		const recaptcha = await load(recaptchaKey, { autoHideBadge: true })
		const token = await recaptcha.execute('submit')

		formData.append('token', token)
	}

	// if (form.honeyPot?.value !== '') form.updateValidity(false);


	// const url = form.formContainer.getAttribute('action')!;
	const request = new XMLHttpRequest();
	request.responseType = "json"
	// request.open("POST", url, true);

	let data: any = {};

	for (let [key, prop] of formData) {
		data[key] = prop;
	}

	// request.onreadystatechange = 

	//Send the proper header information along with the request
	request.setRequestHeader("Content-type", "application/json");
	request.send(JSON.stringify(data, null, 2))
}
