import * as c from 'chai';

var chaiHttp = require('chai-http');
var server = require('../server/app');
var should = chai.should();

chai.use(chaiHttp);

describe('Ingestion for App Center analytics', () => {
  it('should accept my custom StartSessionLog', () => {

  });
  it('should accept my custom EventLog', () => {
    
  });
});