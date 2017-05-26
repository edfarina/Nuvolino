angular.module('QCController', [])

// inject the server_operations service factory into our controller
.controller('mainController', ['$scope','$http','server_operations', '$log', '$window', '$rootScope',  'sharedProperties', '$filter', '$cookies', function($scope, $http, server_operations, $log, $window, $rootScope,  sharedProperties, $filter, $cookies ) {

    $scope.true_state=true;
    $scope.formData = {}; //this is the object wich will contain all the informations wich will go in the DB
    $rootScope.PrintData = {};
	$rootScope.AlreadyDefinitiveTable=false;

    var board_types=[
	{"type": "LE1", "holes_left": 4, "holes_right": 4, "holes_top": 0, "holes_bottom": 5, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0},
	{"type": "LE2", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "LE3", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "LE4", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 3},
	{"type": "LE5", "holes_left": 4, "holes_right": 4, "holes_top": 17, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 1},
	{"type": "LE6", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0}, ///added "holes_bottom": 0
	{"type": "LE7", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 4},
	{"type": "LE8", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 2}, //added "holes_top": 0
	{"type": "SE1", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0}, //added "holes_bottom": 0
	{"type": "SE2", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "SE3", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "SE4", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "SE5", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 1}, //added "holes_top": 0
	{"type": "SE6", "holes_left": 0, "holes_right": 0, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0}, //added "holes_bottom": 0
	{"type": "SE7", "holes_left": 0, "holes_right": 0, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 0},
	{"type": "SE8", "holes_left": 0, "holes_right": 0, "holes_top": 0, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 0}, //added "holes_top": 0
	{"type": "LS1", "holes_left": 4, "holes_right": 4, "holes_top": 0, "holes_bottom": 5, "edge_top": 1, "edge_bottom": 0, "inter_holes": 1},
	{"type": "LS2", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "LS3", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 3},
	{"type": "LS4", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 1},
	{"type": "LS5", "holes_left": 4, "holes_right": 4, "holes_top": 17, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 0},
	{"type": "LS6", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0}, //added "holes_bottom": 0
	{"type": "LS7", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 4},
	{"type": "LS8", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 2}, //added "holes_top": 0
	{"type": "SS1", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0}, //added "holes_bottom": 0
	{"type": "SS2", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 0},
	{"type": "SS3", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 0},
	{"type": "SS4", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 0},
	{"type": "SS5", "holes_left": 5, "holes_right": 5, "holes_top": 0, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 0}, //added "holes_top": 0
	{"type": "SS6", "holes_left": 0, "holes_right": 0, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 0, "inter_holes": 0}, //added "holes_bottom": 0
	{"type": "SS7", "holes_left": 0, "holes_right": 0, "holes_top": 0, "holes_bottom": 0, "edge_top": 1, "edge_bottom": 1, "inter_holes": 0},
	{"type": "SS8", "holes_left": 0, "holes_right": 0, "holes_top": 0, "holes_bottom": 0, "edge_top": 0, "edge_bottom": 1, "inter_holes": 0}]; //added "holes_top": 0

    $scope.hasEdgeTop=null;
    $scope.hasEdgeBottom=null;
    $scope.formData.TEST_BOARD=false;
   // $rootScope.backgroundImage="/pics_board/LS1_pic.png";
    check_board_type= function (pcb_id) {
	pcb_id_f3=pcb_id.toUpperCase().charAt(0)+pcb_id.toUpperCase().charAt(1)+pcb_id.toUpperCase().charAt(2);
	board_found=false
	for (board of board_types) {
	    //if (pcb_id.toUpperCase().indexOf(board["type"])>-1) 
	    if (pcb_id_f3==board["type"]) {
		board_found=true;
		$rootScope.backgroundImage="/pics_board/" + pcb_id_f3 +"_pic.png";
		if (board["edge_top"]==0) {
		    $scope.hasEdgeTop=false;
		    $rootScope.totalBacklightSet("formData.EDGELEFTUP", 0);
		    $rootScope.totalBacklightSet("formData.EDGERIGHTUP", 0);
		} else {
		    $scope.hasEdgeTop=true;
		    $rootScope.totalBacklightSet("formData.EDGELEFTUP", null);
		    $rootScope.totalBacklightSet("formData.EDGERIGHTUP", null);
		}
		if (board["edge_bottom"]==0) {
		    $scope.hasEdgeBottom=false;
		    $rootScope.totalBacklightSet("formData.EDGELEFTDOWN", 0);
		    $rootScope.totalBacklightSet("formData.EDGERIGHTDOWN", 0);
		} else {
		    $scope.hasEdgeBottom=true;
		    $rootScope.totalBacklightSet("formData.EDGELEFTDOWN", null);
		    $rootScope.totalBacklightSet("formData.EDGERIGHTDOWN", null);
		}
		$scope.holesLeft=board["holes_left"];
		$scope.holesRight=board["holes_right"];
		$scope.holesTop=board["holes_top"];
		$scope.holesBottom=board["holes_bottom"];
		if (board["inter_holes"]==0) {
		    $scope.interHoles=false;
		    $scope.holesInterInvalid=false;
		    $rootScope.resumeBacklight["holesInter"]=0;
		} else {
		    $scope.interHoles=board["inter_holes"];
		    $scope.holesInterInvalid=true;
		    $rootScope.resumeBacklight["holesInter"]=null;
		}
		if (board["holes_left"]+board["holes_right"]+board["holes_top"]+board["holes_bottom"]==0) {
		    $scope.holesmech=false;
		    $scope.holesmechInvalid=false;
		    $rootScope.resumeBacklight["holes"]=0;
		    $rootScope.resumeBacklight["holes2"]=0
		} else {
		    $scope.holesmech=true;
		    $scope.holesmechInvalid=true;
		    $rootScope.resumeBacklight["holes"]=null;
		    $rootScope.resumeBacklight["holes"]=0
		}
	    }


	}
	if (!board_found) {
	    $rootScope.$emit("CallAlert", ["danger", "Board beginning with ID " + pcb_id_f3 + " is not foreseen!" ]);
	}
	if (pcb_id.toUpperCase().indexOf("TEST")>-1) {
	    $scope.formData.TEST_BOARD=true;
	} else {
	    $scope.formData.TEST_BOARD=false;
	}

	//ELTOS if ID is one of [SE1, SS1, SE2, SS2, SE3, SS3, SE4, SS4, SE5, SS5, SS6, SS7, SS8]
	//ELVIA if ID is one of [L*, SE6, SE7, SE8]
	if ((pcb_id.charAt(0).toUpperCase() =="L") 
	    || ((pcb_id.charAt(1).toUpperCase() =="E") && (pcb_id.charAt(2)==6 || pcb_id.charAt(2)==7 || pcb_id.charAt(2)==8))
	    ) {
		//$scope.setManufChoice("ELVIA");
	    } else {
		//$scope.setManufChoice("ELTOS");
	    }
    };

    $scope.formatDate = function (date) {
	if (date!=null) {
var month = date.getUTCMonth() + 1;
	    newdate=date.getDate() + "-" + month + "-" +date.getFullYear();

		return newdate;
	} else {
	    return null;
	}
    }

	$scope.getMonthFromString= function(mon){
   	return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
	}
    
    //first thing: authenticate the user
    var auth = function () {
	server_operations.authenticate()
	    .success(function(data) {
		sharedProperties.setUsername(data.Username);
		sharedProperties.setCommonName(data.CommonName);
		$scope.formData.USER = sharedProperties.getUsername();
		$scope.USER_CNAME = sharedProperties.getCommonName();
	    });
    };

    auth();


    $scope.logout = function() {

	//document.cookie = "server-fill-form=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=\/;domain=test-pcb-qc.cern.ch;"
	server_operations.logout()
	    .success(function() {
		$window.close();
		$window.location.href= 'https://login.cern.ch/adfs/ls/?wa=wsignout1.0';
	    });
    };

    $scope.OpenStatistics = function() {
	
	window.open("https://aiatlas055.cern.ch:8443/statistics.html");

    };

    $scope.saving_spin=false;
    $scope.final_spin=false;

    $scope.logistic_save_info=false;
    $scope.formData.CHECK_DATE_LOGISTIC=null;

    $scope.visual_save_info=false;
    $scope.formData.CHECK_DATE_VISUAL=null;

    $scope.backlight_save_info=false;
    $scope.formData.CHECK_DATE_BACKLIGHT=null;

    $scope.dimensions_save_info=false;
    $scope.formData.CHECK_DATE_DIMENSIONS=null;

    $scope.pillars_save_info=false;
    $scope.formData.CHECK_DATE_PILLARS=null;
	 
    $scope.capacitance_save_info=false;
    $scope.formData.CHECK_DATE_CAPACITANCE=null;

    $scope.HV_save_info=false;
    $scope.formData.CHECK_DATE_HV=null;


    $scope.Resistive_Check_save_info=false;
    $scope.formData.CHECK_DATE_RESISTIVE_CHECK=null;

    $scope.final_save_info=false;

    $rootScope.VisAffNumber=sharedProperties.getVisualAffectionsN();
    $rootScope.PillAffNumber=sharedProperties.getPillarsAffectionsN();

    $rootScope.VisAffBlobNumber=sharedProperties.getVisualAffectionsBlobN();
    //$rootScope.PillAffBlobNumber=sharedProperties.getPillarsAffectionsBlobN();

    $scope.totalVisualCollapsed=true;
    $scope.totalBacklightCollapsed=true;
    $scope.totalDimensionCollapsed=true;
    $scope.totalPillarsCollapsed=true;
    $scope.totalHVCollapsed=true;

    $scope.EdgesAccCommentIsCollapsed=true;

    initializeForm = function(){
	//$window.location.reload(true);
	sharedProperties.removeAllVisualAffection();
	$rootScope.manufReportLoaded=false;
	$scope.formData = {};
	$scope.boardLog=false;
	$scope.boardLogDetails=false;
	$scope.moreLogisticBoard=[];
	$scope.foilLog=false;
	$scope.foilLogDetails=false;
	$scope.moreLogisticFoil=[];
	$scope.parentingLog=false;
	$scope.moreLogisticParenting=[];
	$scope.parentingLogDetails=false;
	sharedProperties.deleteAll();
	$rootScope.VisAffNumber=sharedProperties.getVisualAffectionsN();
	$rootScope.PillAffNumber=sharedProperties.getPillarsAffectionsN();

	$rootScope.VisAffBlobNumber=sharedProperties.getVisualAffectionsBlobN();
	//$rootScope.PillAffBlobNumber=sharedProperties.getPillarsAffectionsBlobN();
	$scope.ID_invalid=true;
	$scope.formData.TEST_BOARD=false;

	$rootScope.resumeLogistic={
	    "board": null,
	    "foil": null
	};

	$scope.formData.USER = sharedProperties.getUsername();
	$scope.logistic_save_info=false;
	$scope.update_message="";
	$scope.update_message_flashing=false;
	$scope.formData.SUPPLIER=null;
        //$rootScope.PrintData.SUPPLIER=null;

	$scope.formData.MANUFREPORTOK=null;
	$scope.manufButtons= "btn btn-primary";
	$scope.manufReportCommentIsCollapsed = true;
	$scope.manufChoice="choose"
	$scope.manufButtons2= "btn btn-primary";
    $rootScope.PrintData.manufButtons2= "btn btn-primary";
	
	$scope.manufReportUploadIsCollapsed = true;
	$scope.formData.MANUFREPORT_COMMENT=null;

	// $rootScope.PrintData.DELIVERYDATE=processDate($scope.DELIVERYDATE_unf);
	$scope.formData.DELIVERYDATE=processDate($scope.DELIVERYDATE_unf);
	
	$scope.visual_save_info=false;
	$scope.formData.KAPTONCUTOK=null;
	$scope.kaptonCutButtons= "btn btn-primary";
	$rootScope.PrintData.kaptonCutButtons = "Null";
	
	$scope.formData.KAPTONGLUEDOK=null;
	$scope.kaptonGluedButtons= "btn btn-primary";
	$rootScope.PrintData.kaptonGluedButtons = "Null";

        $scope.formData.COVERLAYBUBBLESOK=null;
        $scope.coverlayBubblesButtons= "btn btn-primary";
        $rootScope.PrintData.coverlayBubblesButtons = "Null";
	
	$rootScope.showConnectorWidths=false;
	$rootScope.processedImage=null;
	$scope.connectorRatio_style={};
	$rootScope.connectorWidthsData={
                "filename": "",
                "copper_width": {"mean": 0, "sigma": 0},
                "gaps_width": {"mean": 0, "sigma": 0}
                }

        $rootScope.showResMes=false;
        $rootScope.resMesureData={
                "filename": "",
                "res_values": {"minb": 0, "maxb": 0, "rmsb": 0, "meanb": 0, "mina": 0, "maxa": 0, "rmsa": 0, "meana": 0, "rmsr": 0, "meanr": 0}
                }

	$scope.formData.TOTALVISUALOK=null;
	$scope.totalVisualCollapsed=true;
	$scope.formData.TOTALVISUAL_COMMENT=null;
	$rootScope.totalToplightStatus="null";
	$rootScope.resumeToplight={  "kaptonCut": null,
	    "affections": 0,
	    "kaptonGlued": null,
	    "connector": null,
	    "connectorRatio": null
	};

	$scope.formData.ALIGN_RIGHT_S_invalid=true;
	$scope.formData.ALIGN_RIGHT_S_style={};
	$scope.formData.ALIGN_RIGHT_L_invalid=true;
	$scope.formData.ALIGN_RIGHT_L_style={};
	$scope.formData.ALIGN_LEFT_S_invalid=true;
	$scope.formData.ALIGN_LEFT_S_style={};
	$scope.formData.ALIGN_LEFT_L_invalid=true;
	$scope.formData.ALIGN_LEFT_L_style={};
	$scope.DBTransitions_style={};
	$scope.DBTransitionsInvalid=true;
	$scope.hasEdgeTop=null;
	$scope.hasEdgeBottom=null;
	$scope.formData.EDGESOK=null;
	$scope.edgesInvalid=true;
	$scope.edgesCleanButtons= "btn btn-primary";
	$rootScope.PrintData.edgesCleanButtons= "Null";
	$scope.formData.EDGERIGHTUP_invalid=true;
	$scope.formData.EDGERIGHTUP_style={};
	$scope.formData.EDGERIGHTDOWN_invalid=true;
	$scope.formData.EDGERIGHTDOWN_style={};
	$scope.formData.EDGELEFTUP_invalid=true;
	$scope.formData.EDGELEFTUP_style={};
	$scope.formData.EDGELEFTDOWN_invalid=true;
	$scope.formData.EDGELEFTDOWN_style={};
	$scope.formData.EDGESACC=null;
	$scope.edgesAccInvalid=true;
	$scope.edgesAccuratelyButtons= "btn btn-primary";
    $rootScope.PrintData.edgesAccuratelyButtons= "Null";
	
	$scope.EdgesAccCommentIsCollapsed=true;
	$scope.formData.EDGESACC_COMMENT=null;
	$scope.formData.HOLESOK=null;
	$scope.holesLeft=0;
	$scope.holesRight=0;
	$scope.holesTop=0;
	$scope.holesBottom=0;
	$scope.interHoles=false;
	$scope.holesButtons= "btn btn-primary";
	$rootScope.PrintData.holesButtons= "Null";

	$scope.showHoles2=false;
	$scope.formData.HOLES2OK=null;
	$scope.holes2Buttons= "btn btn-primary";
	$scope.holes2Invalid=false;
	$scope.formData.HOLESINTEROK=null;
	$scope.holesInterButtons= "btn btn-primary";
	$scope.totalBacklightButtons= "btn btn-primary";
	$scope.totalBacklightCollapsed=true;
	$scope.formData.TOTALBACKLIGHTOK=null;
	$rootScope.totalBacklightStatus="null";
	$rootScope.resumeBacklight={
	    "formData.EDGELEFTUP": null,
	    "formData.EDGELEFTDOWN": null,
	    "formData.EDGERIGHTUP": null,
	    "formData.EDGERIGHTDOWN": null,
	    "dbtransitions": null,
	    "formData.ALIGN_LEFT_S": null,
	    "formData.ALIGN_LEFT_L": null,
	    "formData.ALIGN_RIGHT_S": null,
	    "formData.ALIGN_RIGHT_L": null,
	    "edges": null,
	    "edgesAccurately": null,
	    "holes": null,
	    "holes2": null,
	    //"holes2": 1,
	    "holesInter": null
	};

        $scope.formData.RM_FILE_CONTENT=null;
	$scope.RMFileShown=false;
	$scope.formData.RASMASKOK=null;
	$scope.formData.RASMASK2OK=null;
	$scope.rasmaskButtons= "btn btn-primary";
	$rootScope.PrintData.rasmaskButtons= "Null";

	$scope.showRasmask2=false;
	$scope.rasmask2Buttons= "btn btn-primary";
	$scope.formData.TOTALDIMENSIONSOK=null;
	$scope.totalDimensionsButtons= "btn btn-primary";
	$scope.dimensions_save_info=false;
	$scope.totalDimensionCollapsed=true;
	$scope.formData.TOTALDIMENSION_COMMENT=null;
	$rootScope.totalDimensionsStatus="null";
	$rootScope.resumeDimensions={
	    "rasmask": null,
	    "rasmask2": 0
	};

	$scope.pillars_save_info=false;
	$scope.formData.TAPETESTOK=null;
	$scope.tapeTestButtons= "btn btn-primary";
	$rootScope.PrintData.tapeTestButtons= "Null";
	$scope.formData.PILLHEIGHT=null;
	$scope.formData.PILLHEIGHTRMS=null;
	$scope.formData.DELTA_LR=null;
	$scope.formData.DELTA_BT=null;
       /* $scope.formData.FWarnings=NaN;
        $scope.formData.FWarning1=NaN;
        $scope.formData.FWarning2=NaN;
        $scope.formData.FWarning3=NaN;*/
	$scope.formData.Warnings = [];
        $scope.formData.PILL_FILE_CONTENT=null;
	$scope.formData.PILLSHIFTOK=null;
	$scope.pillShiftButtons= "btn btn-primary btn-sm";
	$rootScope.PrintData.pillShiftButtons= "Null";
	$scope.formData.TOTALPILLARSOK=null;
	$scope.totalPillarsCollapsed=true;
	$scope.formData.TOTALPILLARS_COMMENT=null;
	$rootScope.totalPillarsStatus="null";
	$rootScope.resumePillars={
	    "tapeTest" : null,
	    "affections": 0,
	    "pillHeight": null,
	    "pillHeightRMS": null,
	    "pillShift": null
	};
	
	
	$scope.capacitance_save_info=false;
	$scope.formData.TAPETESTOK=null;
	$scope.tapeTestButtons= "btn btn-primary";
	$rootScope.PrintData.tapeTestButtons= "Null";
	$scope.formData.CAPACITANCE_MEAN=NaN;

        $scope.formData.CAPACITANCE_FILE_CONTENT=null;
	$scope.formData.TOTALCAPACITANCEOK=null;
	$scope.totalCapacitanceCollapsed=true;
	$scope.formData.TOTALCAPACITANCE_COMMENT=null;
	$rootScope.totalCapacitanceStatus="null";
	$rootScope.resumeCapacitance={
            "mean" : null



	};
	
	
	$scope.formData.SILVLINEOK=null;
	$scope.silvLineButtons= "btn btn-primary";
	$rootScope.PrintData.silvLineButtons= "Null";

	$scope.formData.SILVLINEINSLEFTOK=null;
	$scope.silvLineInsLeftButtons= "btn btn-primary";
	$rootScope.PrintData.silvLineInsLeftButtons= "Null";

	$scope.formData.SILVLINEINSRIGHTOK=null;
	$scope.silvLineInsRightButtons= "btn btn-primary";
	$rootScope.PrintData.silvLineInsRightButtons= "Null";
	$scope.formData.RESSTRIPLAYERLEFTUPOK=null;
	$scope.resStripLayerLeftUpButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerLeftUpButtons= "Null";
	$scope.formData.RESSTRIPLAYERLEFTDOWNOK=null;
	$scope.resStripLayerLeftDownButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerLeftDownButtons= "Null";
	$scope.formData.RESSTRIPLAYERRIGHTUPOK=null;
	$scope.resStripLayerRightUpButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerRightUpButtons= "Null";
	$scope.formData.RESSTRIPLAYERRIGHTDOWNOK=null;
	$scope.resStripLayerRightDownButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerRightDownButtons= "Null";
	$scope.formData.TOTALHVOK=null;
	$scope.HV_save_info=false;
	$scope.totalHVCollapsed=true;
	$scope.formData.TOTALHV_COMMENT=null;
	$rootScope.totalHVStatus="null";
	$rootScope.resumeHV={
	    "silvLine": null,
	    "silvLineInsLeft": null,
	    "silvLineInsRight": null,
	    "resStripLayerLeftUp": null,
	    "resStripLayerLeftDown": null,
	    "resStripLayerRightUp": null,
	    "resStripLayerRightDown": null,
	    "formData.RESLEFTMAX": null,
	    "formData.RESLEFTMIN": null,
	    "formData.RESRIGHTMAX": null,
	    "formData.RESRIGHTMIN": null
	};



	$scope.formData.TOTALRESISTIVE_CHECKOK=null;
	$scope.Reistive_check_save_info=false;
	$scope.formData.TOTALRESISTIVEOK=null;
	$scope.totalResistive_CheckCollapsed=true;
	$scope.formData.TOTALRESISTIVE_COMMENT=null;
	$rootScope.totalResistive_CheckStatus="null";
	$rootScope.resumeResistive_Check={


       //  "minb" : null,
       //  "maxb" : null,
         "rmsb" : null,
         "meanb" : null,
       //  "mina" : null,
       //  "maxa" : null,
         "rmsa" : null,
         "meana" : null,
         "rmsr" : null,
         "meanr" : null,
	};


	$rootScope.resumeTotals={
	    "visual": null,
	    "backlight": null,
	    "dimensions": null,
	    "pillars": null,
	    "HV": null
	};
	$scope.formData.GRANDTOTALOK=null;
	$rootScope.grandTotalButtons= "btn btn-primary";

	$scope.formData.all_files_and_comment=sharedProperties.printFileComment(); //here will go every information about photos and comments 
	$scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
    $rootScope.PrintData.all_visual_affections=sharedProperties.getVisualAffections();
	$rootScope.VisualAddedCommentDisabled = true;
    }

    processDate = function(dt) {
	return $filter('date')(dt, 'dd-MM-yyyy');
    }

    /*
    //MANUFACTURER SELECION
    $scope.manufChoice="choose"
    $scope.status = {
	manufact_isopen: false
    };
    $scope.toggleDropdown = function($event) {
	$event.preventDefault();
	$event.stopPropagation();
	$scope.status.manufact_isopen = !$scope.status.manufact_isopen;
    };
    $scope.manufChoiceInvalid=true;
    $scope.formData.SUPPLIER=null;
    $scope.setManufChoice = function (choice) {
	if (choice=="ELTOS"){
	    $scope.formData.SUPPLIER='ELTOS';
	    $scope.manufChoice="ELTOS"
	    $scope.manufChoiceInvalid=false;
	} else if (choice=="ELVIA"){ 
	    $scope.formData.SUPPLIER='ELVIA';
	    $scope.manufChoiceInvalid=false;
	    $scope.manufChoice="ELVIA"
	} else if (choice=="none"){
	    $scope.formData.SUPPLIER=null;
            $scope.manufChoiceiInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.manufChoice="choose"
        }
    };
    */

    $scope.toggleBoardLog = function(){
	$scope.boardLog = !$scope.boardLog;
    };

    $scope.toggleFoilLog = function(){
	$scope.foilLog = !$scope.foilLog;
    };

    $scope.toggleParentingLog = function(){
	$scope.parentingLog = !$scope.parentingLog;
    };

    //supplier report
    $scope.manufReportCommentIsCollapsed = true;
    $scope.manufReportUploadIsCollapsed = true;
    $scope.manufButtons= "btn btn-primary";
    $scope.formData.MANUFREPORTOK=null;
    $scope.manufReportInvalid=true;
    $rootScope.PrintData.manufButtons= "No";
	
    $scope.toggleManufButtonsYes = function(){
	if ($scope.formData.MANUFREPORTOK==0){
	    $scope.formData.MANUFREPORTOK=null;
	    $scope.manufReportInvalid=true;
            $scope.grandTotalInvalid=true;
	    $scope.manufReportCommentIsCollapsed = true;
	    $scope.manufReportUploadIsCollapsed = true;
	    $scope.manufButtons= "btn btn-primary";
	    $rootScope.PrintData.manufButtons= "No";
		
	} else {
	    $scope.manufReportInvalid=false;
	    $scope.formData.MANUFREPORTOK=0;
	    $scope.manufReportCommentIsCollapsed = true;
	    $scope.manufReportUploadIsCollapsed = false;
	    $scope.manufButtons = "btn btn-success";
	    $rootScope.PrintData.manufButtons= "Yes";
		
	}
    };
    $scope.toggleManufButtonsNo = function(){
	    $scope.manufReportInvalid=false;
	    $scope.formData.MANUFREPORTOK=1;
	    $scope.manufReportCommentIsCollapsed = false;
	    $scope.manufReportUploadIsCollapsed = true;
	    $scope.manufButtons = "btn btn-danger";
	    $rootScope.PrintData.manufButtons= "No";
		
    };


    $scope.manufButtons2= "btn btn-primary";
    $rootScope.PrintData.manufButtons2= "No";

    $scope.manufReportBadUploadIsCollapsed=true;
    $scope.formData.MANUFREPORTBAD=null;
    $scope.manufReport2Invalid=true;
    $scope.toggleManufButtons2Yes = function(){
	if ($scope.formData.MANUFREPORTBAD==1){
	    $scope.formData.MANUFREPORTBAD=null;
	    $scope.manufReportBadUploadIsCollapsed=true;
	    $scope.manufReport2Invalid=true;
	    $scope.manufButtons2= "btn btn-primary";
	    $rootScope.PrintData.manufButtons2= "Yes";
		
	} else {
	    $scope.manufReport2Invalid=false;
	    $scope.formData.MANUFREPORTBAD=1;

	    $scope.manufReportBadUploadIsCollapsed=false;
	    $scope.manufButtons2 = "btn btn-warning";
	    $rootScope.PrintData.manufButtons2= "Yes";
		
	}
    };
    $scope.toggleManufButtons2No = function(){
	    $scope.manufReport2Invalid=false;
	    $scope.formData.MANUFREPORTBAD=0;
	    $scope.manufReportBadUploadIsCollapsed=true;
	    $scope.manufButtons2 = "btn btn-success";
	    $rootScope.PrintData.manufButtons2= "No";
		
    };


    ///DATES SELECTION
    $scope.maxDate = new Date('2025/5/22');
    $scope.minDate = new Date('2015/5/22');
    $scope.open_delivery_date = function() {
	$scope.delivery_date_popup.opened = true;
    };
    $scope.open_manufacturing_date = function() {
	$scope.manufacturing_date_popup.opened = true;
    };
    $scope.setDate = function(year, month, day) {
	$scope.formData.MANUFACTURINGDATE = new Date(year, month, day);
        // $rootScope.PrintData.MANUFACTURINGDATE = new Date(year, month, day);

    };
    $scope.dateOptions = {
	formatYear: 'yy',
	startingDay: 1,
    };
    $scope.date_format = 'dd/MMM/yyyy';
    $scope.delivery_date_popup = {
	opened: false
    };
    $scope.manufacturing_date_popup = {
	opened: false
    };


    //Save of the logistic section
    $scope.saveLogistic=function(){
	$scope.saving_spin=true;
	if ($scope.formData.MANUFREPORT_COMMENT){
	$scope.formData.MANUFREPORT_COMMENT = $scope.formData.MANUFREPORT_COMMENT.replace(/(?:\r\n|\r|\n)/g, '; \t');
	}
	$scope.formData.CHECK_DATE_LOGISTIC=new Date();
	server_operations.save_logistic($scope.formData)
	// if successful creation, call our get function to get all the new entries
	.success(function(data) {
	    $scope.logistic_save_info=true;
	    $scope.formData.CHECKER_LOGISTIC= $scope.formData.USER;
	    $scope.saving_spin=false;
	    
            // $rootScope.PrintData.PARTSBATCHMTFID=$scope.formData.PARTSBATCHMTFID;
	    // $rootScope.PrintData.SUPPLIER = $scope.formData.SUPPLIER;

            $rootScope.$emit("CallAlert", ["success", "Logistic information successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});

    };


    //VISUAL ERRORS 1=severe, 2=not so severe
    $scope.check_visual_button_color= function(type, sector) {
	var visualAffections=sharedProperties.getVisualAffections();
	var button= "btn btn-primary";
	visualAffections.forEach( function (item, index, object){
	    if (item.Sector==sector){
		{
		    if (item.Type==type){
			if (item.Severity==1){
			    button = "btn btn-danger";
			}
			else if (item.Severity==2){
			    button = "btn btn-warning";
			}
                        else if (item.Severity==3){
                            button = "btn btn-info";
                        }


		    }
		}
	    }
	});
	return button;
    }
    $scope.visual_error= function (kind, severity, sector){
	//console.log ($scope.comment_for_sector)
	$rootScope.VisualAddedCommentDisabled = false;
            if (severity==0){
		$scope.deleteVisAff(sector, kind);
		if (kind.indexOf('pillar')>-1){
		    if (sharedProperties.getPillarsAffectionsBadN()>0) {
			$rootScope.totalPillarsSet ("affections", 1);
		    } else if (sharedProperties.getPillarsAffectionsMediumN()>0) {
			$rootScope.totalPillarsSet ("affections", 2);
		    } else {
			$rootScope.totalPillarsSet ("affections", 0);
		    }
		} else {
		    if (sharedProperties.getVisualAffectionsBadN()>0) {
			$scope.totalToplightSet ("affections", 1);
		    } else if (sharedProperties.getVisualAffectionsMediumN()>0) {
			$scope.totalToplightSet ("affections", 2);
		    } else {
			$scope.totalToplightSet ("affections", 0);
		    }
		}
	    } else {
		$scope.deleteVisAff(sector, kind);//we remove an eventually already present affection in the same place with the same name
		sharedProperties.addVisualAffection(sector, kind, severity, $scope.comment_for_sector);
		if (kind.indexOf('pillar')>-1){
		    $rootScope.PillAffNumber=sharedProperties.getPillarsAffectionsN();
		    if (sharedProperties.getPillarsAffectionsBadN()>0) {
			$rootScope.totalPillarsSet ("affections", 1);
		    } else if (sharedProperties.getPillarsAffectionsMediumN()>0) {
			$rootScope.totalPillarsSet ("affections", 2);
		    } else {
			$rootScope.totalPillarsSet ("affections", 0);
		    }
		} else {
		    $rootScope.VisAffNumber=sharedProperties.getVisualAffectionsN();
		    if (sharedProperties.getVisualAffectionsBadN()>0) {
			$scope.totalToplightSet ("affections", 1);
		    } else if (sharedProperties.getVisualAffectionsMediumN()>0) {
			$scope.totalToplightSet ("affections", 2);
		    } else {
			$scope.totalToplightSet ("affections", 0);
		    }
		}
 	    }

   setTimeout(function(){ 
	$rootScope.VisualAddedCommentDisabled = true;
    }, 3000);  

//$scope.formData.all_visual_affections=sharedProperties.getVisualAffections(); 
   };


    $scope.visual_error_reload= function (kind, severity, sector, comment){ 
        
            if (severity==0){ 
                $scope.deleteVisAff(sector, kind); 
                if (kind.indexOf('pillar')>-1){ 
                    if (sharedProperties.getPillarsAffectionsBadN()>0) { 
                        $rootScope.totalPillarsSet ("affections", 1); 
                    } else if (sharedProperties.getPillarsAffectionsMediumN()>0) { 
                        $rootScope.totalPillarsSet ("affections", 2); 
                    } else { 
                        $rootScope.totalPillarsSet ("affections", 0); 
                    } 
                } else { 
                    if (sharedProperties.getVisualAffectionsBadN()>0) { 
                        $scope.totalToplightSet ("affections", 1); 
                    } else if (sharedProperties.getVisualAffectionsMediumN()>0) { 
                        $scope.totalToplightSet ("affections", 2); 
                    } else { 
                        $scope.totalToplightSet ("affections", 0); 
                    } 
                } 
            } else { 
                $scope.deleteVisAff(sector, kind);//we remove an eventually already present affection in the same place with the same name 
                sharedProperties.addVisualAffection(sector, kind, severity, comment); 
		if (kind.indexOf('pillar')>-1){ 
                    $rootScope.PillAffNumber=sharedProperties.getPillarsAffectionsN(); 
                    if (sharedProperties.getPillarsAffectionsBadN()>0) { 
                        $rootScope.totalPillarsSet ("affections", 1); 
                    } else if (sharedProperties.getPillarsAffectionsMediumN()>0) { 
                        $rootScope.totalPillarsSet ("affections", 2); 
                    } else { 
                        $rootScope.totalPillarsSet ("affections", 0); 
                    } 
                } else { 
                    $rootScope.VisAffNumber=sharedProperties.getVisualAffectionsN(); 
                    if (sharedProperties.getVisualAffectionsBadN()>0) { 
                        $scope.totalToplightSet ("affections", 1); 
                    } else if (sharedProperties.getVisualAffectionsMediumN()>0) { 
                        $scope.totalToplightSet ("affections", 2); 
                    } else { 
                        $scope.totalToplightSet ("affections", 0); 
                    } 
                } 
 
            } 
    };


    $scope.deleteFileComment= function(name) {//to delete already uploaded files
	sharedProperties.removeFileComment(name);
	$rootScope.VisAffBlobNumber=sharedProperties.getVisualAffectionsBlobN();
	//$rootScope.PillAffBlobNumber=sharedProperties.getPillarsAffectionsBlobN();
    };
    $scope.deleteVisAff= function(sector, type) {//to delete visual affections
//	console.log($rootScope.VisAffNumber)
	sharedProperties.removeVisualAffection(sector, type);

	$rootScope.VisAffNumber=sharedProperties.getVisualAffectionsN();
	$rootScope.PillAffNumber=sharedProperties.getPillarsAffectionsN();
	//$scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
//console.log($rootScope.VisAffNumber)
	if (type.indexOf('pillar')>-1){
	    if (sharedProperties.getPillarsAffectionsBadN()>0) {
		$rootScope.totalPillarsSet ("affections", 1);
	    } else if (sharedProperties.getPillarsAffectionsMediumN()>0) {
		$rootScope.totalPillarsSet ("affections", 2);
	    } else {
		$rootScope.totalPillarsSet ("affections", 0);
	    }
	} else {
	    if (sharedProperties.getVisualAffectionsBadN()>0) {
		$scope.totalToplightSet ("affections", 1);
	    } else if (sharedProperties.getVisualAffectionsMediumN()>0) {
		$scope.totalToplightSet ("affections", 2);
	    } else {
		$scope.totalToplightSet ("affections", 0);
	    }
	}
    };

    $scope.deleteVisAffREMOVAL= function(sector, type) {//to delete visual affections
//	console.log($rootScope.VisAffNumber)
	sharedProperties.removeVisualAffection(sector, type);

	$rootScope.VisAffNumber=sharedProperties.getVisualAffectionsN();
	$rootScope.PillAffNumber=sharedProperties.getPillarsAffectionsN();
	$scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
//console.log($rootScope.VisAffNumber)
	if (type.indexOf('pillar')>-1){
	    if (sharedProperties.getPillarsAffectionsBadN()>0) {
		$rootScope.totalPillarsSet ("affections", 1);
	    } else if (sharedProperties.getPillarsAffectionsMediumN()>0) {
		$rootScope.totalPillarsSet ("affections", 2);
	    } else {
		$rootScope.totalPillarsSet ("affections", 0);
	    }
	} else {
	    if (sharedProperties.getVisualAffectionsBadN()>0) {
		$scope.totalToplightSet ("affections", 1);
	    } else if (sharedProperties.getVisualAffectionsMediumN()>0) {
		$scope.totalToplightSet ("affections", 2);
	    } else {
		$scope.totalToplightSet ("affections", 0);
	    }
	}
    };

    //toplight section
    $scope.kaptonCutButtons= "btn btn-primary";
	
	$rootScope.PrintData.kaptonCutButtons = "Null";
    $scope.formData.KAPTONCUTOK=null;
    $scope.kaptonCutInvalid=true;
    $scope.toggleKaptonCutButtonsNo = function(){
	$scope.formData.KAPTONCUTOK=1;
	$scope.kaptonCutInvalid=false;
	$scope.kaptonCutButtons = "btn btn-danger";
	$rootScope.PrintData.kaptonCutButtons = "No";
	
	$scope.totalToplightSet("kaptonCut",1);
    };
    $scope.toggleKaptonCutButtonsYes = function(){
        if ($scope.formData.KAPTONCUTOK==0){
            $scope.formData.KAPTONCUTOK=null;
            $scope.kaptonCutInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.kaptonCutButtons= "btn btn-primary";
			$rootScope.PrintData.kaptonCutButtons = "Null";
			
	    $scope.totalToplightSet("kaptonCut",null);
        } else {
            $scope.kaptonCutInvalid=false;
            $scope.formData.KAPTONCUTOK=0;
            $scope.kaptonCutButtons = "btn btn-success";
			$rootScope.PrintData.kaptonCutButtons = "Yes";
			
	    $scope.totalToplightSet("kaptonCut",0);
        }
    };

    $scope.kaptonGluedButtons= "btn btn-primary";
	$rootScope.PrintData.kaptonGluedButtons = "Null";
	
    $scope.formData.KAPTONGLUEDOK=null;
    $scope.kaptonGluedInvalid=true;
    $scope.toggleKaptonGluedButtonsNo = function(){
	$scope.formData.KAPTONGLUEDOK=1;
	$scope.kaptonGluedInvalid=false;
	$scope.kaptonGluedButtons = "btn btn-danger";
	$rootScope.PrintData.kaptonGluedButtons = "No";
	
	
	$scope.totalToplightSet("kaptonGlued",1);
    };
    $scope.toggleKaptonGluedButtonsYes = function(){
        if ($scope.formData.KAPTONGLUEDOK==0){
            $scope.formData.KAPTONGLUEDOK=null;
            $scope.kaptonGluedInvalid=true;
            $scope.kaptonGluedButtons= "btn btn-primary";
			$rootScope.PrintData.kaptonGluedButtons = "Null";
			
	    $scope.totalToplightSet("kaptonGlued",null);
        } else {
            $scope.kaptonGluedInvalid=false;
            $scope.formData.KAPTONGLUEDOK=0;
            $scope.kaptonGluedButtons = "btn btn-success";
			$rootScope.PrintData.kaptonGluedButtons = "Yes";
			
	    $scope.totalToplightSet("kaptonGlued",0);
        }
    };

    $scope.coverlayBubblesButtons= "btn btn-primary";
        $rootScope.PrintData.coverlayBubblesButtons = "Null";

    $scope.formData.COVERLAYBUBBLESOK=null;
    $scope.coverlayBubblesInvalid=true;
    $scope.toggleCoverlayBubblesButtonsNo = function(){
        $scope.formData.COVERLAYBUBBLESOK=1;
        $scope.coverlayBubblesInvalid=false;
        $scope.coverlayBubblesButtons = "btn btn-danger";
        $rootScope.PrintData.coverlayBubblesButtons = "No";


        $scope.totalToplightSet("coverlayBubbles",1);
    };
    $scope.toggleCoverlayBubblesButtonsYes = function(){

	   if ($scope.formData.COVERLAYBUBBLESOK==0){

	    $scope.formData.COVERLAYBUBBLESOK=null;
            $scope.coverlayBubblesInvalid=true;
            $scope.coverlayBubblesButtons= "btn btn-primary";
                        $rootScope.PrintData.coverlayBubblesButtons = "Null";

            $scope.totalToplightSet("coverlayBubbles",null);
        } else {

      $scope.coverlayBubblesInvalid=false;
            $scope.formData.COVERLAYBUBBLESOK=0;
            $scope.coverlayBubblesButtons = "btn btn-success";
                        $rootScope.PrintData.coverlayBubblesButtons = "Yes";

            $scope.totalToplightSet("coverlayBubbles",0);
        }
    };




    $scope.analyzeTheConnector= function() {
            server_operations.analyze_connector_picture({"filename": sharedProperties.getTmpFilename(), "theta_res": $rootScope.hough_theta_res, "min_lines":$rootScope.min_n_lines, "tresh":$rootScope.hough_tresh})
            .success(function(data, status, headers, config) {
                $rootScope.processedImage=data
                $rootScope.showConnectorWidths=true;
                $rootScope.connectorWidthsData=JSON.parse(headers()['result'] );
                $rootScope.$emit('fillConnectorData', data, function() {})
            })
            .error(function(data) {
                $scope.final_spin=false;
                $rootScope.$emit("CallAlert", ["danger", "Error on analysing file " + sharedProperties.getTmpFilename() + " " + data]);
            });
    };

    $scope.analyzeTheResistive= function() {
            server_operations.analyze_res_file({"filename": sharedProperties.getTmpFilename()})
            .success(function(data, status, headers, config) {
                $rootScope.showResMes=true;
                //console.log(data) 
                //console.log(JSON.parse(headers()['result'])); 
                //$rootScope.resMesureData=JSON.parse(headers()['result'] );
                $rootScope.resMesureData=data;
                $rootScope.$emit('fillResData', data, function() {})
            })
            .error(function(data) {
                $scope.final_spin=false;
                $rootScope.$emit("CallAlert", ["danger", "Error on analysing file " + sharedProperties.getTmpFilename() + " " + data]);
            });
    };



        $scope.getPictureAnalyzed= function() {

	  server_operations.getPictureAnalyzed({"filename": $rootScope.ConnectorAnalyzedFilename})
            .success(function(data, status, headers, config) {

	    $rootScope.processedImage=data

	    var byteString = atob(data.split(',')[1]);

    // separate out the mime component
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0]
    //
    //         // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
            	ia[i] = byteString.charCodeAt(i);
             }


	    //console.log(ia);
            blob = new Blob([ia],  { type: 'image/jpeg' }),
                      url = $window.URL || $window.webkitURL;
            $scope.fileUrl = url.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";


	    a.href = $scope.fileUrl;
            a.download = $rootScope.ConnectorAnalyzedFilename;
            a.click();               

           })
            .error(function(data) {

                $rootScope.$emit("CallAlert", ["danger", "Error on downloading file "] );
            });
	};
 

       $scope.getImage= function(filename) {

	  server_operations.getPictureAnalyzed({"filename":filename})
            .success(function(data, status, headers, config) {


	    var byteString = atob(data.split(',')[1]);

    // separate out the mime component
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0]
    //
    //         // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
            	ia[i] = byteString.charCodeAt(i);
             }


	    //console.log(ia);
            blob = new Blob([ia],  { type: 'image/jpeg' }),
                      url = $window.URL || $window.webkitURL;
            $scope.fileUrl = url.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";


	    a.href = $scope.fileUrl;
            a.download = filename;
            a.click();               

           })
            .error(function(data) {

                $rootScope.$emit("CallAlert", ["danger", "Error on downloading file "] );
            });


	};

	


	$scope.getROOT= function() {
            server_operations.getROOT({"filename": $rootScope.ResistiveFilename})
            .success(function(data, status, headers, config) {
            $rootScope.DataToDownload=data;
		

	    var byteString = atob(data.split(',')[1]);

    // separate out the mime component
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0]
    //
    //         // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
            	ia[i] = byteString.charCodeAt(i);
             }


	    //console.log(ia);
            blob = new Blob([ia],  { type: 'application/bin' }),
                      url = $window.URL || $window.webkitURL;
            $scope.fileUrl = url.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
	    var fileName = "test.root";                

	    a.href = $scope.fileUrl;
            a.download = $rootScope.ResistiveFilename;
            a.click();               

           })
            .error(function(data) {

                $rootScope.$emit("CallAlert", ["danger", "Error on analysing file "] );
            });
    };


    $scope.getPDF= function(filename) {
            server_operations.getPdf({"filename": filename})
            .success(function(data, status, headers, config) {
            $rootScope.DataToDownload=data;
		

	    var byteString = atob(data.split(',')[1]);

    // separate out the mime component
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0]
    //
    //         // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
            	ia[i] = byteString.charCodeAt(i);
             }


	    //console.log(ia);
            blob = new Blob([ia],  { type: 'application/pdf' }),
                      url = $window.URL || $window.webkitURL;
            $scope.fileUrl = url.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
	    var fileName = "test.pdf";                

	    a.href = $scope.fileUrl;
            a.download = filename;
            a.click();               

           })
            .error(function(data) {

                $rootScope.$emit("CallAlert", ["danger", "Error on analysing file " + sharedProperties.getTmpFilename() + " " + data]);
            });
    };

    //$rootScope.showConnectorWidths=false;
    $scope.connectorAnalysisDetailsShown=false;
    $scope.toggleconnectorAnalysisDetails= function() {
	$scope.connectorAnalysisDetailsShown=!$scope.connectorAnalysisDetailsShown;
    };
    $rootScope.hough_theta_res=180;
    $rootScope.min_n_lines=6;
    $rootScope.hough_tresh=550;
    $rootScope.connectorWidthsData={
	"filename": "",
	"copper_width": {"mean": 0, "sigma": 0},
	"gaps_width": {"mean": 0, "sigma": 0}
    }
	
	if (!isNaN($rootScope.connectorWidthsData["copper_width"]["mean"])){
    $scope.formData.COPPERWIDTHMEAN=$rootScope.connectorWidthsData["copper_width"]["mean"];
    $scope.formData.COPPERWIDTHSIGMA=$rootScope.connectorWidthsData["copper_width"]["sigma"];
    $scope.formData.GAPSWIDTHMEAN=$rootScope.connectorWidthsData["gaps_width"]["mean"];
    $scope.formData.GAPSWIDTHSIGMA=$rootScope.connectorWidthsData["gaps_width"]["sigma"];
    //$scope.copperStripWidth=$scope.formData.COPPERWIDTHMEAN + " &plusmn; " + $scope.formData.COPPERWIDTHSIGMA;
	$rootScope.PrintData.copperStripWidth=$scope.formData.COPPERWIDTHMEAN + " &plusmn; " + $scope.formData.COPPERWIDTHSIGMA;
    //$scope.GapsWidth=$scope.formData.GAPSWIDTHMEAN + " &plusmn; " + $scope.formData.GAPSWIDTHSIGMA;
	}
    $rootScope.$on('fillConnectorData', function() {
	        if (!isNaN($rootScope.connectorWidthsData["copper_width"]["mean"])){

	$scope.formData.COPPERWIDTHMEAN=$rootScope.connectorWidthsData["copper_width"]["mean"];
	$scope.formData.COPPERWIDTHSIGMA=$rootScope.connectorWidthsData["copper_width"]["sigma"];
	$scope.formData.GAPSWIDTHMEAN=$rootScope.connectorWidthsData["gaps_width"]["mean"];
	$scope.formData.GAPSWIDTHSIGMA=$rootScope.connectorWidthsData["gaps_width"]["sigma"];
	$scope.formData.COPPERGAPSRATIO=$rootScope.connectorWidthsData["ratio"]["value"];
	check_connector_ratio();
	$scope.formData.COPPERGAPSRATIOERROR=$rootScope.connectorWidthsData["ratio"]["error"];
	$scope.copperStripWidth=$scope.formData.COPPERWIDTHMEAN.toFixed(2) + " +- " + $scope.formData.COPPERWIDTHSIGMA.toFixed(2) ;
	$rootScope.PrintData.copperStripWidth=$scope.formData.COPPERWIDTHMEAN.toFixed(2) + " +- " + $scope.formData.COPPERWIDTHSIGMA.toFixed(2) ;

	$scope.connectorGapsWidth=$scope.formData.GAPSWIDTHMEAN.toFixed(2) + " +- " + $scope.formData.GAPSWIDTHSIGMA.toFixed(2) ;
	$rootScope.PrintData.connectorGapsWidth=$scope.formData.GAPSWIDTHMEAN.toFixed(2) + " +- " + $scope.formData.GAPSWIDTHSIGMA.toFixed(2);

	$scope.connectorRatio=$scope.formData.COPPERGAPSRATIO.toFixed(2) + " +- " +  $scope.formData.COPPERGAPSRATIOERROR.toFixed(2) ;
	$rootScope.PrintData.connectorRatio=$scope.formData.COPPERGAPSRATIO.toFixed(2) + " +- " +  $scope.formData.COPPERGAPSRATIOERROR.toFixed(2) ;

	$scope.totalToplightSet("connector",0);
	}
    });


    $rootScope.resMesureData={
	"filename": "",
        "res_values": {"minb": 0, "maxb": 0, "rmsb": 0, "meanb": 0, "mina": 0, "maxa": 0, "rmsa": 0, "meana": 0, "rmsr": 0, "meanr": 0}
    }
    $scope.formData.RESVALUEMINB=$rootScope.resMesureData["res_values"]["minb"];
    $scope.formData.RESVALUEMAXB=$rootScope.resMesureData["res_values"]["maxb"];
    $scope.formData.RESVALUERMSB=$rootScope.resMesureData["res_values"]["rmsb"];
    $scope.formData.RESVALUEMEANB=$rootScope.resMesureData["res_values"]["meanb"];
    $scope.formData.RESVALUEMINA=$rootScope.resMesureData["res_values"]["mina"];
    $scope.formData.RESVALUEMAXA=$rootScope.resMesureData["res_values"]["maxa"];
    $scope.formData.RESVALUERMSA=$rootScope.resMesureData["res_values"]["rmsa"];
    $scope.formData.RESVALUEMEANA=$rootScope.resMesureData["res_values"]["meana"];
    $scope.formData.RESVALUERMSR=$rootScope.resMesureData["res_values"]["rmsr"];
    $scope.formData.RESVALUEMEANR=$rootScope.resMesureData["res_values"]["meanr"];
    $rootScope.$on('fillResData', function() {

	 if (!isNaN($rootScope.resMesureData["res_values"]["meanb"])){

        $scope.formData.RESVALUEMINB=$rootScope.resMesureData["res_values"]["minb"];
        $scope.formData.RESVALUEMAXB=$rootScope.resMesureData["res_values"]["maxb"];
        $scope.formData.RESVALUERMSB=$rootScope.resMesureData["res_values"]["rmsb"];
        $scope.formData.RESVALUEMEANB=$rootScope.resMesureData["res_values"]["meanb"];
        $scope.formData.RESVALUEMINA=$rootScope.resMesureData["res_values"]["mina"];
        $scope.formData.RESVALUEMAXA=$rootScope.resMesureData["res_values"]["maxa"];
        $scope.formData.RESVALUERMSA=$rootScope.resMesureData["res_values"]["rmsa"];
        $scope.formData.RESVALUEMEANA=$rootScope.resMesureData["res_values"]["meana"];
        $scope.formData.RESVALUERMSR=$rootScope.resMesureData["res_values"]["rmsr"];
        $scope.formData.RESVALUEMEANR=$rootScope.resMesureData["res_values"]["meanr"];
	check_Res_values()

        $scope.ResistiveMinb=parseFloat($scope.formData.RESVALUEMINB).toFixed(2);
        $rootScope.PrintData.ResistiveMinb=parseFloat($scope.formData.RESVALUEMINB).toFixed(2);

        $scope.ResistiveMaxb=parseFloat($scope.formData.RESVALUEMAXB).toFixed(2);
        $rootScope.PrintData.ResistiveMaxb=parseFloat($scope.formData.RESVALUEMAXB).toFixed(2);

        $scope.ResistiveRmsb=parseFloat($scope.formData.RESVALUERMSB).toFixed(2);
        $rootScope.PrintData.ResistiveRmsb=parseFloat($scope.formData.RESVALUERMSB).toFixed(2);

        $scope.ResistiveMeanb=parseFloat($scope.formData.RESVALUEMEANB).toFixed(2);
        $rootScope.PrintData.ResistiveMeanb=parseFloat($scope.formData.RESVALUEMEANB).toFixed(2);

        $scope.ResistiveMina=parseFloat($scope.formData.RESVALUEMINA).toFixed(2);
        $rootScope.PrintData.ResistiveMina=parseFloat($scope.formData.RESVALUEMINA).toFixed(2);

        $scope.ResistiveMaxa=parseFloat($scope.formData.RESVALUEMAXA).toFixed(2);
        $rootScope.PrintData.ResistiveMaxa=$scope.formData.RESVALUEMAXA.toFixed(2);

        $scope.ResistiveRmsa=parseFloat($scope.formData.RESVALUERMSA).toFixed(2);
        $rootScope.PrintData.ResistiveRmsa=parseFloat($scope.formData.RESVALUERMSA).toFixed(2);

        $scope.ResistiveMeana=parseFloat($scope.formData.RESVALUEMEANA).toFixed(2);
        $rootScope.PrintData.ResistiveMeana=parseFloat($scope.formData.RESVALUEMEANA).toFixed(2);

        $scope.ResistiveRmsr=parseFloat($scope.formData.RESVALUERMSR).toFixed(2);
        $rootScope.PrintData.ResistiveRmsr=parseFloat($scope.formData.RESVALUERMSR).toFixed(2);

        $scope.ResistiveMeanr=parseFloat($scope.formData.RESVALUEMEANR).toFixed(2);
        $rootScope.PrintData.ResistiveMeanr=parseFloat($scope.formData.RESVALUEMEANR).toFixed(2);
	}
	else {

	//console.log("papa")
	        $scope.formData.RESVALUEMINB=0;
        $scope.formData.RESVALUEMAXB=0;
        $scope.formData.RESVALUERMSB=0;
        $scope.formData.RESVALUEMEANB=0;
        $scope.formData.RESVALUEMINA=0;
        $scope.formData.RESVALUEMAXA=0;
        $scope.formData.RESVALUERMSA=0;
        $scope.formData.RESVALUEMEANA=0;
        $scope.formData.RESVALUERMSR=0;
        $scope.formData.RESVALUEMEANR=0;

	}

    });


    $scope.formData.TOTALRESISTIVEOK=null;
    //$scope.totalPillarsCollapsed=true;
    $scope.formData.TOTALRESISTIVE_COMMENT=null;
    //$rootScope.totalPillarsStatus="null";


    //adding here all the resistive analysis related stuff
    //

    $scope.totalResistive_CheckButtons= "btn btn-primary";
    $scope.formData.TOTALResistive_CheckOK=null;
    $scope.toggleTotalResistive_CheckYes = function(){
        if ($scope.formData.TOTALResistive_CheckOK==0){
            $scope.formData.TOTALResistive_CheckOK=null;
	    $scope.grandTotalInvalid=true;
            $scope.totalResistive_CheckButtons= "btn btn-primary";
	    $scope.totalResistive_CheckCollapsed=true;
	    $rootScope.grandTotalSet ("Resistive_Check", null);
        } else {
            $scope.formData.TOTALResistive_CheckOK=0;
            $scope.totalResistive_CheckButtons = "btn btn-success";
	    $scope.totalResistive_CheckCollapsed=true;
	    $rootScope.grandTotalSet ("Resistive_Check", 0);
        }
    };
    $scope.toggleTotalResistive_CheckNo = function(){
        $scope.formData.TOTALResistive_CheckOK=1;
	$scope.totalResistive_CheckCollapsed=false;
        $scope.totalResistive_CheckButtons = "btn btn-danger";
	$rootScope.grandTotalSet ("Resistive_Check", 0);
    };
    $scope.toggleTotalResistive_CheckNull = function(){
	$scope.formData.TOTALResistive_CheckOK=null;
	$rootScope.grandTotalSet ("Resistive_Check", null);
    };
    $scope.toggleTotalResistive_CheckMaybe = function(){
	$scope.formData.TOTALResistive_CheckOK=2;
	$rootScope.grandTotalSet ("Resistive_Check", 2);
	
    };

    $rootScope.totalResistive_CheckSet = function (section, value) {
	$rootScope.resumeResistive_Check[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumeResistive_Check) {
	    if ($rootScope.resumeResistive_Check[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumeResistive_Check[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumeResistive_Check[sec]==null) notCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalResistive_CheckNo();
	    $rootScope.totalResistive_CheckStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalResistive_CheckMaybe();
	    $rootScope.totalResistive_CheckStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalResistive_CheckYes();
	    $rootScope.totalResistive_CheckStatus="ok";
	} else if ((thereIsFail==0) && (notCompleted==1)) {
	    $scope.toggleTotalResistive_CheckNull();
	    $rootScope.totalResistive_CheckStatus="null";
	}
    };


    $scope.saveResistive_Check=function(){
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_Resistive_Check=new Date();
	server_operations.save_Resistive_Check($scope.formData)

	// if successful creation, call our get function to get all the new entries
	.success(function(data) {
	    $scope.Resistive_Check_save_info=true;
	    $scope.formData.CHECKER_Resistive_Check= $scope.formData.USER;
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["success", "Resistive_Check information successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});

    };



    var check_connector_ratio= function(){
	if ((parseFloat($scope.formData.COPPERGAPSRATIO)<0.75) || (parseFloat($scope.formData.COPPERGAPSRATIO)>1.1)) {
		$scope.totalToplightSet ("connectorRatio", 1);
	    $scope.connectorRatio_style={'background-color':'red'};
	} else if ((parseFloat($scope.formData.COPPERGAPSRATIO)<0.85)) {
	    $scope.totalToplightSet ("connectorRatio", 2);
	    $scope.connectorRatio_style={'background-color':'orange'};
	} else{
	$scope.connectorRatio_style={'background-color':'orange'};
	$scope.totalToplightSet ("connectorRatio", 0);}
	
    };


    var check_Res_values= function(){
      //  if (parseFloat($scope.formData.RESVALUEMINB)<10) {
      //      $scope.totalResistive_CheckSet ("minb", 1);
      //      $scope.ResistiveMinb_style={'background-color':'red'};
      //  } else {
      //     $scope.totalResistive_CheckSet ("minb", 0);
     //       $scope.ResistiveMinb_style={};
     //  }
     //   if (parseFloat($scope.formData.RESVALUEMAXB)<10) {
     //       $scope.totalResistive_CheckSet ("maxb", 1);
     //       $scope.ResistiveMaxb_style={'background-color':'red'};
     //   } else {
     //       $scope.totalResistive_CheckSet ("maxb", 0);
     //       $scope.ResistiveMaxb_style={};
     //   }
        if (parseFloat($scope.formData.RESVALUERMSB)>=0.35*parseFloat($scope.formData.RESVALUEMEANB)) {
            $scope.totalResistive_CheckSet ("rmsb", 1);
            $scope.ResistiveRmsb_style={'background-color':'red'};
        } else if (parseFloat($scope.formData.RESVALUERMSB)>=0.25*parseFloat($scope.formData.RESVALUEMEANB)) {
            $scope.totalResistive_CheckSet ("rmsb", 2);
            $scope.ResistiveRmsb_style={'background-color':'orange'};
        }else {
            $scope.totalResistive_CheckSet ("rmsb", 0);
            $scope.ResistiveRmsb_style={}
	}
	if (parseFloat($scope.formData.RESVALUEMEANB)<=0.2 || parseFloat($scope.formData.RESVALUEMEANB)>=3.5) {
	    $scope.totalResistive_CheckSet ("meanb", 1);
	    $scope.ResistiveMeanb_style={'background-color':'red'};
	} else if((parseFloat($scope.formData.RESVALUEMEANB)>0.2 && parseFloat($scope.formData.RESVALUEMEANB)<0.5)|| parseFloat($scope.formData.RESVALUEMEANB)>2.5 && parseFloat($scope.formData.RESVALUEMEANB)<=3.5){
	    $scope.totalResistive_CheckSet ("meanb", 2);
	    $scope.ResistiveMeanb_style={'background-color':'orange'};
	} 
	else {
	    $scope.totalResistive_CheckSet ("meanb", 0);
            $scope.ResistiveMeanb_style={};
	}




        if (parseFloat($scope.formData.RESVALUERMSA)>=0.3*parseFloat($scope.formData.RESVALUEMEANA)) {
            $scope.totalResistive_CheckSet ("rmsa", 1);
            $scope.ResistiveRmsa_style={'background-color':'red'};
        } else if (parseFloat($scope.formData.RESVALUERMSA)>=0.2*parseFloat($scope.formData.RESVALUEMEANA)) {
            $scope.totalResistive_CheckSet ("rmsa", 2);
            $scope.ResistiveRmsa_style={'background-color':'orange'};
        }else {
            $scope.totalResistive_CheckSet ("rmsa", 0);
            $scope.ResistiveRmsa_style={}
        }
        if (parseFloat($scope.formData.RESVALUEMEANA)<=0.2 || parseFloat($scope.formData.RESVALUEMEANA)>=3.5) {
            $scope.totalResistive_CheckSet ("meana", 1);
            $scope.ResistiveMeana_style={'background-color':'red'};
        } else if((parseFloat($scope.formData.RESVALUEMEANA)>0.2 && parseFloat($scope.formData.RESVALUEMEANA)<0.5)|| parseFloat($scope.formData.RESVALUEMEANA)>2.5 && parseFloat($scope.formData.RESVALUEMEANA)<=3.5){
            $scope.totalResistive_CheckSet ("meana", 2);
            $scope.ResistiveMeana_style={'background-color':'orange'};
        }
        else {
            $scope.totalResistive_CheckSet ("meana", 0);
            $scope.ResistiveMeana_style={};
        }


       /* if (parseFloat($scope.formData.RESVALUEMINA)<10) {
            $scope.totalResistive_CheckSet ("mina", 1);
            $scope.ResistiveMina_style={'background-color':'red'};
        } else {
            $scope.totalResistive_CheckSet ("mina", 0);
            $scope.ResistiveMina_style={};
        }
        if (parseFloat($scope.formData.RESVALUEMAXA)<10) {
            $scope.totalResistive_CheckSet ("maxa", 1);
            $scope.ResistiveMaxa_style={'background-color':'red'};
        } else {
            $scope.totalResistive_CheckSet ("maxa", 0);
            $scope.ResistiveMaxa_style={};
        }*/
        if (parseFloat($scope.formData.RESVALUERMSR)<0.5|| parseFloat($scope.formData.RESVALUERMSR)>2.5) {
            $scope.totalResistive_CheckSet ("rmsr", 1);
            $scope.ResistiveRmsr_style={'background-color':'red'};
        } else if ((parseFloat($scope.formData.RESVALUERMSR)>= 0.5 && parseFloat($scope.formData.RESVALUERMSR)<=0.9) ||(parseFloat($scope.formData.RESVALUERMSR)>2 && parseFloat($scope.formData.RESVALUERMSR)<=2.5)){
            $scope.totalResistive_CheckSet ("rmsr", 2);
            $scope.ResistiveRmsr_style={'background-color':'orange'};
	    if (parseFloat($scope.formData.RESVALUERMSR)>2*parseFloat($scope.formData.RESVALUEMEANR)){
 	        $scope.totalResistive_CheckSet ("rmsr", 1);
            	$scope.ResistiveRmsr_style={'background-color':'red'};
            }
        }
	else {

            $scope.totalResistive_CheckSet ("rmsr", 0);
            $scope.ResistiveRmsr_style={};
           if (parseFloat($scope.formData.RESVALUERMSR)>2*parseFloat($scope.formData.RESVALUEMEANR)){           
                $scope.totalResistive_CheckSet ("rmsr", 1);
                $scope.ResistiveRmsr_style={'background-color':'red'};
            } else if (parseFloat($scope.formData.RESVALUERMSR)>1.5*parseFloat($scope.formData.RESVALUEMEANR)){
		$scope.totalResistive_CheckSet ("rmsr", 2);
                $scope.ResistiveRmsr_style={'background-color':'orange'};
	    } 
	}
        if (parseFloat($scope.formData.RESVALUEMEANR)<0.7 || parseFloat($scope.formData.RESVALUEMEANR)>2.5) {
            $scope.totalResistive_CheckSet ("meanr", 1);
            $scope.ResistiveMeanr_style={'background-color':'red'};
        } else if ((parseFloat($scope.formData.RESVALUEMEANR)>=0.7 && parseFloat($scope.formData.RESVALUEMEANR)<=1.0) || (parseFloat($scope.formData.RESVALUEMEANR)>2 && parseFloat($scope.formData.RESVALUEMEANR)<=2.5)){
            $scope.totalResistive_CheckSet ("meanr", 2);
            $scope.ResistiveMeanr_style={'background-color':'orange'};
        } else {
            $scope.totalResistive_CheckSet ("meanr", 0);
            $scope.ResistiveMeanr_style={};
	}
    };


    $scope.formData.TOTALVISUALOK=null;
    $scope.toggleTotalToplightNo = function(){
	$scope.formData.TOTALVISUALOK=1;
	$scope.totalVisualCollapsed=false;
	$rootScope.grandTotalSet ("visual", 1);
    };
    $scope.toggleTotalToplightYes = function(){
	$scope.formData.TOTALVISUALOK=0;
	$scope.totalVisualCollapsed=true;
	$rootScope.grandTotalSet ("visual", 0);
    };
    $scope.toggleTotalToplightNull = function(){
	$scope.totalVisualCollapsed=true;
	$scope.formData.TOTALVISUALOK=null;
	$rootScope.grandTotalSet ("visual", null);
    };
    $scope.toggleTotalToplightMaybe = function(){
	$scope.totalVisualCollapsed=true;
	$scope.formData.TOTALVISUALOK=2;
	$rootScope.grandTotalSet ("visual", 2);
	
    };

    $scope.totalToplightSet = function (section, value) {
	$rootScope.resumeToplight[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumeToplight) {
	    if ($rootScope.resumeToplight[sec]==null) notCompleted=1;
	    if ($rootScope.resumeToplight[sec]==1) thereIsFail=1;
	    if ($rootScope.resumeToplight[sec]==2) thereIsWarning=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalToplightNo();
	    $rootScope.totalToplightStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalToplightMaybe();
	    $rootScope.totalToplightStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalToplightYes();
	    $rootScope.totalToplightStatus="ok";
	} else if ((thereIsFail==0) && (thereIsWarning==0) && (notCompleted==1)) {
	    $scope.toggleTotalToplightNull();
	    $rootScope.totalToplightStatus="null";
	}
    };

    //backlight section
    $scope.DBTransitions_style={};
    $scope.DBTransitionsInvalid=true;
    $scope.DBTransitions_check = function() {
	if ($scope.formData.DBTRANSITIONS>=0) {
	    $scope.DBTransitionsInvalid=false;
	    if ($scope.formData.DBTRANSITIONS >7) {
		$scope.DBTransitions_style={'background-color':'red'};
		$rootScope.totalBacklightSet("dbtransitions", 1);
	    } else if ($scope.formData.DBTRANSITIONS >3)
	    {
		$scope.DBTransitions_style={'background-color':'orange'};
                $rootScope.totalBacklightSet("dbtransitions", 2);

	    }
	    else {
		$scope.DBTransitions_style={};
		$rootScope.totalBacklightSet("dbtransitions", 0);
	    }
	} else {
	    $scope.DBTransitionsInvalid=true;
	    $scope.grandTotalInvalid=true;
	    $rootScope.totalBacklightSet("dbtransitions", null);
	}
    };


    $scope.formData.ALIGN_RIGHT_S_invalid=true;
    $scope.formData.ALIGN_RIGHT_S_style={};
    $scope.formData.ALIGN_RIGHT_L_invalid=true;
    $scope.formData.ALIGN_RIGHT_L_style={};
    $scope.formData.ALIGN_LEFT_S_invalid=true;
    $scope.formData.ALIGN_LEFT_S_style={};
    $scope.formData.ALIGN_LEFT_L_invalid=true;
    $scope.formData.ALIGN_LEFT_L_style={};




    $scope.alignement_check = function (object, object_name) {
	    string2exec="$scope." + object_name + "_invalid=false"
	    eval(string2exec);
	if ((object>600) || (object<-600)) {
	    string2exec="$scope." + object_name + "_style={'background-color':'red'}";
	    $rootScope.totalBacklightSet(object_name, 1);
	}
        else if ((object>=-600 && object<-400 ) || (object>400 && object<=600)) {
            string2exec="$scope." + object_name + "_style={'background-color':'orange'}";
            $rootScope.totalBacklightSet(object_name, 2);
        

	} else if ((object>=-400) || (object<=400))  {
	    string2exec="$scope." + object_name + "_style={}";
	    $rootScope.totalBacklightSet(object_name, 0);
	}

       else {
            string2exec="$scope." + object_name + "_style={}";
            $rootScope.totalBacklightSet(object_name, null);
        }
	eval(string2exec);
    };


    $scope.edgesCleanButtons= "btn btn-primary";
	$rootScope.PrintData.edgesCleanButtons= "Null";
    $scope.formData.EDGESOK=null;
    $scope.edgesInvalid=true;
    $scope.toggleEdgesCleanYes = function(){
        if ($scope.formData.EDGESOK==0){
            $scope.formData.EDGESOK=null;
            $scope.edgesInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.edgesCleanButtons= "btn btn-primary";
			$rootScope.PrintData.edgesCleanButtons= "Null";
			
	    $rootScope.totalBacklightSet("edges", null);
        } else {
            $scope.formData.EDGESOK=0;
            $scope.edgesCleanButtons = "btn btn-success";
			$rootScope.PrintData.edgesCleanButtons= "Yes";
			
            $scope.edgesInvalid=false;
	    $rootScope.totalBacklightSet("edges", 0);
        }
    };
    $scope.toggleEdgesCleanNo = function(){
	$scope.edgesInvalid=false;
        $scope.formData.EDGESOK=1;
        $scope.edgesCleanButtons = "btn btn-danger";
		$rootScope.PrintData.edgesCleanButtons= "No";
		
	$rootScope.totalBacklightSet("edges", 1);
    };


    $scope.formData.EDGERIGHTUP_invalid=true;
    $scope.formData.EDGERIGHTUP_style={};
    $scope.formData.EDGERIGHTDOWN_invalid=true;
    $scope.formData.EDGERIGHTDOWN_style={};
    $scope.formData.EDGELEFTUP_invalid=true;
    $scope.formData.EDGELEFTUP_style={};
    $scope.formData.EDGELEFTDOWN_invalid=true;
    $scope.formData.EDGELEFTDOWN_style={};
    $scope.edges_check = function (object, object_name) {
	if (object > -1000 ) {
	    string2exec="$scope." + object_name + "_invalid=false"
	    eval(string2exec);
	    if (object>200) {
		string2exec="$scope." + object_name + "_style={'background-color':'red'}";
		$rootScope.totalBacklightSet(object_name, 1);
	    } else if (object>100) {
		    string2exec="$scope." + object_name + "_style={'background-color':'orange'}";
		    $rootScope.totalBacklightSet(object_name, 2);
	    } else if (object<=100 ){
		string2exec="$scope." + object_name + "_style={}";
		$rootScope.totalBacklightSet(object_name, 0);
	    } else {
	        string2exec="$scope." + object_name + "_style={}";
                $rootScope.totalBacklightSet(object_name, null);
  	    }
	    
	    eval(string2exec);
	} else {
	    string2exec="$scope." + object_name + "_invalid=true";
	    eval(string2exec);
	        string2exec="$scope." + object_name + "_style={}";
                $rootScope.totalBacklightSet(object_name, null);
	    eval(string2exec);
	}

    };

    $scope.edgesAccuratelyButtons= "btn btn-primary";
    $rootScope.PrintData.edgesAccuratelyButtons= "Null";

    $scope.formData.EDGESACC=null;
    $scope.edgesAccInvalid=true;
    $scope.toggleEdgesAccuratelyYes = function(){
        if ($scope.formData.EDGESACC==0){
            $scope.formData.EDGESACC=null;
            $scope.edgesAccInvalid=true;
            $scope.grandTotalInvalid=true;
	    $scope.EdgesAccCommentIsCollapsed=true;
	    $scope.formData.EDGESACC_COMMENT=null;
            $scope.edgesAccuratelyButtons= "btn btn-primary";
		    $rootScope.PrintData.edgesAccuratelyButtons= "Null";
			
	    $rootScope.totalBacklightSet("edgesAccurately", null);
        } else {
            $scope.formData.EDGESACC=0;
            $scope.edgesAccuratelyButtons = "btn btn-success";
		    $rootScope.PrintData.edgesAccuratelyButtons= "Yes";
			
            $scope.edgesAccInvalid=false;
	    $scope.EdgesAccCommentIsCollapsed=true;
	    $scope.formData.EDGESACC_COMMENT=null;
	    $rootScope.totalBacklightSet("edgesAccurately", 0);
        }
    };
    $scope.toggleEdgesAccuratelyNo = function(){
	$scope.edgesAccInvalid=false;
        $scope.formData.EDGESACC=1;
	$scope.EdgesAccCommentIsCollapsed=false;
        $scope.edgesAccuratelyButtons = "btn btn-danger";
	    $rootScope.PrintData.edgesAccuratelyButtons= "No";
		
	$rootScope.totalBacklightSet("edgesAccurately", 1);
    };


    $scope.holesLeft=0;
    $scope.holesRight=0;
    $scope.holesTop=0;
    $scope.holesBottom=0;
    $scope.interHoles=false;
    $scope.holesButtons= "btn btn-primary";
	$rootScope.PrintData.holesButtons= "Null";
	
    $scope.formData.HOLESOK=null;
    $scope.holesInvalid=true;
    $scope.showHoles2=false;
    $scope.toggleHolesYes = function(){
        if ($scope.formData.HOLESOK==0){
            $scope.formData.HOLESOK=null;
            $scope.holesInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.holesButtons= "btn btn-primary";
			$rootScope.PrintData.holesButtons= "Null";
			
            $scope.holes2Invalid=false;
	    $rootScope.totalBacklightSet("holes", null);
	    $scope.showHoles2=false;
	    $rootScope.totalBacklightSet("holes2", 0);
        } else {
	    $scope.toggleHoles2YesYes();
            $scope.formData.HOLESOK=0;
            $scope.holesButtons = "btn btn-success";
			$rootScope.PrintData.holesButtons= "Yes";
			
            $scope.holesInvalid=false;
            $scope.holes2Invalid=false;
	    $rootScope.totalBacklightSet("holes", 0);
	    $scope.showHoles2=false;
	    $rootScope.totalBacklightSet("holes2", 0);
        }
    };
    $scope.toggleHolesNo = function(){
	$scope.holesInvalid=false;
        $scope.formData.HOLESOK=1;
        $scope.holesButtons = "btn btn-warning";
		$rootScope.PrintData.holesButtons= "No";
		
	$scope.holes2Invalid=true;
	$rootScope.totalBacklightSet("holes", 2);
	$scope.showHoles2=true;
	$rootScope.totalBacklightSet("holes2", null);
    };

    $scope.holes2Buttons= "btn btn-primary";
    $scope.formData.HOLES2OK=null;
    $scope.holes2Invalid=false;
    $scope.toggleHoles2YesYes = function(){
	$scope.formData.HOLES2OK=0;
	$scope.holes2Buttons = "btn btn-success";
	$scope.holes2Invalid=false;
	$rootScope.totalBacklightSet("holes2", 0);
    }
    $scope.toggleHoles2Yes = function(){
        if ($scope.formData.HOLES2OK==0){
            $scope.formData.HOLES2OK=null;
            $scope.holes2Invalid=true;
            $scope.grandTotalInvalid=true;
            $scope.holes2Buttons= "btn btn-primary";
	    $rootScope.totalBacklightSet("holes2", null);
        } else {
            $scope.formData.HOLES2OK=0;
            $scope.holes2Buttons = "btn btn-success";
            $scope.holes2Invalid=false;
	    $rootScope.totalBacklightSet("holes2", 0);
        }
    };
    $scope.toggleHoles2No = function(){
	$scope.holes2Invalid=false;
        $scope.formData.HOLES2OK=1;
        $scope.holes2Buttons = "btn btn-danger";
	$rootScope.totalBacklightSet("holes2", 1);
    };


    $scope.holesInterButtons= "btn btn-primary";
    $scope.formData.HOLESINTEROK=null;
    $scope.holesInterInvalid=false;
    $scope.toggleHolesInterYes = function(){
        if ($scope.formData.HOLESINTEROK==0){
            $scope.formData.HOLESINTEROK=null;
            $scope.holesInterInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.holesInterButtons= "btn btn-primary";
	    $rootScope.totalBacklightSet("holesInter", null);
        } else {
            $scope.formData.HOLESINTEROK=0;
            $scope.holesInterButtons = "btn btn-success";
            $scope.holesInterInvalid=false;
	    $rootScope.totalBacklightSet("holesInter", 0);
        }
    };
    $scope.toggleHolesInterNo = function(){
	$scope.holesInterInvalid=false;
        $scope.formData.HOLESINTEROK=1;
        $scope.holesInterButtons = "btn btn-danger";
	$rootScope.totalBacklightSet("holesInter", 1);
    };


    $scope.totalBacklightButtons= "btn btn-primary";
    $scope.formData.TOTALBACKLIGHTOK=null;
    $scope.toggleTotalBacklightNo = function(){

	$scope.formData.TOTALBACKLIGHTOK=1;
	//console.log ($scope.formData.TOTALBACKLIGHTOK);
	$scope.totalBacklightButtons = "btn btn-danger";
	$scope.totalBacklightCollapsed=false;
    	$rootScope.grandTotalSet ("backlight", 1);
    };
    $scope.toggleTotalBacklightYes = function(){
	$scope.formData.TOTALBACKLIGHTOK=0;
	$scope.totalBacklightButtons = "btn btn-success";
	$scope.totalBacklightCollapsed=true;
	$rootScope.grandTotalSet ("backlight", 0);
    };
    $scope.toggleTotalBacklightNull = function(){
	$scope.formData.TOTALBACKLIGHTOK=null;
	$rootScope.grandTotalSet ("backlight", null);
    };
    $scope.toggleTotalBacklightMaybe = function(){
	$scope.formData.TOTALBACKLIGHTOK=2;
	$rootScope.grandTotalSet ("backlight", 2);
	
    };

    $rootScope.totalBacklightSet = function (section, value) {
	$rootScope.resumeBacklight[section]=value;
	//console.log($rootScope.resumeBacklight)
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumeBacklight) {
	    if ($rootScope.resumeBacklight[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumeBacklight[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumeBacklight[sec]==null) notCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalBacklightNo();
	    $rootScope.totalBacklightStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalBacklightMaybe();
	    $rootScope.totalBacklightStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalBacklightYes();
	    $rootScope.totalBacklightStatus="ok";
	} else if ((thereIsFail==0) && (notCompleted==1)) {
	    $scope.toggleTotalBacklightNull();
	    $rootScope.totalBacklightStatus="null";
	}
    };

    $scope.saveBacklightInsp = function(){
	if ($scope.formData.TOTALBACKLIGHT_COMMENT) {
        $scope.formData.TOTALBACKLIGHT_COMMENT = $scope.formData.TOTALBACKLIGHT_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_BACKLIGHT=new Date();
	//console.log($scope.formData)
	$scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
	server_operations.save_backlight_inspection($scope.formData)
        .success(function(data) {
	    $scope.backlight_save_info=true
	    $scope.formData.CHECKER_BACKLIGHT= $scope.formData.USER;
	    $scope.saving_spin=false;
            $rootScope.$emit("CallAlert", ["success", "Backlight inspection informations successfully saved in temporary table."]);
        })
        .error(function(data) {
	    $scope.saving_spin=false;
            $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
        });

    }

    $rootScope.inhibit_final=true;
    $rootScope.grandTotalSet = function (section, value) {
	$rootScope.resumeTotals[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	tnotCompleted=0;
	for (var sec in $rootScope.resumeTotals) {
	    if ($rootScope.resumeTotals[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumeTotals[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumeTotals[sec]==null) tnotCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleGrandTotalNo();
	} else if (thereIsWarning) {
	    $scope.toggleGrandTotalMaybe();
	} else if (tnotCompleted==0){
	    $scope.toggleGrandTotalYes();
	} else if ((thereIsFail==0) && tnotCompleted==1) {
	    $scope.toggleGrandTotalNull();
	}
    };

    
    $scope.saveToplightInsp = function(){
	$scope.saving_spin=true;
	if ($scope.formData.TOTALVISUAL_COMMENT){
        $scope.formData.TOTALVISUAL_COMMENT = $scope.formData.TOTALVISUAL_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.formData.CHECK_DATE_VISUAL=new Date();
	server_operations.save_toplight_inspection($scope.formData)
        .success(function(data) {
	    $scope.visual_save_info=true
	    $scope.formData.CHECKER_VISUAL= $scope.formData.USER;
	    $scope.saving_spin=false;
            $rootScope.$emit("CallAlert", ["success", "Toplight inspection informations successfully saved in temporary table."]);
        })
        .error(function(data) {
	    $scope.saving_spin=false;
            $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
        });

    }

   $scope.refresh_visual_error_inspection = function(){
           $scope.formData.all_files_and_comment=sharedProperties.printFileComment(); //here will go every information about photos and comments 
        $scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
   }

    $scope.save_visual_error_inspection = function(){
	$scope.formData.all_files_and_comment=sharedProperties.printFileComment(); //here will go every information about photos and comments 
        $scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
        server_operations.save_visual_error_inspection($scope.formData)
        .success(function(data) {
            $rootScope.$emit("CallAlert", ["success", "Visual Error informations successfully saved in temporary table."]);
        })
        .error(function(data) {
            $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
        });

    }

    //Dimensions and accuracy
    //
    
    $scope.RMFileShown=false;
    $scope.toggleRMFile = function(){
	$scope.RMFileShown = !$scope.RMFileShown;
    };

    $scope.showRMContent = function($fileContent){
	var lines = $fileContent.split("\n");
	var line_n=0;
	var value=0;
	for( line of lines) {
	    if (line_n>24) break;
	    line_n+=1;
	    if (line.indexOf("delta")>-1) {
		name=line.substring(0,7);
		value=parseFloat(line.substring(8,20));
		if (value!=NaN) {
		    string2exec="$scope.formData.RM_" + name.toUpperCase() + "=" + value;
		    eval(string2exec);
		} else {
		    string2exec="$scope.formData.RM_" + name.toUpperCase() + "=NaN" ;
		    eval(string2exec);
		    $rootScope.$emit("CallAlert", ["danger", "Error: Mean value is not a valid number:" + value]);
		}
	    } else if (line.indexOf("parallelism")>-1) {
		name=line.substring(0,12);
		value=parseFloat(line.substring(13,20));
		if (value!=NaN) {
		    string2exec="$scope.formData.RM_" + name.toUpperCase() + "=" + value;
		    eval(string2exec);
		} else {
		    string2exec="$scope.formData.RM_" + name.toUpperCase() + "=NaN" ;
		    eval(string2exec);
		    $rootScope.$emit("CallAlert", ["danger", "Error: Mean value is not a valid number:" + value]);
		}
	    } else if (line.indexOf("elongation")>-1) {
		name=line.substring(0,11);
		value=parseFloat(line.substring(12,20));
		if (value!=NaN) {
		    string2exec="$scope.formData.RM_" + name.toUpperCase() + "=" + value;
		    eval(string2exec);
		} else {
		    string2exec="$scope.formData.RM_" + name.toUpperCase() + "=NaN" ;
		    eval(string2exec);
		    $rootScope.$emit("CallAlert", ["danger", "Error: Mean value is not a valid number:" + value]);
		}
	    }


	}
	$scope.formData.RM_FILE_CONTENT = $fileContent;
    };
    $scope.rasmaskButtons= "btn btn-primary";
	$rootScope.PrintData.rasmaskButtons= "Null";
	
    $scope.rasmaskInvalid=true;
    $scope.formData.RASMASKOK=null;
    $scope.toggleRasmaskYes = function(){
	if ($scope.formData.RASMASKOK==0){
	    $scope.formData.RASMASKOK=null;
	    $scope.rasmaskInvalid=true;
            $scope.grandTotalInvalid=true;
	    $scope.rasmaskButtons= "btn btn-primary";
		$rootScope.PrintData.rasmaskButtons= "Null";
		
	    $rootScope.totalDimensionsSet("rasmask", 0);
	    $scope.showRasmask2=false;
	    $rootScope.totalDimensionsSet("rasmask2", 0);
	} else {
	    $scope.rasmaskInvalid=false;
	    $scope.formData.RASMASKOK=0;
	    $scope.rasmaskButtons = "btn btn-success";
		$rootScope.PrintData.rasmaskButtons= "Yes";
		
	    $rootScope.totalDimensionsSet("rasmask", 0);
	    $scope.showRasmask2=false;
	    $rootScope.totalDimensionsSet("rasmask2", 0);
	}
    };
    $scope.toggleRasmaskNo = function(){
	$scope.rasmaskInvalid=false;
        $scope.formData.RASMASKOK=1;
        $scope.rasmaskButtons = "btn btn-warning";
		$rootScope.PrintData.rasmaskButtons= "No";
		
	$rootScope.totalDimensionsSet("rasmask", 1);
	$scope.showRasmask2=true;
	$rootScope.totalDimensionsSet("rasmask2", null);
    };

    $scope.rasmask2Buttons= "btn btn-primary";
    $scope.rasmask2Invalid=true;
    $scope.formData.RASMASK2OK=null;
    $scope.toggleRasmask2Yes = function(){
	if ($scope.formData.RASMASK2OK==0){
	    $scope.formData.RASMASK2OK=null;
	    $scope.rasmask2Invalid=true;
            $scope.grandTotalInvalid=true;
	    $scope.rasmask2Buttons= "btn btn-primary";
	    $rootScope.totalDimensionsSet("rasmask2", null);
	} else {
	    $scope.rasmask2Invalid=false;
	    $scope.formData.RASMASK2OK=0;
	    $scope.rasmask2Buttons = "btn btn-success";
	    $rootScope.totalDimensionsSet("rasmask2", 0);
	}
    };
    $scope.toggleRasmask2No = function(){
	$scope.rasmask2Invalid=false;
        $scope.formData.RASMASK2OK=1;
        $scope.rasmask2Buttons = "btn btn-danger";
	$rootScope.totalDimensionsSet("rasmask2", 1);
    };


    $scope.totalDimensionsButtons= "btn btn-primary";
    $scope.formData.TOTALDIMENSIONSOK=null;
    $scope.toggleTotalDimensionsYes = function(){
	$scope.formData.TOTALDIMENSIONSOK=0;
	$scope.totalDimensionsButtons = "btn btn-success";
	$scope.totalDimensionCollapsed=true;
	$rootScope.grandTotalSet ("dimensions", 0);
    };
    $scope.toggleTotalDimensionsNo = function(){
	$scope.formData.TOTALDIMENSIONSOK=1;
	$scope.totalDimensionCollapsed=false;
	$scope.totalDimensionsButtons = "btn btn-danger";
	$rootScope.grandTotalSet ("dimensions", 1);
    };
    $scope.toggleTotalDimensionsNull = function(){
	$scope.formData.TOTALDIMENSIONSOK=null;
	$scope.totalDimensionCollapsed=true;
	$rootScope.grandTotalSet ("dimensions", null);
    };
    $scope.toggleTotalDimensionsMaybe = function(){
	$scope.formData.TOTALDIMENSIONSOK=2;
	$scope.totalDimensionCollapsed=true;
	$rootScope.grandTotalSet ("dimensions", 2);
	
    };

    $rootScope.totalDimensionsSet = function (section, value) {
	$rootScope.resumeDimensions[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumeDimensions) {
	    if ($rootScope.resumeDimensions[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumeDimensions[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumeDimensions[sec]==null) notCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalDimensionsNo();
	    $rootScope.totalDimensionsStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalDimensionsMaybe();
	    $rootScope.totalDimensionsStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalDimensionsYes();
	    $rootScope.totalDimensionsStatus="ok";
	} else if ((thereIsFail==0) && (notCompleted==1)) {
	    $scope.toggleTotalDimensionsNull();
	    $rootScope.totalDimensionsStatus="null";
	}
    };

    $scope.saveDimensions= function(){
	if ($scope.formData.TOTALDIMENSION_COMMENT){
        $scope.formData.TOTALDIMENSION_COMMENT = $scope.formData.TOTALDIMENSION_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_DIMENSIONS=new Date();
	server_operations.save_dimensions($scope.formData)
	.success(function(data) {
	    $scope.dimensions_save_info=true;
	    $scope.formData.CHECKER_DIMENSIONS= $scope.formData.USER;
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["success", "Dimensions information successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});
    };

    //pillars
    $scope.tapeTestButtons= "btn btn-primary";
    $rootScope.PrintData.tapeTestButtons= "Null";
    $scope.formData.TAPETESTOK=null;
    $scope.tapeTestInvalid=true;
    $scope.toggleTapeTestYes = function(){
        if ($scope.formData.TAPETESTOK==0){
            $scope.formData.TAPETESTOK=null;
            $scope.tapeTestInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.tapeTestButtons= "btn btn-primary";
			$rootScope.PrintData.tapeTestButtons= "Null";
	    $rootScope.totalPillarsSet ("tapeTest", null);
        } else {
            $scope.tapeTestInvalid=false;
            $scope.formData.TAPETESTOK=0;
            $scope.tapeTestButtons = "btn btn-success";
			$rootScope.PrintData.tapeTestButtons= "Yes";
	    $rootScope.totalPillarsSet ("tapeTest", 0);
        }
    };
    $scope.toggleTapeTestNo = function(){
	$scope.tapeTestInvalid=false;
	$scope.formData.TAPETESTOK=1;
	$scope.tapeTestButtons = "btn btn-danger";
	$rootScope.PrintData.tapeTestButtons= "No";
	$rootScope.totalPillarsSet ("tapeTest", 1);
    };

    $scope.pillarsFileShown=false;
    $scope.togglePillarsFile = function(){
	$scope.pillarsFileShown = !$scope.pillarsFileShown;
    };




    $scope.showPilMapContent = function($fileContent){
	var lines = $fileContent.split("\n");
	var line_n=0;
	var value=0;
	for( line of lines) {
	    if (line_n>47) break;
	    line_n+=1;
	    if (line.indexOf("meanPillarHeight")>-1) {
		value=parseFloat(line.substring(17,32));
		if (value>0) {
		    $scope.formData.PILLHEIGHT=value.toFixed(2);
			$rootScope.PrintData.PILLHEIGHT=value.toFixed(2);
		    $scope.pillHeight_check();
		} else {
		    $scope.formData.PILLHEIGHT=NaN;
		    $scope.pillHeight_check();
		    $rootScope.$emit("CallAlert", ["danger", "Error: Mean value is not a valid number."]);
		}
	    } else if (line.indexOf("PillarHeightStdDev")>-1) {
		value=parseFloat(line.substring(19,33));
		if (value>0) {
		    $scope.formData.PILLHEIGHTRMS=value.toFixed(2);
			$rootScope.PrintData.PILLHEIGHTRMS=value.toFixed(2);
		    $scope.pillHeightRMS_check();
		} else {
		    $scope.formData.PILLHEIGHTRMS=NaN;
		    $scope.pillHeightRMS_check();
		    $rootScope.$emit("CallAlert", ["danger", "Error: RMS value is not a valid number."]);
		}
	    } else if (line.indexOf("deltaLR")>-1) {
		value=parseFloat(line.substring(8,20));
		if (value>0) {
		    $scope.formData.DELTA_LR=value.toFixed(2);
			$rootScope.PrintData.DELTA_LR=value.toFixed(2);
		} else {
		    $scope.formData.DELTA_LR=NaN;
		    $rootScope.$emit("CallAlert", ["danger", "Error: DeltaLR value is not a valid number."]);
		}
	    } else if (line.indexOf("deltaTB")>-1) {
		value=parseFloat(line.substring(8,20));
		if (value>0) {
		    $scope.formData.DELTA_BT=value.toFixed(2);
			$rootScope.PrintData.DELTA_BT=value.toFixed(2);
		} else {
		    $scope.formData.DELTA_BT=NaN;
		    $rootScope.$emit("CallAlert", ["danger", "Error: DeltaBT value is not a valid number."]);
		}
           /* } else if (line.indexOf("warnings")>-1) {
                value=parseFloat(line.substring(8,20));
                $scope.formData.FWarnings=value.toFixed(2);
                    $rootScope.PrintData.FWarnings=value.toFixed(2);
            } else if (line.indexOf("Warning: mean pillar height out of expected range:")>-1) {
                value=parseFloat(line.substring(51,65));
                $scope.formData.FWarning1=value.toFixed(2);
                $rootScope.PrintData.FWarning1=value.toFixed(2);
            } else if (line.indexOf("Warning: pillar height too inhomogeneous. Standard deviation:")>-1) {
                value=parseFloat(line.substring(62,75));
                $scope.formData.FWarning2=value.toFixed(2);
                $rootScope.PrintData.FWarning2=value.toFixed(2);
            } else if (line.indexOf("Warning: possibly systematic trends in pillar height.")>-1) {
                value=line.substring(53,100);
                $scope.formData.FWarning3=value;
                $rootScope.PrintData.FWarning3=value;
            }*/





	    } else if (line.indexOf("warnings")>-1) {
            //    value=parseFloat(line.substring(8,20));
            } else if (line.indexOf("Warning: mean pillar height out of expected range:")>-1) {
                value=(line.substring(8,65));
		$rootScope.warningsfound = true;
		$scope.formData.Warnings.push(value);
            } else if (line.indexOf("Warning: pillar height too inhomogeneous. Standard deviation:")>-1) {
                value=(line.substring(8,75));
		$rootScope.warningsfound = true;
		$scope.formData.Warnings.push(value);
            } else if (line.indexOf("Warning: possibly systematic trends in pillar height.")>-1) {
                value=line.substring(8,100);
		$rootScope.warningsfound = true;
            	$scope.formData.Warnings.push(value);
	    }
	}
	$scope.formData.PILL_FILE_CONTENT = $fileContent;
    };

    $scope.pillHeightInvalid=true;
    $scope.pillHeight_check = function() {
        if ($scope.formData.PILLHEIGHT>=0) {
            $scope.pillHeightInvalid=false;
	    $rootScope.totalPillarsSet("pillHeight", 0);

        } else {
            $scope.pillHeightInvalid=true;
            $scope.grandTotalInvalid=true;
	    $rootScope.totalPillarsSet("pillHeight", null);
        }
    };

    $scope.pillHeightRMSInvalid=true;
    $scope.pillHeightRMS_check = function() { 
        if ($scope.formData.PILLHEIGHTRMS>=0) { 
            $scope.pillHeightRMSInvalid=false;
	    $rootScope.totalPillarsSet("pillHeightRMS", 0);

        } else {
            $scope.pillHeightRMSInvalid=true;
            $scope.grandTotalInvalid=true;
	    $rootScope.totalPillarsSet("pillHeightRMS", null);
        }
    };


    $scope.pillShiftButtons= "btn btn-primary btn-sm";
	$rootScope.PrintData.pillShiftButtons= "Null";
    $scope.formData.PILLSHIFTOK=null;
    $scope.pillShiftInvalid=true;
    $scope.togglePillShiftYes = function(){
        if ($scope.formData.PILLSHIFTOK==0){
            $scope.formData.PILLSHIFTOK=null;
            $scope.pillShiftInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.pillShiftButtons= "btn btn-primary btn-sm";
			$rootScope.PrintData.pillShiftButtons= "Null";
	    $rootScope.totalPillarsSet("pillShift", null);
        } else {
            $scope.pillShiftInvalid=false;
            $scope.formData.PILLSHIFTOK=0;
            $scope.pillShiftButtons = "btn btn-success btn-sm";
			$rootScope.PrintData.pillShiftButtons= "Yes";
	    $rootScope.totalPillarsSet("pillShift", 0);
        }
    };
    $scope.togglePillShiftNo = function(){
	$scope.pillShiftInvalid=false;
        $scope.formData.PILLSHIFTOK=1;
        $scope.pillShiftButtons = "btn btn-danger btn-sm";
		$rootScope.PrintData.pillShiftButtons= "No";
	$rootScope.totalPillarsSet("pillShift", 1);
    };

    $scope.formData.TOTALPILLARSOK=null;
    $scope.toggleTotalPillarsYes = function(){
	$scope.formData.TOTALPILLARSOK=0;
	$scope.totalPillarsCollapsed=true;
	$rootScope.grandTotalSet ("pillars", 0);
    };
    $scope.toggleTotalPillarsNo = function(){
        $scope.formData.TOTALPILLARSOK=1;
	$scope.totalPillarsCollapsed=false;
	$rootScope.grandTotalSet ("pillars", 1);
    };
    $scope.toggleTotalPillarsNull = function(){
	$scope.totalPillarsCollapsed=true;
	$scope.formData.TOTALPILLARSOK=null;
	$rootScope.grandTotalSet ("pillars", null);
    };
    $scope.toggleTotalPillarsMaybe = function(){
	$scope.totalPillarsCollapsed=true;
	$scope.formData.TOTALPILLARSOK=2;
	$rootScope.grandTotalSet ("pillars", 2);
    };

    $rootScope.totalPillarsSet = function (section, value) {
	$rootScope.resumePillars[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumePillars) {
	    if ($rootScope.resumePillars[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumePillars[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumePillars[sec]==null) notCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalPillarsNo();
	    $rootScope.totalPillarsStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalPillarsMaybe();
	    $rootScope.totalPillarsStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalPillarsYes();
	    $rootScope.totalPillarsStatus="ok";
	} else if ((thereIsFail==0) && (notCompleted==1)) {
	    $scope.toggleTotalPillarsNull();
	    $rootScope.totalPillarsStatus="null";
	}
    };

    $scope.savePillars= function(){
	if ($scope.formData.TOTALPILLARS_COMMENT){
        $scope.formData.TOTALPILLARS_COMMENT = $scope.formData.TOTALPILLARS_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_PILLARS=new Date();
	server_operations.save_pillars($scope.formData)
	.success(function(data) {
	    $scope.pillars_save_info=true;
	    $scope.formData.CHECKER_PILLARS= $scope.formData.USER;
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["success", "Pillars informations successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});
    };
	 
	 
	 
	 ///////// Capacitance
	 



    $scope.capacitanceFileShown=false;
    $scope.toggleCapacitanceFile = function(){
	$scope.capacitanceFileShown = !$scope.capacitanceFileShown;
    };

    $scope.showCapacitanceMapContent = function($fileContent){
	var lines = $fileContent.split("\n");
	var line_n=0;
	var value=0;
		$scope.formData.CAPACITANCE_FILE_CONTENT = $fileContent;
    };


    $scope.formData.TOTALCAPACITANCESOK=null;
    $scope.toggleTotalCapacitanceYes = function(){
	$scope.formData.TOTALCAPACITANCESOK=0;
	$scope.totalCapacitanceCollapsed=true;
	$rootScope.grandTotalSet ("capacitance", 0);
    };
    $scope.toggleTotalCapacitanceNo = function(){
        $scope.formData.TOTALCAPACITANCESOK=1;
	$scope.totalCapacitanceCollapsed=false;
	$rootScope.grandTotalSet ("capacitance", 1);
    };
    $scope.toggleTotalCapacitanceNull = function(){
	$scope.totalCapacitanceCollapsed=true;
	$scope.formData.TOTALCAPACITANCESOK=null;
	$rootScope.grandTotalSet ("capacitance", null);
    };
    $scope.toggleTotalPillarsMaybe = function(){
	$scope.totalCapacitanceCollapsed=true;
	$scope.formData.TOTALCAPACITANCESOK=2;
	$rootScope.grandTotalSet ("capacitance", 2);
    };


    $scope.capMean_check = function() {
        if ($scope.formData.CAPACITANCE_MEAN>=0) {
            $scope.capMeanInvalid=false;
	    $rootScope.totalCapacitanceSet("mean", 0);

        } else {
            $scope.capMeanInvalid=true;
            $scope.grandTotalInvalid=true;
	    $rootScope.totalCapacitanceSet("mean", 1);
        }
    };
	 
    $rootScope.totalCapacitanceSet = function (section, value) {
	$rootScope.resumeCapacitance[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumeCapacitance) {
	    if ($rootScope.resumeCapacitance[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumeCapacitance[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumeCapacitance[sec]==null) notCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalCapacitanceNo();
	    $rootScope.totalCapacitanceStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalCapacitanceMaybe();
	    $rootScope.totalCapacitanceStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalCapacitanceYes();
	    $rootScope.totalCapacitanceStatus="ok";
	} else if ((thereIsFail==0) && (notCompleted==1)) {
	    $scope.toggleTotalCapacitanceNull();
	    $rootScope.totalCapacitanceStatus="null";
	}
    };

    $scope.saveCapacitance= function(){
	if ($scope.formData.TOTALCAPACITANCE_COMMENT){
        $scope.formData.TOTALCAPACITANCE_COMMENT = $scope.formData.TOTALCAPACITANCE_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_CAPACITANCE=new Date();
	server_operations.save_capacitance($scope.formData)
	.success(function(data) {
	    $scope.capacitance_save_info=true;
	    $scope.formData.CHECKER_CAPACITANCE= $scope.formData.USER;
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["success", "Capacitance informations successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});
    };

    //HV connectors
    $scope.silvLineButtons= "btn btn-primary";
	$rootScope.PrintData.silvLineButtons= "Null";
	
    $scope.formData.SILVLINEOK=null;
    $scope.silvLineInvalid=true;
    $scope.toggleSilvLineYes = function(){
        if ($scope.formData.SILVLINEOK==0){
            $scope.formData.SILVLINEOK=null;
            $scope.silvLineInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.silvLineButtons= "btn btn-primary";
			$rootScope.PrintData.silvLineButtons= "Null";
			
	    $rootScope.totalHVSet("silvLine", null);
        } else {
            $scope.silvLineInvalid=false;
            $scope.formData.SILVLINEOK=0;
            $scope.silvLineButtons = "btn btn-success";
			$rootScope.PrintData.silvLineButtons= "Yes";
			
	    $rootScope.totalHVSet("silvLine", 0);
        }
    };
    $scope.toggleSilvLineNo = function(){
	$scope.silvLineInvalid=false;
        $scope.formData.SILVLINEOK=1;
        $scope.silvLineButtons = "btn btn-danger";
		$rootScope.PrintData.silvLineButtons= "No";
		
	$rootScope.totalHVSet("silvLine", 1);
    };

    $scope.silvLineInsLeftButtons= "btn btn-primary";
	$rootScope.PrintData.silvLineInsLeftButtons= "Null";
	
    $scope.formData.SILVLINEINSLEFTOK=null;
    $scope.silvLineInsLeftInvalid=true;
    $scope.toggleSilvLineInsLeftYes = function(){
        if ($scope.formData.SILVLINEINSLEFTOK==0){
            $scope.formData.SILVLINEINSLEFTOK=null;
            $scope.silvLineInsLeftInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.silvLineInsLeftButtons= "btn btn-primary";
			$rootScope.PrintData.silvLineInsLeftButtons= "Null";
			
	    $rootScope.totalHVSet("silvLineInsLeft", null);
        } else {
            $scope.silvLineInsLeftInvalid=false;
            $scope.formData.SILVLINEINSLEFTOK=0;
            $scope.silvLineInsLeftButtons = "btn btn-success";
			$rootScope.PrintData.silvLineInsLeftButtons= "Yes";
			
	    $rootScope.totalHVSet("silvLineInsLeft", 0);
        }
    };
    $scope.toggleSilvLineInsLeftNo = function(){
	$scope.silvLineInsLeftInvalid=false;
        $scope.formData.SILVLINEINSLEFTOK=1;
        $scope.silvLineInsLeftButtons = "btn btn-danger";
		$rootScope.PrintData.silvLineInsLeftButtons= "No";
		
	$rootScope.totalHVSet("silvLineInsLeft", 1);
    };

    $scope.silvLineInsRightButtons= "btn btn-primary";
	$rootScope.PrintData.silvLineInsRightButtons= "Null";
	
    $scope.formData.SILVLINEINSRIGHTOK=null;
    $scope.silvLineInsRightInvalid=true;
    $scope.toggleSilvLineInsRightYes = function(){
        if ($scope.formData.SILVLINEINSRIGHTOK==0){
            $scope.formData.SILVLINEINSRIGHTOK=null;
            $scope.silvLineInsRightInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.silvLineInsRightButtons= "btn btn-primary";
			$rootScope.PrintData.silvLineInsRightButtons= "Null";
	    $rootScope.totalHVSet("silvLineInsRight", null);
        } else {
            $scope.silvLineInsRightInvalid=false;
            $scope.formData.SILVLINEINSRIGHTOK=0;
            $scope.silvLineInsRightButtons = "btn btn-success";
			$rootScope.PrintData.silvLineInsRightButtons= "Yes";
	    $rootScope.totalHVSet("silvLineInsRight", 0);
        }
    };
    $scope.toggleSilvLineInsRightNo = function(){
	$scope.silvLineInsRightInvalid=false;
        $scope.formData.SILVLINEINSRIGHTOK=1;
        $scope.silvLineInsRightButtons = "btn btn-danger";
		$rootScope.PrintData.silvLineInsRightButtons= "No";
	$rootScope.totalHVSet("silvLineInsRight", 1);
    };

    $scope.resStripLayerLeftUpButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerLeftUpButtons= "Null";
    $scope.formData.RESSTRIPLAYERLEFTUPOK=null;
    $scope.resStripLayerLeftUpInvalid=true;
    $scope.toggleResStripLayerLeftUpYes = function(){
        if ($scope.formData.RESSTRIPLAYERLEFTUPOK==0){
            $scope.formData.RESSTRIPLAYERLEFTUPOK=null;
            $scope.resStripLayerLeftUpInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.resStripLayerLeftUpButtons= "btn btn-primary";
			$rootScope.PrintData.resStripLayerLeftUpButtons= "Null";
	    $rootScope.totalHVSet("resStripLayerLeftUp", null);
        } else {
            $scope.resStripLayerLeftUpInvalid=false;
            $scope.formData.RESSTRIPLAYERLEFTUPOK=0;
            $scope.resStripLayerLeftUpButtons = "btn btn-success";
			$rootScope.PrintData.resStripLayerLeftUpButtons= "Yes";
			
	    $rootScope.totalHVSet("resStripLayerLeftUp", 0);
        }
    };
    $scope.toggleResStripLayerLeftUpNo = function(){
	$scope.resStripLayerLeftUpInvalid=false;
        $scope.formData.RESSTRIPLAYERLEFTUPOK=1;
        $scope.resStripLayerLeftUpButtons = "btn btn-danger";
		$rootScope.PrintData.resStripLayerLeftUpButtons= "No";
		
	$rootScope.totalHVSet("resStripLayerLeftUp", 1);
    };

    $scope.resStripLayerLeftDownButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerLeftDownButtons= "Null";
    $scope.formData.RESSTRIPLAYERLEFTDOWNOK=null;
    $scope.resStripLayerLeftDownInvalid=true;
    $scope.toggleResStripLayerLeftDownYes = function(){
        if ($scope.formData.RESSTRIPLAYERLEFTDOWNOK==0){
            $scope.formData.RESSTRIPLAYERLEFTDOWNOK=null;
            $scope.resStripLayerLeftDownInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.resStripLayerLeftDownButtons= "btn btn-primary";
			$rootScope.PrintData.resStripLayerLeftDownButtons= "Null";
	    $rootScope.totalHVSet("resStripLayerLeftDown", null);
        } else {
            $scope.resStripLayerLeftDownInvalid=false;
            $scope.formData.RESSTRIPLAYERLEFTDOWNOK=0;
            $scope.resStripLayerLeftDownButtons = "btn btn-success";
			$rootScope.PrintData.resStripLayerLeftDownButtons= "Yes";
	    $rootScope.totalHVSet("resStripLayerLeftDown", 0);
        }
    };
    $scope.toggleResStripLayerLeftDownNo = function(){
	$scope.resStripLayerLeftDownInvalid=false;
        $scope.formData.RESSTRIPLAYERLEFTDOWNOK=1;
        $scope.resStripLayerLeftDownButtons = "btn btn-danger";
		$rootScope.PrintData.resStripLayerLeftDownButtons= "No";
	$rootScope.totalHVSet("resStripLayerLeftDown", 1);
    };

    $scope.resStripLayerRightUpButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerRightUpButtons= "Null";
    $scope.formData.RESSTRIPLAYERRIGHTUPOK=null;
    $scope.resStripLayerRightUpInvalid=true;
    $scope.toggleResStripLayerRightUpYes = function(){
        if ($scope.formData.RESSTRIPLAYERRIGHTUPOK==0){
            $scope.formData.RESSTRIPLAYERRIGHTUPOK=null;
            $scope.resStripLayerRightUpInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.resStripLayerRightUpButtons= "btn btn-primary";
			$rootScope.PrintData.resStripLayerRightUpButtons= "Null";
	    $rootScope.totalHVSet("resStripLayerRightUp", null);
        } else {
            $scope.resStripLayerRightUpInvalid=false;
            $scope.formData.RESSTRIPLAYERRIGHTUPOK=0;
            $scope.resStripLayerRightUpButtons = "btn btn-success";
			$rootScope.PrintData.resStripLayerRightUpButtons= "Yes";
	    $rootScope.totalHVSet("resStripLayerRightUp", 0);
        }
    };
    $scope.toggleResStripLayerRightUpNo = function(){
	$scope.resStripLayerRightUpInvalid=false;
        $scope.formData.RESSTRIPLAYERRIGHTUPOK=1;
        $scope.resStripLayerRightUpButtons = "btn btn-danger";
		$rootScope.PrintData.resStripLayerRightUpButtons= "No";
	$rootScope.totalHVSet("resStripLayerRightUp", 1);
    };

    $scope.resStripLayerRightDownButtons= "btn btn-primary";
	$rootScope.PrintData.resStripLayerRightDownButtons= "Null";
    $scope.formData.RESSTRIPLAYERRIGHTDOWNOK=null;
    $scope.resStripLayerRightDownInvalid=true;
    $scope.toggleResStripLayerRightDownYes = function(){
        if ($scope.formData.RESSTRIPLAYERRIGHTDOWNOK==0){
            $scope.formData.RESSTRIPLAYERRIGHTDOWNOK=null;
            $scope.resStripLayerRightDownInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.resStripLayerRightDownButtons= "btn btn-primary";
			$rootScope.PrintData.resStripLayerRightDownButtons= "Null";
	    $rootScope.totalHVSet("resStripLayerRightDown", null);
        } else {
            $scope.resStripLayerRightDownInvalid=false;
            $scope.formData.RESSTRIPLAYERRIGHTDOWNOK=0;
            $scope.resStripLayerRightDownButtons = "btn btn-success";
			$rootScope.PrintData.resStripLayerRightDownButtons= "Yes";
	    $rootScope.totalHVSet("resStripLayerRightDown", 0);
        }
    };
    $scope.toggleResStripLayerRightDownNo = function(){
	$scope.resStripLayerRightDownInvalid=false;
        $scope.formData.RESSTRIPLAYERRIGHTDOWNOK=1;
        $scope.resStripLayerRightDownButtons = "btn btn-danger";
		$rootScope.PrintData.resStripLayerRightDownButtons= "No";
	$rootScope.totalHVSet("resStripLayerRightDown", 1);
    };
    
    $scope.formData.RESLEFTMAX_invalid=true;
    $scope.formData.RESLEFTMAX_style={};
    $scope.formData.RESLEFTMIN_invalid=true;
    $scope.formData.RESLEFTMIN_style={};
    $scope.formData.RESRIGHTMAX_invalid=true;
    $scope.formData.RESRIGHTMAX_style={};
    $scope.formData.RESRIGHTMIN_invalid=true;
    $scope.formData.RESRIGHTMIN_style={};
    $scope.checkResistance = function (object, object_name) {
	if (object > -1 ) {
	    string2exec="$scope." + object_name + "_invalid=false"
	    eval(string2exec);
	    if (object>100) {
		string2exec="$scope." + object_name + "_style={'background-color':'red'}"
		$rootScope.totalHVSet(object_name, 1);
	    } else if (object>10) {
		string2exec="$scope." + object_name + "_style={'background-color':'orange'}"
		$rootScope.totalHVSet(object_name, 2);
	    } else if (object <11){
		string2exec="$scope." + object_name + "_style={}"
		$rootScope.totalHVSet(object_name, 0);
	    } else {
	        string2exec="$scope." + object_name + "_style={}"
                $rootScope.totalHVSet(object_name, null);
	    }
	    
	    eval(string2exec);
	} else {
	    $rootScope.totalHVSet(object_name, null);
	    string2exec="$scope." + object_name + "_invalid=true"
	    eval(string2exec);
            $scope.grandTotalInvalid=true;
	}
    };

    $scope.totalHVButtons= "btn btn-primary";
    $scope.formData.TOTALHVOK=null;
    $scope.toggleTotalHVYes = function(){
        /*if ($scope.formData.TOTALHVOK==0){
	
            $scope.formData.TOTALHVOK=null;
	    $scope.grandTotalInvalid=true;
            $scope.totalHVButtons= "btn btn-primary";
	    $scope.totalHVCollapsed=true;
	    $rootScope.grandTotalSet ("HV", null);
        } else {*/
            $scope.formData.TOTALHVOK=0;
            $scope.totalHVButtons = "btn btn-success";
	    $scope.totalHVCollapsed=true;
	    $rootScope.grandTotalSet ("HV", 0);
     //   }
    };
    $scope.toggleTotalHVNo = function(){
        $scope.formData.TOTALHVOK=1;
	$scope.totalHVCollapsed=false;
        $scope.totalHVButtons = "btn btn-danger";
	$rootScope.grandTotalSet ("HV", 0);
    };
    $scope.toggleTotalHVNull = function(){
	$scope.formData.TOTALHVOK=null;
	$rootScope.grandTotalSet ("HV", null);
    };
    $scope.toggleTotalHVMaybe = function(){
	$scope.formData.TOTALHVOK=2;
	$rootScope.grandTotalSet ("HV", 2);
	
    };

    $rootScope.totalHVSet = function (section, value) {
	$rootScope.resumeHV[section]=value;
	thereIsFail=0;
	thereIsWarning=0;
	notCompleted=0;
	for (var sec in $rootScope.resumeHV) {
	    if ($rootScope.resumeHV[sec]==1) thereIsFail=1;
	    else if ($rootScope.resumeHV[sec]==2) thereIsWarning=1;
	    else if ($rootScope.resumeHV[sec]==null) notCompleted=1;
	}
	if (thereIsFail) {
	    $scope.toggleTotalHVNo();
	    $rootScope.totalHVStatus="no";
	} else if (thereIsWarning) {
	    $scope.toggleTotalHVMaybe();
	    $rootScope.totalHVStatus="maybe";
	} else if (notCompleted==0){
	    $scope.toggleTotalHVYes();
	    $rootScope.totalHVStatus="ok";
	} else if ((thereIsFail==0) && (notCompleted==1)) {
	    $scope.toggleTotalHVNull();
	    $rootScope.totalHVStatus="null";
	}
    };


    $scope.saveHV=function(){
        if ($scope.formData.TOTALHV_COMMENT){
	$scope.formData.TOTALHV_COMMENT = $scope.formData.TOTALHV_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_HV=new Date();
	server_operations.save_HV($scope.formData)

	// if successful creation, call our get function to get all the new entries
	.success(function(data) {
	    $scope.HV_save_info=true;
	    $scope.formData.CHECKER_HV= $scope.formData.USER;
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["success", "HV information successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});

    };

    $scope.saveResistive=function(){
	if ($scope.formData.TOTALRESISTIVE_COMMENT){
        $scope.formData.TOTALRESISTIVE_COMMENT = $scope.formData.TOTALRESISTIVE_COMMENT.replace(/(?:\r\n|\r|\n)/g, '\t');
	}
	$scope.saving_spin=true;
	$scope.formData.CHECK_DATE_RESISTIVE_CHECK=new Date();
	server_operations.save_Resistive_Check($scope.formData)

	// if successful creation, call our get function to get all the new entries
	.success(function(data) {
	    $scope.Resistive_Check_save_info=true;
	    $scope.formData.CHECKER_RESISTIVE_CHECK= $scope.formData.USER;
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["success", "Resistive Check information successfully saved in temporary table."]);
	})
	.error(function(data) {
	    $scope.saving_spin=false;
	    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	});

    };

    //Grand Total
    $rootScope.grandTotalButtons= "btn btn-primary";
    $scope.formData.GRANDTOTALOK=null;
    $scope.grandTotalInvalid=true;
    $scope.toggleGrandTotalYes = function(){
	$rootScope.inhibit_final=true;
	$scope.grandTotalInvalid=false;
	$scope.formData.GRANDTOTALOK=0;
	$rootScope.grandTotalButtons = "btn btn-success";
    };
    $scope.toggleGrandTotalNo = function(){
	$rootScope.inhibit_final=true;
	$scope.grandTotalInvalid=false;
	$scope.formData.GRANDTOTALOK=1;
        $rootScope.grandTotalButtons = "btn btn-danger";
    };
    $scope.toggleGrandTotalMaybe = function(){
	$rootScope.inhibit_final=false;
	$scope.grandTotalInvalid=false;
        $rootScope.grandTotalButtons = "btn btn-warning";
    };
    $scope.toggleGrandTotalNull = function(){
	$rootScope.inhibit_final=true;
	$scope.grandTotalInvalid=true;
	$scope.formData.GRANDTOTALOK=null;
	$rootScope.grandTotalButtons = "btn btn-primary";
    };

    $scope.open_filled_date = function() {
	$scope.filled_date_popup.opened = true;
    };
    $scope.filled_date_popup = {
        opened: false
    };



    //ACTION SELECION
    $scope.actionChoice="choose"
    $scope.status = {
	action_isopen: false
    };
    $scope.toggleDropdown = function($event) {
	$event.preventDefault();
	$event.stopPropagation();
	$scope.status.action_isopen = !$scope.status.action_isopen;
    };
    $scope.actionChoiceInvalid=true;
    $scope.formData.ACTION=null;
    $scope.setActionChoice = function (choice) {
	if (choice=="keep"){
	    $scope.formData.ACTION='keep';
	    $scope.actionChoice="Keep as good"
	    $scope.actionChoiceInvalid=false;
	} else if (choice=="send_back"){ 
	    $scope.formData.ACTION='send_back';
	    $scope.actionChoiceInvalid=false;
	    $scope.actionChoice="Send back for repair"
	} else if (choice=="keep4repair"){ 
	    $scope.formData.ACTION='keep4repair';
	    $scope.actionChoiceInvalid=false;
	    $scope.actionChoice="Keep and repair"
	} else if (choice=="reject"){ 
	    $scope.formData.ACTION='reject';
	    $scope.actionChoiceInvalid=false;
	    $scope.actionChoice="Reject"
	} else if (choice=="none"){
	    $scope.formData.ACTION=null;
            $scope.actionChoiceiInvalid=true;
            $scope.grandTotalInvalid=true;
            $scope.actionChoice="choose"
        }
    };



    $scope.checking_spin=false;
    $scope.checking_spin_resistive=false;
    $scope.update = false;
    $scope.update_message_flashing=false;

    $scope.ID_invalid=true; //the error map can be show only after entering a valid ID. This because the images and the comment to be loaded on DB will have the same ID;

    $scope.formData.all_files_and_comment=sharedProperties.printFileComment(); //here will go every information about photos and comments 
    $scope.formData.all_visual_affections=sharedProperties.getVisualAffections();
    $rootScope.PrintData.all_visual_affections=sharedProperties.getVisualAffections();
    
       

    //call method print error messages
    $scope.callAlert = function(message_type, message) {
	$rootScope.$emit("CallAlert", [message_type, message]);
    }


    

    reload_from_final=function(data){
	$scope.final_save_info=true;
	Object.keys(data).forEach(function (key){
	    if ((key=="ID_LS") || (key=="ID_SE") || (key=="ID_N") || (key=="ID_N2") || (key=="TEST_BOARD")) {
	    } else {
		if (key=="GRANDTOTALOK") {
		    if (data[key]==0) {
			$scope.toggleGrandTotalYes();
		    } else if (data[key]==1) {
			$scope.toggleGrandTotalNo();
		    }
		} else if (key=="ACTION") {
		    $scope.actionChoiceInvalid=false;
		    if (data[key]=="keep") {
			$scope.formData.ACTION='keep';
			$scope.actionChoice="Keep as good";
		    } else if (data[key]=="send_back") {
			$scope.formData.ACTION='send_back';
			$scope.actionChoice="Send back for repair";
		    } else if (data[key]=="keep4repair") {
			$scope.formData.ACTION='keep4repair';
			$scope.actionChoice="Keep and repair";
		    } else if (data[key]=="reject") {
			$scope.formData.ACTION='reject';
			$scope.actionChoice="Reject"
		    }
		} else if (key=="FILLED_DATE"){
		    $scope.formData.FILLED_DATE=new Date(data[key]);
		} else {
		    string2exec="$scope.formData." + key + "=\"" +data[key] + "\""
		    eval(string2exec);
		}

	    }
	});
    }


    reload_from_HV=function(data){
	$scope.HV_save_info=true;
	Object.keys(data).forEach(function (key){
	    if (key=="SILVLINEOK"){
		if (data[key]==0){
		    $scope.toggleSilvLineYes();
		} else if (data[key]==1){
		    $scope.toggleSilvLineNo();
		}
	    } else if (key=="TEST_BOARD") {
	    } else if (key=="SILVLINEINSLEFTOK"){
		if (data[key]==0){
		    $scope.toggleSilvLineInsLeftYes();
		} else if (data[key]==1){
		    $scope.toggleSilvLineInsLeftNo();
		}
	    } else if (key=="SILVLINEINSRIGHTOK"){
		if (data[key]==0){
		    $scope.toggleSilvLineInsRightYes();
		} else if (data[key]==1){
		    $scope.toggleSilvLineInsRightNo();
		}
	    } else if (key=="RESSTRIPLAYERLEFTUPOK"){
		if (data[key]==0){
		    $scope.toggleResStripLayerLeftUpYes();
		} else if (data[key]==1){
		    $scope.toggleResStripLayerLeftUpNo();
		}
	    } else if (key=="RESSTRIPLAYERLEFTDOWNOK"){
		if (data[key]==0){
		    $scope.toggleResStripLayerLeftDownYes();
		} else if (data[key]==1){
		    $scope.toggleResStripLayerLeftDownNo();
		}
	    } else if (key=="RESSTRIPLAYERRIGHTUPOK"){
		if (data[key]==0){
		    $scope.toggleResStripLayerRightUpYes();
		} else if (data[key]==1){
		    $scope.toggleResStripLayerRightUpNo();
		}
	    } else if (key=="RESSTRIPLAYERRIGHTDOWNOK"){
		if (data[key]==0){
		    $scope.toggleResStripLayerRightDownYes();
		} else if (data[key]==1){
		    $scope.toggleResStripLayerRightDownNo();
		}
	    } else if (key.indexOf("CHECK_DATE")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
		string2exec2="$rootScope.PrintData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec2);
	    } else if (key=="TOTALHVOK") {
	    } else if (data[key]!=null){
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\""
		eval(string2exec);
		string2exec2="$rootScope.PrintData." + key + "=\"" +data[key] + "\""
		eval(string2exec2);
		if ( (key.indexOf("RESLEFTMAX")>-1) || (key.indexOf("RESLEFTMIN")>-1) || (key.indexOf("RESRIGHTMAX")>-1) || (key.indexOf("RESRIGHTMIN")>-1)) {
		    $scope.checkResistance(data[key], "formData." + key)
		}
	    }
	    else {
		string2exec="$scope.formData." + key + "=\"\""
                eval(string2exec);
                string2exec2="$rootScope.PrintData." + key + "=\"\""
                eval(string2exec2);
		}
	});
    }

    reload_from_Resistive_Check=function(data){
        $rootScope.showResMes=true;
	$scope.Resistive_Check_save_info=true;
	Object.keys(data).forEach(function (key){
	    if (key=="TEST_BOARD") {
	    } else if (key.indexOf("CHECK_DATE")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
		string2exec2="$rootScope.PrintData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec2);
	    } else if (data[key]!=null){
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\""
		
		eval(string2exec);
		string2exec2="$rootScope.PrintData." + key + "=\"" +data[key] + "\""
		eval(string2exec2);

	    } else {
                string2exec="$scope.formData." + key + "=null"
                eval(string2exec);
                string2exec2="$rootScope.PrintData." + key + "=null"
                eval(string2exec2);
		}
        });


	if ( $scope.formData.RESVALUEMEANB!="null"  && $scope.formData.RESVALUEMEANB!=null && !isNaN(parseFloat($scope.formData.RESVALUEMEANB).toFixed(2)&& $scope.formData.RESVALUEMEANB!="")){
	$scope.ResistiveMinb=$scope.formData.RESVALUEMINB;
        $rootScope.PrintData.ResistiveMinb=$scope.formData.RESVALUEMINB;
        $scope.ResistiveMaxb=$scope.formData.RESVALUEMAXB;
        $rootScope.PrintData.ResistiveMaxb=$scope.formData.RESVALUEMAXB;
        $scope.ResistiveRmsb=parseFloat($scope.formData.RESVALUERMSB).toFixed(2);
        $rootScope.PrintData.ResistiveRmsb=$scope.formData.RESVALUERMSB;
        $scope.ResistiveMeanb=parseFloat($scope.formData.RESVALUEMEANB).toFixed(2);
        $rootScope.PrintData.ResistiveMeanb=parseFloat($scope.formData.RESVALUEMEANB).toFixed(2);
        $scope.ResistiveMina=$scope.formData.RESVALUEMINA;
        $rootScope.PrintData.ResistiveMina=$scope.formData.RESVALUEMINA;
        $scope.ResistiveMaxa=$scope.formData.RESVALUEMAXA;
        $rootScope.PrintData.ResistiveMaxa=$scope.formData.RESVALUEMAXA;
        $scope.ResistiveRmsa=parseFloat($scope.formData.RESVALUERMSA).toFixed(2);
        $rootScope.PrintData.ResistiveRmsa=$scope.formData.RESVALUERMSA;
        $scope.ResistiveMeana=parseFloat($scope.formData.RESVALUEMEANA).toFixed(2);
        $rootScope.PrintData.ResistiveMeana=$scope.formData.RESVALUEMEANA;
        $scope.ResistiveRmsr=parseFloat($scope.formData.RESVALUERMSR).toFixed(2);
        $rootScope.PrintData.ResistiveRmsr=$scope.formData.RESVALUERMSR;
        $scope.ResistiveMeanr=parseFloat($scope.formData.RESVALUEMEANR).toFixed(2);
        $rootScope.PrintData.ResistiveMeanr=$scope.formData.RESVALUEMEANR;
    	if ($scope.formData.RESVALUEMINB>0 )
	{
	$scope.resitivefileuploaded= true;
	}	
	check_Res_values()
	}
	else{

        $scope.ResistiveMinb=null;
        $rootScope.PrintData.ResistiveMinb=null;
        $scope.ResistiveMaxb=null;
        $rootScope.PrintData.ResistiveMaxb=null;
        $scope.ResistiveRmsb=null;
        $rootScope.PrintData.ResistiveRmsb=null;
        $scope.ResistiveMeanb=null;
        $rootScope.PrintData.ResistiveMeanb=null;
        $scope.ResistiveMina=null;
        $rootScope.PrintData.ResistiveMina=null;
        $scope.ResistiveMaxa=null;
        $rootScope.PrintData.ResistiveMaxa=null;
        $scope.ResistiveRmsa=null;
        $rootScope.PrintData.ResistiveRmsa=null;
        $scope.ResistiveMeana=null;
        $rootScope.PrintData.ResistiveMeana=null;
        $scope.ResistiveRmsr=null;
        $rootScope.PrintData.ResistiveRmsr=null;
        $scope.ResistiveMeanr=null;
        $rootScope.PrintData.ResistiveMeanr=null;


	}
	}
    reload_from_pillars_affections=function(data){
	Object.keys(data).forEach(function (item){
	console.log(data[item].VIS_COMMENT );
	    $scope.visual_error_reload(data[item].TYPE, data[item].SEVERITY, data[item].SECTOR, data[item].VIS_COMMENT);
	});
    }

    reload_from_pillars=function(data){
	$scope.pillars_save_info=true;
	Object.keys(data).forEach(function (key){
	    if (key=="TAPETESTOK"){
		if (data[key]==0){
		    $scope.toggleTapeTestYes();
		} else if (data[key]==1) {
		    $scope.toggleTapeTestNo();
		}
	    } else if (key=="TEST_BOARD") {
	    } else if (key.indexOf("CHECK_DATE")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
		string2execroot="$rootScope.PrintData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2execroot);
	    } else if (key=="PILLSHIFTOK") {
		if (data[key]==0){
		    $scope.togglePillShiftYes();
		} else if (data[key]==1) {
		    $scope.togglePillShiftNo();
		}
	    } else if (key=="TOTALPILLARSOK") {
	    } else if (key=="DELTA_LR" && data[key]!=null) {
		string2exec="$scope.formData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
		eval(string2exec);
		string2exec2="$rootScope.PrintData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
		eval(string2exec2);
	    } else if (key=="DELTA_BT"&& data[key]!=null ) {
		string2exec="$scope.formData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
		eval(string2exec);
		string2exec2="$rootScope.PrintData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
		eval(string2exec2);
/*            } else if (key=="FWarnings") {
                string2exec="$scope.formData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec);
                string2exec2="$rootScope.PrintData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec2);
            } else if (key=="FWarning1") {
                string2exec="$scope.formData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec);
                string2exec2="$rootScope.PrintData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec2);
            } else if (key=="FWarning2") {
                string2exec="$scope.formData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec);
                string2exec2="$rootScope.PrintData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec2);
            } else if (key=="FWarning3") {
                string2exec="$scope.formData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec);
                string2exec2="$rootScope.PrintData." + key + "=parseFloat(" +data[key] + ").toFixed(2)"
                eval(string2exec2);
*/	    } else if (key=="PILL_FILE_CONTENT"&& data[key]!=null) {
		$scope.showPilMapContent(data[key]);
	    } else if(data[key]!=null){
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\""
		eval(string2exec);
		string2exec="$rootScope.PrintData." + key + "=\"" +data[key] + "\""
		eval(string2exec);
	    }
	    else{                string2exec="$scope.formData." + key + "=\"\""
                eval(string2exec);
                string2exec="$rootScope.PrintData." + key + "=\"\""
                eval(string2exec);

	}
	})
	$scope.pillHeightRMS_check()
	$scope.pillHeight_check()
	//console.log($rootScope.resumePillars)
    }
	 
    reload_from_Capacitance=function(data){

	$scope.capacitance_save_info=true;
	Object.keys(data).forEach(function (key){
	    if (key=="TAPETESTOK"){
		if (data[key]==0){
		    $scope.toggleTapeTestYes();
		} else if (data[key]==1) {
		    $scope.toggleTapeTestNo();
		}
	    } else if (key=="TEST_BOARD") {
	    } else if (key.indexOf("CHECK_DATE")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
		string2execroot="$rootScope.PrintData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2execroot);

	    } else if (key=="TOTALCAPACITANCEOK") {
	    } else if (key=="CAPACITANCE_FILE_CONTENT"&& data[key]!=null) {
		$scope.showCapacitanceMapContent(data[key]);
	    } else {
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\""
		eval(string2exec);
		string2exec="$rootScope.PrintData." + key + "=\"" +data[key] + "\""
		eval(string2exec);
	    }
	})
	 $scope.capMean_check()
    }

    reload_from_dimensions=function(data){
	$scope.dimensions_save_info=true;
	Object.keys(data).forEach(function (key){
	    if (key=="RASMASKOK"){
		if (data[key]==0){
		    $scope.toggleRasmaskYes();
		} else if (data[key]==1) {
		    $scope.toggleRasmaskNo();
		}
	    } else if (key=="RASMASK2OK"){
		if (data[key]==0){
		    $scope.toggleRasmask2Yes();
		} else if (data[key]==1) {
		    $scope.toggleRasmask2No();
		}
	    } else if (key=="TEST_BOARD") {
	    } else if (key.indexOf("CHECK_DATE")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
	    } else if (key=="TOTALDIMENSIONSOK") {
	    } else if (key=="RM_FILE_CONTENT" && data[key]!=null) {
		$scope.showRMContent(data[key]);
	    } else {
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\""
		eval(string2exec);
	    }
	});
    }


    reload_from_BLOBs=function(data){
	Object.keys(data).forEach(function (item){
		console.log(data[item].FILENAME);
		$scope.deleteFileComment(data[item].FILENAME);
	    sharedProperties.addFileComment(
		data[item].FILENAME,
		data[item].DESCRIPTION,
		data[item].SECTOR
	    );
	    if (data[item].FILENAME.indexOf("manufReport")>-1) {
		$rootScope.manufReportLoaded=true;
//        console.log("application/pdf")
//	console.log(data[item].CONTENT) 
 //              blob = new Blob([data[item].CONTENT], { type: 'application/pdf' }),
//        url = $window.URL || $window.webkitURL;
//   $scope.fileUrl = url.createObjectURL(blob);
// window.open($scope.fileUrl, '_blank');
 	    } else if (data[item].FILENAME.indexOf("pdf")>-1) {


	    }else if (data[item].FILENAME.indexOf("nonConformityReport")>-1) {
		$rootScope.manufReportLoaded=true;

	    } else if (data[item].FILENAME.indexOf("connectorPicture")>-1) {
        	$rootScope.ConnectorAnalyzedFilename = data[item].FILENAME; 
          
	    } else if (data[item].FILENAME.indexOf("resistiveFile")>-1) {
        	$rootScope.ResistiveFilename = data[item].FILENAME; 
	
	    } else if (data[item].FILENAME.indexOf("pillarsFile")>-1) {
        	$rootScope.ResistiveFilename = data[item].FILENAME; 
	   }
	});
	$rootScope.VisAffBlobNumber=sharedProperties.getVisualAffectionsBlobN();
	//$rootScope.PillAffBlobNumber=sharedProperties.getPillarsAffectionsBlobN();
    }

    reload_from_visual_affections=function(data){
	Object.keys(data).forEach(function (item){
	//   console.log(data[item])
 	   $scope.visual_error_reload(data[item].TYPE, data[item].SEVERITY, data[item].SECTOR, data[item].VIS_COMMENT);
	});
    }

    reload_from_backlight=function(data){
	$scope.backlight_save_info=true;
	Object.keys(data).forEach(function (key){
	    if (key.indexOf("CHECK_DATE_BACKLIGHT")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
	    } else if (key=="TEST_BOARD") {
	    } else if (key=="TOTALBACKLIGHTOK") {
	    } else if (key=="EDGESOK") {
		if (data[key]==0){
		    $scope.toggleEdgesCleanYes();
		} else if (data[key]==1) {
		    $scope.toggleEdgesCleanNo();
		}
	    } else if (key=="EDGESACC") {
		if (data[key]==0){
		    $scope.toggleEdgesAccuratelyYes();
		} else if (data[key]==1) {
		    $scope.toggleEdgesAccuratelyNo();
		}
	    } else if (key=="HOLESOK") {
		if (data[key]==0){
		    $scope.toggleHolesYes();
		} else if (data[key]==1) {
		    $scope.toggleHolesNo();
		}
	    } else if (key=="HOLES2OK") {
		if (data[key]==0){
		    $scope.toggleHoles2YesYes();
		} else if (data[key]==1) {
		    $scope.toggleHoles2No();
		}
	    } else if (key=="HOLESINTEROK") {
		if (data[key]==0){
		    $scope.toggleHolesInterYes();
		} else if (data[key]==1) {
		    $scope.toggleHolesInterNo();
		}
	    } else {
		if (data[key]!=null){
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\"";
		eval(string2exec);
		string2execPrint="$rootScope.PrintData." + key + "=\"" +data[key] + "\"";
		eval(string2execPrint);
		if ( (key.indexOf("ALIGN_LEFT_S")>-1) || (key.indexOf("ALIGN_LEFT_L")>-1) || (key.indexOf("ALIGN_RIGHT_S")>-1) || (key.indexOf("ALIGN_RIGHT_L")>-1)) {
		    $scope.alignement_check(data[key], "formData." + key)
		}
		if ( (key.indexOf("EDGELEFTUP")>-1) || (key.indexOf("EDGELEFTDOWN")>-1) || (key.indexOf("EDGERIGHTUP")>-1) || (key.indexOf("EDGERIGHTDOWN")>-1)) {
		    $scope.edges_check(data[key], "formData." + key)
		}
		}
		else{
                string2exec="$scope.formData." + key + "=\"\"";
                eval(string2exec);
                string2execPrint="$rootScope.PrintData." + key + "=\"\"";
                eval(string2execPrint);
		}
	    }
	    $scope.DBTransitions_check ();
	});
	//console.log($rootScope.resumeBacklight)
    };

    reload_from_toplight=function(data){
	$scope.visual_save_info=true;
	//console.log(data)
	Object.keys(data).forEach(function (key){
	    if (key=="KAPTONCUTOK"){
		if (data[key]==0){1
		    $scope.toggleKaptonCutButtonsYes();
		} else if (data[key]==1){
		    $scope.toggleKaptonCutButtonsNo();
		}
	    } else if (key=="TEST_BOARD") {
	    } else if (key=="KAPTONGLUEDOK"){
		if (data[key]==0){
		    $scope.toggleKaptonGluedButtonsYes();
		} else if (data[key]==1){
		    $scope.toggleKaptonGluedButtonsNo();
		}
            } else if (key=="COVERLAYBUBBLESOK"){
                if (data[key]==0){
                    $scope.toggleCoverlayBubblesButtonsYes();
                } else if (data[key]==1){
                    $scope.toggleCoverlayBubblesButtonsNo();
                }
	    } else if (key.indexOf("CHECK_DATE_VISUAL")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
	    } else if (key=="TOTALVISUALOK") {
	    } else if (key=="TEST_BOARD") {
	    } else if (data[key]!=null){
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\"";
		eval(string2exec);
	    }
	    else {
		console.log( "jnejwnw");
		string2exec="$scope.formData." + key + "=\"\"";
                eval(string2exec);
		}
	});
	$rootScope.showConnectorWidths=true;
       if ($scope.formData.COPPERWIDTHMEAN!="null" &&  !isNaN(parseFloat($scope.formData.COPPERWIDTHMEAN).toFixed(2)&& $scope.formData.COPPERWIDTHMEAN!="")){

	$scope.copperStripWidth=parseFloat($scope.formData.COPPERWIDTHMEAN).toFixed(2) + " +- " + parseFloat($scope.formData.COPPERWIDTHSIGMA).toFixed(2) ;
	$rootScope.PrintData.copperStripWidth=parseFloat($scope.formData.COPPERWIDTHMEAN).toFixed(2) + " +- " + parseFloat($scope.formData.COPPERWIDTHSIGMA).toFixed(2) ;

	$scope.connectorGapsWidth=parseFloat($scope.formData.GAPSWIDTHMEAN).toFixed(2) + " +- " + parseFloat($scope.formData.GAPSWIDTHSIGMA).toFixed(2) ;
	$rootScope.PrintData.connectorGapsWidth=parseFloat($scope.formData.GAPSWIDTHMEAN).toFixed(2) + " +- " + parseFloat($scope.formData.GAPSWIDTHSIGMA).toFixed(2);

	$scope.connectorRatio=parseFloat($scope.formData.COPPERGAPSRATIO).toFixed(2) + " +- " +  parseFloat($scope.formData.COPPERGAPSRATIOERROR).toFixed(2);
	$rootScope.PrintData.connectorRatio=parseFloat($scope.formData.COPPERGAPSRATIO).toFixed(2) + " +- " +  parseFloat($scope.formData.COPPERGAPSRATIOERROR).toFixed(2);

	$scope.totalToplightSet("connector",0);
	check_connector_ratio();
	}
	else if($scope.formData.COPPERWIDTHMEAN==""){
	$scope.copperStripWidth="";
	$rootScope.PrintData.copperStripWidth="";

	$scope.connectorGapsWidth="";
	$rootScope.PrintData.connectorGapsWidth="";

	 $scope.connectorRatio="";
	$rootScope.PrintData.connectorRatio="";
	}
	//$scope.getPictureAnalyzed();
    };

    //reload_from_resMes=function(data){
    //    $rootScope.showResMes=true;
    //    $scope.ResistiveMin=$scope.formData.RESVALUEMIN.toFixed(2);
    //    $rootScope.PrintData.ResistiveMin=$scope.formData.RESVALUEMIN.toFixed(2);

    //    $scope.ResistiveMax=$scope.formData.RESVALUEMAX.toFixed(2);
    //    $rootScope.PrintData.ResistiveMax=$scope.formData.RESVALUEMAX.toFixed(2);

    //    $scope.ResistiveMean=$scope.formData.RESVALUEMEAN.toFixed(2);
    //    $rootScope.PrintData.ResistiveMean=$scope.formData.RESVALUEMEAN.toFixed(2);
    //};

    reload_from_logistic_integration=function(data){
	Object.keys(data).forEach(function (key){
	    $scope.logistic_save_info=true;
	    if (key.indexOf("DATE")>-1){
		string2exec="$scope.formData." + key + "= new Date(\"" + data[key] + "\")"
		eval(string2exec);
	    } else if (key=="TEST_BOARD") {
	    } else if(key.indexOf("SUPPLIER")>-1){
		//string2exec="$scope.setManufChoice(\'"+ data[key] +"\')";
		//eval(string2exec);
	    } else if (key.indexOf("MANUFREPORTOK")>-1){
		if (data[key]==0){
		    $scope.toggleManufButtonsYes();
		} else if (data[key]==1) {
		    $scope.toggleManufButtonsNo();
		}
	    } else if (key.indexOf("MANUFREPORTBAD")>-1){
		if (data[key]==1){
                         $scope.manufReport2Invalid=true;
                        $scope.formData.MANUFREPORTBAD=1;
                        $scope.manufReportBadUploadIsCollapsed=true;
                        $scope.manufButtons2 = "btn btn-danger";
                        $rootScope.PrintData.manufButtons2= "Yes";
		} else if (data[key]==0) {

			 $scope.manufReport2Invalid=false;
           		$scope.formData.MANUFREPORTBAD=0;
          		$scope.manufReportBadUploadIsCollapsed=true;
            		$scope.manufButtons2 = "btn btn-success";
            		$rootScope.PrintData.manufButtons2= "No";

		}
	    } else {
		string2exec="$scope.formData." + key + "=\"" +data[key] + "\"";
		eval(string2exec);
	    }
	});
    };

    $scope.res_foil=[]
    $scope.res_foil.GRADE=null;
    $scope.hasEdgeTop=null;


    $rootScope.resumeLogistic={
	"board": false,
	"foil": false
    };
    $scope.parentDisabled=true;
    $scope.totalLogisticSet = function (section, value) {
	$rootScope.resumeLogistic[section]=value;
	var there_is_false=false;
	for (var sec in $rootScope.resumeLogistic) {
	    if (!$rootScope.resumeLogistic[sec]) there_is_false=true;
	}
	if (there_is_false) {
	    $scope.parented=false;
	    $scope.parentDisabled=true;
	} else {
	    $scope.parentDisabled=false;
	}
    };

    $scope.parented=false;
	$scope.checking_spin_parented=false;
    $scope.link_board_and_foil = function() {
	$scope.checking_spin_parented=true;
	server_operations.parent($scope.formData.ID_EQUIPMENT, $scope.formData.PARTSBATCHMTFID, $scope.res_foil.ID_EQUIPMENT, $scope.res_foil.PARTSBATCHMTFID,  $scope.USER_CNAME)
	    .success(function(data) {    
	$scope.checking_spin_parented=false;
		$scope.parented=true;
		$rootScope.$emit("CallAlert", ["success", "Board " + $scope.formData.ID_EQUIPMENT + " and foil " + $scope.res_foil.ID_EQUIPMENT + " successfully parented"]);
	    })
	    .error(function(data) {
	$scope.checking_spin_parented=false;
		$rootScope.$emit("CallAlert", ["danger", "Error: " + data]);
	    })

    };

    $scope.checking_spin_resistive=false;
    $scope.checkResistiveFoilData = function() {
	$scope.res_id_message=null;
	$scope.checking_spin_resistive=true;
	tmp_res_id=$scope.formData.RESFOILIDALIAS;
	var pcb_id = $rootScope.PrintData.pcb_id;
	tmp_res_id = pcb_id.charAt(0).toUpperCase() + pcb_id.charAt(1).toUpperCase() + pcb_id.charAt(2) + "_" + $scope.formData.RESFOILIDALIAS;
	var pattern=new RegExp("([lsLS]+[EeSs]+[0-9]+[_]+[0-9]+[0-9]+[0-9]+[0-9]+[0-9])");
	//var pattern=new RegExp("(\\b([lsLS]+[EeSs]+[1-8]+[0-9]+[0-9]+[0-9])\\b)");
	if (pattern.test(tmp_res_id)) {

	    server_operations.checkLog(tmp_res_id, "resfoil")
	    .success(function(data) {
		$scope.totalLogisticSet("foil",true);

		for (sub_data in data.resu){ 
		    $scope.boardLogDetails=true; 


		    $scope.foilIdDisabled=false;
		    $scope.parentDisabled=false;
		    $scope.foilLogDetails=true;


		    thetable=Object.keys(data.resu[sub_data]); 
		    theobject=data.resu[sub_data][thetable];
		    for (row in theobject.rows) { 
			therow=theobject.rows[row]; 
			for (item in therow){ 
			    if (item.indexOf("DATE")>-1) { 
				string2exec="$scope.res_foil." + item + "= new Date(\"" + therow[item] + "\")" 
				string2execPRINT="$rootScope.PrintData.RES" + item + "= new Date(\"" + therow[item] + "\")" 

			    } else { 
				string2exec="$scope.res_foil." + item + "=\"" +therow[item] + "\""; 
				string2execPRINT="$rootScope.PrintData.RES" + item + "=\"" +therow[item] + "\""; 

			    } 
			    eval(string2exec); 
			    eval(string2execPRINT); 

			    if (theobject.rows.length>1) { 
				$scope.moreLogisticFoil.push({"column": thetable + '.row' + row + '.' + item, "value": therow[item]}); 
			    } else { 
				$scope.moreLogisticFoil.push({"column": thetable + '.' + item, "value": therow[item]}); 
			    } 
			}; 
		    } 
		} 


		server_operations.checkResFoil(tmp_res_id)
		.success(function(data) {
		    $scope.checking_spin_resistive=false;
		    $scope.res_foil.GRADE=data.resu.rows[0].TOTAL_GRADE
		})
		.error(function(data) {
		    $scope.checking_spin_resistive=false;
		    if (data.indexOf("Entry is not present in the DB")> -1) {
			$scope.res_id_message="Ok, you can continue";
		    } else {
			$rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
		    }
		})
	    })
	    .error(function(data) {
		$scope.totalLogisticSet("foil",false);
		if (data.indexOf("Entry is not present in the logistic DB")> -1) {
		    $scope.res_id_message="No entry with this ID in the logistic database. But you can continue!";
		    //$rootScope.$emit("CallAlert", ["danger", "The foil with ID " + tmp_res_id + " is not present the logistic database!"]);
		    $scope.checking_spin_resistive=false;
        	    //var ID_ls=tmp_res_id.charAt(0).toUpperCase() + tmp_res_id.charAt(1).toUpperCase() + parseInt(tmp_res_id.charAt(2)) + '00' + parseInt(tmp_res_id.charAt(3)+ tmp_res_id.charAt(4) + tmp_res_id.charAt(5));
                    var ID_ls=tmp_res_id;
		    //$scope.res_foil.PARTSBATCHMTFID="20MNMF" + ID_ls;
                    $scope.res_foil.PARTSBATCHMTFID=ID_ls;

                server_operations.checkResFoil(tmp_res_id)
                .success(function(data) {
                    $scope.checking_spin_resistive=false;
                    $scope.res_foil.GRADE=data.resu.rows[0].TOTAL_GRADE
                })
                .error(function(data) {
                    $scope.checking_spin_resistive=false;
                    if (data.indexOf("Entry is not present in the DB")> -1) {
                        $scope.res_id_message="No entry with this ID in the Log DB, you can continue";
			// we are setting the 'parented' flag to true as workaround to enable the filling of all the QC when there is no resistive foil in the DB
	    		$scope.parented=true;
                    } else {
                        $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
                    }
                })


		} else {
		    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
		    $scope.checking_spin_resistive=false;
		}

	    })

	} else {
	    $scope.totalLogisticSet("foil",false);
	    $scope.res_id_message="This ID is invalid";
	    $scope.checking_spin_resistive=false;
	}
    }

    //checking the presence on the DB of the pcb id
    $scope.checkData = function(){
	$scope.totalLogisticSet("board",false);
	var tmp_pcb_id=$scope.formData.pcb_id;
	
        $rootScope.PrintData.pcb_id=tmp_pcb_id;
	console.log(tmp_pcb_id);
	$scope.checking_spin=true;

	//clean all the cleanable: we are switching to another Io
	initializeForm();
	$scope.res_foil=[];
	$scope.foilIdDisabled=false;

	//for(var key in $scope.formData){
    	//	if(key[0] != '$' && key != 'this' && key != "Warnings"){
        //	$scope.formData[key]= "";
    	//}

	//}
	//checking the regexp of the field
	//var pattern= new RegExp("(\\b([lsLS]+[EeSs]+[1-8]+[0-9]+[0-9]+[0-9])\\b))|(\\b([lsLS]+[EeSs]+[1-8]+[0-9]+[0-9]+[0-9]+[tT]+[eE]+[sS]+[tT])\\b)");
        var pattern= new RegExp("(\\b([lsLS]+[EeSs]+[1-8]+[0-9]+[0-9]+[0-9])\\b)|(\\b([lsLS]+[EeSs]+[1-8]+[0-9]+[0-9]+[0-9]+[tT]+[eE]+[sS]+[tT])\\b)");
	if (pattern.test(tmp_pcb_id)) {
	    check_board_type(tmp_pcb_id);


	    $scope.foilIdDisabled=false;
	    $scope.parentDisabled=true;
	    $scope.parented=false;
	    $scope.res_id_message=null;
	    $scope.foilLogDetails=false;
	    $scope.parentingLogDetails=false;

	    server_operations.checkLog(tmp_pcb_id, "board")
	    .success(function(data) {
		$scope.totalLogisticSet("board",true);
		for (sub_data in data.resu){
		    $scope.boardLogDetails=true;

		    if (Object.keys(data.resu[sub_data])=='parent') {
			//the data inside this object belongs to the parented foil
			$scope.foilIdDisabled=true;
			$scope.parentDisabled=false;
			$scope.parented=true;
			$scope.res_id_message="This combination board/resistive is already parented in logistic DB";
			$scope.foilLogDetails=true;
			$scope.parentingLogDetails=true;
			parent_object=data.resu[sub_data]["parent"]
			for (item in parent_object){
			    thetable=Object.keys(parent_object[item]);
			    theobject=parent_object[item][thetable];
			    for (row in theobject.rows){
				therow=theobject.rows[row];
				for (actualdata in therow){
				   // if (actualdata=="PARTSBATCHMTFID"){
				//	$scope.formData.RESFOILID=therow["PARTSBATCHMTFID"].substr(6,3) + therow["PARTSBATCHMTFID"].substr(11,20);
				//	$rootScope.PrintData.RESFOILID=therow["PARTSBATCHMTFID"].substr(6,3) + therow["PARTSBATCHMTFID"].substr(11,20);
				    
				//	} 
				    if (actualdata.indexOf("OTHERID")>-1) {


				    	$scope.formData.RESFOILIDALIAS = therow[actualdata].substr(4,20); 
				    }
				    else if (actualdata.indexOf("DATE")>-1) {
					string2exec="$scope.res_foil." + actualdata + "= new Date(\"" + therow[actualdata] + "\");";
					string2execPRINT="$rootScope.PrintData.RES" + actualdata + "= new Date(\"" + therow[actualdata] + "\");";
				    } else {
					string2exec="$scope.res_foil." + actualdata + "=\"" + therow[actualdata] + "\";";
					string2execPRINT="$rootScope.PrintData.RES"+ actualdata + "=\"" + therow[actualdata] + "\";";
				    };
				    eval(string2exec);
				    eval(string2execPRINT);
				    if (theobject.rows.length>1) {
					if (thetable[0]=='parenting') {
					    $scope.moreLogisticParenting.push({"column": thetable + '.row' + row + '.'  + actualdata, "value": therow[actualdata]});
					} else {
					    $scope.moreLogisticFoil.push({"column": thetable + '.row' + row + '.'  + actualdata, "value": therow[actualdata]});
					}
				    } else {
					if (thetable[0]=='parenting') {
					    $scope.moreLogisticParenting.push({"column": thetable + '.'  + actualdata, "value": therow[actualdata]});
					} else {
					    $scope.moreLogisticFoil.push({"column": thetable + '.'  + actualdata, "value": therow[actualdata]});
					};
				    }
				}
			    }
			};
		    } else {
			thetable=Object.keys(data.resu[sub_data]);
			theobject=data.resu[sub_data][thetable]
			for (row in theobject.rows) {
			    therow=theobject.rows[row];
			    for (item in therow){
				if (item.indexOf("DATE")>-1) {
				    string2exec="$scope.formData." + item + "= new Date(\"" + therow[item] + "\")"
				    string2execPRINT="$rootScope.PrintData." + item + "= new Date(\"" + therow[item] + "\")"

				} else {
				    string2exec="$scope.formData." + item + "=\"" +therow[item] + "\"";
					string2execPRINT="$rootScope.PrintData." + item + "=\"" +therow[item] + "\"";
				}
				eval(string2exec);

				eval(string2execPRINT);
				if (theobject.rows.length>1) {
				    $scope.moreLogisticBoard.push({"column": thetable + '.row' + row + '.' + item, "value": therow[item]});
				} else {
				    $scope.moreLogisticBoard.push({"column": thetable + '.' + item, "value": therow[item]});
				}
			    };
			}
		    }

		}
		/*
		if (Object.keys(data.resu.rows).length==2) {
		    for (item in data.resu.rows[0]){
			if (item.indexOf("DATE")>-1) {
			    string2exec="$scope.formData." + item + "= new Date(\"" + data.resu.rows[0][item] + "\")"
			} else {
			    string2exec="$scope.formData." + item + "=\"" +data.resu.rows[0][item] + "\"";
			}
			eval(string2exec);
			$scope.moreLogisticBoard.push({"column": item, "value": data.resu.rows[0][item]});
		    };
		    for (item in data.resu.rows[1]){
			if (item.indexOf("DATE")>-1) {
			    string2exec="$scope.res_foil." + item + "= new Date(\"" + data.resu.rows[1][item] + "\")"
			} else {
			    string2exec="$scope.res_foil." + item + "=\"" +data.resu.rows[1][item] + "\"";
			}
			eval(string2exec);
			$scope.moreLogisticFoil.push({"column": item, "value": data.resu.rows[1][item]});
		    };
		    $scope.formData.RESFOILID=data.resu.rows[1]["PARTSBATCHMTFID"].substr(6,3) + "_" + data.resu.rows[1]["PARTSBATCHMTFID"].substr(9,20)
		    $scope.foilIdDisabled=true;
		    $scope.parented=true;
		    $scope.res_id_message="This combination board/resistive is already parented in logistic DB";
		    $scope.boardLogDetails=true;
		    $scope.foilLogDetails=true;


		} else {
		    for (item in data.resu.rows[0]){
			if (item.indexOf("DATE")>-1) {
			    string2exec="$scope.formData." + item + "= new Date(\"" + data.resu.rows[0][item] + "\")"
			} else {
			    string2exec="$scope.formData." + item + "=\"" +data.resu.rows[0][item] + "\"";
			}
			eval(string2exec);
		    };
		    $scope.foilIdDisabled=false;
		}
		*/
		if (tmp_pcb_id.charAt(6).toUpperCase()=='T') {
		    $rootScope.$emit("CallAlert", ["warning", "testing: logistic informations are from  20MNMBSE209998"]);
		}
		//we check whether temporary data is present
		server_operations.check(tmp_pcb_id, $scope.formData.TEST_BOARD)
		.success(function(data) {
		$rootScope.AlreadyDefinitiveTable=false;
		    $scope.formData.pcb_id=tmp_pcb_id;
		    if (data.message=="Entry is present in the temporary table(s)"){
			$scope.update_message="This board is partially checked, please complete the form."
			
			$scope.update = false;
			$scope.update_message_flashing=false;
			data.result.forEach( function (item, index, object){
			    if (item==null){
				return;
			    } else if (item.message=="Entry is present in the table logistic_table_tmp"){
				reload_from_logistic_integration(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table toplight_inspection_tmp"){
				//console.log("Entry is present in the table toplight_inspection_tmp");
				reload_from_toplight(item.result.rows[0]);
                            //} else if (item.message=="Entry is present in the table res_mes_tmp"){
                            //    reload_from_resMes(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table backlight_inspection_tmp"){
				//console.log("Entry is present in the table backlight_inspection_tmp");
				reload_from_backlight(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table visual_errors_tmp"){
			//	console.log("Entry is present in the table visual_errors_tmp");
				reload_from_visual_affections(item.result.rows);
			    } else if (item.message=="Entry is present in the table all_blobs_tmp"){
				//console.log("Entry is present in the table all_blobs_tmp");
				reload_from_BLOBs(item.result);
			    } else if (item.message=="Entry is present in the table dimensions_tmp"){
				//console.log("Entry is present in the table dimensions_tmp");
				reload_from_dimensions(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table pillars_inspection_tmp"){
				//console.log("Entry is present in the table pillars_inspection_tmp");
				reload_from_pillars(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table pillars_errors_tmp"){
				//console.log("Entry is present in the table pillars_errors_tmp");
				reload_from_pillars_affections(item.result.rows);
			    } else if (item.message=="Entry is present in the table hv_tmp"){
				//console.log("Entry is present in the table hv_tmp");
				reload_from_HV(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table Resistive_Check_tmp"){
				//console.log("Entry is present in the table resistive_check_tmp");
				reload_from_Resistive_Check(item.result.rows[0]);
				 } else if (item.message=="Entry is present in the table Capacitance_Check_tmp"){
		//console.log("Entry is present in the table resistive_check_tmp");
				reload_from_Capacitance(item.result.rows[0]);
			    } else {
				console.log("what's here? " + item.message);
			    }
			});
			sharedProperties.setPcbId($scope.formData.pcb_id);
			console.log("working on "+ sharedProperties.getPcbId())
			$scope.ID_invalid=false;
			$scope.checking_spin=false;

		    } else if (data.message=="Entry is present in the definitive tables"){

			$rootScope.AlreadyDefinitiveTable=true;
			$scope.update_message="This board is already checked in full, are you sure we want to update it?"
			$scope.update_message_flashing=true;
			$scope.update = true;
			data.resu.forEach( function (item, index, object){
			    if (item==null){
				return;
			    } else if (item.message=="Entry is present in the table logistic_table"){
				reload_from_logistic_integration(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table toplight_inspection"){
				reload_from_toplight(item.result.rows[0]);
                            //} else if (item.message=="Entry is present in the table res_mes"){
                            //    reload_from_resMes(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table backlight_inspection"){
				reload_from_backlight(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table visual_errors"){
				reload_from_visual_affections(item.result.rows);
			    } else if (item.message=="Entry is present in the table all_blobs"){
				reload_from_BLOBs(item.result);
			    } else if (item.message=="Entry is present in the table dimensions"){
				reload_from_dimensions(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table pillars_inspection"){
				reload_from_pillars(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table pillars_errors"){
				reload_from_pillars_affections(item.result.rows);
			    } else if (item.message=="Entry is present in the table hv"){
				reload_from_HV(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table Resistive_Check"){
				reload_from_Resistive_Check(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table Capacitance_Check"){
//console.log("Entry is present in the table resistive_check_tmp");
				reload_from_Capacitance(item.result.rows[0]);
			    } else if (item.message=="Entry is present in the table final_decision"){
				reload_from_final(item.result.rows[0]);
			    } else {
				console.log("what's here? " + item.message);
			    }
			});
			sharedProperties.setPcbId($scope.formData.pcb_id);
			console.log("working on "+ sharedProperties.getPcbId())
			$scope.ID_invalid=false;
			$scope.checking_spin=false;
			}
		    })
		    .error(function(data) {
			if (data.indexOf("Entry is not present in the DB")> -1) {
			    $scope.formData.pcb_id=tmp_pcb_id;
			    $scope.update_message="Ok, you can continue with the QC check";
			    $scope.update_message_flashing=false;
			    sharedProperties.setPcbId($scope.formData.pcb_id);
			    $scope.ID_invalid=false;
			    $scope.checking_spin=false;
			    $scope.update = false;
			} else if (data.indexOf("Entry is invalid")> -1) {
			    $scope.formData.pcb_id=tmp_pcb_id;
			    console.info("Entry is invalid, no DB check has been done");
			    $scope.ID_invalid=true;
			    $scope.checking_spin=false;
			} else {
			    $scope.ID_invalid=true;
			    $scope.checking_spin=false;
			    $scope.update = false;
			    $scope.update_message_flashing=false;
			    $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
			}
		    })
		})
		.error(function(data) {
		    $scope.totalLogisticSet("board",false);
		    if (data.indexOf("Entry is not present in the logistic DB")> -1) {
			$scope.formData.pcb_id=tmp_pcb_id;
			$scope.update_message="No entry with this ID in the logistic database. You cannot continue!";
			$scope.update_message_flashing=true;
			sharedProperties.setPcbId($scope.formData.pcb_id);
			$scope.ID_invalid=false;
			$scope.checking_spin=false;
			$scope.update = true;
			$rootScope.$emit("CallAlert", ["danger", "The board with ID " + tmp_pcb_id + " is not present the logistic database!"]);
		    } else {
			$scope.ID_invalid=true;
			$scope.checking_spin=false;
			$scope.update = false;
			$scope.update_message_flashing=false;
			$rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
		    }

		})

	    } else {
		$scope.totalLogisticSet("board",false);
		$scope.formData.pcb_id=tmp_pcb_id;
		$scope.update_message="This ID is invalid";
		$scope.checking_spin=false;
	    }


    };


    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    $scope.createEntry = function() {
	$scope.final_spin=true;
	//adding the missing dates
	if ( ($scope.formData.CHECK_DATE_LOGISTIC==null) || ($scope.formData.CHECK_DATE_LOGISTIC=="Invalid Date")) {
	    $scope.formData.CHECK_DATE_LOGISTIC=new Date();
	};
	if (($scope.formData.CHECK_DATE_VISUAL==null)  || ($scope.formData.CHECK_DATE_VISUAL=="Invalid Date")) {
	    $scope.formData.CHECK_DATE_VISUAL=new Date();
	};
	if (($scope.formData.CHECK_DATE_DIMENSIONS==null)  || ($scope.formData.CHECK_DATE_DIMENSIONS=="Invalid Date")) {
	    $scope.formData.CHECK_DATE_DIMENSIONS=new Date();
	};
	if (($scope.formData.CHECK_DATE_PILLARS==null)  || ($scope.formData.CHECK_DATE_PILLARS=="Invalid Date")) {
	    $scope.formData.CHECK_DATE_PILLARS=new Date();
	};
	if (($scope.formData.CHECK_DATE_HV==null)  || ($scope.formData.CHECK_DATE_HV=="Invalid Date")){
	    $scope.formData.CHECK_DATE_HV=new Date();
	};

	// if form is empty, nothing will happen
	if ($scope.formData.pcb_id != undefined) {

	    // call the create function from our service (returns a promise object)
	       server_operations.create($scope.formData)

	    // if successful creation, call our get function to get all the new entries
	   .success(function(data) {
		$scope.final_spin=false;
		//$scope.formData = {}; // clear the form so our user is ready to enter another
		//$scope.entries = data; // assign our new list of entries
		$rootScope.$emit("CallAlert", ["success", "Entry successfully added"]);
	    })
	    .error(function(data) {
		$scope.final_spin=false;
		$rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
	    });


		server_operations.AddLogDecision($scope.formData.ID_EQUIPMENT, $scope.formData.PARTSBATCHMTFID, $scope.res_foil.ID_EQUIPMENT, $scope.res_foil.PARTSBATCHMTFID,  $scope.USER_CNAME, $scope.formData.GRANDTOTALOK)

            .success(function(data) {
                $scope.final_spin=false;
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.entries = data; // assign our new list of entries
                $rootScope.$emit("CallAlert", ["success", "Entry successfully added in the LOGISTIC"]);
            })
            .error(function(data) {
                $scope.final_spin=false;
                $rootScope.$emit("CallAlert", ["danger", "Database error: " + data]);
            });
	}
    };



}])
.controller('dateController', ['$scope', 'server_operations', 'sharedProperties', '$timeout', function ($scope, server_operations, sharedProperties, $timeout ){



    $scope.checking_spin = false;
    $scope.login_ok =true;   
    $scope.username =0;   
    $scope.LastData = true;    
    $scope.StatData ={};
    $scope.LastData ={};
    $scope.StatDataPINST= {};
    
    $scope.StatData.username = $scope.username;
    $scope.StatData.table = $scope.username;

    $scope.login = function (pcb_id) {
     console.log(pcb_id)
     $scope.username = pcb_id;
     return true;
        
    }
    $scope.$watch('username', function () {

        console.log($scope.username)
        $scope.StatData.username = $scope.username;

        $scope.StatData.table = $scope.username;
        $scope.StatDataPINST.table = $scope.username;
        console.log($scope.StatData.table );
        console.log($scope.StatDataPINST.table );
        
        console.log($scope.StatData.username);
        
        if ($scope.StatData.table != 0){
        server_operations.GetLastEntry($scope.StatData)
        .success(function(data) {
            console.log(data)
            $scope.LastData.Available= true; 
            
            $scope.LastData.Seconds = data.resu[0].Seconds;
            $scope.LastData.Energy = data.resu[0].Energy;
            $scope.LastData.Pinst = parseFloat(data.resu[0].Pinst);
            $scope.LastData.StateOfCharge = data.resu[0].StateOfCharge;
            $scope.LastData.ConnStatus = data.resu[0].ConnStatus;
            $scope.LastData.GridPower1 = data.resu[0].GridPower1;
            $scope.LastData.GridPower2 = data.resu[0].GridPower2;
            $scope.LastData.GridPower3 = data.resu[0].GridPower3;
            $scope.LastData.State = data.resu[0].State;
            $scope.LastData.BatteryAlarm = data.resu[0].BatteryAlarm;
            $scope.LastData.BatteryVoltage = data.resu[0].BatteryVoltage;
            $scope.LastData.BatteryCurrent = data.resu[0].BatteryCurrent;
            $scope.LastData.ConnCCGX = data.resu[0].ConnCCGX;

            d = new Date(data.resu[0].Date_);
            $scope.LastData.Date_ = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + ("0" + d.getHours()).slice(-2)
+ ':'+  ("0" + d.getMinutes()).slice(-2) + ':' +  ("0" + d.getSeconds()).slice(-2);
            console.log($scope.LastData.Seconds);
            $scope.LastData.StateSystem = "";
            
            if ($scope.LastData.Pinst>0){
                $scope.LastData.StateSystem = "Discharging";
            }
            if ($scope.LastData.Pinst<0){
                $scope.LastData.StateSystem = "Recharging";
            }
            if ($scope.LastData.Pinst==0){
                $scope.LastData.StateSystem = "Standby";
            }
            
        });
    };
    });
    
    
    // var auth = function () {
    //     server_operations.authenticate()
    //     .success(function(data) {
    //             sharedProperties.setUsername(data.Username);
    //             sharedProperties.setCommonName(data.CommonName);
    // //            $scope.formData.USER = sharedProperties.getUsername();
    // //            $scope.USER_CNAME = sharedProperties.getCommonName();
    //                if (data.Username){
    //                 $scope.login_ok = true;
    //             }
    //         });
    //     };
    //
    //
    //     auth();
    
    // console.log(user.username)


    
    
    $scope.PredefinedTimeWindow = [
        {name:" ", number: 0},
        {name:"This week", number: 1},
        {name:"Last week", number: 2},
        {name:"This month", number: 3},
        {name:"This year", number: 4},
        {name:"Last 24 hours", number: 5}

    ];



    // $scope.BoardType = [
    //     {name:" "},
    //     {name:"SE1"},{name:"SE2"},{name:"SE3"},{name:"SE4"},{name:"SE5"},{name:"SE6"},{name:"SE7"},{name:"SE8"},
    //     {name:"SS1"},{name:"SS2"},{name:"SS3"},{name:"SS4"},{name:"SS5"},{name:"SS6"},{name:"SS7"},{name:"SS8"},
    //     {name:"LE1"},{name:"LE2"},{name:"LE3"},{name:"LE4"},{name:"LE5"},{name:"LE6"},{name:"LE7"},{name:"LE8"},
    //     {name:"LS1"},{name:"LS2"},{name:"LS3"},{name:"LS4"},{name:"LS5"},{name:"LS6"},{name:"LS7"},{name:"LS8"}
    //
    // ];
    //
    //
    //         $scope.TempDef = [
    //     {name:"Temporary"},{name:"Definitive"}
    //
    // ];
	
    $scope.selectedPredefinedTimeWindow = 0;
    $scope.selectedBoardType = "";
    $scope.temporaryOrdefinitive = "";
    $scope.datefrom_selected = false;
    $scope.dateto_selected = false;
    $scope.FinalTo = 0;
    $scope.StatData = {};
           
    $scope.myDateFrom = new Date();
            /*$scope.minDate = new Date(
               $scope.myDateFrom.getFullYear(),
               $scope.myDateFrom.getMonth() - 2,
               $scope.myDateFrom.getDate());
            $scope.maxDate = new Date(
               $scope.myDateFrom.getFullYear(),
               $scope.myDate.getMonth() + 2,
               $scope.myDate.getDate());
            $scope.onlyWeekendsPredicate = function(date) {
               var day = date.getDay();
               return day === 0 || day === 6;
            };*/
    $scope.$watch('myDateFrom', function () {

        $scope.datefrom_selected=true;
    });


    $scope.myDateTo = new Date();
            /*$scope.minDate = new Date(
               $scope.myDateFrom.getFullYear(),
               $scope.myDateFrom.getMonth() - 2,
               $scope.myDateFrom.getDate());
            $scope.maxDate = new Date(
               $scope.myDateFrom.getFullYear(),
               $scope.myDate.getMonth() + 2,
               $scope.myDate.getDate());
            $scope.onlyWeekendsPredicate = function(date) {
               var day = date.getDay();
               return day === 0 || day === 6;
            };*/
    $scope.$watch('myDateTo', function () {
        console.log($scope.myDateTo);
        $scope.FinalTo = $scope.myDateTo;
        $scope.dateto_selected=true;
    });

// GAUGE LEVEL
    $scope.myChartObjectBattery = {};
       $scope.myChartObjectBattery.type = "Gauge";

       $scope.myChartObjectBattery.options = {
         width: 400,
         height: 120,
         redFrom: 90,
         redTo: 100,
         yellowFrom: 75,
         yellowTo: 90,
         minorTicks: 5
       };

       $scope.myChartObjectBattery.data = [
         ['Label', 'Value'],
           ['Battery', Math.abs(parseFloat($scope.LastData.StateOfCharge))],
       ];
       
       // GAUGE PINST
       $scope.myChartObjectPInst = {};
          $scope.myChartObjectPInst.type = "Gauge";

          $scope.myChartObjectPInst.options = {
            width: 400,
            height: 120,
            redFrom: 90,
            redTo: 100,
            yellowFrom: 75,
            yellowTo: 90,
            minorTicks: 5
          };

          $scope.myChartObjectPInst.data = [
            ['Label', 'Value'],
            ['PInst', Math.abs($scope.LastData.Pinst)],
          ];


//$scope.FinalDecisionPieChart = {};
//$scope.FinalDecisionPieChart.type = "PieChart";
    $scope.tot = 0;
    $scope.ok =0;
    $scope.bad = 0;
    $scope.StatData = {};


//BACK
    $scope.StatData2 = {};
    $scope.backlightbad = 0;
    $scope.backlighttot = 0;
    $scope.backlightok =0;
    $scope.backlightminor = 0;

    $scope.backlightunknown =0;

//HV

    $scope.StatDataHV= {};
    $scope.StatDataBACKLIGHT= {};
    $scope.StatDataTOPLIGHT= {};
    $scope.StatDataPILLAR= {};
    $scope.StatDataDIMENSIONS= {};
        $scope.StatDataRESISTIVE_CHECK= {};




        

    
    $scope.badHV = 0;
    $scope.totHV = 0;
    $scope.okHV =0;
    $scope.minorHV = 0;
    $scope.unknownHV =0;
    
    $scope.DataToBeDrawn = {}
    $scope.DataToBeDrawn.PInst = []
    $scope.DataToBeDrawn.Date_ = []
    $scope.DataToBeDrawn.Energy = []
    $scope.DataToBeDrawn.Seconds = []
    $scope.DataToBeDrawn.StateOfCharge = []
    $scope.DataToBeDrawn.ConnStatus = []
    $scope.DataToBeDrawn.GridPower1 = []
    $scope.DataToBeDrawn.GridPower2 = []
    $scope.DataToBeDrawn.GridPower3 = []
    $scope.DataToBeDrawn.BatteryCurrent = []
    $scope.DataToBeDrawn.State = []
    $scope.DataToBeDrawn.BatteryAlarm = []
    $scope.DataToBeDrawn.ConnCCGX = []
    
    


    $scope.SearchPerformed = false;
    $scope.dates = [];
    $scope.number = [];

    $scope.$watch('selectedBoardType', function () {
        //$scope.Search();
    });

    $scope.$watch('selectedPredefinedTimeWindow', function () {

        switch($scope.selectedPredefinedTimeWindow.number) {
            case 1: var d = new Date();
                var day = d.getDay(),
                diff = d.getDate() - day + (day == 0 ? -6:1);
                $scope.myDateFrom = new Date(d.setDate(diff));
                $scope.myDateTo = new Date(d.setDate(diff+6));
                console.log($scope.myDateFrom);
                console.log($scope.myDateTo);
                //$scope.Search();	
                break;
            case 2:
                var d = new Date();
                var day = d.getDay(),
                	diff = d.getDate() - day - 7 + (day == 0 ? -6:1);
                $scope.myDateFrom = new Date(d.setDate(diff));
                $scope.myDateTo = new Date(d.setDate(diff+6));
                console.log($scope.myDateFrom);

                console.log($scope.myDateTo);
                //$scope.Search();	
            case 3:

                $scope.myDateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                $scope.myDateTo = new Date();
                console.log($scope.myDateFrom);
                console.log($scope.myDateTo);
                //$scope.Search();
                break;
            case 4:
                $scope.myDateFrom = new Date(new Date().getFullYear(), 0, 1);
                $scope.myDateTo = new Date();
                console.log($scope.myDateFrom);
                console.log($scope.myDateTo);
                //$scope.Search();
                break;
            
            case 5:
                $scope.myDateFrom = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
                $scope.myDateTo = new Date();
                console.log($scope.myDateFrom);
                console.log($scope.myDateTo);
                //$scope.Search();
                break;
            }

        });


        $scope.Search = function() {
	
       /*     $scope.DataToBeDrawn = {} */
            $scope.DataToBeDrawn.PInst.length = 0;
            $scope.DataToBeDrawn.Date_ .length = 0;
            $scope.DataToBeDrawn.Energy.length = 0;
            $scope.DataToBeDrawn.Seconds.length = 0;
            $scope.DataToBeDrawn.StateOfCharge.length = 0;
            $scope.DataToBeDrawn.ConnStatus.length = 0;
            $scope.DataToBeDrawn.GridPower1.length = 0;
            $scope.DataToBeDrawn.GridPower2.length = 0;
            $scope.DataToBeDrawn.GridPower3.length = 0;
            $scope.DataToBeDrawn.BatteryCurrent.length = 0;
            $scope.DataToBeDrawn.State.length = 0;
            $scope.DataToBeDrawn.BatteryAlarm.length = 0;
            $scope.DataToBeDrawn.BatteryVoltage.length = 0;
            $scope.DataToBeDrawn.ConnCCGX.length = 0;


            $scope.SearchPerformed = false;

    //BEGIN PINST
        // $scope.StatDataPINST.selectedBoardType = $scope.selectedBoardType.name;
        // $scope.StatDataPINST.table = "Nuvola";


        $scope.StatDataPINST.var_val_name = "Pinst";
        $scope.StatDataPINST.var_date = "Date_";
        $scope.StatDataPINST.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
        $scope.StatDataPINST.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
        $scope.checking_spin = true;
        
        server_operations.HistoryDataNuvola($scope.StatDataPINST)
        .success(function(data) {
            

            data.resu.forEach( function (item, index, object){
                // console.log(item.Date_)
                
                $scope.DataToBeDrawn.PInst.push(item.Pinst);
                d = new Date(item.Date_);
                $scope.DataToBeDrawn.Date_.push(d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + ("0" + d.getHours()).slice(-2)
    + ':'+  ("0" + d.getMinutes()).slice(-2) + ':' +  ("0" + d.getSeconds()).slice(-2));
                // $scope.DataToBeDrawn.Date_.push(item.Date_);
                $scope.DataToBeDrawn.Energy.push(item.Energy);
                $scope.DataToBeDrawn.Seconds.push(item.Seconds);
                $scope.DataToBeDrawn.StateOfCharge.push(item.StateOfCharge);
                $scope.DataToBeDrawn.ConnStatus.push(item.ConnStatus);
                $scope.DataToBeDrawn.GridPower1.push(item.GridPower1);
                $scope.DataToBeDrawn.GridPower2.push(item.GridPower2);
                $scope.DataToBeDrawn.GridPower3.push(item.GridPower3);
                $scope.DataToBeDrawn.BatteryCurrent.push(item.BatteryCurrent);
                $scope.DataToBeDrawn.State.push(item.State);
                $scope.DataToBeDrawn.BatteryAlarm.push(item.BatteryAlarm);
                $scope.DataToBeDrawn.BatteryVoltage.push(item.BatteryVoltage);
                $scope.DataToBeDrawn.ConnCCGX.push(item.ConnCCGX);
              
            });
            
            
               console.log("passsing from predrawing")
            $timeout(function () {
                $scope.SearchPerformed = true;
                 $scope.checking_spin = false;
                 $scope.Draw();
            },2000);
            // $timeout(function () {

            // }, 2000);
            
        });

    //END PINST










// // FINAL
//     $scope.StatData.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatData.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//     $scope.StatData.table = "FINAL_DECISION";
//     $scope.StatData.var_val_name = "GRANDTOTALOK";
//     $scope.StatData.var_date = "FILLED_DATE";
//     //new Research based on type
//     $scope.StatData.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatData.selectedBoardType = $scope.selectedBoardType.name;
//
//     server_operations.StaticsTableCheck($scope.StatData)
//     .success(function(data) {
//         console.log(data);
//         $scope.bad = 0;
//         $scope.tot = 0;
//         $scope.ok =0;
//
//
//         $scope.dates = [];
//         $scope.number = [];
//         data.resu.forEach( function (item, index, object){
//         console.log(item);
//         console.log(item.GRANDTOTALOK);
//
//         if (item.GRANDTOTALOK=="0"){
//             $scope.tot = $scope.tot +1;
//             $scope.ok = $scope.ok+1;
//         }
//         else {
//             $scope.tot = $scope.tot +1;
//             $scope.bad = $scope.bad +1;
//         }
//
//         });
//     });
//
//
//     server_operations.StaticsHistoryCheck($scope.StatData)
//     .success(function(data) {
//         data.resu.forEach( function (item, index, object){
//             console.log($scope.dates);
//             console.log(item.YEAR + "/" + item.WEEK);
//             var pippo = item.YEAR + "/" + item.WEEK;
//
//             $scope.dates.push(pippo);
//             if ($scope.number.length==0){
//                 $scope.number.push(parseInt(item.COUNT));
//             }
//             else{
//                 $scope.number.push(parseInt($scope.number[($scope.number.length)-1])+parseInt(item.COUNT));
//
//             }
//         });
//     });
//
//
// //END FINAL
// //
// //
// //
//
//
// //BEGIN TOPLIGHT
//     $scope.StatDataTOPLIGHT.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatDataTOPLIGHT.selectedBoardType = $scope.selectedBoardType.name;
//     $scope.StatDataTOPLIGHT.table = "TOPLIGHT_INSPECTION_TMP";
//     if ($scope.SearchTemp == false){
//         $scope.StatDataTOPLIGHT.table = "TOPLIGHT_INSPECTION";
//     }
//     $scope.StatDataTOPLIGHT.var_val_name = "TOTALVISUALOK";
//     $scope.StatDataTOPLIGHT.var_date = "CHECK_DATE_VISUAL";
//     $scope.StatDataTOPLIGHT.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatDataTOPLIGHT.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//
//     server_operations.StaticsTableCheck($scope.StatDataTOPLIGHT)
//     .success(function(data) {
//         $scope.badTOPLIGHT = 0;
//         $scope.totTOPLIGHT = 0;
//         $scope.okTOPLIGHT =0;
//         $scope.minorTOPLIGHT = 0;
//
//         $scope.unknownTOPLIGHT =0;
//
//         data.resu.forEach( function (item, index, object){
//
//             $scope.totTOPLIGHT =+1;
//             if (item.TOTALVISUALOK=="0"){
//                 $scope.okTOPLIGHT ++;
//             }
//             else if (item.TOTALVISUALOK=="1"){
//                 $scope.badTOPLIGHT ++;
//             }
//             else if (item.TOTALVISUALOK=="2"){
//                 $scope.minorTOPLIGHT ++;
//             }
//             else {
//                 $scope.unknownTOPLIGHT ++;
//             }
//         });
//     });
//
// //END TOPLIGHT
//
// //BEGIN BACKLIGHT
//     $scope.StatDataBACKLIGHT.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatDataBACKLIGHT.selectedBoardType = $scope.selectedBoardType.name;
//     $scope.StatDataBACKLIGHT.table = "BACKLIGHT_INSPECTION_TMP";
//     if ($scope.SearchTemp == false){
//         $scope.StatDataBACKLIGHT.table = "BACKLIGHT_INSPECTION";
//     }
//
//     $scope.StatDataBACKLIGHT.var_val_name = "TOTALBACKLIGHTOK";
//     $scope.StatDataBACKLIGHT.var_date = "CHECK_DATE_BACKLIGHT";
//     $scope.StatDataBACKLIGHT.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatDataBACKLIGHT.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//
//     server_operations.StaticsTableCheck($scope.StatDataBACKLIGHT)
//     .success(function(data) {
//         $scope.badBACKLIGHT = 0;
//         $scope.totBACKLIGHT = 0;
//         $scope.okBACKLIGHT =0;
//         $scope.minorBACKLIGHT = 0;
//
//         $scope.unknownBACKLIGHT =0;
//
//         data.resu.forEach( function (item, index, object){
//
//             $scope.totBACKLIGHT =+1;
//             if (item.TOTALBACKLIGHTOK=="0"){
//                 $scope.okBACKLIGHT ++;
//             }
//             else if (item.TOTALBACKLIGHTOK=="1"){
//                 $scope.badBACKLIGHT ++;
//             }
//             else if (item.TOTALBACKLIGHTOK=="2"){
//                 $scope.minorBACKLIGHT ++;
//             }
//             else {
//                 $scope.unknownBACKLIGHT ++;
//             }
//         });
//     });
//
// //END BACKLIGHT
//
//
// //BEGIN HV
//     $scope.StatDataHV.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatDataHV.selectedBoardType = $scope.selectedBoardType.name;
//     $scope.StatDataHV.table = "HV_TMP";
//     if ($scope.SearchTemp == false){
//         $scope.StatDataHV.table = "HV";
//     }
//
//     $scope.StatDataHV.var_val_name = "TOTALHVOK";
//     $scope.StatDataHV.var_date = "CHECK_DATE_HV";
//     $scope.StatDataHV.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatDataHV.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//
//     server_operations.StaticsTableCheck($scope.StatDataHV)
//     .success(function(data) {
//         $scope.badHV = 0;
//         $scope.totHV = 0;
//         $scope.okHV =0;
//         $scope.minorHV = 0;
//
//         $scope.unknownHV =0;
//
//         data.resu.forEach( function (item, index, object){
//
//             $scope.totHV =+1;
//             if (item.TOTALHVOK=="0"){
//                 $scope.okHV ++;
//             }
//             else if (item.TOTALHVOK=="1"){
//                 $scope.badHV ++;
//             }
//             else if (item.TOTALHVOK=="2"){
//                 $scope.minorHV ++;
//             }
//             else {
//                 $scope.unknownHV ++;
//             }
//         });
//     });
//
// //END HV
//
// //BEGIN DIMENSIONS
//     $scope.StatDataDIMENSIONS.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatDataDIMENSIONS.selectedBoardType = $scope.selectedBoardType.name;
//     $scope.StatDataDIMENSIONS.table = "DIMENSIONS_TMP";
//     if ($scope.SearchTemp == false){
//         $scope.StatDataDIMENSIONS.table = "DIMENSIONS";
//     }
//     $scope.StatDataDIMENSIONS.var_val_name = "TOTALDIMENSIONSOK";
//     $scope.StatDataDIMENSIONS.var_date = "CHECK_DATE_DIMENSIONS";
//     $scope.StatDataDIMENSIONS.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatDataDIMENSIONS.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//
//     server_operations.StaticsTableCheck($scope.StatDataDIMENSIONS)
//     .success(function(data) {
//         $scope.badDIMENSIONS = 0;
//         $scope.totDIMENSIONS = 0;
//         $scope.okDIMENSIONS =0;
//         $scope.minorDIMENSIONS = 0;
//
//         $scope.unknownDIMENSIONS =0;
//
//         data.resu.forEach( function (item, index, object){
//
//             $scope.totDIMENSIONS =+1;
//             if (item.TOTALDIMENSIONSOK=="0"){
//                 $scope.okDIMENSIONS ++;
//             }
//             else if (item.TOTALDIMENSIONSOK=="1"){
//                 $scope.badDIMENSIONS ++;
//             }
//             else if (item.TOTALDIMENSIONSOK=="2"){
//                 $scope.minorDIMENSIONS ++;
//             }
//             else {
//                 $scope.unknownDIMENSIONS ++;
//             }
//         });
//     });
//
// //END DIMENSIONS
//
// //BEGIN PILLAR
//     $scope.StatDataPILLAR.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatDataPILLAR.selectedBoardType = $scope.selectedBoardType.name;
//     $scope.StatDataPILLAR.table = "PILLARS_INSPECTION_TMP";
//     if ($scope.SearchTemp == false){
//         $scope.StatDataPILLAR.table = "PILLARS_INSPECTION";
//     }
//     $scope.StatDataPILLAR.var_val_name = "TOTALPILLARSOK";
//     $scope.StatDataPILLAR.var_date = "CHECK_DATE_PILLARS";
//     $scope.StatDataPILLAR.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatDataPILLAR.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//
//     server_operations.StaticsTableCheck($scope.StatDataPILLAR)
//     .success(function(data) {
//         $scope.badPILLAR = 0;
//         $scope.totPILLAR = 0;
//         $scope.okPILLAR =0;
//         $scope.minorPILLAR = 0;
//
//         $scope.unknownPILLAR =0;
//
//         data.resu.forEach( function (item, index, object){
//
//             $scope.totPILLAR =+1;
//             if (item.TOTALPILLARSOK=="0"){
//                 $scope.okPILLAR ++;
//             }
//             else if (item.TOTALPILLARSOK=="1"){
//                 $scope.badPILLAR ++;
//             }
//             else if (item.TOTALPILLARSOK=="2"){
//                 $scope.minorPILLAR ++;
//             }
//             else {
//                 $scope.unknownPILLAR ++;
//             }
//         });
//     });
//
// //END PILLAR
//
// //BEGIN RESISTIVE_CHECK
//     $scope.StatDataRESISTIVE_CHECK.TypeBoardSelected = $scope.TypeBoardSelected;
//     $scope.StatDataRESISTIVE_CHECK.selectedBoardType = $scope.selectedBoardType.name;
//     $scope.StatDataRESISTIVE_CHECK.table = "RESISTIVE_CHECK_TMP";
//
//     if ($scope.SearchTemp == false){
//         $scope.StatDataRESISTIVE_CHECK.table = "RESISTIVE_CHECK";
//     }
//
//     $scope.StatDataRESISTIVE_CHECK.var_val_name = "RESISTIVE_CHECKOK";
//     $scope.StatDataRESISTIVE_CHECK.var_date = "CHECK_DATE_RESISTIVE_CHECK";
//     $scope.StatDataRESISTIVE_CHECK.min_date = $scope.myDateFrom.getFullYear() + "/" + ('0' + ($scope.myDateFrom.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateFrom.getDate())).slice(-2);
//     $scope.StatDataRESISTIVE_CHECK.max_date = $scope.myDateTo.getFullYear() + "/" + ('0' + ($scope.myDateTo.getMonth() + 1)).slice(-2) + "/" +  ('0' + ( $scope.myDateTo.getDate())).slice(-2);
//
//     server_operations.StaticsTableCheck($scope.StatDataRESISTIVE_CHECK)
//     .success(function(data) {
//         $scope.badRESISTIVE_CHECK = 0;
//         $scope.totRESISTIVE_CHECK = 0;
//         $scope.okRESISTIVE_CHECK =0;
//         $scope.minorRESISTIVE_CHECK = 0;
//
//         $scope.unknownRESISTIVE_CHECK =0;
//
//         data.resu.forEach( function (item, index, object){
//
//             $scope.totRESISTIVE_CHECK =+1;
//             if (item.RESISTIVE_CHECKOK=="0"){
//                 $scope.okRESISTIVE_CHECK ++;
//             }
//             else if (item.RESISTIVE_CHECKOK=="1"){
//                 $scope.badRESISTIVE_CHECK ++;
//             }
//             else if (item.RESISTIVE_CHECKOK=="2"){
//                 $scope.minorRESISTIVE_CHECK ++;
//             }
//             else {
//                 $scope.unknownRESISTIVE_CHECK ++;
//             }
//         });
//     });
//
// //END DIMENSIONS
//
        // $scope.Draw();

      // $scope.Draw();
   /* setTimeout(function(){
     $scope.Draw();



    }, 2000);
*/



	};
	
	
	$scope.Draw = function(){


        
	// $scope.WritePie();

     
    $scope.WritePInst();
    $scope.WriteEnergy();
    $scope.WriteSeconds();
    $scope.WriteStateOfCharge();
    $scope.WriteConnStatus();
    $scope.WriteGridPower1();
    $scope.WriteGridPower2();
    $scope.WriteGridPower3();
    $scope.WriteState();
    $scope.WriteBatteryAlarm();
    $scope.WriteBatteryVoltage();
    $scope.WriteBatteryCurrent();
    $scope.WriteConnCCGX();
    
    
    
    
        // $scope.WriteHV();
        // $scope.WriteTOPLIGHT();
        // $scope.WriteBACKLIGHT();
        // $scope.WritePILLAR();
        // $scope.WriteDIMENSIONS();
        // $scope.WriteRESISTIVE_CHECK();
        // $scope.WriteHistoricalTrend();
	};
//server_operations.
    $scope.WritePie = function() {
        console.log($scope.ok);
        console.log($scope.SearchPerformed );
        $scope.FinalDecisionPieChart = {};
        $scope.FinalDecisionPieChart.type = "PieChart";
        $scope.OK = [
            {v: "OK"},
            {v: $scope.ok},
        ];
        $scope.BAD = [
            {v: "BAD"},
            {v: $scope.bad},
        ];


        $scope.FinalDecisionPieChart.data = {"cols": [
            {id: "t", label: "Outcome", type: "string"},
            {id: "s", label: "Board", type: "number"}
        ], "rows": [
            {c: $scope.OK},
            {c: $scope.BAD}
        ]};
    };



    $scope.WriteHV = function() {
        $scope.HVPieChart = {};
        $scope.HVPieChart.type = "PieChart";
        $scope.HVOK = [
            {v: "OK"},
            {v: $scope.okHV},
        ];
        $scope.HVBAD = [
            {v: "BAD"},
            {v: $scope.badHV},
        ];

        $scope.HVMINOR = [
            {v: "Minor"},
            {v: $scope.minorHV},
        ];

        $scope.HVUNK= [
            {v: "unknown"},
            {v: $scope.unknownHV},
        ];
        $scope.HVPieChart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: $scope.HVOK},
            {c: $scope.HVBAD},
            {c: $scope.HVMINOR},
            {c: $scope.HVUNK},
        ]};
        
        $scope.HVPieChart.options = {
            'title': 'HV section'
        };
    };
    
    $scope.WriteTOPLIGHT = function() {
        $scope.TOPLIGHTPieChart = {};
        $scope.TOPLIGHTPieChart.type = "PieChart";
        $scope.TOPLIGHTOK = [
            {v: "OK"},
            {v: $scope.okTOPLIGHT},
        ];
        $scope.TOPLIGHTBAD = [
            {v: "BAD"},
            {v: $scope.badTOPLIGHT},
        ];

        $scope.TOPLIGHTMINOR = [
            {v: "Minor"},
            {v: $scope.minorTOPLIGHT},
        ];

        $scope.TOPLIGHTUNK= [
            {v: "unknown"},
            {v: $scope.unknownTOPLIGHT},
        ];
        $scope.TOPLIGHTPieChart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: $scope.TOPLIGHTOK},
            {c: $scope.TOPLIGHTBAD},
            {c: $scope.TOPLIGHTMINOR},
            {c: $scope.TOPLIGHTUNK},
        ]};
        
        $scope.TOPLIGHTPieChart.options = {
            'title': 'TOPLIGHT section'
        };
    };
    
    $scope.WriteBACKLIGHT = function() {
        $scope.BACKLIGHTPieChart = {};
        $scope.BACKLIGHTPieChart.type = "PieChart";
        $scope.BACKLIGHTOK = [
            {v: "OK"},
            {v: $scope.okBACKLIGHT},
        ];
        $scope.BACKLIGHTBAD = [
            {v: "BAD"},
            {v: $scope.badBACKLIGHT},
        ];

        $scope.BACKLIGHTMINOR = [
            {v: "Minor"},
            {v: $scope.minorBACKLIGHT},
        ];

        $scope.BACKLIGHTUNK= [
            {v: "unknown"},
            {v: $scope.unknownBACKLIGHT},
        ];
        $scope.BACKLIGHTPieChart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: $scope.BACKLIGHTOK},
            {c: $scope.BACKLIGHTBAD},
            {c: $scope.BACKLIGHTMINOR},
            {c: $scope.BACKLIGHTUNK},
        ]};
        
        $scope.BACKLIGHTPieChart.options = {
            'title': 'BACKLIGHT section'
        };
    };

    $scope.WritePILLAR = function() {
        $scope.PILLARPieChart = {};
        $scope.PILLARPieChart.type = "PieChart";
        $scope.PILLAROK = [
            {v: "OK"},
            {v: $scope.okPILLAR},
        ];
        $scope.PILLARBAD = [
            {v: "BAD"},
            {v: $scope.badPILLAR},
        ];

        $scope.PILLARMINOR = [
            {v: "Minor"},
            {v: $scope.minorPILLAR},
        ];

        $scope.PILLARUNK= [
            {v: "unknown"},
            {v: $scope.unknownPILLAR},
        ];
        $scope.PILLARPieChart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: $scope.PILLAROK},
            {c: $scope.PILLARBAD},
            {c: $scope.PILLARMINOR},
            {c: $scope.PILLARUNK},
        ]};
        
        $scope.PILLARPieChart.options = {
            'title': 'PILLAR section'
        };
    };

    $scope.WriteDIMENSIONS = function() {
        $scope.DIMENSIONSPieChart = {};
        $scope.DIMENSIONSPieChart.type = "PieChart";
        $scope.DIMENSIONSOK = [
            {v: "OK"},
            {v: $scope.okDIMENSIONS},
        ];
        $scope.DIMENSIONSBAD = [
            {v: "BAD"},
            {v: $scope.badDIMENSIONS},
        ];

        $scope.DIMENSIONSMINOR = [
            {v: "Minor"},
            {v: $scope.minorDIMENSIONS},
        ];

        $scope.DIMENSIONSUNK= [
            {v: "unknown"},
            {v: $scope.unknownDIMENSIONS},
        ];
        $scope.DIMENSIONSPieChart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: $scope.DIMENSIONSOK},
            {c: $scope.DIMENSIONSBAD},
            {c: $scope.DIMENSIONSMINOR},
            {c: $scope.DIMENSIONSUNK},
        ]};
        
        $scope.DIMENSIONSPieChart.options = {
            'title': 'DIMENSIONS section'
        };
    };
    

    $scope.WriteRESISTIVE_CHECK = function() {
        $scope.RESISTIVE_CHECKPieChart = {};
        $scope.RESISTIVE_CHECKPieChart.type = "PieChart";
        $scope.RESISTIVE_CHECKOK = [
            {v: "OK"},
            {v: $scope.okRESISTIVE_CHECK},
        ];
        $scope.RESISTIVE_CHECKBAD = [
            {v: "BAD"},
            {v: $scope.badRESISTIVE_CHECK},
        ];

        $scope.RESISTIVE_CHECKMINOR = [
            {v: "Minor"},
            {v: $scope.minorRESISTIVE_CHECK},
        ];

        $scope.RESISTIVE_CHECKUNK= [
            {v: "unknown"},
            {v: $scope.unknownRESISTIVE_CHECK},
        ];
        $scope.RESISTIVE_CHECKPieChart.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: $scope.RESISTIVE_CHECKOK},
            {c: $scope.RESISTIVE_CHECKBAD},
            {c: $scope.RESISTIVE_CHECKMINOR},
            {c: $scope.RESISTIVE_CHECKUNK},
        ]};
        
        $scope.RESISTIVE_CHECKPieChart.options = {
            'title': 'RESISTIVE_CHECK section'
        };
    };

    $scope.WriteHistoricalTrend = function(){
        var entries =  "$scope.myChartTrendPlot = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'Examined',        'label': 'Board examined',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        console.log($scope.number);
        
        for (var entriesit in $scope.number){

            entries = entries + " { 'c': [ { 'v': '" + $scope.dates[entriesit] + "' }, { 'v': " + $scope.number[entriesit] + " } ]  }" 	 
            if (i<$scope.number.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'Boards historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'Boards', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'week/year' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);

/////
        $scope.myChartObject2 = {        "type": "AreaChart",        "displayed": false,        "data": {        "cols": [          {        "id": "month",        "label": "Month",        "type": "string",        "p": {}          },      {        "id": "Examined",        "label": "Board examined",        "type": "number"   }    ],   "rows": [  { "c": [ { "v": "2017/09" }, { "v": 1 } ]  }, { "c": [ { "v": 2017/10 }, { "v": 1 } ]  } ] }, "options": {  "title": "Sales per month","isStacked": "true", "fill": 20, "displayExactValues": true,"vAxis": { "title": "Sales unit", "gridlines": {     "count": 10    }   }, "hAxis": {  "title": "Date" }}, "formatters": {}}
/////

    };
    
    $scope.WritePInst = function(){
        var entries =  "$scope.myChartTrendPInst = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'Pinst',        'label': 'PInst',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.PInst){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.PInst[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.PInst.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'PInst historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'PInst', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    
    $scope.WriteEnergy = function(){
        var entries =  "$scope.myChartTrendEnergy = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'Energy',        'label': 'Energy',        'type': 'number'      }    ],   'rows': [ " ;
        console.log("writing energy");

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.Energy){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.Energy[entriesit] + " } ]  }" 	 
            console.log($scope.DataToBeDrawn.Energy[entriesit]);
            if (i<$scope.DataToBeDrawn.Energy.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'Energy historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'Energy', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };

    $scope.WriteSeconds = function(){
        var entries =  "$scope.myChartTrendSeconds = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'Seconds',        'label': 'Seconds',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.Seconds){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.Seconds[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.Seconds.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'Seconds historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'Seconds', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };

    $scope.WriteStateOfCharge = function(){
        var entries =  "$scope.myChartTrendStateOfCharge = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'StateOfCharge',        'label': 'StateOfCharge',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.StateOfCharge){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.StateOfCharge[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.StateOfCharge.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'StateOfCharge historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'StateOfCharge', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };

    $scope.WriteConnStatus = function(){
        var entries =  "$scope.myChartTrendConnStatus = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'ConnStatus',        'label': 'ConnStatus',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.ConnStatus){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.ConnStatus[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.ConnStatus.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'ConnStatus historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'ConnStatus', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteGridPower1 = function(){
        var entries =  "$scope.myChartTrendGridPower1 = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'GridPower1',        'label': 'GridPower1',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.GridPower1){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.GridPower1[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.GridPower1.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'GridPower1 historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'GridPower1', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteGridPower2 = function(){
        var entries =  "$scope.myChartTrendGridPower2 = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'GridPower2',        'label': 'GridPower2',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.GridPower2){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.GridPower2[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.GridPower2.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'GridPower2 historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'GridPower2', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteGridPower3 = function(){
        var entries =  "$scope.myChartTrendGridPower3 = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'GridPower3',        'label': 'GridPower3',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.GridPower3){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.GridPower3[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.GridPower3.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'GridPower3 historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'GridPower3', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteState = function(){
        var entries =  "$scope.myChartTrendState = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'State',        'label': 'State',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.State){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.State[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.State.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'State historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'State', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteBatteryAlarm = function(){
        var entries =  "$scope.myChartTrendBatteryAlarm = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'BatteryAlarm',        'label': 'BatteryAlarm',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.BatteryAlarm){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.BatteryAlarm[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.BatteryAlarm.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'BatteryAlarm historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'BatteryAlarm', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteBatteryVoltage = function(){
        var entries =  "$scope.myChartTrendBatteryVoltage = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'BatteryVoltage',        'label': 'BatteryVoltage',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.BatteryVoltage){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.BatteryVoltage[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.BatteryVoltage.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'BatteryVoltage historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'BatteryVoltage', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteBatteryCurrent = function(){
        var entries =  "$scope.myChartTrendBatteryCurrent = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'BatteryCurrent',        'label': 'BatteryCurrent',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.BatteryCurrent){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.BatteryCurrent[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.BatteryCurrent.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'BatteryCurrent historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'BatteryCurrent', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    
    $scope.WriteConnCCGX = function(){
        var entries =  "$scope.myChartTrendConnCCGX = {        'type': 'AreaChart',        'displayed': false,        'data': {        'cols': [          {        'id': 'month',        'label': 'Month',        'type': 'string',        'p': {}          },      {        'id': 'ConnCCGX',        'label': 'ConnCCGX',        'type': 'number'      }    ],   'rows': [ " ;

        var i =0;
        for (var entriesit in $scope.DataToBeDrawn.ConnCCGX){

            entries = entries + " { 'c': [ { 'v': '" + $scope.DataToBeDrawn.Date_[entriesit] + "' }, { 'v': " + $scope.DataToBeDrawn.ConnCCGX[entriesit] + " } ]  }" 	 
            // console.log($scope.number);
            if (i<$scope.DataToBeDrawn.ConnCCGX.length)
            {
                entries = entries + ", ";
            }
        }
        entries = entries + " ] }, 'options': {  'title': 'ConnCCGX historical trend','isStacked': 'true', 'fill': 20, 'displayExactValues': true,'vAxis': { 'title': 'ConnCCGX', 'gridlines': {     'count': 10    }   }, 'hAxis': {  'title': 'seconds' }}, 'formatters': {}}";

        // console.log(entries);

        eval(entries);
    };
    // console.log($scope.myDate)
    // $scope.myChartObject = {};
    //
    // $scope.myChartObject.type = "PieChart";
    //
    // $scope.onions = [
    //     {v: "Onions"},
    //     {v: 3},
    // ];
    //
    // $scope.myChartObject.data = {"cols": [
    //     {id: "t", label: "Topping", type: "string"},
    //     {id: "s", label: "Slices", type: "number"}
    // ], "rows": [
    //     {c: [
    //         {v: "Mushrooms"},
    //         {v: 3},
    //     ]},
    //     {c: $scope.onions},
    //     {c: [
    //         {v: "Olives"},
    //         {v: 31}
    //     ]},
    //     {c: [
    //         {v: "Zucchini"},
    //         {v: 1},
    //     ]},
    //     {c: [
    //         {v: "Pepperoni"},
    //         {v: 2},
    //     ]}
    // ]};
    //
    // $scope.myChartObject.options = {
    //     'title': 'How Much Pizza I Ate Last Night'
    // };

}])


