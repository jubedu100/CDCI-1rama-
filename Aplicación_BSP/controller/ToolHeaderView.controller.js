sap.ui.define([
  'jquery.sap.global',
  'ZPPM_APP_VOD10/controller/BaseController',
  'ZPPM_APP_VOD10/assets/js/Constants',
  'sap/m/Popover',
  'sap/m/Button',
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
], function(jQuery, BaseController, Constants, Popover, Button, Filter, FilterOperator) {
  "use strict";

  var Controller = BaseController.extend("ZPPM_APP_VOD10.controller.ToolHeaderView", {

    /***********************************************************/
    /*                                                         */
    /***********************************************************/
    onInit: function() {

      var router = this.getRouter();

      router.attachRouteMatched(this.handleRouteMatched, this);
    },

    /**
     * Evento disparado tras pintar el fragmento de ofertas de la pantalla de
     * inicio.
     *
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    onBeforeRendering: function() {

    },

    /**
     * Evento disparado tras pintar el fragmento de ofertas de la pantalla de
     * inicio.
     *
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    onAfterRendering: function(oEvent) {

      // Guardamos de forma global la referencia de pantalla del toolbar offert:
      var lo_numOfferts = this.getView().byId("offertHeader");
      BaseController.go_numOfferts = lo_numOfferts;

      // Guardamos de forma global la referencia de pantalla del toolbar proj:
      var lo_numProj = this.getView().byId("proyHeader");
      BaseController.go_numProjects = lo_numProj;

      // Guardamos de forma global la referencia de pantalla del toolbar:
      var lo_iconTabBar = this.getView().byId("idIconTabBarFiori2");
      BaseController.go_iconTabBar = lo_iconTabBar;

    },

    handleUserNamePress: function(event) {
      var popover = new Popover({
        showHeader: false,
        placement: sap.m.PlacementType.Bottom,
        content: [
          new Button({
            text: 'Feedback',
            type: sap.m.ButtonType.Transparent
          }),
          new Button({
            text: 'Help',
            type: sap.m.ButtonType.Transparent
          }),
          new Button({
            text: 'Logout',
            type: sap.m.ButtonType.Transparent
          })
        ]
      }).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

      popover.openBy(event.getSource());
    },

    onBtn: function(oEvent) {

      var oTab = this.byId("idIconTabBarFiori2");
      var lo_offertHeader = this.byId("offertHeader");
      var lo_proyHeader = this.byId("proyHeader");
      var lo_inicioHeader = this.byId("inicioHeader");

      var lo_selected = oTab.mAggregations._header.oSelectedItem;

      oTab.mAggregations._header.oSelectedItem = lo_proyHeader;
      oTab.mAggregations._header.mProperties.selectedKey = "BTNMenuProjects";

    },

    onLimpiaOfertas: function() {

      BaseController.go_offertDetail_Descp.setVisible(false);
      BaseController.go_offertDetail_RespNA.setVisible(false);
      BaseController.go_offertDetail_Ceco.setVisible(false);
      BaseController.go_offertDetail_Est.setVisible(false);
      BaseController.go_offertDetail_Fecha.setVisible(false);
      BaseController.go_offertDetail_Horas.setVisible(false);
      BaseController.go_offertDetail_Presup.setVisible(false);
      BaseController.go_offertDetail_pte_cliente.setVisible(false);
      BaseController.go_offertDetail_exteranl_id.setVisible(false);
      BaseController.go_offertDetail_Cal.setVisible(false);
      BaseController.go_offertDetail_Relj.setVisible(false);
      BaseController.go_offertDetail_Bille.setVisible(false);
      BaseController.go_offertDetail_Btn.setVisible(false);
      BaseController.go_offertDetail_Semf.setVisible(false);

      this.onFilterLTs(BaseController.go_ofer_LTS);
    },

    onLimpiaProyectos: function() {

      BaseController.go_projDetail_Descp.setVisible(false);
      BaseController.go_projDetail_RespNA.setVisible(false);
      BaseController.go_projDetail_Fecha.setVisible(false);
      BaseController.go_projDetail_Est_lbl.setVisible(false);
      BaseController.go_projDetail_Est.setVisible(false);
      BaseController.go_projDetail_Fecha_icon.setVisible(false);
      BaseController.go_projDetail_Fecha_gavan.setVisible(false);
      BaseController.go_projDetail_Btn.setVisible(false);
      BaseController.go_projDetail_Est_horas.setVisible(false);
      BaseController.go_projDetail_Est_distrib1.setVisible(false);
      BaseController.go_projDetail_Est_distrib2.setVisible(false);
      BaseController.go_projDetail_Est_horas_lbl.setVisible(false);
      BaseController.go_projDetail_Est_distrib1_lbl.setVisible(false);
      BaseController.go_projDetail_Est_distrib2_lbl.setVisible(false);
      BaseController.go_projDetail_Est_distrib_lbl.setVisible(false);
      BaseController.go_projDetail_Est_etc_guion.setVisible(false);
      BaseController.go_projDetail_Est_fecha_etc.setVisible(false);
      BaseController.go_projDetail_externalid.setVisible(false);

      this.onFilterLTs(BaseController.go_proj_LTS);
    },

    onFilterLTs: function(oList) {

      // Este metodo se puede usar tanto para limpiar proyectos como ofertas.

      // build filter array
      var aFilter = [];
      var aFilterEmpty = [];
      var sQuery = "00000000000000000000000000000000";
      if (sQuery) {
        aFilter.push(new Filter("ProjGuid", FilterOperator.EQ, sQuery));
      }
      // filter binding:
      var oBinding = oList.getBinding("items");

      // Necesitamos eliminar el filtro/s previo/s:
      oBinding.aFilters = [];
      oBinding.filter(aFilter);
    },

    onDesactivarMisLTsBTN_ofer: function(oList) {

      if (BaseController.go_scroll_ofer === undefined) {
      } else {

        BaseController.go_filter_ofer.setVisible(true);
        BaseController.go_scroll_ofer.setVisible(true);
        BaseController.go_ofertasGnrlContainer.removeStyleClass("zppm_filter_ofer_misLTs");
        BaseController.go_scroll_ofer.removeSelections();


        BaseController.go_misLTs_button_ofer.removeStyleClass("zppm_MisLTsBTN_Marcado");
        BaseController.gv_misLTs_pushed_ofer = false;
      };
    },

    onDesactivarMisLTsBTN_proj: function(oList) {

      if (BaseController.go_filter_proj === undefined) {
      } else {

        BaseController.go_filter_proj.setVisible(true);
        BaseController.go_scroll_proj.setVisible(true);
        BaseController.go_proyectosGnrlContainer.removeStyleClass("zppm_filter_proj_misLTs");
        BaseController.go_filter_proj.removeSelections();

        BaseController.go_misLTs_button_proj.removeStyleClass("zppm_MisLTsBTN_Marcado");
        BaseController.gv_misLTs_pushed_proj = false;
      };
    },

    handleIconTabBarSelect: function(oEvent) {

      var sKey = oEvent.getParameter("key");
      var lo_iconTabBar = this.getView().byId("idIconTabBarFiori2");

      BaseController.go_page_app.scrollTo(0,0);

      switch (sKey) {

        case "BTNMenuInicio": // El usuario quiere ir al inicio:

          // Desactivamos el botón:
          this.onDesactivarMisLTsBTN_ofer(oEvent);
          this.onDesactivarMisLTsBTN_proj(oEvent);

          // Actualizamos el tab bar:
          if (BaseController.go_active_screen === "BTNMenuInicio") {
            lo_iconTabBar.setSelectedKey("BTNMenuProjects");
            lo_iconTabBar.setSelectedKey("BTNMenuInicio");
          };
          BaseController.go_active_screen = "BTNMenuInicio";

          // Si volvemos a inicio, limpiamos:
          if (BaseController.gv_vista_cargada_ofer === true) {
            this.onLimpiaOfertas();
          }
          if (BaseController.gv_vista_cargada_proj === true) {
            this.onLimpiaProyectos();
          }


          if (BaseController.go_Offert_list === undefined) {

          } else {
            BaseController.go_Offert_list.removeSelections(true);
          }
          if (BaseController.go_Proyect_list === undefined) {

          } else {
            BaseController.go_Proyect_list.removeSelections(true);
          }

          this.navTo(Constants.ROUTING_PATTERN["HOME"], false);
          break;

        case "BTNMenuOferts": // El usuario quiere ir a las ofertas:


          // Desactivamos el botón:
          this.onDesactivarMisLTsBTN_proj(oEvent);

          // Actualizamos el tab bar:
          if (BaseController.go_active_screen === "BTNMenuOferts") {
            lo_iconTabBar.setSelectedKey("BTNMenuProjects");
            lo_iconTabBar.setSelectedKey("BTNMenuOferts");
          };

          BaseController.go_active_screen = "BTNMenuOferts";

          // Si vamos a las ofertas, limpiamos proyectos:
          if (BaseController.gv_vista_cargada_proj === true) {
            this.onLimpiaProyectos();
          }

          if (BaseController.go_Proyect_list === undefined) {

          } else {
            BaseController.go_Proyect_list.removeSelections(true);
          }
          if (BaseController.go_Offert_Inicio_list === undefined) {

          } else {
            BaseController.go_Offert_Inicio_list.removeSelections(true);
          }
          if (BaseController.go_Proyect_Inicio_list === undefined) {

          } else {
            BaseController.go_Proyect_Inicio_list.removeSelections(true);
          }

          this.navTo(Constants.ROUTING_PATTERN["OFERTAS"], false);
          break;

        case "BTNMenuProjects": // El usuario quiere ir a los proyectos:

          // Desactivamos el botón:
          this.onDesactivarMisLTsBTN_ofer(oEvent);

          // Actualizamos el tab bar:
          if (BaseController.go_active_screen === "BTNMenuProjects") {
            lo_iconTabBar.setSelectedKey("BTNMenuOferts");
            lo_iconTabBar.setSelectedKey("BTNMenuProjects");
          };
          BaseController.go_active_screen = "BTNMenuProjects";

          // Si vamos a los proyectos, limpiamos ofertas:
          if (BaseController.gv_vista_cargada_ofer === true) {
            this.onLimpiaOfertas();
          }

          if (BaseController.go_Offert_list === undefined) {

          } else {
            BaseController.go_Offert_list.removeSelections(true);
          }
          if (BaseController.go_Offert_Inicio_list === undefined) {

          } else {
            BaseController.go_Offert_Inicio_list.removeSelections(true);
          }
          if (BaseController.go_Proyect_Inicio_list === undefined) {

          } else {
            BaseController.go_Proyect_Inicio_list.removeSelections(true);
          }
          this.navTo(Constants.ROUTING_PATTERN["PROYECTOS"], false);
          break;

      }

    }

  });

  return Controller;

});