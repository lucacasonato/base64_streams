import { assertEquals } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { Base64DecoderStream } from "../index.ts";

async function Array$fromAsync<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const arr = [];
  for await (const item of iterable) {
    arr.push(item);
  }
  return arr;
}

Deno.test("simple", async () => {
  const readable = ReadableStream.from([
    "Zm9v",
    "YmFy",
  ]);
  const transform = new Base64DecoderStream();
  const arr = await Array$fromAsync(readable.pipeThrough(transform));
  assertEquals(arr, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ]);
});

Deno.test("padding", async () => {
  const readable = ReadableStream.from([
    "Zm9v",
    "Ym==",
  ]);
  const transform = new Base64DecoderStream();
  const arr = await Array$fromAsync(readable.pipeThrough(transform));
  assertEquals(arr, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98]),
  ]);
});

Deno.test("incomplete chunks", async () => {
  const readable = ReadableStream.from([
    "Zm9v",
    "YmF",
    "y",
  ]);
  const transform = new Base64DecoderStream();
  const arr = await Array$fromAsync(readable.pipeThrough(transform));
  assertEquals(arr, [
    new Uint8Array([102, 111, 111]),
    new Uint8Array([98, 97, 114]),
  ]);
});
