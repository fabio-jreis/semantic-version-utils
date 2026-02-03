import { describe, it, expect } from 'vitest';
import { 
  normalize, 
  compare, 
  isAtLeast, 
  latest 
} from './index';

describe('semantic-version-utils (generalized)', () => {
    describe('normalize', () => {
        it('should remove leading non-digits', () => {
            expect(normalize('v1.7.1')).toBe('1.7.1');
            expect(normalize('version 2.0')).toBe('2.0');
        });

        it('should trim whitespace', () => {
            expect(normalize('  1.2.3  ')).toBe('1.2.3');
        });

        it('should handle null/undefined', () => {
            expect(normalize(null)).toBeNull();
            expect(normalize(undefined)).toBeNull();
        });
    });

    describe('compare', () => {
        it('should return 0 for equal versions', () => {
            expect(compare('1.2.3', '1.2.3')).toBe(0);
            expect(compare('v1.0', '1.0.0')).toBe(0);
        });

        it('should return > 0 if a > b', () => {
            expect(compare('1.2.4', '1.2.3')).toBeGreaterThan(0);
            expect(compare('1.7.1.10', '1.7.1.9')).toBeGreaterThan(0);
        });

        it('should return < 0 if a < b', () => {
            expect(compare('1.2.3', '1.2.4')).toBeLessThan(0);
        });
    });

    describe('isAtLeast', () => {
        it('should return true if version is equal or greater', () => {
            expect(isAtLeast('1.7.1', '1.7.0')).toBe(true);
            expect(isAtLeast('1.7.1', '1.7.1')).toBe(true);
        });

        it('should return false if version is lower', () => {
            expect(isAtLeast('1.6.9', '1.7.0')).toBe(false);
        });
    });

    describe('latest', () => {
        it('should find the latest version in an array of strings', () => {
            const list = ['1.0.0', '1.7.1.10', '1.7.1'];
            expect(latest(list)).toBe('1.7.1.10');
        });

        it('should work with objects and a key', () => {
            const list = [
                { ver: '2.0.0' },
                { ver: '2.1.0' },
                { ver: '1.0.0' }
            ];
            expect(latest(list, 'ver')).toBe('2.1.0');
        });

        it('should work with objects and an extractor function', () => {
            const list = [
                { meta: { v: '3.0.0' } },
                { meta: { v: '3.1.0' } }
            ];
            expect(latest(list, (item) => item.meta.v)).toBe('3.1.0');
        });

        it('should use fallback keys for objects (version, versionCode, tag)', () => {
            expect(latest([{ tag: 'v1.2' }, { tag: 'v1.1' }])).toBe('v1.2');
            expect(latest([{ version: '2.0' }, { version: '2.1' }])).toBe('2.1');
        });

        it('should return null for empty list', () => {
            expect(latest([])).toBeNull();
        });
    });
});
