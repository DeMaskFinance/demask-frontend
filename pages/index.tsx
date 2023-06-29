import { ethers } from 'ethers';
import  abiFactory  from '@/abi/abiFactory.json';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { getProvider } from '@/libs/connection/getProvider';


export default function Home() {
  const getDMLToken = async (nftAddress:string,idNFT:string,tokenAddress:string,wallet:string) => {
    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai');
    const factoryAddress = process.env.NEXT_PUBLIC_FACTORY || "";
    const contract = new ethers.Contract(factoryAddress, abiFactory, provider);
    console.log(contract);
    
    try {
      const result = await contract.getDmlToken(nftAddress,tokenAddress,idNFT);
      console.log(result);
      
      
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <Head>
        <title>Home | DeMask</title>
      </Head>
      <div onClick={()=>getDMLToken('0x4A90D5aE01F03B650cdc8D3A94358F364D98d096','3965474371','0x519d124e4F2E536f36Ce9f54ADd6CD3022C16c70',"MetaMask")}>
        HOME
      </div>

    </div>
  )
}
