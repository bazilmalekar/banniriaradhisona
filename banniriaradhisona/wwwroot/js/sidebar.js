document.addEventListener("DOMContentLoaded", () => {
    // GET ELEMENTS
    const searchInput = document.getElementById("songSearch");
    const clearSongSearch = document.getElementById("clearSongSearch");
    const songList = document.getElementById("songList");
    const songLinks = document.querySelectorAll(".song_link");
    const noSongsFound = document.getElementById("noSongsFound");

    // RESTORE SIDEBAR POSITION
    if (songList) {
        // Get temporary instruction for filtered song selection
        const selectedSongId = localStorage.getItem("scrollSelectedSongToTop");
        // Get previously saved normal scroll position
        const savedScrollPosition = localStorage.getItem("songListScrollPosition");
        requestAnimationFrame(() => {
            // CASE 1: SONG CLICKED WHILE FILTERING
            // Scroll selected song to the TOP
            if (selectedSongId) {
                const selectedSong = document.getElementById(selectedSongId);
                if (selectedSong) {
                    // Calculate the song's exact position relative to the scrollable container
                    const listRect = songList.getBoundingClientRect();
                    const songRect = selectedSong.getBoundingClientRect();
                    const exactPosition = songList.scrollTop + (songRect.top - listRect.top);
                    // Scroll selected song to the top
                    songList.scrollTop = exactPosition;
                }
                localStorage.removeItem("scrollSelectedSongToTop");
                return;
            }

            // CASE 2: NORMAL BROWSING
            // Restore previous sidebar position
            if (savedScrollPosition !== null) {
                songList.scrollTop = Number(savedScrollPosition);
            } else {
                // First visit
                // No saved position exists, so start from the top.
                songList.scrollTop = 0;
            }
        });
    }

    // SAVE SIDEBAR SCROLL POSITION
    if (songList) {
        songList.addEventListener("scroll", () => {
            localStorage.setItem("songListScrollPosition", songList.scrollTop);
        });
    }

    // HANDLE SONG CLICK
    songLinks.forEach(song => {
        song.addEventListener("click", () => {
            if (!songList) {
                return;
            }
            // Check whether the user is currently
            // searching/filtering songs.
            const isFiltering = searchInput && searchInput.value.trim().length > 0;
            // CASE 1: CLICKED A SONG WHILE FILTERING
            if (isFiltering) {
                // Save the selected song ID.
                // After page reload, we will find this song and move it to the top.
                localStorage.setItem("scrollSelectedSongToTop", song.id);
                // Remove the old scroll position.
                // The selected song position has priority.
                localStorage.removeItem("songListScrollPosition");
            }

            // CASE 2: NORMAL SONG CLICK
            else {
                // Remember the current sidebar position.
                // After the page reloads, restore this exact position.
                localStorage.setItem("songListScrollPosition", songList.scrollTop);
                // Remove any old filtering instruction.
                localStorage.removeItem("scrollSelectedSongToTop");
            }
        });
    });

    // SEARCH / FILTER SONGS
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener("input", () => {
            //SHOW / HIDE CLEAR BUTTON
            if (clearSongSearch) {
                clearSongSearch.style.display = searchInput.value.trim() ? "block" : "none";
            }

            // DEBOUNCE SEARCH
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchValue = searchInput.value.trim().toLowerCase();
                let visibleSongs = 0;
                /*
                   Check whether the user enteredonly numbers.
                   Examples:
                   "32"  → true
                   "100" → true
                   "32a" → false
                   "song" → false
                */
                const isNumberSearch = /^\d+$/.test(searchValue);
                // LOOP THROUGH ALL SONGS
                songLinks.forEach(song => {
                    const songNumber = song.dataset.songNumber?.toLowerCase() ?? "";
                    const songTitle = song.dataset.songTitle?.toLowerCase() ?? "";
                    // SEARCH LOGIC
                    // NUMBER:Exact song number only
                    // TEXT:Partial title search
                    const matches = isNumberSearch ? songNumber === searchValue : songTitle.includes(searchValue);
                    // SHOW MATCHING SONG
                    if (matches) {
                        song.style.display = "block";
                        // Restart the animation
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
                // NO SONGS FOUND MESSAGE
                if (noSongsFound) {
                    noSongsFound.style.display = visibleSongs === 0 ? "block" : "none";
                }
            }, 250);
        });
    }

    // CLEAR SEARCH BUTTON
    if (searchInput && clearSongSearch) {
        clearSongSearch.addEventListener("click", () => {
            // Clear the search box
            searchInput.value = "";
            // Remove focus
            searchInput.blur();
            // Hide clear button
            clearSongSearch.style.display = "none";
            //Trigger the search again.
            //This will show all songs again.
            searchInput.dispatchEvent(new Event("input"));
        });
    }
});