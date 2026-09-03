import { createHmac, randomUUID, timingSafeEqual } from "crypto";

const STATE_TTL_SECONDS = 10 * 60;

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createOAuthState(secret: string) {
  const payload = `${Date.now()}:${randomUUID()}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function isValidOAuthState(state: string, secret: string) {
  const separator = state.lastIndexOf(".");
  if (separator < 1) return false;

  const payload = state.slice(0, separator);
  const signature = state.slice(separator + 1);
  const expected = sign(payload, secret);
  const payloadTimestamp = Number(payload.split(":", 1)[0]);

  if (!Number.isFinite(payloadTimestamp) || Date.now() - payloadTimestamp > STATE_TTL_SECONDS * 1000) {
    return false;
  }

  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}