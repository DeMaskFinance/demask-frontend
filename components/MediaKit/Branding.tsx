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
            urlPNG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
            urlSVG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
            urlSVG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
            urlSVG: 'https://file.demask.finance/cca936f7054579bc10ddfac4f388612e.svg',
        }
    ]
    const secondLogo: LogoProps[] = [
        {
            urlPNG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
            urlSVG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
            urlSVG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
            urlSVG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
        }
    ]
    const logoMark: LogoProps[] = [
        {
            urlPNG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
            urlSVG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
            urlSVG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
        },
        {
            urlPNG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
            urlSVG: 'https://file.demask.finance/1ecb6e343739dc665523e2047a5bb5e7.svg',
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
                            <Image alt='Primary Logo' width={400} height={150} src={item.urlPNG} className='object-cover w-full' />
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
                        <div className={`w-full h-[120px] rounded-lg bg-${item.color} ${item.border && 'border border-dark3'}`}>
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
