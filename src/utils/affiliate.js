const AFFILIATE_IDS = {
  viator: import.meta.env.VITE_VIATOR_AFFILIATE_ID || '',
  gyg: import.meta.env.VITE_GYG_AFFILIATE_ID || '',
}

export function viatorLink(baseUrl, destination) {
  const utm = `utm_source=ladstravel&utm_medium=framework&utm_campaign=${destination}&utm_content=daytrip`
  return `${baseUrl}?${utm}${AFFILIATE_IDS.viator ? `&aid=${AFFILIATE_IDS.viator}` : ''}`
}

export function gygLink(baseUrl, destination) {
  const utm = `utm_source=ladstravel&utm_medium=framework&utm_campaign=${destination}&utm_content=daytrip`
  return `${baseUrl}?${utm}${AFFILIATE_IDS.gyg ? `&partner_id=${AFFILIATE_IDS.gyg}` : ''}`
}

export function externalLink(url, source, campaign) {
  return `${url}?utm_source=ladstravel&utm_medium=${source}&utm_campaign=${campaign}`
}

export const UNIVERSAL_AFFILIATES = {
  worldNomads: 'https://www.worldnomads.com/travel-insurance/?affiliate=ladstravel',
  airalo: 'https://ref.airalo.com/ladstravel',
  bookingCom: 'https://www.booking.com/?aid=ladstravel',
}
