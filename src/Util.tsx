export abstract class UTIL {
    private static CREATED_YEAR = 2021;

    /**
     * Get the copyright date for the application
     */
    public static getCopyrightDate(): string {
        const currentYear = new Date().getFullYear();
        if (currentYear === this.CREATED_YEAR) {
            /// if we are in the same year as the app was created, it will simply will just return that year
            return this.CREATED_YEAR.toString();
        } else {
            /// otherwise a year interval
            return `${Math.min(currentYear, this.CREATED_YEAR)}-${Math.max(currentYear, this.CREATED_YEAR)}`
        }
    }

    public static randomHex(size: number = 6): string {
        return (Math.random() * 0xffffff).toString(16).slice(0, size);
    }
}
