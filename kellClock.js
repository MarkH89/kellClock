function kellClock(
    selector,
    dateEndString,
    daysAsHours = false,
    minPadding = 2,
    textContents = {
        d: 'd',
        h: 'h',
        m: 'm',
        s: 's'
    }
) {
    // Check required values have been passed
    if (!selector || !dateEndString) { return null; }

    this._data = (function () {
        return {
            _selector: null,
            _initialised: false,
            _daysAsHours: false,
            _textContents: {},
            _dateEndString: '',
            _dateEnd: 0,
            _container: null,
            _timeLeft: 0,
            _timeNow: 0,
            _d: 1000 * 60 * 60 * 24,
            _h: 1000 * 60 * 60,
            _m: 1000 * 60,
            _minPadding: 0,
            _fracts: {
                d: null,
                h: null,
                m: null,
                s: null
            }
        }
    })();

    // Set Initial Data
    this._data._selector = selector;
    this._data._dateEndString = dateEndString;
    this._data._daysAsHours = daysAsHours;
    this._data._initialised = false;
    this._data._textContents = textContents;
    this._data._minPadding = minPadding;

    // Preflight setup
    this._data._initialised = this._preflight();

    return this;
};

kellClock.prototype._preflight = function () {
    if (this._data._initialised) { return true; }
    // Preflight checks and initialisations
    // Check selector exists
    if ((this._data._container = document.querySelector(this._data._selector)) == null) {
        console.log('No container for clock');
        return false;
    }
    // Check selecotr is not already in use
    if (this._data._container.dataset.clockStatus != undefined) {
        console.log("Clock already init'd!");
        return false;
    }
    // Check DateEnd is a valid time
    this._data._dateEnd = new Date(this._data._dateEndString).getTime();
    if (this._data._dateEnd == null || this._data._dateEnd == 0 || this._data._dateEnd == undefined || isNaN(this._data._dateEnd)) {
        console.log('Failed to find end date');
        return false;
    }
    // Set data on element for clock
    this._data._container.dataset.clockStatus = "init";
    // Create time fracts
    for (let k of Object.keys(this._data._fracts)) {
        this._data._fracts[k] = document.createElement('span');
        this._data._fracts[k].className = `${this._data._selector}__${k} kellClock-fraction`;
    }
    // All checks and presets completed. Ready to run
    return true;
}

kellClock.prototype.run = function () {
    // Check clock is ready to go
    if (!this._data._initialised) {
        console.log('Clock not initialised');
        return;
    }
    // Insert time fracts
    for (let k in this._data._fracts) {
        if (k == 'd' && this._data._daysAsHours) {
            // If Days is to be included as hours, then ignore the D element
            continue;
        }
        this._data._container.appendChild(this._data._fracts[k]);
        // Check text contents exists and insert if required
        if (this._data._textContents && (Object.keys(this._data._textContents).length !== 0) && (this._data._textContents.constructor === Object)) {
            let e = document.createElement('span');
            e.className = 'label';
            e.textContent = this._data._textContents[k];
            this._data._container.appendChild(e);
        }
    }
    // Begin the countdown
    this._data._timeNow = new Date().getTime();
    this._data._timeLeft = this._data._dateEnd - this._data._timeNow;
    // Check there's time left to go, otherwise, don't run the update!
    if (this._data.timeLeft < 0) {
        this._data.selector.textContent = 'EXPIRED';
    } else {
        this._update();
    }
}

kellClock.prototype._update = function () {
    // Calculate time remaining
    this._data._timeNow = new Date().getTime();
    this._data.timeLeft = this._data._dateEnd - this._data._timeNow;
    // If timer has expired...
    if (this._data.timeLeft < 0) {
        this._data._selector.textContent = 'EXPIRED';
        this._data._container.dataset.clockStatus = "expired";
    } else {
        // Set status to Running
        this._data._container.dataset.clockStatus = "running";
        // Only update Days if not daysAsHours
        if (!this._data._daysAsHours) {
            this._data._fracts.d.textContent = this._stringPad(Math.floor(this._data.timeLeft / this._data._d));
        }
        // Update text content for the rest
        this._data._fracts.h.textContent = this._data._daysAsHours ? this._stringPad(Math.floor((this._data.timeLeft % this._data._d) / this._data._h) + Math.floor(this._data.timeLeft / this._data._d) * 24) : _stringPad(Math.floor((this._data.timeLeft % this._data._d) / this._data._h));
        this._data._fracts.m.textContent = this._stringPad(Math.floor((this._data.timeLeft % this._data._h) / this._data._m));
        this._data._fracts.s.textContent = this._stringPad(Math.floor((this._data.timeLeft % this._data._m) / 1000));
        // Set timeout to run for the next second
        window.setTimeout(() => { this._update(); }, 1000);
    }
}

kellClock.prototype._stringPad = function (n) {
    return (String(n).split("").length >= this._data._minPadding) ? String(n) : String("0" + n).slice(-(this._data._minPadding));
}