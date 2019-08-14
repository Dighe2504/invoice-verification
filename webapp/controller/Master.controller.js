sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("demo.Splitapp.controller.Master", {

		onInit: function () {
		
			// var model1 = new sap.ui.model.json.JSONModel("model/Product.json");
			// model1.onload("model/Product.json");
			this.getOwnerComponent().getModel("MasterJsonModel").loadData("model/MasterData.json", null, false);
			// sap.ui.getCore().setModel(model1);

		},

		handleListItemPress: function (oEvent) {
		//debugger;
/*	this._showDetail(oEvent.getParameter("myList"));*/
//	this._showDetail();
//	var title =	oEvent.getSource().getTitle();
//	MessageToast.show(title);

//var title = oEvent.getSource().mProperties.title;
// alert(title);
		// 	var selectedItem = oEvent.getSource().getselected;

		// 	var context = selectedItem.getBindingContext("model/Product.json");
		// //var arrayObject = context.oModel.getProperty(context.sPath);
		// //	var value = arrayObject.value;
		// 	MessageToast.show(context);
			
			
			// var oSelectedItem = oEvent.getParameter('selectedItem');
			// 						var oPlantInput = oControllerPlantextension.getView().byId("mylist");
			// 						oPlantInput.setValue(oSelectedItem.getTitle());

			

			// 		// var list = sap.ui.getCore().byId("myList");
			// 		// list.setSelectedItem(list.getItems()[0], true, true);
//	var sPath =	oEvent.getParameters().listItem.oBindingContexts.MasterJsonModel.sPath;	
		//	var sPath = oEvent.oSource.oBindingContexts.MasterJsonModel.sPath; // /pr/0
			var sPath = sPath.slice(9); // 0
		var oDetailData = 	this.getView().getModel("MasterJsonModel").getData().Product[sPath]; //
			
			var oModel2 = new sap.ui.model.json.JSONModel();
			oModel2.setData(oDetailData);
			this.getView().setModel(oModel2, "oModel2");
		
			this.getOwnerComponent().getModel("oModel2").setData(oDetailData);
				//debugger;
			//this.getOwnerComponent()
		},
		
// _showDetail : function (oEvent) {
// 	debugger;
//      var sPath = oEvent.getBindingContext().getPath();
//      var oObject = this.getView().getModel().getProperty(sPath);
//      this._oRouter.navTo("detail", {detailId: oObject.ID});
// }
   		
	handleSearch : function (oEvent) {
		// create model filter
		var filters = [];
		var query = oEvent.getParameter("query");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("ProductName", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
		}

		// update list binding
		var list = this.getView().byId("myList");
		var binding = list.getBinding("items");
		binding.filter(filters);
	}
	

	});
});