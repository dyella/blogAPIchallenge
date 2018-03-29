const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

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
                expect(res).to.be.an('array');
            });
    });

    it('should add a post on POST', function() {
        const newPost = {title: 'brand new post', content: 'lalala', author: 'me'};
        return chai.request(app)
            .post('/blog-posts')
            .send(newPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.include.keys('id', 'title', 'author', 'content', 'date');
                expect(res.body).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.is}));
            });
    });

    it('should update post on PUT', function() {
        const updatePost = {
            title: 'titlex2',
            content: 'contentx2',
            author: 'authorx2',
        };

        return chai.request(app)
            .get('/blog-posts')
            .then(function(res) {
                updatePost.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updatePost.id}`)
                    .send(updatePost);
            })

            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.an('object');
                expect(res.body).to.deep.equal(updatePost);
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