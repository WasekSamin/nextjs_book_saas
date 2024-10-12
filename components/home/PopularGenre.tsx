import "@/css/home/PopularGenre.css";
import PopularGenreSlider from "./PopularGenreSlider";
import { useEffect, useState } from "react";
import MobilePopularGenreFilterModal from "./MobilePopularGenreFilter";


const PopularGenre = () => {
    const [showMobileGenreFilter, setShowMobileGenreFilter] = useState(true);

    const windowOnResize = () => {
        if (window.innerWidth > 767) {
            setShowMobileGenreFilter(false);
        } else {
            setShowMobileGenreFilter(true);
        }
    }

    useEffect(() => {
        windowOnResize();
        window.addEventListener("resize", windowOnResize);

        return () => {
            window.removeEventListener("resize", windowOnResize);
        }
    }, [])

    return (
        <div className="mt-10">
            <div className="grid grid-cols-2 items-center gap-x-5 pb-1 border-b border-theme">
                <h5 className="capitalize font-semibold text-lg md:text-xl">Popular by genre</h5>

                {
                    showMobileGenreFilter ?
                        <MobilePopularGenreFilterModal /> : <PopularGenreSlider />
                }
            </div>
        </div>
    )
}

export default PopularGenre