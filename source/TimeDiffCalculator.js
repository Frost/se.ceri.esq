enyo.kind({
  name: "TimeDiffCalculator",
  kind: enyo.Component,
  components: [],

  create: function() {
    this.inherited(arguments);
  },

  skillTimeRemaining: function(characterSheet) {
    var currentTime = new Date(characterSheet.result.currentTQTime.content.replace(/-/g, "/"));
    var endTime = new Date(characterSheet.result.trainingEndTime.replace(/-/g, "/"));
    var secondsRemaining = (endTime - currentTime) / 1000;

    return this.timeRemaining(secondsRemaining);
  },

  timeRemaining: function (seconds) {
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
});
