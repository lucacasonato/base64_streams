interface Iterator<T, R> {
  next(value: T): IteratorResult<R, R>;
  return(): IteratorResult<R, R>;
}

export function runIterator<T, R>(input: T[], iterator: Iterator<T, R>): R[] {
  const arr: R[] = [];
  let done: boolean | undefined = false;
  while (!done) {
    let value;
    const nextValue = input.shift();
    if (nextValue !== undefined) {
      ({ value, done } = iterator.next(nextValue));
    } else {
      ({ value, done } = iterator.return!());
    }
    arr.push(value);
  }
  return arr;
}

export async function runStream<T, R>(
  input: T[],
  stream: TransformStream<T, R>,
): Promise<R[]> {
  const readable = ReadableStream.from(input);
  const transformed = readable.pipeThrough(stream);
  const arr = [];
  for await (const item of transformed) {
    arr.push(item);
  }
  return arr;
}
