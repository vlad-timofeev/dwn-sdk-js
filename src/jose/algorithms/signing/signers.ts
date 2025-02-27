import type { Signer } from '../../../jose/types.js';

import { ed25519 } from './ed25519.js';
import { Secp256k1 } from '../../../utils/secp256k1.js';

// the key should be the appropriate `crv` value
export const signers: { [key: string]: Signer } = {
  'Ed25519'   : ed25519,
  'secp256k1' : {
    sign            : Secp256k1.sign,
    verify          : Secp256k1.verify,
    generateKeyPair : Secp256k1.generateKeyPair,
    publicKeyToJwk  : Secp256k1.publicKeyToJwk
  },
};