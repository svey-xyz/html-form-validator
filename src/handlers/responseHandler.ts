export function responseHandler(request: XMLHttpRequest) {
	if (request.readyState === 4) {

		const responseColour = request.status == 200 ? 'var(--successAccent)' : 'var(--failureAccent)'

		// responseMessageContainer.innerHTML = request.response.message;
		// responseMessageContainer.classList.remove('hidden');
		// responseMessageContainer.style.color = responseColour;
	}
}