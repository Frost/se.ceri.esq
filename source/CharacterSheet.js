enyo.kind({
  name: "CharacterSheet",
  kind: enyo.VFlexBox,
  components: [
    {flex: 1, kind: "Scroller", components: [
      {kind: "CharacterInfo", name: "characterInfo"},
      {kind: "SkillInTraining", name: "skillInTraining"}
    ]}, 
    {kind: "Toolbar", components: [
      {content: "Update Character Sheet", kind: "Button", onclick: "updateCharacterSheet"}
    ]},
  ],
  updateCharacterSheet: function () { 
    this.$.characterInfo.fetchCharacterSheet(); 
    this.$.skillInTraining.fetchSkillInTraining(); 
  } 
});
