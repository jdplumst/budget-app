describe("Signup Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.getDataTest("signup-link").click();
  });

  it("Blank username and password", () => {
    cy.contains("Must enter a username").should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains("Must enter a username").should("be.visible");
  });

  it("Blank username", () => {
    cy.getDataTest("signup-password-input").type("x");
    cy.contains("Must enter a username").should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains("Must enter a username").should("be.visible");
  });

  it("Blank password", () => {
    cy.getDataTest("signup-username-input").type("x");
    cy.contains("Must enter a password").should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains("Must enter a password").should("be.visible");
  });

  it("Existing username", () => {
    cy.getDataTest("signup-username-input").type(Cypress.env("guest").username);
    cy.getDataTest("signup-password-input").type("x");
    cy.contains("Username already taken").should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains("Username already taken").should("be.visible");
  });

  it("Password length less than 8", () => {
    cy.getDataTest("signup-username-input").type("x");
    cy.getDataTest("signup-password-input").type("$0Xxxxx");
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("be.visible");
  });

  it("Password contains no lowercase letters", () => {
    cy.getDataTest("signup-username-input").type("x");
    cy.getDataTest("signup-password-input").type("$0XXXXXX");
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("be.visible");
  });

  it("Password contains no uppercase letters", () => {
    cy.getDataTest("signup-username-input").type("x");
    cy.getDataTest("signup-password-input").type("$0xxxxxx");
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("be.visible");
  });

  it("Password contains no digits", () => {
    cy.getDataTest("signup-username-input").type("x");
    cy.getDataTest("signup-password-input").type("$Xxxxxxx");
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("be.visible");
  });

  it("Password contains no special characters", () => {
    cy.getDataTest("signup-username-input").type("x");
    cy.getDataTest("signup-password-input").type("0Xxxxxxx");
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("not.exist");
    cy.getDataTest("signup-button").click();
    cy.contains(
      "Password must contain at least 1 lowercase character, " +
        "1 uppercase character, 1 digit, 1 special character, and 8 characters total"
    ).should("be.visible");
  });

  it("Valid signup", () => {
    const date = new Date();
    const userDate =
      date.getUTCFullYear().toString() +
      (date.getUTCMonth() + 1).toString() +
      date.getUTCDate().toString();
    cy.getDataTest("signup-username-input").type(`test-${userDate}`);
    cy.getDataTest("signup-password-input").type("$0Xxxxxx");
    cy.getDataTest("signup-button").click();
    cy.contains(`Hi test-${userDate}`).should("be.visible");
    cy.url().should("eq", Cypress.config().baseUrl + "/projects");
  });
});
