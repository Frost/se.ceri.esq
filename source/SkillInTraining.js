enyo.kind({
  name: "SkillInTraining",
  kind: "RowGroup", 
  caption: "Currently Training", 
  components: [
    {name: "getSkillInTraining", 
      kind: "WebService", 
      onSuccess: "gotSkillInTraining", 
      onFailure: "gotSkillInTrainingFailure"},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Skill", flex: 1},
      {name: "currentlyTraining", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "TQ Time", flex: 1},
      {name: "currentTQTime", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Finishes at", flex: 1},
      {name: "trainingEndTime", flex: 1}
    ]}
  ],
  fetchSkillInTraining: function () {
    var appInfo = enyo.fetchAppInfo(),
        characterId = appInfo.characterId,
        keyId = appInfo.keyId,
        vCode = appInfo.vCode;
    var query = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20%22https%3A%2F%2Fapi.eveonline.com%2Fchar%2FSkillInTraining.xml.aspx%3FkeyID%3D'+ keyId +'%26characterID%3D'+ characterId +'%26vCode%3D'+ vCode +'%22&format=json&callback=';
    this.$.getSkillInTraining.setUrl(query);
    this.$.getSkillInTraining.call();
  },

  gotSkillInTraining: function (inSender, inResponse) {
    var characterSheet = inResponse.query.results.eveapi;
    var levels = [null, "I", "II", "III", "IV", "V"];
    var skill = characterSheet.result.trainingTypeID + " " + levels[characterSheet.result.trainingToLevel];
    this.$.currentlyTraining.setContent(skill);
    this.$.currentTQTime.setContent(characterSheet.result.currentTQTime.content);
    this.$.trainingEndTime.setContent(characterSheet.result.trainingEndTime);
  },

  gotSkillInTrainingFailure: function (inSender, inResponse) {
    
  }
});
