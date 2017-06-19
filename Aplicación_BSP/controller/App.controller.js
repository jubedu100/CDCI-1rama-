sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "ZPPM_APP_VOD10/controller/BaseController"
], function (Controller, MessageToast, BaseController) {
  "use strict";

  return Controller.extend("ZPPM_APP_VOD10.controller.App", {

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    onInit: function () {
      BaseController.go_page_app = this.getView().byId("PageApp");
    },

    onBeforeRendering: function(oEvent) {

      this._SetSizeLimitOModels(oEvent, 10000, 10000, 10000);
    },

    onAfterRendering: function(oEvent) {

    },

    onExit: function(oEvent) {

    },

    /* =========================================================== */
    /* Events                                                      */
    /* =========================================================== */

    /* =========================================================== */
    /* Begin: internal methods                                     */
    /* =========================================================== */

    _SetSizeLimitOModels: function(oEvent, ofertaNum, lintbjNum, projectNum) {

      var lo_OfertaOD = oEvent.oSource.oPropagatedProperties.oModels.OfertaOD;
      var lo_LinTbjOD = oEvent.oSource.oPropagatedProperties.oModels.LinTbjOD;
      var lo_ProjectOD = oEvent.oSource.oPropagatedProperties.oModels.ProjectOD;
      lo_OfertaOD.setSizeLimit(ofertaNum);
      lo_LinTbjOD.setSizeLimit(lintbjNum);
      lo_ProjectOD.setSizeLimit(projectNum);
    }
  });

});