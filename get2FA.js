// CREDITS:
// Open2FA project came to life thanks to this function that Mathias Lasser
// kindly shared with me during a nighlty coding session.
// It was my first meet up at Ready2Order in Vienna, during May 2023.
//
// Notice that indentation is preserved as is, this is Matthias' coding style.
/* prettier-ignore */
export function get2FA(sharedSecret){
  const alphabet=Object.fromEntries(Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',(c,i)=>[c,i.toString(2).padStart(5,'0')]))
  const keyData=new Uint8Array(Array.from(sharedSecret,a=>alphabet[a]).join('').match(/.{8}/g).map(a=>+`0b${a}`));
  return crypto.subtle.importKey('raw',keyData,{
    name:'HMAC',
    hash:'SHA-1'
  },false,['sign']).then(key=>{
    const dv=new DataView(new ArrayBuffer(8));
    dv.setUint32(4,Date.now()/30000);
    return crypto.subtle.sign(key.algorithm,key,dv).then(signature=>{
      const dv=new DataView(signature);
      return ('00000'+(dv.getUint32(dv.getUint8(19)&15)&(-1>>>1))).slice(-6);
    });
  });
}
