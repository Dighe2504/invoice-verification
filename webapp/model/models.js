sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
<<<<<<< HEAD
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
=======
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
>>>>>>> refs/heads/master
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		}

	};
});