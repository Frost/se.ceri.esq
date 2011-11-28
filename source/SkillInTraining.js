enyo.kind({
  name: "SkillInTraining",
  kind: "Group", 
  caption: "Currently Training", 
  components: [
    {name: "getSkillInTraining", 
      kind: "WebService", 
      onSuccess: "gotSkillInTraining", 
      onFailure: "gotSkillInTrainingFailure"},
    {kind: "HFlexBox", flex: 1, components: [
      {kind: "Item", content: "Skill", flex: 1},
      {kind: "Item", name: "currentlyTraining", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {kind: "Item", content: "TQ Time", flex: 1},
      {kind: "Item", name: "currentTQTime", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {kind: "Item", content: "Finishes at", flex: 1},
      {kind: "Item", name: "trainingEndTime", flex: 1}
    ]}
  ],
  fetchSkillInTraining: function () {
    var appInfo = enyo.fetchAppInfo(),
        characterId = appInfo.characterId,
        keyId = appInfo.keyId,
        vCode = appInfo.vCode;
    var query = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20%22https%3A%2F%2Fapi.eveonline.com%2Fchar%2FSkillInTraining.xml.aspx%3FkeyID%3D'+ keyId +'%26characterID%3D'+ characterId +'%26vCode%3D'+ vCode +'%22&format=json&callback=';
    console.log(query);
    this.$.getSkillInTraining.setUrl(query);
    this.$.getSkillInTraining.call();
  },

  gotSkillInTraining: function (inSender, inResponse) {
    var characterSheet = inResponse.query.results.eveapi;
    var levels = [null, "I", "II", "III", "IV", "V"];
    console.log(characterSheet);
    var skill = characterSheet.result.trainingTypeID + " " + levels[characterSheet.result.trainingToLevel];
    this.$.currentlyTraining.setContent(skill);
    console.log(characterSheet.result.currentTQTime);
    this.$.currentTQTime.setContent(characterSheet.result.currentTQTime.content);
    this.$.trainingEndTime.setContent(characterSheet.result.trainingEndTime);
  },

  gotSkillInTrainingFailure: function (inSender, inResponse) {
    
  }
});
