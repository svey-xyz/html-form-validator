import { rule } from "./index";
import { field } from "./handlers/fieldValidation"

export const baseRules: Map<string, rule> = new Map()
baseRules.set('required', {
	name: 'required',
	validator: (validatorField: field) => {
		return validatorField.getHTMLField.value !== ''
	},
	error: {
		priority: 1,
		message: '$name is a required field.'
	}
})
baseRules.set('email', {
	name: 'email',
	validator: (validatorField: field) => {
		const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return email_regex.test(validatorField.getHTMLField.value);
	},
	error: {
		priority: 0,
		message: 'Enter a proper email address.'
	}
})