/** @type {import('unified').Plugin} */
export default function arrayToObject(options) {
  /** @type {import('tape').Test} */
  // @ts-expect-error: hush.
  const t = this.t

  t.deepEqual(
    options,
    {delta: 1},
    'array-to-object: should pass the reconfigured object'
  )
}
