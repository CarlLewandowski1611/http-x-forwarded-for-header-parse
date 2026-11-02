"use strict";

/**
 * Parse an X-Forwarded-For header value into an ordered list of client IP
 * addresses.
 *
 * The X-Forwarded-For header is a comma-separated list of IP addresses,
 * where the leftmost address is the original client and each subsequent
 * address is the proxy that forwarded the request. This function returns
 * the addresses in the same order they appear in the header.
 *
 * We trim whitespace around each address and drop empty entries. We do not
 * validate that each entry is a syntactically valid IP address, because
 * proxies sometimes insert non-IP tokens (e.g. "unknown") and callers may
 * want to see them. We also do not reorder or deduplicate.
 *
 * @param {string | null | undefined} headerValue - The raw header value.
 * @returns {string[]} The list of client IP addresses in order.
 */
export function parseXForwardedFor(headerValue) {
  if (headerValue == null) {
    return [];
  }
  if (typeof headerValue !== "string") {
    throw new TypeError("X-Forwarded-For header value must be a string");
  }
  const trimmed = headerValue.trim();
  if (trimmed === "") {
    return [];
  }
  return trimmed
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}
