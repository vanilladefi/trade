export function ipfsToHttp(
  src: string | undefined | null,
  gateway = 'ipfs.io/ipfs',
): string {
  if (!src) return ''
  return src.replace('ipfs://', `https://${gateway}/`)
}
