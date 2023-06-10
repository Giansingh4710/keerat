document.write('\
<style> \
  .dialog { \
    display: none; \
    position: fixed; \
    top: 0; \
    left: 0; \
    width: 100%; \
    height: 100%; \
    background-color: rgba(0, 0, 0, 0.5); \
    z-index: 9999; \
  } \
 \
  .dialog-content { \
    position: absolute; \
    top: 50%; \
    left: 50%; \
    transform: translate(-50%, -50%); \
    background-color: white; \
    padding: 20px; \
  } \
 \
  .show-dialog { \
    display: block; \
  } \
</style> \
<style> \
  #modal-content { \
    /* background-color: #fefefe; */ \
    background-color: #ff7f50; \
    margin: auto; \
    padding: 2em; \
    border: 1px solid #888; \
    width: 80%; \
    border-radius: 1em; \
  } \
 \
  .userInputItem { \
    text-align: center; \
    align-items: center; \
    background-color: #0077be; \
    border-radius: 10px; \
    margin: 10px; \
    padding: 10px; \
    display: flex; \
    align-items: center; \
    justify-content: center; \
    flex-direction: column; \
  } \
 \
  #sttmLink p { \
    display: inline; \
  } \
 \
  #sttmLink { \
    font-size: 0.1em; \
  } \
 \
  #highlightShabadId { \
    font-weight: bold; \
    font-size: 1.5em; \
    color: greenyellow; \
  } \
 \
  #closeModal { \
    color: black; \
    float: right; \
    top: 500px; \
    font-size: 61px; \
    font-weight: bold; \
  } \
 \
  #closeModal:hover, \
  #closeModal:focus { \
    color: #aaa; \
    text-decoration: none; \
    cursor: pointer; \
  } \
 \
  .shabad_opt_from_userinput { \
    background-color: white; \
    margin: 5px; \
    border-radius: 5px; \
  } \
 \
  /* ------------------------------------------------ */ \
</style> \
 \
<div id="dialog" class="dialog"> \
  <div class="dialog-content"> \
    <form id="modal-content" onsubmit="formValidation(event)" method="post" \
      action="http://45.76.2.28/trackIndex/addData.php"> \
      <span id="closeModal">&times;</span> \
      <div class="userInputItem"> \
        <label for="userDesc">Description:</label> \
        <input id="userDesc" name="description" placeholder="bin ek naam ik chit leen"></input> \
      </div> \
      <div class="userInputItem"> \
        <p id="theShabadSelected"></p> \
        <label for="usedShabadId">Shabad ID:</label> \
        <input list="shabadId_list_opts" id="usedShabadId" name="shabadId" placeholder="687 or ਤਕਮਲ" \
          oninput="add_shabad_from_user_input()"></input> \
        <div id="shabadId_list_opts"> \
        </div> \
 \
        <a id="sttmLink" href="https://www.sikhitothemax.org/shabad?id=687&q=Ahrp&type=1&source=all&highlight=9290"> \
          <p>https://www.sikhitothemax.org/shabad?id=</p> \
          <p id="highlightShabadId">687</p> \
          <p>&q=Ahrp&type=1&source=all&highlight=9290</p> \
        </a> \
      </div> \
      <div class="userInputItem"> \
        <label for="userTimestamp">Timestamp of where Description Happened:</label> \
        <div id="userTimestamp"> \
          <input name="hours" id="hours" type="number" min="0" max="59" inputmode="numeric"></input>: \
          <input name="mins" id="mins" type="number" min="0" max="59" inputmode="numeric"></input>: \
          <input name="secs" id="secs" type="number" min="0" max="59" inputmode="numeric"></input> \
        </div> \
        <div id="userTimestamp"> \
          <label for="hours">hours:</label> \
          <label for="mins">minutes:</label> \
          <label for="secs">seconds</label> \
        </div> \
      </div> \
 \
      <button>Add</button> \
    </form> \
  </div> \
</div> \
<button id="openModal">Save to Global Database</button> \
')
