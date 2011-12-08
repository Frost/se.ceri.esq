enyo.kind({
  name: "SkillInTraining",
  kind: "RowGroup", 
  caption: "Currently Training", 
  published: {
    skill: {},
    level: "",
    levels: [null, "I", "II", "III", "IV", "V"]
  },
  components: [
    {name: "getSkillInTraining", 
      kind: "WebService", 
      onSuccess: "gotSkillInTraining", 
      onFailure: "gotSkillInTrainingFailure"},
    {
      name: "skillFinder", 
      kind: "DbService", 
      dbKind: "se.ceri.esq.Skill:1", 
      onFailure: "skillFailure", 
      components: [
        {name: "findSkill", method: "find", onSuccess: "skillFound"}
      ]
    },
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Skill", flex: 1},
      {name: "currentlyTraining", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Time remaining", flex: 1},
      {name: "remainingTime", kind: "CountdownTimer", seconds: 0, onTriggered: "updateTimerContent"},
      {name: "remainingSeconds", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "TQ Time", flex: 1},
      {name: "currentTQTime", flex: 1}
    ]},
    {kind: "HFlexBox", flex: 1, components: [
      {content: "Finishes at", flex: 1},
      {name: "trainingEndTime", flex: 1}
    ]},
  ],

  fetchSkillInTraining: function () {
    enyo.log("fetching skill in training");
    var character = enyo.application.appPrefs.character,
        characterId = character.characterId,
        keyId = character.keyId,
        vCode = character.vCode;
    if (characterId && keyId && vCode) {
      var query = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20%22https%3A%2F%2Fapi.eveonline.com%2Fchar%2FSkillInTraining.xml.aspx%3FkeyID%3D'+ keyId +'%26characterID%3D'+ characterId +'%26vCode%3D'+ vCode +'%22&format=json&callback=';
      this.$.getSkillInTraining.setUrl(query);
      this.$.getSkillInTraining.call();
    } else {
      alert("Please fix your settings first!");
    }
  },

  gotSkillInTraining: function (inSender, inResponse) {
    enyo.log("got /SkillInTraining")
    var characterSheet = inResponse.query.results.eveapi;

    this.$.remainingTime.stop();
    
    this.level = this.levels[characterSheet.result.trainingToLevel];

    this.$.findSkill.call({
      query: {
        "from": "se.ceri.esq.Skill:1", 
        "where": [{
          "prop": "typeID", 
          "op": "=", 
          "val": characterSheet.result.trainingTypeID
        }]
      }, 
      count: true
    });

    this.$.currentTQTime.setContent(characterSheet.result.currentTQTime.content);
    this.$.trainingEndTime.setContent(characterSheet.result.trainingEndTime);
   
    var currentTime = new Date(characterSheet.result.currentTQTime.content.replace(/-/g, "/"));
    var endTime = new Date(characterSheet.result.trainingEndTime.replace(/-/g, "/"));
    var secondsRemaining = (endTime - currentTime) / 1000;
    this.$.remainingTime.setSeconds(secondsRemaining);
    this.$.remainingTime.start();
  },

  gotSkillInTrainingFailure: function (inSender, inResponse) {
    enyo.log("gotSkillInTrainingFailure: ");
    enyo.log(inResponse);
  },

  updateTimerContent: function () {
    this.$.remainingSeconds.setContent(this.$.remainingTime.timeRemaining());
  }, 

  skillFound: function (inSender, inResponse) {
    enyo.log("skill found");

    if (inResponse.returnValue === true && inResponse.results.length > 0) {
      this.skill = inResponse.results[0];
      var skillString = this.skill.typeName + " " + this.level;
      this.$.currentlyTraining.setContent(skillString);
      enyo.log("current skill: " + skillString);
    }

  },
  
  skillFailure: function (inSender, inResponse) {
    enyo.log("skill failure");
    enyo.log(inResponse);
  },
});
