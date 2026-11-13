import { site, ORIGIN, speaking } from './site';

export const PERSON_ID = ORIGIN + '/#stefano';
export const ORG_ID = ORIGIN + '/#sdr-enterprises';
export const SERIES_ID = ORIGIN + '/podcast/#series';

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: site.name,
  honorificSuffix: site.honorific,
  url: ORIGIN + '/',
  image: ORIGIN + '/press/stefano-di-rico-headshot-4.png',
  jobTitle: 'Campaigner, speaker and consultant',
  description: site.bios.short,
  email: 'mailto:' + site.email,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Warwick', url: 'https://warwick.ac.uk/' },
  award: ['NexGen Wellbeing Award for Services to Mental Health (2023)'],
  memberOf: { '@type': 'Organization', name: 'Royal Society of Arts', url: 'https://www.thersa.org/', description: 'Fellow of the Royal Society of Arts (FRSA)' },
  worksFor: { '@id': ORG_ID },
  knowsAbout: site.knowsAbout,
  knowsLanguage: ['en', 'it', 'es', 'fr'],
  sameAs: [site.social.linkedin, site.social.instagram, site.podcast.youtube, site.podcast.spotify, site.podcast.apple, site.social.substack, site.social.tiktok],
};
export const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: site.company.name,
  legalName: site.company.name,
  url: ORIGIN + '/',
  email: site.email,
  identifier: { '@type': 'PropertyValue', propertyID: 'Companies House number', value: site.company.number },
  address: { '@type': 'PostalAddress', streetAddress: '124 City Road', addressLocality: 'London', postalCode: 'EC1V 2NX', addressCountry: 'GB' },
  founder: { '@id': PERSON_ID },
};
export const website = {
  '@type': 'WebSite', '@id': ORIGIN + '/#website', url: ORIGIN + '/', name: site.name, inLanguage: 'en-GB',
  publisher: { '@id': ORG_ID }, about: { '@id': PERSON_ID },
};
export const series = (image?: string) => ({
  '@type': 'PodcastSeries', '@id': SERIES_ID, name: site.podcast.title, description: site.podcast.strapline,
  url: ORIGIN + '/podcast/', webFeed: site.podcast.rss, inLanguage: 'en-GB', ...(image ? { image } : {}),
  author: { '@id': PERSON_ID }, publisher: { '@id': ORG_ID },
  sameAs: [site.podcast.spotify, site.podcast.apple, site.podcast.youtube],
});
export const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: ORIGIN + p })),
});
export const faqPage = () => ({
  '@type': 'FAQPage',
  mainEntity: speaking.faq.map((f: any) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const pastEvents = () => speaking.past.filter((e: any) => e.date).map((e: any) => ({
  '@type': 'Event', name: e.name, startDate: e.date, eventStatus: 'https://schema.org/EventScheduled',
  performer: { '@id': PERSON_ID }, description: `${site.name}: ${e.role}.`,
}));
