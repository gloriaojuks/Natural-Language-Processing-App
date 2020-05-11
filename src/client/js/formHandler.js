import inputValidator from './inputValidator';
import postUtil from './postUtil';

// DOM element
const inputElement = document.querySelector('textarea[name=content]');
const spinner = document.querySelector('.spin');
const errorDisplay = document.querySelector('.error');
const result = document.querySelector('#output');

// local server url
const serverUrl = 'http://localhost:5000/nlp';

const env = process.env.NODE_ENV;

const uiManager = (action, data = null) => {
	if (env === 'test') return action;

	switch (action) {
		case 'START_SPINNER': {
			spinner.classList.add('show-spinner');
			return;
		}
		case 'STOP_SPINNER': {
			spinner.classList.remove('show-spinner');
			return;
		}
		case 'SHOW_ERROR': {
			errorDisplay.classList.add('show-error');
			errorDisplay.textContent = data;
			return;
		}
		case 'CLEAR_ERROR': {
			return errorDisplay.classList.remove('show-error');
		}
		case 'SHOW_RESULT': {
			const {
				polarity,
				subjectivity,
				text,
				polarity_confidence,
				subjectivity_confidence
			} = data;
			result.innerHTML = `
            <p>Polarity: <span>${polarity}</span></p>
            <p>Subjectivity: <span>${subjectivity}</span></p>
            <p>Text: <span>${text}<span></p>
            <p>Polartiy confidence: <span>${polarity_confidence}<span></p>
            <p>Subjectivity confidence: <span>${subjectivity_confidence}<span></p>
            `;
			result.classList.add('show-result');
			return;
		}
		case 'CLEAR_RESULT': {
			result.classList.remove('show-result');
			return;
		}
		default:
			return;
	}
};

const handleSubmit = async (e) => {
	// prevent default form action
	e.preventDefault();
	const value = inputElement.value;
	const { error, formatted } = inputValidator(value);
	if (error) {
		return uiManager('SHOW_ERROR', error);
	}
	uiManager('START_SPINNER');
	uiManager('CLEAR_ERROR');
	uiManager('CLEAR_RESULT');
	const { error: apiError, data } = await postUtil(
		serverUrl,
		formatted,
		'POST'
	);
	if (apiError) {
		uiManager('STOP_SPINNER');
		return uiManager('SHOW_ERROR', apiError);
	}
	uiManager('STOP_SPINNER');
	return uiManager('SHOW_RESULT', data);
};

export { handleSubmit, uiManager };
