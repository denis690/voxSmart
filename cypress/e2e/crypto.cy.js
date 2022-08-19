import users from "../support/users.json";

const user = users["signInTestUser"];

describe("crypto e2e tests", () => {

  it("#001 - should be able to create an account", () => {
    //given
    let myVipUrl = 'https://myvip.avatrade.com/?wtrelogin=1';
    cy.visit(myVipUrl);
    cy.url().should('eq', myVipUrl);
    cy.title().should('eq', 'Your AvaTrade account access page - Log in to continue');
    cy.get("#welcomeText").should('be.visible').should('have.text', 'Access your account dashboard');

    //when
    cy.get('.hp-submit-btn.hp-demo-acc-btn').should('be.visible').click();
    cy.url().should('eq', "https://www.avatrade.com/demo-account");
    cy.title().should('eq', 'Demo Account ➤ Test your trading strategies | AvaTrade');

    cy.get("input[placeholder=\"First Name (As It Appears In Your ID)\"").should('be.visible').type(user['firstname']);
    cy.get("input[placeholder=\"Last Name (As It Appears In Your ID)\"]").should('be.visible').type(user['lastname']);
    cy.get("input[placeholder=\"Email\"]").should('be.visible').type(user['emailP1'] + "_" + new Date().getTime() + user['emailP2']);
    cy.get("input#phoneInput").should('be.visible').type(user['tel']);
    cy.get('label[for="GDPR"]').should('be.visible').click();
    cy.findByRole('button', {name: /Create Account/i}).should('be.visible').click();
    cy.findByRole('button', {name: /Skip Tutorial/i}).should('be.visible').click();
    cy.get('[data-qa="close-icon"]').should('be.visible').click({multiple: true, force: true}).wait(2000);
    cy.get('[data-qa="tree-list__container"] [href="/trade/crypto"]')
        .should('be.visible').should('have.text', 'Crypto').click();
    cy.get('[data-qa="watchlist-entity__favorite-icon-cell-fav"] [data-qa="watchlist-entity__favorite-icon-cell-set"]').any(5).each(($randomElement, index) => {
      cy.get($randomElement).should('exist').click().wait(2000);
    });

    //todo: temp selector
    cy.get(':nth-child(1) > .categories_link__3ko9N > .tree-list_link_content__22IVO > div').scrollIntoView()
        .should('be.visible').should('have.text', 'Favorites').click();

    //then
    cy.findByRole('button', {name: /Upgrade to Real/i}).should('be.visible');
    cy.get('[data-qa="trade-icon"]').should('be.visible');
    cy.get('[data-qa="positions-icon"]').should('be.visible');
    cy.get('[data-qa="orders-icon"]').should('be.visible');
    cy.get('[data-qa="table__row-props"]').should('be.visible').should('have.length', 21);
    cy.get('[data-qa="watchlist-entity__buy-sell-cell"]').should('be.visible').should('have.length', 20);
    cy.get('[data-qa="trade-from-chart__sell-button-container-container-sell"]')
        .should('be.visible').should('have.text', 'Sell');
    cy.get('[data-qa="trade-from-chart__buy-button-container-container-buy"]')
        .should('be.visible').should('be.visible').should('have.text', 'Buy');
  });

  it("#002 - should be able to view 100 results", () => {
    //given
    let myVipUrl = 'https://coinmarketcap.com/';
    cy.visit(myVipUrl);
    cy.url().should('eq', myVipUrl);
    cy.title().should('eq', 'Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap');
    cy.findByRole('button', {name: /Log In/i}).should('be.visible');
    cy.findByRole('button', {name: /Got it/i}).should('be.visible').click();

    //then
    cy.get('.table-control-page-sizer').should('be.visible').should('have.text', 'Show rows100');
    for (let count = 1000; count <= 10000; count += 1000) {
      cy.scrollTo(0, count).wait(500);
    }
    cy.get('button .icon-More-Vertical').should('exist').should('have.length', 100);
  });

  it("#003 - should be able view historical data", () => {
    //given
    let myVipUrl = 'https://coinmarketcap.com/';
    cy.visit(myVipUrl);
    cy.url().should('eq', myVipUrl);
    cy.title().should('eq', 'Cryptocurrency Prices, Charts And Market Capitalizations | CoinMarketCap');
    cy.findByRole('button', {name: /Log In/i}).should('be.visible');
    cy.findByRole('button', {name: /Got it/i}).should('be.visible').click();

    //then
    cy.get('.icon-More-Vertical').then(option => { option[0].click() });
    cy.findByRole('button', {name: /View Historical Data/i}).should('be.visible').click();
    cy.findByRole('button', {name: /Load More/i}).should('be.visible').click();

    let marketDataArray = [];
    cy.getHistoricalData().then(marketData => marketDataArray = marketData );
    cy.findByRole('button', {name: /Date Range/i}).should('be.visible').click();
    //todo: temp selector
    cy.get('.yzncs8-4 > ul > :nth-child(1)').should('be.visible').click();
    cy.get('.yzncs8-2 > p').should('be.visible').should('include.text', '7 days')
    cy.findByRole('button', {name: /Continue/i}).should('be.visible').click();
    cy.findByRole('button', {name: /Load More/i}).should('be.visible').click();

    let newMarketDataArray = [];
    cy.getHistoricalData().then(newMarketData => newMarketDataArray = newMarketData );
    expect(marketDataArray).to.deep.eq(newMarketDataArray)
    expect(marketDataArray).to.include.members(newMarketDataArray)
  });
});
