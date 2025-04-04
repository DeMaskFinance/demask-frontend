import { useEffect, useRef, useState } from 'react';
import { BiChevronDown } from 'react-icons/bi';
import TokenIcon from '../Logo/TokenIcon';



type Props = {
    selectedToken: Token | any;
    setSelectedToken: any;
    dataToken: Token[];
};

export default function TokenDropdown({ selectedToken, setSelectedToken, dataToken }: Props) {
    const activeTokens = dataToken.filter((token) => token.isActive !== false);
    const TOKEN_OPTIONS = activeTokens;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

    const handleTokenSelect = (token: Token) => {
        setSelectedToken(token);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div
            ref={dropdownRef}
            className='flex items-center relative bg-[#292B31] text-white rounded-md w-full px-3 border border-zinc-800'
        >
            <button
                onClick={toggleDropdown}
                className='flex py-1.5 rounded-xl uppercase w-fit justify-between items-center gap-1 text-xs font-medium focus:outline-none'
            >
                <div className='flex items-center gap-1'>
                    <TokenIcon token={selectedToken?.symbol?.toLowerCase()} w={20} h={20} />
                    {selectedToken?.symbol}
                </div>
                <BiChevronDown
                    className={`transition-transform duration-200 w-5 h-5 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                />
            </button>
            {isDropdownOpen && (
                <div className='absolute top-9 w-full rounded-md left-0 bg-[#292B31] overflow-hidden shadow-xl z-50'>
                    {TOKEN_OPTIONS
                        .filter(token => token.symbol !== selectedToken?.symbol)
                        .map(token => (
                            <button
                                key={token.symbol}
                                onClick={() => handleTokenSelect(token)}
                                className='flex items-center gap-1 uppercase transition px-3 py-3 text-xs text-white hover:bg-[#1C1D22] w-full'
                            >
                                <TokenIcon token={String(token.symbol.toLowerCase())} w={20} h={20} />
                                {token.symbol}
                            </button>
                        ))}

                </div>
            )}
        </div>
    );
}
