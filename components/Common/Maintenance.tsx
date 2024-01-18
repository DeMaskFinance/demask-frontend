import React, { useState } from 'react'
import { FixIcon } from '../Icons'
import { CgClose } from 'react-icons/cg'

const Maintenance = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
        <div>
            {isOpen && (
                <div className='flex text-white gap-x-2 bg-gradient-to-b from-[#BA8DE6] to-[#7B54E8] justify-center items-center py-2 text-sm'>
                    <FixIcon width={24} height={24} />
                    <p>Block data was updated at block: 223264365, but it's 10 blocks behind.</p>
                    <CgClose className="text-xl transition-colors duration-100 ease-linear cursor-pointer hover:text-red" onClick={() => setIsOpen(false)} />
                </div>)}
        </div>
    )
}

export default Maintenance
