import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PopularGenreSliderButton = ({popularGenreSwiperRef, handleSlidePrevSlide, handleSlideNextSlide, showSliderButton}: any) => {
    const slideToPrev = () => {
        popularGenreSwiperRef.current.slidePrev();
        handleSlidePrevSlide();
    }

    const slideToNext = () => {
        popularGenreSwiperRef.current.slideNext();
        handleSlideNextSlide();
    }

    return (
        <div className="w-full absolute top-0 z-10">
            {
                showSliderButton.prevBtn &&
                <button className="absolute left-[-5%] flex items-center justify-center p-1 bg-indigo-400 rounded-full" type="button" onClick={slideToPrev}>
                    <FaChevronLeft />
                </button>
            }
            {
                showSliderButton.nextBtn &&
                <button className="absolute right-0 flex items-center justify-center p-1 bg-indigo-400 rounded-full" type="button" onClick={slideToNext}>
                    <FaChevronRight />
                </button>
            }
        </div>
    )
}

export default PopularGenreSliderButton