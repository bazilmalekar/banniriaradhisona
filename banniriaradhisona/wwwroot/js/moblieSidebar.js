document.addEventListener("DOMContentLoaded", () => {
    // GET ELEMENTS
    const searchInput = document.getElementById("mobileSongSearch");
    const clearSongSearch = document.getElementById("clearMobileSongSearch");
    const songList = document.getElementById("mobileSongList");
    const songLinks = document.querySelectorAll("#mobileSongList .song_link");
    const noSongsFound = document.getElementById("mobileNoSongsFound");

    // RESTORE MOBILE SIDEBAR SCROLL POSITION
    if (songList) {
        const selectedSongId = localStorage.getItem("mobileScrollSelectedSongToTop");
        const savedScrollPosition = localStorage.getItem("mobileSongListScrollPosition");
        requestAnimationFrame(() => {
            // CASE 1: SONG SELECTED WHILE FILTERING
            if (selectedSongId) {
                const selectedSong = document.getElementById(selectedSongId);
                if (selectedSong) {
                    const listRect = songList.getBoundingClientRect();
                    const songRect = selectedSong.getBoundingClientRect();
                    const exactPosition = songList.scrollTop + (songRect.top - listRect.top);
                    // Put selected song at the top
                    songList.scrollTop = exactPosition;
                }
                // Remove temporary instruction
                localStorage.removeItem("mobileScrollSelectedSongToTop");
                return;
            }

            // CASE 2: NORMAL BROWSING
            if (savedScrollPosition !== null) {
                songList.scrollTop = Number(savedScrollPosition);
            } else {
                // First visit
                songList.scrollTop = 0;
            }
        });
    }

    // SAVE MOBILE SIDEBAR SCROLL POSITION
    if (songList) {
        songList.addEventListener("scroll", () => {
            localStorage.setItem("mobileSongListScrollPosition", songList.scrollTop);
        });
    }

    // HANDLE SONG CLICK
    songLinks.forEach(song => {
        song.addEventListener("click", () => {
            if (!songList) {
                return;
            }
            // Check if currently filtering
            const isFiltering = searchInput && searchInput.value.trim().length > 0;

            // CASE 1: SONG CLICKED WHILE FILTERING
            if (isFiltering) {
                // Save selected song ID
                localStorage.setItem("mobileScrollSelectedSongToTop", song.id);
                // Remove old scroll position
                localStorage.removeItem("mobileSongListScrollPosition");
            }
            // CASE 2: NORMAL SONG CLICK
            else {
                // Save current position
                localStorage.setItem("mobileSongListScrollPosition", songList.scrollTop);
                // Remove old filter instruction
                localStorage.removeItem("mobileScrollSelectedSongToTop");
            }
        });
    });

    // SEARCH / FILTER SONGS
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener("input", () => {
            // SHOW / HIDE CLEAR BUTTON
            if (clearSongSearch) {
                clearSongSearch.style.display = searchInput.value.trim() ? "block" : "none";
            }
            // DEBOUNCE SEARCH
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchValue = searchInput.value.trim().toLowerCase();
                let visibleSongs = 0;
                // Check whether search is only a number
                const isNumberSearch = /^\d+$/.test(searchValue);
                // LOOP THROUGH SONGS
                songLinks.forEach(song => {
                    const songNumber = song.dataset.songNumber?.toLowerCase() ?? "";
                    const songTitle = song.dataset.songTitle?.toLowerCase() ?? "";
                    // SEARCH LOGIC
                    const matches = isNumberSearch ? songNumber === searchValue : songTitle.includes(searchValue);
                    // SHOW MATCHING SONG
                    if (matches) {
                        song.style.display = "block";
                        // Restart animation
                        song.classList.remove("filter_show");
                        void song.offsetWidth;
                        song.classList.add("filter_show");
                        visibleSongs++;
                    }
                    // HIDE NON-MATCHING SONG
                    else {
                        song.style.display = "none";
                        song.classList.remove("filter_show");
                    }
                });
                // NO SONGS FOUND
                if (noSongsFound) {
                    noSongsFound.style.display = visibleSongs === 0 ? "block" : "none";
                }
            }, 250);
        });
    }

    // CLEAR SEARCH BUTTON
    if (searchInput && clearSongSearch) {
        clearSongSearch.addEventListener("click", () => {
            // Clear search
            searchInput.value = "";
            // Remove focus
            searchInput.blur();
            // Hide clear button
            clearSongSearch.style.display = "none";
            // Trigger filtering again
            searchInput.dispatchEvent(new Event("input"));
        });
    }
});