import React, { useEffect, useRef, useState } from 'react'
const ModalDocument = ({ data }: { data: string }) => {
    const [document, setDocument] = useState<string>('');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isTruncated, setIsTruncated] = useState<boolean>(false);
    useEffect(() => {
        if (data.includes(':')) {
            const parts = data.split(':');
            const prefix = parts[0].slice(0, 3) + "..." + parts[0].slice(-2);
            const result = prefix + ":" + parts[1];
            setDocument(result);
        } else {
            setDocument(data);
        }
    }, [data])
    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            // setOffsetWidth(container.offsetWidth);
            // setScrollWidth(container.scrollWidth);
            if (container.offsetWidth < container.scrollWidth) {
                setIsTruncated(true);
                setDocument(data);
            } else {
                setIsTruncated(false);
            }
        }
    }, [data]);

    return (
        <>
            <h2 ref={containerRef} className='truncate document__truncate'>
                {data}
            </h2>
            {isTruncated && (
                <div className='absolute hidden px-2 -translate-x-[42%] bg-white rounded-md shadow-swiper document__tooltip bottom-8'>
                    <span className='text-sm'>{document}</span>
                    <div className='absolute clip-polygon w-4 h-3 bg-white left-[50%] bottom-[-12px]'></div>
                </div>

            )}
        </>
    )
}

export default ModalDocument


