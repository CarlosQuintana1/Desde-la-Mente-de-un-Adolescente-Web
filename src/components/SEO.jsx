import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  image = '/assets/img/dm.webp', 
  url = 'https://desdelamentedeunadolescente.com', 
  type = 'website' 
}) {
  const siteTitle = 'Desde la Mente de un Adolescente';
  const fullTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Podcast de Ciencia y Tecnología`;
  const defaultDesc = 'Desde la Mente de un Adolescente: Un podcast creado por Carlos Quintana. Entrevistas profundas a mentes brillantes de la ciencia, tecnología, arte y humanidades.';
  const fullDesc = description || defaultDesc;
  
  // Ensure the image URL is absolute if it starts with /
  const imageUrl = image.startsWith('http') ? image : `https://desdelamentedeunadolescente.com${image}`;
  const canonicalUrl = url.startsWith('http') ? url : `https://desdelamentedeunadolescente.com${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDesc} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDesc} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
