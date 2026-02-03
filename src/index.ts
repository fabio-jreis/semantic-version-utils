/**
 * Normalizes a version string by removing leading non-digit characters and trimming whitespace.
 * e.g., "v1.7.1.10" -> "1.7.1.10", "  1.2.3  " -> "1.2.3"
 *
 * @param input - The raw version string to normalize.
 * @returns The normalized version string or null if invalid.
 */
export function normalize(input?: string | null): string | null {
    if (!input) return null;
    try {
        const s = String(input).trim();
        // remove leading non-digit chars (v, version, etc)
        const cleaned = s.replace(/^[^\d]*/, "");
        if (!cleaned) return null;
        return cleaned;
    } catch (e) {
        return null;
    }
}

/**
 * Parses a version string into an array of numeric segments.
 */
function parseSegments(s: string): number[] {
    return s.split(".").map((seg) => {
        const match = String(seg).match(/^\d+/);
        return match ? parseInt(match[0], 10) : 0;
    });
}

/**
 * Compare two version strings.
 * 
 * @param a - First version string.
 * @param b - Second version string.
 * @returns >0 if a > b, 0 if equal, <0 if a < b.
 */
export function compare(
    a?: string | null,
    b?: string | null,
): number {
    try {
        const na = normalize(a);
        const nb = normalize(b);

        if (na === null && nb === null) return 0;
        if (na === null) return -1;
        if (nb === null) return 1;

        const pa = parseSegments(na);
        const pb = parseSegments(nb);
        const maxLen = Math.max(pa.length, pb.length);

        for (let i = 0; i < maxLen; i++) {
            const va = pa[i] ?? 0;
            const vb = pb[i] ?? 0;
            if (va !== vb) return va - vb;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}

/**
 * Checks if a version is greater than or equal to another.
 *
 * @param version - The version to check.
 * @param target - The target version to compare against.
 * @returns True if version >= target.
 */
export function isAtLeast(
    version?: string | null,
    target?: string | null,
): boolean {
    if (!target) return false;
    const cmp = compare(version, target);
    return cmp >= 0;
}

/**
 * Finds the latest version among an array of candidates.
 * Candidates can be strings or objects.
 *
 * @param items - Array of version strings or objects.
 * @param keyOrExtractor - Optional key (string) or extractor function if items are objects.
 * @returns The latest version found.
 */
export function latest<T>(
    items?: T[],
    keyOrExtractor?: keyof T | ((item: T) => string | undefined | null),
): string | null {
    if (!items || items.length === 0) return null;

    let bestVersion: string | null = null;

    for (const item of items) {
        let currentVersion: string | undefined | null;

        if (typeof item === "string") {
            currentVersion = item;
        } else if (typeof keyOrExtractor === "function") {
            currentVersion = keyOrExtractor(item);
        } else if (keyOrExtractor && typeof item === "object") {
            currentVersion = (item as any)[keyOrExtractor];
        } else {
            // Fallback for objects if no extractor is provided: try common keys
            const obj = item as any;
            currentVersion = obj.version || obj.versionCode || obj.tag;
        }

        if (!currentVersion) continue;

        if (bestVersion === null || compare(currentVersion, bestVersion) > 0) {
            bestVersion = currentVersion;
        }
    }

    return bestVersion;
}
