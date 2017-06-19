sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], function(Controller, History) {
  "use strict";

  var go_numOfferts;
  var go_numProjects;
  var go_iconTabBar;
  var go_Offert_list;
  var go_Proyect_list;
  var go_Offert_Inicio_list;
  var go_Proyect_Inicio_list;
  var go_active_screen = "";
  var go_page_app;

  /* Elementos de la cabecera */

  /*  Elementos de la pantalla de ofertas  */
  var gv_vista_cargada_ofer = false;
  var go_offertDetail_Descp;
  var go_offertDetail_RespNA;
  var go_offertDetail_Ceco;
  var go_offertDetail_Est;
  var go_offertDetail_Fecha;
  var go_offertDetail_Horas;
  var go_offertDetail_Presup;
  var go_offertDetail_pte_cliente;
  var go_offertDetail_exteranl_id;
  var go_offertDetail_Cal;
  var go_offertDetail_Relj;
  var go_offertDetail_Bille;
  var go_offertDetail_Btn;
  var go_offertDetail_Semf;
  var go_offert_Page;

  /* Elementos de la pantalla de proyectos */
  var gv_vista_cargada_proj = false;
  var go_projDetail_Descp;
  var go_projDetail_RespNA;
  var go_projDetail_RespID;
  var go_projDetail_Fecha;
  var go_projDetail_Est_lbl;
  var go_projDetail_Est;
  var go_projDetail_Fecha_icon;
  var go_projDetail_Fecha_gavan;
  var go_projDetail_Btn;
  var go_projDetail_Est_horas;
  var go_projDetail_Est_distrib1;
  var go_projDetail_Est_distrib2;
  var go_projDetail_Est_horas_lbl;
  var go_projDetail_Est_distrib1_lbl;
  var go_projDetail_Est_distrib2_lbl;
  var go_projDetail_Est_distrib_lbl;
  var go_projDetail_Est_etc_guion;
  var go_projDetail_Est_fecha_etc;
  var go_projDetail_externalid;

  /**/

  var go_scroll_proj;
  var go_filter_proj;
  var go_proyectosGnrlContainer;
  var go_misLTs_button_ofer;
  var go_misLTs_button_proj;
  var gv_misLTs_pushed_ofer  = false;
  var go_ofer_LTS;
  var gv_misLTs_pushed_proj  = false;
  var go_proj_LTS;
  var go_misLTs_button_ofer;
  var go_misLTs_button_proj;


  var BaseController = Controller.extend("ZPPM_APP_VOD10.controller.BaseController", {});

  /**
   * Convenience method for accessing the router.
   * @public
   * @returns {sap.ui.core.routing.Router} the router for this component
   */
  BaseController.prototype.getRouter = function() {
    return sap.ui.core.UIComponent.getRouterFor(this);
  };

  /**
   * Navigation to target route
   * @public
   * @param {string} sChannelId bus channel, {string} sEventId bus event, {object} oData bus data
   * @returns
   */
  BaseController.prototype.navTo = function(sName, bReplace) {

    var oRouter = this.getRouter();

    if(oRouter){
      oRouter.navTo(sName, bReplace);
    }

    go_active_screen = sName;

  };

  /**
   * Navigation to target route
   * @public
   * @param {string} sChannelId bus channel, {string} sEventId bus event, {object} oData bus data
   * @returns
   */
  BaseController.prototype.handleRouteMatched = function(oEvent) {

    var lv_selected_key = BaseController.go_iconTabBar.getSelectedKey();
    //var lo_history = History.getPreviousHash();
    var lv_target = oEvent.getParameter("name");

    switch(lv_target) {
    case "home":

        if (lv_selected_key != "BTNMenuInicio") {
          BaseController.go_iconTabBar.setSelectedKey("BTNMenuInicio");
        };

        break;
    case "ofertas":

        if (lv_selected_key != "BTNMenuOferts") {
          BaseController.go_iconTabBar.setSelectedKey("BTNMenuOferts");
        };
        break;
    case "proyectos":

        if (lv_selected_key != "BTNMenuProjects") {
          BaseController.go_iconTabBar.setSelectedKey("BTNMenuProjects");
        };

        break;
    default:
        break;
    };

  };

  return BaseController;

});