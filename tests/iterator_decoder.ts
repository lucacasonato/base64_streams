import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { decodeBase64 } from "../index.ts";

function run(chunks: string[]): Uint8Array[] {
  const iterator = decodeBase64();
  const arr = [];
  let done: boolean | undefined = false;
  while (!done) {
    let value;
    const nextValue = chunks.shift();
    if (nextValue !== undefined) {
      ({ value, done } = iterator.next(nextValue));
    } else {
      ({ value, done } = iterator.return());
    }
    arr.push(value);
  }
  return arr;
}

Deno.test("simple", () => {
  const input = [
    "Zm9v",
    "YmFy",
  ];
  const out = run(input);
  assertEquals(out, [
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
  const out = run(input);
  assertEquals(out, [
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
  const out = run(input);
  assertEquals(out, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array(),
    new Uint8Array([98, 97, 114]),
    new Uint8Array(),
  ]);
});
