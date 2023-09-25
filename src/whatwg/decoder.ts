export class Base64DecoderStream extends TransformStream<string, Uint8Array> {
  #extra = "";
  constructor() {
    super({
      transform: (chunk, controller) => {
        chunk = chunk.replaceAll(/\s/g, "");
        chunk = this.#extra + chunk;

        const extraLength = chunk.length % 4;
        if (extraLength > 0) {
          this.#extra = chunk.slice(-extraLength);
          chunk = chunk.slice(0, -extraLength);
        } else {
          this.#extra = "";
        }

        if (chunk.length > 0) controller.enqueue(Uint8Array.fromBase64(chunk));
      },
      flush: (controller) => {
        if (this.#extra == "") return; // stream was empty
        controller.enqueue(Uint8Array.fromBase64(this.#extra));
      },
    });
  }
}
