This is an implementation of a streaming Base64 encoder and decoder for
JavaScript, with the actual encoding and decoding logic being handled by
`Uint8Array.fromBase64()` and `Uint8Array.prototype.toBase64()` from the
[proposal-arraybuffer-base64](https://github.com/tc39/proposal-arraybuffer-base64).

The streaming decoder supports streaming decoding and encoding. It correctly
handles padding and whitespace. There is both a WHATWG TransformStream, and a
sync-Iterator based API available.

You can see the implementations for the various APIs in:

- [`Base64DecoderStream` WHATWG TransformStream](./src/whatwg/decoder.ts)
- [`Base64EncoderStream` WHATWG TransformStream](./src/whatwg/encoder.ts)
- [`decodeBase64()` sync iterator](./src/iterator/decoder.ts)
- [`encodeBase64()` sync iterator](./src/iterator/encoder.ts)

To play with it:

```
$ deno repl -A --eval="import { Base64DecoderStream, Base64EncoderStream, decodeBase64, encodeBase64 } from './index.ts'"
Deno 1.37.0
exit using ctrl+d, ctrl+c, or close()
>
```

To run tests, run `deno test`.
