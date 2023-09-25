import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { Base64EncoderStream } from "../../index.ts";
import { runStream } from "../test_utils.ts";

Deno.test("simple", async () => {
  const input = [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ];
  const output = await runStream(input, new Base64EncoderStream());
  assertEquals(output, [
    "Zm9v",
    "YmFy",
  ]);
});

Deno.test("padding", async () => {
  const input = [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98]),
  ];
  const output = await runStream(input, new Base64EncoderStream());
  assertEquals(output, [
    "Zm9v",
    "Yg==",
  ]);
});

Deno.test("incomplete chunks", async () => {
  const input = [
    new Uint8Array([102, 111]),
    new Uint8Array([111]),
    new Uint8Array([98, 97, 114]),
    new Uint8Array(),
  ];
  const output = await runStream(input, new Base64EncoderStream());
  assertEquals(output, [
    "Zm9v",
    "YmFy",
  ]);
});
