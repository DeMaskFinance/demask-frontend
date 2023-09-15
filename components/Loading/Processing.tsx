import React from 'react'
import Button from '../Buttons/Button'
import { BiLoaderAlt } from "react-icons/bi";
export default function Processing() {
    return (
        <Button className="flex items-center w-[140px] justify-center py-2 absolute top-0" primary disabled>
            Processing   
            <BiLoaderAlt width={10} height={10} className='ml-2 animate-spin'/>
        </Button>
    )
}
