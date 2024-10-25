import Link from "next/link"
import { FaPhone } from "react-icons/fa"
import { MdAlternateEmail } from "react-icons/md"

const RequestBookExtraInfo = ({msg}: {msg: string}) => {
    return (
        <div className='flex flex-col gap-y-5'>
            <h5 className='text-xl font-semibold text-center sm:text-left'>OR</h5>
            <p>{msg}</p>

            <div className='flex flex-col gap-y-3'>
                <div className='flex items-center gap-x-5'>
                    <div className='p-2 rounded-md theme-block text-base'>
                        <FaPhone />
                    </div>
                    <div className='flex flex-col gap-y-1.5'>
                        <p className='text-xs'>Phone/Whatsapp</p>
                        <Link href="https://wa.me/+8801688459216" target="_blank" className='font-semibold text-base'>(+880) 1688459216</Link>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-y-3 break-all'>
                <div className='flex items-center gap-x-5'>
                    <div className='p-2 rounded-md theme-block text-base'>
                        <MdAlternateEmail />
                    </div>
                    <div className='flex flex-col gap-y-1.5'>
                        <p className='text-xs'>Email Address</p>
                        <Link href="mailto:wasek.samin47@gmail.com" target="_blank" className='font-semibold text-base'>wasek.samin47@gmail.com</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestBookExtraInfo