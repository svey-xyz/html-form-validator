// src/rules.ts
var baseRules = /* @__PURE__ */ new Map();
baseRules.set("required", {
  name: "required",
  validator: (validatorField) => {
    return validatorField.getHTMLField.value !== "";
  },
  error: {
    priority: 1,
    message: "$name is a required field."
  }
});
baseRules.set("email", {
  name: "email",
  validator: (validatorField) => {
    const email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_regex.test(validatorField.getHTMLField.value);
  },
  error: {
    priority: 0,
    message: "Enter a proper email address."
  }
});

// src/handlers/fieldValidation.ts
var field = class {
  form;
  htmlField;
  rules = /* @__PURE__ */ new Map();
  inputHandler;
  handleInput(e) {
  }
  constructor(htmlField, form, customRules = []) {
    this.inputHandler = this.handleInput.bind(this);
    this.htmlField = htmlField;
    this.form = form;
    this.htmlField.addEventListener("blur", this.inputHandler);
    if (this.htmlField.dataset.vldxRules) {
      let htmlRules = this.htmlField.dataset.vldxRules;
      htmlRules = htmlRules?.replace(/\s+/g, "");
      for (const ruleName of htmlRules?.split(`|`)) {
        if (baseRules.has(ruleName))
          this.rules.set(ruleName, baseRules.get(ruleName));
        else
          console.log("An invalid rule has been provided.");
      }
    }
    for (const customRule of customRules) {
      if (this.rules.has(customRule.name))
        throw new Error(`${customRule.name} already exists on this field- ${this.htmlField.id}!`);
      else
        this.rules.set(customRule.name, customRule);
    }
  }
  fieldValidation() {
    let loggedError;
    this.rules.forEach((rule) => {
      let priority = loggedError?.priority ? loggedError?.priority : -1;
      if (!rule.validator.call(this, this) && rule.error.priority > priority) {
        loggedError = rule.error;
      }
    });
    loggedError = {
      priority: loggedError?.priority,
      message: loggedError?.message.replaceAll("$name", `'${this.htmlField.name[0].toUpperCase() + this.htmlField.name.substring(1)}'`)
    };
    this.htmlField.setCustomValidity(loggedError?.message ? loggedError.message : "");
    this.htmlField.reportValidity();
    this.form.updateErrors(this.htmlField.id, loggedError);
  }
  get getHTMLField() {
    return this.htmlField;
  }
};
field.prototype.handleInput = function(e) {
  switch (e.type) {
    case "blur":
      this.fieldValidation(e.target);
      break;
    default:
      break;
  }
};

// src/handlers/submitForm.ts
import { load } from "recaptcha-v3";
async function submitForm(e, form) {
  e.preventDefault();
  e.stopPropagation();
  form.validateAll();
  if (form.getHoneyPot?.value !== "")
    form.updateErrors(form.getHoneyPot?.id, { priority: 2, message: "Are you a bot? A honey pot field has been filled!" });
  else
    form.updateErrors(form.getHoneyPot?.id);
  let loggedError;
  form.getErrors.forEach((error) => {
    let priority = loggedError?.priority ? loggedError?.priority : -1;
    if (error.priority > priority)
      loggedError = error;
  });
  loggedError ? updateResponse(form, false, loggedError.message) : await submissionFunction(form);
}
function updateResponse(form, passStatus, message) {
  let responseField = form.getResponseField;
  responseField.innerText = passStatus && form.getSuccessMessage ? form.getSuccessMessage : message;
  passStatus ? (() => {
    responseField.classList.remove("vldx-failure");
    responseField.classList.add("vldx-success");
  })() : (() => {
    responseField.classList.remove("vldx-success");
    responseField.classList.add("vldx-failure");
  })();
  responseField.classList.remove("hidden");
}
var submissionFunction = async (form) => {
  const formData = new FormData(form.getFormContainer);
  if (typeof form.getRecaptchaKey !== "undefined") {
    const recaptchaKey = form.getRecaptchaKey;
    const recaptcha = await load(recaptchaKey, { autoHideBadge: true });
    const token = await recaptcha.execute("submit");
    formData.append("g-token", token);
  }
  const url = form.getFormContainer.getAttribute("action");
  const request = new XMLHttpRequest();
  request.responseType = "json";
  request.open("POST", url, true);
  let data = {};
  for (let [key, prop] of formData) {
    data[key] = prop;
  }
  request.onreadystatechange = () => {
    if (request.readyState === 4) {
      updateResponse(form, request.status == 200, request.response.message);
    }
  };
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(data, null, 2));
};

// src/index.ts
var vldx = class {
  forms = [];
  constructor(form) {
    if (typeof form == "undefined")
      this.vldxInitAll();
    else
      this.vldxInitForm(form);
  }
  vldxInitAll() {
    document.querySelectorAll(".vldx-form").forEach((form) => {
      this.vldxInitForm(form);
    });
  }
  vldxInitForm(form) {
    let vxf = new vldxForm(form);
    this.forms.push(vxf);
    return vxf;
  }
  get getForms() {
    return this.forms;
  }
};
var vldxForm = class {
  formContainer;
  submitButton;
  honeyPot;
  recaptchaKey;
  fields = new Array();
  responseField;
  successMessage = "The form has been submitted successfully!";
  errors = /* @__PURE__ */ new Map();
  buttonHandler;
  buttonInput(e) {
    submitForm(e, this);
  }
  constructor(formContainer) {
    this.buttonHandler = this.buttonInput.bind(this);
    this.formContainer = formContainer;
    this.formContainer.setAttribute("novalidate", "true");
    this.recaptchaKey = this.formContainer.dataset.vldxRecaptcha;
    this.honeyPot = this.formContainer.querySelector(".vldx-honeypot");
    this.responseField = this.formContainer.querySelector(".vldx-response");
    this.successMessage = this.formContainer.dataset.vldxSuccessMessage ? this.formContainer.dataset.vldxSuccessMessage : this.successMessage;
    for (const field2 of this.formContainer.querySelectorAll(".vldx-field")) {
      this.addField(field2);
    }
    this.addSubmissionButton(this.formContainer.querySelector(".vldx-submit"));
  }
  addSubmissionButton(submitButton, customSubmitListener) {
    this.submitButton = submitButton;
    if (typeof customSubmitListener == "undefined")
      this.submitButton.addEventListener("click", this.buttonHandler);
    else
      this.submitButton.addEventListener("click", customSubmitListener);
  }
  addField(inputField, customRules) {
    this.fields.push(new field(inputField, this, customRules));
  }
  set setHoneyPotField(honeyPotField) {
    this.honeyPot = honeyPotField;
  }
  updateErrors(source, error) {
    if (typeof error !== "undefined" && typeof source !== "undefined")
      this.errors.set(source, error);
    else if (this.errors.has(source))
      this.errors.delete(source);
  }
  validateAll() {
    for (const field2 of this.fields) {
      field2.fieldValidation();
    }
  }
  get getErrors() {
    return this.errors;
  }
  get getFields() {
    return this.fields;
  }
  get getFormContainer() {
    return this.formContainer;
  }
  get getRecaptchaKey() {
    return this.recaptchaKey;
  }
  get getHoneyPot() {
    return this.honeyPot;
  }
  get getResponseField() {
    return this.responseField;
  }
  get getSuccessMessage() {
    return this.successMessage;
  }
};
export {
  vldx as default,
  vldxForm
};
