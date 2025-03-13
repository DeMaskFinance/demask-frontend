import { NextSeo } from "next-seo";
import Script from "next/script";

export type SEOHeadType = {
    title?: string;
    siteName?: string;
    description?: string;
    favicon?: string;
    image?: string;
};

export default function SEOHead({
    description,
    favicon,
    siteName,
    title,
    image,
}: SEOHeadType) {
    const defaultTitle = "Demask";
    const pageTitle = title ? `${title} | Demask Finance on Monad Network` : `${defaultTitle} | Demask Finance on Monad Network`;

    return (
        <>
            {/* Next-SEO */}
            <NextSeo
                title={pageTitle}
                description={description || "DeMask is the leading platform to find solutions to increase liquidity for the market for trading crypto collectibles."}
                canonical="https://app.demask.finance"
                openGraph={{
                    type: "website",
                    locale: "en_US",
                    url: "https://app.demask.finance",
                    siteName: siteName || defaultTitle,
                    title: pageTitle,
                    description,
                    images: [
                        {
                            url: image || "/thumb.jpg",
                            width: 1200,
                            height: 630,
                            alt: "Demask Finance",
                        },
                    ],
                }}
                twitter={{
                    handle: "@Demask",
                    site: "@Demask",
                    cardType: "summary_large_image",
                }}
            />

            {/* Favicon */}
            <link rel="icon" href={favicon || "/favicon.ico"} />

            {/* Google Analytics */}
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS && (
                <>
                    <Script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                    />
                    <Script id="google-analytics">
                        {`
                            window.dataLayer = window.dataLayer || []; 
                            function gtag(){dataLayer.push(arguments);} 
                            gtag('js', new Date()); 
                            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}'); 
                        `}
                    </Script>
                </>
            )}

            {/* Example Additional Scripts */}
            <Script
                src="https://example.com/custom-script.js"
                strategy="afterInteractive"
            />

            <Script id="custom-inline-script" strategy="lazyOnload">
                {`
                    console.log("Custom inline script loaded!");
                `}
            </Script>
        </>
    );
}
