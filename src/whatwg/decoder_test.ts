import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { Base64DecoderStream } from "../../index.ts";
import { runStream } from "../test_utils.ts";

Deno.test("simple", async () => {
  const input = [
    "Zm9v",
    "YmFy",
  ];
  const output = await runStream(input, new Base64DecoderStream());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ]);
});

Deno.test("padding", async () => {
  const input = [
    "Zm9v",
    "Ym==",
  ];
  const output = await runStream(input, new Base64DecoderStream());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98]),
  ]);
});

Deno.test("incomplete chunks", async () => {
  const input = [
    "Zm9v",
    "YmF",
    "y",
  ];
  const output = await runStream(input, new Base64DecoderStream());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ]);
});

Deno.test("whitespace", async () => {
  const input = [
    "  Zm9v  ",
    "Y mFy ",
    "",
  ];
  const output = await runStream(input, new Base64DecoderStream());
  assertEquals(output, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ]);
});
