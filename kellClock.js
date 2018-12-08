function RivClock(selector, endDate, daysAsHours = false, textContents = {}) {
    this.selector = selector;
    this.endDate = endDate;
    this.daysAsHours = daysAsHours;
    this.initialised = false;
    this.textContents = {
        d: 'd',
        h: 'h',
        m: 'm',
        s: 's'
    };
    this._data = {
        _dateEnd: 0,
        container: null,
        timeLeft: 0,
        timeNow: 0,
        _d: 1000 * 60 * 60 * 24,
        _h: 1000 * 60 * 60,
        _m: 1000 * 60,
        timerSet: 0,
        _fracts: {
            d: null,
            h: null,
            m: null,
            s: null
        }
    }
    return this;
};

RivClock.prototype.run = function () {
    if (!this.initialised) this.init();
    if ((this.initialised) && (this._data.timerSet == 0) && (this._data.container)) {
        for (let k in this._data._fracts) {
            if (k == 'd' && this.daysAsHours) {
                continue;
            }
            this._data.container.appendChild(this._data._fracts[k]);
            if (Object.keys(this.textContents).length !== 0 && this.textContents.constructor === Object) {
                let e = document.createElement('span');
                e.className = 'label';
                e.textContent = this.textContents[k];
                this._data.container.appendChild(e);
            }
        }
        this._data.timeNow = new Date().getTime();
        this._data.timeLeft = this._data._dateEnd - this._data.timeNow;
        if (this._data.timeLeft < 0) {
            this._data.selector.textContent = 'EXPIRED';
        } else {
            this.update();
        }
        timerSet = 1;
    }
}

RivClock.prototype.init = function () {
    // Initialise
    this._data.container = document.querySelector(this.selector);
    if (this._data.container == null) {
        console.log('No container for clock');
        return;
    }
    this._data._dateEnd = new Date(this.endDate).getTime();
    if (this._data._dateEnd == null || this._data._dateEnd == 0 || this._data._dateEnd == undefined || isNaN(this._data._dateEnd)) {
        console.log('Failed to find end date');
        return;
    }
    for (let k of Object.keys(this._data._fracts)) {
        this._data._fracts[k] = document.createElement('span');
        this._data._fracts[k].className = `${this.selector}__${k} clock-timer`;
    }
    this.initialised = true;
};

RivClock.prototype.update = function () {
    this._data.timeNow = new Date().getTime();
    this._data.timeLeft = this._data._dateEnd - this._data.timeNow;
    if (!this.daysAsHours) {
        this._data._fracts.d.textContent = this.stringPad(Math.floor(this._data.timeLeft / this._data._d));
    }
    this._data._fracts.h.textContent = this.daysAsHours ? this.stringPad(Math.floor((this._data.timeLeft % this._data._d) / this._data._h) + Math.floor(this._data.timeLeft / this._data._d) * 24) : this.stringPad(Math.floor((this._data.timeLeft % this._data._d) / this._data._h));
    this._data._fracts.m.textContent = this.stringPad(Math.floor((this._data.timeLeft % this._data._h) / this._data._m));
    this._data._fracts.s.textContent = this.stringPad(Math.floor((this._data.timeLeft % this._data._m) / 1000));
    if (this._data.timeLeft < 0) {
        document.querySelector('#mn_cd-container').textContent = 'EXPIRED';
    } else {
        window.setTimeout(() => { this.update(); }, 1000);
    }
}

RivClock.prototype.stringPad = function (n) {
    return String("0" + n).slice(-2);
}
