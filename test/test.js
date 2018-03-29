const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });

    it('should list items on GET', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = ['author', 'content', 'id', 'publishDate', 'title'];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it('should add a post on POST', function() {
        const newPost = {
            title: 'brand new post',
            author: 'me',
            content: 'lalala',
            publishDate: Date.now()
        };
        return chai.request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                res.body.should.include.keys('title', 'author', 'content', 'id', 'publishDate');
                expect(res.body).to.not.equal(newPost.title);
            });
    });

    it('should update post on PUT', function() {

        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                const updatePost = Object.assign(res.body[0], {
                    title: 'titlex2',
                    content: 'contentx2'
                });
                return chai.request(app)
                    .put(`/blog-posts/${res.body[0].id}`)
                    .send(updatePost)
                    .then(function(res) {
                        expect(res).to.have.status(204);
                    });
            });
    });

    it('should delete posts on DELETE', function() {
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});