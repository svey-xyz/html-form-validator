# vldx
[![Version](https://img.shields.io/npm/v/vldx?style=for-the-badge)](https://www.npmjs.com/package/vldx)
[![Activity](https://img.shields.io/github/last-commit/svey-xyz/vldx/master?style=for-the-badge)](https://github.com/svey-xyz/vldx)

A Javascript based HTML form validator that's easy to use, reduces API calls, and supports custom rules 📑!<br>
Project still in early stages of development. More features to come soon! 🚀

## Table of Contents
<!-- no toc -->
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Example](#example)
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

## Getting Started
### Installation
```shell
npm install vldx
```
### Usage
Start by importing the vldx library into your project. `(CDN support coming soon.)`

The default behaviour is to instantiate a class object for each '.vldx-form' HTML class on a page; allowing for multiple instances on a single page, but limiting advanced customization options. For more on this see [Advanced Configuration](#advanced-configuration).
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
vldx relies on HTML classes and data to validate your forms. Any form you wish to be validated needs the class `.vldx-form`, and inputs require the class `vldx-field`.

To use the base rule set add a data attribute to your inputs: `data-vldx-rules=''`.
Rules are seperated with a pipe `|`.
```HTML
<input class="vldx-field" data-vldx-rules="required|email" />
```

Finally your forms should have a submission button with the class `.vldx-submit`, and optionally a response field with the class `.vldx-response`.

## Example
#### JS
```js
import vldx from 'vldx';
let validator = new vldx();
```
#### HTML
```HTML
<form class="vldx-form" method="POST" action="https://your-api-route/">
	<!-- Optional honeypot field -->
    <input hidden aria-hidden="true" name="bot-field" class="vldx-honeypot"/>

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
Requires that the fields value match a basic email regex check.

`(Many more coming soon!)`

## Advanced Configuration
Documentation coming soon!

## Coming Soon
- Many more base rules.
- CDN support.
- Improved documentation.