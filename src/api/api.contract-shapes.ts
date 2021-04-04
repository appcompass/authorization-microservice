export const unauthorizedResponseOptions = {
  schema: {
    properties: {
      statusCode: {
        description: 'The response status code.',
        type: 'number'
      },
      message: {
        description: 'The response error message.',
        type: 'string'
      }
    }
  }
};

export const unprocessableEntityResponseOptions = {
  schema: {
    properties: {
      statusCode: {
        description: 'The Response HTTP Status Code.',
        type: 'number'
      },
      message: {
        type: 'array',
        description: 'The list of validation errors.',
        items: {
          properties: {
            target: {
              description: 'The request body of the failed validation.',
              type: 'object'
            },
            value: {
              description: 'the value of the property that failed validation.',
              oneOf: [
                {
                  type: 'string'
                },
                {
                  type: 'number'
                },
                {
                  type: 'boolean'
                },
                {
                  type: 'object'
                },
                {
                  type: 'array'
                }
              ]
            },
            property: {
              description: 'the name of the property that failed validation.',
              type: 'string'
            },
            children: {
              type: 'array'
            },
            constraints: {
              description: 'An object containing the error name as the key and error message as value',
              type: 'object'
            }
          }
        }
      },
      error: {
        description: 'The response error message.',
        type: 'string'
      }
    }
  }
};

export const notFoundResponseOptions = {
  schema: {
    properties: {
      statusCode: {
        description: 'The Response HTTP Status Code.',
        type: 'number'
      },
      message: {
        type: 'string'
      },
      error: {
        type: 'string'
      }
    }
  }
};
