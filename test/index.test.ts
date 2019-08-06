/*
 * @Author: huaiyu
 * @Date: 2019-08-06 14:05:17
 */

import * as assert from 'assert';
import generateErrorClass from '../src/index';

describe('test/index.test.ts', () => {
  const errorConfig = {
    MissingToken: {
      code: 'MissingParameter.MissingToken',
      httpStatus: 400,
      message: '缺少用户信息',
    },

    InvalidToken: {
      code: 'InvalidParameter.InvalidToken',
      httpStatus: 401,
      message: '无效 token',
    },

    InvalidSign: {
      code: 'Unauthorized.InvalidSign',
      httpStatus: 401,
      message: '无效 sign',
    },

    NotFound: {
      code: 'NotFound',
      httpStatus: 404,
      message: '资源不存在',
    },
  };
  const { ErrorClass, error } = generateErrorClass(errorConfig, {
    code: 'InternalServerError',
    message: 'internal server error',
    httpStatus: 500 
  });

  it('create error with ErrorClass', () => {
    const err = new ErrorClass();

    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, 'InternalServerError');
    assert.strictEqual(err.message, 'internal server error');
    assert.strictEqual(err.httpStatus, 500);
  });

  it('create error with ErrorClass: append custom error message', () => {
    const err = new ErrorClass('custom error message');

    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, 'InternalServerError');
    assert.strictEqual(err.message, 'internal server error: custom error message');
    assert.strictEqual(err.httpStatus, 500); 
  });

  it('create error with ErrorClass: previous error', () => {
    const previousErr = new Error('previous error message');
    const err = new ErrorClass(previousErr);

    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, 'InternalServerError');
    assert.strictEqual(err.message, 'internal server error << previous error message');
    assert.strictEqual(err.httpStatus, 500);
    assert.strictEqual((err.stack as string).indexOf((previousErr.stack as any).split('\n').slice(1).join('\n')) !== -1, true);
  });

  it('create error with ErrorClass: previous error and append custom error message', () => {
    const previousErr = new Error('previous error message');
    const err = new ErrorClass(previousErr, 'custom error message');

    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, 'InternalServerError');
    assert.strictEqual(err.message, 'internal server error: custom error message << previous error message');
    assert.strictEqual(err.httpStatus, 500);
    assert.strictEqual((err.stack as string).indexOf((previousErr.stack as any).split('\n').slice(1).join('\n')) !== -1, true);
  });

  it('create error with errorConfig', () => {
    const err = new error.MissingToken();

    assert.strictEqual(err instanceof ErrorClass, true);
    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, errorConfig.MissingToken.code);
    assert.strictEqual(err.message, errorConfig.MissingToken.message);
    assert.strictEqual(err.httpStatus, errorConfig.MissingToken.httpStatus);
  });

  it('create error with errorConfig: append custom error message', () => {
    const err = new error.MissingToken('custom error message');

    assert.strictEqual(err instanceof ErrorClass, true);
    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, errorConfig.MissingToken.code);
    assert.strictEqual(err.message, `${errorConfig.MissingToken.message}: custom error message`);
    assert.strictEqual(err.httpStatus, errorConfig.MissingToken.httpStatus);
  });

  it('create error with errorConfig: previous error', () => {
    const previousErr = new Error('previous error message')
    const err = new error.MissingToken(previousErr);

    assert.strictEqual(err instanceof ErrorClass, true);
    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, errorConfig.MissingToken.code);
    assert.strictEqual(err.message, `${errorConfig.MissingToken.message} << previous error message`);
    assert.strictEqual(err.httpStatus, errorConfig.MissingToken.httpStatus);
    assert.strictEqual((err.stack as string).indexOf((previousErr.stack as any).split('\n').slice(1).join('\n')) !== -1, true);
  });

  it('create error with errorConfig: previous error and append custom error message', () => {
    const previousErr = new Error('previous error message')
    const err = new error.MissingToken(previousErr, 'custom error message');

    assert.strictEqual(err instanceof ErrorClass, true);
    assert.strictEqual(err instanceof Error, true);
    assert.strictEqual(err.code, errorConfig.MissingToken.code);
    assert.strictEqual(err.message, `${errorConfig.MissingToken.message}: custom error message << previous error message`);
    assert.strictEqual(err.httpStatus, errorConfig.MissingToken.httpStatus);
    assert.strictEqual((err.stack as string).indexOf((previousErr.stack as any).split('\n').slice(1).join('\n')) !== -1, true);
  });

});

