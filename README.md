**Development of this project stopped when my stack switched; this project is no longer maintained 😥** <br>

*If you're intersted in expanding feel free to fork or reach out and I'd be happy to help!*

# vldx

A Javascript based HTML form validator that's easy to use, reduces API calls, and supports custom rules 📑!<br>
Project still in early stages of development. More features to come soon! 🚀

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Example](#example)
- [Advanced Configuration](#advanced-configuration)
- [Coming Soon](#coming-soon)

## Features
- Reduce API calls by validating HTML fields client-side. 🥳
- Select from a verbose catalog of predefined rules. `(More coming soon.)`
- Define custom rules.
- Prioritize important rules.
- Javascript-less setup! `(Coming soon.)`
- Supports Google reCAPTCHA v3. 
- Honeypot field for reducing bot spam. 🤖
- Support for CJS and ESM.

## Getting Started
### Installation
```shell
npm install vldx
```
### Usage
Start by importing the vldx library into your project. `(CDN support coming soon.)`

The default behaviour is to instantiate a class object for each `.vldx-form` HTML class on a page; allowing for multiple instances on a single page, but limiting advanced customization options. For more on this see [Advanced Configuration](#advanced-configuration).

Fields are validated on receiving a blur event, and again on form submission. Custom validity is set on the DOM Elements. On submission the `.vldx-response` element will be populated with the highest priority message and given a `.vldx-failure` or `.vldx-success` class to allow for styling.

When all fields are valid, and a submission event is received the form data will be sent to your api as a Javascript object. A response listener will update the `.vldx-response` element when the request has completed.
#### ESM
```js
import vldx from 'vldx';
let validator = new vldx();
```
#### CJS
```js
const vldx = require('vldx');
let validator = new vldx();
```

If you plan on only using predefined rules this is all the Javascript that is required. `(Future versions of vldx won't even require this step, and will rely only on a CDN script tag in your HTML.)`

#### HTML
vldx relies on HTML classes and data to validate your forms. Any form you wish to be validated needs the class `.vldx-form`, and inputs require the class `.vldx-field`.

Your api endpoint is provided in the action attribute of the form.
```HTML
<form action="https://your.api.route">
```

To use the base rule set add a data attribute to your inputs: `data-vldx-rules=''`.
Rules are separated with a pipe `|`.
```HTML
<input class="vldx-field" data-vldx-rules="required|email" />
```

Finally, your forms should have a submission button with the class `.vldx-submit` and optionally a response field with the class `.vldx-response`.

## Example
#### JS
```js
import vldx from 'vldx';
let validator = new vldx();
```
#### HTML
```HTML
<form class="vldx-form" method="POST" action="https://your-api-route/">
	<!-- Rules are defined with 'data-vldx-rules', and separated by a pipe, on any field with the class 'vldx-field'  -->
	<input type="text" name="name" class="vldx-field" data-vldx-rules="required" />
	<input type="email" name="email" class="vldx-field" data-vldx-rules="email|required" />

	<!-- Submission button -->
	<button class="vldx-submit" data-callback='onSubmit' data-action='submit'></button>

	<!-- Optional response field. Stylized with .vldx-failure and .vldx-success classes -->
	<span class="vldx-response hidden"></span>
</form>
```
#### CSS
```CSS
.vldx-success {
	color: var(--successAccent);
}

.vldx-failure {
	color: var(--failureAccent);
}

.vldx-field\:outline:invalid {
	outline-style: solid;
	outline-width: 2px;
	outline-color: var(--failureAccent);
}
```
## Base Rules
#### Required
Simply ensures the field has a value.
#### Email
Requires that the field's value match a basic email regex check.

`(Many more coming soon!)`

## Advanced Configuration
More documentation coming soon!

### Honeypot
To add a honeypot field include the following input element in your form. If the field has any value it cannot be submitted, and will show an error message.

```HTML
<input hidden aria-hidden="true" name="bot-field" class="vldx-honeypot"/>
```

### Custom Success Message
Add a custom success message that will be displayed on the `.vldx-response` element after submission. Use the following data attribute on your HTML form.
```HTML
<form data-vldx-success-message="Your custom success message!">
```

### Google reCAPTCHA
The first half of Google reCAPTCHA v3 can be handled by vldx, your reCAPTCHA site key is provided via a data tag on your HTML form element, and passed to the api as `g-token` as part of the form data.
```HTML
<form data-vldx-recaptcha="your-recaptcha-token">
```

### Custom Rules
Documentation coming soon!

## Coming Soon
- Many more base rules.
- CDN support.
- Improved documentation.
