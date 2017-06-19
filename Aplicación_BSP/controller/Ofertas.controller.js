sap.ui.define([
  "jquery.sap.global",
  "ZPPM_APP_VOD10/controller/BaseController",
  "ZPPM_APP_VOD10/assets/js/Constants",
  "sap/m/Popover",
  "sap/m/Button",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/IconTabFilter",
  "sap/m/ScrollContainer",
  "sap/ui/core/Control"

], function(jQuery, BaseController, Constants, Popover, Button, Filter, FilterOperator, IconTabFilter ) {
  "use strict";

  var gv_offerts_first_time = false;
  var gv_filtro_anterior = '';
  var gv_filtros_loaded = false;
  var gv_scroll_func_attach = false;

  return BaseController.extend("ZPPM_APP_VOD10.controller.Ofertas", {

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

   onInit: function() {

      // Actualizamos la vista:
      if (BaseController.go_active_screen === undefined) {
        BaseController.go_active_screen = "BTNMenuOferts";
      };

      if (BaseController.gv_misLTs_pushed_ofer === undefined) {
        BaseController.gv_misLTs_pushed_ofer = false;
      };



      this.getRouter().getRoute(Constants.ROUTING_PATTERN["OFERTAS"]).attachPatternMatched(this.onTravelToOfferts, this);

    },

    onBeforeRendering: function(oEvent) {

      // Antes de pintar, aumentamos el limite de entradas de los modelos:
      //this._ChangeLimitSizes();


      //var lo_offertOD = oEvent.oSource.oPropagatedProperties.oModels.OfertaOD;
      //lo_offertOD.setSizeLimit(8);

      this._OcultarOffertInfo();

      // Quitamos la seleccion por defecto que aplica el filtro:
    },

    onAfterRendering: function(oEvent) {

      // Iniciamos las propiedades de la tabla de ofertas:
      //this.onInitTableProperties();

      // Guardamos la referencia global a la lista de ofertas:
      BaseController.go_Offert_list = this.getView().byId("offertFilter");

      // Asignamos en el toolheader la selección de esta vista:
      //Comentado XIS17347
      //BaseController.go_iconTabBar.setSelectedKey("BTNMenuOferts");

      // Asignamos las referencias a los elementos del detalle de ofertas:
      BaseController.go_offertDetail_Descp       = this.getView().byId("offertDetail_Descp");
      BaseController.go_offertDetail_RespNA      = this.getView().byId("offertDetail_RespNA");
      BaseController.go_offertDetail_Ceco        = this.getView().byId("offertDetail_RespID");
      BaseController.go_offertDetail_Est         = this.getView().byId("offertDetail_Est");
      BaseController.go_offertDetail_Fecha       = this.getView().byId("offertDetail_Fecha");
      BaseController.go_offertDetail_Horas       = this.getView().byId("offertDetail_Horas");
      BaseController.go_offertDetail_Presup      = this.getView().byId("offertDetail_Presup");
      BaseController.go_offertDetail_pte_cliente = this.getView().byId("offertDetail_pte_cliente");
      BaseController.go_offertDetail_exteranl_id = this.getView().byId("offertDetail_exteranl_id");
      BaseController.go_offertDetail_Cal         = this.getView().byId("offertDetail_Cal");
      BaseController.go_offertDetail_Relj        = this.getView().byId("offertDetail_Relj");
      BaseController.go_offertDetail_Bille       = this.getView().byId("offertDetail_Bille");
      BaseController.go_offertDetail_Btn         = this.getView().byId("offertDetail_Btn");
      BaseController.go_offertDetail_Semf        = this.getView().byId("offertDetail_Semf");

      // Asiganmos la referencia de la tabla de LTs:
      BaseController.go_ofer_LTS = this.getView().byId("idLinTbjTable");

      // Asignamos la referencia al botón de mis líneas de trabajo:
      BaseController.go_misLTs_button_ofer = this.getView().byId("btn_LTs");

      // Actualizamos las referencias de contenedores:
      BaseController.go_filter_ofer          = this.getView().byId("offertFilterScroll");
      BaseController.go_scroll_ofer          = this.getView().byId("offertFilter");
      BaseController.go_ofertasGnrlContainer = this.getView().byId("ofertasGnrlContainer");

    },

    onExit: function(oEvent) {

    },

    /* =========================================================== */
    /* Events                                                      */
    /* =========================================================== */

    onInitTableProperties: function(oEvent) {

      var lo_OffersList = this.getView().byId("offertFilter");
      var lv_selectionMode     = "Single";
      lo_OffersList.setSelectionMode(lv_selectionMode);
      var lv_selectionBehavior = "RowOnly";
      lo_OffersList.setSelectionBehavior(lv_selectionBehavior);
      var lv_navigation_mode   = "Scrollbar";
      lo_OffersList.setNavigationMode(lv_navigation_mode);
      var lv_visibleRowCount   = "Auto";
      lo_OffersList.setVisibleRowCount(lv_visibleRowCount);
      var oBinding = lo_OffersList.getBinding("rows");

      var oThis = this;

      oBinding.attachDataReceived(function(oEvent){
        oThis._getModelOffert(oEvent);
        BaseController.gv_vista_cargada_ofer = true;
        oThis._PintarEstilosRowOfertasTable(oEvent);
      });

      //oBinding.attachAggregatedDataStateChange(function(oEvent){
      //oBinding.attachDataRequested(function(oEvent){
      //oBinding.attachDataReceived(function(oEvent){

      //oBinding.attachDataStateChange(function(oEvent){

      //$( document ).ready(function(oEvent) {
      //  var i = 0;
      //});

    },

    onTravelToOfferts: function(oEvent) {

      // Comprobamos si se ha lanzado una navegacion desde inicio:
      if (BaseController.gv_vista_cargada_ofer === true) {
        this._getModelOffert(oEvent);
      };

        BaseController.go_active_screen = "BTNMenuOferts";

    },

    onSelectionChange: function(oEvent) {

      // Marcamos que ya no es first time:
      gv_offerts_first_time = true;

      // Comprobamos que linea ha seleccionado:
      var oItem = oEvent.getParameter("listItem");
      var lv_param = oItem.oBindingContexts.OfertaOD.sPath.substr(1).replace(/\//, ".");
      var lv_sel_item_guid = lv_param.substr(20, 32);
      var lv_sel_proj_guid = lv_param.substr(68, 32);

      // Contamos que elemento es dentro de nuestra tabla:
      var lo_OferList = this.getView().byId("offertFilterScroll");
      var lv_element_index = 0;
      var lv_counter = 0;
      var lv_founded = false;
      var lt_Ofer_oData = oItem.oBindingContexts.OfertaOD.oModel.oData;
      for (var lv_index in lt_Ofer_oData) {

        var lv_string_i = lv_index.substr(20, 32);
        var lv_string_j = lv_index.substr(68, 32);
        if (lv_string_i === lv_sel_item_guid && lv_string_j === lv_sel_proj_guid) {
          lv_element_index = lv_counter;
          lv_founded = true;
        };
        lv_counter = lv_counter + 1;
      };


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
      var sServiceUrl = lv_root_service.concat(service);

      var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);

      // Guardamos variables para que queden en la pila y pueda acceder el metodo read:
      var oView = this.getView();
      var oThis = this;

      // Construimos la query de la oferta seleccionada:
      var lv_offert_selected = lv_param.substr(9);
      var oQuery = "/OfertaSet" + lv_offert_selected;

      // Le quitamos el marcado al boton de mis LTs por si esta en rojo
      this._QuitarEstiloBtnMisLTs();

      // Seleccionamos la línea en la lista y le ponemos focus para que se posiciona
      var lo_list = this.getView().byId("offertFilter");
      var lt_elem = lo_list.getItems();

      lo_list.setSelectedItem(lt_elem[lv_element_index]);
      lt_elem[lv_element_index].focus();

      // Leemos la informacion del servicio:
      oModel.read(oQuery, null, null, true, function(oData, repsonse) {

        // Mostramos elementos del detalle de la oferta:
        oThis._MostrarOffertInfo();

        // Sacamos los elementos necesarios de la vista:
        var lo_offertDetail_Descp = oView.byId("offertDetail_Descp");
        var lo_offertDetail_RespNA = oView.byId("offertDetail_RespNA");
        var lo_offertDetail_Ceco = oView.byId("offertDetail_RespID");
        var lo_offertDetail_Est = oView.byId("offertDetail_Est");
        var lo_offertDetail_Fecha = oView.byId("offertDetail_Fecha");
        var lo_offertDetail_Horas = oView.byId("offertDetail_Horas");
        var lo_offertDetail_Presup = oView.byId("offertDetail_Presup");
        var lo_offertDetail_pte_cliente = oView.byId("offertDetail_pte_cliente");
        var lo_offertDetail_exteranl_id = oView.byId("offertDetail_exteranl_id");



        // Asignamos los valores obtenidos mediante el servicio:
        lo_offertDetail_Descp.setText(oData.Descrp);
        lo_offertDetail_RespNA.setText(oData.Responsable);
        lo_offertDetail_Ceco.setText(oData.Ceco);
        lo_offertDetail_Est.setText(oData.Estado);
        lo_offertDetail_Fecha.setText(oData.Fecha);
        lo_offertDetail_Horas.setText(oData.Horas);
        lo_offertDetail_Presup.setText(oData.Presupuesto);
        lo_offertDetail_pte_cliente.setText(oData.CodPetCliente);
        lo_offertDetail_exteranl_id.setText(oData.Externalid);

        // Pintamos los semaforos de los estados del detalle:
        oThis._PintarEstilosDetalleOferta(oEvent);

        // Pintamos los textos de los estados de las lineas de trabajo:
        //oThis._PintarEstilosLinTrbj(oEvent);

        // Filtramos las LTs de la oferta seleccionada:
        oThis.onFilterLTs(oData.ProjGuid, oData.ItemGuid, false);

        // Asignamos las URLs del proyecto:
        oThis.onSetUrls(oEvent, oData.Url1, oData.Url2, oData.Url3, oData.Url4, oData.Url5);



      lo_list.setSelectedItem(lt_elem[lv_element_index]);
      lt_elem[lv_element_index].focus();

      });

    },

    onUpdateFinishedOfferts: function(oEvent) {

      this._getModelOffert(oEvent);

      BaseController.gv_vista_cargada_ofer = true;

      this._PintarEstilosRowOfertas(oEvent);

      // Construimos el filtro de proyectos:
      //this._buildFilterOfer(oEvent);

   },

    onSetUrls: function(oEvent, url1, url2, url3, url4, url5) {

      // Buscamos el modelo:
      var lo_modeloSel = sap.ui.getCore().getModel("modelOffertSelected");

      // Creamos el modelo una unica vez:
      if (lo_modeloSel === undefined) {

        // Creamos el modelo:
        lo_modeloSel = this._createOffertDtlViewModel();

        // Realizamos un set del modelo:
        sap.ui.getCore().setModel(lo_modeloSel, "modelOffertSelected");
      };

      // Asignamos las propiedades al modelo:
      lo_modeloSel.setProperty("/URL1", url1);
      lo_modeloSel.setProperty("/URL2", url2);
      lo_modeloSel.setProperty("/URL3", url3);
      lo_modeloSel.setProperty("/URL4", url4);
      lo_modeloSel.setProperty("/URL5", url5);
    },

    handleOffertsFilter: function(oEvent) {

      var sKey = oEvent.getParameter("key");

      // Filtramos las ofertas o quitamos el filtro:
      if (gv_filtro_anterior === sKey) {
          this.onFilterOfferts(sKey, true);
          gv_filtro_anterior = '';
      }else {
          this.onFilterOfferts(sKey, false);
          gv_filtro_anterior = sKey;
      };

    },

    handleMessagePopoverOffertInfo: function(oEvent) {

      // Cogemos el boton:
      var oButton = oEvent.getSource();

      // create menu only once
      // if (!this._menu) {
      this._menu = sap.ui.xmlfragment(
        "ZPPM_APP_VOD10/view/menuBtnOffert",
        this
      );
      this.getView().addDependent(this._menu);
      // }

      var eDock = sap.ui.core.Popup.Dock;
      this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
    },

    handleMessagePopoverOffertLT: function(oEvent) {

      // Cogemos el boton:
      var oButton = oEvent.getSource();

      // create menu only once
      // if (!this._menu) {
      this._menu = sap.ui.xmlfragment(
        "ZPPM_APP_VOD10/view/menuBtnOffertLT",
        this
      );
      this.getView().addDependent(this._menu);
      // }

      // Abrimos el menu del boton:
      var eDock = sap.ui.core.Popup.Dock;
      this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);

      // Sacamos la LT que ha seleccionado:
      // Sacamos la LT que ha seleccionado:
      var lv_LT_item_guid = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbjOD.sPath.substr(21, 32);
      var lv_LT_id_ld = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbjOD.sPath.substr(70, 3);
      var lv_LT_id_lt = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbjOD.sPath.substr(89, 3);
      //var lv_LT_selected = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbj.sPath.substr(9);
      //var lv_LT_sel_info = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbj.oModel.oData.linTbjs[lv_LT_selected];

      // Sacamos la lista de ofertas:
      var lo_LTsList = this.getView().byId("idLinTbjTable");

      // Construimos lo necesario para recorrer y encontrar el indice:
      var lv_counter = 0;
      var lv_position = 0;
      var lt_items = lo_LTsList.oPropagatedProperties.oModels.LinTbjOD.oData;

      // Buscamos el modelo:
      var lo_modeloSelLT = sap.ui.getCore().getModel("modelOffertLTselected");

      // Creamos el modelo una unica vez:
      if (!lo_modeloSelLT) {
        var lo_offertLTselModel = this._createOffertViewModelLT();
        sap.ui.getCore().setModel(lo_offertLTselModel, "modelOffertLTselected");
        lo_modeloSelLT = lo_offertLTselModel;
      }

      // Buscamos el indice seleccionado:
      for (var index in lt_items) {
          if (lt_items.hasOwnProperty(index)) {

            // Parseamos el elemento del buclle:
            var ls_row = index.replace(/\//, ".");
            var lv_index_item_Guid = ls_row.substr(20, 32);;
            var lv_index_ld_id     = ls_row.substr(69, 3);
            var lv_index_lt_id     = ls_row.substr(88, 3);

            // Comparamos el pGuid:
            if (lv_index_item_Guid === lv_LT_item_guid && lv_index_ld_id === lv_LT_id_ld && lv_index_lt_id === lv_LT_id_lt) {
              lv_position = lv_counter;

              var ls_fields = lt_items[Object.keys(lt_items)[lv_position]];

              // Grabamos las propiedades de la LT del boton seleccionado:
              lo_modeloSelLT.setProperty("/PROJ_GUID", ls_fields.ProjGuid);
              lo_modeloSelLT.setProperty("/ID_RESPONSABLE", ls_fields.IdResponsable);
              lo_modeloSelLT.setProperty("/ID_LIN_TRABAJO", ls_fields.IdLinTrabajo);
              lo_modeloSelLT.setProperty("/EXTERNALID_PROJ", ls_fields.EXTERNALID_PROJ);
              lo_modeloSelLT.setProperty("/URL1", ls_fields.Url1);
              lo_modeloSelLT.setProperty("/URL2", ls_fields.Url2);
              lo_modeloSelLT.setProperty("/URL3", ls_fields.Url3);
              lo_modeloSelLT.setProperty("/URL4", ls_fields.Url4);
              lo_modeloSelLT.setProperty("/URL5", ls_fields.Url5);
            }

            // Aumentamos el contador:
            lv_counter++;
          }
      }

    },

    handleMenuItemPressLT: function(oEvent) {

      // Buscamos el modelo:
      var lo_modeloSelLT = sap.ui.getCore().getModel("modelOffertLTselected");

      // Creamos el modelo una unica vez:
      if (!lo_modeloSelLT) {
        // No existe el modelo: ERROR
      } else {

        // Sacamos las propiedades de la LT del boton seleccionado:
        var lv_PROJ_GUID = lo_modeloSelLT.getProperty("/PROJ_GUID");
        var lv_ID_RESPONSABLE = lo_modeloSelLT.getProperty("/ID_RESPONSABLE");
        var lv_ID_LIN_TRABAJO = lo_modeloSelLT.getProperty("/ID_LIN_TRABAJO");
        var lv_url1 = lo_modeloSelLT.getProperty("/URL1");
        var lv_url2 = lo_modeloSelLT.getProperty("/URL2");
        var lv_url3 = lo_modeloSelLT.getProperty("/URL3");
        var lv_url4 = lo_modeloSelLT.getProperty("/URL4");
        var lv_url5 = lo_modeloSelLT.getProperty("/URL5");

        // Necesitamos saber la accion realizada por el usuario:
        var lo_param = oEvent.getParameters();
        var lv_accion = lo_param.item.mProperties.text;

        //window.location = lv_url1;
        var win;

        // Segun el tipo de accion realizamos diferentes acciones:
        // (Usar el texto puede provocar que si esta en otro idioma, no funcione)
        switch (lv_accion) {
          case "Líneas de distribución":
            win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to Distribution Lines":
            win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Documentos":
            win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to Documents":
            win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Gestion cambio":
            win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Cambios de alcance":
            win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to Change Requests":
            win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
        }
      }
    },

    handleMenuItemPress: function(oEvent) {

      // Sacamos la informacion de la oferta seleccionada:
      var lo_offertDetail_Descp = this.getView().byId("offertDetail_Descp");
      var lv_offertDetail_Descp = lo_offertDetail_Descp.getText();
      var lo_offertDetail_RespNA = this.getView().byId("offertDetail_RespNA");
      var lv_offertDetail_RespNA = lo_offertDetail_RespNA.getText();
      var lo_offertDetail_RespID = this.getView().byId("offertDetail_RespID");
      var lv_offertDetail_RespID = lo_offertDetail_RespID.getText();
      var lo_offertDetail_Est = this.getView().byId("offertDetail_Est");
      var lv_offertDetail_Est = lo_offertDetail_Est.getText();
      // var lo_offertDetail_Cal = this.getView().byId("offertDetail_Cal");
      // var lv_offertDetail_Cal = lo_offertDetail_Cal.getText();
      var lo_offertDetail_Fecha = this.getView().byId("offertDetail_Fecha");
      var lv_offertDetail_Fecha = lo_offertDetail_Fecha.getText();
      // var lo_offertDetail_Relj = this.getView().byId("offertDetail_Relj");
      // var lv_offertDetail_Relj = lo_offertDetail_Relj.getText();
      var lo_offertDetail_Horas = this.getView().byId("offertDetail_Horas");
      var lv_offertDetail_Horas = lo_offertDetail_Horas.getText();
      // var lo_offertDetail_Bille = this.getView().byId("offertDetail_Bille");
      // var lv_offertDetail_Bille = lo_offertDetail_Bille.getText();
      var lo_offertDetail_Presup = this.getView().byId("offertDetail_Presup");
      var lv_offertDetail_Presup = lo_offertDetail_Presup.getText();
      var lo_offertDetail_Btn = this.getView().byId("offertDetail_Btn");
      var lv_offertDetail_Btn = lo_offertDetail_Btn.getText();
      // var lo_offertDetail_Semf = this.getView().byId("offertDetail_Semf");
      // var lv_offertDetail_Semf = lo_offertDetail_Semf.getText();

      // Buscamos el modelo:
      var lo_modeloSel = sap.ui.getCore().getModel("modelOffertSelected");

      // Asignamos las propiedades al modelo:
      var lv_url1 = lo_modeloSel.getProperty("/URL1");
      var lv_url2 = lo_modeloSel.getProperty("/URL2");
      var lv_url3 = lo_modeloSel.getProperty("/URL3");
      var lv_url4 = lo_modeloSel.getProperty("/URL4");
      var lv_url5 = lo_modeloSel.getProperty("/URL5");

      //window.location = lv_url1;
      var win;

      // Necesitamos saber la accion realizada por el usuario:
      var lo_param = oEvent.getParameters();
      var lv_accion = lo_param.item.mProperties.text;

      // Segun el tipo de accion realizamos diferentes acciones:
      // (Usar el texto puede provocar que si esta en otro idioma, no funcione)
      switch (lv_accion) {
        case "Líneas de distribución":
          win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to Distribution Lines":
          win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Documentos":
          win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
          // win.focus();
          break;
        case "Go to Documents":
          win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Gestion del cambio":
          win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to Change Requests":
          win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Cambios de alcance":
          win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
      }
    },

    handleSelectionChange: function(oEvent) {

      var lv_refresh = false;

      var lv_ofer_f_aprobado        = this.getView().getModel("i18n").getResourceBundle().getText("f_aprobado");
      var lv_ofer_f_cancelada       = this.getView().getModel("i18n").getResourceBundle().getText("f_cancelada");
      var lv_ofer_f_doc_elab        = this.getView().getModel("i18n").getResourceBundle().getText("f_doc_elab");
      var lv_ofer_f_analisis_aux    = this.getView().getModel("i18n").getResourceBundle().getText("f_analisis_aux");
      var lv_ofer_f_curso           = this.getView().getModel("i18n").getResourceBundle().getText("f_curso");
      var lv_ofer_f_revision_aux    = this.getView().getModel("i18n").getResourceBundle().getText("f_revision_aux");
      var lv_ofer_f_est_consolidada = this.getView().getModel("i18n").getResourceBundle().getText("f_est_consolidada");
      var lv_ofer_f_est_realizada   = this.getView().getModel("i18n").getResourceBundle().getText("f_est_realizada");
      var lv_ofer_f_finalizado      = this.getView().getModel("i18n").getResourceBundle().getText("f_finalizado");
      var lv_ofer_f_pdte_info_aux   = this.getView().getModel("i18n").getResourceBundle().getText("f_pdte_info_aux");
      var lv_ofer_f_rechazado       = this.getView().getModel("i18n").getResourceBundle().getText("f_rechazado");

      var oSelectedItem = oEvent.getParameter("selectedItem");
      var sQuery = oSelectedItem.sId;

      // build filter array
      var aFilter      = [];
      var aFilterEmpty = [];

      if (sQuery) {
        aFilter.push(new Filter("Estado", FilterOperator.EQ, sQuery));
      }

      // filter binding
      var oList = this.getView().byId("offertFilter");
      var oBinding = oList.getBinding("items");

      // Necesitamos eliminar el filtro/s previo/s:
      oBinding.aFilters = [];

      // Aplicamos el filtro o limpiamos:
      if (lv_refresh === false) {
        oBinding.filter(aFilter);
      } else {
        oBinding.filter(aFilterEmpty);
      }
    },

    handleSelectionFinish: function(oEvent) {

    },

    /* =========================================================== */
    /* begin: internal methods                                     */
    /* =========================================================== */

    _createOffertViewModelLT: function() {

      // Declaramos global el modelo para que lo accedan todos los controladores
      return new sap.ui.model.json.JSONModel({
        PROJ_GUID: "",
        ID_RESPONSABLE: "",
        ID_LIN_TRABAJO: "",
        EXTERNALID_PROJ: "",
        TASK_GUID: "",
        DESCRP: "",
        URL1: "",
        URL2: "",
        URL3: "",
        URL4: "",
        URL5: "",
        RIESGO: "",
        FECHA: "",
        GAVAN: 0,
        DES: 0,
        EXT: 0,
        STATUS: "",
        HORAS: 0,
        PREP: 0,
        CURR: "",
        RESP_NAME: "",
        RESP_ID: ""
      });
    },

    _createOffertDtlViewModel: function() {

      // Declaramos global el modelo para que lo accedan todos los controladores
      return new sap.ui.model.json.JSONModel({
        URL1: "",
        URL2: "",
        URL3: "",
        URL4: "",
        URL5: ""
      });

    },

    _getModelOffert: function(oEvent) {

      // Comprobamos si existe el modelo:
      var lo_modelOffert = sap.ui.getCore().getModel("modelOffert");
      if (lo_modelOffert === undefined) {

        // Si no existe, no lo creamos.

      } else {

        // Recogemos el modelo (comprobamos si viene del inicio):
        var lv_screen  = lo_modelOffert.getProperty("/screen");
        var lv_nOffert = lo_modelOffert.getProperty("/item_guid");
        var lv_nProjct = lo_modelOffert.getProperty("/proj_guid");

        // Si viene del inicio, haremos un set y borraremos los datos del modelo:
        if (lv_screen === "Oferta") {

          // Asignamos las propiedades al modelo:
          var lv_vacio = " ";
          lo_modelOffert.setProperty("/screen", lv_vacio);
          lo_modelOffert.setProperty("/item_guid", lv_vacio);
          lo_modelOffert.setProperty("/proj_guid", lv_vacio);

          // Sacamos la lista de ofertas:
          var lo_offertList = this.getView().byId("offertFilter");

          //var lt_items = lo_offertList.oPropagatedProperties.oModels.OfertaOD.aBindings;
          var lv_counter = 0;
          var lv_position = 0;
          var lt_items = lo_offertList.oPropagatedProperties.oModels.OfertaOD.oData;

          // Buscamos el indice seleccionado:
          for (var index in lt_items) {
            if (lt_items.hasOwnProperty(index)) {

              // Parseamos el elemento del buclle:
              var ls_row = index.replace(/\//, ".");
              var lv_index_oGuid = ls_row.substr(20, 32);;
              var lv_index_pGuid = ls_row.substr(64, 32);

              // Comparamos el pGuid:
              if (lv_index_pGuid === lv_nProjct) {
                lv_position = lv_counter;
              }

              // Aumentamos el contador:
              lv_counter++;
            }
          }

          // Comprobamos si quiere todas sus lineas:
          if (lv_nProjct === 'All') {

            // Cargamos todas las LTs:
            this._getMisLTs(oEvent);

          } else {

            // Marcamos como seleccionada la linea del modelo:
            lo_offertList.setSelectedItem(lo_offertList.getItems()[lv_position], true, true);
          }
        }
      }
    },

    _buildFilterOfer: function(oEvent) {

       // Comprobamos si ya se han creado los elementos del filtro:
       if (gv_filtros_loaded === false) {

         // Sacamos los textos:
         var lv_ofer_f_aprobado          = this.getView().getModel("i18n").getResourceBundle().getText("f_aprobado");
         var lv_ofer_f_cancelada         = this.getView().getModel("i18n").getResourceBundle().getText("f_cancelada");
         var lv_ofer_f_doc_elab          = this.getView().getModel("i18n").getResourceBundle().getText("f_doc_elab");
         var lv_ofer_f_analisis          = this.getView().getModel("i18n").getResourceBundle().getText("f_analisis");
         var lv_ofer_f_analisis_aux      = this.getView().getModel("i18n").getResourceBundle().getText("f_analisis_aux");
         var lv_ofer_f_curso             = this.getView().getModel("i18n").getResourceBundle().getText("f_curso");
         var lv_ofer_f_revision          = this.getView().getModel("i18n").getResourceBundle().getText("f_revision");
         var lv_ofer_f_revision_aux      = this.getView().getModel("i18n").getResourceBundle().getText("f_revision_aux");
         var lv_ofer_f_est_consolidada   = this.getView().getModel("i18n").getResourceBundle().getText("f_est_consolidada");
         var lv_ofer_f_est_realizada     = this.getView().getModel("i18n").getResourceBundle().getText("f_est_realizada");
         var lv_ofer_f_est_realizada_aux = this.getView().getModel("i18n").getResourceBundle().getText("f_est_realizada_aux");
         var lv_ofer_f_finalizado        = this.getView().getModel("i18n").getResourceBundle().getText("f_finalizado");
         var lv_ofer_f_pdte_info         = this.getView().getModel("i18n").getResourceBundle().getText("f_pdte_info");
         var lv_ofer_f_pdte_info_aux     = this.getView().getModel("i18n").getResourceBundle().getText("f_pdte_info_aux");
         var lv_ofer_f_rechazado         = this.getView().getModel("i18n").getResourceBundle().getText("f_rechazado");

         // Contadores de los estados:
         var lv_total_c                  = 0;
         var lv_ofer_f_aprobado_c        = 0;
         var lv_ofer_f_cancelada_c       = 0;
         var lv_ofer_f_doc_elab_c        = 0;
         var lv_ofer_f_analisis_c        = 0;
         var lv_ofer_f_curso_c           = 0;
         var lv_ofer_f_revision_c        = 0;
         var lv_ofer_f_est_consolidada_c = 0;
         var lv_ofer_f_est_realizada_c   = 0;
         var lv_ofer_f_finalizado_c      = 0;
         var lv_ofer_f_pdte_info_c       = 0;
         var lv_ofer_f_rechazado_c       = 0;


         // Marcamos que hemos construidos los valores del filtro:
         gv_filtros_loaded = true;

         // Buscamos los items:
         var lt_items = oEvent.oSource.mAggregations.items;
         var lo_item;
         for (var i = 0; i < lt_items.length; i++) {

           lo_item = lt_items[i].oBindingContexts.OfertaOD;
           var oData_item = lo_item.oModel.oData;
           var lv_item_guid = lo_item.sPath.substr(1, 98);

           //var lt_items = lo_rows[i].oBindingContexts.LinTbjOD.oModel.oData;
           var lv_counter = 0;

           // Buscamos el indice seleccionado:
           for (var index in oData_item) {
             if (index === lv_item_guid) {

               // Sacamos la informacion del elemento:
               var ls_fields = oData_item[Object.keys(oData_item)[lv_counter]];

               // Contamos las totales:
               lv_total_c = lv_total_c + 1;

               switch(ls_fields.Estado) {
                 case lv_ofer_f_aprobado:
                   lv_ofer_f_aprobado_c = lv_ofer_f_aprobado_c + 1;
                   break;
                 case lv_ofer_f_cancelada:
                   lv_ofer_f_cancelada_c = lv_ofer_f_cancelada_c + 1;
                   break;
                 case lv_ofer_f_doc_elab:
                   lv_ofer_f_doc_elab_c = lv_ofer_f_doc_elab_c + 1;
                   break;
                 case lv_ofer_f_analisis:
                   lv_ofer_f_analisis_c = lv_ofer_f_analisis_c + 1;
                   break;
                 case lv_ofer_f_curso:
                   lv_ofer_f_curso_c = lv_ofer_f_curso_c + 1;
                   break;
                 case lv_ofer_f_revision:
                   lv_ofer_f_revision_c = lv_ofer_f_revision_c + 1;
                   break;
                 case lv_ofer_f_est_consolidada:
                   lv_ofer_f_est_consolidada_c = lv_ofer_f_est_consolidada_c + 1;
                   break;
                 case lv_ofer_f_est_realizada:
                   lv_ofer_f_est_realizada_c = lv_ofer_f_est_realizada_c + 1;
                   break;
                 case lv_ofer_f_finalizado:
                   lv_ofer_f_finalizado_c = lv_ofer_f_finalizado_c + 1;
                   break;
                 case lv_ofer_f_pdte_info:
                   lv_ofer_f_pdte_info_c = lv_ofer_f_pdte_info_c + 1;
                   break;
                 case lv_ofer_f_rechazado:
                   lv_ofer_f_rechazado_c = lv_ofer_f_rechazado_c + 1;
                   break;
                 default:
               };
             };
             lv_counter = lv_counter + 1;
           };
         };


         // Obtenemos la referencia del filtro:
         var oMultiCombo = this.getView().byId("ComboOfer");

         // Añadimos el elemento " ":
         var item0 = new sap.ui.core.ListItem("EmptyOffer", {key: "Empty", text: "         "});
         item0.setAdditionalText(lv_total_c);
         oMultiCombo.insertItem(item0, 999);

         // Añadimos el elemento "Aprobado":
         var item1 = new sap.ui.core.ListItem(lv_ofer_f_aprobado, {key: lv_ofer_f_aprobado, text: lv_ofer_f_aprobado});
         item1.setAdditionalText(lv_ofer_f_aprobado_c);
         oMultiCombo.insertItem(item1, 999);

         // Añadimos el elemento "Cancelada":
         var item2 = new sap.ui.core.ListItem(lv_ofer_f_cancelada, {key: lv_ofer_f_cancelada, text: lv_ofer_f_cancelada, additionalText : lv_ofer_f_cancelada_c});
         oMultiCombo.insertItem(item2, 999);

         // Añadimos el elemento "Documento elaborado":
         var item3 = new sap.ui.core.ListItem(lv_ofer_f_doc_elab, {key: lv_ofer_f_doc_elab, text: lv_ofer_f_doc_elab, additionalText : lv_ofer_f_doc_elab_c});
         oMultiCombo.insertItem(item3, 999);

         // Añadimos el elemento "Analisis":
         var item4 = new sap.ui.core.ListItem(lv_ofer_f_analisis_aux, {key: lv_ofer_f_analisis_aux, text: lv_ofer_f_analisis_aux, additionalText : lv_ofer_f_analisis_c});
         oMultiCombo.insertItem(item4, 999);

         // Añadimos el elemento "En curso":
         var item5 = new sap.ui.core.ListItem(lv_ofer_f_curso, {key: lv_ofer_f_curso, text: lv_ofer_f_curso, additionalText : lv_ofer_f_curso_c});
         oMultiCombo.insertItem(item5, 999);

         // Añadimos el elemento "Revision":
         var item6 = new sap.ui.core.ListItem(lv_ofer_f_revision_aux, {key: lv_ofer_f_revision_aux, text: lv_ofer_f_revision_aux, additionalText : lv_ofer_f_revision_c});
         oMultiCombo.insertItem(item6, 999);

         // Añadimos el elemento "Estimacion consolidada":
         var item7 = new sap.ui.core.ListItem(lv_ofer_f_est_consolidada, {key: lv_ofer_f_est_consolidada, text: lv_ofer_f_est_consolidada, additionalText : lv_ofer_f_est_consolidada_c});
         oMultiCombo.insertItem(item7, 999);

         // Añadimos el elemento "Estimacion realizada":
         var item8 = new sap.ui.core.ListItem(lv_ofer_f_est_realizada_aux, {key: lv_ofer_f_est_realizada_aux, text: lv_ofer_f_est_realizada_aux, additionalText : lv_ofer_f_est_realizada_c});
         oMultiCombo.insertItem(item8, 999);

         // Añadimos el elemento "Finalizado":
         var item9 = new sap.ui.core.ListItem(lv_ofer_f_finalizado, {key: lv_ofer_f_finalizado, text: lv_ofer_f_finalizado, additionalText : lv_ofer_f_finalizado_c});
         oMultiCombo.insertItem(item9, 999);

         // Añadimos el elemento "PDTE. Info":
         var item10 = new sap.ui.core.ListItem(lv_ofer_f_pdte_info_aux, {key: lv_ofer_f_pdte_info_aux, text: lv_ofer_f_pdte_info_aux, additionalText : lv_ofer_f_pdte_info_c});
         oMultiCombo.insertItem(item10, 999);

         // Añadimos el elemento "Rechazado":
         var item10 = new sap.ui.core.ListItem(lv_ofer_f_rechazado, {key: lv_ofer_f_rechazado, text: lv_ofer_f_rechazado, additionalText : lv_ofer_f_rechazado_c});
         oMultiCombo.insertItem(item10, 999);

       };
    },

    _CargaFiltroOfertas: function(oEvent) {

      //var oIconTabFilter, oIconTabBar = this.getView().byId("idIconTabBarOfferts");

     // oIconTabFilter = new IconTabFilter({ text : 'Hola'
        //  })

    },

    _PintarEstilosRowOfertas: function(oEvent) {

      var lo_idOfertas = this.getView().byId("offertFilter");
      var lo_rows = lo_idOfertas.mAggregations.items;

      if (lo_rows !== undefined) {
        var lv_n_rows = lo_rows.length;

        for (var i = 0; i < lv_n_rows; i++) {
          var cell = lo_rows[i].mAggregations.content[0].mAggregations.items[2].mAggregations.items[1];
          var cell_text = cell.mProperties.text;
          // var cell_style = cell.aCustomStyleClasses;

          // Eliminamos los estilos anteriores:
          cell.removeStyleClass("zppm_labelOferta_est_en_eval");
          cell.removeStyleClass("zppm_labelOferta_est_pdte_info");
          cell.removeStyleClass("zppm_labelOferta_est_estimada");
          cell.removeStyleClass("zppm_labelOferta_est_rechazado_plan");
          cell.removeStyleClass("zppm_labelOferta_est_revision_plan");
          cell.removeStyleClass("zppm_labelOferta_est_rechazo_cliente");
          cell.removeStyleClass("zppm_labelOferta_est_pdte_cliente");
          cell.removeStyleClass("zppm_labelOferta_est_en_curso");
          cell.removeStyleClass("zppm_labelOferta_est_finalizado");
          cell.removeStyleClass("zppm_labelOferta_est_cancelada");
          cell.removeStyleClass("zppm_labelOferta_est_otros");
          var cell_style = cell.aCustomStyleClasses[0];

          switch (cell_text) {
            case "EN EVALUACION":
              cell.addStyleClass("zppm_labelOferta_est_en_eval");
              break;
            case "EN EVALUACIÓN":
              cell.addStyleClass("zppm_labelOferta_est_en_eval");
              break;
            case "PEND. EVALUATION":
              cell.addStyleClass("zppm_labelOferta_est_en_eval");
              break;
            case "PDTE. INFO":
              cell.addStyleClass("zppm_labelOferta_est_pdte_info");
              break;
            case "PEND. INFO":
              cell.addStyleClass("zppm_labelOferta_est_pdte_info");
              break;
            case "ESTIMADA":
              cell.addStyleClass("zppm_labelOferta_est_estimada");
              break;
            case "EVALUATED":
              cell.addStyleClass("zppm_labelOferta_est_estimada");
              break;
            case "RECHAZADO PLAN":
              cell.addStyleClass("zppm_labelOferta_est_rechazado_plan");
              break;
            case "PLAN REJECTED":
              cell.addStyleClass("zppm_labelOferta_est_rechazado_plan");
              break;
            case "REVISION PLAN":
              cell.addStyleClass("zppm_labelOferta_est_revision_plan");
              break;
            case "REVISIÓN PLAN":
              cell.addStyleClass("zppm_labelOferta_est_revision_plan");
              break;
            case "PLAN REVIEW":
              cell.addStyleClass("zppm_labelOferta_est_revision_plan");
              break;
            case "RECHAZADO CLIENTE":
              cell.addStyleClass("zppm_labelOferta_est_rechazo_cliente");
              break;
            case "CLIENT REJECTED":
              cell.addStyleClass("zppm_labelOferta_est_rechazo_cliente");
              break;
            case "PDTE. CLIENTE":
              cell.addStyleClass("zppm_labelOferta_est_pdte_cliente");
              break;
            case "PEND. CLIENT":
              cell.addStyleClass("zppm_labelOferta_est_pdte_cliente");
              break;
            case "EN CURSO":
              cell.addStyleClass("zppm_labelOferta_est_en_curso");
              break;
            case "EXECUTION":
              cell.addStyleClass("zppm_labelOferta_est_en_curso");
              break;
            case "FINALIZADO":
              cell.addStyleClass("zppm_labelOferta_est_finalizado");
              break;
            case "FINISHED":
              cell.addStyleClass("zppm_labelOferta_est_finalizado");
              break;
            case "CANCELADA":
              cell.addStyleClass("zppm_labelOferta_est_cancelada");
              break;
            case "CANCELLED":
              cell.addStyleClass("zppm_labelOferta_est_cancelada");
              break;
           default:
             cell.addStyleClass("zppm_labelOferta_est_otros");
             break;

           }
        }
      }
    },

    _PintarEstilosRowOfertasTable: function(oEvent) {

      var lo_idOfertas = this.getView().byId("offertFilter");
      var lo_rows = lo_idOfertas.mAggregations.rows;

      if (lo_rows !== undefined) {
        var lv_n_rows = lo_rows.length;

        for (var i = 0; i < lv_n_rows; i++) {
          var cell = lo_rows[i].mAggregations.cells[0].mAggregations.items[2].mAggregations.items[1];
          var cell_text = cell.mProperties.text;
          // var cell_style = cell.aCustomStyleClasses;

          // Eliminamos los estilos anteriores:
          cell.removeStyleClass("zppm_labelOferta_est_en_eval");
          cell.removeStyleClass("zppm_labelOferta_est_pdte_info");
          cell.removeStyleClass("zppm_labelOferta_est_estimada");
          cell.removeStyleClass("zppm_labelOferta_est_rechazado_plan");
          cell.removeStyleClass("zppm_labelOferta_est_revision_plan");
          cell.removeStyleClass("zppm_labelOferta_est_rechazo_cliente");
          cell.removeStyleClass("zppm_labelOferta_est_pdte_cliente");
          cell.removeStyleClass("zppm_labelOferta_est_en_curso");
          cell.removeStyleClass("zppm_labelOferta_est_finalizado");
          cell.removeStyleClass("zppm_labelOferta_est_cancelada");
          cell.removeStyleClass("zppm_labelOferta_est_otros");
          var cell_style = cell.aCustomStyleClasses[0];

          switch (cell_text) {
            case "EN EVALUACION":
              cell.addStyleClass("zppm_labelOferta_est_en_eval");
              break;
            case "EN EVALUACIÓN":
              cell.addStyleClass("zppm_labelOferta_est_en_eval");
              break;
            case "PEND. EVALUATION":
              cell.addStyleClass("zppm_labelOferta_est_en_eval");
              break;
            case "PDTE. INFO":
              cell.addStyleClass("zppm_labelOferta_est_pdte_info");
              break;
            case "PEND. INFO":
              cell.addStyleClass("zppm_labelOferta_est_pdte_info");
              break;
            case "ESTIMADA":
              cell.addStyleClass("zppm_labelOferta_est_estimada");
              break;
            case "EVALUATED":
              cell.addStyleClass("zppm_labelOferta_est_estimada");
              break;
            case "RECHAZADO PLAN":
              cell.addStyleClass("zppm_labelOferta_est_rechazado_plan");
              break;
            case "PLAN REJECTED":
              cell.addStyleClass("zppm_labelOferta_est_rechazado_plan");
              break;
            case "REVISION PLAN":
              cell.addStyleClass("zppm_labelOferta_est_revision_plan");
              break;
            case "REVISIÓN PLAN":
              cell.addStyleClass("zppm_labelOferta_est_revision_plan");
              break;
            case "PLAN REVIEW":
              cell.addStyleClass("zppm_labelOferta_est_revision_plan");
              break;
            case "RECHAZADO CLIENTE":
              cell.addStyleClass("zppm_labelOferta_est_rechazo_cliente");
              break;
            case "CLIENT REJECTED":
              cell.addStyleClass("zppm_labelOferta_est_rechazo_cliente");
              break;
            case "PDTE. CLIENTE":
              cell.addStyleClass("zppm_labelOferta_est_pdte_cliente");
              break;
            case "PEND. CLIENT":
              cell.addStyleClass("zppm_labelOferta_est_pdte_cliente");
              break;
            case "EN CURSO":
              cell.addStyleClass("zppm_labelOferta_est_en_curso");
              break;
            case "EXECUTION":
              cell.addStyleClass("zppm_labelOferta_est_en_curso");
              break;
            case "FINALIZADO":
              cell.addStyleClass("zppm_labelOferta_est_finalizado");
              break;
            case "FINISHED":
              cell.addStyleClass("zppm_labelOferta_est_finalizado");
              break;
            case "CANCELADA":
              cell.addStyleClass("zppm_labelOferta_est_cancelada");
              break;
            case "CANCELLED":
              cell.addStyleClass("zppm_labelOferta_est_cancelada");
              break;
           default:
             cell.addStyleClass("zppm_labelOferta_est_otros");
             break;

           }
        }
      }
    },

    _PintarEstilosDetalleOferta: function(oEvent) {

      // Obtenemos los elementos de pantalla necesarios para la operaciÃƒÆ’Ã‚Â³n:
      var lo_idOffertStatusIcon = this.getView().byId("offertDetail_Semf");
      var lo_idOffertStatus = this.getView().byId("offertDetail_Est");

      // Sacamos el estado de la oferta seleccionada:
      var lv_status = lo_idOffertStatus.mProperties.text;

      // Borramos las clases anteriores en el semÃƒÆ’Ã‚Â¡foro:
      //lo_idOffertStatusIcon.removeStyleClass("zppm_stat_OffertDtl_1");
      //lo_idOffertStatusIcon.removeStyleClass("zppm_stat_OffertDtl_2");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_en_eval");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_pdte_info");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_estimada");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_rechazado_plan");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_revision_plan");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_rechazo_cliente");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_pdte_cliente");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_en_curso");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_finalizado");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_cancelada");
      lo_idOffertStatusIcon.removeStyleClass("zppm_labelOferta_est_otros");
      lo_idOffertStatusIcon.removeStyleClass("zppm_stat_OffertDtl_1");

      // Aplicamos una clase segun el estado:
      switch (lv_status) {
        case "EN EVALUACION":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_en_eval");
            break;
        case "EN EVALUACIÓN":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_en_eval");
            break;
        case "PEND. EVALUATION":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_en_eval");
            break;
        case "PDTE. INFO":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_pdte_info");
            break;
        case "PEND. INFO":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_pdte_info");
            break;
        case "ESTIMADA":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_estimada");
            break;
        case "EVALUATED":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_estimada");
            break;
        case "RECHAZADO PLAN":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_rechazado_plan");
            break;
        case "PLAN REJECTED":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_rechazado_plan");
            break;
        case "REVISION PLAN":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_revision_plan");
            break;
        case "REVISIÓN PLAN":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_revision_plan");
            break;
        case "PLAN REVIEW":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_revision_plan");
            break;
        case "RECHAZADO CLIENTE":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_rechazo_cliente");
            break;
        case "CLIENT REJECTED":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_rechazo_cliente");
            break;
        case "PDTE. CLIENTE":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_pdte_cliente");
            break;
        case "PEND. CLIENT":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_pdte_cliente");
            break;
        case "EN CURSO":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_en_curso");
            break;
        case "EXECUTION":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_en_curso");
            break;
        case "FINALIZADO":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_finalizado");
            break;
        case "FINISHED":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_finalizado");
            break;
        case "CANCELADA":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_cancelada");
            break;
        case "CANCELLED":
            lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_cancelada");
            break;
        default:
           lo_idOffertStatusIcon.addStyleClass("zppm_labelOferta_est_otros");
           break;
      }

    },

    onUpdateLTs: function(event) {

      // Cuando se cargen las ofertas realizamos las siguientes acciones:
      //if (gv_offerts_first_time === false) {

        // Aplicamos un filtro vacio para que no muestre nada al comienzo:
        //this.onFilterLTs("00000000000000000000000000000000", "00000000000000000000000000000000", false);

        // Ocultamos los elementos de informacion del proyecto:
        //this._OcultarOffertInfo(event);

        // Pintamos el estado de cada una de las lineas de las ofertas:
        //this._PintarEstilosRowOfertas(event);

        //gv_offerts_first_time = true;
      //}

      // Pintamos los textos de los estados de las lineas de trabajo:
      this._PintarEstilosLinTrbj(event);
    },

    _getMisLTs: function(oEvent) {

      // Lanzamos el evento de todas mis LTs:
      this.onMisLTS_offerts(oEvent);
    },

    _OcultarOffertInfo: function() {

      var lo_offertDetail_Descp = this.getView().byId("offertDetail_Descp");
      var lo_offertDetail_RespNA = this.getView().byId("offertDetail_RespNA");
      var lo_offertDetail_RespID = this.getView().byId("offertDetail_RespID");
      // var lo_offertDetail_Semf = this.getView().byId("offertDetail_Semf");
      var lo_offertDetail_Est = this.getView().byId("offertDetail_Est");
      var lo_offertDetail_Cal = this.getView().byId("offertDetail_Cal");
      var lo_offertDetail_Fecha = this.getView().byId("offertDetail_Fecha");
      var lo_offertDetail_Relj = this.getView().byId("offertDetail_Relj");
      var lo_offertDetail_Horas = this.getView().byId("offertDetail_Horas");
      var lo_offertDetail_Bille = this.getView().byId("offertDetail_Bille");
      var lo_offertDetail_Presup = this.getView().byId("offertDetail_Presup");
      var lo_offertDetail_Btn = this.getView().byId("offertDetail_Btn");
      var lo_offertDetail_Semf = this.getView().byId("offertDetail_Semf");
      var lo_offertDetail_pte_cliente = this.getView().byId("offertDetail_pte_cliente");
      var lo_offertDetail_exteranl_id = this.getView().byId("offertDetail_exteranl_id");

      lo_offertDetail_Descp.setVisible(false);
      lo_offertDetail_RespNA.setVisible(false);
      lo_offertDetail_RespID.setVisible(false);
      lo_offertDetail_Semf.setVisible(false);
      lo_offertDetail_Est.setVisible(false);
      lo_offertDetail_Cal.setVisible(false);
      lo_offertDetail_Fecha.setVisible(false);
      lo_offertDetail_Relj.setVisible(false);
      lo_offertDetail_Horas.setVisible(false);
      lo_offertDetail_Bille.setVisible(false);
      lo_offertDetail_Presup.setVisible(false);
      lo_offertDetail_Btn.setVisible(false);
      lo_offertDetail_Semf.setVisible(false);
      lo_offertDetail_pte_cliente.setVisible(false);
      lo_offertDetail_exteranl_id.setVisible(false);
    },

    _MostrarOffertInfo: function() {

      var lo_offertDetail_Descp = this.getView().byId("offertDetail_Descp");
      var lo_offertDetail_RespNA = this.getView().byId("offertDetail_RespNA");
      var lo_offertDetail_RespID = this.getView().byId("offertDetail_RespID");
      // var lo_offertDetail_Semf = this.getView().byId("offertDetail_Semf");
      var lo_offertDetail_Est = this.getView().byId("offertDetail_Est");
      var lo_offertDetail_Cal = this.getView().byId("offertDetail_Cal");
      var lo_offertDetail_Fecha = this.getView().byId("offertDetail_Fecha");
      var lo_offertDetail_Relj = this.getView().byId("offertDetail_Relj");
      var lo_offertDetail_Horas = this.getView().byId("offertDetail_Horas");
      var lo_offertDetail_Bille = this.getView().byId("offertDetail_Bille");
      var lo_offertDetail_Presup = this.getView().byId("offertDetail_Presup");
      var lo_offertDetail_Btn = this.getView().byId("offertDetail_Btn");
      var lo_offertDetail_Semf = this.getView().byId("offertDetail_Semf");
      var lo_offertDetail_pte_cliente = this.getView().byId("offertDetail_pte_cliente");
      var lo_offertDetail_exteranl_id = this.getView().byId("offertDetail_exteranl_id");

      lo_offertDetail_Descp.setVisible(true);
      lo_offertDetail_RespNA.setVisible(true);
      lo_offertDetail_RespID.setVisible(true);
      lo_offertDetail_Semf.setVisible(true);
      lo_offertDetail_Est.setVisible(true);
      lo_offertDetail_Cal.setVisible(true);
      lo_offertDetail_Fecha.setVisible(true);
      lo_offertDetail_Relj.setVisible(true);
      lo_offertDetail_Horas.setVisible(true);
      lo_offertDetail_Bille.setVisible(true);
      lo_offertDetail_Presup.setVisible(true);
      lo_offertDetail_Btn.setVisible(true);
      lo_offertDetail_Semf.setVisible(true);
      lo_offertDetail_pte_cliente.setVisible(true);
      lo_offertDetail_exteranl_id.setVisible(true);
    },

    _OcultarElmnMisLTs: function(oEvent) {

      var lo_scroll_ofer          = this.getView().byId("offertFilterScroll");
      var lo_filter_ofer          = this.getView().byId("offertFilter");
      var lo_detalle              = this.getView().byId("detalleOfer");
      var lo_idLinTbjTable        = this.getView().byId("idLinTbjTable");
      var lo_ofertasGnrlContainer = this.getView().byId("ofertasGnrlContainer");

      lo_filter_ofer.setVisible(false);
      lo_scroll_ofer.setVisible(false);


      //lo_idLinTbjTable.addStyleClass("zppm_filter_ofer_misLTs");
      lo_ofertasGnrlContainer.addStyleClass("zppm_filter_ofer_misLTs");
    },

    _MostrarElmnMisLTs: function(oEvent) {

      var lo_scroll_ofer          = this.getView().byId("offertFilterScroll");
      var lo_filter_ofer          = this.getView().byId("offertFilter");
      var lo_detalle              = this.getView().byId("detalleOfer");
      var lo_idLinTbjTable        = this.getView().byId("idLinTbjTable");
      var lo_ofertasGnrlContainer = this.getView().byId("ofertasGnrlContainer");


      lo_filter_ofer.setVisible(true);
      lo_scroll_ofer.setVisible(true);

      //lo_idLinTbjTable.removeStyleClass("zppm_filter_ofer_misLTs");
      lo_ofertasGnrlContainer.removeStyleClass("zppm_filter_ofer_misLTs");

      lo_filter_ofer.removeSelections();
    },

    _DarEstiloBtnMisLTs: function() {

      var lo_Btn_LTs = this.getView().byId("btn_LTs");
      lo_Btn_LTs.addStyleClass("zppm_MisLTsBTN_Marcado");
    },

    _QuitarEstiloBtnMisLTs: function() {

      var lo_Btn_LTs = this.getView().byId("btn_LTs");
      lo_Btn_LTs.removeStyleClass("zppm_MisLTsBTN_Marcado");
      lo_Btn_LTs.removeStyleClass("zppm_button");

    },


    /*************************************/



    /*****   ççççç    *******   çççççç    *****/

    onLoadLTs: function(event) {



    },



    onMisLTS_offerts: function(oEvent) {

      // Ya no necesitamos cargar mas opciones:
      gv_offerts_first_time = true;

      // Le aplicamos un filtro vacio:
      this.onFilterLTs("All", "00000000000000000000000000000000", false);

      // Ocultamos los elementos de informacion del proyecto:
      this._OcultarOffertInfo(event);

      // Ocultamos elementos de pantalla:
      if (BaseController.gv_misLTs_pushed_ofer === false) {
        BaseController.gv_misLTs_pushed_ofer = true;

        this._OcultarElmnMisLTs(event);

        // Aplicamos una clase que deja marcado el boton:
        this._DarEstiloBtnMisLTs();
      } else {
        BaseController.gv_misLTs_pushed_ofer = false;
        this._MostrarElmnMisLTs(event);

        // Aplicamos una clase que deja marcado el boton:
        this._QuitarEstiloBtnMisLTs();

        // BaseController.go_ofer_LTS.removeAllItems();


       };

       // Situa el scroll al inicio de página
        BaseController.go_page_app.scrollTo(0,0);
    },


    onFilterOfferts: function(oQuery1, refresh) {

      // build filter array:
      var aFilter = [];
      var aFilterEmpty = [];
      var sQueryProj = oQuery1;

      if (sQueryProj) {
        var oFilterParam1 = new Filter("Estado", FilterOperator.EQ, sQueryProj);
        aFilter.push(oFilterParam1);
      }

      // filter binding
      var oList = this.getView().byId("offertFilter");
      var oBinding = oList.getBinding("items");

      // Necesitamos eliminar el filtro/s previo/s:
      oBinding.aFilters = [];

      // Aplicamos el filtro:
      if (refresh === false) {
        oBinding.filter(aFilter);
      } else {
        oBinding.filter(aFilterEmpty);
      }

    },


    onFilterLTs: function(oQuery1, oQuery2, refresh) {

      // build filter array
      //var aFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("ProjGuid", sap.ui.model.FilterOperator.Contains, oQuery1 )], false);
      var aFilter = [];
      var aFilterEmpty = [];
      var sQueryProj = oQuery1;
      //var sQueryItem = oQuery2;
      if (sQueryProj) {
        var oFilterParam1 = new Filter("ProjGuid", FilterOperator.EQ, sQueryProj);
        aFilter.push(oFilterParam1);
      }

      // filter binding
      var oList = this.getView().byId("idLinTbjTable");
      var oBinding = oList.getBinding("items");

      // Necesitamos eliminar el filtro/s previo/s:
      oBinding.aFilters = [];

      // Aplicamos el filtro:
      if (refresh === false) {
        oBinding.filter(aFilter);
      } else {
        oBinding.filter(aFilterEmpty);
      }
    },


    /**
     * Event handler for the list selection event
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    _onTravelFromOfferts: function() {

      var lv_offert_selected_Inicio = sap.ui.getCore().getModel("dataRouterModel").getProperty("/item_selected");
      var lv_is_offert_Inicio = sap.ui.getCore().getModel("dataRouterModel").getProperty("/screen");
      var lv_proj_guid = sap.ui.getCore().getModel("dataRouterModel").getProperty("/proj_guid");
      var lv_Descrp = sap.ui.getCore().getModel("dataRouterModel").getProperty("/Descrp");
      var lv_Responsable = sap.ui.getCore().getModel("dataRouterModel").getProperty("/Responsable");
      var lv_ID_Responsable = sap.ui.getCore().getModel("dataRouterModel").getProperty("/ID_Responsable");
      var lv_Estado = sap.ui.getCore().getModel("dataRouterModel").getProperty("/Estado");
      var lv_Fecha = sap.ui.getCore().getModel("dataRouterModel").getProperty("/Fecha");
      var lv_Horas = sap.ui.getCore().getModel("dataRouterModel").getProperty("/Horas");
      var lv_Presupuesto = sap.ui.getCore().getModel("dataRouterModel").getProperty("/Presupuesto");

      // Filtramos las lineas de trabajo de la oferta desde la que viaja:
      this.onFilterLTs(lv_proj_guid, lv_offert_selected_Inicio, false);

      // Obtenemos los elementos de pantalla:
      var lo_offertDetail_Descp = this.getView().byId("offertDetail_Descp");
      var lo_offertDetail_RespNA = this.getView().byId("offertDetail_RespNA");
      var lo_offertDetail_RespID = this.getView().byId("offertDetail_RespID");
      var lo_offertDetail_Est = this.getView().byId("offertDetail_Est");
      var lo_offertDetail_Cal = this.getView().byId("offertDetail_Cal");
      var lo_offertDetail_Fecha = this.getView().byId("offertDetail_Fecha");
      var lo_offertDetail_Relj = this.getView().byId("offertDetail_Relj");
      var lo_offertDetail_Horas = this.getView().byId("offertDetail_Horas");
      var lo_offertDetail_Bille = this.getView().byId("offertDetail_Bille");
      var lo_offertDetail_Presup = this.getView().byId("offertDetail_Presup");
      var lo_offertDetail_Btn = this.getView().byId("offertDetail_Btn");
      var lo_offertDetail_Semf = this.getView().byId("offertDetail_Semf");

      // Volvemos visibles los elementos de pantalla:
      lo_offertDetail_Descp.setVisible(true);
      lo_offertDetail_RespNA.setVisible(true);
      lo_offertDetail_RespID.setVisible(true);
      lo_offertDetail_Semf.setVisible(true);
      lo_offertDetail_Est.setVisible(true);
      lo_offertDetail_Cal.setVisible(true);
      lo_offertDetail_Fecha.setVisible(true);
      lo_offertDetail_Relj.setVisible(true);
      lo_offertDetail_Horas.setVisible(true);
      lo_offertDetail_Bille.setVisible(true);
      lo_offertDetail_Presup.setVisible(true);
      lo_offertDetail_Btn.setVisible(true);
      lo_offertDetail_Semf.setVisible(true);

      lo_offertDetail_Descp.setText(lv_Descrp);
      lo_offertDetail_RespNA.setText(lv_Responsable);
      lo_offertDetail_RespID.setText(lv_ID_Responsable);
      lo_offertDetail_Est.setText(lv_Estado);
      lo_offertDetail_Fecha.setText(lv_Fecha);
      lo_offertDetail_Horas.setText(lv_Horas);
      lo_offertDetail_Presup.setText(lv_Presupuesto);

      // Declaramos un evento vacio ya que no se va a usar en los metodos de pintado:
      var oEvent;

      // Pintamos los semÃƒÆ’Ã‚Â¡foros de los estados del detalle:
      this._PintarEstilosDetalleOferta(oEvent);

      // Pintamos los textos de los estados de las lineas de trabajo:
      this._PintarEstilosLinTrbj(oEvent);
    },

    _PintarEstilosLinTrbj: function(oEvent) {
      var lo_idLinTbjTable = this.getView().byId("idLinTbjTable");
      // lo_idLinTbjTable
      var rows = lo_idLinTbjTable.mAggregations.items;
      var nRows = rows.length;
      var linea;
      for (var i = 0; i < nRows; i++) {
        linea = rows[i];
        var cell = linea.mAggregations.cells[2]; //.mBindingInfos.text.binding;
        var oValue = cell.mProperties.text;

        cell.removeStyleClass("zppm_stat_Offert_1");
        cell.removeStyleClass("zppm_stat_Offert_2");
        cell.removeStyleClass("zppm_stat_Offert_3");
        cell.removeStyleClass("zppm_stat_Offert_4");

        switch (oValue) {
          case "Pendiente":
            cell.addStyleClass("zppm_stat_Offert_1");
            break;
          case "Pending":
            cell.addStyleClass("zppm_stat_Offert_1");
            break;
          case "Estimación solicitada":
            cell.addStyleClass("zppm_stat_Offert_2");
            break;
          case "Estimate requested":
            cell.addStyleClass("zppm_stat_Offert_2");
            break;
          case "Estimación realizada":
            cell.addStyleClass("zppm_stat_Offert_3");
            break;
          case "Estimate done":
            cell.addStyleClass("zppm_stat_Offert_3");
            break;
          case "Estimación consolidada":
            cell.addStyleClass("zppm_stat_Offert_4");
            break;
          case "Estimate consolidated":
            cell.addStyleClass("zppm_stat_Offert_4");
            break;
        }
      }
    }
  });
});