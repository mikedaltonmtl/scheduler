describe("Appointments", () => {

  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("[data-testid=day]", "Monday");
   });

  it("should book an interview", () => {
    // Click on the "Add" button in the second appointment
    cy.get("[alt='Add']")
      .first()
      .click();
    // Enter student name in input
    cy.get('[data-testid="student-name-input"]')
      .type("Lydia Miller-Jones");
    // Choose the interviewer (select image)
    cy.get("[alt='Sylvia Palmer']")
      .click();
    // Click the save button
    cy.contains("Save")
      .click();
    // Verify that booked appointment is displayed, check student and interviewer names are displayed
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    // Click on the "Edit" button in the first ("Archie Cohen") appointment
    cy.get("[alt='Edit']")
      .click({ force: true });
    // Clear the input text and type new name
    cy.get('[data-testid="student-name-input"]')
      .clear()
      .type("Lydia Miller-Jones");
    // Choose the interviewer (select image)
    cy.get("[alt='Tori Malcolm']")
      .click();
    // Click the save button
    cy.contains("Save")
      .click();
    // Verify that booked appointment is displayed, check student and interviewer names are displayed
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    
    // Click on the "Delete" button in the first ("Archie Cohen") appointment
    cy.get("[alt='Delete']")
      .click({ force: true });
    // Click the "Confirm" button
    cy.contains("Confirm")
      .click();
    // Verify the "Deleting" indicator is displayed
    cy.contains("Deleting")
      .should("exist");
    // ... and that the "Deleting" indicator is then hidden
    cy.contains("Deleting")
      .should("not.exist");
    // ... and that the "Archie Cohen" appointment is no longer there
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist");
  });
});