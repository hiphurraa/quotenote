import chai from "chai";
import chatHttp from "chai-http";
import "chai/register-should.js";
import app from "../server.js";
import { addTestCommentToTestQuoteWithUserId, addTestQuoteWithCertainText, addTestQuoteWithUserId, addTestUserWithUserId, dropCommentLikes, dropData, dropQuotes, dropRoles, dropUserRoles, dropUsers, getUserById } from './testUtils.js';
import {dropComments } from './testUtils.js';
import jwtAuth from '../authentication/jwtAuthentication.js';

chai.use(chatHttp);

const { expect } = chai;

describe("Testing quote search:", () => {

    before(async () => {
        await dropUserRoles();
        await dropRoles();
        await dropCommentLikes();
        await dropComments();
        await dropQuotes();
        await dropUsers();
        await addTestUserWithUserId(1);
        await addTestUserWithUserId(2);
        await addTestQuoteWithCertainText(1,1,'This is a quote about bureaucracy.');
        await addTestQuoteWithCertainText(2,1,'Bureaucrats are able to comprehend complex texts.');
        await addTestQuoteWithCertainText(3,1,'This is something completely different.');
        await addTestQuoteWithCertainText(4,1,'This is a different quote about bureaucracy.');
        await addTestQuoteWithCertainText(5,1,'What is better: to be born good or to overcome your evil nature through great effort?');
        await addTestQuoteWithCertainText(6,1,'Good things can happen no matter when you were born.');
    });

    it("It should not retrieve any quotes with blank search", (done) => {
        const userData = {
            searchString: '       ',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.include({title: "Empty search string"});
            done();
        });
    });
    it("It should not retrieve any quotes with search criteria that don't match the quotes", (done) => {
        const userData = {
            searchString: 'marble copper iron',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.empty;
            done();
        });
    });
    it("It should retrieve 2 quotes with search string 'different'", (done) => {
        const userData = {
            searchString: 'different',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(2);
            done();
        });
    });
    it("It should retrieve 3 quotes with search string 'bureau*'", (done) => {
        const userData = {
            searchString: 'bureau*',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(3);
            done();
        });
    });
    it("It should retrieve 3 quotes with search string 'bureau%'", (done) => {
        const userData = {
            searchString: 'bureau%',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(3);
            done();
        });
    });
    it('It should retrieve 2 quotes with double quotation mark search "This is a"', (done) => {
        const userData = {
            searchString: '"This is a"',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(2);
            done();
        });
    });
    it("It should retrieve 2 quotes with search string 'born good'", (done) => {
        const userData = {
            searchString: 'born good',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(2);
            done();
        });
    });
    it('It should retrieve 1 quote with double quotation mark search "born good"', (done) => {
        const userData = {
            searchString: '"born good"',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(1);
            done();
        });
    });
    it("It should retrieve 1 quote with search string 'text?'", (done) => {
        const userData = {
            searchString: 'text?',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(1);
            done();
        });
    });
    it("It should retrieve 1 quote with search string 'text_'", (done) => {
        const userData = {
            searchString: 'text_',
        };
        chai
        .request(app)
        .post("/api/quotes/search")
        .send(userData)
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(1);
            done();
        });
    });

});