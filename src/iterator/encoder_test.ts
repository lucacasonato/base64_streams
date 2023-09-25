import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { encodeBase64 } from "../../index.ts";
import { runIterator } from "../test_utils.ts";

Deno.test("simple", () => {
  const input = [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ];
  const output = runIterator(input, encodeBase64());
  assertEquals(output, [
    "Zm9v",
    "YmFy",
    "",
  ]);
});

Deno.test("padding", () => {
  const input = [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98]),
  ];
  const output = runIterator(input, encodeBase64());
  assertEquals(output, [
    "Zm9v",
    "",
    "Yg==",
  ]);
});

Deno.test("incomplete chunks", () => {
  const input = [
    new Uint8Array([102, 111]),
    new Uint8Array([111]),
    new Uint8Array([98, 97, 114]),
    new Uint8Array(),
  ];
  const output = runIterator(input, encodeBase64());
  assertEquals(output, [
    "",
    "Zm9v",
    "YmFy",
    "",
    "",
  ]);
});
