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
      // phonetic junk trial
      let phonetic = wordData.phonetic || '';
      let audioSrc = '';

      // phonetic junk trial = audio source available ??
      if (wordData.phonetics) {
        const phoneticWithAudio = wordData.phonetics.find(p => p.audio);
        if (phoneticWithAudio) {

          // phonetic junk trial
          phonetic = phoneticWithAudio.text || phonetic;
          audioSrc = phoneticWithAudio.audio;
        }
      }

      const definitions = wordData.meanings.flatMap(meaning =>
        meaning.definitions.map(def => `<li>${def.definition}</li>`)
      ).join('');

      let htmlContent = `
        <h2>${wordData.word}</h2>
        <p class="phonetic">${phonetic}</p>
      `;





// phonetic junk trial
      if (audioSrc) {
        htmlContent += `
          <audio controls>
            <source src="${audioSrc}" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        `;
      }






      htmlContent += `<ul>${definitions}</ul>`;

      resultDiv.innerHTML = htmlContent;
    } else {
      resultDiv.innerHTML = `<p>No definitions found for "${word}".</p>`;
    }
  } catch (error) {
    console.error('Error:', error);
    resultDiv.innerHTML = '<p>An error occurred while fetching the definition.</p>';
  }
});