document.write('\
<body> \
  <h1 id="MainTitle"></h1> \
 \
  <div id="trackPlaying" style="display:none"> \
    <div id="trackInfo"> \
      <h4 id="trackFromWhichOpt"></h4> \
      <h3><a id="trackNameAtag" target="_blank" rel="noopener noreferrer"></a></h3> \
      <audio onended="playNextTrack()" onerror="" controls autoPlay="true"></audio> \
    </div> \
    <button id="saveTrackBtn"> SAVE </button> \
    <div id="trackNavigationBtns"> \
      <button class="trackNavBtn" onclick="playPreviousTrack()">&#8592; Previous</button> \
      <button class="trackNavBtn" onclick="playRandTrack()" id="playRandomTrack" autofocus>Random Track</button> \
      <button class="trackNavBtn" onclick="playNextTrack()">Next &rarr;</button> \
    </div> \
  </div> \
 \
  <hr> \
  <div id="optionMenu" class="section"> \
    <button class="regularBtn" id="toggleShowingOpts" onclick="toggleShowingOpts()">Hide The Options</button> \
    <div class="sectionDisplay"> \
      <div id="tracksOpts"></div> \
    </div> \
  </div> \
 \
  <hr> \
  <div id="forSavedTracks" class="section"> \
    <button class="regularBtn" onclick="toggleSavedTracks()">Toggle Saved Tracks</button> \
    <div class="sectionDisplay"> \
      <ol id="savedShabads"></ol> \
    </div> \
  </div> \
 \
  <hr> \
  <div id="forSearch" class="section"> \
    <input placeholder="Search for Track:" id="searchInput" oninput="searchForShabad(this.value)" /> \
    <div class="sectionDisplay"> \
      <ol id="searchResults"></ol> \
    </div> \
  </div> \
 \
  <hr> \
  <div id="forShowTracks" class="section"> \
    <button class="regularBtn" onclick="toggleShowingTracks()">Show Tracks (Toggle)</button> \
    <div class="sectionDisplay"> \
      <div id="showAllTracks"></div> \
    </div> \
  </div> \
 \
 \
  <div id="myModal" class="modal"> \
    <div class="modal-content"> \
      <span class="close">&times;</span> \
      <label for="noteForSavedTrack">Enter a note if you would like (not needed):</label> \
      <div> \
        <textarea multiline placeholder="ex: Amazing Bani at 10:00" id="noteForSavedTrack"></textarea> \
      </div> \
      <div> \
        <button class="regularBtn" onclick="saveTrack()">Save</button> \
      </div> \
    </div> \
  </div> \
 \
  <!-- <button onclick="localStorage.clear()">Reset Saved/Local Storage</button> --> \
</body> \
')
