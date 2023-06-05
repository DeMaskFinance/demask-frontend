import React from "react";

interface ModalWalletProps {
    isVisible?:boolean;
}
 
const ModalWallet: React.FC<ModalWalletProps> = (props) => {
    return ( 
        <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
            <div className="w-[600px] h-[300px] bg-white text-black text-center">
                <p>anc</p>
                
            <button onClick={()=>{console.log("abc")}}>abc</button>
            </div>
        </div>
     );
}
 
export default ModalWallet;