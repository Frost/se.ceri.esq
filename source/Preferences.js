enyo.kind({
  name: "Preferences",
  kind: enyo.VFlexBox,
  events: {
    onReceive: "",
    onSave: "",
    onEnd: "",
    onCancel: ""
  },
  published: {
    characterId: "",
    keyId: "",
    vCode: ""
  },
  components: [
    {kind: "PageHeader", content: "ESQ - Preferences" },
    {kind: "Popup", name: "characterForm", components: [
      {kind: "RowGroup", caption: "Character", components: [
        {kind: "Input", flex: 1, name: "characterNameInput", hint: "Character name"},
        {kind: "Input", flex: 1, name: "characterIdInput", hint: "Character ID (characterID)"},
        {kind: "Input", flex: 1, name: "keyIdInput", hint: "API key ID (keyID)"},
        {kind: "Input", flex: 1, name: "vCodeInput", hint: "API Verification code (vCode)"},
      ]},
      {kind: "Toolbar", components: [
        {kind: "Button", flex: 1, name: "saveCharacterButton", content: "Save", onclick: "saveCharacterForm"},
        {kind: "Button", name: "cancelCharacterButton", content: "Cancel", onclick: "cancelCharacterForm"}
      ]}
    ]},
    {kind: "VFlexBox", flex: 1, components: [
      {kind: "VirtualRepeater", name: "characterList", onSetupRow: "getCharacter", components: [
        {kind: "SwipeableItem", layoutKind: "HFlexLayout", onclick: "editCharacter", onConfirm: "deleteCharacter", components: [
          {name: "characterName", content: ""}
        ]}
      ]},
      {kind: "Button", flex: 1, name: "addCharacterButton", content: "Add Character", onclick: "newCharacterForm"}
    ]},
    {kind: "Toolbar", components: [
      {kind: "Button", flex: 1, name: "saveButton", content: "Save", onclick: "savePreferences"},
      {kind: "Button", name: "backButton", content: "Cancel", onclick: "cancelPreferences"}
    ]}
  ],

  create: function(inSender, inEvent) {
    this.inherited(arguments);
    enyo.application.appPrefs = {
      characters: []
      // "character name": {
      //   characterId: "",
      //   keyId: "",
      //   vCode: ""
      // }
    };

    var cookie = enyo.getCookie("se.ceri.esq.Preferences");

    // enyo.application.appPrefs.characters = [
    //   {"characterName": "blameus", "characterId":"674667371","keyId":"225492","vCode":"6BreisaNhJ7pZ8XH7sTxdtn5tMjyEJc69uN9CWiRD1lQmWanUAXPTA12yfrbzxMH"},
    //   {"characterName": "Mina", "characterId":"552765432","keyId":"838937","vCode":"Yn8kuk67yWYi8mnhot3m5l3zH98IdO6pNSwXXAQqM2tec1VDKnSS0iCBKoxrEHu2"}
    //  ];
    //  enyo.setCookie("se.ceri.esq.Preferences", enyo.json.stringify(enyo.application.appPrefs));

    if (cookie) {
      enyo.application.appPrefs = enyo.mixin(enyo.application.appPrefs, enyo.json.parse(cookie));
    } else {
      enyo.error("no cookie");
    }
    this.characterIndex = enyo.application.appPrefs.characters.length;
  },

  savePreferences: function () {
    enyo.setCookie("se.ceri.esq.Preferences", enyo.json.stringify(enyo.application.appPrefs));

    this.doSave('');
  },

  cancelPreferences: function () {
    this.doCancel();
  },

  getCharacter: function(sender, index) {
    var character = enyo.application.appPrefs.characters[index];
    if (character) {
      this.$.characterName.setContent(character.characterName);
      return true;
    }
  },

  editCharacter: function(sender, event) {
    var character = enyo.application.appPrefs.characters[event.rowIndex];
    this.characterIndex = event.rowIndex;
    this.loadCharacterForm(character);
  },

  openCharacterForm: function() {
    this.$.characterForm.openAtCenter(); 
  },

  saveCharacterForm: function() {
    var character = enyo.application.appPrefs.characters[this.characterIndex];

    this.storeCharacter(character);

    this.characterIndex = enyo.application.appPrefs.characters.length;
    this.clearCharacterForm();
    this.$.characterList.render();
  },

  cancelCharacterForm: function() {
    this.clearCharacterForm();
  },

  newCharacterForm: function() {
    this.clearCharacterForm();
    this.openCharacterForm();
  },

  clearCharacterForm: function() {
    this.openCharacterForm();
    this.$.characterNameInput.setValue("");
    this.$.characterIdInput.setValue("");
    this.$.keyIdInput.setValue("");
    this.$.vCodeInput.setValue("");
    this.$.characterForm.close();
  },

  loadCharacterForm: function(character) {
    this.openCharacterForm();

    this.$.characterNameInput.setValue(character.characterName);
    this.$.characterIdInput.setValue(character.characterId);
    this.$.keyIdInput.setValue(character.keyId);
    this.$.vCodeInput.setValue(character.vCode);
  },

  storeCharacter: function(character) {
    if (character === undefined ) {
      var character = {};
    }

    character.characterName = this.$.characterNameInput.getValue();
    character.characterId = this.$.characterIdInput.getValue();
    character.keyId = this.$.keyIdInput.getValue();
    character.vCode = this.$.vCodeInput.getValue();

    enyo.application.appPrefs.characters[this.characterIndex] = character;
  },

  deleteCharacter: function(sender, index) {
    enyo.application.appPrefs.characters.splice(index,1);
    this.$.characterList.render();
  }

});
