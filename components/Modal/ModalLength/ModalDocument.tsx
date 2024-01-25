import React, { useEffect, useRef, useState } from 'react'
import Tippy from '@tippyjs/react'
const ModalDocument = ({ data }: { data: string }) => {
    const [document, setDocument] = useState<string>('');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isTruncated, setIsTruncated] = useState<boolean>(false);
    useEffect(() => {
        if (data?.includes(':')) {
            const parts = data.split(':');
            const prefix = parts[0].slice(0, 3) + "..." + parts[0].slice(-2);
            const result = prefix + ":" + parts[1];
            setDocument(result);
        } else {
            setDocument(data);
        }
    }, [data])
    // console.log({
    //     data,
    //     document
    // });
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
            {isTruncated ? (
                <Tippy
                    theme='light'
                    maxWidth='100vw'
                    content={<span>{data}</span>}>
                    <h2 ref={containerRef} className='w-full truncate document__truncate'>
                        {data}
                    </h2>
                </Tippy>
            ) : (
                <h2 ref={containerRef} className='w-full truncate document__truncate'>
                    {data}
                </h2>
            )}
        </>
    )
}

export default ModalDocument


