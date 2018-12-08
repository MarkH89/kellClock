var kellClock = (function () {

    var _run = function () {
        // Check clock is ready to go
        if (!_data._initialised || !_data._readyToRun) {
            console.log('Clock not initialised');
            return;
        }
        // Insert time fracts
        for (let k in _data._fracts) {
            if (k == 'd' && _data._daysAsHours) {
                // If Days is to be included as hours, then ignore the D element
                continue;
            }
            _data._container.appendChild(_data._fracts[k]);
            // Check text contents exists and insert if required
            if (_data._textContents && (Object.keys(_data._textContents).length !== 0) && (_data._textContents.constructor === Object)) {
                let e = document.createElement('span');
                e.className = 'label';
                e.textContent = _data._textContents[k];
                _data._container.appendChild(e);
            }
        }
        // Begin the countdown
        _data._timeNow = new Date().getTime();
        _data._timeLeft = _data._dateEnd - _data._timeNow;
        if (_data.timeLeft < 0) {
            _data.selector.textContent = 'EXPIRED';
        } else {
            _update();
        }
        _data._timerSet = 1;
    }

    var _update = function () {
        _data._timeNow = new Date().getTime();
        _data.timeLeft = _data._dateEnd - _data._timeNow;
        _data._container.dataset.clockStatus = "running";
        if (!_data._daysAsHours) {
            _data._fracts.d.textContent = _stringPad(Math.floor(_data.timeLeft / _data._d));
        }
        _data._fracts.h.textContent = _data._daysAsHours ? _stringPad(Math.floor((_data.timeLeft % _data._d) / _data._h) + Math.floor(_data.timeLeft / _data._d) * 24) : _stringPad(Math.floor((_data.timeLeft % _data._d) / _data._h));
        _data._fracts.m.textContent = _stringPad(Math.floor((_data.timeLeft % _data._h) / _data._m));
        _data._fracts.s.textContent = _stringPad(Math.floor((_data.timeLeft % _data._m) / 1000));
        if (_data.timeLeft < 0) {
            _data._selector.textContent = 'EXPIRED';
            _data._container.dataset.clockStatus = "expired";
        } else {
            window.setTimeout(() => { _update(); }, 1000);
        }
    }

    var _init = function (selector, dateEndString, daysAsHours = false, minPadding = 2, textContents = {
        d: 'd',
        h: 'h',
        m: 'm',
        s: 's'
    }) {
        // Check required values have been passed
        if (!selector || !dateEndString) { return null; }

        // Set Initial Data
        _data._selector = selector;
        _data._dateEndString = dateEndString;
        _data._daysAsHours = daysAsHours;
        _data._initialised = false;
        _data._textContents = textContents;
        _data._minPadding = minPadding;

        _data._initialised = true;

        // Preflight setup
        _data._readyToRun = _preflight() ? true : false;

        return this;
    }

    var _preflight = function () {
        // Preflight checks and initialisations
        // Check selector exists
        if ((_data._container = document.querySelector(_data._selector)) == null) {
            console.log('No container for clock');
            return false;
        }
        // Check selecotr is not already in use
        if (_data._container.dataset.clockStatus != undefined) {
            console.log("Clock already init'd!");
            return false;
        }
        // Check DateEnd is a valid time
        _data._dateEnd = new Date(_data._dateEndString).getTime();
        if (_data._dateEnd == null || _data._dateEnd == 0 || _data._dateEnd == undefined || isNaN(_data._dateEnd)) {
            console.log('Failed to find end date');
            return false;
        }
        // Set data on element for clock
        _data._container.dataset.clockStatus = "init";
        // Create time fracts
        for (let k of Object.keys(_data._fracts)) {
            _data._fracts[k] = document.createElement('span');
            _data._fracts[k].className = `${_data._selector}__${k} kellClock-fraction`;
        }
        // All checks and presets completed. Ready to run
        return true;
    }

    var _data = {
        _selector: null,
        _initialised: false,
        _readyToRun: false,
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
        _timerSet: 0,
        _minPadding: 0,
        _fracts: {
            d: null,
            h: null,
            m: null,
            s: null
        }
    }

    // Improved String Padding
    var _stringPad = function (n) {
        return (String(n).split("").length >= _data._minPadding) ? String(n) : String("0" + n).slice(-(_data._minPadding));
    }

    return {
        run: _run,
        init: _init
    }

})();