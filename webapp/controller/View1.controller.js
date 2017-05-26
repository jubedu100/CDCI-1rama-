sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("CDCI1.controller.View1", {
	handleSelectionFinish: 	function(oEvent) {
		/*var lv_refresh = false;*/
			/*console("value:"+this.getSelectedKeys());},*/
	  var oSelectedItem = oEvent.getParameter("selectedItems");
	  
	   var sQuery = [];
	   for (var i = 0; i < oSelectedItem.length; i++ ){
	   	sQuery.push(oSelectedItem[i].sId);
	   	
	   }
	   /*oSelectedItem[0].sId;*/
    var aCurrentFilterValues = [];

			/*aCurrentFilterValues.push(this.getSelectedItemText(sQuery));*/
			/*aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));

			this.filterTable(aCurrentFilterValues);*/
			
			var oColumn = oEvent.getParameter("column");

    }

	});
	
});