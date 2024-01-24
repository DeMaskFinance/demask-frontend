import Image from 'next/image'
import React from 'react'
const styles = {
    btn: 'py-2 px-4 text-sm font-semibold border rounded-lg border-secondary2 text-secondary2'
}
interface LogoProps {
    urlPNG: string;
    urlSVG: string;
}
interface LogoListProps {
    listArray: LogoProps[];
    titleMain: string;
    direction?: string;
    isPadding?: boolean
}
const Branding = () => {
    const colorList = [
        {
            color: 'purple',
            title: 'Demask Purple',
            colorHex: '#7413DC'
        },
        {
            color: 'secondary5',
            title: 'Key Purple',
            colorHex: '#9075FE'
        },
        {
            color: 'secondary1',
            title: 'Primary Purple',
            colorHex: '#514199'
        },
        {
            color: 'dark0',
            title: 'Dark Hole',
            colorHex: '#000D34'
        },
        {
            color: 'white',
            title: 'White Fox',
            colorHex: '#FFFFFF',
            border: true,
        },
    ]
    const primaryLogo: LogoProps[] = [
        {
            urlPNG: 'https://file.demask.finance/a7740820bb45fa8a37ab2a2cf6df4045.png',
            urlSVG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/04a6acf3290a56e1bc496d0cabf41872.png',
            urlSVG: 'https://file.demask.finance/fc7d7ce0df4d88eb981d2e8a8a6122fe.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/96426d74e23264e4061dca1f11a260f7.png',
            urlSVG: 'https://file.demask.finance/e9c9af378986ef2d49b409468bdb1710.svg',
        }
    ]
    const secondLogo: LogoProps[] = [
        {
            urlPNG: 'https://file.demask.finance/2765f37b25580e8c126d6b35115d521e.png',
            urlSVG: 'https://file.demask.finance/96e15ae63b1b199ef2ea94a11afdce9e.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/aa00b81c1113b3aee01d4ac789e66b21.png',
            urlSVG: 'https://file.demask.finance/32822c4cf42d70c3f825e63bfd877319.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/b21b9eb573fa7baa2e2b639ca3adb129.png',
            urlSVG: 'https://file.demask.finance/cfbf033604efa5bff6238c13d1ccba15.svg',
        }
    ]
    const logoMark: LogoProps[] = [
        {
            urlPNG: 'https://file.demask.finance/128f7145893aedad86273fe8ab8519fc.png',
            urlSVG: 'https://file.demask.finance/f90715665a6e1a824a502c5f4495ffac.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/dc91816c3d6703b2cd510943f0747c58.png',
            urlSVG: 'https://file.demask.finance/25d846a743e31b7085e9e90b7c4f2461.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/d1300994092072ba65bd8761f84c0e92.png',
            urlSVG: 'https://file.demask.finance/8ff826c8e14e14c49e33c5b177d3abce.svg',
        }
    ]
    const Logo: React.FC<LogoListProps> = ({ listArray, titleMain, direction, isPadding }) => {
        return (
            <div>
                <h2 className='title mt-14'>{titleMain}</h2>
                <h3 className='mb-4 font-semibold text-secondary5'>{direction}</h3>
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-x-11 ${isPadding && 'lg:px-[134px] px-10'} gap-y-8`}>
                    {listArray.map((item, index) => (
                        <div key={index}>
                            <Image alt='Primary Logo' width={400} height={150} src={item.urlSVG} className='object-cover w-full' />
                            <div className='flex justify-center mt-2 gap-x-4'>
                                <a href={item.urlPNG} target="_blank" rel="noopener noreferrer">
                                    <button className={styles.btn}>PNG</button>
                                </a>
                                <a href={item.urlSVG} target="_blank" rel="noopener noreferrer">
                                    <button className={styles.btn}>SVG</button>
                                </a>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
        )
    }
    return (
        <div>
            <h2 className='mb-4 title'>Brand Colors</h2>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-x-11'>
                {colorList.map((item, index) => (
                    <div className={`text-center text-dark2}`} key={index}>
                        <div className={`w-full h-[120px] rounded-lg bg-[${item.colorHex}] ${item.border && 'border border-dark3'}`} style={{ backgroundColor: item.colorHex }}>
                        </div>
                        <p className='my-1 text-sm font-semibold'>{item.title}</p>
                        <p className='text-sm font-normal'>{item.colorHex}</p>
                    </div>
                ))}
            </div>
            <Logo listArray={primaryLogo} titleMain='Primary Logo' direction='Horizontal' isPadding={false} />
            <Logo listArray={secondLogo} titleMain='Primary Logo' direction='Stacked' isPadding={true} />
            <Logo listArray={logoMark} titleMain='Logomark' isPadding={true} />
        </div>
    )
}

export default Branding
