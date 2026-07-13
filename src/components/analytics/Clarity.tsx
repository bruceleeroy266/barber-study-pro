'use client'

import Script from 'next/script'

/**
 * Optional Microsoft Clarity integration.
 *
 * Enabled only when NEXT_PUBLIC_CLARITY_PROJECT_ID is set. The site builds and
 * runs correctly when the variable is missing. Clarity is configured to mask
 * sensitive inputs by default so protected student, instructor, and admin
 * activity is not recorded.
 */
export function Clarity() {
  const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  if (!projectId) {
    return null
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  )
}
