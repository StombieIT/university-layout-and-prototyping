export function randomInt(a, b) {
    const value = Math.random();

    return (b - a) * value + a;
}