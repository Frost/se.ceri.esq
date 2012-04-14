enyo.kind({
  name: "CharacterListItem",
  kind: "Item",
  published: {
    character: {}
  },
  components: [
    {name: "characterName", content: ""},
    {name: "skillInTraining", kind: "SkillInTraining"},
    {name: "timeLeftInQueue"},
  ],

  create: function(sender, event) {
    this.inherited(arguments);
  },

  renderCharacter: function() {
    this.$.characterName.setContent(this.character.characterName);
    this.$.skillInTraining.setCharacter(this.character);
    this.$.skillInTraining.fetchSkillInTraining();
  }
});

