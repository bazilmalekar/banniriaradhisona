namespace banniriaradhisona.Helper
{
    public static class LyricsHelper
    {
        public static List<List<string>> FormatLyrics(string lyrics)
        {
            return lyrics
                .Split(";;")
                .Select(stanza => stanza
                    .Split(';', StringSplitOptions.RemoveEmptyEntries)
                    .ToList())
                .ToList();
        }
    }
}
