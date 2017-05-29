sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("CDCI1.controller.View1", {
		handleSelectionFinish: function(oEvent) {
			
			//implementacion del filtro
			
			//recuperamos los Items seleccionados
			var oSelectedItem = oEvent.getParameter("selectedItems");
			
			//definimos el array dónde se van a definir los parámetros del filtro
			var aFilter = [];
			
			//definimos la variable donde se va a guardar el text o key del Item seleccionado
			var sQuery;

			//cargamos el filtro con los parámetros a filtrar
			for (var i = 0; i < oSelectedItem.length; i++) {

				sQuery = oSelectedItem[i].mProperties.key;
				aFilter.push(new Filter("Carrid", FilterOperator.EQ, sQuery));
			}
			
			//recuperamos los datos de la tabla
			var oTable = this.getView().byId("Vuelos");
			var oBinding = oTable.getBinding("rows");
			
			//aplicamos el filtro
			oBinding.filter(aFilter);
		}
	});
});