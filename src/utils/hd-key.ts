import type { PrivateJwk } from '../jose/types.js';

import { Secp256k1 } from './secp256k1.js';

export enum KeyDerivationScheme {
  Protocols = 'protocols',
  Schemas = 'schemas'
}

export type DerivedPrivateJwk = {
  derivationScheme: KeyDerivationScheme;
  derivationPath?: string[];
  derivedPrivateKey: PrivateJwk,
};

/**
 * Class containing hierarchical deterministic key related utility methods used by the DWN.
 */
export class HdKey {
  /**
   * Derives a descendant private key.
   * NOTE: currently only supports SECP256K1 keys.
   */
  public static async derivePrivateKey(ancestorKey: DerivedPrivateJwk, subDerivationPath: string[]): Promise<DerivedPrivateJwk> {
    const ancestorPrivateKey = Secp256k1.privateJwkToBytes(ancestorKey.derivedPrivateKey);
    const ancestorPrivateKeyDerivationPath = ancestorKey.derivationPath ?? [];
    const derivedPrivateKeyBytes = await Secp256k1.derivePrivateKey(ancestorPrivateKey, subDerivationPath);
    const derivedPrivateJwk = await Secp256k1.privateKeyToJwk(derivedPrivateKeyBytes);
    const derivedDescendantPrivateKey: DerivedPrivateJwk = {
      derivationPath    : [...ancestorPrivateKeyDerivationPath, ...subDerivationPath],
      derivationScheme  : ancestorKey.derivationScheme,
      derivedPrivateKey : derivedPrivateJwk
    };

    return derivedDescendantPrivateKey;
  }
}