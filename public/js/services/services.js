angular.module('QCService', [])

.factory('server_operations', ['$http', '$filter' ,function($http, $filter) {
    return {
        
        
        
	HistoryDataNuvola: function(StatData){

	    return $http.post('/api/HistoryDataNuvola', StatData);
	},
	GetLastEntry: function(StatData){

	    return $http.post('/api/GetLastEntry', StatData);
	},
    
	authenticate : function() {
	    return $http.get('/api/authenticate');
	},
	logout : function() {
	    return $http.get('/api/logout');
	},
	check : function(PCB_id, test_flag) {
	    return $http.post('/api/check', {"pcb_id": PCB_id, "test_flag": test_flag});
	},
	checkResFoil: function(res_foil_id) {
	    return $http.post('/api/checkResFoil', {"foil_id": res_foil_id});
	},
	checkLog: function(id, object) {
	    return $http.post('/api/checkLog', {"id": id, "object": object});
	},
	parent: function(id_board, mtf_board, id_foil, mtf_foil, userCN) {
	    return $http.post('/api/parent', {"board_id": id_board, "board_mtf": mtf_board, "foil_id": id_foil, "foil_mtf": mtf_foil, "userCN": userCN});
	},
	get : function() {
	    return $http.get('/api/entries');
	},
	create : function(formData) {
	    return $http.post('/api/create', formData);
	},
	save_logistic : function(formData) {
	    return $http.post('/api/save_tmp_logistic', formData);
	},
	AddLogDecision : function(id_board, mtf_board, id_foil, mtf_foil, userCN, grandtotalok) {
            return $http.post('/api/AddLogDecision', {"board_id": id_board, "board_mtf": mtf_board, "foil_id": id_foil, "foil_mtf": mtf_foil, "userCN": userCN, "grandtotalok": grandtotalok});
        },

	getPdf : function(formData) {
	    return $http.post('/api/getPdf', formData);
	},
	
	getROOT : function(formData) {
	    return $http.post('/api/getROOT', formData);
	},
	
	getPictureAnalyzed : function(formData) {
	    return $http.post('/api/getPictureAnalyzed', formData);
	},

	analyze_connector_picture : function(filename) {
	    return $http.post('/api/analyze_connector_picture', filename);
	},
        analyze_res_file : function(file) {
        return $http.post('/api/analyze_res_file', file)
        },
	save_toplight_inspection : function(formData) {
	    return $http.post('/api/save_toplight_inspection', formData);
	},

        save_visual_error_inspection : function(formData) {
            return $http.post('/api/save_visual_error_inspection', formData);
        },

	save_backlight_inspection : function(formData) {
	    return $http.post('/api/save_backlight_inspection', formData);
	},
	save_dimensions : function(formData) {
	    return $http.post('/api/save_tmp_dimensions', formData);
	},
	save_pillars : function(formData) {
	    return $http.post('/api/save_tmp_pillars', formData);
	},
	save_HV : function(formData) {
	    return $http.post('/api/save_tmp_HV', formData);
	},
	save_Resistive_Check : function(formData) {
	    return $http.post('/api/save_tmp_Resistive_Check', formData);
	},
	save_capacitance : function(formData) {
	    return $http.post('/api/save_tmp_Capacitance_Check', formData);
	},

	StaticsTableCheck: function(StatData){

	    return $http.post('/api/StaticsTableCheck', StatData);
	},
	StaticsHistoryCheck: function(StatData){

	    return $http.post('/api/StaticsHistoryCheck', StatData);
	}
    }
}])
.service('sharedProperties', function () {
    var username="";
    var cname="";
    //var user ={};
    var pcb_identifier = "";
    var sector = '';
    var section = '';
    var filesComment = [];
    var filesCommentN = 0;
    var visualAffections = [];
    var visualAffectionsN = 0;
    var visualAffectionsBadN = 0;
    var visualAffectionsMediumN = 0;
    var pillarsAffectionsN = 0;
    var pillarsAffectionsBadN = 0;
    var pillarsAffectionsMediumN = 0;
    var temp_filename= '';
    var temp_comment= "";
    var is_report=false;
    var is_report_bad=false;
    var is_connector=false;

    return {
	getUsername: function() {
	    return username;
	},
	setUsername: function(data) {
	    username=data;
	},
	getCommonName: function() {
	    return cname;
	},
	setCommonName: function(data) {
	    cname=data;
	},
	isReport: function () {		//we need this two function to discern the upload of the PDF report from the images (in order to enable image filters)
	    return is_report;
	},
	setReport: function (state) {
	    is_report=state;
	},
	isReportBad: function () {  //flag to identify the non-conformity report is being uploaded
	    return is_report_bad;
	},
	setReportBad: function (state) {
	    is_report_bad=state;
	},
	isConnector: function () {		//we need this two function to discern the upload of the connector picture
	    return is_connector;
	},
	setConnector: function (state) {
	    is_connector=state;
	},
        isResistive: function () {              //we need this two function to discern the upload of the resistive file
            return is_resistive;
        },
        setResistive: function (state) {
            is_resistive=state;
        },
	getVisualAffections: function (){
	    return visualAffections;
	},
	getVisualAffectionsN: function (){
	    return visualAffectionsN;
	},
	getVisualAffectionsBadN: function (){
	    return visualAffectionsBadN;
	},
	getVisualAffectionsMediumN: function (){
	    return visualAffectionsMediumN;
	},
	getPillarsAffectionsN: function (){
	    return pillarsAffectionsN;
	},
	getPillarsAffectionsBadN: function (){
	    return pillarsAffectionsBadN;
	},
	getPillarsAffectionsMediumN: function (){
	    return pillarsAffectionsMediumN;
	},
	addVisualAffection: function (sector, type, severity, comment) {
	   visualAffections.push({
		Sector: sector,
		Type: type,
		Severity: severity,	
		Comment: comment
	    });
		console.log("Increasing VISUAL")
	    if (type.indexOf('pillar')<0) {
		visualAffectionsN+=1;
		if (severity==1) {
		    visualAffectionsBadN+=1;
		} else if (severity==2) {
		    visualAffectionsMediumN+=1;
		}
	    } else {
		pillarsAffectionsN+=1;
		if (severity==1) {
		    pillarsAffectionsBadN+=1;
		} else if (severity==2) {
		    pillarsAffectionsMediumN+=1;
		}
	    }
console.log(visualAffections)
	},

	removeAllVisualAffection: function(){
            visualAffections=[];

	},

	removeVisualAffection: function (sector, type) {
	    visualAffections.forEach( function (item, index, object){
		console.log(sector)
		console.log(type)
		console.log (visualAffectionsN);
		if (item.Sector==sector){
		    {
			if (item.Type==type){
			console.log("adilvndfilvdlfi")
			    object.splice(index,1);
			    if (type.indexOf('pillar')<0) {
				visualAffectionsN-=1;
				console.log(visualAffectionsN);
				if (item.Severity==1){
				    visualAffectionsBadN-=1;
				} else if(item.Severity==2){
				    visualAffectionsMediumN-=1;
				}
			    } else {
				pillarsAffectionsN-=1;
				if (item.Severity==1){
				    pillarsAffectionsBadN-=1;
				} else if(item.Severity==2){
				    pillarsAffectionsMediumN-=1;
				}
			    }
			}
		    }
		}
	    });
	},
	getTmpFilename: function () {
	    return temp_filename;
	},
	setTmpFilename: function(value) {
	    temp_filename = value;
	},
	getTmpComment: function () {
	    return temp_Comment;
	},
	setTmpComment: function(value) {
	    temp_Comment = value;
	},
	getPcbId: function () {
	    return pcb_identifier;
	},
	setPcbId: function(value) {
	    pcb_identifier = value;
	},
	getSector: function () {
	    return sector;
	},
	setSector: function(value) {
	    sector = value;
	},
	setSection: function(value) {
	    section = value;
	},
	getSection: function () {
	    return section;
	},
	addFileComment: function (filename, comment, sector) {
	    //some files needs to be unique (connector picture, anufacturer report, non conformity report), so if we are adding another one of those, we have to delete the eventually already present one
	    if (filename.indexOf("connectorPicture")>-1 ) {
		for (item in filesComment) {
		    if (filesComment.hasOwnProperty(item)) {
			if (filesComment[item]["Filename"].indexOf("connectorPicture")>-1) {
			    //console.log("removing " + filesComment[item]["Filename"] + " for his substitution: " + filename);
			    filesComment.splice(item, 1);
			}
		    }
		};
            } else if (filename.indexOf("resistiveFile")>-1){
                for (item in filesComment) {
                    if (filesComment.hasOwnProperty(item)) {
                        if (filesComment[item]["Filename"].indexOf("resistiveFile")>-1) {
                            filesComment.splice(item, 1);
                        }
                    }
                };
	    } else if (filename.indexOf("manufReport")>-1){
		for (item in filesComment) {
		    if (filesComment.hasOwnProperty(item)) {
			if (filesComment[item]["Filename"].indexOf("manufReport")>-1) {
			    //console.log("removing " + filesComment[item]["Filename"] + " for his substitution: " + filename);
			    filesComment.splice(item, 1);
			}
		    }
		};
	    } else if (filename.indexOf("nonConformityReport")>-1){
		for (item in filesComment) {
		    if (filesComment.hasOwnProperty(item)) {
			if (filesComment[item]["Filename"].indexOf("nonConformityReport")>-1) {
			    //console.log("removing " + filesComment[item]["Filename"] + " for his substitution: " + filename);
			    filesComment.splice(item, 1);
			}
		    }
		};
	    }
	    filesComment.push({
		Filename: filename,
		Comment: comment,
		Sector: sector
	    });
	    if (filename.indexOf('general_visual')>0) {
		filesCommentN += 1;
		//console.log("added visual blobs: " + filesCommentN);
		return;
	    }
	},
	printFileComment: function (filename, comment) {
	    return filesComment;
	},
	removeFileComment: function (filename) {
	    filesComment.forEach( function (item, index, object){
		if (item.Filename==filename) {
		    filesCommentN -= 1;
		    filesComment.splice(index, 1);
		};
	    });
	},
	getVisualAffectionsBlobN: function (){
	    return filesCommentN;
	},
	deleteAll:function () {
	    filesComment=[];
	    //visualAffections=[];
	    visualAffections.splice(0,visualAffections.length);
	    pillarsAffectionsN=0;
	    visualAffectionsN=0;
	    filesCommentN=0;
	    sector = '';

	    pcb_identifier = "";
	    section = '';
	    //visualAffections = [];
	    visualAffectionsN = 0;
	    pillarsAffectionsN = 0;
	    temp_filename= '';
	    temp_comment= "";
	    is_report=false;
	}
    };
});
