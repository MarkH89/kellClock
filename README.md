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
var clock1 = new kellClock('.kell-clock', '12/06/2018 12:00:00').run();

// or

var clock2 = new kellClock('.kell-clock', '12/07/2018 12:00:00');
// ...later
clock2.run();
```

Required parameters:
* selector (String) i.e '.kell-clock'
* Date and Time to countdown to (String) i.e '12/06/2018 12:00:00'

Optional parameters:
* Display days as hours - remaining days is included in the hours value (so hour values can be 23+ hours remaining) (Boolean) Default: false
* Minimum number of digits required for time values - Pad values with leading 0 if the time value is less than the number of digits required. I.e 9 will display as 09 is min value is 2. 9 will display as 9 if value is 1. 9 will display as 009 if value is 3. (Int) Default: 2
* Text to denote time fractions (Object) Default:
```
{
    d: 'd',
    h: 'h',
    m: 'm',
    s: 's'
}
```
Each key denotes the fraction of the timer that the text is applied to.