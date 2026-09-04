import type { Metadata, Viewport } from "next";
import { Archivo_Black } from "next/font/google";
import Script from "next/script";
import { META_PIXEL_ID, SITE_URL } from "@/lib/config";
import "./globals.css";

const displayFont = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Achados da Bia — grupo grátis no WhatsApp",
  description:
    "Um grupo de mulher avisando mulher antes do preço subir. Moda e acessório garimpados um por um. Entra de graça.",
  openGraph: {
    title: "Achados da Bia — grupo grátis no WhatsApp",
    description:
      "Um grupo de mulher avisando mulher antes do preço subir. Entra de graça.",
    type: "website",
    locale: "pt_BR",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#E8215B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const attrCapture = `document.documentElement.classList.add('js');
(function(){try{
var p=new URLSearchParams(location.search);
var fbclid=p.get('fbclid');
var ck=document.cookie.split('; ');
function get(n){var f=ck.find(function(r){return r.indexOf(n+'=')===0});return f?f.split('=')[1]:null}
if(fbclid && !get('_fbc')){document.cookie='_fbc=fb.1.'+Date.now()+'.'+fbclid+'; max-age=31536000; path=/; samesite=lax'}
var keep={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){var v=p.get(k);if(v)keep[k]=v});
if(fbclid)keep.fbclid=fbclid;
if(Object.keys(keep).length)try{sessionStorage.setItem('bia_attr',JSON.stringify(keep))}catch(e){}
}catch(e){}})();`;

const pixelBoot = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={displayFont.variable}>
      <body>
        <Script id="bia-attr" strategy="beforeInteractive">
          {attrCapture}
        </Script>

        {META_PIXEL_ID ? (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {pixelBoot}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}

        {children}
      </body>
    </html>
  );
}
