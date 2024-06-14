interface Review {
  reviewComment: string;
  rating: number;
}

export default function validateProductReview(review: Review) {
  if (!review.reviewComment || !review.rating) {
    throw new Error('invalid review');
  }
  if (review.reviewComment.length < 5) {
    throw new Error('review body should  be at least 5 characters long');
  }
  if (review.rating < 0 || review.rating > 5) {
    throw new Error('review rating should be in range[0-5]');
  }
}
