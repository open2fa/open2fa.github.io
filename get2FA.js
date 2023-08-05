// CREDITS:
// Open2FA project came to life thanks to this function that Mathias Lasser
// kindly shared with me during a nighlty coding session.
// It was my first meet up at Ready2Order in Vienna, during May 2023.
const get2FA = (
  s,
  d = 6,
  t = Date.now() / 30000,
  g = crypto.subtle,
  u = Uint8Array,
) =>
  g
    .importKey(
      "raw",
      u.from(
        Array.from(s, (c) =>
          (+c ? +c + 56 : c.charCodeAt(0) - 1).toString(2).slice(-5),
        )
          .join("")
          .match(/.{8}/g),
        (b) => +("0b" + b),
      ),
      { name: "HMAC", hash: "SHA-1" },
      0,
      ["sign"],
    )
    .then((k) =>
      g
        .sign(k.algorithm, k, u.from([, , , , t >> 24, t >> 16, t >> 8, t]))
        .then((s) =>
          ((e) =>
            (u + 1e9 + ((e.getUint32(e.getUint8(19) & 15) << 1) >>> 1)).slice(
              -d,
            ))(new DataView(s)),
        ),
    );

