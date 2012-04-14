enyo.kind({
	name: "EveSkillQueue",
	kind: enyo.VFlexBox,
	components: [
    {name: "dbSetup", kind: "DbSetup", onSetupFinished: "updateSkills"},
    {name: "skillQueueUpdater", kind: "SkillQueueUpdater", onUpdateFinished: "renderCharacterList"},
    {kind: "PageHeader", content: "Eve Skill Queue"},
    {name: "pane", kind: "Pane", flex: 1, components: [
      {name: "characterList", kind: "CharacterList" },
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

  create: function() {
    this.inherited(arguments);

    this.characters = [];
    this.skills = {};
  },

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
  },

  updateSkills: function(sender, event) {
    this.$.skillQueueUpdater.updateCharacters();
  },

  renderCharacterList: function(sender, event) {
    enyo.log("nu har vi uppdaterat alla skills!");

    this.characters = this.$.skillQueueUpdater.getCharacters();
    this.skills = this.$.skillQueueUpdater.getSkills();

    for (var c in this.characters) {
      var character = this.characters[c];
      var skill = this.skills[character.characterSheet.result.trainingTypeID].typeName;
      this.characters[c].skillString = skill + " " + character.level;
    }
    this.$.characterList.setCharacters(this.characters);
    this.$.characterList.loadCharacterList();
  }
});
