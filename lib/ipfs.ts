export function ipfsToHttp(
  src: string | undefined,
  gateway = 'ipfs.io/ipfs'
): string {
  if (!src) return ''
  return src.replace('ipfs://', `https://${gateway}/`)
}
