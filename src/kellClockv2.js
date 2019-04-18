/*
JS Clock V2(kellClock)
Developed by Mark Holden
Version 2.0.0
*/

// Check if kellClock already exists, and return new instance if not
var kellClock = kellClock || (function(){

    var _data = {
        _clockObjects: [],
        _day: 1000 * 60 * 60 * 24,
        _hour: 1000 * 60 * 60,
        _month: 1000 * 60,
        _debug: false,
        _initComplete: false
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
        // Do stuff
        _data._initComplete = true;
    }

    function _findID(clockID) {
        // Find id
        return _data._clockObjects.findIndex(function(el){
            return el.ID == clockID;
        });
    }

    function _createClock(selector, clockID, timeEnd) {
        if(_findID(clockID) != -1) {
            _log("ID already exists");
            return;
        }
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
        // Call and return _createClock()
    }

    function _deregister(id) {}

    function _pause(id = null) {}

    function _run(id = null) {}

    function _update() {}

    return {
        init: _init,
        register: _register,
        deregister: _deregister,
        pause: _pause,
        run: _run
    }

})();