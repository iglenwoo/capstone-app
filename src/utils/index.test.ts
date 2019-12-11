import { validateProjectCode } from './index'

it('test valid project codes', () => {
  const validCodes = [
    '1',
    'a',
    'A',
    '-',
    '_',
    '1-',
    '1_-',
    '1-_',
    '-1',
    '_1',
    '_-1',
    '-_1',
  ]
  for (const code of validCodes) {
    expect(validateProjectCode(code)).toBe(true)
  }
})

it('test invalid project codes', () => {
  const invalidCodes = [
    '',
    ' ',
    '`',
    '~',
    '!',
    '@',
    '#',
    '$',
    '%',
    '^',
    '&',
    '*',
    '(',
    ')',
    '+',
    '=',
    '[',
    ']',
    '{',
    '}',
    '\\',
    '|',
    ';',
    ':',
    "'",
    '"',
    ',',
    '<',
    '.',
    '>',
    '/',
    '?',
  ]
  for (const code of invalidCodes) {
    expect(validateProjectCode(code)).toBe(false)
  }
})
