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
    {kind: "VFlexBox", flex: 1, components: [
      {kind: "RowGroup", caption: "Character", components: [
        {kind: "Input", flex: 1, name: "characterIdInput", hint: "Character ID (characterID)"},
        {kind: "Input", flex: 1, name: "keyIdInput", hint: "API key ID (keyID)"},
        {kind: "Input", flex: 1, name: "vCodeInput", hint: "API Verification code (vCode)"},
      ]}
    ]},
    {kind: "Toolbar", components: [
      {kind: "Button", flex: 1, name: "saveButton", content: "Save", onclick: "savePreferences"},
      {kind: "Button", name: "backButton", content: "Cancel", onclick: "cancelPreferences"}
    ]}
  ],

  create: function(inSender, inEvent) {
    this.inherited(arguments);
    enyo.application.appPrefs = {
      character: {
        characterId: "",
        keyId: "",
        vCode: ""
      }
    };

    var cookie = enyo.getCookie("se.ceri.esq.Preferences");

    if (cookie) {
      enyo.application.appPrefs = enyo.mixin(enyo.application.appPrefs, enyo.json.parse(cookie));
      this.$.characterIdInput.setValue(enyo.application.appPrefs.character.characterId);
      this.$.keyIdInput.setValue(enyo.application.appPrefs.character.keyId);
      this.$.vCodeInput.setValue(enyo.application.appPrefs.character.vCode);
    }
  },

  savePreferences: function () {
    this.characterId = this.$.characterIdInput.getValue();
    this.keyId = this.$.keyIdInput.getValue();
    this.vCode = this.$.vCodeInput.getValue();
    console.log(this.characterId);

    enyo.application.appPrefs.character.characterId = this.characterId;
    enyo.application.appPrefs.character.keyId = this.keyId;
    enyo.application.appPrefs.character.vCode = this.vCode;

    enyo.setCookie("se.ceri.esq.Preferences", enyo.json.stringify(enyo.application.appPrefs));

    this.doSave('');
  },

  cancelPreferences: function () {
    this.doCancel();
  }

});
