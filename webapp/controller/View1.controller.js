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
    /*var aCurrentFilterValues = [];

			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectCategory));
			aCurrentFilterValues.push(this.getSelectedItemText(this.oSelectSupplierName));

			this.filterTable(aCurrentFilterValues);
*/
    }

	});
	
});