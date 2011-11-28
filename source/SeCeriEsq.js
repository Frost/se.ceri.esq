enyo.kind({
	name: "EveSkillQueue",
	kind: enyo.VFlexBox,
	components: [
    {name: "pane", kind: "Pane", flex: 1, components: [
      {name: "characterSheet", kind: "CharacterSheet" },
      {
        name: "preferences", 
        kind: "Preferences",
        className: "enyo-bg",
        onReceive: "preferencesReceived",
        onSave: "preferencesSaved",
        onCancel: "goBack"
        
      }
    ]},
    {kind: "AppMenu", components: [
      {caption: "Preferences", onclick: "showPreferences", onBack: "goBack"}
    ]},
    {kind: "enyo.ApplicationEvents", onBack: "goBack"}

	],

  showPreferences: function() {
    this.$.pane.selectViewByName("preferences");
  },

  preferencesSaved: function() {
    this.$.pane.back();
  },

  goBack: function (inSender, inEvent) {
    this.$.pane.back(inEvent);
  }, 

  backHandler: function (inSender, inEvent) {
    this.$.pane.back(inEvent);
    inEvent.stopPropagation();
  }
});
