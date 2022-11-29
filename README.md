# vldx
[![Version](https://img.shields.io/npm/v/vldx.svg?style=for-the-badge)](https://www.npmjs.com/package/vldx)
[![Size](https://img.shields.io/bundlephobia/min/vldx?style=for-the-badge)](https://www.npmjs.com/package/vldx)
[![Activity](https://img.shields.io/github/last-commit/svey-xyz/vldx/master?style=for-the-badge)](https://github.com/svey-xyz/vldx)

A Javascript based HTML form validator that's easy to use, reduces API calls, and supports custom rules 📑!<br>
Project still in early stages of development. More features to come soon! 🚀

## Table of contents

- [vldx](#vldx)
	- [Table of contents](#table-of-contents)
	- [Features](#features)
	- [Getting started](#getting-started)
		- [Installation](#installation)
		- [Usage](#usage)
			- [ESM](#esm)
			- [CJS](#cjs)
			- [HTML](#html)
			- [Minimal Example Structure](#minimal-example-structure)
	- [Advanced Configuration](#advanced-configuration)
	- [Coming Soon](#coming-soon)

## Features
- Reduce API calls by validating HTML fields client side. 🥳
- Select from a verbose catalog of predefined rules. `(More coming soon.)`
- Define custom rules.
- Javascript-less setup! `(Coming soon.)`
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
    <input hidden aria-hidden="true" name="bot-field" class="vldx-honeypot"/>

	<!-- Rules are defined with 'data-vldx-rules' on any field with the class 'vldx-field' -->
	<input type="text" name="name" class="vldx-field" data-vldx-rules="required" />
	<input type="email" name="email" class="vldx-field" data-vldx-rules="email|required" />

	<!-- Submission button -->
	<button class="vldx-submit" data-callback='onSubmit' data-action='submit'></button>

	<!-- Optional response field | Stylized with .vldx-failure and .vldx-success classes -->
	<span class="vldx-response hidden"></span>
</form>
```

## Advanced Configuration

## Coming Soon