const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blogs', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  
  it('should list blogs on GET', function() {
    return chai.request(app)
      .get('/blog')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        const expectedKeys = ['id', 'title', 'content', 'author'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });
  
  it('should add a blog on POST', function() {
    const newItem = {title: 'On Being a Real One', content: 'On Being a Real One for those who arent', author: 'Meron'};
    return chai.request(app)
      .post('/blog')
      .send(newItem)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content', 'author');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newItem, {id: res.body.id}, {publishDate: res.body.publishDate}));
      });
  });

  it('should update blogs on PUT', function() {
    
    return chai.request(app)
      .get('/blog')
      .then(function(res) {
        const updateData = Object.assign(res.body[0], {
          title: 'From Good to Great',
          content: 'How to go from good to great',
          author: 'Meron'
        });
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog/${res.body[0].id}`)
          .send(updateData)
        .then(function(res) {
          res.should.have.status(204);
          res.body.should.be.a('object');
          res.body.should.deep.equal(updateData);
          res.should.be.json;
          })
      });
  });
  
  it('should delete blog on DELETE', function() {
    return chai.request(app)
      .get('/blog')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});

