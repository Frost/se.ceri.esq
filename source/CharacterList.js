enyo.kind({
  name: "CharacterList",
  kind: enyo.VFlexBox,
  published: {
    characters: []
  },
  components: [
    {kind: "Scroller", flex: 1, components: [
      {kind: "VirtualRepeater", name: "characterList", onSetupRow: "loadCharacterListItem", components: [
        {kind: "Item", name: "characterItem", components: [
          {name: "characterName", content: "-"},
          {name: "skillInTraining", content: "-"},
          {name: "trainingEndTime", content: "-"},
          {name: "skillTimeRemaining", content: "-"}
        ]}
      ]} 
    ]},
    {kind: "Toolbar", style: "color: white;", name: "tqTime", content: "TQ Time: "}
  ],

  create: function(sender, event) {
    this.inherited(arguments);

    var cookie = enyo.getCookie("se.ceri.esq.Preferences");

    this.characters = enyo.json.parse(cookie).characters;
  },

  loadCharacterListItem: function(sender, index) {
    var character = this.characters[index];
    if (character) {
      this.$.characterName.setContent(character.characterName);
      this.$.skillInTraining.setContent(character.skillString);
      if (character.characterSheet) {
        this.$.trainingEndTime.setContent(character.characterSheet.result.trainingEndTime);
        this.$.skillTimeRemaining.setContent(character.skillTimeRemaining);
      }
      return true;
    }
  },

  loadCharacterList: function() {
    for(var i in this.characters) {
      var character = this.characters[i];
      this.loadCharacterListItem(this.$.characterList, i);
      this.$.tqTime.setContent("TQ Time: " + character.characterSheet.currentTime);
    }
    this.$.characterList.render();
    this.$.tqTime.render();
  }
});
