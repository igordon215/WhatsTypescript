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
};