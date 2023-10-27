describe("Project Tests", () => {
  const date = new Date();
  const formattedDate =
    date.getUTCFullYear().toString() +
    (date.getUTCMonth() + 1).toString() +
    date.getUTCDate().toString();

  it("Create Project - Empty Name and Budget", () => {
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.getDataTest("create-project-budget-input").clear();
    cy.contains("Project Name must be non-empty").should("not.exist");
    cy.getDataTest("create-project-button").click();
    cy.contains("Project Name must be non-empty").should("be.visible");
  });

  it("Create Project - Empty Name", () => {
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.contains("Project Name must be non-empty").should("not.exist");
    cy.getDataTest("create-project-button").click();
    cy.contains("Project Name must be non-empty").should("be.visible");
  });

  it("Create Project - Empty Budget", () => {
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.getDataTest("create-project-name-input").type(`test-${formattedDate}`);
    cy.getDataTest("create-project-budget-input").clear;
    cy.contains("Budget must be greater than $0").should("not.exist");
    cy.getDataTest("create-project-button").click();
    cy.contains("Budget must be greater than $0").should("be.visible");
  });

  it("Create Project - Name Longer than 30 Characters", () => {
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.contains("0/30").should("be.visible");
    cy.getDataTest("create-project-name-input").type(
      "0123456789012345678901234567890"
    );
    cy.contains("31/30").should("be.visible");
    cy.contains("Project Name must be 30 characters or less").should(
      "not.exist"
    );
    cy.getDataTest("create-project-button").click();
    cy.contains("Project Name must be 30 characters or less").should(
      "be.visible"
    );
  });

  it("Create Project - Budget Equal to 0", () => {
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.getDataTest("create-project-name-input").type(`test-${formattedDate}`);
    cy.contains("Budget must be greater than $0").should("not.exist");
    cy.getDataTest("create-project-button").click();
    cy.contains("Budget must be greater than $0").should("be.visible");
  });

  it("Create Project - Non-Number Characters for Budget", () => {
    // Create Project API Response
    cy.intercept(
      {
        method: "POST",
        url: Cypress.env("url").server + "/project"
      },
      cy.spy().as("create-response")
    );

    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.getDataTest("create-project-name-input").type(`test-${formattedDate}`);
    cy.getDataTest("create-project-budget-input").clear().type("-0.01");
    cy.getDataTest("create-project-button").click();
    cy.get("@create-response").should("not.have.been.called");
    cy.contains("Create Project").should("be.visible");
  });

  it("Create Project - Close Modal", () => {
    cy.loginGuest();
    cy.getDataTest("add-project-button").click();
    cy.contains("Create Project").should("be.visible");
    cy.getDataTest("create-project-name-input").type(`test-${formattedDate}`);
    cy.getDataTest("create-project-budget-input").clear().type("137.19");
    cy.getDataTest("create-project-close-button").click();
    cy.contains(`test-${formattedDate}`).should("not.exist");
    cy.reload();
    cy.contains(`test-${formattedDate}`).should("not.exist");
  });

  it("Update Project - Empty Name and Budget", () => {
    cy.loginGuest();
    cy.getDataTest("update-project-icon-12").click();
    cy.contains("Update Project: My First Project").should("be.visible");
    cy.getDataTest("update-project-name-input").clear();
    cy.getDataTest("update-project-budget-input").clear();
    cy.contains("Project Name must be non-empty").should("not.exist");
    cy.getDataTest("update-project-button").click();
    cy.contains("Project Name must be non-empty").should("be.visible");
  });

  it("Update Project - Empty Name", () => {
    cy.loginGuest();
    cy.getDataTest("update-project-icon-12").click();
    cy.contains("Update Project: My First Project").should("be.visible");
    cy.getDataTest("update-project-name-input").clear();
    cy.contains("Project Name must be non-empty").should("not.exist");
    cy.getDataTest("update-project-button").click();
    cy.contains("Project Name must be non-empty").should("be.visible");
  });

  it("Update Project - Empty Budget", () => {
    cy.loginGuest();
    cy.getDataTest("update-project-icon-12").click();
    cy.contains("Update Project: My First Project").should("be.visible");
    cy.getDataTest("update-project-budget-input").clear();
    cy.contains("Budget must be greater than $0").should("not.exist");
    cy.getDataTest("update-project-button").click();
    cy.contains("Budget must be greater than $0").should("be.visible");
  });

  it("Update Project - Name Longer than 30 Characters", () => {
    cy.loginGuest();
    cy.getDataTest("update-project-icon-12").click();
    cy.contains("Update Project: My First Project").should("be.visible");
    cy.contains("16/30").should("be.visible");
    cy.getDataTest("update-project-name-input")
      .clear()
      .type("0123456789012345678901234567890");
    cy.contains("31/30").should("be.visible");
    cy.contains("Project Name must be 30 characters or less").should(
      "not.exist"
    );
    cy.getDataTest("update-project-button").click();
    cy.contains("Project Name must be 30 characters or less").should(
      "be.visible"
    );
  });

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
