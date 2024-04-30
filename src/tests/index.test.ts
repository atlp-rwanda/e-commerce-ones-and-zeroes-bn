function add(a: number, b: number): number {
    return a + b;
}

describe('add function', () => {
    it('should add two positive numbers correctly', () => {
        expect(add(1, 2)).toBe(3);
    });

    it('should add two negative numbers correctly', () => {
        expect(add(-1, -2)).toBe(-3);
    });

    it('should add a positive and a negative number correctly', () => {
        expect(add(1, -2)).toBe(-1);
    });

    it('should add zero to zero correctly', () => {
        expect(add(0, 0)).toBe(0);
    });
});
