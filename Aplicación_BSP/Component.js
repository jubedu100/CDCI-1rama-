sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device"
], function(UIComponent, Device) {
  "use strict";

  return UIComponent.extend("ZPPM_APP_VOD10.Component", {

    metadata: {
      manifest: "json"
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {

      //
      //var manifest_config = this.getManifestEntry("/sap.ui5/config");
      //var manifest_config = this.getMetadata().getManifest();
      //var aux = manifest_config["sap.app"];
      //manifest_config["sap.app"].dataSources.MainServiceRemote.uri = "pasa";
      //this.oModels.OfertaOD.oMetadata.sUrl = "uip";
      //this.oModels.OfertaOD.oServiceData.oMetadata.sUrl = "uip";
      //var oManifestUi5 = this.getMetadata().getManifestEntry("sap.app");
      //oManifestUi5.models[""].settings.serviceUrlParams["sap-client"] =

      //var oObj = new sap.ui.model.Model();
      //this.setModel(oObj, "OfertaOD");
      //var oModlOfr = new sap.ui.model.Binding(oObj);
      //this.setModel(oModlOfr, "OfertaOD");
      //var odatametadata = new sap.ui.model.odata.ODataMetadata(lv_service);
      //this.setModel(odatametadata, "OfertaODDD");
      //var vvb = new sap.ui.model.odata.ODataModel(lv_service);
      //var vvv = new sap.ui.model.odata.ODataListBinding(vvb);
      //this.setModel(vvb, "OfertaODDDD");

      // Construimos el servicio:
      // Hay que leer la URL hasta la tercera '/' para concatenarla con el servicio

      //var offset = 33;
      var lv_url = window.location.href;

      var offset = lv_url.indexOf("/");
      offset = offset + 1;
      offset = lv_url.indexOf("/", offset);
      offset = offset + 1;
      offset = lv_url.indexOf("/", offset);

      var lv_root_service = lv_url.substr(0, offset);
      var service = "/sap/opu/odata/SAP/ZPPM_PANEL_V01_SRV/";
      var lv_service = lv_root_service.concat(service);

      // Hacemos set del modelo de ofertas:
      //this.oModels.OfertaOD.oMetadata.sUrl = lv_service;
      //this.oModels.OfertaOD.oServiceData.oMetadata.sUrl = lv_service;
      //this.oModels.OfertaOD.sServiceUrl = lv_service;
      var oModelOfertaOD = new sap.ui.model.odata.ODataModel (lv_service);
      this.setModel(oModelOfertaOD, "OfertaOD");

      //this.oModels.LinTbjOD.oMetadata.sUrl = lv_service;
      //this.oModels.LinTbjOD.oServiceData.oMetadata.sUrl = lv_service;
      //this.oModels.LinTbjOD.sServiceUrl = lv_service;
      var oModelLinTbjOD = new sap.ui.model.odata.ODataModel (lv_service);
      this.setModel(oModelLinTbjOD, "LinTbjOD");

      //this.oModels.ProjectOD.oMetadata.sUrl = lv_service;
      //this.oModels.ProjectOD.oServiceData.oMetadata.sUrl = lv_service;
      //this.oModels.ProjectOD.sServiceUrl = lv_service;
      var oModelProjectOD = new sap.ui.model.odata.ODataModel (lv_service);
      this.setModel(oModelProjectOD, "ProjectOD");

      /////////

      // call the base component's init function and create the App view
      UIComponent.prototype.init.apply(this, arguments);

      // create the views based on the url/hash
      this.getRouter().initialize();
    },

    /**
     * The component is destroyed by UI5 automatically.
     * In this method, the ListSelector and ErrorHandler are destroyed.
     * @public
     * @override
     */
    destroy: function() {
      UIComponent.prototype.destroy.apply(this, arguments);
    },

    /**
     * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
     * design mode class should be set, which influences the size appearance of some controls.
     * @public
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
     */
    getContentDensityClass: function() {
      if (this._sContentDensityClass === undefined) {
        // check whether FLP has already set the content density class; do nothing in this case
        if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
          this._sContentDensityClass = "";
        } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
          this._sContentDensityClass = "sapUiSizeCompact";
        } else {
          // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
          this._sContentDensityClass = "sapUiSizeCozy";
        }
      }
      return this._sContentDensityClass;
    }
  });
});