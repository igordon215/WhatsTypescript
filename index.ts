// Import stylesheets
import './style.css';

const form: HTMLFormElement = document.querySelector('#defineform');
const resultDiv: HTMLElement = document.querySelector('#result');


form.onsubmit = async (e: Event) => {
  e.preventDefault();

  const formData = new FormData(form);
  console.log(formData);
  const word = formData.get('defineword') as string;
  console.log(text);
  return false; // prevent reload


if(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const definitions = data[0].meanings.flatMap((meaning: any) =>
                meaning.definitions.map((def: any) => '<li>${def.definition}</li>')).join('');
            }

        }




    }




  };