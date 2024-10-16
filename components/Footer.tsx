import Link from "next/link";
import "@/css/Footer.css";

const Footer = () => {
    return (
        <>
            <div className="theme-block">
                <div className="base-layout container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="flex flex-col gap-y-5">
                            <div>
                                <Link href="/" className="whitespace-nowrap text-xl md:text-3xl font-semibold italic">E-Books</Link>
                            </div>
                            <p>E-Books is a platform where you can download/read/purchase your favourite books.</p>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            <h5 className="font-semibold text-xl md:text-3xl italic">Quick Links</h5>
                            <ul className="flex flex-col gap-y-3">
                                <li className="w-fit link__hover">
                                    <Link href="/">Home</Link>
                                    <div className="w-0 h-[2px] bg-indigo-400 transition-width duration-200 ease-linear nav__linkBorder"></div>
                                </li>
                                <li className="w-fit link__hover">
                                    <Link href="/profile">Profile</Link>
                                    <div className="w-0 h-[2px] bg-indigo-400 transition-width duration-200 ease-linear nav__linkBorder"></div>
                                </li>
                                <li className="w-fit link__hover">
                                    <Link href="/request-book">Request Book</Link>
                                    <div className="w-0 h-[2px] bg-indigo-400 transition-width duration-200 ease-linear nav__linkBorder"></div>
                                </li>
                                <li className="w-fit link__hover">
                                    <Link href="/help">Need Any Help?</Link>
                                    <div className="w-0 h-[2px] bg-indigo-400 transition-width duration-200 ease-linear nav__linkBorder"></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-500 text-white py-1.5 text-xs text-center">
                <p>&copy; {new Date().getFullYear()} Created by <Link target="_blank" href="https://waseksamin.vercel.app/">Wasek Samin</Link>.</p>
            </div>
        </>
    )
}

export default Footer