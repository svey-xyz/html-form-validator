# vldx

A Javascript based HTML form validator that's easy to use, reduces API calls, and supports custom rules 📑!<br>
Project still in early stages of development. More features to come soon! 🚀

## Features
- Reduce API calls by validating HTML fields client side. 🥳
- Select from a verbose catalog of predefined rules. `(Coming soon.)`
- Define custom rules.
- Javascript-less setup! `(Coming soon.)`
- Easily integrate into existing forms, minimal additional JS required.
- Supports Google reCAPTCHA v3. 
- Honeypot field for reducing bot spam. 🤖
- Support for CJS and ESM.
- Dedicated developer. 🤓

## Getting started
### Installation
```shell
npm install vldx
```
### Usage
Start by importing the vldx library into your project. `(CDN support coming soon.)`
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
vldx relies on HTML classes and data to validate your forms.

#### Minimal Example Structure
```HTML
<form class="vldx-form" method="POST" action="https://your-api-route/">
	<!-- Optional honeypot field -->
	<div hidden aria-hidden="true">
    	<label>
    		Don’t fill this out if you're human: 
    		<input name="bot-field" class="vldx-honeypot"/>
    	</label>
    </div>

	<!-- Rules are defined with 'vldx-rules' on any field with the class 'vldx-field' -->
	<input type="text" name="name" class="vldx-field" vldx-rules="required" />
	<input type="email" name="email" class="vldx-field" vldx-rules="email|required" />

	<!-- Optional response field -->
	<span class="vldx-response hidden"></span>
</form>
```