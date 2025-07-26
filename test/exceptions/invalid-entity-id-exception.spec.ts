import { InvalidEntityIdException } from '../../src/common/exceptions/invalid-entity-id-exception';

describe('InvalidEntityIdException', () => {
  it('should have valid error message', () => {
    const entities = ['User', 'Product', 'Category'];

    for (const entity of entities) {
      const exception = new InvalidEntityIdException(entity);
      const expectedMessage = `${entity} with such id not found`;

      expect(exception.message).toEqual(expectedMessage);
    }
  });
});
