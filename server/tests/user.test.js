import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = false;

describe('## User APIs', () => {
  let user = {
    fullname: 'Sergio Sánchez Sánchez',
    username: 'Sergio11',
    password: 'sergio11Bisite',
    biography: 'Sergio es DIOS',
    email: 'sss4esob@gmail.com',
    mobileNumber: '673445695'
  };

  describe('# POST /api/users', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users')
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.fullname).to.equal(user.fullname);
          expect(res.body.username).to.equal(user.username);
          expect(res.body.website).to.equal(user.website);
          expect(res.body.biography).to.equal(user.biography);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          user._id = res.body._id;
          done();
        }).catch(err => {
          console.error("ERROR : ", err.response.text);
        });
    });
  });


  describe('# GET /api/users/:userId', () => {
    it('should get user details', (done) => {
      request(app)
        .get(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.fullname).to.equal(user.fullname);
          expect(res.body.username).to.equal(user.username);
          expect(res.body.website).to.equal(user.website);
          expect(res.body.biography).to.equal(user.biography);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        }).catch(err => {
          console.error("ERROR : ", err.response.text);
        });
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Not Found');
          done();
        }).catch(err => {
          console.error("ERROR : ", err.response.text);
        });
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', (done) => {
      user.username = 'KK';
      request(app)
        .put(`/api/users/${user._id}`)
        .send(user)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.fullname).to.equal(user.fullname);
          expect(res.body.username).to.equal('KK');
          expect(res.body.website).to.equal(user.website);
          expect(res.body.biography).to.equal(user.biography);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        }).catch(err => {
          console.error("ERROR : ", err.response.text);
        });
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        }).catch(err => {
          console.error("ERROR : ", err.response.text);
        });
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/${user._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.fullname).to.equal(user.fullname);
          expect(res.body.username).to.equal('KK');
          expect(res.body.website).to.equal(user.website);
          expect(res.body.biography).to.equal(user.biography);
          expect(res.body.email).to.equal(user.email);
          expect(res.body.mobileNumber).to.equal(user.mobileNumber);
          done();
        }).catch(err => {
          console.error("ERROR : ", err.response.text);
        });
    });
  });
});

/*

const comparison = bcrypt.compareSync(user.password, res.body.password);
expect(comparison).to.equal(true);
*/
