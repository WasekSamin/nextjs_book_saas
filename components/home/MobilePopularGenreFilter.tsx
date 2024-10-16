import { useGenreStore } from "@/store/GenreStore"
import { IoFilterOutline } from "react-icons/io5"
import PopularGenreFilterModal from "./PopularGenreFilterModal";
import { AnimatePresence } from "framer-motion";

const MobilePopularGenreFilterModal = () => {
  const showGenreModal = useGenreStore((state: any) => state.showGenreModal);
  const updateShowGenreModal = useGenreStore((state: any) => state.updateShowGenreModal);

  return (
    <>
      <div className="ml-auto">
        <button onClick={() => updateShowGenreModal(true)} type="button" className="theme-block flex items-center gap-x-2 px-3 py-1 rounded-md">
          <IoFilterOutline /> Filter
        </button>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {
          showGenreModal &&
          <PopularGenreFilterModal />
        }
      </AnimatePresence>
    </>
  )
}

export default MobilePopularGenreFilterModal