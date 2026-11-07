export const siteConfig = {
  name: "Maison Nova",
  tagline: "Objets du quotidien, pensés pour durer.",
  description:
    "Boutique en ligne d'objets design et durables : audio, montres, maroquinerie, maison et beauté.",
  currency: "EUR",
  locale: "fr-FR",
  freeShippingThreshold: 80,
  shippingCost: 5.9,
  email: "contact@maisonnova.fr",
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
  }).format(value);
}

export function shippingFor(subtotal: number) {
  if (subtotal === 0 || subtotal >= siteConfig.freeShippingThreshold) return 0;
  return siteConfig.shippingCost;
}
