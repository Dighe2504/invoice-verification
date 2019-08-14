sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller, MessageToast, Fragment) {
	"use strict";

	return Controller.extend("demo.Splitapp.controller.Detail", {
		onPressAR: function (oEvent) {

			// show in a pop-up which button was pressed

			var MessageTitle = oEvent.getSource().getText();

			jQuery.sap.require("sap.m.MessageBox");
			sap.m.MessageBox.show(

				"You have pressed " + MessageTitle, {
					icon: sap.m.MessageBox.Icon.INFORMATION,
					title: "Action on Press",
					actions: [sap.m.MessageBox.Action.OK]
				}

			);

		},
		onInit: function (oEvent) {
			// debugger;
			// dataPath : "model/Product.json", null, false",
			//this.getOwnerComponent().getModel("MasterJsonModel").loadData("model/Product.json", null, false);
			var oModel = new sap.ui.model.json.JSONModel();
			//	oModel = this.getOwnerComponent().getModel("MasterJsonModel").getData();
			oModel.loadData("model/Product.json", null, false);
			this.getView().setModel(oModel, "oModel");

			var oUploadcollectionmodel = new sap.ui.model.json.JSONModel();
			//	oModel = this.getOwnerComponent().getModel("MasterJsonModel").getData();
			oUploadcollectionmodel.loadData("model/UploadCollectionData.json", null, false);
			this.getView().setModel(oUploadcollectionmodel, "oUploadcollectionmodel");

			// var oModel = new
			// omdel.setdata()

		},

		handleOpen: function (oEvent) {
		//	debugger;
			var oButton = oEvent.getSource();

			var oView = this.getView();
			// this.oDialog = oView.byId("idrequireddatefilterdialog");
			if (!this.ActionSheet) {
				//debugger;
				this.ActionSheet = sap.ui.xmlfragment(oView.getId(), "demo.Splitapp.fragments.ActionSheet", this);
				oView.addDependent(this.ActionSheet);
			}
			//	this.oDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			// this.ActionSheet.open();
	this.ActionSheet.openBy(oButton);
			// create action sheet only once
			// 	if (!this._actionSheet) {
			// 		this._actionSheet = sap.ui.xmlfragment(
			// 			"sap.m.sample.ActionSheet.ActionSheet",
			// 			this
			// 		);
			// 		this.getView().addDependent(this._actionSheet);
			// 	}

			// 	this._actionSheet.openBy(oButton);
		},
		actionSelected: function (oEvent) {
			MessageToast.show("Selected action is '" + oEvent.getSource().getText() + "'");
		}

	});

});