import "@/css/home/PopularGenre.css";
import PopularGenreSlider from "./PopularGenreSlider";
import { useEffect, useState } from "react";
import MobilePopularGenreFilterModal from "./MobilePopularGenreFilter";
import PopularGenreBooks from "./PopularGenreBooks";


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
        <div className="mt-20">
            <div className="grid grid-cols-2 items-center gap-x-5 pb-1 border-b border-theme">
                <h5 className="capitalize font-semibold text-lg md:text-xl">Popular by genre</h5>

                {
                    showMobileGenreFilter ?
                        <MobilePopularGenreFilterModal /> : <PopularGenreSlider />
                }
            </div>
            <PopularGenreBooks />
        </div>
    )
}

export default PopularGenre