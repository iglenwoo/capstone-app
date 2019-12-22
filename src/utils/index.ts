export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const validateProjectCode = (code: string) => {
  const re = /^[a-zA-Z0-9-_]+$/
  return re.test(code)
}

export const isObjectEmpty = (obj: any) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

export const isObjectNotEmpty = (obj: any) => {
  return !isObjectEmpty(obj)
}
