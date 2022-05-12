import chai from "chai";
import chatHttp from "chai-http";
import "chai/register-should.js";
import app from "../server.js";
import { addRole, addTestCommentToTestQuoteWithUserId, addTestQuoteWithCertainText, addTestQuoteWithUserId, addTestUserWithUserId, dropCommentLikes, dropData, dropQuotes, dropRoles, dropUserRoles, dropUsers, getUserById, giveUserRole } from './testUtils.js';
import {dropComments } from './testUtils.js';
import jwtAuth from '../authentication/jwtAuthentication.js';

chai.use(chatHttp);

const { expect } = chai;

describe("Testing quote retrieval, addition, update, removal, liking:", () => {

    before(async () => {
        await dropUserRoles();
        await dropRoles();
        await dropCommentLikes();
        await dropComments();
        await dropQuotes();
        await dropUsers();
        await addRole(1,'user');
        await addRole(2,'moderator');
        await addRole(3,'admin');
        await addTestUserWithUserId(1);
        await addTestUserWithUserId(2);
        await addTestUserWithUserId(3);
        await addTestQuoteWithUserId(1,1);
        await addTestQuoteWithUserId(2,1);
        await addTestQuoteWithUserId(3,2);
        await giveUserRole(3,3);
    });

    it("It should retrieve all quotes (logged in)", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .get("/api/quotes/")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data).to.have.lengthOf(3);
                expect(res.body).to.include({ title:'Retrieved all quotes' });
                done();
            });
        })
    });
    it("It should retrieve all quotes (not logged in)", (done) => {
        chai
        .request(app)
        .get("/api/quotes/")
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(3);
            expect(res.body).to.include({ title:'Retrieved all quotes' });
            done();
        });
    });
    it("It should retrieve quote by ID (logged in)", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .get("/api/quotes/1")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title:'Retrieved quote' });
                expect(res.body.data).to.not.have.length;
                done();
            });
        })
    });
    it("It should retrieve quote by ID (not logged in)", (done) => {
        chai
        .request(app)
        .get("/api/quotes/1")
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.include({ title:'Retrieved quote' });
            expect(res.body.data).to.not.have.length;
            done();
        });
    });
    it("It should retrieve all quotes of user (logged in)", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .get("/api/quotes/user/1")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data).to.have.lengthOf(2);
                expect(res.body).to.include({ title: 'Retrieved users all quotes' });
                done();
            });
        })
    });
    it("It should retrieve all quotes of user (not logged in)", (done) => {
        chai
        .request(app)
        .get("/api/quotes/user/1")
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(2);
            expect(res.body).to.include({ title: 'Retrieved users all quotes' });
            done();
        });
    });
    it("It should retrieve quotes for the carousel (logged in)", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .get("/api/quotes/carousel")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Retrieved the quotes for the carousel" });
                done();
            });
        })
    });
    it("It should retrieve quotes for the carousel (not logged in)", (done) => {
        chai
        .request(app)
        .get("/api/quotes/carousel")
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.include({ title: "Retrieved the quotes for the carousel" });
            done();
        });
    });
    it("It should retrieve the most recent quotes (logged in)", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .get("/api/quotes/recent")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body.data[0].id).to.equal(3);
                expect(res.body).to.include({ title: "Retrieved the most recent quotes" });
                done();
            });
        })
    });
    it("It should retrieve the most recent quotes (not logged in)", (done) => {
        chai
        .request(app)
        .get("/api/quotes/recent")
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data[0].id).to.equal(3);
            expect(res.body).to.include({ title: "Retrieved the most recent quotes" });
            done();
        });
    });

    it("It should not post a quote when quote data is missing", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {};
            chai
            .request(app)
            .post("/api/quotes/")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.include({ title: "Missing quote data" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not post a quote when quote data is not valid", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                data: {
                    quotetext: 'Control the memes, control the planet',
                    said_by: '',
                    location: 'Internet',
                },                
            };
            chai
            .request(app)
            .post("/api/quotes/")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.include({ said_by: "Name must be 1-50 characters!"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should post a quote", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                data: {
                    quotetext: 'Control the memes, control the planet',
                    said_by: 'Moon Man',
                    location: 'Internet',
                },                
            };
            chai
            .request(app)
            .post("/api/quotes/")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Quote created."});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should update a quote", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = { quote: {
                quotetext: 'Quote updated by user 1',
                said_by: 'User 1',
            }
            };
            chai
            .request(app)
            .put("/api/quotes/1")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Updated quote"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should like a quote", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 1};
            chai
            .request(app)
            .post("/api/quotes/like/2")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({title: "Like/dislike added"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should preserve quote like status", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 1};
            chai
            .request(app)
            .post("/api/quotes/like/2")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({title: "Requested status is the same as in database"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should flip quote like status", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: -1};
            chai
            .request(app)
            .post("/api/quotes/like/2")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({title: "Like status changed"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should remove previous like/dislike", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 0};
            chai
            .request(app)
            .post("/api/quotes/like/2")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({title: "Removed previous like/dislike"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should preserve neutral like status of quote", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 0};
            chai
            .request(app)
            .post("/api/quotes/like/2")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({title: "No like/dislike on quote"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not delete a quote from other user", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/quotes/1")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.include({ title: "Unauthorized"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should delete user's own quote", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/quotes/1")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Deleted quote"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should delete other user's quote as admin", (done) => {
        getUserById(3)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/quotes/2")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Deleted quote"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not delete a quote that doesn't exist", (done) => {
        getUserById(3)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/quotes/2")
            .set('Authorization', accessToken)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.include({title: "Quote not found"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not like a quote that doesn't exist", (done) => {
        getUserById(3)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 1};
            chai
            .request(app)
            .post("/api/quotes/like/2")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                expect(res.body).to.include({quoteId: "Quote with specified id not found"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });


});