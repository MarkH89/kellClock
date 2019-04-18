/*
JS Clock (kellClock)
Developed by Mark Holden
Version 1.0.0
*/
function kellClock(options) {
    // Check required values have been passed
    if (!options.selector || !options.dateEndString) { return null; }

    // Create private data object
    this._data = (function () {
        return {
            _selector: options.selector,
            _initialised: false,
            _daysAsHours: options.daysAsHours || false,
            _textContents: options.textContents || {
                d: 'd',
                h: 'h',
                m: 'm',
                s: 's'
            },
            _dateEndString: options.dateEndString,
            _dateEnd: 0,
            _container: null,
            _timeLeft: 0,
            _timeNow: 0,
            _d: 1000 * 60 * 60 * 24,
            _h: 1000 * 60 * 60,
            _m: 1000 * 60,
            _minPadding: options.minPadding || 2,
            _fracts: {
                d: null,
                h: null,
                m: null,
                s: null
            },
            _debugMode: options.debugMode || false
        }
    })();

    // Preflight setup
    console.log(this);
    this._data._initialised = this._preflight();
};

kellClock.prototype._preflight = function () {
    let _d = this._data;
    if (_d._initialised) { return true; }
    // Preflight checks and initialisations
    // Check selector exists
    if ((_d._container = document.querySelector(_d._selector)) == null) {
        this._logger('No container for clock');
        return false;
    }
    // Check selecotr is not already in use
    if (_d._container.dataset.clockStatus != undefined) {
        this._logger("Clock already init'd on this selector!");
        return false;
    }
    // Check DateEnd is a valid time
    _d._dateEnd = new Date(_d._dateEndString).getTime();
    if (_d._dateEnd == null || _d._dateEnd == 0 || _d._dateEnd == undefined || isNaN(_d._dateEnd)) {
        this._logger('Failed to find end date');
        return false;
    }
    // Set data on element for clock
    _d._container.dataset.clockStatus = "init";
    // Create time fracts
    for (let k of Object.keys(_d._fracts)) {
        _d._fracts[k] = document.createElement('span');
        _d._fracts[k].className = `${_d._selector}__${k} kellClock-fraction`;
    }
    // All checks and presets completed. Ready to run
    return true;
}

kellClock.prototype.run = function () {
    let _d = this._data;
    // Check clock is ready to go
    if (!_d._initialised) {
        this._logger('Clock failed initialisation');
        return;
    }
    // Insert time fracts
    for (let k in _d._fracts) {
        if (k == 'd' && _d._daysAsHours) {
            // If Days is to be included as hours, then ignore the D element
            continue;
        }
        _d._container.appendChild(_d._fracts[k]);
        // Check text contents exists and insert if required
        if (_d._textContents && (Object.keys(_d._textContents).length !== 0) && (_d._textContents.constructor === Object)) {
            let e = document.createElement('span');
            e.className = 'label';
            e.textContent = _d._textContents[k];
            _d._container.appendChild(e);
        }
    }
    // Begin the countdown
    _d._timeNow = new Date().getTime();
    _d._timeLeft = _d._dateEnd - _d._timeNow;
    // Check there's time left to go, otherwise, don't run the update!
    if (_d.timeLeft < 0) {
        _d.selector.textContent = 'EXPIRED';
    } else {
        this._update();
    }
}

kellClock.prototype._update = function () {
    let _d = this._data;
    // Calculate time remaining
    _d._timeNow = new Date().getTime();
    _d.timeLeft = _d._dateEnd - _d._timeNow;
    // If timer has expired...
    if (_d.timeLeft < 0) {
        _d._selector.textContent = 'EXPIRED';
        _d._container.dataset.clockStatus = "expired";
    } else {
        // Set status to Running
        _d._container.dataset.clockStatus = "running";
        // Only update Days if not daysAsHours
        if (!_d._daysAsHours) {
            _d._fracts.d.textContent = this._stringPad(Math.floor(_d.timeLeft / _d._d));
        }
        // Update text content for the rest
        _d._fracts.h.textContent = _d._daysAsHours ? this._stringPad(Math.floor((_d.timeLeft % _d._d) / _d._h) + Math.floor(_d.timeLeft / _d._d) * 24) : this._stringPad(Math.floor((_d.timeLeft % _d._d) / _d._h));
        _d._fracts.m.textContent = this._stringPad(Math.floor((_d.timeLeft % _d._h) / _d._m));
        _d._fracts.s.textContent = this._stringPad(Math.floor((_d.timeLeft % _d._m) / 1000));
        // Set timeout to run for the next second
        window.setTimeout(() => { this._update(); }, 1000);
    }
}

kellClock.prototype._stringPad = function (n) {
    let _d = this._data;
    return (String(n).split("").length >= _d._minPadding) ? String(n) : String("0" + n).slice(-(_d._minPadding));
}

kellClock.prototype._logger = function (s) {
    if (this._data._debugMode) { console.log(s); }
}