import { competencies, experience, profile } from "./content";

/**
 * Canonical origin for every absolute URL (canonical tag, sitemap, Open Graph,
 * JSON-LD). Set NEXT_PUBLIC_SITE_URL to the production domain, e.g.
 * https://ayindeopeyemi.com. On Vercel the production domain is picked up
 * automatically as a fallback.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();

export const seo = {
  title: `${profile.fullName} — ${profile.role} in Lagos, Nigeria`,
  shortTitle: `${profile.fullName} — Growth & Strategy`,
  // ~155 chars so Google shows it in full; the long bio feeds structured data
  description:
    "Ayinde Opeyemi — Lagos-based Growth & Strategy Executive turning campaign and customer data into decision-ready strategy. Mass Comm graduate, UNN (2:1).",
  bio:
    "Ayinde Opeyemi is a Lagos-based Growth & Strategy Executive and Mass Communication graduate (Second Class Upper, University of Nigeria) who turns campaign and customer data into decision-ready strategy. Experience across growth, content strategy, customer service and journalism.",
  keywords: [
    "Ayinde Opeyemi",
    "Opeyemi Ayinde",
    "Growth & Strategy Executive",
    "Growth strategy Lagos",
    "Data analysis",
    "Performance reporting",
    "Market research",
    "Business strategy",
    "Commercial awareness",
    "Stakeholder engagement",
    "Content strategist",
    "Mass Communication graduate",
    "University of Nigeria",
    "Graduate trainee financial services",
    "Casafina Group",
    "Lagos, Nigeria",
    "Portfolio",
  ],
  locale: "en_NG",
};

export const personId = `${siteUrl}/#person`;

export function structuredData() {
  const current = experience[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: seo.shortTitle,
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profilepage`,
        url: siteUrl,
        name: seo.title,
        isPartOf: { "@id": `${siteUrl}/#website` },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        primaryImageOfPage: `${siteUrl}/opeyemi.png`,
        inLanguage: "en",
        dateModified: "2026-10-03",
      },
      {
        "@type": "Person",
        "@id": personId,
        name: profile.fullName,
        alternateName: `${profile.firstName} ${profile.lastName}`,
        givenName: profile.firstName,
        familyName: profile.lastName,
        url: siteUrl,
        image: `${siteUrl}/opeyemi.png`,
        email: `mailto:${profile.email}`,
        telephone: profile.phone.replace(/\s/g, ""),
        jobTitle: current.role,
        description: seo.bio,
        worksFor: { "@type": "Organization", name: current.company },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressRegion: "Lagos State",
          addressCountry: "NG",
        },
        nationality: { "@type": "Country", name: "Nigeria" },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "University of Nigeria" },
          { "@type": "CollegeOrUniversity", name: "Yaba College of Technology" },
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: "Bachelor of Mass Communication — Second Class Upper",
            recognizedBy: { "@type": "CollegeOrUniversity", name: "University of Nigeria" },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "diploma",
            name: "National Diploma — Second Class Upper",
            recognizedBy: { "@type": "CollegeOrUniversity", name: "Yaba College of Technology" },
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "certificate",
            name: "Data Science Bootcamp, Cohort 3",
            recognizedBy: { "@type": "Organization", name: "Techcrush" },
          },
        ],
        hasOccupation: {
          "@type": "Occupation",
          name: current.role,
          occupationLocation: { "@type": "City", name: "Lagos" },
          skills: competencies.flatMap((c) => c.items).join(", "),
        },
        knowsAbout: competencies.flatMap((c) => c.items),
        knowsLanguage: "en",
      },
    ],
  };
}
