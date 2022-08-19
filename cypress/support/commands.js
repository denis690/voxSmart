import "@testing-library/cypress/add-commands";
import addContext from 'mochawesome/addContext';
import 'cypress-iframe';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('any', {prevSubject: 'element'}, (subject, size = 1) => {
  cy.wrap(subject).then(elementList => {
    elementList = (elementList.jquery) ? elementList.get() : elementList;
    elementList = Cypress._.sampleSize(elementList, size);
    elementList = (elementList.length > 1) ? elementList : elementList[0];
    cy.wrap(elementList);
  });
});

function getHistoricalData() {
  let marketData = [];
  //todo: temp selectors
  cy.get(':nth-child(1) > [style="text-align: left;"]').should(($date) => {
    marketData.push($date.text());
  }).get('tbody > :nth-child(1) > :nth-child(2)').should(($open) => {
    marketData.push($open.text());
  }).get('tbody > :nth-child(1) > :nth-child(3)').should(($high) => {
    marketData.push($high.text());
  }).get('tbody > :nth-child(1) > :nth-child(4)').should(($low) => {
    marketData.push($low.text());
  }).get('tbody > :nth-child(1) > :nth-child(5)').should(($close) => {
    marketData.push($close.text());
  }).get('tbody > :nth-child(1) > :nth-child(6)').should(($volume) => {
    marketData.push($volume.text());
  }).get(':nth-child(1) > [style="text-align: right;"]').should(($marketCap) => {
    marketData.push($marketCap.text());
  });
  return cy.wrap(marketData);
}

Cypress.Commands.add('getHistoricalData', getHistoricalData);

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
