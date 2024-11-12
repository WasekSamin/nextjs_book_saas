import pb from '@/store/PocketbaseStore';
import { useUserStore } from '@/store/UserStore';
import Image from 'next/image'
import React from 'react'
import Avatar from 'react-avatar';
import { FiUpload } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip'

const ProfileImage = () => {
    const toggleIsUpdateProfilePic = useUserStore((state: any) => state.toggleIsUpdateProfilePic);

    return (
        <div className='flex flex-col gap-y-5'>
            <div onClick={() => toggleIsUpdateProfilePic(true)} data-tooltip-id="profile__picMainEl" data-tooltip-content="Upload profile pic" data-tooltip-place="bottom" className="mx-auto sm:mx-0 w-[80px] h-[80px] min-w-[80px] min-h-[80px] rounded-full cursor-pointer hover:opacity-70 transition-opacity duration-200 ease-linear">
                {
                    pb?.authStore?.model?.avatar ? 
                    <Image src={pb.files.getUrl(pb.authStore.model, pb.authStore.model.avatar, {'thumb': '80x80'})} width={80} height={80} className="w-full h-full rounded-full object-cover" alt="User Profile Image" />
                    : <Avatar name={pb?.authStore?.model?.name} round={true} size="80px" />
                }
            </div>
            <Tooltip id="profile__picMainEl" className="custom__tooltip" />

            <button type='button' onClick={() => toggleIsUpdateProfilePic(true)} className='flex sm:hidden items-center justify-center gap-x-1.5 px-3 py-2 rounded-md bg-teal-500 hover:bg-teal-600 transition-colors duration-200 ease-linear'>
                <FiUpload className='text-lg' />
                Upload Profile Pic
            </button>
        </div>
    )
}

export default ProfileImage