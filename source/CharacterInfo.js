enyo.kind({
  name: "CharacterInfo",
  kind: "RowGroup", 
  caption: "Character info", 
  published: {
    characterName: "",
  },
  components: [
    {name: "getCharacterSheet", 
      kind: "WebService", 
      onSuccess: "gotCharacterSheet", 
      onFailure: "gotCharacterSheetFailure"},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Name", flex: 1},
      {name: "characterName", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Race", flex: 1},
      {name: "characterRace", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {name: "characterCloneGrade", content: "Clone grade", flex: 1},
      {name: "characterCloneSkillPoints", flex: 1}
    ]},
  ],
  fetchCharacterSheet: function () {
    var character = enyo.application.appPrefs.character,
        characterId = character.characterId,
        keyId = character.keyId,
        vCode = character.vCode;
    if (characterId && keyId && vCode) {
      var query = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20%22https%3A%2F%2Fapi.eveonline.com%2Fchar%2FCharacterSheet.xml.aspx%3FkeyID%3D'+ keyId +'%26characterID%3D'+ characterId +'%26vCode%3D'+ vCode +'%22&format=json&callback=';
      this.$.getCharacterSheet.setUrl(query);
      this.$.getCharacterSheet.call();
    } else {
      alert("Please enter your character settings first!");
    }
  },

  gotCharacterSheet: function (inSender, inResponse) {
    var characterSheet = inResponse.query.results.eveapi;
    this.characterName = characterSheet.result.name;
    this.$.characterName.setContent(this.characterName);
    this.$.characterRace.setContent(characterSheet.result.race);
    this.$.characterCloneGrade.setContent(characterSheet.result.cloneName);
    this.$.characterCloneSkillPoints.setContent(characterSheet.result.cloneSkillPoints);
  },

  gotCharacterSheetFailure: function (inSender, inResponse) {
    
  }
});
