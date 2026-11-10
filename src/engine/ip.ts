export function ipToInt(ip: string): number | null {
  const parts = ip.trim().split('.')
  if (parts.length !== 4) return null
  let value = 0
  for (const part of parts) {
    if (part.trim() === '') return null
    const octet = Number(part)
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return null
    value = (value << 8) | octet
  }
  return value >>> 0
}

export function isValidIp(ip: string): boolean {
  return ipToInt(ip) !== null
}

export function prefixFromSubnet(subnet: string): number | null {
  const value = subnet.trim().replace(/^\//, '')
  if (value === '') return null

  if (/^\d{1,2}$/.test(value)) {
    const prefix = Number(value)
    return prefix >= 0 && prefix <= 32 ? prefix : null
  }

  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return null
  const parts = value.split('.').map(Number)
  if (parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return null
  }
  const binary = parts.map((part) => part.toString(2).padStart(8, '0')).join('')
  if (!/^1*0*$/.test(binary)) return null
  return binary.split('').filter((bit) => bit === '1').length
}

export function isValidSubnet(subnet: string): boolean {
  return prefixFromSubnet(subnet) !== null
}

export function sameSubnet(a: string, b: string, subnet: string): boolean {
  const ipA = ipToInt(a)
  const ipB = ipToInt(b)
  const prefix = prefixFromSubnet(subnet)
  if (ipA === null || ipB === null || prefix === null) return false
  if (prefix === 0) return true
  const mask = (0xffffffff << (32 - prefix)) >>> 0
  return (ipA & mask) === (ipB & mask)
}
