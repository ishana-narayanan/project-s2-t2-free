// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import user from "../fixtures/user.json";

Cypress.Commands.add("loginAsUser", () =>
  cy.setCookie("AUTH", JSON.stringify(user))
);

Cypress.Commands.add("prepareDatabase", () => {
  cy.visit("http://localhost:3000/testhooks");
  cy.get("button").contains("Prepare Database").click();
  cy.get("span").contains("Database has been reset; ready to run tests.");
});
