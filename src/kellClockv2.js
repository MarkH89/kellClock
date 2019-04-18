/*
JS Clock V2(kellClock)
Developed by Mark Holden
Version 2.0.0
*/

// Check if kellClock already exists, and return new instance if not
var kellClock = kellClock || (function(){

    const _data = {
        _clockObjects: [],
        _day: 1000 * 60 * 60 * 24,
        _hour: 1000 * 60 * 60,
        _month: 1000 * 60,
        _debug: false,
        _initComplete: false
    }

    const _clockStatus = {
        INITIALISED: 'Initialised',
        RUNNING: 'Running',
        PAUSED: 'Paused',
        DEREGISTERING: 'Deregister'
    }

    /*
    * * Clock Data structure

    _selector: document selector for the clock
    _clockID: id of the clock
    _timeend: endTime of the clock

    */

    function _log(output) {
        if(_data._debug) {
            console.log(output);
        }
    }

    function _init(debug = false) {
        if(_data._initComplete) return;
        // * Do stuff
        _data._initComplete = true;
        return;
    }

    function _findIndexByID(clockID) {
        // * Find id
        return _data._clockObjects.findIndex(function(el){
            return el.ID == clockID;
        });
    }

    function _findSelector(selector) {
        // Check selector
        let selector = document.querySelector(selector);
        if(!selector) {
            _log("Selector not found");
            return null;
        }
        // * Check selector is not already in use
        var i = _data._clockObjects.findIndex(function(el) {
            return el.selector == selector;
        });
        if(i != -1) {
            _log("Selector is already in use")
            return null;
        }

        return selector;
    }

    function _getTime(time) {
        let time = new Date(time);
        if(time == null || time == 0 || time == undefined || isNaN(time)) {
            _log("Failed to create time from time string");
            return null;
        }
        return time;
    }

    function _createClock(selector, clockID, timeEnd) {
        // * Check ID
        if(_findIndexByID(clockID) != -1) {
            _log("ID already exists");
            return null;
        }
        // * Check Selector
        selector = _findSelector(selector);
        if(!selector) {
            _log("Failed to use selector");
            return null;
        }
        // * Check timeend
        timeEnd = _getTime(timeEnd);
        if(!timeEnd) {
            _log("Failed to create time");
            return null;
        }
        // * All should now be well, so add to the list of objects
        return {
            ID: clockID,
            selector: selector,
            timeEnd: timeEnd,
            status: _clockStatus.INITIALISED
        };
    }

    function _register(selector, clockID, timeEnd) {
        if(!_data._initComplete) {
            _log("Not yet initialised!");
             return;
        }
        let clock = _createClock(selector, clockID, timeEnd);
        if(!clock) {
            _log("Failed to create new clock");
            return;
        }
        // Add clock to the list of registered objects
        _data._clockObjects.push(clock);
    }

    function _deregister(id) {
        // Find clock index to remove
        let clockIndex = _findIndexByID(id);
        if(clockIndex != -1) {
            // Removal to occur on update
            _data._clockObjects[clockIndex].status = _clockStatus.DEREGISTERING;
        } else {
            _log("Clock to deregister not found");
        }
    }

    function _pauseByID(id = null) {
        let clockIndex = _findIndexByID(id);
        if(clockIndex != -1) {
            _data._clockObjects[clockIndex].status = _clockStatus.PAUSED;
        } else {
            _log("Clock to pause not found");
        }
    }

    function _runByID(id = null) {}

    function _update() {}

    return {
        init: _init,
        register: _register,
        deregister: _deregister,
        pause: _pauseByID,
        run: _runByID
    }

})();