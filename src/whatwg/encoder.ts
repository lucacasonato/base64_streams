export class Base64EncoderStream extends TransformStream<Uint8Array, string> {
  #extra = new Uint8Array(3);
  #extraLength = 0;

  constructor() {
    super({
      transform: (chunk, controller) => {
        if (this.#extraLength > 0) {
          const bytesNeeded = 3 - this.#extraLength;
          const bytesAvailable = Math.min(bytesNeeded, chunk.length);
          this.#extra.set(chunk.subarray(0, bytesAvailable), this.#extraLength);
          chunk = chunk.subarray(bytesAvailable);
          this.#extraLength += bytesAvailable;
        }

        if (this.#extraLength === 3) {
          controller.enqueue(this.#extra.toBase64());
          this.#extraLength = 0;
        }

        const remainder = chunk.length % 3;
        if (remainder > 0) {
          this.#extra.set(chunk.subarray(chunk.length - remainder));
          this.#extraLength = remainder;
          chunk = chunk.subarray(0, chunk.length - remainder);
        }

        controller.enqueue(chunk.toBase64());
      },
      flush: (controller) => {
        if (this.#extraLength > 0) {
          controller.enqueue(
            this.#extra.subarray(0, this.#extraLength).toBase64(),
          );
        }
      },
    });
  }
}
