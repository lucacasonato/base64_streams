interface Base64DecoderIterator {
  [Symbol.iterator](): Base64DecoderIterator;
  next(value: string): IteratorResult<Uint8Array, Uint8Array>;
  return(): IteratorResult<Uint8Array, Uint8Array>;
}

export function decodeBase64(): Base64DecoderIterator {
  let extra = "";
  return {
    [Symbol.iterator]() {
      return this;
    },
    next(chunk) {
      chunk = chunk.replaceAll(/\s/g, "");
      chunk = extra + chunk;

      const extraLength = chunk.length % 4;
      if (extraLength > 0) {
        extra = chunk.slice(-extraLength);
        chunk = chunk.slice(0, -extraLength);
      } else {
        extra = "";
      }

      if (chunk.length > 0) {
        return { value: Uint8Array.fromBase64(chunk), done: false };
      } else {
        return { value: new Uint8Array(), done: false };
      }
    },
    return() {
      if (extra == "") return { value: new Uint8Array(), done: true };
      return { value: Uint8Array.fromBase64(extra), done: true };
    },
  };
}
