// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#defineform');
  const resultDiv = document.querySelector('#result');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const word = formData.get('defineword');
    //Phonetic stuff
    let phonetic = wordData.phonetic || '';
    let audioSrc = '';
    
    if (!word) {
      resultDiv.innerHTML = '<p>Please enter a word to define.</p>';
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {











      }
        const definitions = data[0].meanings.flatMap(meaning => 
          meaning.definitions.map(def => `<li>${def.definition}</li>`)).join('');

        resultDiv.innerHTML =
        ` <h2>${word}</h2>
          <ul>${definitions}</ul> `;
      } else {
        resultDiv.innerHTML = `<p>No definitions found for "${word}".</p>`;
      }
    } catch (error) {
      console.error('Error:', error);
      resultDiv.innerHTML = '<p>An error occurred while fetching the definition.</p>';
    }
  });
});