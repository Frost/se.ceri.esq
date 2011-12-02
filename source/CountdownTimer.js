enyo.kind({
  name: "CountdownTimer",
  kind: enyo.Component,
  baseInterval: 1000,
  published: {
    seconds: 0,
    decrementBy: 1
  },
  events: {
    onTriggered: ""
  },
  
  create: function() {
    this.inherited(arguments);
    this.calculateTimeRemainingObject();
    this.start();
  },

  destroy: function() {
    window.clearInterval(this.job);
  },

  start: function() {
    if (this.seconds > 0 ) {
      this.job = window.setInterval(enyo.hitch(this, "timer"), this.baseInterval);
    }
  },
  
  decrement: function() {
    this.setSeconds(this.getSeconds() - this.getDecrementBy());
  },

  calculateTimeRemainingObject: function () {
    var seconds = this.getSeconds();
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    this.timeRemainingObject = {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  },

  timeRemaining: function () {
    var seconds = this.getSeconds();
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    var out = "";
    if (days > 0) {
      out += days + "d";
    }
    if (days > 0 || hours > 0) {
      out += hours + "h";
    }
    if (days > 0 || hours > 0 ||minutes > 0) {
      out += minutes + "m";
    }
    out += seconds + "s";

    return out;
  },

  timer: function() {
    if (this.seconds > 0) {
      this.doTriggered(); // onödig?
      this.decrement();
    } else {
      this.destroy();
    } 
  }  
});
