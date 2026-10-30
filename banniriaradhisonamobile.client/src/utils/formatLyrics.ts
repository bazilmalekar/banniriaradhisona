
export const formatLyrics = (lyrics: string | undefined): string[][] => {
    if (!lyrics) {
        return [];
    }

    return lyrics
        .split(";;")
        .map((stanza) =>
            stanza
                .split(";")
                .filter((line) => line.length > 0)
        );
};
