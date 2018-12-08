function kellClock(selector, endDate, daysAsHours = false, textContents = {
    d: 'd',
    h: 'h',
    m: 'm',
    s: 's'
}
) {
    this.selector = selector;
    this.endDate = endDate;
    this.daysAsHours = daysAsHours;
    this.initialised = false;
    this.textContents = textContents;
    this._data = {
        _dateEnd: 0,
        _container: null,
        _timeLeft: 0,
        _timeNow: 0,
        _d: 1000 * 60 * 60 * 24,
        _h: 1000 * 60 * 60,
        _m: 1000 * 60,
        _timerSet: 0,
        _fracts: {
            d: null,
            h: null,
            m: null,
            s: null
        }
    }
    return this;
};

kellClock.prototype.run = function () {
    let _d = this._data;
    let i = this.initialised ? true : this.init();
    if (i && (this.initialised) && (_d._timerSet == 0) && (_d._container)) {
        for (let k in _d._fracts) {
            if (k == 'd' && this.daysAsHours) {
                continue;
            }
            _d._container.appendChild(_d._fracts[k]);
            if (this.textContents && (Object.keys(this.textContents).length !== 0) && (this.textContents.constructor === Object)) {
                let e = document.createElement('span');
                e.className = 'label';
                e.textContent = this.textContents[k];
                _d._container.appendChild(e);
            }
        }
        _d._timeNow = new Date().getTime();
        _d._timeLeft = _d._dateEnd - _d._timeNow;
        if (_d.timeLeft < 0) {
            _d.selector.textContent = 'EXPIRED';
        } else {
            this.update();
        }
        _d._timerSet = 1;
    }
    return null;
}

kellClock.prototype.init = function () {
    // Initialise
    let _d = this._data;
    _d._container = document.querySelector(this.selector);
    if (_d._container == null) {
        console.log('No container for clock');
        return false;
    }
    if (_d._container.dataset.clockStatus != undefined) {
        console.log("Clock already init'd!");
        return false;
    }
    _d._container.dataset.clockStatus = "init";
    _d._dateEnd = new Date(this.endDate).getTime();
    if (_d._dateEnd == null || _d._dateEnd == 0 || _d._dateEnd == undefined || isNaN(_d._dateEnd)) {
        console.log('Failed to find end date');
        return false;
    }
    for (let k of Object.keys(_d._fracts)) {
        _d._fracts[k] = document.createElement('span');
        _d._fracts[k].className = `${this.selector}__${k} clock-timer`;
    }
    this.initialised = true;
    return this.initialised;
};

kellClock.prototype.update = function () {
    let _d = this._data;
    _d._timeNow = new Date().getTime();
    _d.timeLeft = _d._dateEnd - _d._timeNow;
    _d._container.dataset.clockStatus = "running";
    if (!this.daysAsHours) {
        _d._fracts.d.textContent = this.stringPad(Math.floor(_d.timeLeft / _d._d));
    }
    _d._fracts.h.textContent = this.daysAsHours ? this.stringPad(Math.floor((_d.timeLeft % _d._d) / _d._h) + Math.floor(_d.timeLeft / _d._d) * 24) : this.stringPad(Math.floor((_d.timeLeft % _d._d) / _d._h));
    _d._fracts.m.textContent = this.stringPad(Math.floor((_d.timeLeft % _d._h) / _d._m));
    _d._fracts.s.textContent = this.stringPad(Math.floor((_d.timeLeft % _d._m) / 1000));
    if (_d.timeLeft < 0) {
        document.querySelector('#mn_cd-container').textContent = 'EXPIRED';
        _d._container.dataset.clockStatus = "expired";
    } else {
        window.setTimeout(() => { this.update(); }, 1000);
    }
}

kellClock.prototype.stringPad = function (n) {
    return String("0" + n).slice(-2);
}
