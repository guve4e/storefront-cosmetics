
export function isObject(payload: unknown): payload is Record<string, unknown> {

  return Boolean(payload && typeof payload === 'object' && !Array.isArray(payload))

}

export function requireString(

  payload: Record<string, unknown>,

  key: string,

  problems: string[],

) {

  if (typeof payload[key] !== 'string' || !String(payload[key]).trim()) {

    problems.push(`${key} must be a non-empty string`)

  }

}

export function requireNumber(

  payload: Record<string, unknown>,

  key: string,

  problems: string[],

) {

  if (typeof payload[key] !== 'number' || !Number.isFinite(payload[key])) {

    problems.push(`${key} must be a finite number`)

  }

}

export function requireArray(

  payload: Record<string, unknown>,

  key: string,

  problems: string[],

) {

  if (!Array.isArray(payload[key])) {

    problems.push(`${key} must be an array`)

  }

}

