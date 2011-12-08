enyo.kind({
  name: "SkillTree",
  kind: enyo.Component,
  published: {
    skillGroups: [],
    skills: []
  },
  components: [
    {name: "getSkillTree",
      kind: "WebService",
      onSuccess: "gotSkillTree",
      onFailure: "gotSkillTreeFailure",
    },
    {name: "saveSkillsDb",
      kind: "DbService",
      dbKind: "se.ceri.esq.Skill:1",
      method: "put",
      onSuccess: "skillSaved",
      onFailure: "skillSaveFailure"
    }
  ],

  fetchSkillTree: function () {
    var query = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20%22https%3A%2F%2Fapi.eveonline.com%2Feve%2FSkillTree.xml.aspx%22&format=json&callback=";
    this.$.getSkillTree.setUrl(query);
    this.$.getSkillTree.call();
  },

  gotSkillTree: function (inSender, inResponse) {
    var i,j, skillGroup, skill;

    this.skillGroups = inResponse.query.results.eveapi.result.rowset.row;
    this.log("number of skill groups: " + this.skillGroups.length);
    this.skills = [];
    
    for(i = 0; i < this.skillGroups.length; i += 1){
      skillGroup = this.skillGroups[i].rowset.row;
      for(j = 0; j < skillGroup.length; j += 1) {
        this.log("saving skill: " + skillGroup[j].typeName);
        this.$.saveSkillsDb.call({
          objects: [
            {
              _kind: "se.ceri.esq.Skill:1",
              id: skillGroup[j].typeID,
              name: skillGroup[j].typeName,
              groupId: skillGroup[j].groupID,
              rank: skillGroup[j].rank,
              description: skillGroup[j].description
            }
          ]
        });
        //this.skills.push(skillGroup[j]);
      }
    }
    this.log("skill tree loaded");
    this.log("number of skills: " + this.skills.length);
  },

  findSkillById: function (skillId) {
    var i, j, skill;
    this.log("trying to find skill with id: " + skillId);
    this.log("number of skills: " + this.skills.length);
    for(i = 0; i < this.skills.length; i += 1){//this.skills.length; i = i + 0) {
      if(this.skills[i].typeID === skillId) {
        return this.skills[i];
      }
    }

    return undefined;
  },

  gotSkillTreeFailure: function () {
    this.log("Ooops, couldn't download skill tree :(");
  },

  skillSaved: function (inSender, inResponse) {
    this.log("skill saved!");
    this.log(inResponse);
  },

  skillSaveFailure: function (inSender, inResponse) {
    this.log("skill save failed!");
    this.log(inResponse);
  }
});
