import type { DerivedPrivateJwk } from '../../src/index.js';

import { DwnErrorCode } from '../../src/core/dwn-error.js';
import { ed25519 } from '../../src/jose/algorithms/signing/ed25519.js';
import { expect } from 'chai';
import { KeyDerivationScheme, Records } from '../../src/index.js';

describe('Records', () => {
  describe('deriveLeafPublicKey()', () => {
    it('should throw if given public key is not supported', async () => {
      const rootPublicKey = (await ed25519.generateKeyPair()).publicJwk;
      await expect(Records.deriveLeafPublicKey(rootPublicKey, ['a'])).to.be.rejectedWith(DwnErrorCode.RecordsDeriveLeafPublicKeyUnSupportedCurve);
    });
  });

  describe('deriveLeafPrivateKey()', () => {
    it('should throw if given private key is not supported', async () => {
      const derivedKey: DerivedPrivateJwk = {
        derivationScheme  : KeyDerivationScheme.Protocols,
        derivedPrivateKey : (await ed25519.generateKeyPair()).privateJwk
      };
      await expect(Records.deriveLeafPrivateKey(derivedKey, ['a'])).to.be.rejectedWith(DwnErrorCode.RecordsDeriveLeafPrivateKeyUnSupportedCurve);
    });
  });
});
