/* =========================================================================
  HELPERS : codec de vecteurs — fonctions pures
  Encodage et décodage base64 des Float32Array.
========================================================================= */

/**
 * Encode un vecteur float32 en base64.
 *
 * @param vector - Vecteur à encoder.
 * @returns La chaîne base64.
 */
export function encodeVector(vector: Float32Array): string {
  const bytes = new Uint8Array(
    vector.buffer,
    vector.byteOffset,
    vector.byteLength,
  );
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

/**
 * Décode un vecteur float32 encodé en base64.
 *
 * @param value - Chaîne base64.
 * @returns Le vecteur décodé.
 */
export function decodeVector(value: string): Float32Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Float32Array(bytes.buffer);
}
