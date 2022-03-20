describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.createUser({
      name: 'negrito',
      username: 'negrito',
      password: 'negrito',
    })
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })
  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('negrito')
      cy.get('#password').type('negrito')
      cy.get('#login-button').click()
      cy.contains('negrito logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('mina')
      cy.get('#password').type('mina')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'negrito logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({
        username: 'negrito',
        password: 'negrito',
      })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Some random title 1')
      cy.get('#author').type('Some random dude 1')
      cy.get('#url').type('http://localhost:3001')

      cy.get('#create-blog-button').click()
      cy.contains('Some random title 1')
    })
    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Some random title 2',
          author: 'Some random dude 2',
          url: 'http://localhost:3002',
        })
      })

      it('user can like the blog', function () {
        cy.contains('Some random title 2').contains('view').click()
        cy.contains('Some random title 2')
          .find('button')
          .contains('like')
          .click()
      })

      it('user can delete the blog if its the owner', function () {
        //   Cypress automatically accepts alerts
        cy.contains('Some random title 2').contains('view').click()
        cy.contains('Some random title 2')
          .find('button')
          .contains('remove')
          .click()
        cy.should('not.contain', 'Some random title 2')
      })

      it("user can't delete the blog if it's not the owner", function () {
        cy.createUser({
          name: 'benjamin',
          username: 'benjamin',
          password: 'benjamin',
        })
        cy.login({
          username: 'benjamin',
          password: 'benjamin',
          localStorageInfoUserKey: 'otherUser',
        })
        cy.createBlog({
          title: 'Other user blog 1',
          author: 'Other author blog 1',
          url: 'Other url',
          localStorageInfoUserKey: 'otherUser',
        })
        // Cypress automatically accepts alerts
        cy.contains('Other user blog 1')
          .contains('view')
          .click()
          .get('remove')
          .should('not.exist')
      })
    })
  })
  it('blogs are ordered according to likes', function () {
    cy.login({
      username: 'negrito',
      password: 'negrito',
    })
    for (let i = 1; i <= 4; i++) {
      cy.createBlog({
        title: `Some random title ${i}`,
        author: `Some random dude ${i}`,
        url: `http://localhost:300${i}`,
      })
      cy.like(`Some random title ${i}`, i)
    }
    cy.visit('http://localhost:3000')
    const order = [4, 3, 2, 1]
    cy.get('.blogContainer')
      .should('have.length', 4)
      .each((item, index) => {
        cy.wrap(item)
          .contains('view')
          .click()
          .get('.likes')
          .contains(`likes ${order[index]}`)
      })
  })
})
