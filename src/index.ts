/*
 * @Author: huaiyu
 * @Date: 2019-08-06 12:43:39
 */

interface errorConfigInterface {
  [key: string]: {
    code: string;
    message: string;
    httpStatus: number;
  }
}

interface optionsInterface {
  code: string;
  message: string;
  httpStatus: number;
}

function generateErrorClass(errorConfig: errorConfigInterface, options: optionsInterface = {
  code: 'InternalServerError',
  message: 'internal server error',
  httpStatus: 500
}) {
  const ErrorClass = class extends Error {
    code: string = options.code;
    httpStatus: number = options.httpStatus;
    message: string = options.message;

    constructor(err?: Error | string, customMessage?: string) {
      super();
      Error.captureStackTrace(this, ErrorClass);

      if (customMessage) {
        this.message = `${this.message}: ${customMessage}`;
      }

      if (err instanceof Error) {
        this.message = `${this.message} << ${err.message}`;
        this.stack = `${this.stack}\n    --------\n${(err.stack as string).split('\n').slice(1).join('\n')}`;
      } else if (typeof err === 'string') {
        this.message = `${this.message}: ${err}`;
      }
    }
  }

  const error: {
    [key in keyof typeof errorConfig]: any
  } = {} as any;

  Object.keys(errorConfig).forEach(e => {
    const c = class extends ErrorClass {
      static code: string = errorConfig[e].code;
      static httpStatus: number = errorConfig[e].httpStatus;
      message: string;

      constructor(err?: any, customMessage?: string) {
        super(err);
        Error.captureStackTrace(this, c);

        this.message = customMessage ? `${errorConfig[e].message}: ${customMessage}` : errorConfig[e].message;
        this.code = errorConfig[e].code;
        this.httpStatus = errorConfig[e].httpStatus;

        if (err instanceof Error) {
          this.message = `${this.message} << ${err.message}`;
          this.stack = `${this.stack}\n    --------\n${(err.stack as string).split('\n').slice(1).join('\n')}`;
        } else if (typeof err === 'string') {
          this.message = `${this.message}: ${err}`;
        }

        return this;
      }
    };

    error[e] = c;
  });

  return {
    ErrorClass,
    error,
  }
}

export default generateErrorClass;
