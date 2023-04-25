const CHARS = new Set(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
);
export function is_alphanumeric(char: string) {
  return CHARS.has(char);
}

const WHITESPACE = new Set([
  " ",
  "  ",
  "\b",
  "\t",
  "\n",
  "\v",
  "\f",
  "\r",
  `\"`,
  `\'`,
  `\\`,
  "\u0008",
  "\u0009",
  "\u000A",
  "\u000B",
  "\u000C",
  "\u000D",
  "\u0020",
  "\u0022",
  "\u0027",
  "\u005C",
  "\u00A0",
  "\u2028",
  "\u2029",
  "\uFEFF",
]);

export function is_whitespace(char: string) {
  return WHITESPACE.has(char);
}
