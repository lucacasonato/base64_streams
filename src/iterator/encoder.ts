interface Base64EncoderIterator {
  [Symbol.iterator](): Base64EncoderIterator;
  next(value: Uint8Array): IteratorResult<string, string>;
  return(): IteratorResult<string, string>;
}

export function encodeBase64(): Base64EncoderIterator {
  const extra = new Uint8Array(3);
  let extraLength = 0;

  return {
    [Symbol.iterator]() {
      return this;
    },
    next(chunk) {
      if (extraLength > 0) {
        const bytesNeeded = 3 - extraLength;
        const bytesAvailable = Math.min(bytesNeeded, chunk.length);
        extra.set(chunk.subarray(0, bytesAvailable), extraLength);
        chunk = chunk.subarray(bytesAvailable);
        extraLength += bytesAvailable;
      }

      let extraReturn = "";

      if (extraLength === 3) {
        extraReturn = extra.toBase64();
        extraLength = 0;
      }

      const remainder = chunk.length % 3;
      if (remainder > 0) {
        extra.set(chunk.subarray(chunk.length - remainder));
        extraLength = remainder;
        chunk = chunk.subarray(0, chunk.length - remainder);
      }

      return { value: extraReturn + chunk.toBase64(), done: false };
    },
    return() {
      if (extraLength > 0) {
        const value = extra.subarray(0, extraLength).toBase64();
        return { value, done: true };
      }
      return { value: "", done: true };
    },
  };
}
