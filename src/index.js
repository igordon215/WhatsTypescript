document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#defineform');
  const resultDiv = document.querySelector('#result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const word = formData.get('defineword');
    
    if (!word) {
      resultDiv.innerHTML = '<p>Please enter a word to define.</p>';
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const wordData = data[0];

        // FOR PHONETICS
        let phonetic = wordData.phonetic || '';
        let audioSrc = '';

        // PHONETICS
        if (wordData.phonetics) {
          const phoneticWithAudio = wordData.phonetics.find(p => p.audio);
          if (phoneticWithAudio) {
            phonetic = phoneticWithAudio.text || phonetic;
            audioSrc = phoneticWithAudio.audio;
          }
        }

        let htmlContent = `
          <h2>${wordData.word}</h2>
          <p class="phonetic">${phonetic}</p>
        `;

        // PHONETICS AUDIO SOURCE
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

          // CLOSE ACCORDION
          htmlContent += `
                </div>
              </div>
            </div>
          `;
        });

        htmlContent += '</div>';
        resultDiv.innerHTML = htmlContent;
      } else {
        // ADD FOR ACCORDION
        resultDiv.innerHTML = htmlContent;
      }
    } catch (error) {
      console.error('Error:', error);
      resultDiv.innerHTML = '<p>An error occurred while fetching the definition.</p>';
    }
  });
});