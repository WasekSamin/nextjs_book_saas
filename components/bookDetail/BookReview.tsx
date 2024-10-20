import BookReviewForm from "./BookReviewForm"
import Reviews from "./Reviews"

const BookReview = () => {
  return (
    <div className="flex flex-col gap-y-5">
      <h5 className='font-semibold text-xl md:text-2xl'>Submit Your Review</h5>

      <BookReviewForm />
      <Reviews />
    </div>
  )
}

export default BookReview