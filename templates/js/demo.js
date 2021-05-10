/*!
 * Contact Buttons Plugin Demo 0.1.0
 * https://github.com/joege/contact-buttons-plugin
 *
 * Copyright 2015, José Gonçalves
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

// Initialize Share-Buttons
$.contactButtons({
    effect: 'slide-on-scroll',
    buttons: {
        'facebook': { class: 'facebook', use: true, link: 'https://www.facebook.com/rssi.in', extras: 'target="_blank"' },
        'google': { class: 'whatsapp', use: true, link: 'https://wa.me/919831233994', extras: 'target="_blank"' },
        'phone': { class: 'phone', use: true, link: '+917980168159' },
        'email': { class: 'email', use: true, link: 'info@rssi.in' }
    }
});