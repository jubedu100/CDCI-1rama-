sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/format/DateFormat",
	"sap/ui/model/Sorter",
	"sap/ui/table/SortOrder"

], function(Controller, Filter, FilterOperator, DateFormat, Sorter, SortOrder) {
	"use strict";

	return Controller.extend("CDCI1.controller.View1", {

		onAfterRendering: function() {

			var that = this; //Para que la fecha y la hora se actualice continuamoente

			//Fecha actual

			var dFecha = new Date();

			var y = dFecha.getFullYear();
			var m = "0" + (dFecha.getMonth() + 1);
			if (m > 9) {
				m = dFecha.getMonth();
			}
			var d = "0" + dFecha.getDate();
			if (d > 9) {
				d = dFecha.getDate();
			}
			this.getView().byId("fecha").setText(d + "/" + m + "/" + y);

			//Hora actual

			var hh = "0" + dFecha.getHours();
			if (hh > 9) {
				hh = dFecha.getHours();
			}
			var MM = "0" + dFecha.getMinutes();
			if (MM > 9) {
				MM = dFecha.getMinutes();
			}
			var ss = "0" + dFecha.getSeconds();
			if (ss > 9) {
				ss = dFecha.getSeconds();
			}

			this.getView().byId("hora").setText(hh + ":" + MM + ":" + ss);

			setInterval(function() {
				that.onAfterRendering();
			}, 500);

		},

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
		//Pruebas: cambiar estado según aprueba o rechaza

		// hacer que aparezca estos iconons
		/*<core:Icon src="sap-icon://sys-enter-2" class="size2" color="green"/>
									<core:Icon src="sap-icon://sys-cancel" class="size2" color="red"/>*/
		cambia_estado: function(oEvent) {
			//$(".cambia_estado");
			var boton = oEvent.getSource().getId();

			//__button4-__clone12
			//9 y 23
			//12 y 26
			var splitt = boton.split("__"); //divide el string en dos partes separando por "__", la parte [1] tiene button4- y la parte [2] tiene cloneXX
			var res = splitt[2].substring(5); //metemos en res el valor del string splitt[2] (cloneXX), contado desde la posicion 5 hasta el final (Solo las XX)

			//Aprobar
			if (boton.includes("button4")) {
				//Modificamos el SRC del coreicon (id coreicon) en la posicon res-3 para button4 y res-4 para button5
				this.getView().byId("__xmlview0--CoreIcon-__clone" + (res - 3)).setSrc("sap-icon://sys-enter-2");

			}
			//rechazar
			else if (boton.includes("button5")) {
				this.getView().byId("__xmlview0--CoreIcon-__clone" + (res - 4)).setSrc("sap-icon://sys-cancel");

			}

		},

		//Fin prueba
		busqueda_avanzada: function(oEvent) {
			if (oEvent.mParameters.pressed == true) {
				$(".busqueda_avanzada").removeClass("oculto");
				this.getView().byId("btn1").setText("Ocultar búsqueda avanzada");

				//Crea una scrollBar horizontal solo para la tabla (solo cuando se necesita aparece)
				var oHSB = new sap.ui.core.ScrollBar("horiSB");

				oHSB.placeAt("flight");

			} else {
				$(".busqueda_avanzada").addClass("oculto");
				this.getView().byId("btn1").setText("Búsqueda avanzada");

			}
		},
		handfechacomite: function(oEvent) {
			//implementacion del filtro

			//recuperamos los Items seleccionados
			/*var sQuery = oEvent.mParameters.value;*/

			//************recuperar valor para Datepicker****************
			/*			var oSource = oEvent.getSource();
						var sQuery = oSource.getDateValue();*/

			//************recuperar valor para DateRangeSelection****************
			var sQueryFrom = oEvent.mParameters.from;
			var sQueryTo = oEvent.mParameters.to;

			/*			function sumarDias(fecha, dias) {
							fecha.setDate(fecha.getDate() + dias);
							return fecha;
						}*/

			//definimos la variable donde se va a guardar el text o key del Item seleccionado

			/*			var d = sQuery;
						var incremental = sumarDias(d, 1);*/

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
			aFilter.push(new Filter("Fldate", FilterOperator.BT, sQueryFrom, sQueryTo));

			//aplicamos el filtro
			oBinding.filter(aFilter);
			oTable.setVisibleRowCount(10);
		},

		sortDeliveryDate: function(oEvent) {
			var oView = this.getView();
			/*oCurrentColumn.setSorted(true);*/

			var oTable = oView.byId("Vuelos");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("rows");

			// apply grouping
			var aSorters = [];
			var sPath = mParams.column.mProperties.sortProperty;
			if (mParams.sortOrder == "Descending") {
				var bDescending = true;
			} else {
				var bDescending = false;
			}
			aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},

		download: function() {
			var oView = this.getView();
			/*oCurrentColumn.setSorted(true);*/

			var oTable = oView.byId("Vuelos");
			/*var oSelectedItem = sap.ui.getCore().byId("Vuelos").getSelectedItems();*/
			var oSelectedItem = oTable.getBinding("rows");
			/*			var item1 = oSelectedItem[0];
						var cells = item1.getCells();*/
			/*			console.log(cells);
						var oPname = cells[0].getText();
						var oDescription = cells[1].getText();
						var oRating = cells[2].getValue();
			*/

			/*var docx = new DOCXjs();*/
/*			var JSZip = require('jszip');*/
/*var Docxtemplater = require('docxtemplater');*/
/*var fs = require('fs');
var path = require('path');*/
//Load the docx file as a binary
/*var content = fs
.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');
var zip = new JSZip(content);*/

			var doc = new DOCXjs();
			/*var doc = new Docxgen();*/
			/*var doc = new Docxtemplater();*/
			/*			var doc = new jsPDF();*/

			/*		doc.setFontSize(30);
						doc.text(50, 35, 'Products Detail ');*/

			/*		doc.setFontSize(14);
				doc.text(20, 60, 'Product Name: ' );
				doc.setFontSize(14);
				doc.text(20, 80, 'Description: ');
				doc.setFontSize(14);
				doc.text(20, 100, 'Rating: ');*/

			/*			doc.save('orderList.pdf');*/
						doc.output('orderList.docx');

		}
	});
});