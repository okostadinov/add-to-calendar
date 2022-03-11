import $ from '../libs/jquery.min';

const attributes = {
    container: 'data-event-container',
    title: 'data-event-title',
    startDate: 'data-event-start-date',
    endDate: 'data-event-end-date',
    startTime: 'data-event-start-time',
    endTime: 'data-event-end-time',
    description: 'data-event-description',
    location: 'data-event-location',
    addBtn: 'data-add-event'
};

const BASE_URL = 'https://calendar.google.com/calendar/render';

export default class EventAdder {
    /**
     * @constructor
     * @param {HTMLElement} element HTML component
     */
    constructor(element) {
        this.$element = $(element);

        this.$element.on('click', (e) => {
            const clickedElement = e.target;

            if (EventAdder.isAddEventClicked(clickedElement)) {
                const link = EventAdder.generateEventLink(clickedElement);
                window.open(link, '_blank'); // open add to calendar link in new tab
            }
        });
    }

    /**
     * Checks if the clicked element is an add-to-calendar button.
     * @param {HTMLElement} btn clicked.
     * @returns true if the clicked element was the add-to-calendar button, otherwise false.
     */
    static isAddEventClicked(btn) {
        return btn.hasAttribute(`${attributes.addBtn}`);
    }

    /**
     * Retrieves the event details based on querying the child components of the event container.
     * @param {HTMLElement} btn used to add event to calendar.
     * @returns an object containing the details of the event.
     */
    static getEventData(btn) {
        const $container = $(btn).closest(`[${attributes.container}]`);

        const title = $container.find(`[${attributes.title}]`).text();
        const startDate = $container.find(`[${attributes.startDate}]`).attr(attributes.startDate);
        const endDate = $container.find(`[${attributes.endDate}]`).attr(attributes.endDate);
        const startTime = $container.find(`[${attributes.startTime}]`).attr(attributes.startTime);
        const endTime = $container.find(`[${attributes.endTime}]`).attr(attributes.endTime);
        const description = $container.find(`[${attributes.description}]`).text();
        const location = $container.find(`[${attributes.location}]`).attr(attributes.location);

        return {
            title,
            startDate,
            endDate,
            startTime,
            endTime,
            description,
            location
        };
    }

    /**
     * Reconstructs the event date string into the necessary format for the URL.
     * @param {String} date in dd.mm.yy format.
     * @returns a string of the date in YYYYMMDD format.
     */
    static formatEventDate(date) {
        const arrDate = date.split('.').reverse();

        // switch month and day places
        [arrDate[1], arrDate[2]] = [arrDate[2], arrDate[1]];

        // add leading 20 to make year format YYYY
        arrDate[0] = `20${arrDate[0]}`;

        return arrDate.join('');
    }

    /**
     * Reconstructs the event time string into the necessary format for the URL.
     * @param {String} time in h:mm format.
     * @returns a string of the time in HHMMSS format.
     */
    static formatEventTime(time) {
        const arrTime = time.split(':');

        // add a leading 0 if the the hour is less than 10
        if (arrTime[0].length === 1) {
            arrTime[0] = `0${arrTime[0]}`;
        }

        // append seconds (neccesary for URL contruction)
        arrTime[2] = '00';

        return arrTime.join('');
    }

    /**
     * Constructs a link to the user's google calendar filled with the details of the event.
     * @param {HTMLElement} btn add to calendar associated with the current event.
     * @returns the URL sending the user to google calendar in order to add the event.
     */
    static generateEventLink(btn) {
        const { title, startDate, endDate, startTime, endTime, description, location } = EventAdder.getEventData(btn);

        const fStartDate = EventAdder.formatEventDate(startDate);
        const fEndDate = EventAdder.formatEventDate(endDate);

        const fStartTime = EventAdder.formatEventTime(startTime);
        const fEndTime = EventAdder.formatEventTime(endTime);

        return `${BASE_URL}?action=TEMPLATE&text=${title}&dates=${fStartDate}T${fStartTime}/${fEndDate}T${fEndTime}&details=${description}&location=${location}`;
    }
}
