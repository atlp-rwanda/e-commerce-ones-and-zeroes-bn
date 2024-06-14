import validateProductReview from '../validations/validateProductReview';

describe('validateProductReview', () => {
  it('should throw an error if reviewComment is missing', () => {
    const review = { rating: 4 } as any;
    expect(() => validateProductReview(review)).toThrow('invalid review');
  });

  it('should throw an error if rating is missing', () => {
    const review = { reviewComment: 'Great product!' } as any;
    expect(() => validateProductReview(review)).toThrow('invalid review');
  });

  it('should throw an error if reviewComment is less than 5 characters', () => {
    const review = { reviewComment: 'Bad', rating: 3 };
    expect(() => validateProductReview(review)).toThrow(
      'review body should  be at least 5 characters long',
    );
  });

  it('should throw an error if rating is less than 0', () => {
    const review = { reviewComment: 'Not good', rating: -1 };
    expect(() => validateProductReview(review)).toThrow(
      'review rating should be in range[0-5]',
    );
  });

  it('should throw an error if rating is greater than 5', () => {
    const review = { reviewComment: 'Excellent!', rating: 6 };
    expect(() => validateProductReview(review)).toThrow(
      'review rating should be in range[0-5]',
    );
  });

  it('should not throw an error for a valid review', () => {
    const review = { reviewComment: 'Great product!', rating: 4 };
    expect(() => validateProductReview(review)).not.toThrow();
  });
});
