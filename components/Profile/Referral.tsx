import React, { useContext } from 'react'
import { Button } from '../Buttons';
import AccountContext from '@/context/AccountContext';
import { toast } from 'react-toastify';
const Referral = () => {
    const { account, chainId } = useContext(AccountContext);
    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://demask.finance/referral?sponsor=${account}&chain=${chainId}`)
        toast.success(
            'Copied',
            {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }
        );
    }
    return (
        <div className='w-[70%] p-2 border rounded-lg border-dark2 text-dark2 flex flex-col gap-y-2'>
            <p>Invite your friend to DEMASK, if they sign up</p>
            <h1 className='font-semibold'>Refer Friends To Earn</h1>
            <p>Experience a new way of earning rewards by inviting your friends to join DeMask & earn up to 10% commission every time they trade on DeMask.</p>
            <div className=''>
                <div className='w-[75%] mr-4 p-2 mb-4 border rounded-lg border-dark3'>{account}</div>
                <Button className='p-2' primary onClick={copyToClipboard}>COPY CODE</Button>
            </div>
            {/* <h2 className='font-semibold'>Share the referral link</h2> */}
            {/* <p>You can also share your referral link by copying and sending it.</p>
            <div>
                <input type="text" placeholder='abcdexstools' className='w-[75%] mr-4 p-2 mb-4 border rounded-lg border-dark3'/>
                <Button className='p-2' primary>COPY CODE</Button>
            </div> */}
        </div>
    )
}

export default Referral;
