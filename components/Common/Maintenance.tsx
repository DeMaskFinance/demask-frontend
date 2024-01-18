import React, { useState } from 'react'
import { FixIcon } from '../Icons'
import { CgClose } from 'react-icons/cg'

const Maintenance = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div>
            {isOpen && (
                <div className='flex text-white gap-x-2 bg-gradient-to-b from-[#BA8DE6] to-[#7B54E8] justify-center items-center py-2 text-sm'>
                    <FixIcon width={24} height={24} />
                    <p>Maintenance in progress, block data might not be up to date</p>
                    <CgClose className="text-xl transition-colors duration-100 ease-linear cursor-pointer hover:text-red" onClick={() => setIsOpen(true)} />
                </div>)}
        </div>
    )
}

export default Maintenance
