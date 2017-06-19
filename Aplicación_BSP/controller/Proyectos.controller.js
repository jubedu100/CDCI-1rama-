sap.ui.define([
  "jquery.sap.global",
  "ZPPM_APP_VOD10/controller/BaseController",
  "ZPPM_APP_VOD10/assets/js/Constants",
  "sap/m/Popover",
  "sap/m/Button",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessagePopover",
  "sap/m/MessagePopoverItem",
  "sap/m/Link",
  "sap/ui/model/json/JSONModel"
], function(jQuery, BaseController, Constants, Popover, Button, Filter, FilterOperator, MessagePopover, MessagePopoverItem, Link, JSONModel) {
  "use strict";


  /************************/
  /*  VARIABLES Globales  */
  /************************/

  var gv_projects_first_time = false;
  var gv_filtros_loaded      = false;

  return BaseController.extend("ZPPM_APP_VOD10.controller.Proyectos", {


    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */


    onInit: function() {

      // Actualizamos la vista:
      if (BaseController.go_active_screen === undefined) {
        BaseController.go_active_screen = "BTNMenuProjects";
      };

      if (BaseController.gv_misLTs_pushed_proj === undefined) {
        BaseController.gv_misLTs_pushed_proj = false;
      };

      this.getRouter().getRoute(Constants.ROUTING_PATTERN["PROYECTOS"]).attachPatternMatched(this.onTravelToProyects, this);
    },


    onBeforeRendering: function(oEvent) {

      // Antes de pintar ocultamos el detalle de las ofertas:
      this._OcultarProyectInfo();
    },


    onAfterRendering: function() {

      // Guardamos la referencia global a la lista de ofertas:
      BaseController.go_Proyect_list = this.getView().byId("projFilter");

      // Guardamos las referencias a los elementos de pantalla del detalle de los proyectos:
      BaseController.go_projDetail_Descp = this.getView().byId("projDetail_Descp");
      BaseController.go_projDetail_RespNA = this.getView().byId("projDetail_RespNA");
      BaseController.go_projDetail_RespID = this.getView().byId("projDetail_RespID");
      BaseController.go_projDetail_Fecha = this.getView().byId("projDetail_Fecha");
      BaseController.go_projDetail_Est_lbl = this.getView().byId("projDetail_Est_lbl");
      BaseController.go_projDetail_Est = this.getView().byId("projDetail_Est");
      BaseController.go_projDetail_Fecha_icon = this.getView().byId("projDetail_Fecha_icon");
      BaseController.go_projDetail_Fecha_gavan = this.getView().byId("projDetail_Fecha_gavan");
      BaseController.go_projDetail_Btn = this.getView().byId("projDetail_Btn");
      BaseController.go_projDetail_Est_horas = this.getView().byId("projDetail_Est_horas");
      BaseController.go_projDetail_Est_distrib1 = this.getView().byId("projDetail_Est_distrib1");
      BaseController.go_projDetail_Est_distrib2 = this.getView().byId("projDetail_Est_distrib2");
      BaseController.go_projDetail_Est_horas_lbl = this.getView().byId("projDetail_Est_horas_lbl");
      BaseController.go_projDetail_Est_distrib1_lbl = this.getView().byId("projDetail_Est_distrib1_lbl");
      BaseController.go_projDetail_Est_distrib2_lbl = this.getView().byId("projDetail_Est_distrib2_lbl");
      BaseController.go_projDetail_Est_distrib_lbl = this.getView().byId("projDetail_Est_distrib_lbl");
      BaseController.go_projDetail_Est_etc_guion = this.getView().byId("projDetail_Est_etc_guion");
      BaseController.go_projDetail_Est_fecha_etc = this.getView().byId("projDetail_Est_fecha_etc");
      BaseController.go_projDetail_externalid = this.getView().byId("projDetail_externalid");

      // Guardamos la referencia a la tabla de LTs del proyecto:
      BaseController.go_proj_LTS = this.getView().byId("idLinTbjTable");

      // Asignamos la referencia al botón de mis líneas de trabajo:
      BaseController.go_misLTs_button_proj = this.getView().byId("btn_LTs");

      // Actualizamos las referencias de contenedores:
      BaseController.go_scroll_proj            = this.getView().byId("projFilterScroll");
      BaseController.go_filter_proj            = this.getView().byId("projFilter");
      BaseController.go_proyectosGnrlContainer = this.getView().byId("proyectosGnrlContainer");

    },

    onExit: function(oEvent) {

    },

    /* =========================================================== */
    /* Events                                                      */
    /* =========================================================== */


    onTravelToProyects: function(oEvent) {

      // Comprobamos si se ha lanzado una navegacion desde inicio:
      if (BaseController.gv_vista_cargada_proj === true) {
        this._getModelProyect(oEvent);
      };
        BaseController.go_active_screen = "BTNMenuProjects";

    },


    onFilterLTs: function(oQuery, refresh) {
      // build filter array
      var aFilter = [];
      var aFilterEmpty = [];
      var sQuery = oQuery;
      if (sQuery) {
        aFilter.push(new Filter("ProjGuid", FilterOperator.EQ, sQuery));
      }
      // filter binding
      var oList = this.getView().byId("idLinTbjTable");
      var oBinding = oList.getBinding("items");
      // Necesitamos eliminar el filtro/s previo/s:
      oBinding.aFilters = [];
      //
      if (refresh === false) {
        oBinding.filter(aFilter);
      } else {
        oBinding.filter(aFilterEmpty);
      }
    },

    onSelectionChange: function(oEvent) {

      /**  REVISAR metodo **/
      gv_projects_first_time = true;


      // Comprobamos que linea ha seleccionado:
      var oItem = oEvent.getParameter("listItem");
      var lv_param = oItem.oBindingContexts.ProjectOD.sPath.substr(1).replace(/\//, ".");
      var lv_pGuid = lv_param.substr(12, 32);

      // Contamos que elemento es dentro de nuestra tabla:
      var lo_ProjList = this.getView().byId("projFilterScroll");
      var lv_element_index = 0;
      var lv_counter = 0;
      var lv_founded = false;
      var lt_Proj_oData = oItem.oBindingContexts.ProjectOD.oModel.oData;
      for (var lv_index in lt_Proj_oData) {

        var lv_string_i = lv_index.substr(12, 32);
        //var lv_string_j = lv_index.substr(68, 32);
        if (lv_string_i === lv_pGuid) {
          lv_element_index = lv_counter;
          lv_founded = true;
        };
        lv_counter = lv_counter + 1;
      };

      // Hacemos el set del elemento en el scroll si lo hemos encontrado:
      if (lv_founded === true) {
       /* lo_ProjList.scrolltoIndex = function(idx) {
                                      var ul = lo_ProjList.$().find('ul');
                                      var ul_id = ul.attr('id');
                                      ul.find('li:nth-child(' + idx + ')').focus();
                                      ul.find('li:nth-child(' + idx + ')').blur(); // remove this line if you want to -:)
                                    }
        lo_ProjList.scrolltoIndex(lv_element_index); */
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
      var lv_project_selected = lv_param.substr(10);
      var oQuery = "/ProjectSet" + lv_project_selected;

      // Le quitamos el marcado al boton de mis LTs por si esta en rojo
      this._QuitarEstiloBtnMisLTs();

      // Seleccionamos la línea en la lista y le ponemos focus para que se posicione
      var lo_list = this.getView().byId("projFilter");
      var lt_elem = lo_list.getItems();

      lo_list.setSelectedItem(lt_elem[lv_element_index]);
      lt_elem[lv_element_index].focus();

      // Leemos la informacion del servicio:
      oModel.read(oQuery, null, null, true, function(oData, repsonse) {

        // Mostramos elementos del detalle de la oferta:
        oThis._MostrarProyectInfo();

        // Sacamos los elementos necesarios de la vista:
        var lo_projDetail_Descp = oThis.getView().byId("projDetail_Descp");
        var lo_projDetail_RespNA = oThis.getView().byId("projDetail_RespNA");
        var lo_projDetail_RespID = oThis.getView().byId("projDetail_RespID");
        var lo_projDetail_Fecha = oThis.getView().byId("projDetail_Fecha");
        var lo_projDetail_Est = oThis.getView().byId("projDetail_Est");
        var lo_projDetail_gavan = oThis.getView().byId("projDetail_Fecha_gavan");
        var lo_projDetail_Est_horas = oThis.getView().byId("projDetail_Est_horas");
        var lo_projDetail_Est_distrib1 = oThis.getView().byId("projDetail_Est_distrib1");
        var lo_projDetail_Est_distrib2 = oThis.getView().byId("projDetail_Est_distrib2");
        var lo_projDetail_Est_etc_guion = oThis.getView().byId("projDetail_Est_etc_guion");
        var lo_projDetail_Est_fecha_etc = oThis.getView().byId("projDetail_Est_fecha_etc");
        var lo_projDetail_externalid = oThis.getView().byId("projDetail_externalid");


        // Asignamos los valores obtenidos mediante el servicio:
        lo_projDetail_Descp.setText(oData.Descrp);
        lo_projDetail_RespNA.setText(oData.Responsable);
        //lo_projDetail_RespID.setText(oData.Ceco);
        lo_projDetail_Fecha.setText(oData.Fecha);
        lo_projDetail_Est.setText(oData.Estado);


        var lv_gavan_number = Number(oData.Gavan);
        var lv_gavan_string = oData.Gavan + "%";
        lo_projDetail_gavan.setPercentage(lv_gavan_number);
        lo_projDetail_gavan.setTooltip(lv_gavan_string);

        //lo_projDetail_gavan.setPercentage(oData.Gavan);
        //lo_projDetail_Est_horas.setText(oData.HorasEtc);
        lo_projDetail_Est_distrib1.setText(oData.HorasDes);
        lo_projDetail_Est_distrib2.setText(oData.HorasExt);
        lo_projDetail_Est_fecha_etc.setText(oData.FechaEtc);
        lo_projDetail_externalid.setText(oData.Externalid);

        var lv_est_horas = oData.HorasEtc;
        lv_est_horas = lv_est_horas + "h";
        lo_projDetail_Est_horas.setText(lv_est_horas);


        // Pintamos los semaforos de los estados del detalle:
        //oThis._PintarEstilosDetalleOferta(oEvent);

        // Pintamos los textos de los estados de las lineas de trabajo:
        //oThis._PintarEstilosLinTrbj(oEvent);

        // Filtramos las LTs de la oferta seleccionada:
        oThis.onFilterLTs(oData.Guid, false);

        // Asignamos las URLs del proyecto:
        oThis.onSetUrls(oEvent, oData.Url1, oData.Url2, oData.Url3, oData.Url4, oData.Url5);

      lo_list.setSelectedItem(lt_elem[lv_element_index.toString()]);
      lt_elem[lv_element_index.toString()].focus();

      });
      // Hacemos "Set" del modelo global "masterView", es decir, pasamos la info al modelo
      //this.onFilterLTs(lv_pGuid, false);
      // tenemos que hacer el set en el modelo? y vincular en pantalla los campos al modelo
      // var lv_descrp = sap.ui.getCore().getModel("masterView").getProperty("/Descrp");
      // Pintamos los textos de los estados de las lineas de trabajo:
      //this._PintarEstilosLinTrbj(oEvent);
    },


    onUpdateFinishedProyects: function(oEvent) {

      this._getModelProyect(oEvent);

      BaseController.gv_vista_cargada_proj = true;

      // Pintamos los semaforos de la lista de proyectos:
      this._PintarSemaforosProyectos(oEvent);

      // Construimos el filtro de proyectos:
      //this._buildFilterProj(oEvent);
    },


    onLoadLTs: function(oEvent) {

      // Pintamos los semaforos de las LTs:
      this._PintarSemaforosLTs(oEvent);
    },


    onLinkRender: function(oEvent) {
    },


    onMisLTS_proy: function(oEvent) {

      // Ya no necesitamos cargar mas opciones:
      gv_projects_first_time = true;

      // Le aplicamos un filtro vacio:
      //this.onFilterLTs("00000000000000000000000000000000", true);
      this.onFilterLTs("All", false);

      // Ocultamos los elementos de informacion del proyecto:
      this._OcultarProyInfo(event);

      // Ocultamos elementos de pantalla:
      if (BaseController.gv_misLTs_pushed_proj === false) {
        BaseController.gv_misLTs_pushed_proj = true;
        this._OcultarElmnMisLTs(event);

        // Aplicamos una clase que deja marcado el boton:
        this._DarEstiloBtnMisLTs();
      } else {
        BaseController.gv_misLTs_pushed_proj = false;
        this._MostrarElmnMisLTs(event);

        // Aplicamos una clase que deja desmarcado el boton:
        this._QuitarEstiloBtnMisLTs();

      };

       // Situa el scroll al inicio de página
        BaseController.go_page_app.scrollTo(0,0);

    },


    onSetUrls: function(oEvent, url1, url2, url3, url4, url5) {
      // Buscamos el modelo:
      var lo_modeloSel = sap.ui.getCore().getModel("modelProjSelected");
      // Creamos el modelo una unica vez:
      if (lo_modeloSel === undefined) {
        // Creamos el modelo:
        lo_modeloSel = this._createProjDtlViewModel();
        // Realizamos un set del modelo:
        sap.ui.getCore().setModel(lo_modeloSel, "modelProjSelected");
      };
      // Asignamos las propiedades al modelo:
      lo_modeloSel.setProperty("/URL1", url1);
      lo_modeloSel.setProperty("/URL2", url2);
      lo_modeloSel.setProperty("/URL3", url3);
      lo_modeloSel.setProperty("/URL4", url4);
      lo_modeloSel.setProperty("/URL5", url5);
    },


    handleMenuItemPressLT: function(oEvent) {
      // Buscamos el modelo:
      var lo_modeloSelLT = sap.ui.getCore().getModel("modelProjLTselected");
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
        var lv_url6 = lo_modeloSelLT.getProperty("/URL6");
        // Necesitamos saber la accion realizada por el usuario:
        var lo_param = oEvent.getParameters();
        var lv_accion = lo_param.item.mProperties.text;
        //window.location = lv_url1;
        var win;
        // Segun el tipo de accion realizamos diferentes acciones:
        // (Usar el texto puede provocar que si esta en otro idioma, no funcione)
        switch (lv_accion) {
          case "Cuenta de Resultados":
            win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to Income Statement":
            win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Riesgos":
            win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to RAG Status":
            win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Recursos":
            win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to Allocations":
            win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Exportar estado":
            //win = window.open(lv_url4, "_blank","toolbar=no,resizable=yes");
            //win.focus();
            break;
          case "Ex":
            //win = window.open(lv_url4, "_blank","toolbar=no,resizable=yes");
            //win.focus();
            break;
          case "Gantt":
            win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to Plan":
            win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Herramienta Forecast y ETC":
            win = window.open(lv_url5, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
          case "Go to ETC Calculator":
            win = window.open(lv_url5, "_blank","toolbar=no,resizable=yes");
            win.focus();
            break;
        }
      }
    },


    handleMenuItemPress: function(oEvent) {
      // var msg = "'" + oEvent.getParameter("item").getText() + "' pressed";
      // Necesitamos el modelo del proyecto:
      var lo_projDetail_Descp = this.getView().byId("projDetail_Descp");
      var lv_projDetail_Descp = lo_projDetail_Descp.getText();
      var lo_projDetail_RespNA = this.getView().byId("projDetail_RespNA");
      var lv_projDetail_RespNA = lo_projDetail_RespNA.getText();
      var lo_projDetail_RespID = this.getView().byId("projDetail_RespID");
      //var lv_projDetail_RespID = lo_projDetail_RespID.getText();
      var lo_projDetail_Fecha = this.getView().byId("projDetail_Fecha");
      var lv_projDetail_Fecha = lo_projDetail_Fecha.getText();
      var lo_projDetail_Est_lbl = this.getView().byId("projDetail_Est_lbl");
      var lv_projDetail_Est_lbl = lo_projDetail_Est_lbl.getText();
      var lo_projDetail_Est = this.getView().byId("projDetail_Est");
      var lv_projDetail_Est = lo_projDetail_Est.getText();
      // var lo_projDetail_Fecha_icon = this.getView().byId("projDetail_Fecha_icon");
      // var lv_projDetail_Fecha_icon = lo_projDetail_Fecha_icon.getText();
      var lo_projDetail_Fecha_gavan = this.getView().byId("projDetail_Fecha_gavan");
      // var lv_projDetail_Fecha_gavan = lo_projDetail_Fecha_gavan.getText();
      var lo_projDetail_Btn = this.getView().byId("projDetail_Btn");
      var lv_projDetail_Btn = lo_projDetail_Btn.getText();
      var lo_projDetail_Est_horas = this.getView().byId("projDetail_Est_horas");
      var lv_projDetail_Est_horas = lo_projDetail_Est_horas.getText();
      //var lo_projDetail_Est_distrib = this.getView().byId("projDetail_Est_distrib");
      //var lv_projDetail_Est_distrib = lo_projDetail_Est_distrib.getText();
      //var lo_projDetail_Est_horas_lbl = this.getView().byId("projDetail_Est_horas_lbl");
      //var lv_projDetail_Est_horas_lbl = lo_projDetail_Est_horas_lbl.getText();
      //var lo_projDetail_Est_distrib_lbl = this.getView().byId("projDetail_Est_distrib_lbl");
      //var lv_projDetail_Est_distrib_lbl = lo_projDetail_Est_distrib_lbl.getText();
      // Buscamos el modelo:
      var lo_modeloSel = sap.ui.getCore().getModel("modelProjSelected");
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
        case "Cuenta de Resultados":
          win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to Income Statement":
          win = window.open(lv_url1, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Riesgos":
          win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to RAG Status":
          win = window.open(lv_url2, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Recursos":
          win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to Allocations":
          win = window.open(lv_url3, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Exportar estado":
          //win = window.open(lv_url4, "_blank","toolbar=no,resizable=yes");
          //win.focus();
          break;
        case "Gantt":
          win = window.open(lv_url4, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to Plan":
          win = window.open(lv_url4, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Herramienta Forecast y ETC":
          win = window.open(lv_url5, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
        case "Go to ETC Calculator":
          win = window.open(lv_url5, "_blank","toolbar=no,resizable=yes");
          win.focus();
          break;
      }
    },


    handleMessagePopoverProyInfo: function(oEvent) {
      var oButton = oEvent.getSource();
      // create menu only once
      // if (!this._menu) {
      this._menu = sap.ui.xmlfragment(
        "ZPPM_APP_VOD10/view/menuBtnProy",
        this
      );
      this.getView().addDependent(this._menu);
      // }
      var eDock = sap.ui.core.Popup.Dock;
      this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
    },


    handleMessagePopoverProyLT: function(oEvent) {
      var oButton = oEvent.getSource();
      // create menu only once
      // if (!this._menu) {
      this._menu = sap.ui.xmlfragment(
        "ZPPM_APP_VOD10/view/menuBtnProyLT",
        this
      );
      this.getView().addDependent(this._menu);
      // }
      // Abrimos el menu del botÃƒÂ³n:
      var eDock = sap.ui.core.Popup.Dock;
      this._menu.open(this._bKeyboard, oButton, eDock.BeginTop, eDock.BeginBottom, oButton);
      // Sacamos la LT que ha seleccionado:
      var lv_LT_item_guid = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbjOD.sPath.substr(21, 32);
      var lv_LT_id_ld = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbjOD.sPath.substr(70, 3);
      var lv_LT_id_lt = oEvent.oSource.oPropagatedProperties.oBindingContexts.LinTbjOD.sPath.substr(89, 3);
      // Sacamos la lista de ofertas:
      var lo_LTsList = this.getView().byId("idLinTbjTable");
      // Construimos lo necesario para recorrer y encontrar el indice:
      var lv_counter = 0;
      var lv_position = 0;
      var lt_items = lo_LTsList.oPropagatedProperties.oModels.LinTbjOD.oData;
      // Buscamos el modelo:
      var lo_modeloSelLT = sap.ui.getCore().getModel("modelProjLTselected");
      // Creamos el modelo una unica vez:
      if (!lo_modeloSelLT) {
        var lo_projLTselModel = this._createProjViewModelLT();
        sap.ui.getCore().setModel(lo_projLTselModel, "modelProjLTselected");
        lo_modeloSelLT = lo_projLTselModel;
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
              //lo_modeloSelLT.setProperty("/URL5", ls_fields.Url6);
              //lo_modeloSelLT.setProperty("/RIESGO", lv_LT_sel_info.RIESGO);
              //lo_modeloSelLT.setProperty("/FECHA", lv_LT_sel_info.FECHA);
              //lo_modeloSelLT.setProperty("/GAVAN", lv_LT_sel_info.GAVAN);
              //lo_modeloSelLT.setProperty("/DES", lv_LT_sel_info.DES);
              //lo_modeloSelLT.setProperty("/EXT", lv_LT_sel_info.EXT);
              //lo_modeloSelLT.setProperty("/STATUS", lv_LT_sel_info.STATUS);
              //lo_modeloSelLT.setProperty("/HORAS", lv_LT_sel_info.HORAS);
              //lo_modeloSelLT.setProperty("/PREP", lv_LT_sel_info.PREP);
              //lo_modeloSelLT.setProperty("/CURR", lv_LT_sel_info.CURR);
              //lo_modeloSelLT.setProperty("/RESP_NAME", lv_LT_sel_info.RESP_NAME);
              //lo_modeloSelLT.setProperty("/RESP_ID", lv_LT_sel_info.RESP_ID);
              //lo_modeloSelLT.setProperty("/URL1", lv_LT_sel_info.URL1);
              //lo_modeloSelLT.setProperty("/URL2", lv_LT_sel_info.URL2);
              //lo_modeloSelLT.setProperty("/URL3", lv_LT_sel_info.URL3);
              //lo_modeloSelLT.setProperty("/URL4", lv_LT_sel_info.URL1);
              //lo_modeloSelLT.setProperty("/URL5", lv_LT_sel_info.URL2);
              //lo_modeloSelLT.setProperty("/URL6", );
            }
            // Aumentamos el contador:
            lv_counter++;
          }
      }
    },

    handleSelectionChange: function(oEvent) {

      var lv_refresh = false;

      var lv_proj_f_creado     = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_creado");
      var lv_proj_f_liberado   = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_liberado");
      var lv_proj_f_lib_ini    = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_lib_ini");
      var lv_proj_f_bloqueado  = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_bloqueado");
      var lv_proj_f_bloq_ini   = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_bloq_ini");
      var lv_proj_f_cerrado    = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_cerrado");
      var lv_proj_f_cancelado  = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_cancelado");
      var lv_proj_f_Ocup_Roles = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_Ocup_Roles");
      var lv_proj_f_Ocup       = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_Ocup");
      var lv_proj_f_Archivado  = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_Archivado");

      var oSelectedItem = oEvent.getParameter("selectedItem");
      var sQuery = oSelectedItem.sId;

      // build filter array
      var aFilter      = [];
      var aFilterEmpty = [];

      if (sQuery) {
        aFilter.push(new Filter("Estado", FilterOperator.EQ, sQuery));
      }

      // filter binding
      var oList = this.getView().byId("projFilter");
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


    _getMisLTs: function(oEvent) {
      // Lanzamos el evento de todas mis LTs:
      this.onMisLTS_proy(oEvent);
    },


    _getModelProyect: function(oEvent) {
      // Comprobamos si existe el modelo:
      var lo_modelProyect = sap.ui.getCore().getModel("modelProyect");
      if (lo_modelProyect === undefined) {
        // Si no existe, no lo creamos.
      } else {
        // Recogemos el modelo (comprobamos si viene del inicio):
        var lv_screen  = lo_modelProyect.getProperty("/screen");
        var lv_nOffert = lo_modelProyect.getProperty("/item_guid");
        var lv_nProjct = lo_modelProyect.getProperty("/proj_guid");
        // Si viene del inicio, haremos un set y borraremos los datos del modelo:
        if (lv_screen === "Proyect") {
          // Asignamos las propiedades al modelo:
          var lv_vacio = " ";
          lo_modelProyect.setProperty("/screen", lv_vacio);
          lo_modelProyect.setProperty("/item_guid", lv_vacio);
          lo_modelProyect.setProperty("/proj_guid", lv_vacio);
          // Sacamos la lista de ofertas:
          var lo_proyectList = this.getView().byId("projFilter");
          // Construimos lo necesario para recorrer y encontrar el indice:
          var lv_counter = 0;
          var lv_position = 0;
          var lt_items = lo_proyectList.oPropagatedProperties.oModels.ProjectOD.oData;
          // Buscamos el indice seleccionado:
          for (var index in lt_items) {
            if (lt_items.hasOwnProperty(index)) {
              // Parseamos el elemento del buclle:
              var ls_row = index.replace(/\//, ".");
              var lv_index_oGuid = ls_row.substr(0, 0);;
              var lv_index_pGuid = ls_row.substr(12, 32);
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
            lo_proyectList.setSelectedItem(lo_proyectList.getItems()[lv_position], true, true);
            // lo_proyectList.getItems()[lv_position]
            //var item = lo_proyectList.getItems()[0];
            //lo_proyectList.setSelectedItem(item, true);
          }
        }
      }
    },

    _OcultarElmnMisLTs: function(oEvent) {

      var lo_scroll_proj            = this.getView().byId("projFilterScroll");
      var lo_filter_proj            = this.getView().byId("projFilter");
      var lo_detalle                = this.getView().byId("detalleProj");
      var lo_idLinTbjTable          = this.getView().byId("idLinTbjTable");
      var lo_proyectosGnrlContainer = this.getView().byId("proyectosGnrlContainer");

      lo_filter_proj.setVisible(false);
      lo_scroll_proj.setVisible(false);

      //lo_idLinTbjTable.addStyleClass("zppm_filter_proj_misLTs");
      lo_proyectosGnrlContainer.addStyleClass("zppm_filter_proj_misLTs");
    },

    _MostrarElmnMisLTs: function(oEvent) {

      var lo_scroll_proj            = this.getView().byId("projFilterScroll");
      var lo_filter_proj            = this.getView().byId("projFilter");
      var lo_detalle                = this.getView().byId("detalleProj");
      var lo_idLinTbjTable          = this.getView().byId("idLinTbjTable");
      var lo_proyectosGnrlContainer = this.getView().byId("proyectosGnrlContainer");

      lo_filter_proj.setVisible(true);
      lo_scroll_proj.setVisible(true);

      //lo_idLinTbjTable.removeStyleClass("zppm_filter_proj_misLTs");
      lo_proyectosGnrlContainer.removeStyleClass("zppm_filter_proj_misLTs");

      lo_filter_proj.removeSelections();
    },

    _buildFilterProj: function(oEvent) {

       // Comprobamos si ya se han creado los elementos del filtro:
       if (gv_filtros_loaded === false) {

         // Sacamos los textos:
         var lv_proj_f_creado     = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_creado");
         var lv_proj_f_liberado   = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_liberado");
         var lv_proj_f_lib_ini    = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_lib_ini");
         var lv_proj_f_bloqueado  = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_bloqueado");
         var lv_proj_f_bloq_ini   = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_bloq_ini");
         var lv_proj_f_cerrado    = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_cerrado");
         var lv_proj_f_cancelado  = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_cancelado");
         var lv_proj_f_Ocup_Roles = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_Ocup_Roles");
         var lv_proj_f_Ocup       = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_Ocup");
         var lv_proj_f_Archivado  = this.getView().getModel("i18n").getResourceBundle().getText("proj_f_Archivado");

         // Contadores de los estados:
         var lv_total_c             = 0;
         var lv_proj_f_creado_c     = 0;
         var lv_proj_f_liberado_c   = 0;
         var lv_proj_f_lib_ini_c    = 0;
         var lv_proj_f_bloqueado_c  = 0;
         var lv_proj_f_bloq_ini_c   = 0;
         var lv_proj_f_cerrado_c    = 0;
         var lv_proj_f_cancelado_c  = 0;
         var lv_proj_f_Ocup_Roles_c = 0;
         var lv_proj_f_Ocup_c       = 0;
         var lv_proj_f_Archivado_c  = 0;


         // Marcamos que hemos construidos los valores del filtro:
         gv_filtros_loaded = true;

         // Buscamos los items:
         var lt_items = oEvent.oSource.mAggregations.items;
         var lo_item;
         for (var i = 0; i < lt_items.length; i++) {

           lo_item = lt_items[i].oBindingContexts.ProjectOD;
           var oData_item = lo_item.oModel.oData;
           var lv_item_guid = lo_item.sPath.substr(1, 46);

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
                 case lv_proj_f_creado:
                   lv_proj_f_creado_c = lv_proj_f_creado_c + 1;
                   break;
                 case lv_proj_f_liberado:
                   lv_proj_f_liberado_c = lv_proj_f_liberado_c + 1;
                   break;
                 case lv_proj_f_lib_ini:
                   lv_proj_f_lib_ini_c = lv_proj_f_lib_ini_c + 1;
                   break;
                 case lv_proj_f_bloqueado:
                   lv_proj_f_bloqueado_c = lv_proj_f_bloqueado_c + 1;
                   break;
                 case lv_proj_f_bloq_ini:
                   lv_proj_f_bloq_ini_c = lv_proj_f_bloq_ini_c + 1;
                   break;
                 case lv_proj_f_cerrado:
                   lv_proj_f_cerrado_c = lv_proj_f_cerrado_c + 1;
                   break;
                 case lv_proj_f_cancelado:
                   lv_proj_f_cancelado_c = lv_proj_f_cancelado_c + 1;
                   break;
                 case lv_proj_f_Ocup_Roles:
                   lv_proj_f_Ocup_Roles_c = lv_proj_f_Ocup_Roles_c + 1;
                   break;
                 case lv_proj_f_Ocup:
                   lv_proj_f_Ocup_c = lv_proj_f_Ocup_c + 1;
                   break;
                 case lv_proj_f_Archivado:
                   lv_proj_f_Archivado_c =lv_proj_f_Archivado_c + 1;
                   break;
                 default:
               };
             };
             lv_counter = lv_counter + 1;
           };
         };


         // Obtenemos la referencia del filtro:
         var oMultiCombo = this.getView().byId("ComboProj");

         // Añadimos el elemento " ":
         var item0 = new sap.ui.core.ListItem("EmptyProj", {key: "Empty", text: "         "});
         item0.setAdditionalText(lv_total_c);
         oMultiCombo.insertItem(item0, 999);

         // Añadimos el elemento "Creado":
         var item1 = new sap.ui.core.ListItem(lv_proj_f_creado, {key: lv_proj_f_creado, text: lv_proj_f_creado});
         item1.setAdditionalText(lv_proj_f_creado_c);
         oMultiCombo.insertItem(item1, 999);

         // Añadimos el elemento "Liberado":
         var item2 = new sap.ui.core.ListItem(lv_proj_f_liberado, {key: lv_proj_f_liberado, text: lv_proj_f_liberado, additionalText : lv_proj_f_liberado_c});
         oMultiCombo.insertItem(item2, 999);

         // Añadimos el elemento "Liberado - iniciado":
         var item3 = new sap.ui.core.ListItem(lv_proj_f_lib_ini, {key: lv_proj_f_lib_ini, text: lv_proj_f_lib_ini, additionalText : lv_proj_f_lib_ini_c});
         oMultiCombo.insertItem(item3, 999);

         // Añadimos el elemento "Bloqueado":
         var item4 = new sap.ui.core.ListItem(lv_proj_f_bloqueado, {key: lv_proj_f_bloqueado, text: lv_proj_f_bloqueado, additionalText : lv_proj_f_bloqueado_c});
         oMultiCombo.insertItem(item4, 999);

         // Añadimos el elemento "Bloqueado - iniciado":
         var item5 = new sap.ui.core.ListItem(lv_proj_f_bloq_ini, {key: lv_proj_f_bloq_ini, text: lv_proj_f_bloq_ini, additionalText : lv_proj_f_bloq_ini_c});
         oMultiCombo.insertItem(item5, 999);

         // Añadimos el elemento "Cerrado":
         var item6 = new sap.ui.core.ListItem(lv_proj_f_cerrado, {key: lv_proj_f_cerrado, text: lv_proj_f_cerrado, additionalText : lv_proj_f_cerrado_c});
         oMultiCombo.insertItem(item6, 999);

         // Añadimos el elemento "Cancelado":
         var item7 = new sap.ui.core.ListItem(lv_proj_f_cancelado, {key: lv_proj_f_cancelado, text: lv_proj_f_cancelado, additionalText : lv_proj_f_cancelado_c});
         oMultiCombo.insertItem(item7, 999);

         // Añadimos el elemento "Ocupacion de roles":
         var item8 = new sap.ui.core.ListItem(lv_proj_f_Ocup_Roles, {key: lv_proj_f_Ocup_Roles, text: lv_proj_f_Ocup_Roles, additionalText : lv_proj_f_Ocup_Roles_c});
         oMultiCombo.insertItem(item8, 999);

         // Añadimos el elemento "Ocupacion":
         var item9 = new sap.ui.core.ListItem(lv_proj_f_Ocup, {key: lv_proj_f_Ocup, text: lv_proj_f_Ocup, additionalText : lv_proj_f_Ocup_c});
         oMultiCombo.insertItem(item9, 999);

         // Añadimos el elemento "Archivado":
         var item10 = new sap.ui.core.ListItem(lv_proj_f_Archivado, {key: lv_proj_f_Archivado, text: lv_proj_f_Archivado, additionalText : lv_proj_f_Archivado_c});
         oMultiCombo.insertItem(item10, 999);

       };
    },


    _PintarSemaforosProyectos: function(oEvent) {
      // Obtenemos los elementos de pantalla necesarios:
      var lo_idProjs = this.getView().byId("projFilter");
      var lo_rows = lo_idProjs.mAggregations.items;
      var lv_n_rows = lo_rows.length;
      // Recorremos todas las líneas de proyectos de la pantalla de inicio:
      for (var i = 0; i < lv_n_rows; i++) {

        var lo_chart = lo_rows[i].mAggregations.content[0].mAggregations.items[1].mAggregations.items[4];
        var lv_percentage_str = lo_rows[i].mAggregations.content[0].mAggregations.items[1].mAggregations.items[5].mProperties.text;
        var lv_percentage_int = Number(lv_percentage_str);
        lo_chart.setPercentage(lv_percentage_int);
        lv_percentage_str = lv_percentage_str + "%";
        lo_chart.setTooltip(lv_percentage_str);

        //var lo_semaforo = lo_rows[i].mAggregations.content[0].mAggregations.items[2];
        var lo_semaforo = lo_rows[i].mAggregations.content[0].mAggregations.items[1].mAggregations.items[2];
        //var lo_status = lo_rows[i].mAggregations.content[0].mAggregations.items[3];
        var lo_status = lo_rows[i].mAggregations.content[0].mAggregations.items[1].mAggregations.items[3];
        var lv_status_text = lo_status.mProperties.text;
        // var cell_style = cell.aCustomStyleClasses[0];
        switch (lv_status_text) {
          case "ALTO":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_rojo");
            break;
          case "HIGH":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_rojo");
            break;
          case "MEDIO":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_amarillo");
            break;
          case "MEDIUM":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_amarillo");
            break;
          case "BAJO":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_verde");
            break;
          case "LOW":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_verde");
            break;
          case "NONE":
            lo_semaforo.removeStyleClass("circulo");
            lo_semaforo.removeStyleClass("zppm_LT_circle_color_alto");
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_none");
            //zppm_LT_circle_color_alto circulo
            break;
          case "":
            lo_semaforo.removeStyleClass("circulo");
            lo_semaforo.removeStyleClass("zppm_LT_circle_color_alto");
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_none");
            //zppm_LT_circle_color_alto circulo
            break;
          case "V":
            lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_verde");
            lo_rows[i].mAggregations.content[0].mAggregations.items[3].mProperties.text = "EY";
            break;
        }
      }
    },


    _PintarSemaforosLTs: function(oEvent) {
      // Obtenemos los elementos de pantalla necesarios:
      var lo_idProjs = this.getView().byId("idLinTbjTable");
      var lo_rows = lo_idProjs.mAggregations.items;
      var lv_n_rows = lo_rows.length;
      // Recorremos todas las líneas de proyectos de la pantalla de inicio:
      for (var i = 0; i < lv_n_rows; i++) {

        var lo_chart         = lo_rows[i].mAggregations.cells[4];
        var lo_chart_lbl_str = lo_rows[i].mAggregations.cells[7].mProperties.text;;
        var lv_chart_lbl_int = Number(lo_chart_lbl_str);
        lo_chart.setPercentage(lv_chart_lbl_int);
        lo_chart_lbl_str = lo_chart_lbl_str + "%";
        lo_chart.setTooltip(lo_chart_lbl_str);

        var lo_semaforo = lo_rows[i].mAggregations.cells[2];
        var lt_items = lo_rows[i].oBindingContexts.LinTbjOD.oModel.oData;
        var lv_counter = 0;
        // Buscamos el indice seleccionado:
        for (var index in lt_items) {
            if (lt_items.hasOwnProperty(index)) {
              // Parseamos el elemento del buclle:
              var ls_row = index.replace(/\//, ".");
              var lv_index_item_Guid = ls_row.substr(20, 32);
              var lv_index_ld_id     = ls_row.substr(69, 3);
              var lv_index_lt_id     = ls_row.substr(88, 3);
              // Comparamos el pGuid:
              if (lv_counter === i) {
                var ls_fields = lt_items[Object.keys(lt_items)[lv_counter]];
                lo_semaforo.removeStyleClass("circulo");
                lo_semaforo.removeStyleClass("zppm_LT_circle_color_alto");
                lo_semaforo.removeStyleClass("zppm_ProjSemaforo_Estado_rojo");
                lo_semaforo.removeStyleClass("zppm_ProjSemaforo_Estado_amarillo");
                lo_semaforo.removeStyleClass("zppm_ProjSemaforo_Estado_verde");
                lo_semaforo.removeStyleClass("zppm_ProjSemaforo_Estado_none");
                switch (ls_fields.Riesgo) {
                  case "ALTO":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_rojo");
                    break;
                  case "HIGH":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_rojo");
                    break;
                  case "MEDIO":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_amarillo");
                    break;
                  case "MEDIUM":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_amarillo");
                    break;
                  case "BAJO":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_verde");
                    break;
                  case "LOW":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_verde");
                    break;
                  case "NONE":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_none");
                    break;
                  case "":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_none");
                    break;
                  case "V":
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_verde");
                    lo_rows[i].mAggregations.content[0].mAggregations.items[3].mProperties.text = "EY";
                    break;
                  default:
                    lo_semaforo.addStyleClass("zppm_ProjSemaforo_Estado_none");
                    break;
                  }
              }
           }
           lv_counter = lv_counter + 1;
         }
       }
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


    _OcultarProyectInfo: function() {

      var lo_projDetail_Descp = this.getView().byId("projDetail_Descp");
      var lo_projDetail_RespNA = this.getView().byId("projDetail_RespNA");
      var lo_projDetail_RespID = this.getView().byId("projDetail_RespID");
      var lo_projDetail_Fecha = this.getView().byId("projDetail_Fecha");
      var lo_projDetail_Est_lbl = this.getView().byId("projDetail_Est_lbl");
      var lo_projDetail_Est = this.getView().byId("projDetail_Est");
      var lo_projDetail_Fecha_icon = this.getView().byId("projDetail_Fecha_icon");
      var lo_projDetail_Fecha_gavan = this.getView().byId("projDetail_Fecha_gavan");
      var lo_projDetail_Btn = this.getView().byId("projDetail_Btn");
      var lo_projDetail_Est_horas = this.getView().byId("projDetail_Est_horas");
      var lo_projDetail_Est_distrib1 = this.getView().byId("projDetail_Est_distrib1");
      var lo_projDetail_Est_distrib2 = this.getView().byId("projDetail_Est_distrib2");
      var lo_projDetail_Est_horas_lbl = this.getView().byId("projDetail_Est_horas_lbl");
      var lo_projDetail_Est_distrib1_lbl = this.getView().byId("projDetail_Est_distrib1_lbl");
      var lo_projDetail_Est_distrib2_lbl = this.getView().byId("projDetail_Est_distrib2_lbl");
      var lo_projDetail_Est_distrib_lbl = this.getView().byId("projDetail_Est_distrib_lbl");
      var lo_projDetail_Est_etc_guion = this.getView().byId("projDetail_Est_etc_guion");
      var lo_projDetail_Est_fecha_etc = this.getView().byId("projDetail_Est_fecha_etc");
      var lo_projDetail_externalid = this.getView().byId("projDetail_externalid");

      lo_projDetail_Descp.setVisible(false);
      lo_projDetail_RespNA.setVisible(false);
      //lo_projDetail_RespID.setVisible(false);
      lo_projDetail_Fecha.setVisible(false);
      lo_projDetail_Est_lbl.setVisible(false);
      lo_projDetail_Est.setVisible(false);
      lo_projDetail_Fecha_icon.setVisible(false);
      lo_projDetail_Fecha_gavan.setVisible(false);
      lo_projDetail_Btn.setVisible(false);
      lo_projDetail_Est_horas.setVisible(false);
      lo_projDetail_Est_distrib1.setVisible(false);
      lo_projDetail_Est_distrib2.setVisible(false);
      lo_projDetail_Est_horas_lbl.setVisible(false);
      lo_projDetail_Est_distrib1_lbl.setVisible(false);
      lo_projDetail_Est_distrib2_lbl.setVisible(false);
      lo_projDetail_Est_distrib_lbl.setVisible(false);
      lo_projDetail_Est_etc_guion.setVisible(false);
      lo_projDetail_Est_fecha_etc.setVisible(false);
      lo_projDetail_externalid.setVisible(false);
    },


    _MostrarProyectInfo: function() {

      var lo_projDetail_Descp = this.getView().byId("projDetail_Descp");
      var lo_projDetail_RespNA = this.getView().byId("projDetail_RespNA");
      var lo_projDetail_RespID = this.getView().byId("projDetail_RespID");
      var lo_projDetail_Fecha = this.getView().byId("projDetail_Fecha");
      var lo_projDetail_Est_lbl = this.getView().byId("projDetail_Est_lbl");
      var lo_projDetail_Est = this.getView().byId("projDetail_Est");
      var lo_projDetail_Fecha_icon = this.getView().byId("projDetail_Fecha_icon");
      var lo_projDetail_Fecha_gavan = this.getView().byId("projDetail_Fecha_gavan");
      var lo_projDetail_Btn = this.getView().byId("projDetail_Btn");
      var lo_projDetail_Est_horas = this.getView().byId("projDetail_Est_horas");
      var lo_projDetail_Est_distrib1 = this.getView().byId("projDetail_Est_distrib1");
      var lo_projDetail_Est_distrib2 = this.getView().byId("projDetail_Est_distrib2");
      var lo_projDetail_Est_horas_lbl = this.getView().byId("projDetail_Est_horas_lbl");
      var lo_projDetail_Est_distrib1_lbl = this.getView().byId("projDetail_Est_distrib1_lbl");
      var lo_projDetail_Est_distrib2_lbl = this.getView().byId("projDetail_Est_distrib2_lbl");
      var lo_projDetail_Est_distrib_lbl = this.getView().byId("projDetail_Est_distrib_lbl");
      var lo_projDetail_Est_etc_guion = this.getView().byId("projDetail_Est_etc_guion");
      var lo_projDetail_Est_fecha_etc = this.getView().byId("projDetail_Est_fecha_etc");
      var lo_projDetail_externalid = this.getView().byId("projDetail_externalid");
      var lo_projDetail_Est_fecha_etc = this.getView().byId("projDetail_Est_fecha_etc");
      var lo_projDetail_externalid = this.getView().byId("projDetail_externalid");

      lo_projDetail_Descp.setVisible(true);
      lo_projDetail_RespNA.setVisible(true);
      //lo_projDetail_RespID.setVisible(true);
      lo_projDetail_Fecha.setVisible(true);
      lo_projDetail_Est_lbl.setVisible(true);
      lo_projDetail_Est.setVisible(true);
      lo_projDetail_Fecha_icon.setVisible(true);
      lo_projDetail_Fecha_gavan.setVisible(true);
      lo_projDetail_Btn.setVisible(true);
      lo_projDetail_Est_horas.setVisible(true);
      lo_projDetail_Est_distrib1.setVisible(true);
      lo_projDetail_Est_distrib2.setVisible(true);
      lo_projDetail_Est_horas_lbl.setVisible(true);
      lo_projDetail_Est_distrib1_lbl.setVisible(true);
      lo_projDetail_Est_distrib2_lbl.setVisible(true);
      lo_projDetail_Est_distrib_lbl.setVisible(true);
      lo_projDetail_Est_etc_guion.setVisible(false);
      lo_projDetail_Est_fecha_etc.setVisible(true);
      lo_projDetail_externalid.setVisible(true);
      lo_projDetail_Est_fecha_etc.setVisible(true);
      lo_projDetail_externalid.setVisible(true);
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
        var lv_lt_index = Number(linea.oBindingContexts.LinTbj.sPath.substr(9));
        var lv_lt_info = linea.oBindingContexts.LinTbj.oModel.oData.linTbjs[lv_lt_index];
        cell.removeStyleClass("zppm_LT_circle_color_alto");
        cell.removeStyleClass("zppm_LT_circle_color_medio");
        cell.removeStyleClass("zppm_LT_circle_color_bajo");
        switch (lv_lt_info.RIESGO) {
          case "ALTO":
            cell.addStyleClass("zppm_LT_circle_color_alto");
            break;
          case "HIGH":
            cell.addStyleClass("zppm_LT_circle_color_alto");
            break;
          case "MEDIO":
            cell.addStyleClass("zppm_LT_circle_color_medio");
            break;
          case "MEDIUM":
            cell.addStyleClass("zppm_LT_circle_color_medio");
            break;
          case "BAJO":
            cell.addStyleClass("zppm_LT_circle_color_bajo");
            break;
          case "LOW":
            cell.addStyleClass("zppm_LT_circle_color_bajo");
            break;
        }
      }
    },


    _createProjDtlViewModel: function() {
      // Declaramos global el modelo para que lo accedan todos los controladores
      return new sap.ui.model.json.JSONModel({
        URL1: "",
        URL2: "",
        URL3: "",
        URL4: "",
        URL5: ""
      });
    },


    /*************************************/
    /*****   ççççç    *******   çççççç    *****/
    onLoadProyectos: function(event) {
      if (gv_projects_first_time === false) {
        // Marcamos un filtro vacio:
        this.onFilterLTs("00000000000000000000000000000000", false);
        // Ocultamos los elementos de informaciÃƒÂ³n del proyecto:
        this._OcultarProyInfo(event);
      }
    },
    /**
     * Event handler for the list selection event
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    /**
     * Event handler for the list selection event
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    /**
     * Event handler for the list selection event
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    /**
     * Event handler for the list selection event
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    _OcultarProyInfo: function(oEvent) {
      var lo_projDetail_Descp = this.getView().byId("projDetail_Descp");
      var lo_projDetail_RespNA = this.getView().byId("projDetail_RespNA");
      var lo_projDetail_RespID = this.getView().byId("projDetail_RespID");
      var lo_projDetail_Fecha = this.getView().byId("projDetail_Fecha");
      var lo_projDetail_Est_lbl = this.getView().byId("projDetail_Est_lbl");
      var lo_projDetail_Est = this.getView().byId("projDetail_Est");
      var lo_projDetail_Fecha_icon = this.getView().byId("projDetail_Fecha_icon");
      var lo_projDetail_Fecha_gavan = this.getView().byId("projDetail_Fecha_gavan");
      var lo_projDetail_Btn = this.getView().byId("projDetail_Btn");
      var lo_projDetail_Est_horas = this.getView().byId("projDetail_Est_horas");

      var lo_projDetail_Est_distrib1 = this.getView().byId("projDetail_Est_distrib1");
      var lo_projDetail_Est_distrib2 = this.getView().byId("projDetail_Est_distrib2");
      var lo_projDetail_Est_horas_lbl = this.getView().byId("projDetail_Est_horas_lbl");
      var lo_projDetail_Est_distrib1_lbl = this.getView().byId("projDetail_Est_distrib1_lbl");
      var lo_projDetail_Est_distrib2_lbl = this.getView().byId("projDetail_Est_distrib2_lbl");
      var lo_projDetail_Est_distrib_lbl = this.getView().byId("projDetail_Est_distrib_lbl");

      var lo_projDetail_Est_fecha_etc = this.getView().byId("projDetail_Est_fecha_etc");
      var lo_projDetail_externalid = this.getView().byId("projDetail_externalid");




      lo_projDetail_Descp.setVisible(false);
      lo_projDetail_RespNA.setVisible(false);
      //lo_projDetail_RespID.setVisible(false);
      lo_projDetail_Fecha.setVisible(false);
      lo_projDetail_Est_lbl.setVisible(false);
      lo_projDetail_Est.setVisible(false);
      lo_projDetail_Fecha_icon.setVisible(false);
      lo_projDetail_Fecha_gavan.setVisible(false);
      lo_projDetail_Btn.setVisible(false);
      lo_projDetail_Est_horas.setVisible(false);
      //lo_projDetail_Est_distrib.setVisible(false);

      lo_projDetail_Est_distrib1.setVisible(false);
      lo_projDetail_Est_distrib2.setVisible(false);
      lo_projDetail_Est_horas_lbl.setVisible(false);
      lo_projDetail_Est_distrib1_lbl.setVisible(false);
      lo_projDetail_Est_distrib2_lbl.setVisible(false);
      lo_projDetail_Est_distrib_lbl.setVisible(false);

      lo_projDetail_Est_fecha_etc.setVisible(false);
      lo_projDetail_externalid.setVisible(false);
    },
    /**
     * Event handler for the list selection event
     * @param {sap.ui.base.Event} oEvent the list selectionChange event
     * @public
     */
    _createProjViewModel: function() {
      // Declaramos global el modelo para que lo accedan todos los controladores
      return new sap.ui.model.json.JSONModel({
        GUID: "",
        ExternalID: "",
        Descrp: "",
        Responsable: "aa",
        ID_Responsable: "",
        Fecha: "",
        Riesgo: "",
        GAVAN: 0,
        ETC: 0,
        DIS: 0
      });
    },
    _createProjViewModelLT: function() {
      // Declaramos global el modelo para que lo accedan todos los controladores
      return new sap.ui.model.json.JSONModel({
        PROJ_GUID: "",
        ID_RESPONSABLE: "",
        ID_LIN_TRABAJO: "",
        EXTERNALID_PROJ: "",
        TASK_GUID: "",
        DESCRP: "",
        URL: "",
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
        RESP_ID: "",
        URL1: "",
        URL2: "",
        URL3: "",
        URL4: "",
        URL5: "",
        URL6: ""
      });
    },
    /**
     * Shows the selected item on the detail page
     * On phones a additional history entry is created
     * @param {sap.m.ObjectListItem} oItem selected Item
     * @private
     */
    _showDetail: function(oItem) {
      // // Miramos el parÃƒÂ¡metro del tippo de dispositivo:
      // var bReplace = !Device.system.phone;
      // // Construimos el parÃƒÂ¡metro de routing:
      // var lv_parameter1 = oItem.oBindingContexts.Project.sPath;
      // lv_parameter1 = lv_parameter1.substr(1).replace(/\//,".");
      // // Hacemos "Set" del modelo global "masterView", es decir, pasamos la info al modelo
      // //   para que lo pueda leer la vista de detalles:
      // var lv_projectIndex = lv_parameter1.substr(9);
      // var lv_parameter2 = oItem.oBindingContexts.Project.oModel.oData.Projects[lv_projectIndex];
      // sap.ui.getCore().getModel("masterView").setProperty("/selectedProj", lv_parameter1);
      // sap.ui.getCore().getModel("masterView").setProperty("/ExternalID", lv_parameter2.ExternalID);
      // sap.ui.getCore().getModel("masterView").setProperty("/Descrp", lv_parameter2.Descrp);
      // sap.ui.getCore().getModel("masterView").setProperty("/GUID", lv_parameter2.GUID);
      // // Navegamos al detalle:
      // this.getRouter().navTo("object", { objectId : lv_parameter1 }, bReplace);
    }
  });
});