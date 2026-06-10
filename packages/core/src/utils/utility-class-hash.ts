/** Default salt — override via `utilityClassHashSalt` when hashing must be scoped to a consumer. */
export const UTILITY_CLASS_HASH_SALT = 'theme-builder-utility';

/** Default hashed class prefix — override via `utilityClassHashPrefix` when needed. */
export const UTILITY_CLASS_HASH_PREFIX = 'cl';

/** First 64 primes — SHA-256 constants are derived from their roots (FIPS 180-4). */
const SHA256_PRIMES = [
	2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
	101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197,
	199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311,
] as const;

/** Round constants K[i] = floor(cbrt(prime[i]) × 2³²). */
const SHA256_ROUND_CONSTANTS = new Uint32Array(
	SHA256_PRIMES.map((prime) => (Math.floor(Math.cbrt(prime) * 0x1_0000_0000) >>> 0)),
);

/** Initial hash H[i] = floor(sqrt(prime[i]) × 2³²). */
const SHA256_INITIAL_HASH = new Uint32Array(
	SHA256_PRIMES.slice(0, 8).map((prime) => (Math.floor(Math.sqrt(prime) * 0x1_0000_0000) >>> 0)),
);

/** SHA-256 hex digest (browser-safe, no Node built-ins). */
function sha256Hex(input: string): string {
	const msg = new TextEncoder().encode(input);

	const padded = new Uint8Array(((msg.length + 9 + 63) & ~63) >>> 0);
	padded.set(msg);
	padded[msg.length] = 0x80;
	const bitLen = msg.length * 8;
	const view = new DataView(padded.buffer);
	view.setUint32(padded.length - 4, bitLen, false);

	const h = new Uint32Array(SHA256_INITIAL_HASH);
	const w = new Uint32Array(64);

	for (let offset = 0; offset < padded.length; offset += 64) {
		for (let i = 0; i < 16; i++) {
			w[i] = view.getUint32(offset + i * 4, false);
		}
		for (let i = 16; i < 64; i++) {
			const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
			const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
			w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
		}

		let a = h[0];
		let b = h[1];
		let c = h[2];
		let d = h[3];
		let e = h[4];
		let f = h[5];
		let g = h[6];
		let hh = h[7];

		for (let i = 0; i < 64; i++) {
			const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
			const ch = (e & f) ^ (~e & g);
			const temp1 = (hh + S1 + ch + SHA256_ROUND_CONSTANTS[i] + w[i]) >>> 0;
			const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
			const maj = (a & b) ^ (a & c) ^ (b & c);
			const temp2 = (S0 + maj) >>> 0;

			hh = g;
			g = f;
			f = e;
			e = (d + temp1) >>> 0;
			d = c;
			c = b;
			b = a;
			a = (temp1 + temp2) >>> 0;
		}

		h[0] = (h[0] + a) >>> 0;
		h[1] = (h[1] + b) >>> 0;
		h[2] = (h[2] + c) >>> 0;
		h[3] = (h[3] + d) >>> 0;
		h[4] = (h[4] + e) >>> 0;
		h[5] = (h[5] + f) >>> 0;
		h[6] = (h[6] + g) >>> 0;
		h[7] = (h[7] + hh) >>> 0;
	}

	return Array.from(h, (value) => value.toString(16).padStart(8, '0')).join('');
}

function rightRotate(value: number, amount: number): number {
	return (value >>> amount) | (value << (32 - amount));
}

/** Deterministic short hash for a canonical utility class → `<prefix>-<hex>`. */
export function hashUtilityClass(
	canonical: string,
	salt: string = UTILITY_CLASS_HASH_SALT,
	prefix: string = UTILITY_CLASS_HASH_PREFIX,
): string {
	const digest = sha256Hex(`${salt}\0${canonical}`);
	return `${prefix}-${digest.slice(0, 6)}`;
}
