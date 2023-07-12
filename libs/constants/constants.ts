import {MaticIcon,USDCIcon,USDTIcon} from '../../components/Icons'
const tokenDefault = [
    {
        name:"Polygon",
        symbol:"MATIC",
        address:"MATIC",
        logo:MaticIcon,
    },
    {
        name:"Tether",
        symbol:"USDT",
        address:"0x4A90D5aE01F03B650cdc8D3A94358F364D98d096",
        logo:USDTIcon,
    },
    {
        name:"USDC",
        symbol:"USDC",
        address:"0x8d03ae448B76C089EAEDa30aAABC9D2A9C55d2A1",
        logo:USDCIcon,
    },
    
]

const amountNFT = [
    {
      id: 1,
      value: "1",
    },
    {
      id: 2,
      value: "2",
    },
    {
      id: 3,
      value: "5",
    },
    {
      id: 4,
      value: "10",
    },
    {
      id: 5,
      value: "CUSTOM",
    },
  ];
export {tokenDefault,amountNFT}