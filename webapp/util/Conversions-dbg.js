/*
 * Copyright (C) 2009-2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.core.format.NumberFormat");
jQuery.sap.require("sap.ui.core.format.DateFormat");
jQuery.sap.require("sap.ui.core.IconPool");
jQuery.sap.require("cross.fnd.fiori.inbox.util.Parser");
jQuery.sap.require("cross.fnd.fiori.inbox.util.CustomAttributeComparator");
cross.fnd.fiori.inbox.Conversions = (function() {

 var sUrl = jQuery.sap.getModulePath("cross.fnd.fiori.inbox") + "/util/ProcessLogConfig.json";
 var oProcessLogConfig;
 var aUserPictureAvailability = {};
 var oDataManager = null;
 var sPlaceHolderUrl = jQuery.sap.getModulePath("cross.fnd.fiori.inbox") + "/img/home/placeholder.jpg";
 var sPlaceHolderUrlForSubstitutors = sap.ui.core.IconPool.getIconURI("person-placeholder");
 var sCustomTaskTitleAttribute = "CustomTaskTitle";
 var sCustomNumberValueAttribute = "CustomNumberValue";
 var sCustomNumberUnitValueAttribute = "CustomNumberUnitValue";
 var sCustomObjectAttributeValue = "CustomObjectAttributeValue";

 return {

  formatterTaskTitle: function(sTaskTitle, oCustomAttributeData) {
   if (sTaskTitle != null) {
    var oValue = cross.fnd.fiori.inbox.Conversions._formatterCustomAttributeValue.call(this, sCustomTaskTitleAttribute, oCustomAttributeData, this);
    // use the CustomTaskTitle only if it has a valid value.
    // TODO do we need to put a strict check and allow only values which are of type string ?
    if (oValue) {
     return oValue;
    }
    return sTaskTitle;
   }
  },

  formatterTaskTitleLink: function(sGUI_Link, bSupportUiExecutionLink) {
   // disable for intent based task and annotation based task
   if (bSupportUiExecutionLink && sGUI_Link) {
    var oParameters = cross.fnd.fiori.inbox.util.Parser.fnParseComponentParameters(sGUI_Link);
    var bIsAnnotationTask = jQuery.isEmptyObject(oParameters) ? false : true;
    this._oURLParsingService = this._oURLParsingService || 
          sap.ushell && sap.ushell.Container && sap.ushell.Container.getService && sap.ushell.Container.getService("URLParsing");
    var bIsIntentTask = this._oURLParsingService && this._oURLParsingService.isIntentUrl(sGUI_Link) ? true : false;
    return  (bIsAnnotationTask || bIsIntentTask) ? false : true;
   } else {
    return true;
   }

  },

  formatterCustomNumberValue: function(oCustomAttributeData) {
   var oValue = cross.fnd.fiori.inbox.Conversions._formatterCustomAttributeValue.call(this, sCustomNumberValueAttribute, oCustomAttributeData);
   if (oValue != null) {
    return oValue;
   }
  },

  formatterCustomNumberUnitValue: function(oCustomAttributeData) {
   var oValue = cross.fnd.fiori.inbox.Conversions._formatterCustomAttributeValue.call(this, sCustomNumberUnitValueAttribute, oCustomAttributeData);
   if (oValue != null) {
    return oValue;
   }
  },

  formatterListCustomObjectAttributeValue: function(oCustomAttributeData, oCustomAttributeDefinitionData) {
   var oValue = cross.fnd.fiori.inbox.Conversions._formatterCustomObjectAttributeValue.call(this, oCustomAttributeData, oCustomAttributeDefinitionData, true);
   if (oValue != null) {
    return oValue;
   }
  },

  formatterDetailCustomObjectAttributeValue: function(oCustomAttributeData, oCustomAttributeDefinitionData) {
   var oValue = cross.fnd.fiori.inbox.Conversions._formatterCustomObjectAttributeValue.call(this, oCustomAttributeData, oCustomAttributeDefinitionData, false);
   if (oValue != null) {
    return oValue;
   }
  },

  _formatterCustomObjectAttributeValue: function(oCustomAttributeData, oCustomAttributeDefinitionData, bList) {
   if (!oDataManager) {
    oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
   }
   if (oDataManager.getShowAdditionalAttributes() === true) {
    if (oCustomAttributeData && oCustomAttributeData.length > 0 && oCustomAttributeDefinitionData && oCustomAttributeDefinitionData.length > 0) {
     var sTaskTypeID = this.getBindingContext().getProperty("TaskDefinitionID"),
      sOrigin = this.getBindingContext().getProperty("SAP__Origin"),
      oElement = this, oValue = null;
     if (sTaskTypeID && sOrigin) {
      jQuery.each(oCustomAttributeData, function(index, sKey) {
       if (oValue) {
        return false;
       }
       var oCustomAttribute = oElement.getModel().getProperty("/" + sKey);
       if (oCustomAttribute.Name.toLowerCase() === sCustomObjectAttributeValue.toLowerCase()) {
        var oDefinitionData = bList ? oDataManager.getCustomAttributeDefinitions()[sTaskTypeID] : oCustomAttributeDefinitionData;
        if (oDefinitionData && oDefinitionData instanceof Array && oDefinitionData.length > 0) {
         jQuery.each(oDefinitionData, function(i, oDefinition){
          if (oDefinition.Name.toLowerCase() === sCustomObjectAttributeValue.toLowerCase()) {
           oValue = cross.fnd.fiori.inbox.Conversions.fnCustomAttributeTypeFormatter(oCustomAttribute.Value, oDefinition.Type);
           return false;
          }
         });
        }
        if (!oValue) {
         oValue = oCustomAttribute.Value;
        }
       }
      });
      if (oValue) {
       return oValue;
      }
     }
    }
   }

  },

  _formatterCustomAttributeValue: function(sAttributeName, oCustomAttributeData) {
   if (oCustomAttributeData != null) {
    if (!oDataManager) {
     oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
    }
    if (oDataManager.getShowAdditionalAttributes() === true) {
     if (oCustomAttributeData instanceof Array && oCustomAttributeData.length > 0) {
      var oValue = cross.fnd.fiori.inbox.Conversions._getCustomAttributeValue.call(this, sAttributeName, oCustomAttributeData);
      if (oValue != null) {
       return oValue;
      }
     }
    }
   }
   return null;
  },

  _getCustomAttributeValue: function(sAttributeName, oCustomAttributeData) {
   var oValue = null;
   for (var i=0; i<oCustomAttributeData.length; i++) {
    var oCustomAttribute = this.getModel().getProperty("/" + oCustomAttributeData[i]);
    if (oCustomAttribute && oCustomAttribute.Name.toLowerCase() === sAttributeName.toLowerCase()) {
     oValue = oCustomAttribute.Value;
     break;
    }
   }
   return oValue;
  },

  formatterPriority : function(sOrigin, sTechnicalName) {

   if (!sOrigin || !sTechnicalName) {
    return null;
   }
   var oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

   var sDisplayName = oDataManager.getPriorityDisplayName(sOrigin, sTechnicalName);
   if (sDisplayName != null)
    return sDisplayName;

   // try hardcoded values.

   switch (sTechnicalName) {
   case "VERY_HIGH" :
    return this.getModel("i18n").getProperty("view.Workflow.priorityVeryHigh");
   case "HIGH" :
    return this.getModel("i18n").getProperty("view.Workflow.priorityHigh");
   case "MEDIUM" :
    return this.getModel("i18n").getProperty("view.Workflow.priorityMedium");
   case "LOW" :
    return this.getModel("i18n").getProperty("view.Workflow.priorityLow");
   }

   // if nothing found, return the technical name

   return sTechnicalName;
  },

  formatterPriorityState : function(sTechnicalName) {

   switch (sTechnicalName) {
   case "VERY_HIGH" :
    return sap.ui.core.ValueState.Error;
   case "HIGH" :
    return sap.ui.core.ValueState.Warning;
   case "MEDIUM" :
   case "LOW" :
   default :
    return sap.ui.core.ValueState.None;
   }
  },

  formatterStatusForReserved : function(bTaskSupportsRelease, bSupportsRelease) {
                
   var bTaskReserved =  (bTaskSupportsRelease != null) ? bTaskSupportsRelease : (bSupportsRelease != null) ? bSupportsRelease : false;
   if (bTaskReserved) {
    return this.getModel("i18n").getProperty("view.Workflow.reservedByYou");
   } else {
    return null;
   }
  },

  formatterEscalationState : function(bIsEscalated) {
   if (bIsEscalated) {
    return this.getModel("i18n").getProperty("view.Workflow.escalated");
   } else {
    return null;
   }
  },

  formatterEnableUpload: function(bAddAttachment) {
   if (bAddAttachment || bAddAttachment == null || bAddAttachment == undefined) {
    return true;
   } else {
    return false;
   }
  },

  formatterVisibilityOfIconTab: function (bVisible) {
   // if not implemented then do not show the icon tab
   return (bVisible) ? true : false;
  },

  formatterVisibilityOfObjectIconTab: function (bVisible) {
   // if not implemented then do not show the icon tab
   var oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
   return (bVisible) ? ((oDataManager.bShowTaskObjects) ? true : false) : false;
  },

  formatterHtml: function (oDescription) {
   var sString = "";

   if (oDescription) {
    if (oDescription.DescriptionAsHtml) {
     sString = oDescription.DescriptionAsHtml;
    } else {
     sString = oDescription.Description;
    }
   }

   if (sString) {
    var sFinal = sString.replace(/<a /g, "<a target=\"_blank\" ");
    sString = '<div class="sapMText">' + sFinal + '</div>';
   }

   return sString;
  },

  formatterUserCardIcon : function (sIconUrl) {
   return  cross.fnd.fiori.inbox.Conversions.formatterUserIcon(sIconUrl);
  },

  _formatterUserIconAll : function(sIconUrl, sPlaceHolder){
   // if no picture URL, return the placeholder image URL
   if (!sIconUrl) {
    return sPlaceHolder;
   }

   var sUrl = cross.fnd.fiori.inbox.Conversions.getRelativeMediaSrc(sIconUrl);
   var that = this;

   /*
    * check if the availability of user picture is cached.
    * If this information is cached, set picture URL if picture is available. 
    * If picture not available, set a place holder image
    * */

   var bUserPictureAvailable = aUserPictureAvailability[sUrl];
   if (bUserPictureAvailable != null) {
    if (bUserPictureAvailable) {
     return sUrl;
    } else {
     return sPlaceHolder;
    }
   }

   /*
    * if availability of the picture isn't cached.
    * set a placeholder image initially
    * in parallel, send an async call to check if the picture is available or not, cache this information and bind the URL if picture available
    * */

   var fnSuccess = function() {
    aUserPictureAvailability[sUrl] = true;
    that.setIcon(sUrl);
    that.rerender();
   };

   var fnError = function() {
    aUserPictureAvailability[sUrl] = false;
   };

   if (!oDataManager) {
    oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
   }
   oDataManager.checkImageAvailabilityAsync(sUrl, fnSuccess, fnError);

   return sPlaceHolder;
  },

  formatterUserIcon : function (sIconUrl) {

   return cross.fnd.fiori.inbox.Conversions._formatterUserIconAll(sIconUrl, sPlaceHolderUrl);

  },

  formatterUserIconForSubstitutors : function (sIconUrl) {

   return cross.fnd.fiori.inbox.Conversions._formatterUserIconAll(sIconUrl, sPlaceHolderUrlForSubstitutors);

  },
  formatterIsNotZero: function (value) {
   return !!value;
  },

  formatterAgentName: function(sDisplayName, sUniqueName) {
   if (sDisplayName) {
    return sDisplayName;
   } else {
    return sUniqueName;
   }
  },
  formatterUserName: function(sDisplayName, sUniqueName) {
   return sDisplayName ? sDisplayName : sUniqueName;

  },

  formatterActionIcon: function (sAction) {
   if(!oProcessLogConfig){
    oProcessLogConfig = jQuery.sap.sjax({url: sUrl, dataType: "json"}).data || {};
   }
   return oProcessLogConfig[sAction] && oProcessLogConfig[sAction].icon;
  },

  formatterActionText: function (sAction) {
   if(!oProcessLogConfig){
    oProcessLogConfig = jQuery.sap.sjax({url: sUrl, dataType: "json"}).data || {};
   }
   return this.getModel("i18n").getProperty(sAction);
  },

  formatterWorkflowLogStatusText: function (sStatus, sUser) {
   if(!oProcessLogConfig){
    oProcessLogConfig = jQuery.sap.sjax({url: sUrl, dataType: "json"}).data || {};
   }
   var sStatusText;
   if(sUser){
    sStatusText = cross.fnd.fiori.inbox.Conversions._getWorkflowLogStatusName(sStatus);
   }
   else{
    sStatusText = cross.fnd.fiori.inbox.Conversions._getImpersonalWorkflowLogStatusName(sStatus);
   }
   return this.getModel("i18n").getProperty(sStatusText);
  },

  formatterWorkflowLogStatusIcon: function (sStatus, sResultType) {
   var sStatusIcon;
   //Set icon based on log status
   sStatusIcon = cross.fnd.fiori.inbox.Conversions._getWorkflowLogStatusName(sStatus);
   //Modify icon in case task is approved/rejected  
   if (sResultType) {
    if (sResultType.toUpperCase() === "NEGATIVE") {
     sStatusIcon = "REJECTED";
    } else if (sResultType.toUpperCase() === "POSITIVE") {
     sStatusIcon = "APPROVED";
    }
   }           
   if(!oProcessLogConfig){
    oProcessLogConfig = jQuery.sap.sjax({url: sUrl, dataType: "json"}).data || {};
   }
   return oProcessLogConfig[sStatusIcon] && oProcessLogConfig[sStatusIcon].icon;
  },

  _getWorkflowLogStatusName: function (sStatus) {
   var sStatusName;
   //Mapping to relevant workflow log status icon names
   switch (sStatus) {
    case "READY":
     sStatusName = "WORKFLOW_TASK_CREATED";
     break;
    case "IN_PROGRESS":
     sStatusName = "WORKFLOW_TASK_IN_PROGRESS";
     break;
    case "COMPLETED":
     sStatusName = "WORKFLOW_TASK_COMPLETED";
     break;
    case "WORKFLOW_STARTED":
     sStatusName = sStatus;
     break;
    case "FOR_RESUBMISSION":
     sStatusName = "WORKFLOW_TASK_SUSPENDEDED";
     break;
    case "CANCELLED":
     sStatusName = "WORKFLOW_TASK_CANCELED";
     break;
   }
   return sStatusName; //unsupported values are returned as empty
  },
  // PerformedByName option so use impersonalised texts in such cases
  _getImpersonalWorkflowLogStatusName: function (sStatus) {
   var sStatusName;
   //Mapping to relevant workflow log status icon names
   switch (sStatus) {
    case "READY":
     sStatusName = "IMPERSONAL_WORKFLOW_TASK_CREATED";
     break;
    case "IN_PROGRESS":
     sStatusName = "IMPERSONAL_WORKFLOW_TASK_IN_PROGRESS";
     break;
    case "COMPLETED":
     sStatusName = "IMPERSONAL_WORKFLOW_TASK_COMPLETED";
     break;
    case "WORKFLOW_STARTED":
     sStatusName = "IMPERSONAL_WORKFLOW_STARTED";
     break;
    case "FOR_RESUBMISSION":
     sStatusName = "IMPERSONAL_WORKFLOW_TASK_SUSPENDEDED";
     break;
    case "CANCELLED":
     sStatusName = "IMPERSONAL_WORKFLOW_TASK_CANCELED";
     break;
   }
   return sStatusName; //unsupported values are returned as empty
  },



  formatterWorkflowLogResultState : function (sResultType) {
   switch (sResultType.toUpperCase()) {
    case "POSITIVE":
     return sap.ui.core.ValueState.Success;
    case "NEGATIVE":
     return sap.ui.core.ValueState.Error;
    case "NEUTRAL":
     return sap.ui.core.ValueState.None;
    default:
     return sap.ui.core.ValueState.None;
   }
  },

  formatterWorkflowLogUserPicture: function (sOrigin, sUser) {
   var sURL = this.getModel().sServiceUrl 
       + "/UserInfoCollection(SAP__Origin='" + sOrigin + "',UniqueName='" + sUser + "')/$value";
   return cross.fnd.fiori.inbox.Conversions.formatterUserIcon.call(this, sURL, this);
  },

  formatterWorkflowLogStatusUsername: function (sName, sStatus) {
   var sStatusName = cross.fnd.fiori.inbox.Conversions._getWorkflowLogStatusName(sStatus);
   return cross.fnd.fiori.inbox.Conversions.formatterActionUsername.call(this, sName, sStatusName, this);
  },
   
  formatterActionUsername: function (sName, sAction) {
   if(!oProcessLogConfig){
    oProcessLogConfig = jQuery.sap.sjax({url: sUrl, dataType: "json"}).data || {};
   }

   if (oProcessLogConfig[sAction] && oProcessLogConfig[sAction].showUsername) {
    return sName;
   }
   return "";
  },

  formatterZeroToNull: function(value){
   //required by history tab counter: not to show "0" when there is no history
   return(value==0 ? null : value);
  },

  formatterSubstitutedText: function(sSubstitutedUserName) {
   if (sSubstitutedUserName) {
    return this.getModel("i18n").getResourceBundle().getText("view.Workflow.Substituted", sSubstitutedUserName);
   } else {
    return null;
   }
  },

  formatterDeadLineIndicator: function(dCompletionDeadLine) {
   var oDate = new Date();
   if (dCompletionDeadLine && dCompletionDeadLine - oDate < 0) {
    return this.getModel("i18n").getProperty("view.Workflow.Overdue"); 
   } else {
    return null;
   }
  },

  formatterDeadLineIndicatorState: function(dCompletionDeadLine) {
   var oDate = new Date();
   if (dCompletionDeadLine && dCompletionDeadLine - oDate < 0) {
    return sap.ui.core.ValueState.Error; 
   } else {
    return sap.ui.core.ValueState.None;
   }
  },

  getEmployeeAddress: function (oAddress) {
   var sAddress = "";
   jQuery.each(oAddress, function(key, value) {
    if (jQuery.type(value) === "string") {
     value = value.trim();
     sAddress = value ? sAddress + value + " " : sAddress + value;
    }
   });
   return sAddress;
  },

  formatterStatus: function(sOrigin, sTechnicalName) {

   if (!sOrigin || !sTechnicalName) {
    return null;
   }
   var oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

   var sDisplayName = oDataManager.getStatusDisplayName(sOrigin, sTechnicalName);
   if (sDisplayName != null)
    return sDisplayName;

   // try hardcoded values.

   switch (sTechnicalName) {
   case "READY" :
    return this.getModel("i18n").getProperty("view.Workflow.status.ready");
   case "IN_PROGRESS" || "INPROGRESS" :
    return this.getModel("i18n").getProperty("view.Workflow.status.in_progress");
   case "RESERVED" :
    return this.getModel("i18n").getProperty("view.Workflow.status.reserved");
   case "EXECUTED" :
    return this.getModel("i18n").getProperty("view.Workflow.status.executed");
   case "FOR_RESUBMISSION" :
    return this.getModel("i18n").getProperty("view.Workflow.status.for_resubmission");
   case "COMPLETED" :
    return this.getModel("i18n").getProperty("view.Workflow.status.completed");
   }

   // if nothing found, return the technical name

   return sTechnicalName;
  },

   /* formats custom attribute values according to the definition provided
      *  and returns back formatted values
       */
     fnCustomAttributeFormatter: function(sValue){
      var sType = this.data().Type;
      return cross.fnd.fiori.inbox.Conversions.fnCustomAttributeTypeFormatter.call(this, sValue, sType);
     },

   /* formats custom attribute values according to the definition provided
      *  and returns back formatted values
       */
     fnCustomAttributeTypeFormatter: function( sValue, sType ){
      var iFinalValue;
      if (typeof sType === "string" && sType.indexOf("class java.") === 0) {
   sType = cross.fnd.fiori.inbox.util.CustomAttributeComparator.fnMapBPMTypes(sType);
      }
      switch( sType ) {
          case 'Edm.String' : {
           iFinalValue = sValue;
     break;
          }
          case 'Edm.DateTime' : {
           if (sValue == null || sValue === "") { // This check solves the issue with "Invalid Date" displayed in the empty column when
            iFinalValue = sValue;      // more that one Task Definiton Type is selected in "task Type" filter.
            break;
           } else {
         sValue = cross.fnd.fiori.inbox.util.CustomAttributeComparator.fnTimeParser(sValue);
         if(isNaN(sValue))
          iFinalValue = "Invalid Date";
         else {
          var oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance(); //sap.ca.ui.model.format.DateFormat.getDateInstance();
           iFinalValue = oDateFormatter.format(new Date(sValue));
         }
           }
           break;
          }
          case 'Edm.Boolean' : {
           if( sValue=="true")
            iFinalValue = sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("CUST_ATTR_TRUE");
           else if( sValue=="false")
            iFinalValue = sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("CUST_ATTR_FALSE");
           break;
          }
          case 'Edm.Int64' : {
           var oNumberFormatter = sap.ui.core.format.NumberFormat.getInstance();
           iFinalValue = oNumberFormatter.format(sValue);
           break;
          }
          case 'Edm.Int32' : {
           var oNumberFormatter = sap.ui.core.format.NumberFormat.getInstance();
           iFinalValue = oNumberFormatter.format(sValue);
           break;
          }
          case 'Edm.Int16' : {
           var oNumberFormatter = sap.ui.core.format.NumberFormat.getInstance();
           iFinalValue = oNumberFormatter.format(sValue);
           break;
          }
          case 'Edm.Time' : {
           if (sValue == null || sValue === "") {
            iFinalValue = sValue;
            break;
           } else {
         sValue = cross.fnd.fiori.inbox.util.CustomAttributeComparator.fnDurationParser(sValue);
         if(isNaN(sValue))
          iFinalValue = "Invalid Time";
         else {
         var oTimeFormatter = sap.ui.core.format.DateFormat.getTimeInstance();
         var tempDate = new Date();
          tempDate.setUTCHours(0, 0, 0, sValue);
             iFinalValue = oTimeFormatter.format(tempDate);
         }
           }
           break;
          }
          case 'Edm.Single' : {
           var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance();
           iFinalValue = numberFormat.format(sValue);
           break;
          }
          case 'Edm.Double' : {
           var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance();
           iFinalValue = numberFormat.format(sValue);
           break;
          }
          case 'Edm.Decimal' : {
           var numberFormat = sap.ui.core.format.NumberFormat.getFloatInstance();
           iFinalValue = numberFormat.format(sValue);
           break;

          }
          default: {
           iFinalValue = sValue;
           break;        
          }
             
      }
      return iFinalValue;
     },
     
      // This formatter returns the inverse of the value of bGenericComponentRendered. Used to hide/show My Inbox when Annotation Based Task UI is shown/hidden
  visibilityFormatterForObjectHeaderAndIconTabBar : function(bGeneriComponentRendered){
   if(bGeneriComponentRendered != undefined)
    return !bGeneriComponentRendered;
   else
    return false;

  },

  // controls visibility of Annotation Based Component's container
  visibilityFormatterForGenericComponentContainer: function(bGeneriComponentRendered){
   if(bGeneriComponentRendered != undefined)
    return bGeneriComponentRendered;
   else
    return false;
  },

     formatterDate: function (sDate) {
      if (sDate) {
       var oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateTimeInstance();
       var sFormattedDate = oDateFormatter.innerFormat.format(sDate, false);
       return sFormattedDate;
      }
     },
     
     formatterDueDate: function (sDate) {
      if (sDate) {
       var oDateFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance();
       var sFormattedDate = oDateFormatter.format(sDate, false);
       var text = sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.dueOn", sFormattedDate);
       var parent = this.getParent ? this.getParent() : null;
       if (parent && parent instanceof sap.m.ObjectListItem) {
        var oFormatOptions = {
         style: "short"
        };
        if(sDate - (new Date()) < 0) {
         oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance(oFormatOptions);
        } else {
         oDateFormatter = sap.ui.core.format.DateFormat.getDateTimeInstance(oFormatOptions);
        }
        sFormattedDate = oDateFormatter.format(sDate, false);
        text = sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.dueOn", sFormattedDate);
        if(this.getText() !== text) {
         var oS2controller = parent.getList().getParent().getParent().getController();
         if(!oS2controller.bInitList) {
          //If the due date string is changed the list item has to be rerendered:
          parent.invalidate();
         }
        }
       }
       return text;
      }
      return;
     },
     
     formatterCreatedDate: function (sDate) {
      var oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
      if (sDate && (oDataManager.bOutbox===undefined || oDataManager.bOutbox===false)) {
       var oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateTimeInstance();
       var sFormattedDate = oDateFormatter.innerFormat.format(sDate, false);
       return sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.createdOn", sFormattedDate);
      }
      return;
     },
     formatterCompletedDate: function (sDate,sTechnicalName) {
      if(!sTechnicalName){
       return null;
      }
      var oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
      if (oDataManager.bOutbox===true && sTechnicalName==="COMPLETED") {
       if(sDate!==null){
       var oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateTimeInstance();
       var sFormattedDate = oDateFormatter.innerFormat.format(sDate, false);
       return sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.completedOn", sFormattedDate);
       }
      }
      return;
     },
       formatterResumeOnText: function (sDate,sTechnicalName) {
       
        if (!sTechnicalName) {
    return null;
   }
      var oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();
      if (oDataManager.bOutbox===true && sTechnicalName==="FOR_RESUBMISSION") {
       if(sDate!==null){
       var oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateTimeInstance();
       var sFormattedDate = oDateFormatter.innerFormat.format(sDate, false);
       return sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.resumeOn", sFormattedDate);
       }
      }
      return;
     },
     
  // this function returns the selected control which triggers the business card
  getSelectedControl: function(oEvent) {
   var oControl = oEvent.getSource();
   var oSelectedControl = undefined;
   var oSelectedDomElement = oEvent.getParameter("domRef");
   if (oSelectedDomElement) {
    oSelectedControl = sap.ui.getCore().byId(oSelectedDomElement.id);
   }
   return oSelectedControl ? oSelectedControl : oControl;
  },

  formatterThemeBasedBackgroundColor: function(sSapUiTheme) {
   // For belize theme, the background color of the header in detail view needs to be blue instead of grey
   if (sSapUiTheme && (sSapUiTheme.toLowerCase() === "sap_belize" || sSapUiTheme.toLowerCase() === "sap_belize_plus")) {
    return "Solid";
   } else {
    return "Transparent";
   }
  },

   getRelativeMediaSrc : function(sMediaSrc) {
          var sUrl = "";
          if (sMediaSrc && typeof sMediaSrc === "string") {
           /* eslint-disable sap-browser-api-error */
              var oLink = document.createElement("a");
              /* eslint-enable sap-browser-api-error */
              oLink.href = sMediaSrc;
              sUrl = (oLink.pathname.charAt(0) === "/") ? oLink.pathname : "/" + oLink.pathname;
          }
          return sUrl;
      },
      
   formatterSupportsProperty: function(bTaskSupportsValue, bSupportsValue) {
    // consider TaskSupports > property value as a preference. Then SupportsProperty value. Return true if both undefined or null
    return (bTaskSupportsValue != null) ? bTaskSupportsValue : (bSupportsValue != null) ? bSupportsValue : true;
   },

   formatterLogTaskSupportsProperty: function(bLogSupportsValue) {
    return (bLogSupportsValue) ? bLogSupportsValue : false;
   },

   formatterShowHideGenericComponent : function(sUIExecutionLink, bShowMyInboxDetailScreen){
    if(bShowMyInboxDetailScreen!=undefined && sUIExecutionLink!=undefined)
     return !sUIExecutionLink;
    else{
     if(sUIExecutionLink==undefined)
      return false;
     else
      return sUIExecutionLink;
    }

   },

   formatterMailSubject: function(sPriority, sCreatedBy, sTaskTitle){
    if(!sPriority && !sCreatedBy){
        return this.i18nBundle.getText("share.email.subject_no_priority_no_user" , [sTaskTitle]);
       }

       if(!sPriority){
        return this.i18nBundle.getText("share.email.subject_no_priority" , [sCreatedBy, sTaskTitle]);
       }

       if (!sCreatedBy){
           return this.i18nBundle.getText("share.email.subject_no_user" , [sPriority, sTaskTitle]);
       } 

          return this.i18nBundle.getText("share.email.subject" , [sPriority, sCreatedBy, sTaskTitle]);
   },

   formatterTaskSupportsValue: function(bTaskSupportsValue, bSupportsValue) {
    // considers TaskSupports as a preference. Then SupportsProperty value. Return false if both undefined or null
    return (bTaskSupportsValue != null) ? bTaskSupportsValue : (bSupportsValue != null) ? bSupportsValue : false;
   },

   setDataManager: function(oDataManagerToSet) {
    oDataManager = oDataManagerToSet;
   },

   setShellTitleToOutbox: function(oComponent, sPath) {
    oComponent.getService("ShellUIService").then(
              function (oService) {
                  oService.setTitle(sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("SHELL_TITLE_OUTBOX"));
              },
              function (oError) {
               jQuery.sap.log.error("Cannot get ShellUIService", oError, sPath);
              }
          );
   }
 };
}());