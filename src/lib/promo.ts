export const promoCodes: Record<string, number> = {
  BIENVENUE10: 0.1,
};

export function promoRate(code: string | undefined | null) {
  if (!code) return 0;
  return promoCodes[code.trim().toUpperCase()] ?? 0;
}
