//WAITS FOR DOM TO BE COMPLETELY LOADED
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#defineform');
  const resultDiv = document.querySelector('#result');
//EVENT LISTENER FOR FORM SUBMISSION
  form.addEventListener('submit', async (e) => {
   //PREVENTS DEFAULT FORM SUBMISSION
    e.preventDefault();
    //GET THE WORD FROM THE FORM
    const formData = new FormData(form);
    const word = formData.get('defineword');
    //IF A WORD WAS ENTERED
    if (!word) {
      resultDiv.innerHTML = '<p>Please enter a word to define.</p>';
      return;
    }

    try {
     //FETCH THE DEFINITION FROM THE API
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
    //CHECKS FOR A VALID RESPONSE
      if (Array.isArray(data) && data.length > 0) {
        const wordData = data[0];

        // INITIALIZE PHONETIC AND AUDIO SOURCE
        let phonetic = wordData.phonetic || '';
        let audioSrc = '';

        // FINDS PHONETIC WITH AUDIO (IF AVAILABLE)
        if (wordData.phonetics) {
          const phoneticWithAudio = wordData.phonetics.find(p => p.audio);
          if (phoneticWithAudio) {
            phonetic = phoneticWithAudio.text || phonetic;
            audioSrc = phoneticWithAudio.audio;
          }
        }
        //STARTS BUILDING THE HTML CONTENT
        let htmlContent = `
          <h2>${wordData.word}</h2>
          <p class="phonetic">${phonetic}</p>
        `;

        //ADD AUDIO PLAYER IF AVAILABLE
        if (audioSrc) {
          htmlContent += `
            <audio controls>
              <source src="${audioSrc}" type="audio/mpeg">
              Your browser does not support the audio element.
            </audio>
          `;
        }

        // WORD ORIGIN - IF IT EXISTS...
        if (wordData.origin) {
          htmlContent += `<p class="origin"><strong>Origin:</strong> ${wordData.origin}</p>`;
        }

        // CREATE ACCORDION FOR PARTS OF SPEECH
        htmlContent += '<div class="accordion" id="definitionAccordion">';

        wordData.meanings.forEach((meaning, index) => {
          const accordionId = `accordion-${index}`;
          htmlContent += `
            <div class="accordion-item">
              <h2 class="accordion-header" id="heading-${index}">
                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#${accordionId}"
                        aria-expanded="${index === 0 ? 'true' : 'false'}"
                        aria-controls="${accordionId}">
                  ${meaning.partOfSpeech}
                </button>
              </h2>
              <div id="${accordionId}"
                   class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
                   aria-labelledby="heading-${index}"
                   data-bs-parent="#definitionAccordion">
                <div class="accordion-body">
          `;

          // VERB - MEANING
          if (meaning.definitions && meaning.definitions.length > 0) {
            htmlContent += '<ol class="definitions">';
            meaning.definitions.forEach(def => {
              htmlContent += `
                <li>
                  <p>${def.definition}</p>
                  ${def.example ? `<p class="example">"${def.example}"</p>` : ''}
                </li>
              `;
            });
            htmlContent += '</ol>'; // Closing tag ordered list
          }

          // SYNONYMS & ANTONYMS
          if (meaning.synonyms && meaning.synonyms.length > 0) {
            htmlContent += `<p class="synonyms">Synonyms: ${meaning.synonyms.join(', ')}</p>`;
          }

          if (meaning.antonyms && meaning.antonyms.length > 0) {
            htmlContent += `<p class="antonyms">Antonyms: ${meaning.antonyms.join(', ')}</p>`;
          }

          // CLOSE ACCORDION ITEM
          htmlContent += `
                </div>
              </div>
            </div>
          `;
        });
        // CLOSE ACCORDION
        htmlContent += '</div>';
        // UPDATE THE RESULT DIV WITH THE GENERATED HTML
        resultDiv.innerHTML = htmlContent;
        } else if (data.title === "No Definitions Found") {
                //HANDLE UNAVAILABLE WORD
                resultDiv.innerHTML = `
                  <p>No definitions found for "${word}". This might be because:</p>
                  <ul>
                    <li>This is a free API certain words may not be available</li>
                    <li>It's a proper noun (like a name or place)</li>
                    <li>It's a specialized term not in the general dictionary</li>
                    <li>There might be a spelling error</li>
                  </ul>
                  <p>Try searching for a different word or check the spelling.</p>
                `;
       } else {
        //HANDLE OTHER ERRORS
        resultDiv.innerHTML = '<p>An error occurred while fetching the definition.</p>';
       }
    } catch (error) {
      console.error('Error:', error);
      resultDiv.innerHTML = '<p>An error occurred while fetching the definition.</p>';
    }
  });
});