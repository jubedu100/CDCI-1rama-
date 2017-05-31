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
			oTable.setVisibleRowCount(10);
		/*	oBinding*/
			
			//********************importate!!!**************************
			//Al aplicar el filtro, se realiza una nueva consulta al servicio oData, que tiene que estar implementado en el metodo 
			//correspondiente para que devuelva los datos correctos
		},
		
		busqueda_avanzada: function(oEvent){
			if (oEvent.mParameters.pressed == true) {
			$(".busqueda_avanzada").removeClass("oculto");
			$(".button_search").text("ocultar busqueda avanzada");
			}else{
				$(".busqueda_avanzada").addClass("oculto");
			}
		},
		ocultar_busqueda_avanzada: function(){
			$(".busqueda_avanzada").addClass("oculto");
		}
			
		
		
	});
});