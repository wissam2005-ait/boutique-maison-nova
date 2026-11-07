import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "mn_admin";

function token(password: string) {
  return createHmac("sha256", password).update("maison-nova-admin").digest("hex");
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  // cookies() en premier : la page est ainsi toujours rendue à la demande.
  const value = (await cookies()).get(COOKIE)?.value;
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !value) return false;
  const expected = Buffer.from(token(pw));
  const given = Buffer.from(value);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function startSession() {
  (await cookies()).set(COOKIE, token(process.env.ADMIN_PASSWORD!), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
