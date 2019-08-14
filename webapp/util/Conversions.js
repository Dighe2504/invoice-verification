/*
 * Copyright (C) 2009-2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.core.format.NumberFormat");jQuery.sap.require("sap.ui.core.format.DateFormat");jQuery.sap.require("sap.ui.core.IconPool");jQuery.sap.require("cross.fnd.fiori.inbox.util.Parser");jQuery.sap.require("cross.fnd.fiori.inbox.util.CustomAttributeComparator");cross.fnd.fiori.inbox.Conversions=(function(){var u=jQuery.sap.getModulePath("cross.fnd.fiori.inbox")+"/util/ProcessLogConfig.json";var p;var U={};var d=null;var P=jQuery.sap.getModulePath("cross.fnd.fiori.inbox")+"/img/home/placeholder.jpg";var s=sap.ui.core.IconPool.getIconURI("person-placeholder");var c="CustomTaskTitle";var C="CustomNumberValue";var a="CustomNumberUnitValue";var b="CustomObjectAttributeValue";return{formatterTaskTitle:function(t,o){if(t!=null){var v=cross.fnd.fiori.inbox.Conversions._formatterCustomAttributeValue.call(this,c,o,this);if(v){return v;}return t;}},formatterTaskTitleLink:function(g,S){if(S&&g){var o=cross.fnd.fiori.inbox.util.Parser.fnParseComponentParameters(g);var i=jQuery.isEmptyObject(o)?false:true;this._oURLParsingService=this._oURLParsingService||sap.ushell&&sap.ushell.Container&&sap.ushell.Container.getService&&sap.ushell.Container.getService("URLParsing");var I=this._oURLParsingService&&this._oURLParsingService.isIntentUrl(g)?true:false;return(i||I)?false:true;}else{return true;}},formatterCustomNumberValue:function(o){var v=cross.fnd.fiori.inbox.Conversions._formatterCustomAttributeValue.call(this,C,o);if(v!=null){return v;}},formatterCustomNumberUnitValue:function(o){var v=cross.fnd.fiori.inbox.Conversions._formatterCustomAttributeValue.call(this,a,o);if(v!=null){return v;}},formatterListCustomObjectAttributeValue:function(o,e){var v=cross.fnd.fiori.inbox.Conversions._formatterCustomObjectAttributeValue.call(this,o,e,true);if(v!=null){return v;}},formatterDetailCustomObjectAttributeValue:function(o,e){var v=cross.fnd.fiori.inbox.Conversions._formatterCustomObjectAttributeValue.call(this,o,e,false);if(v!=null){return v;}},_formatterCustomObjectAttributeValue:function(o,e,l){if(!d){d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();}if(d.getShowAdditionalAttributes()===true){if(o&&o.length>0&&e&&e.length>0){var t=this.getBindingContext().getProperty("TaskDefinitionID"),O=this.getBindingContext().getProperty("SAP__Origin"),E=this,v=null;if(t&&O){jQuery.each(o,function(f,k){if(v){return false;}var g=E.getModel().getProperty("/"+k);if(g.Name.toLowerCase()===b.toLowerCase()){var D=l?d.getCustomAttributeDefinitions()[t]:e;if(D&&D instanceof Array&&D.length>0){jQuery.each(D,function(i,h){if(h.Name.toLowerCase()===b.toLowerCase()){v=cross.fnd.fiori.inbox.Conversions.fnCustomAttributeTypeFormatter(g.Value,h.Type);return false;}});}if(!v){v=g.Value;}}});if(v){return v;}}}}},_formatterCustomAttributeValue:function(A,o){if(o!=null){if(!d){d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();}if(d.getShowAdditionalAttributes()===true){if(o instanceof Array&&o.length>0){var v=cross.fnd.fiori.inbox.Conversions._getCustomAttributeValue.call(this,A,o);if(v!=null){return v;}}}}return null;},_getCustomAttributeValue:function(A,o){var v=null;for(var i=0;i<o.length;i++){var e=this.getModel().getProperty("/"+o[i]);if(e&&e.Name.toLowerCase()===A.toLowerCase()){v=e.Value;break;}}return v;},formatterPriority:function(o,t){if(!o||!t){return null;}var d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();var D=d.getPriorityDisplayName(o,t);if(D!=null)return D;switch(t){case"VERY_HIGH":return this.getModel("i18n").getProperty("view.Workflow.priorityVeryHigh");case"HIGH":return this.getModel("i18n").getProperty("view.Workflow.priorityHigh");case"MEDIUM":return this.getModel("i18n").getProperty("view.Workflow.priorityMedium");case"LOW":return this.getModel("i18n").getProperty("view.Workflow.priorityLow");}return t;},formatterPriorityState:function(t){switch(t){case"VERY_HIGH":return sap.ui.core.ValueState.Error;case"HIGH":return sap.ui.core.ValueState.Warning;case"MEDIUM":case"LOW":default:return sap.ui.core.ValueState.None;}},formatterStatusForReserved:function(t,S){var T=(t!=null)?t:(S!=null)?S:false;if(T){return this.getModel("i18n").getProperty("view.Workflow.reservedByYou");}else{return null;}},formatterEscalationState:function(i){if(i){return this.getModel("i18n").getProperty("view.Workflow.escalated");}else{return null;}},formatterEnableUpload:function(A){if(A||A==null||A==undefined){return true;}else{return false;}},formatterVisibilityOfIconTab:function(v){return(v)?true:false;},formatterVisibilityOfObjectIconTab:function(v){var d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();return(v)?((d.bShowTaskObjects)?true:false):false;},formatterHtml:function(D){var S="";if(D){if(D.DescriptionAsHtml){S=D.DescriptionAsHtml;}else{S=D.Description;}}if(S){var f=S.replace(/<a /g,"<a target=\"_blank\" ");S='<div class="sapMText">'+f+'</div>';}return S;},formatterUserCardIcon:function(i){return cross.fnd.fiori.inbox.Conversions.formatterUserIcon(i);},_formatterUserIconAll:function(i,e){if(!i){return e;}var u=cross.fnd.fiori.inbox.Conversions.getRelativeMediaSrc(i);var t=this;var f=U[u];if(f!=null){if(f){return u;}else{return e;}}var S=function(){U[u]=true;t.setIcon(u);t.rerender();};var E=function(){U[u]=false;};if(!d){d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();}d.checkImageAvailabilityAsync(u,S,E);return e;},formatterUserIcon:function(i){return cross.fnd.fiori.inbox.Conversions._formatterUserIconAll(i,P);},formatterUserIconForSubstitutors:function(i){return cross.fnd.fiori.inbox.Conversions._formatterUserIconAll(i,s);},formatterIsNotZero:function(v){return!!v;},formatterAgentName:function(D,e){if(D){return D;}else{return e;}},formatterUserName:function(D,e){return D?D:e;},formatterActionIcon:function(A){if(!p){p=jQuery.sap.sjax({url:u,dataType:"json"}).data||{};}return p[A]&&p[A].icon;},formatterActionText:function(A){if(!p){p=jQuery.sap.sjax({url:u,dataType:"json"}).data||{};}return this.getModel("i18n").getProperty(A);},formatterWorkflowLogStatusText:function(S,e){if(!p){p=jQuery.sap.sjax({url:u,dataType:"json"}).data||{};}var f;if(e){f=cross.fnd.fiori.inbox.Conversions._getWorkflowLogStatusName(S);}else{f=cross.fnd.fiori.inbox.Conversions._getImpersonalWorkflowLogStatusName(S);}return this.getModel("i18n").getProperty(f);},formatterWorkflowLogStatusIcon:function(S,r){var e;e=cross.fnd.fiori.inbox.Conversions._getWorkflowLogStatusName(S);if(r){if(r.toUpperCase()==="NEGATIVE"){e="REJECTED";}else if(r.toUpperCase()==="POSITIVE"){e="APPROVED";}}if(!p){p=jQuery.sap.sjax({url:u,dataType:"json"}).data||{};}return p[e]&&p[e].icon;},_getWorkflowLogStatusName:function(S){var e;switch(S){case"READY":e="WORKFLOW_TASK_CREATED";break;case"IN_PROGRESS":e="WORKFLOW_TASK_IN_PROGRESS";break;case"COMPLETED":e="WORKFLOW_TASK_COMPLETED";break;case"WORKFLOW_STARTED":e=S;break;case"FOR_RESUBMISSION":e="WORKFLOW_TASK_SUSPENDEDED";break;case"CANCELLED":e="WORKFLOW_TASK_CANCELED";break;}return e;},_getImpersonalWorkflowLogStatusName:function(S){var e;switch(S){case"READY":e="IMPERSONAL_WORKFLOW_TASK_CREATED";break;case"IN_PROGRESS":e="IMPERSONAL_WORKFLOW_TASK_IN_PROGRESS";break;case"COMPLETED":e="IMPERSONAL_WORKFLOW_TASK_COMPLETED";break;case"WORKFLOW_STARTED":e="IMPERSONAL_WORKFLOW_STARTED";break;case"FOR_RESUBMISSION":e="IMPERSONAL_WORKFLOW_TASK_SUSPENDEDED";break;case"CANCELLED":e="IMPERSONAL_WORKFLOW_TASK_CANCELED";break;}return e;},formatterWorkflowLogResultState:function(r){switch(r.toUpperCase()){case"POSITIVE":return sap.ui.core.ValueState.Success;case"NEGATIVE":return sap.ui.core.ValueState.Error;case"NEUTRAL":return sap.ui.core.ValueState.None;default:return sap.ui.core.ValueState.None;}},formatterWorkflowLogUserPicture:function(o,e){var f=this.getModel().sServiceUrl+"/UserInfoCollection(SAP__Origin='"+o+"',UniqueName='"+e+"')/$value";return cross.fnd.fiori.inbox.Conversions.formatterUserIcon.call(this,f,this);},formatterWorkflowLogStatusUsername:function(n,S){var e=cross.fnd.fiori.inbox.Conversions._getWorkflowLogStatusName(S);return cross.fnd.fiori.inbox.Conversions.formatterActionUsername.call(this,n,e,this);},formatterActionUsername:function(n,A){if(!p){p=jQuery.sap.sjax({url:u,dataType:"json"}).data||{};}if(p[A]&&p[A].showUsername){return n;}return"";},formatterZeroToNull:function(v){return(v==0?null:v);},formatterSubstitutedText:function(S){if(S){return this.getModel("i18n").getResourceBundle().getText("view.Workflow.Substituted",S);}else{return null;}},formatterDeadLineIndicator:function(e){var D=new Date();if(e&&e-D<0){return this.getModel("i18n").getProperty("view.Workflow.Overdue");}else{return null;}},formatterDeadLineIndicatorState:function(e){var D=new Date();if(e&&e-D<0){return sap.ui.core.ValueState.Error;}else{return sap.ui.core.ValueState.None;}},getEmployeeAddress:function(A){var e="";jQuery.each(A,function(k,v){if(jQuery.type(v)==="string"){v=v.trim();e=v?e+v+" ":e+v;}});return e;},formatterStatus:function(o,t){if(!o||!t){return null;}var d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();var D=d.getStatusDisplayName(o,t);if(D!=null)return D;switch(t){case"READY":return this.getModel("i18n").getProperty("view.Workflow.status.ready");case"IN_PROGRESS"||"INPROGRESS":return this.getModel("i18n").getProperty("view.Workflow.status.in_progress");case"RESERVED":return this.getModel("i18n").getProperty("view.Workflow.status.reserved");case"EXECUTED":return this.getModel("i18n").getProperty("view.Workflow.status.executed");case"FOR_RESUBMISSION":return this.getModel("i18n").getProperty("view.Workflow.status.for_resubmission");case"COMPLETED":return this.getModel("i18n").getProperty("view.Workflow.status.completed");}return t;},fnCustomAttributeFormatter:function(v){var t=this.data().Type;return cross.fnd.fiori.inbox.Conversions.fnCustomAttributeTypeFormatter.call(this,v,t);},fnCustomAttributeTypeFormatter:function(v,t){var f;if(typeof t==="string"&&t.indexOf("class java.")===0){t=cross.fnd.fiori.inbox.util.CustomAttributeComparator.fnMapBPMTypes(t);}switch(t){case'Edm.String':{f=v;break;}case'Edm.DateTime':{if(v==null||v===""){f=v;break;}else{v=cross.fnd.fiori.inbox.util.CustomAttributeComparator.fnTimeParser(v);if(isNaN(v))f="Invalid Date";else{var D=sap.ui.core.format.DateFormat.getDateInstance();f=D.format(new Date(v));}}break;}case'Edm.Boolean':{if(v=="true")f=sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("CUST_ATTR_TRUE");else if(v=="false")f=sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("CUST_ATTR_FALSE");break;}case'Edm.Int64':{var n=sap.ui.core.format.NumberFormat.getInstance();f=n.format(v);break;}case'Edm.Int32':{var n=sap.ui.core.format.NumberFormat.getInstance();f=n.format(v);break;}case'Edm.Int16':{var n=sap.ui.core.format.NumberFormat.getInstance();f=n.format(v);break;}case'Edm.Time':{if(v==null||v===""){f=v;break;}else{v=cross.fnd.fiori.inbox.util.CustomAttributeComparator.fnDurationParser(v);if(isNaN(v))f="Invalid Time";else{var T=sap.ui.core.format.DateFormat.getTimeInstance();var e=new Date();e.setUTCHours(0,0,0,v);f=T.format(e);}}break;}case'Edm.Single':{var g=sap.ui.core.format.NumberFormat.getFloatInstance();f=g.format(v);break;}case'Edm.Double':{var g=sap.ui.core.format.NumberFormat.getFloatInstance();f=g.format(v);break;}case'Edm.Decimal':{var g=sap.ui.core.format.NumberFormat.getFloatInstance();f=g.format(v);break;}default:{f=v;break;}}return f;},visibilityFormatterForObjectHeaderAndIconTabBar:function(g){if(g!=undefined)return!g;else return false;},visibilityFormatterForGenericComponentContainer:function(g){if(g!=undefined)return g;else return false;},formatterDate:function(D){if(D){var o=sap.ca.ui.model.format.DateFormat.getDateTimeInstance();var f=o.innerFormat.format(D,false);return f;}},formatterDueDate:function(D){if(D){var o=sap.ui.core.format.DateFormat.getDateTimeInstance();var f=o.format(D,false);var t=sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.dueOn",f);var e=this.getParent?this.getParent():null;if(e&&e instanceof sap.m.ObjectListItem){var F={style:"short"};if(D-(new Date())<0){o=sap.ui.core.format.DateFormat.getDateInstance(F);}else{o=sap.ui.core.format.DateFormat.getDateTimeInstance(F);}f=o.format(D,false);t=sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.dueOn",f);if(this.getText()!==t){var S=e.getList().getParent().getParent().getController();if(!S.bInitList){e.invalidate();}}}return t;}return;},formatterCreatedDate:function(D){var d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();if(D&&(d.bOutbox===undefined||d.bOutbox===false)){var o=sap.ca.ui.model.format.DateFormat.getDateTimeInstance();var f=o.innerFormat.format(D,false);return sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.createdOn",f);}return;},formatterCompletedDate:function(D,t){if(!t){return null;}var d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();if(d.bOutbox===true&&t==="COMPLETED"){if(D!==null){var o=sap.ca.ui.model.format.DateFormat.getDateTimeInstance();var f=o.innerFormat.format(D,false);return sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.completedOn",f);}}return;},formatterResumeOnText:function(D,t){if(!t){return null;}var d=sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();if(d.bOutbox===true&&t==="FOR_RESUBMISSION"){if(D!==null){var o=sap.ca.ui.model.format.DateFormat.getDateTimeInstance();var f=o.innerFormat.format(D,false);return sap.ca.scfld.md.app.Application.getImpl().getComponent().oDataManager.oi18nResourceBundle.getText("view.Workflow.resumeOn",f);}}return;},getSelectedControl:function(e){var o=e.getSource();var S=undefined;var f=e.getParameter("domRef");if(f){S=sap.ui.getCore().byId(f.id);}return S?S:o;},formatterThemeBasedBackgroundColor:function(S){if(S&&(S.toLowerCase()==="sap_belize"||S.toLowerCase()==="sap_belize_plus")){return"Solid";}else{return"Transparent";}},getRelativeMediaSrc:function(m){var u="";if(m&&typeof m==="string"){var l=document.createElement("a");l.href=m;u=(l.pathname.charAt(0)==="/")?l.pathname:"/"+l.pathname;}return u;},formatterSupportsProperty:function(t,S){return(t!=null)?t:(S!=null)?S:true;},formatterLogTaskSupportsProperty:function(l){return(l)?l:false;},formatterShowHideGenericComponent:function(e,S){if(S!=undefined&&e!=undefined)return!e;else{if(e==undefined)return false;else return e;}},formatterMailSubject:function(e,f,t){if(!e&&!f){return this.i18nBundle.getText("share.email.subject_no_priority_no_user",[t]);}if(!e){return this.i18nBundle.getText("share.email.subject_no_priority",[f,t]);}if(!f){return this.i18nBundle.getText("share.email.subject_no_user",[e,t]);}return this.i18nBundle.getText("share.email.subject",[e,f,t]);},formatterTaskSupportsValue:function(t,S){return(t!=null)?t:(S!=null)?S:false;},setDataManager:function(D){d=D;},setShellTitleToOutbox:function(o,e){o.getService("ShellUIService").then(function(S){S.setTitle(sap.ca.scfld.md.app.Application.getImpl().AppI18nModel.getResourceBundle().getText("SHELL_TITLE_OUTBOX"));},function(E){jQuery.sap.log.error("Cannot get ShellUIService",E,e);});}};}());
