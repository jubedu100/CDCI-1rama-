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

			

			//definimos la variable donde se va a guardar el text o key del Item seleccionado
			var sQuery;


			//recuperamos los datos de la tabla
			var oTable = this.getView().byId("Vuelos");
			var oBinding = oTable.getBinding("rows");

			//definimos el array dónde se van a definir los parámetros del filtro
			var aFilter = [];
			
			//cargamos el filtro con los elementos del filtro que ya están aplicados
			//y eliminamos los elementos pertenecientes al filtro a aplicar
			//para mantener el resto de filtros activos

			for (i = 0; i < oBinding.aFilters.length; i++) {
				aFilter[i] = oBinding.aFilters[i];
			}

			for (i = 0; i < aFilter.length; i++) {
				if (aFilter[i].sPath == "Carrid") {
					aFilter.splice(i, 1);
				}
			}
			
			//cargamos el filtro con los parámetros a filtrar
			for (var i = 0; i < oSelectedItem.length; i++) {

				sQuery = oSelectedItem[i].mProperties.key;
				aFilter.push(new Filter("Carrid", FilterOperator.EQ, sQuery));
			}
			
			//eliminamos el filtro aplicado en la carga inicial de datos
			oBinding.aApplicationFilters = [];

			//aplicamos el filtro
			oBinding.filter(aFilter);
			oTable.setVisibleRowCount(10);

			//********************importate!!!**************************
			//Al aplicar el filtro, se realiza una nueva consulta al servicio oData, que tiene que estar implementado en el metodo 
			//correspondiente para que devuelva los datos correctos
		},

		busqueda_avanzada: function(oEvent) {
			if (oEvent.mParameters.pressed == true) {
				$(".busqueda_avanzada").removeClass("oculto");
				$(".button_search").text("ocultar busqueda avanzada");
			} else {
				$(".busqueda_avanzada").addClass("oculto");
			}
		},
		handfechacomite: function(oEvent) {
			//implementacion del filtro

			//recuperamos los Items seleccionados
			/*var sQuery = oEvent.mParameters.value;*/
			var oSource = oEvent.getSource();
			var sQuery = oSource.getDateValue();



			function sumarDias(fecha, dias) {
				fecha.setDate(fecha.getDate() + dias);
				return fecha;
			}

			//definimos la variable donde se va a guardar el text o key del Item seleccionado

			var d = sQuery;
			var incremental = sumarDias(d, 1);

			
			//recuperamos los datos de la tabla
			var oTable = this.getView().byId("Vuelos");
			var oBinding = oTable.getBinding("rows");
			
			//definimos el array dónde se van a definir los parámetros del filtro

			var aFilter = [];
			
			//cargamos el filtro con los elementos del filtro que ya están aplicados
			//y eliminamos los elementos pertenecientes al filtro a aplicar
			//para mantener el resto de filtros activos

			for (var i = 0; i < oBinding.aFilters.length; i++) {
				aFilter[i] = oBinding.aFilters[i];
			}

			for (i = 0; i < aFilter.length; i++) {
				if (aFilter[i].sPath == "Fldate") {
					aFilter.splice(i, 1);
				}

			}

			//cargamos el filtro con los parámetros a filtrar
			aFilter.push(new Filter("Fldate", FilterOperator.EQ, sQuery, incremental));


			//aplicamos el filtro
			oBinding.filter(aFilter);
			oTable.setVisibleRowCount(10);
		}

	});
});