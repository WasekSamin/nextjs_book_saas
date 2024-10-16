import { GENRES } from "@/data"
import Link from "next/link"

const Genre = () => {
    return (
        <div className="flex flex-col gap-y-5 mt-5">
            <h5 className="text-xl md:text-2xl font-semibold">Tagged Genres</h5>
            <div className="flex flex-wrap gap-3">
                {
                    GENRES?.map(genre => (
                        <Link href={`/author/${genre.id}`} className="whitespace-nowrap text-center flex-1 border border-theme px-5 py-1.5 rounded-full hover:bg-indigo-500 hover:text-light transition-colors duration-200 ease-linear">
                            {genre.title}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Genre