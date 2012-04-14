enyo.kind({
  name: "SkillQueueUpdater",
  kind: enyo.Component,
  published: {
    characters: [],
    skills: {}
  },
  events: {
    "onUpdateFinished": ""
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
    {name: "timeDiffCalculator", kind: "TimeDiffCalculator"}
  ],

  create: function() {
    this.inherited(arguments);
    var cookie = enyo.getCookie("se.ceri.esq.Preferences");
    this.characters = enyo.json.parse(cookie).characters;
    this.skills = {};
    this.levels = [null, "I", "II", "III", "IV", "V"];
  },

  updateCharacters: function() {
    this.currentCharacterIndex = 0;
    this.queuesChecked = 0;
    this.skillsChecked = 0;
    for (var i in this.characters) {
      this.getSkillInTraining(i);
    }
  },

  getSkillInTraining: function(characterIndex) {
    enyo.log("fetching skill in training");
    var character = this.characters[characterIndex];

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
    this.characters[this.currentCharacterIndex].characterSheet = characterSheet;
    this.characters[this.currentCharacterIndex].level = this.levels[characterSheet.result.trainingToLevel];
    this.characters[this.currentCharacterIndex].skillTimeRemaining = this.$.timeDiffCalculator.skillTimeRemaining(characterSheet);

    this.currentCharacterIndex += 1;
    this.queuesChecked += 1;

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
  },

  gotSkillInTrainingFailure: function (inSender, inResponse) {
    enyo.log("gotSkillInTrainingFailure: ");
    enyo.log(inResponse);
  },

  updateTimerContent: function () {
    // this.$.remainingSeconds.setContent(this.$.remainingTime.timeRemaining());
  }, 

  skillFound: function (inSender, inResponse) {
    enyo.log("skill found");

    if (inResponse.returnValue === true && inResponse.results.length > 0) {
      var skill = inResponse.results[0];
      this.skills[skill.typeID] = skill;
      var skillString = skill.typeName + " ";// + this.level;
      // this.$.currentlyTraining.setContent(skillString);
    }
    this.skillsChecked += 1;
    this.checkUpdateFinished();
  },

  skillFailure: function (inSender, inResponse) {
    this.skillsChecked += 1;
    this.checkUpdateFinished();
    enyo.error("skill failure");
    enyo.error(inResponse);
  },

  checkUpdateFinished: function() {
    if (this.skillsChecked === this.characters.length && this.queuesChecked === this.characters.length) {
      this.doUpdateFinished();
    }
  }
});
