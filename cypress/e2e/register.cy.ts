describe("Register Tests", () => {
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
});
