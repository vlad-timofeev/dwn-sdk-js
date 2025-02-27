import { Encoder } from './encoder.js';
import { Readable } from 'readable-stream';

/**
 * Utility class for readable data stream, intentionally named to disambiguate from ReadableStream, readable-stream, Readable etc.
 */
export class DataStream {
  /**
   * Reads the entire readable stream given into array of bytes.
   */
  public static async toBytes(readableStream: Readable): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      readableStream.on('data', chunk => {
        chunks.push(chunk);
      });

      readableStream.on('end', () => {
        const uint8Array = DataStream.concatenateArrayOfBytes(chunks);
        resolve(uint8Array);
      });

      readableStream.on('error', reject);
    });
  }

  /**
   * Concatenates the array of bytes given into one Uint8Array.
   */
  private static concatenateArrayOfBytes(arrayOfBytes: Uint8Array[]): Uint8Array {
    // sum of individual array lengths
    const totalLength = arrayOfBytes.reduce((accumulatedValue, currentValue) => accumulatedValue + currentValue.length, 0);

    const result = new Uint8Array(totalLength);

    let length = 0;
    for (const bytes of arrayOfBytes) {
      result.set(bytes, length);
      length += bytes.length;
    }

    return result;
  }

  /**
   * Creates a readable stream from the bytes given.
   */
  public static fromBytes(bytes: Uint8Array): Readable {
    // chunk up the bytes to simulate a more real-world like behavior
    const chunkLength = 100_000;
    let currentIndex = 0;
    const readableStream = new Readable({
      read(_size): void {
        // if this is the last chunk
        if (currentIndex + chunkLength > bytes.length) {
          this.push(bytes.subarray(currentIndex));
          this.push(null);
        } else {
          this.push(bytes.subarray(currentIndex, currentIndex + chunkLength));

          currentIndex = currentIndex + chunkLength;
        }
      }
    });

    return readableStream;
  }

  /**
   * Creates a readable stream from the object given.
   */
  public static fromObject(object: { [key: string]: any }): Readable {
    const bytes = Encoder.objectToBytes(object);
    return DataStream.fromBytes(bytes);
  }
}