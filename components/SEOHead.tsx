import Head from "next/head";
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
    if (!title?.length) title = "Demask";

    const meta = {
        favicon: image || favicon || "/favicon.ico",
        title: `${title} | Demask Finance on Monad Network`,
        siteName: siteName || "Demask",
        description: description || `${title} | DeMask is the leading platform to find solutions to increase liquidity for the market for trading crypto collectibles.`,
        image: image || "/thumb.png",
    };

    return (
        <Head>
            {/* Title */}
            <title>{meta.title}</title>

            {/* Description */}
            <meta name="description" content={meta.description} />

            {/* Favicon */}
            <link rel="icon" href={meta.favicon} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:image" content={meta.image} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={meta.siteName} />
            <meta property="og:url" content="https://app.demask.finance" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={meta.image} />
            <meta name="twitter:site" content="@Demask" />
            <meta name="twitter:creator" content="@Demask" />

            {/* Google Analytics Script */}
            {/* {process.env.NODE_ENV === "production" && (
                <>
                    <script
                        async
                        src="https://www.googletagmanager.com/gtag/js?id=G-KVWTWDBEH5"
                    ></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-KVWTWDBEH5');
              `,
                        }}
                    />
                </>
            )} */}

            <Script
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
        </Head>
    );
}
