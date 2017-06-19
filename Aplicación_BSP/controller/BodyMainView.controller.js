sap.ui.define([
    'ZPPM_APP_VOD10/controller/BaseController',
    'ZPPM_APP_VOD10/assets/js/Constants',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/m/Page',
      ], function(BaseController, Constants, Filter, FilterOperator, Page) {
  "use strict";

  var gv_filtro_offer_loaded   = false;
  var gv_filtro_project_loaded = false;
  var first_time_focus         = false;


  var Controller = BaseController.extend("ZPPM_APP_VOD10.controller.BodyMainView", {

    /* =========================================================== */
    /* lifecycle methods                                           */
    /* =========================================================== */

    onInit: function () {

      // Actualizamos la vista:
      if (BaseController.go_active_screen === undefined) {
        BaseController.go_active_screen = "BTNMenuInicio";
      };

    },

    onBeforeRendering: function(oEvent) {

    },

    onAfterRendering: function(oEvent) {

// this.scrollTo('0');
      BaseController.go_Offert_Inicio_list = this.getView().byId("offertFilterInicio");
      BaseController.go_Proyect_Inicio_list = this.getView().byId("projFilterInicio");

      // Asignamos en el toolheader la selección de esta vista:
      BaseController.go_iconTabBar.setSelectedKey("BTNMenuInicio");

      // CODIGO: El elemento que se obtiene podria no ser siempre ese:
      if (first_time_focus === false) {
        first_time_focus = true;
      };


    },

    onExit: function(oEvent) {

    },

    /* =========================================================== */
    /* Events                                                      */
    /* =========================================================== */



    onMisLTsOffert: function(oEvent) {

        // Asignamos el modelo de la linea seleccionada:
        this._setModelOffert(oEvent, true);

        // Marcamos la oferta como la vista seleccionada:
        BaseController.go_iconTabBar.setSelectedKey("BTNMenuOferts");
        BaseController.go_active_screen = "BTNMenuOferts";

        // Scroll General al principio de la página
        BaseController.go_page_app.scrollTo(0,0);

        // Viajamos a las ofertas:
        this.navTo(Constants.ROUTING_PATTERN["OFERTAS"], false);

    },

    onMisLTsProject: function(oEvent) {

        // Asignamos el modelo de la linea seleccionada:
        this._setModelProyect(oEvent, true);

        // Marcamos la oferta como la vista seleccionada:
        BaseController.go_iconTabBar.setSelectedKey("BTNMenuProjects");
        BaseController.go_active_screen = "BTNMenuProjects";

        // Scroll General al principio de la página
        BaseController.go_page_app.scrollTo(0,0);

        // Viajamos a los proyectos:
        this.navTo(Constants.ROUTING_PATTERN["PROYECTOS"], false);

    },

    onUpdateFinishedOfferts: function(oEvent) {

        // update the master list object counter after new data is loaded
        this._updateOffertItemCount(oEvent.getParameter("total"));

        // update the offert status:
        this._PintarEstadoOfertasInicio(oEvent);

        // Construimos el filtro de proyectos:
        //this._buildFilterOfer(oEvent);
       // BaseController.go_id_toolheader_invisible.focus();
    },

    onUpdateFinishedProjects: function(oEvent) {

        // update the master list object counter after new data is loaded
        this._updateProjectItemCount(oEvent.getParameter("total"));

        // Pintamos
        this._PintarSemaforosProyectosInicio(oEvent);

        // Construimos el filtro de proyectos:
        //this._buildFilterProj(oEvent);
        //BaseController.go_id_toolheader_invisible.focus();
    },

    onSelectionChangeOff: function(oEvent) {

        // Asignamos el modelo de la linea seleccionada:
        this._setModelOffert(oEvent, false);

        // Marcamos la oferta como la vista seleccionada:
        BaseController.go_iconTabBar.setSelectedKey("BTNMenuOferts");

        // Si nos vamos a ofertas, desseleccionamos el elemento:
        if (BaseController.go_Offert_Inicio_list === undefined) {

        } else {
            BaseController.go_Offert_Inicio_list.removeSelections(true);
        }

        // Scroll General al principio de la página
        BaseController.go_page_app.scrollTo(0,0);

        // Viajamos a las ofertas:
        this.navTo(Constants.ROUTING_PATTERN["OFERTAS"], false);
    },

    onSelectionChangeProj: function(oEvent) {

        // Asignamos el modelo de la linea seleccionada:
        this._setModelProyect(oEvent, false);

        // Marcamos la oferta como la vista seleccionada:
        BaseController.go_iconTabBar.setSelectedKey("BTNMenuProjects");

        // Si nos vamos a ofertas, desseleccionamos el elemento:
        if (BaseController.go_Proyect_Inicio_list === undefined) {

        } else {
            BaseController.go_Proyect_Inicio_list.removeSelections(true);
        }

        // Scroll General al principio de la página
        BaseController.go_page_app.scrollTo(0,0);

        // Viajamos a los proyectos:
        this.navTo(Constants.ROUTING_PATTERN["PROYECTOS"], false);
    },

    handleSelectionChangeOffer: function(oEvent) {

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
      var oList = this.getView().byId("offertFilterInicio");
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

    handleSelectionFinishOffer: function(oEvent) {

    },

    handleSelectionChangeProj: function(oEvent) {

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
      var oList = this.getView().byId("projFilterInicio");
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

    handleSelectionFinishProj: function(oEvent) {

    },

    /* =========================================================== */
    /* Begin: internal methods                                     */
    /* =========================================================== */

    _updateOffertItemCount : function (iTotalItems) {
        BaseController.go_numOfferts.setCount(iTotalItems);
    },

    _updateProjectItemCount : function (iTotalItems) {
        BaseController.go_numProjects.setCount(iTotalItems);
    },

    _setModelOffert: function(oEvent, isMisLTs) {

      // Comprobamos si existe el modelo:
      var lo_modelOffert = sap.ui.getCore().getModel("modelOffert");
      if (lo_modelOffert === undefined) {

        // Creamos el modelo:
        lo_modelOffert = this._createViewModel();

        // Realizamos un set del modelo:
        sap.ui.getCore().setModel(lo_modelOffert, "modelOffert");
      }

      // Comprobamos si quiere todas sus LTs:
      if (isMisLTs === true) {

        lv_nOffert = "All";
        lv_nProjct = "All";

      } else {

        // Buscamos las propiedades de la oferta seleccionda:
        var lo_oList = oEvent.getParameter("listItem");
        var ls_row = lo_oList.oBindingContexts.OfertaOD.sPath.substr(1).replace(/\//, ".");
        var lv_nOffert = ls_row.substr(20, 32);
        var lv_nProjct = ls_row.substr(64, 32);
      }

      // Asignamos las propiedades al modelo:
      lo_modelOffert.setProperty("/screen", "Oferta");
      lo_modelOffert.setProperty("/item_guid", lv_nOffert);
      lo_modelOffert.setProperty("/proj_guid", lv_nProjct);
    },

    _setModelProyect: function(oEvent, isMisLTs) {

      // Comprobamos si existe el modelo:
      var lo_modelProyect = sap.ui.getCore().getModel("modelProyect");
      if (lo_modelProyect === undefined) {

        // Creamos el modelo:
        lo_modelProyect = this._createViewModel();

        // Realizamos un set del modelo:
        sap.ui.getCore().setModel(lo_modelProyect, "modelProyect");
      }

      // Comprobamos si quiere todas sus LTs:
      if (isMisLTs === true) {

        lv_nOffert = "All";
        lv_nProjct = "All";

      } else {

        // Buscamos las propiedades de la oferta seleccionda:
        var lo_oList = oEvent.getParameter("listItem");
        var ls_row = lo_oList.oBindingContexts.ProjectOD.sPath.substr(1).replace(/\//, ".");
        var lv_nOffert = ls_row.substr(0, 0);
        var lv_nProjct = ls_row.substr(12, 32);
      }

      // Asignamos las propiedades al modelo:
      lo_modelProyect.setProperty("/screen", "Proyect");
      lo_modelProyect.setProperty("/item_guid", lv_nOffert);
      lo_modelProyect.setProperty("/proj_guid", lv_nProjct);
    },

    _buildFilterProj: function(oEvent) {

       // Comprobamos si ya se han creado los elementos del filtro:
       if (gv_filtro_project_loaded === false) {

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
         gv_filtro_project_loaded = true;

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
                 case "Creado":
                   lv_proj_f_creado_c = lv_proj_f_creado_c + 1;
                   break;
                 case "Created":
                   lv_proj_f_creado_c = lv_proj_f_creado_c + 1;
                   break;
                 case "Liberado":
                   lv_proj_f_liberado_c = lv_proj_f_liberado_c + 1;
                   break;
                 case "Released":
                   lv_proj_f_liberado_c = lv_proj_f_liberado_c + 1;
                   break;
                 case "Liberado-Iniciado":
                   lv_proj_f_lib_ini_c = lv_proj_f_lib_ini_c + 1;
                   break;
                 case "Released-Begun":
                   lv_proj_f_lib_ini_c = lv_proj_f_lib_ini_c + 1;
                   break;
                 case "Bloqueado":
                   lv_proj_f_bloqueado_c = lv_proj_f_bloqueado_c + 1;
                   break;
                 case "Locked":
                   lv_proj_f_bloqueado_c = lv_proj_f_bloqueado_c + 1;
                   break;
                 case "Bloqueado-Iniciado":
                   lv_proj_f_bloq_ini_c = lv_proj_f_bloq_ini_c + 1;
                   break;
                 case "Locked-Begun":
                   lv_proj_f_bloq_ini_c = lv_proj_f_bloq_ini_c + 1;
                   break;
                 case "Cerrado":
                   lv_proj_f_cerrado_c = lv_proj_f_cerrado_c + 1;
                   break;
                 case "Closed":
                   lv_proj_f_cerrado_c = lv_proj_f_cerrado_c + 1;
                   break;
                 case "Cancelado":
                   lv_proj_f_cancelado_c = lv_proj_f_cancelado_c + 1;
                   break;
                 case "Canceled":
                   lv_proj_f_cancelado_c = lv_proj_f_cancelado_c + 1;
                   break;
                 case "Ocupacion-roles":
                   lv_proj_f_Ocup_Roles_c = lv_proj_f_Ocup_Roles_c + 1;
                   break;
                 case "Role-Staffing":
                   lv_proj_f_Ocup_Roles_c = lv_proj_f_Ocup_Roles_c + 1;
                   break;
                 case "Ocupacion":
                   lv_proj_f_Ocup_c = lv_proj_f_Ocup_c + 1;
                   break;
                 case "Staffing":
                   lv_proj_f_Ocup_c = lv_proj_f_Ocup_c + 1;
                   break;
                 case "Archivado":
                   lv_proj_f_Archivado_c =lv_proj_f_Archivado_c + 1;
                   break;
                 case "Archived":
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
         var item0 = new sap.ui.core.ListItem("EmptyProj_Ini", {key: "EmptyOffert", text: "         "});
         item0.setAdditionalText(lv_total_c);
         oMultiCombo.insertItem(item0, 999);

         // Añadimos el elemento "Creado":
         var item1 = new sap.ui.core.ListItem("proj_f_creado", {key: "lv_proj_f_creado", text: lv_proj_f_creado});
         item1.setAdditionalText(lv_proj_f_creado_c);
         oMultiCombo.insertItem(item1, 999);

         // Añadimos el elemento "Liberado":
         var item2 = new sap.ui.core.ListItem("proj_f_liberado", {key: "lv_proj_f_liberado", text: lv_proj_f_liberado, additionalText : lv_proj_f_liberado_c});
         oMultiCombo.insertItem(item2, 999);

         // Añadimos el elemento "Liberado - iniciado":
         var item3 = new sap.ui.core.ListItem("proj_f_lib_ini", {key: "lv_proj_f_lib_ini", text: lv_proj_f_lib_ini, additionalText : lv_proj_f_lib_ini_c});
         oMultiCombo.insertItem(item3, 999);

         // Añadimos el elemento "Bloqueado":
         var item4 = new sap.ui.core.ListItem("proj_f_bloqueado", {key: "lv_proj_f_bloqueado", text: lv_proj_f_bloqueado, additionalText : lv_proj_f_bloqueado_c});
         oMultiCombo.insertItem(item4, 999);

         // Añadimos el elemento "Bloqueado - iniciado":
         var item5 = new sap.ui.core.ListItem("proj_f_bloq_ini", {key: "lv_proj_f_bloq_ini", text: lv_proj_f_bloq_ini, additionalText : lv_proj_f_bloq_ini_c});
         oMultiCombo.insertItem(item5, 999);

         // Añadimos el elemento "Cerrado":
         var item6 = new sap.ui.core.ListItem("proj_f_cerrado", {key: "lv_proj_f_cerrado", text: lv_proj_f_cerrado, additionalText : lv_proj_f_cerrado_c});
         oMultiCombo.insertItem(item6, 999);

         // Añadimos el elemento "Cancelado":
         var item7 = new sap.ui.core.ListItem("proj_f_cancelado", {key: "lv_proj_f_cancelado", text: lv_proj_f_cancelado, additionalText : lv_proj_f_cancelado_c});
         oMultiCombo.insertItem(item7, 999);

         // Añadimos el elemento "Ocupacion de roles":
         var item8 = new sap.ui.core.ListItem("proj_f_Ocup_Roles", {key: "lv_proj_f_Ocup_Roles", text: lv_proj_f_Ocup_Roles, additionalText : lv_proj_f_Ocup_Roles_c});
         oMultiCombo.insertItem(item8, 999);

         // Añadimos el elemento "Ocupacion":
         var item9 = new sap.ui.core.ListItem("proj_f_Ocup", {key: "lv_proj_f_Ocup", text: lv_proj_f_Ocup, additionalText : lv_proj_f_Ocup_c});
         oMultiCombo.insertItem(item9, 999);

         // Añadimos el elemento "Archivado":
         var item10 = new sap.ui.core.ListItem("proj_f_Archivado", {key: "lv_proj_f_Archivado", text: lv_proj_f_Archivado, additionalText : lv_proj_f_Archivado_c});
         oMultiCombo.insertItem(item10, 999);

       };
    },

    _buildFilterOfer: function(oEvent) {

       // Comprobamos si ya se han creado los elementos del filtro:
       if (gv_filtro_offer_loaded === false) {

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
         var lv_ofer_f_pdte_cliente      = this.getView().getModel("i18n").getResourceBundle().getText("f_pdte_cliente");
         var lv_ofer_f_pdte_cliente_aux  = this.getView().getModel("i18n").getResourceBundle().getText("f_pdte_cliente_aux");


         // Contadores de los estados:
         var lv_total_c                  = 0;
         var lv_ofer_f_aprobado_c        = 0;
         var lv_ofer_f_cancelada_c       = 0;
         var lv_ofer_f_doc_elab_c        = 0;
         var lv_ofer_f_analisis_c        = 0;
         var lv_ofer_f_curso_c           = 0;
         var lv_ofer_f_revision_c        = 0;
         var lv_ofer_f_pdte_cliente_c    = 0;
         var lv_ofer_f_est_consolidada_c = 0;
         var lv_ofer_f_est_realizada_c   = 0;
         var lv_ofer_f_finalizado_c      = 0;
         var lv_ofer_f_pdte_info_c       = 0;
         var lv_ofer_f_rechazado_c       = 0;


         // Marcamos que hemos construidos los valores del filtro:
         gv_filtro_offer_loaded = true;

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

                 case "APROBADO":
                   lv_ofer_f_aprobado_c = lv_ofer_f_aprobado_c + 1;
                   break;
                 case "ACCEPTED":
                   lv_ofer_f_aprobado_c = lv_ofer_f_aprobado_c + 1;
                   break;
                 case "CANCELADA":
                   lv_ofer_f_cancelada_c = lv_ofer_f_cancelada_c + 1;
                   break;
                 case "CANCELLED":
                   lv_ofer_f_cancelada_c = lv_ofer_f_cancelada_c + 1;
                   break;
                 case "DOCUMENTO ELABORADO":
                   lv_ofer_f_doc_elab_c = lv_ofer_f_doc_elab_c + 1;
                   break;
                 case "DOCUMENT":
                   lv_ofer_f_doc_elab_c = lv_ofer_f_doc_elab_c + 1;
                   break;
                 case "DOC.ELABORADO":
                   lv_ofer_f_doc_elab_c = lv_ofer_f_doc_elab_c + 1;
                   break;
                 case "EN EVALUACION":
                   lv_ofer_f_analisis_c = lv_ofer_f_analisis_c + 1;
                   break;
                 case "EN EVALUACIÓN":
                   lv_ofer_f_analisis_c = lv_ofer_f_analisis_c + 1;
                   break;
                 case "PEND. EVALUATION":
                   lv_ofer_f_analisis_c = lv_ofer_f_analisis_c + 1;
                   break;
                 case "PEND.EVALUATION":
                   lv_ofer_f_analisis_c = lv_ofer_f_analisis_c + 1;
                   break;
                 case "EN CURSO":
                   lv_ofer_f_curso_c = lv_ofer_f_curso_c + 1;
                   break;
                 case "EXECUTION":
                   lv_ofer_f_curso_c = lv_ofer_f_curso_c + 1;
                   break;
                 case "REVISION PLAN":
                   lv_ofer_f_revision_c = lv_ofer_f_revision_c + 1;
                   break;
                 case "REVISIÓN PLAN":
                   lv_ofer_f_revision_c = lv_ofer_f_revision_c + 1;
                   break;
                 case "PLAN REVIEW":
                   lv_ofer_f_revision_c = lv_ofer_f_revision_c + 1;
                   break;
                 case "PEND. CLIENT":
                   lv_ofer_f_revision_c = lv_ofer_f_revision_c + 1;
                   break;
                 case "PDTE. CLIENTE":
                   lv_ofer_f_revision_c = lv_ofer_f_revision_c + 1;
                   break;
                 case "ESTIMADA":
                   lv_ofer_f_est_consolidada_c = lv_ofer_f_est_consolidada_c + 1;
                   break;
                 case "EVALUATED":
                   lv_ofer_f_est_consolidada_c = lv_ofer_f_est_consolidada_c + 1;
                   break;
                 case "EVALUACION REALIZADA":
                   lv_ofer_f_est_realizada_c = lv_ofer_f_est_realizada_c + 1;
                   break;
                 case "EVALUACIÓN REALIZADA":
                   lv_ofer_f_est_realizada_c = lv_ofer_f_est_realizada_c + 1;
                   break;
                 case "EVALUATED DONE":
                   lv_ofer_f_est_realizada_c = lv_ofer_f_est_realizada_c + 1;
                   break;
                 case "FINALIZADO":
                   lv_ofer_f_finalizado_c = lv_ofer_f_finalizado_c + 1;
                   break;
                 case "FINISHED":
                   lv_ofer_f_finalizado_c = lv_ofer_f_finalizado_c + 1;
                   break;
                 case "PEND. INFO":
                   lv_ofer_f_pdte_info_c = lv_ofer_f_pdte_info_c + 1;
                   break;
                 case "PDTE. INFO":
                   lv_ofer_f_pdte_info_c = lv_ofer_f_pdte_info_c + 1;
                   break;
                 case "RECHAZADO CLIENTE":
                   lv_ofer_f_rechazado_c = lv_ofer_f_rechazado_c + 1;
                   break;
                 case "CLIENT REJECTED":
                   lv_ofer_f_rechazado_c = lv_ofer_f_rechazado_c + 1;
                   break;
                 case "RECHAZADO PLAN":
                   lv_ofer_f_rechazado_c = lv_ofer_f_rechazado_c + 1;
                   break;
                 case "PLAN REJECTED":
                   lv_ofer_f_rechazado_c = lv_ofer_f_rechazado_c + 1;
                   break;
                 default:
               };
             };
             lv_counter = lv_counter + 1;
           };
         };


         // Obtenemos la referencia del filtro:
         var oMultiCombo = this.getView().byId("ComboOffer");

         // Añadimos el elemento " ":
         var item0 = new sap.ui.core.ListItem("EmptyOffer_Ini", {key: "Empty", text: "         "});
         item0.setAdditionalText(lv_total_c);
         oMultiCombo.insertItem(item0, 999);

         // Añadimos el elemento "Aprobado":
         var item1 = new sap.ui.core.ListItem("ofer_f_aprobado", {key: "lv_ofer_f_aprobado", text: lv_ofer_f_aprobado});
         item1.setAdditionalText(lv_ofer_f_aprobado_c);
         oMultiCombo.insertItem(item1, 999);

         // Añadimos el elemento "Cancelada":
         var item2 = new sap.ui.core.ListItem("ofer_f_cancelada", {key: "lv_ofer_f_cancelada", text: lv_ofer_f_cancelada, additionalText : lv_ofer_f_cancelada_c});
         oMultiCombo.insertItem(item2, 999);

         // Añadimos el elemento "Documento elaborado":
         var item3 = new sap.ui.core.ListItem("ofer_f_doc_elab", {key: "lv_ofer_f_doc_elab", text: lv_ofer_f_doc_elab, additionalText : lv_ofer_f_doc_elab_c});
         oMultiCombo.insertItem(item3, 999);

         // Añadimos el elemento "Analisis":
         var item4 = new sap.ui.core.ListItem("ofer_f_analisis_aux", {key: "lv_ofer_f_analisis_aux", text: lv_ofer_f_analisis_aux, additionalText : lv_ofer_f_analisis_c});
         oMultiCombo.insertItem(item4, 999);

         // Añadimos el elemento "En curso":
         var item5 = new sap.ui.core.ListItem("ofer_f_curso", {key: "lv_ofer_f_curso", text: lv_ofer_f_curso, additionalText : lv_ofer_f_curso_c});
         oMultiCombo.insertItem(item5, 999);

         // Añadimos el elemento "Revision":
         var item6 = new sap.ui.core.ListItem("ofer_f_revision_aux", {key: "lv_ofer_f_revision_aux", text: lv_ofer_f_revision_aux, additionalText : lv_ofer_f_revision_c});
         oMultiCombo.insertItem(item6, 999);

         // Añadimos el elemento "Pdte cliente":
         var item6_bis = new sap.ui.core.ListItem("ofer_f_pdte_cliente", {key: "lv_ofer_f_pdte_cliente", text: lv_ofer_f_pdte_cliente_aux, additionalText : lv_ofer_f_revision_c});
         oMultiCombo.insertItem(item6_bis, 999);

         // Añadimos el elemento "Estimacion consolidada":
         var item7 = new sap.ui.core.ListItem("ofer_f_est_consolidada", {key: "lv_ofer_f_est_consolidada", text: lv_ofer_f_est_consolidada, additionalText : lv_ofer_f_est_consolidada_c});
         oMultiCombo.insertItem(item7, 999);

         // Añadimos el elemento "Estimacion realizada":
         var item8 = new sap.ui.core.ListItem("ofer_f_est_realizada_aux", {key: "lv_ofer_f_est_realizada_aux", text: lv_ofer_f_est_realizada_aux, additionalText : lv_ofer_f_est_realizada_c});
         oMultiCombo.insertItem(item8, 999);

         // Añadimos el elemento "Finalizado":
         var item9 = new sap.ui.core.ListItem("ofer_f_finalizado", {key: "lv_ofer_f_finalizado", text: lv_ofer_f_finalizado, additionalText : lv_ofer_f_finalizado_c});
         oMultiCombo.insertItem(item9, 999);

         // Añadimos el elemento "PDTE. Info":
         var item10 = new sap.ui.core.ListItem("ofer_f_pdte_info_aux", {key: "lv_ofer_f_pdte_info_aux", text: lv_ofer_f_pdte_info_aux, additionalText : lv_ofer_f_pdte_info_c});
         oMultiCombo.insertItem(item10, 999);

         // Añadimos el elemento "Rechazado":
         var item10 = new sap.ui.core.ListItem("ofer_f_rechazado", {key: "lv_ofer_f_rechazado", text: lv_ofer_f_rechazado, additionalText : lv_ofer_f_rechazado_c});
         oMultiCombo.insertItem(item10, 999);

       };
    },

    _PintarEstadoOfertasInicio: function(oEvent) {

      // Seleccionamos los elementos de pantalla necesarios:
      var lo_idOfertas = this.getView().byId("offertFilterInicio");
      var lo_rows = lo_idOfertas.mAggregations.items;
      var lv_n_rows = lo_rows.length;

      // Recorremos las líneas de ofertas de la pantalla de inicio:
      for (var i = 0; i < lv_n_rows; i++) {

        // Sacamos la celda del texto y el texto:
        var cell = lo_rows[i].mAggregations.content[0].mAggregations.items[0].mAggregations.items[1].mAggregations.items[1];
        var cell_text = cell.mProperties.text;
        var cell_style = cell.aCustomStyleClasses[0];

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

        // Según el texto, aplicamos diferentes clases css:
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
          case "RECHAZADO PLAN":
            cell.addStyleClass("zppm_labelOferta_est_rechazado_plan");
            break;
          case "PLAN REJECTED":
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
    },

    _PintarSemaforosProyectosInicio: function(oEvent) {

      // Obtenemos los elementos de pantalla necesarios:
      var lo_idProjs = this.getView().byId("projFilterInicio");
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

    _createViewModel: function() {

      // Declaramos global el modelo para que lo accedan todos los controladores
      return new sap.ui.model.json.JSONModel({
        screen: "",
        item_selected: 0,
        item_guid: "",
        proj_guid: ""
      });
    }

  });
  return Controller;
});