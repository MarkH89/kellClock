# kellClock

kellClock is a small project to make a small, straightforward and easy to use countdown timer. This was built out of initial frustration with numerous projects at work using a jQuery plugin that not only didn't work correctly, often failed to activate when loaded and suffered from lack of decent documentation.

kellClock aims to overcome numerous problems by being:
* jQuery Independent
* Easy to set up and initialise
* Gracefully fail if incorrectly initialised
* Built in defaults for minimal configuration
* Allow multiple clocks on the page

## Usage

Simply create a container for the clock and import kellClock:
```
<div class="kell-clock"></div>

<script type="text/javascript" src="kellClock.js">
```

And in your main JS file:
```
let options = {
    selector : '.kell-clock',
    dateEndString : '12/06/2018 12:00:00'
}
var clock1 = new kellClock(options).run();

// or

var clock2 = new kellClock({
    selector : '.kell-clock',
    dateEndString : '12/06/2018 12:00:00'
});
// ...later
clock2.run();

// With additional options:
var clock3 = new kellClock({
    selector: '.clock-3',
    dateEndString: '12/07/2019 12:00:00',
    daysAsHours: false,
    textContents: {
        d: 'Days',
        h: 'Hours',
        m: 'Minutes',
        s: 'Seconds'
    },
    minPadding: 2,
    debugMode: false
}).run();
```

Required options:
* selector : (String) Selector where the clock is to be inserted i.e '.kell-clock'
* dateEndString: (String) Date and Time to countdown to i.e '12/06/2018 12:00:00'

Optional parameters:
* daysAsHours: (Boolean) Display days as hours - remaining days is included in the hours value (so hour values can be 23+ hours remaining) Default: false
* textContents: (Object) Text to denote time fractions Default:
```
{
    d: 'd',
    h: 'h',
    m: 'm',
    s: 's'
}
```
Each key denotes the fraction of the timer that the text is applied to.
* minPadding: (Int) Minimum number of digits to display. Values lower than the minPadding will be padded with 0's. Default: 2
* debugMode: (Boolean) set to true to see console output for testing. Default: false