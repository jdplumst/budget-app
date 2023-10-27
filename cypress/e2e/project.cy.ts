describe("Project Tests", () => {
  const date = new Date();
  const formattedDate =
    date.getUTCFullYear().toString() +
    (date.getUTCMonth() + 1).toString() +
    date.getUTCDate().toString();

  it("User Project Workflow", () => {
    // Create Project API Response
    cy.intercept({
      method: "POST",
      url: Cypress.env("url").server + "/project"
    }).as("create-response");

    // Create Project
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.getDataTest("create-project-name-input").type(`test-${formattedDate}`);
    cy.getDataTest("create-project-budget-input").clear().type("137.19");
    cy.getDataTest("create-project-button").click();
    cy.wait("@create-response").then((intercept) => {
      const createResponse = intercept.response?.body;
      cy.getDataTest(`project-${createResponse.id}`).click();
      cy.url().should(
        "eq",
        Cypress.config().baseUrl + `/projects/${createResponse.id}`
      );
      cy.contains(`test-${formattedDate}`).should("be.visible");
      cy.contains("You have spent $0.00 out of your $137.19 budget").should(
        "be.visible"
      );
      cy.contains("Must be a Premium member to view").should("be.visible");
      cy.getDataTest("projects-link").click();

      // Update Project
      cy.getDataTest(`update-project-icon-${createResponse.id}`).click();
      cy.contains(`Update Project: test-${formattedDate}`).should("be.visible");
      cy.getDataTest("update-project-name-input").type("-updated");
      cy.getDataTest("update-project-budget-input").clear().type("215.22");
      cy.getDataTest("update-project-button").click();
      cy.getDataTest(`project-${createResponse.id}`).click();
      cy.url().should(
        "eq",
        Cypress.config().baseUrl + `/projects/${createResponse.id}`
      );
      cy.contains(`test-${formattedDate}-updated`).should("be.visible");
      cy.contains("You have spent $0.00 out of your $215.22 budget").should(
        "be.visible"
      );
      cy.contains("Must be a Premium member to view").should("be.visible");
      cy.getDataTest("projects-link").click();

      // Delete Project
      cy.getDataTest(`delete-project-icon-${createResponse.id}`).click();
      cy.getDataTest("delete-project-yes-button").click();
      cy.getDataTest(`project-${createResponse.id}`).should("not.exist");
    });
  });
});
