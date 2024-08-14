const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'solution');
              assert.isString(res.body.solution);
              done();
            });
        });
    
        test('Solve a puzzle with missing puzzle string', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Required field missing');
              done();
            });
        });
    
        test('Solve a puzzle with invalid characters', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({ puzzle: 'AA9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Invalid characters in puzzle');
              done();
            });
        });
    
        test('Solve a puzzle with incorrect length', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({ puzzle: '..9..5.1.85.4....2432...' }) // Less than 81 characters
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            });
        });
    
        test('Solve a puzzle that cannot be solved', (done) => {
          chai
            .request(server)
            .post('/api/solve')
            .send({ puzzle: '9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' }) // Duplicate 9s in row
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Puzzle cannot be solved');
              done();
            });
        });
      });
    
      suite('POST /api/check', () => {
        const validPuzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    
        test('Check a puzzle placement with all fields', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, coordinate: 'A2', value: '7' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'valid');
              assert.isTrue(res.body.valid);
              done();
            });
        });
    
        test('Check a puzzle placement with single placement conflict', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, coordinate: 'A1', value: '5' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'valid');
              assert.isFalse(res.body.valid);
              assert.property(res.body, 'conflict');
              assert.isArray(res.body.conflict);
              assert.include(res.body.conflict, 'column');
              done();
            });
        });
    
        test('Check a puzzle placement with multiple placement conflicts', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, coordinate: 'A1', value: '8' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'valid');
              assert.isFalse(res.body.valid);
              assert.property(res.body, 'conflict');
              assert.isArray(res.body.conflict);
              assert.include(res.body.conflict, 'column');
              assert.include(res.body.conflict, 'region');
              done();
            });
        });
    
        test('Check a puzzle placement with all placement conflicts', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, coordinate: 'A2', value: '5' })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'valid');
              assert.isFalse(res.body.valid);
              assert.property(res.body, 'conflict');
              assert.isArray(res.body.conflict);
              assert.include(res.body.conflict, 'row');
              assert.include(res.body.conflict, 'column');
              assert.include(res.body.conflict, 'region');
              done();
            });
        });
    
        test('Check a puzzle placement with missing required fields', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, value: '9' }) // Missing coordinate
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Required field(s) missing');
              done();
            });
        });
    
        test('Check a puzzle placement with invalid characters', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle.replace('.', 'A'), coordinate: 'A1', value: '9' }) // Invalid character
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Invalid characters in puzzle');
              done();
            });
        });
    
        test('Check a puzzle placement with incorrect length', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: '123456789', coordinate: 'A1', value: '9' }) // Incorrect length
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
              done();
            });
        });
    
        test('Check a puzzle placement with invalid placement coordinate', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, coordinate: 'Z1', value: '9' }) // Invalid coordinate
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Invalid coordinate');
              done();
            });
        });
    
        test('Check a puzzle placement with invalid placement value', (done) => {
          chai
            .request(server)
            .post('/api/check')
            .send({ puzzle: validPuzzle, coordinate: 'A1', value: '0' }) // Invalid value
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.property(res.body, 'error');
              assert.equal(res.body.error, 'Invalid value');
              done();
            });
        });
      });

});

