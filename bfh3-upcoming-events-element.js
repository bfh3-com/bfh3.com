class BFH3UpcomingEvents extends HTMLElement {
	connectedCallback () {
		const maxCount = parseInt(this.getAttribute('max-count')) || 0;
		const hourCutoff = parseInt(this.getAttribute('hour-cutoff')) || 0;
		const timeZone = this.getAttribute('timezone') || '-00:00';
		const eventData = this.querySelector('script[type="text/plain"]').textContent;
		const listElement = this.querySelector('ul');
		const now = new Date();
		const offset = hourCutoff * 60 * 60 * 1000;
		const formatter = new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: 'numeric',
			timeZone,
		});
		const content = eventData
			.split('\n')
			.map((e) => `${e.trim()}:00:00${timeZone}`)
			.map((e) => new Date(e))
			.filter((e) => !isNaN(e.getTime()))
			.sort((a, b) => a - b)
			.filter((e) => now.getTime() < e.getTime() + offset)
			.slice(0, maxCount)
			.map((e) => formatter.format(e))
			.map((e) => `<li>${e}</li>`)
			.join('');
		listElement.innerHTML = content;
	}
}

window.customElements.define('bfh3-upcoming-events', BFH3UpcomingEvents);
