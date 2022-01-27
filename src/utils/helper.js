import {PREPARE_TIME, MILE, TIME} from '../define'

import moment from 'moment'

export function formatMoney(n, currency) {
    return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

export function cleanSlug(str) {

    return str.replace(/[|&;$%@"<>()+,_-]/g, ' ').toLowerCase()
}

export function convertKm2Mile(km) {

    return km * MILE;

}

export function getPhotogapherName(fullname) {
    let [firstname, lastname] = fullname.split(' ')
    return firstname.charAt(0).toUpperCase() + firstname.slice(1) + ' ' + lastname.charAt(0).toUpperCase()
}

export function cleanSlugTitleEvent(str) {

    return str.replace(/[_]/g, ' ').toLowerCase()
}

export function getRouteName(str) {

    let arr = str.split('/')
    return cleanSlug(arr[arr.length - 1])
}

export function chunkArray(arr, size) {
    return Array.from({length: Math.ceil(arr.length / size)}, (v, i) =>
        arr.slice(i * size, i * size + size)
    );
}


export function getFirstWordsOfText(s, n) {

    s = s.replace(/<[^>]*>?/gm, '')
    var cut = s.indexOf(' ', n);
    if (cut == -1) return s;
    s = s.substring(0, cut)

    return s.replace(/^(.{n}[^\s]*).*/gm, "$1")


}

export function getSizeClient(width) {

    let size = 'xs'

    if (width >= 1600) {
        size = 'xl';
    } else if (width >= 1200) {
        size = 'lg';
    } else if (width >= 992) {
        size = 'md';
    } else if (width >= 768) {
        size = 'sm';
    }
    return size;
}


export function getTimeForBookNow() {
    let now = moment().add(PREPARE_TIME, 'minutes'),
        hourAfterAdd = parseInt(now.format('h')),
        newMinute = '00 ';
    if (parseInt(now.format('m')) > 30) {
        hourAfterAdd += 1;
    } else {
        newMinute = '30 ';
    }
    /*
     *  if now : 11:45 PM => 12:30 PM
     *  time for book must be hour:00 or hour:30
     *
     * */

    hourAfterAdd = ('0' + hourAfterAdd).slice(-2)
    // add prefix 0 before number less than 10

    return hourAfterAdd + ':' + newMinute + now.format('A')
}

export function isAvailableTime(ampm) {
    let d = new Date()
    let hours = d.getHours();
    let minutes = d.getMinutes()


    if (minutes > 30) {
        hours += 1
        minutes = '00'
    } else {
        minutes = '30'
    }

    let ampmNOW = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? '0' + hours : hours;

    return {
        isAvailable: TIME.indexOf(ampm) >= TIME.indexOf(hours + ':' + minutes + ' ' + ampmNOW),
        ampmNOW: hours + ':' + minutes + ' ' + ampmNOW
    }
}


export function removeStorage(name) {
    try {
        localStorage.removeItem(name);
        localStorage.removeItem(name + '_expiresIn');
    } catch (e) {
        console.log('removeStorage: Error removing key [' + name + '] from localStorage: ' + JSON.stringify(e));
        return false;
    }
    return true;
}

export function getStorage(key) {

    var now = Date.now();  //epoch time, lets deal only with integer
    // set expiration for storage
    var expiresIn = localStorage.getItem(key + '_expiresIn');
    if (expiresIn === undefined || expiresIn === null) {
        expiresIn = 0;
    }

    if (expiresIn < now) {// Expired
        removeStorage(key);
        return null;
    } else {
        try {
            var value = localStorage.getItem(key);
            return value;
        } catch (e) {
            console.log('getStorage: Error reading key [' + key + '] from localStorage: ' + JSON.stringify(e));
            return null;
        }
    }
}

export function getExcerptText(str, count) {
    return str.split(/\s+/).slice(0, count).join(" ") + ' ...';
}

export function isDefine(_) {
    return typeof _ != 'undefined' && _ != ''
}

export function setStorage(key, value, expires) {

    if (expires === undefined || expires === null) {
        expires = (24 * 60 * 60);  // default: seconds for 1 day
    } else {
        expires = Math.abs(expires); //make sure it's positive
    }

    var now = Date.now();  //millisecs since epoch time, lets deal only with integer
    var schedule = now + expires * 1000;
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule);
    } catch (e) {
        console.log('setStorage: Error setting key [' + key + '] in localStorage: ' + JSON.stringify(e));
        return false;
    }
    return true;
}

export function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}


export function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

export function updateUrlHttpsForImage(url) {
    var pattern = 'http://photosesh.s3.amazonaws.com'
    return url.replace(pattern, 'https://photosesh.s3.amazonaws.com');
}


Object.defineProperty(Array.prototype, 'chunk_inefficient', {
    value: function (chunkSize) {
        const array = this;
        return [].concat.apply([],
            array.map(function (elem, i) {
                return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
            })
        );
    }
});

export function validEmail(e) {
    const filter = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


    return String(e).search(filter) !== -1;
}

export default {
    formatMoney,
    getRouteName,
    cleanSlug
}

