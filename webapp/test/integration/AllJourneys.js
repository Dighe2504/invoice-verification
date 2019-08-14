/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"demo/Splitapp/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"demo/Splitapp/test/integration/pages/app",
	"demo/Splitapp/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "demo.Splitapp.view.",
		autoWait: true
	});
});