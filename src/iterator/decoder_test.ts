import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { decodeBase64 } from "../../index.ts";
import { runIterator } from "../test_utils.ts";

Deno.test("simple", () => {
  const input = [
    "Zm9v",
    "YmFy",
  ];
  const output = runIterator(input, decodeBase64());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
    new Uint8Array(),
  ]);
});

Deno.test("padding", () => {
  const input = [
    "Zm9v",
    "Ym==",
  ];
  const output = runIterator(input, decodeBase64());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98]),
    new Uint8Array(),
  ]);
});

Deno.test("incomplete chunks", () => {
  const input = [
    "Zm9v",
    "YmF",
    "y",
  ];
  const output = runIterator(input, decodeBase64());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array(),
    new Uint8Array([98, 97, 114]),
    new Uint8Array(),
  ]);
});

Deno.test("whitespace", () => {
  const input = [
    "  Zm9v  ",
    "Y mFy ",
    "",
  ];
  const output = runIterator(input, decodeBase64());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
    new Uint8Array(),
    new Uint8Array(),
  ]);
});
