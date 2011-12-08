enyo.kind({
  name: "DbSetup",
  kind: enyo.Component,
  components: [
    {
      name: "getSkillTree", 
      kind: "WebService", 
      onSuccess: "gotSkillTree", 
      onFailure: "gotSkillTreeFailure",
      url: "http://api.eve-online.com/eve/SkillTree.xml.aspx",
      handleAs: "xml"
    },
    {
      name: "skillsDb", 
      kind: "DbService", 
      dbKind: "se.ceri.esq.Skill:1", 
      onFailure: "gotSkillDbFailure", 
      components: [
        {name: "putSkill", method: "put", onSuccess: "skillSaved"},
        {name: "findSkill", method: "find", onSuccess: "skillFound"},
        {name: "createSkill", method: "putKind", onSuccess: "skillKindCreated"}
      ]
    }
  ],

  create: function () {
    this.inherited(arguments);
    this.setup();
  },

  setup: function () {
    this.createSkillKind(); 
  },

  createSkillKind: function () {
    this.$.createSkill.call(
      {owner: "se.ceri.esq", 
        indexes: [
          {"name":"typeID", "props":[
            {"name":"typeID","type":"single"},
            {"name":"typeName", "type":"single"}
          ]},
          {"name":"typeName", "props": [
            {"name": "typeName", "type": "single"}
          ]}
        ] 
      }
    );
  },

  fetchSkillTree: function () {
    enyo.log("fetching skill tree");
    this.$.getSkillTree.call();
  },

  gotSkillTree: function (inSender, inResponse) {
    enyo.log("parsing skill tree");
    var i,j;
    var xmlString = inResponse;
    var rows = xmlString.getElementsByTagName('row');
    this.skills = [];
    for(i = 0; i < rows.length; i += 1) {
      if(rows[i].hasAttribute("groupName")) {
        continue;
      } else {
        if (rows[i].hasAttribute("published") && rows[i].getAttribute("published") === "1") {
          this.skills.push({
            _kind: "se.ceri.esq.Skill:1",
            typeID: rows[i].getAttribute("typeID"),
            typeName: rows[i].getAttribute("typeName")
          });
        }
      }

    }
    this.$.putSkill.call({
      objects: this.skills
    });
  },

  gotSkillTreeFailure: function () {
    enyo.log("Ooops, couldn't download skill tree :(");
  },

  skillSaved: function (inSender, inResponse) {
    enyo.log("skill saved!");
  },

  gotSkillSaveFailure: function (inSender, inResponse) {
    enyo.log("skill save failed!");
    enyo.log(inResponse);
  },

  skillKindCreated: function (inSender, inResponse) {
    enyo.log("Skill Kind created");
    this.$.findSkill.call({
      query: {
        "from": "se.ceri.esq.Skill:1",
      },
      count: true
    });
  },

  gotSkillDbFailure: function (inSender, inResponse) {
    enyo.log("DB ERROR :(");
    enyo.log(inResponse);
  },

  skillFound: function (inSender, inResponse) {
    enyo.log(inResponse.count);
    if (inResponse.count > 0) {
      enyo.log("SkillTree already exists");
    } else {
      this.fetchSkillTree();
    }
  }
});
