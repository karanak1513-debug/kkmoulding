import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BUSINESS_DETAILS } from '../constants';

export default function SEO({ 
  title = "K K Moulding | Premium Wooden Moulding, Doors & Chaukat Delhi",
  description = "Premium wooden moulding, wooden doors, wooden chaukat, HDMR products, and custom wooden interior solutions in Kirti Nagar Delhi.",
  keywords = "wooden moulding delhi, wooden doors delhi, wooden chaukat supplier, HDMR products delhi, decorative wooden panels, wooden interior products india, Wooden Chaukat Manufacturer Delhi, Wooden Door Frame Manufacturer, Wooden Moulding Supplier",
  url = "https://k-k-moulding.vercel.app",
  image = "https://k-k-moulding.vercel.app/og-image.jpg",
  type = "website",
  schema
}) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "K K Moulding",
    "image": image,
    "@id": url,
    "url": url,
    "telephone": BUSINESS_DETAILS.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_DETAILS.address,
      "addressLocality": "Kirti Nagar",
      "addressRegion": "Delhi",
      "postalCode": "110015",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "10:00",
      "closes": "19:00"
    }
  };

  const finalSchema = schema || JSON.stringify(localBusinessSchema);

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {finalSchema}
      </script>
    </Helmet>
  );
}
