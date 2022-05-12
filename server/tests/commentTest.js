import chai from "chai";
import chatHttp from "chai-http";
import "chai/register-should.js";
import app from "../server.js";
import { addRole, addTestCommentToTestQuoteWithUserId, addTestQuoteWithUserId, addTestUserWithUserId, dropCommentLikes, dropData, dropQuotes, dropRoles, dropUserRoles, dropUsers, getUserById, giveUserRole } from './testUtils.js';
import {dropComments } from './testUtils.js';
import jwtAuth from '../authentication/jwtAuthentication.js';

chai.use(chatHttp);

const { expect } = chai;

describe("Testing commentController:", () => {

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
        await addTestCommentToTestQuoteWithUserId(1,1,1);
        await addTestCommentToTestQuoteWithUserId(2,1,2);
        await giveUserRole(3,3);
    });

    it("It should not post an empty comment", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                comment: "",
                posted: new Date(),
                user_id: 1,
                quoteId: 1,
            };
            chai
            .request(app)
            .post("/api/comments/")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not post comment when quote ID is missing", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                comment: "Test comment",
                posted: new Date(),
                user_id: 1,
            };
            chai
            .request(app)
            .post("/api/comments/")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should post a new comment", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                comment: "Test comment",
                posted: new Date(),
                user_id: 1,
                quoteId: 1,
            };
            chai
            .request(app)
            .post("/api/comments/")
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Posted comment", id: res.body.id });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });        
    });
    it("It should get comments of quote when logged in", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .get("/api/comments/quote/1")
            .set('Authorization', accessToken)
            .end((err,res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({title: "Retrieved comments for the quote", data: res.body.data});                
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should get comments of quote when not logged in", (done) => {
        chai
        .request(app)
        .get("/api/comments/quote/1")
        .end((err,res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.include({title: "Retrieved comments for the quote", data: res.body.data});
            done();
        });
    });
    it("It should update comment when owner", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                comment: "Updated comment",
            };
            chai
            .request(app)
            .put("/api/comments/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);                
                //expect(res.body).to.include([]);
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not update comment when not owner", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                comment: "Updated other user's comment",
            };
            chai
            .request(app)
            .put("/api/comments/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.include({ title: "Unauthorized" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not update comment that doesn't exist", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {
                comment: "Updated comment",
            };
            chai
            .request(app)
            .put("/api/comments/"+3)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.include({ title: "Comment not found " });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not like a comment that doesn't exist", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 1};
            chai
            .request(app)
            .post("/api/comments/like/"+3)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(400);
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should like a comment that is not already liked", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 1};
            chai
            .request(app)
            .post("/api/comments/like/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Like/dislike added" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should preserve the like status in a comment that is already liked", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 1};
            chai
            .request(app)
            .post("/api/comments/like/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Requested status is the same as in database" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should change like to dislike in a comment that is liked", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: -1};
            chai
            .request(app)
            .post("/api/comments/like/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Like status changed" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should remove like from liked/disliked comment", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 0};
            chai
            .request(app)
            .post("/api/comments/like/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Removed previous like/dislike" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should preserve the 'neutral' like status in a comment", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            const userData = {likeStatus: 0};
            chai
            .request(app)
            .post("/api/comments/like/"+1)
            .set('Authorization', accessToken)
            .send(userData)
            .end((err, res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "No like/dislike on comment" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not delete a comment that doesn't exist", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/comments/"+3)
            .set('Authorization', accessToken)
            .end((err,res) => {
                expect(res.status).to.equal(404);
                expect(res.body).to.include({ title: "Comment not found" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        });
    });
    it("It should not delete a comment that belongs to other user", (done) => {
        getUserById(2)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/comments/"+1)
            .set('Authorization', accessToken)
            .end((err,res) => {
                expect(res.status).to.equal(401);
                expect(res.body).to.include({ title: "Unauthorized" });
                done();
            });
        })
        .catch(err => {
            console.log(err);
        })
    });
    it("It should delete a comment that belongs to the user", (done) => {
        getUserById(1)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/comments/"+1)
            .set('Authorization', accessToken)
            .end((err,res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Deleted comment"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        })
    });
    it("It should delete a comment as admin", (done) => {
        getUserById(3)
        .then(user => {
            const {accessToken, refreshToken} = jwtAuth.createTokens(user);
            chai
            .request(app)
            .delete("/api/comments/"+2)
            .set('Authorization', accessToken)
            .end((err,res) => {
                expect(res.status).to.equal(200);
                expect(res.body).to.include({ title: "Deleted comment"});
                done();
            });
        })
        .catch(err => {
            console.log(err);
        })
    });


});