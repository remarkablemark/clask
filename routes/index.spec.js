'use strict';

/**
 * Module dependencies.
 */
const request = require('supertest');
const app = require('../app');

/**
 * Routes.
 */
describe('index routes', () => {
    const routes = {
        logout: '/logout',
        signout: '/signout',
        home: '/',
        error: '/404'
    };

    // logout
    describe(`GET ${routes.logout}`, () => {
        it(`redirects to ${routes.signout}`, (done) => {
            request(app)
                .get(routes.logout)
                .expect(302)
                .expect('Location', routes.signout, done)
            ;
        });
    });

    // signout
    describe(`GET ${routes.signout}`, () => {
        it('responds with html', (done) => {
            request(app)
                .get(routes.signout)
                .expect(200)
                .expect('Content-Type', /html/, done)
            ;
        });
    });

    // catch-all
    describe(`GET ${routes.error}`, () => {
        it('responds with html', (done) => {
            request(app)
                .get(routes.error)
                .expect(200)
                .expect('Content-Type', /html/, done)
            ;
        });
    });
});
