import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = false;

describe('## Accounts API', () => {
  describe('# POST /accounts/login', () => {
    it('should not authenticate the user', (done) => {
      request(app)
        .post('/api/accounts/login')
        .send({
          username: 'Sergio11',
          password: 'sergio11Bisite'
        })
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Username or password invalid.');
          done();
        }).catch(err => {
          console.error('ERROR : ', err.response.text);
          done();
        });
    });
  });
});
