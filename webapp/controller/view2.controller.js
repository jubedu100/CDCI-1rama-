sap.ui.define([
	'jquery.sap.global',
	'sap/m/MessageToast',
	'sap/m/UploadCollectionParameter',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/core/format/DateFormat',
	'sap/ui/model/Sorter',
	'sap/ui/table/SortOrder',
	'sap/ui/unified/FileUploaderParameter'
	

], function(jQuery, MessageToast, UploadCollectionParameter, Controller, Filter, FilterOperator, DateFormat, Sorter, SortOrder, UIComponent, Device, models) {
	"use strict";
	
var header_xcsrf_token;

	return Controller.extend("CDCI1.controller.view2", {

		guardar: function() {
			
			 
			var oTable   = sap.ui.getCore().byId("__xmlview1--Vuelos");
			var oBinding = oTable.getBinding("rows");
			var oModel   = oBinding.getModel();
			
			
			var mNewEntry = {};

			mNewEntry.Carrid = $("#__xmlview2--Carrid-inner").val();
			mNewEntry.Connid = $("#__xmlview2--Connid-inner").val();
			var oParameters  = {
				"Carrid": mNewEntry.Carrid,
				"Connid": mNewEntry.Connid
			};
		

		oModel.create("/FLIGHTSet", oParameters);

		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf CDCI1.view.view2
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf CDCI1.view.view2
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf CDCI1.view.view2
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf CDCI1.view.view2
		 */
		//	onExit: function() {
		//
		//	}

		/*	var PageController = Controller.extend("sap.m.sample.UploadCollectionForPendingUpload.Page", {*/

		onChange : function(oEvent) {
			
			OData.request
        ({
             requestUri: "/sflight/sap/opu/odata/SAP/Z001_VUELOS_PRUEBA_SRV/FileSet",
                   method: "GET",
                   headers:
                       {     
                                      "X-Requested-With": "XMLHttpRequest",
                                      "Content-Type": "application/atom+xml",
                                      "DataServiceVersion": "2.0",       
                                      "X-CSRF-Token":"Fetch"   
                       }           
                },

                 function (data, response)
                 {
                     header_xcsrf_token = response.headers['x-csrf-token'];

                 }
          );
/*		var header_xcsrf_token = "";
		 OData.request
        ({
             requestUri: "/sflight/sap/opu/odata/SAP/Z001_VUELOS_PRUEBA_SRV/FileSet",
                   method: "GET",
                   headers:
                       {     
                                      "X-Requested-With": "XMLHttpRequest",
                                      "Content-Type": "application/atom+xml",
                                      "DataServiceVersion": "2.0",       
                                      "X-CSRF-Token":"Fetch"   
                       }           
                },

                 function (data, response)
                 {
                       header_xcsrf_token = response.headers['x-csrf-token'];
                 }
          );

			var oUploadCollection = oEvent.getSource();

			var oCustomerHeaderToken = new UploadCollectionParameter({
				name : "x-csrf-token",
				value : header_xcsrf_token
				
			});
			
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			MessageToast.show("Event change triggered");*/

		},
 
		onFileDeleted : function(oEvent) {
			MessageToast.show("Event fileDeleted triggered");
		},
 
		onFilenameLengthExceed : function(oEvent) {
			MessageToast.show("Event filenameLengthExceed triggered");
		},
 
		onFileSizeExceed : function(oEvent) {
			MessageToast.show("Event fileSizeExceed triggered");
		},
 
		onTypeMissmatch : function(oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},
 
		onStartUpload : function(oEvent) {
			var oUploadCollection = this.getView().byId("UploadCollection");
		/*	var oTextArea = this.getView().byId("TextArea");*/
			var cFiles = oUploadCollection.getItems().length;
			var uploadInfo = "";
			// The call
			
			oUploadCollection.upload();
 
			uploadInfo = cFiles + " file(s)";
/*			if (oTextArea.getValue().length === 0) {
				uploadInfo = uploadInfo + " without notes";
			} else {
				uploadInfo = uploadInfo + " with notes";
			}*/
 
			MessageToast.show("Method Upload is called (" + uploadInfo + ")");
			sap.m.MessageBox.information("Uploaded " + uploadInfo);
		/*	oTextArea.setValue("");*/
		},
 
		onBeforeUploadStarts : function(oEvent) {
			// Header Slug
			
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name : "slug",
				value : oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
			
			var oCustomerHeaderSlug1 = new sap.m.UploadCollectionParameter({
				name : "X-Requested-With",
				value : "XMLHttpRequest"
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug1);
			
			var oCustomerHeaderSlug2 = new sap.m.UploadCollectionParameter({
				name : "Authorization",
				value : "UNISYS01:UNISYS01"
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug2);

			var oCustomerHeaderSlug3 = new sap.m.UploadCollectionParameter({
				name : "Content-Type",
				value : "application/json"
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug3);

			var oCustomerHeaderSlug4 = new sap.m.UploadCollectionParameter({
				name : "x-csrf-token",
				value : header_xcsrf_token
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug4);

			setTimeout(function() {
				MessageToast.show("Event beforeUploadStarts triggered");
			}, 4000);
		},
 
		onUploadComplete : function(oEvent) {

			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			setTimeout(function() {
				var oUploadCollection = this.getView().byId("UploadCollection");
 
				for (var i = 0; i < oUploadCollection.getItems().length; i++) {
					if (oUploadCollection.getItems()[i].getFileName() === sUploadedFileName) {
						oUploadCollection.removeItem(oUploadCollection.getItems()[i]);
						break;
					}
				}
				// delay the success message in order to see other messages before
				MessageToast.show("Event uploadComplete triggered");
			}.bind(this), 8000);
		},
 
 
		onSelectChange : function(oEvent) {
			var oUploadCollection = this.getView().byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		}
	});
});