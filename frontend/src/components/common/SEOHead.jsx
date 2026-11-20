import { useEffect } from 'react';

export default function SEOHead({ title, description, keywords, canonical }) {
  useEffect(() => {
    // Set Title
    document.title = title
      ? `${title} | PulseFlow Enterprise PM`
      : 'PulseFlow - Enterprise Project Management & Issue Tracking';

    // Set or create Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'Futuristic project management and bug tracking platform built for high-performance software engineering teams.';

    // Set or create Canonical Link
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.rel = 'canonical';
        document.head.appendChild(linkCanonical);
      }
      linkCanonical.href = canonical;
    }
  }, [title, description, keywords, canonical]);

  return null;
}
