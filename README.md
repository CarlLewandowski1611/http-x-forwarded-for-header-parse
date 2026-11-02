# http-x-forwarded-for-header-parse

Extracts client IP addresses in order from the X-Forwarded-For header.

```js
import { parseXForwardedFor } from "./src/index.js";

parseXForwardedFor("192.0.2.1, 198.51.100.2, 203.0.113.3");
// => ["192.0.2.1", "198.51.100.2", "203.0.113.3"]

parseXForwardedFor(null);
// => []
```

## Why this exists

HTTP proxies append to the X-Forwarded-For header, so the raw value is a
comma-separated list where the leftmost address is the original client and
each later address is a proxy that forwarded the request. Most code that
reads this header does a naive `.split(",")` and then fails on the
whitespace, empty entries, and missing-header cases that real traffic
produces.

This library makes one clear decision: it returns the addresses in the
exact order they appear in the header, after trimming whitespace and
dropping empty entries. It does not try to validate that each entry is a
syntactically valid IP address, because proxies sometimes insert non-IP
tokens such as `unknown`, and callers may want to see them. It also does
not reorder, deduplicate, or try to infer the "real" client.

## The awkward edge

An empty or missing header and a header containing only separators both
return `[]`. That is intentional: there is no client address to report,
and returning `[]` is easier to handle than returning `[""]` or `null`.

## API

### `parseXForwardedFor(headerValue)`

- `headerValue`: `string | null | undefined`
- Returns: `string[]`

Returns the addresses in order. Returns `[]` for `null`, `undefined`,
an empty string, or a whitespace-only string. Throws a `TypeError` for any
non-string, non-nullish value.

The default export is the same function.
