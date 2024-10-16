import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FavouriteBookSliderButton = ({favouriteBookSwiperRef, handleSlidePrevSlide, handleSlideNextSlide}: any) => {
    const slideToPrev = () => {
        favouriteBookSwiperRef.current.slidePrev();
        handleSlidePrevSlide();
    }

    const slideToNext = () => {
        favouriteBookSwiperRef.current.slideNext();
        handleSlideNextSlide();
    }

    return (
        <div className="mt-5 flex items-center justify-end gap-x-3">
            <button className="flex items-center justify-center p-1 bg-indigo-500 hover:bg-indigo-600 text-light rounded-full transition-colors duration-200 ease-linear" type="button" onClick={slideToPrev}>
                <FaChevronLeft />
            </button>
            <button className="flex items-center justify-center p-1 bg-indigo-500 hover:bg-indigo-600 text-light rounded-full transition-colors duration-200 ease-linear" type="button" onClick={slideToNext}>
                <FaChevronRight />
            </button>
        </div>
    )
}

export default FavouriteBookSliderButton