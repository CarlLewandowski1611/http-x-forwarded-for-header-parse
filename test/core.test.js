"use strict";

import { test } from "node:test";
import assert from "node:assert/strict";

import { parseXForwardedFor } from "../src/index.js";

test("parses a single address", () => {
  assert.deepEqual(parseXForwardedFor("192.0.2.1"), ["192.0.2.1"]);
});

test("parses multiple addresses in order", () => {
  assert.deepEqual(parseXForwardedFor("192.0.2.1, 198.51.100.2, 203.0.113.3"), [
    "192.0.2.1",
    "198.51.100.2",
    "203.0.113.3",
  ]);
});

test("trims whitespace around each address", () => {
  assert.deepEqual(parseXForwardedFor("  192.0.2.1  ,\t198.51.100.2\n"), [
    "192.0.2.1",
    "198.51.100.2",
  ]);
});

test("returns an empty array for null", () => {
  assert.deepEqual(parseXForwardedFor(null), []);
});

test("returns an empty array for undefined", () => {
  assert.deepEqual(parseXForwardedFor(undefined), []);
});

test("returns an empty array for an empty string", () => {
  assert.deepEqual(parseXForwardedFor(""), []);
});

test("returns an empty array for a whitespace-only string", () => {
  assert.deepEqual(parseXForwardedFor("   \t\n  "), []);
});

test("drops empty entries caused by consecutive commas", () => {
  assert.deepEqual(parseXForwardedFor("192.0.2.1,,198.51.100.2"), [
    "192.0.2.1",
    "198.51.100.2",
  ]);
});

test("drops a trailing empty entry", () => {
  assert.deepEqual(parseXForwardedFor("192.0.2.1,"), ["192.0.2.1"]);
});

test("drops a leading empty entry", () => {
  assert.deepEqual(parseXForwardedFor(",192.0.2.1"), ["192.0.2.1"]);
});

test("keeps non-IP tokens such as unknown", () => {
  assert.deepEqual(parseXForwardedFor("unknown, 192.0.2.1"), [
    "unknown",
    "192.0.2.1",
  ]);
});

test("handles IPv6 addresses", () => {
  assert.deepEqual(
    parseXForwardedFor("2001:db8::1, 2001:db8::2"),
    ["2001:db8::1", "2001:db8::2"]
  );
});

test("throws a TypeError for a non-string value", () => {
  assert.throws(() => parseXForwardedFor(42), {
    name: "TypeError",
    message: "X-Forwarded-For header value must be a string",
  });
});
