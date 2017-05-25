
var dbConfig = require('./dbconfig.js');
var fs= require("fs");
var upload_folder="uploads/"
var spawn = require('child_process').spawn;
var mysql      = require('mysql');
var async = require('async');
function doRelease(connection)
{
    connection.release(
	function(err) {
	    if (err) {
		console.error(err.message);
	    }
	});
	return;
}
// function doReleaseMySql(connection)
// {
//     connection.end(
//     function(err) {
//         if (err) {
//         console.error(err.message);
//         }
//     });
//     return;
// }


var DeleteTmpEntry= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, table, option, callback){
    if (option) {
	var sql_string="delete from " + table + " where id_ls=:id_ls AND id_se=:id_se AND id_n=:id_n AND id_n2=:id_n2 AND test_board=:test_board AND (filename LIKE \'\%" + option + "\%\' )";
    } else {
	var sql_string="delete from " + table + " where id_ls=:id_ls AND id_se=:id_se AND id_n=:id_n AND id_n2=:id_n2 AND test_board=:test_board ";
    }
    var sql_object= new Object();
    sql_object.id_ls=ID_ls;
    sql_object.id_se=ID_se;
    sql_object.id_n=ID_n;
    sql_object.id_n2=ID_n2;
    sql_object.test_board=test_flag;
    console.log ("executing " + sql_string );
    console.log (sql_object);
    executeSQL(sql_string, sql_object, function(err, result){
	if (err){
	    err.message="in deleting " + table + "  table: " + err.message;
	    err.sql_string=sql_string;
	    err.sql_object=sql_object;
	    return callback(err);
	} else {
	    callback(null, result);
	}
    });


}


var checkFinal= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, callback){
    // check if the entry already exists in the definitive table
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    "SELECT * " +
			"FROM final_decision WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board)",
			    {
				id_ls:ID_ls,
				id_se:ID_se,
				id_n:ID_n,
				id_n2:ID_n2,
				test_board:test_flag
			    },
			    function(err, result)
			    {
				if (err) {
				    doRelease(connection);
				    return callback(err);
				} else if (result.rows != ""){
				    doRelease(connection);
				    return callback(null, result);
				} else {
				    doRelease(connection);
				    return callback({"message": 'Entry is not present in the table final_decision'}, result); 
				}
			    });
	    }
	});
}

var checkGeneralTable= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, table, callback){
    // check if the entry already exists in the HV temporary table
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    //"SELECT silvlineok, reslefta, resleftb, resrighta, resrightb, totalhvok, checker_hv, check_date_hv, totalhv_comment " +
		    "SELECT * " +
			"FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board)",
			    {
				id_ls:ID_ls,
				id_se:ID_se,
				id_n:ID_n,
				id_n2:ID_n2,
				test_board:test_flag
			    },
			    function(err, result)
			    {
				if (err) {
				    doRelease(connection);
				    return callback(err);
				} else if (result.rows != ""){
				    doRelease(connection);
				    return callback(null, result);
				} else {
				    doRelease(connection);
				    return callback({"message": 'Entry is not present in the table ' + table}, result); 
				}
			    });
	    }
	});
}

var checkPillarsAffections= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, table, callback){
    // check if the entry already exists in the Pillars Affection temporary table
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    "SELECT sector, type, severity, vis_comment " +
			"FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board)",
			    {
				id_ls:ID_ls,
				id_se:ID_se,
				id_n:ID_n,
				id_n2:ID_n2,
				test_board:test_flag
			    },
			    function(err, result)
			    {
				if (err) {
				    doRelease(connection);
				    return callback(err);
				} else if (result.rows != ""){
				    doRelease(connection);
				    return callback(null, result);
				}
				else {
				    doRelease(connection);
				    return callback({"message": 'Entry is not present in the table ' + table}, result); 
				}
			    });
	    }
	});
}


var checkBLOBs= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, table, callback){
    // check if the entry already exists in the BLOB table
    sql2exec=[];
    var _flagCheck=null;
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    "SELECT description, filename, sector " +
			"FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board)",
			    {
				id_ls:ID_ls,
				id_se:ID_se,
				id_n:ID_n,
				id_n2:ID_n2,
				test_board:test_flag
			    },
			    function(err, result)
			    {
				if (err) {
				    doRelease(connection);
				    return callback(err);
				} else if (result.rows != ""){
			    doRelease(connection);
				    var resultTot=[];
				    //console.log(result.rows)
				    //we have to check if the files are already present on the disk cache (/uploads), otherwise we have to get them back from the DB

				    async.each(result.rows, function (row, callbackEach) {
						 
						 
						 
					//console.log("now " + row.FILENAME);
					fs.access(upload_folder+row.FILENAME, fs.F_OK, function(err) {
					    if (err) {
						//file is not present in the cache, we fetch it from the DB
						    oracledb.getConnection(
							{
							    user          : dbConfig.user,
							    password      : dbConfig.password,
							    connectString : dbConfig.connectString
							},
							function(err, connection)
							{
							    if (err) {
									 doRelease(connection);
								return callback(err);
							    } else { 
							 
							 
						outFileName=upload_folder+row.FILENAME;
						
						connection.execute(
						    "SELECT content FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board AND filename= :namefile)",
							{
							    id_ls:ID_ls,
							    id_se:ID_se,
							    id_n:ID_n,
							    id_n2:ID_n2,
							    test_board:test_flag,
							    namefile:row.FILENAME
							},
							function(err, result)
							{
							    if (err) { 
								    doRelease(connection);
									 
								console.error(err.message); 
								return callbackEach(err);
							    }
							    if (result.rows.length === 0) { 
								console.log("No results");
								doRelease(connection);
								return callbackEach(new Error("No results in querying BLOB from DB!"));
							    } else {
									 doRelease(connection);
								var lob = result.rows[0]['CONTENT'];

								if (lob === null) {
				  			    doRelease(connection);
									
								    console.log("BLOB was NULL"); 
								    return callbackEach({"message": "BLOB with file " + row.FILENAME +  "is void!"});
								} else {
									doRelease(connection);
								    lob.on( 'error',function(err){
										 
									console.error(err);
									return callbackEach(err);
								    });
								    lob.on('close', function() {
								    });

								    var outStream = fs.createWriteStream(outFileName);
								    outStream.on('error', function(err) {
									console.error(err);
				  			    doRelease(connection);
									
									return callbackEach(err);
								    });
								    outStream.on('close', function(){
									//console.log(outFileName + " is fetched from DB");
									resultTot.push(row);
									
									return callbackEach(null);
								    });

								    lob.pipe(outStream);
								}

							    }
							});
							
						}
					});
							
							// if (err)
					    } else {
						resultTot.push(row);
						return callbackEach(null, {"message": row.FILENAME + " is on the disk cache"})
					    }
					});
					//with this callbackEach we continue with the next element of the array
				    }, function (err) {
					//this function will be called at the end of the loop, unless an error is called before
					if (err) {
					    return callback(err);
					} else {
					    return callback(null, resultTot);
					}
				    });
				} else {
				    doRelease(connection);
				    return callback({"message": 'Entry is not present in the table ' + table}, result); 
				}
			    });
	    }
	});

}

var checkAffections= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, table, callback){
    // check if the entry already exists in the visual affections temporary table
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    "SELECT sector, type, severity, vis_comment " +
			"FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board)",
			    {
				id_ls:ID_ls,
				id_se:ID_se,
				id_n:ID_n,
				id_n2:ID_n2,
				test_board:test_flag
			    },
			    function(err, result)
			    {
				if (err) {
				    doRelease(connection);
				    return callback(err);
				} else if (result.rows != ""){
				    doRelease(connection);
				    return callback(null, result);
				} else {
				    doRelease(connection);
				    return callback({"message": 'Entry is not present in the table ' + table}, result); 
				}
			    });
	    }
	});
}

var checkLogistic= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, table, callback){
    // check if the entry already exists in the table
    if (test_flag==true) {
	test_flag==1;
    } else if (test_flag==false) {
	test_flag==0;
    }
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    "SELECT  shipped_date, received_date, manufby, receivedby, manufreportok, manufreport_comment, manufreportbad, cern_user, checker_logistic, CHECK_DATE_LOGISTIC " +
			//"FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2)",
			"FROM " + table + " WHERE ( id_ls= :id_ls AND  id_se= :id_se AND id_n= :id_n AND id_n2= :id_n2 AND test_board= :test_board)",
			    {
				id_ls:ID_ls,
				id_se:ID_se,
				id_n:ID_n,
				id_n2:ID_n2,
				test_board:test_flag
			    },
			    function(err, result)
			    {
				if (err) {
				    doRelease(connection);
				    return callback(err);
				} else if (result.rows >1 ){
				    doRelease(connection);		
				    return callback(new Error("too many entries with the same name. That's bad, please report!"));
				} else if (result.rows != ""){
				    if (result.rows[0].FILENAME!=null) {
					fs.access(upload_folder+result.rows[0].FILENAME, fs.F_OK, function(err) {
					    if (err) {
						doRelease(connection);
						return callback({"message": "File " + result.rows[0].FILENAME +  "is not present on server, new feature needed: ask the developper."});
					    } 
					    doRelease(connection);
					    return callback(null, result);
					});
				    } else {
					doRelease(connection);
					return callback(null, result);
				    }
				} else {
				    doRelease(connection);
				    return callback({"message": 'Entry is not present in the table ' + table}, result); 
				}
			    });
	    }
	});
}

var registerHVTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	} else 	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
    }
    formatSpecificDate(req, "CHECK_DATE_HV", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board";
	    sql_string2=") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
	    if (req.body.SILVLINEOK!=null) {
		sql_string+= ", silvlineok";
		sql_string2+=", :silvlineok";
		sql_object.silvlineok=req.body.SILVLINEOK;
	    }
	    if (req.body.SILVLINELEFTOK!=null) {
		sql_string+= ", silvlineleftok";
		sql_string2+=", :silvlineleftok";
		sql_object.silvlineleftok=req.body.SILVLINELEFTOK;
	    }
	    if (req.body.SILVLINERIGHTOK!=null) {
		sql_string+= ", silvlinerightok";
		sql_string2+=", :silvlinerightok";
		sql_object.silvlinerightok=req.body.SILVLINERIGHTOK;
	    }
	    if (req.body.SILVLINEINSLEFTOK!=null) {
		sql_string+= ", silvlineinsleftok";
		sql_string2+=", :silvlineinsleftok";
		sql_object.silvlineinsleftok=req.body.SILVLINEINSLEFTOK;
	    }
	    if (req.body.SILVLINEINSRIGHTOK!=null) {
		sql_string+= ", silvlineinsrightok";
		sql_string2+=", :silvlineinsrightok";
		sql_object.silvlineinsrightok=req.body.SILVLINEINSRIGHTOK;
	    }
	    if (req.body.RESSTRIPLAYERLEFTUPOK!=null) {
		sql_string+= ", resstriplayerleftupok";
		sql_string2+=", :resstriplayerleftupok";
		sql_object.resstriplayerleftupok=req.body.RESSTRIPLAYERLEFTUPOK;
	    }
	    if (req.body.RESSTRIPLAYERLEFTDOWNOK!=null) {
		sql_string+= ", resstriplayerleftdownok";
		sql_string2+=", :resstriplayerleftdownok";
		sql_object.resstriplayerleftdownok=req.body.RESSTRIPLAYERLEFTDOWNOK;
	    }
	    if (req.body.RESSTRIPLAYERRIGHTUPOK!=null) {
		sql_string+= ", resstriplayerrightupok";
		sql_string2+=", :resstriplayerrightupok";
		sql_object.resstriplayerrightupok=req.body.RESSTRIPLAYERRIGHTUPOK;
	    }
	    if (req.body.RESSTRIPLAYERRIGHTDOWNOK!=null) {
		sql_string+= ", resstriplayerrightdownok";
		sql_string2+=", :resstriplayerrightdownok";
		sql_object.resstriplayerrightdownok=req.body.RESSTRIPLAYERRIGHTDOWNOK;
	    }
	    if (req.body.RESLEFTMIN!=null) {
		sql_string+= ", resleftmin";
		sql_string2+=", :resleftmin";
		sql_object.resleftmin=req.body.RESLEFTMIN;
	    }
	    if (req.body.RESLEFTMAX!=null) {
		sql_string+= ", resleftmax";
		sql_string2+=", :resleftmax";
		sql_object.resleftmax=req.body.RESLEFTMAX;
	    }
	    if (req.body.RESRIGHTMIN!=null) {
		sql_string+= ", resrightmin";
		sql_string2+=", :resrightmin";
		sql_object.resrightmin=req.body.RESRIGHTMIN;
	    }
	    if (req.body.RESRIGHTMAX!=null) {
		sql_string+= ", resrightmax";
		sql_string2+=", :resrightmax";
		sql_object.resrightmax=req.body.RESRIGHTMAX;
	    }
	    if (req.body.TOTALHVOK!=null) {
		sql_string+= ", totalhvok";
		sql_string2+=", :totalhvok";
		sql_object.totalhvok=req.body.TOTALHVOK;
	    }
	    if (req.body.TOTALHV_COMMENT!=null) {
		sql_string+= ", totalhv_comment";
		sql_string2+=", :totalhv_comment";
		sql_object.totalhv_comment=req.body.TOTALHV_COMMENT;
	    }


	    sql_string=sql_string+", checker_hv, check_date_hv" + sql_string2+", :checker_hv, :check_date_hv)";
	    sql_object.checker_hv=req.body.USER;
	    sql_object.check_date_hv=req.body.CHECK_DATE_HV;

	    //console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering table " + table + ":" + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else { 
		    callback(null, result);
		}
	    });
	}
    });
}

var registerResistive_CheckTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	} else 	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
    }
    formatSpecificDate(req, "CHECK_DATE_RESISTIVE_CHECK", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board";
	    sql_string2=") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
            if (req.body.RESVALUEMINB!=null) {
                sql_string+= ", resvalueminb";
                sql_string2+=", :resvalueminb";
                sql_object.resvalueminb=req.body.RESVALUEMINB;
            }
            if (req.body.RESVALUEMAXB!=null) {
                sql_string+= ", resvaluemaxb";
                sql_string2+=", :resvaluemaxb";
                sql_object.resvaluemaxb=req.body.RESVALUEMAXB;
            }
            if (req.body.RESVALUERMSB!=null) {
                sql_string+= ", resvaluermsb";
                sql_string2+=", :resvaluermsb";
                sql_object.resvaluermsb=req.body.RESVALUERMSB;
            }
            if (req.body.RESVALUEMEANB!=null) {
                sql_string+= ", resvaluemeanb";
                sql_string2+=", :resvaluemeanb";
                sql_object.resvaluemeanb=req.body.RESVALUEMEANB;
            }
            if (req.body.RESVALUEMINA!=null) {
                sql_string+= ", resvaluemina";
                sql_string2+=", :resvaluemina";
                sql_object.resvaluemina=req.body.RESVALUEMINA;
            }
            if (req.body.RESVALUEMAXA!=null) {
                sql_string+= ", resvaluemaxa";
                sql_string2+=", :resvaluemaxa";
                sql_object.resvaluemaxa=req.body.RESVALUEMAXA;
            }
            if (req.body.RESVALUERMSA!=null) {
                sql_string+= ", resvaluermsa";
                sql_string2+=", :resvaluermsa";
                sql_object.resvaluermsa=req.body.RESVALUERMSA;
            }
            if (req.body.RESVALUEMEANA!=null) {
                sql_string+= ", resvaluemeana";
                sql_string2+=", :resvaluemeana";
                sql_object.resvaluemeana=req.body.RESVALUEMEANA;
            }
            if (req.body.RESVALUERMSR!=null) {
                sql_string+= ", resvaluermsr";
                sql_string2+=", :resvaluermsr";
                sql_object.resvaluermsr=req.body.RESVALUERMSR;
            }
            if (req.body.RESVALUEMEANR!=null) {
                sql_string+= ", resvaluemeanr";
                sql_string2+=", :resvaluemeanr";
                sql_object.resvaluemeanr=req.body.RESVALUEMEANR;
            }

            if (req.body.TOTALResistive_CheckOK!=null) {
                sql_string+= ", RESISTIVE_CHECKOK";
                sql_string2+=", :RESISTIVE_CHECKOK";
                sql_object.RESISTIVE_CHECKOK=req.body.TOTALResistive_CheckOK;
            }
            if (req.body.RESISTIVE_CHECK_COMMENT!=null) {
                sql_string+= ", RESISTIVE_CHECK_COMMENT";
                sql_string2+=", :RESISTIVE_CHECK_COMMENT";
                sql_object.RESISTIVE_CHECK_COMMENT=req.body.RESISTIVE_CHECK_COMMENT;
            }

	    sql_string=sql_string+", checker_Resistive_Check, check_date_Resistive_Check" + sql_string2+", :checker_Resistive_Check, :check_date_Resistive_Check)";
	    sql_object.checker_Resistive_Check=req.body.USER;
	    sql_object.check_date_Resistive_Check=req.body.CHECK_DATE_RESISTIVE_CHECK;

	    //console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering table " + table + ":" + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else { 
		    callback(null, result);
		}
	    });
	}
    });
}

var registerCapacitance_CheckTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
	console.log("ndjfgnrlgve")
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	} else 	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
    }
    formatSpecificDate(req, "CHECK_DATE_CAPACITANCE_CHECK", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board";
	    sql_string2=") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
            if (req.body.CAPACITANCE_MEAN!=null) {
                sql_string+= ", CAPACITANCE_MEAN";
                sql_string2+=", :CAPACITANCE_MEAN";
                sql_object.CAPACITANCE_MEAN=req.body.CAPACITANCE_MEAN;
            }
           if (req.body.CAPACITANCE_FILE_CONTENT!=null) {
                sql_string+= ", capacitance_file_content";
                sql_string2+=", :capacitance_file_content";
                sql_object.capacitance_file_content=req.body.CAPACITANCE_FILE_CONTENT;
            }
	    sql_string=sql_string+", checker_Capacitance_Check, check_date_Capacitance_Check" + sql_string2+", :checker_Capacitance_Check, :check_date_Capacitance_Check)";
	    sql_object.checker_Capacitance_Check=req.body.USER;
	    sql_object.check_date_Capacitance_Check=req.body.CHECK_DATE_CAPACITANCE_CHECK;

	    console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering table " + table + ":" + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else { 
		    callback(null, result);
		}
	    });
	}
    });
}

var registerTotalFilled = function(ID_ls, ID_se, ID_n, ID_n2, req, callback) {
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	}
	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
    }

    formatSpecificDate(req, "FILLED_DATE", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO final_decision ( id_ls, id_se, id_n, id_n2, test_board, grandtotalok, filled_date, checker_final, action" +
			") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board, :grandtotalok, :filled_date, :checker_final, :action)";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
	    sql_object.grandtotalok=req.body.GRANDTOTALOK;
	    sql_object.filled_date=req.body.FILLED_DATE;
	    sql_object.checker_final=req.body.USER;
	    sql_object.action=req.body.ACTION;
	    //console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering final decision table: " + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else {
		    callback(null, result);
		}
	    });
	}
    });
}

var registerDimensionsTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	}
	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
    }
    formatSpecificDate(req, "CHECK_DATE_DIMENSIONS", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board";
	    sql_string2=") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
	    if (req.body.RM_DELTA1X!=null) {
		sql_string+= ", rm_delta1x";
		sql_string2+=", :rm_delta1x";
		sql_object.rm_delta1x=req.body.RM_DELTA1X;
	    }
	    if (req.body.RM_DELTA2X!=null) {
		sql_string+= ", rm_delta2x";
		sql_string2+=", :rm_delta2x";
		sql_object.rm_delta2x=req.body.RM_DELTA2X;
	    }
	    if (req.body.RM_DELTA3X!=null) {
		sql_string+= ", rm_delta3x";
		sql_string2+=", :rm_delta3x";
		sql_object.rm_delta3x=req.body.RM_DELTA3X;
	    }
	    if (req.body.RM_DELTA4X!=null) {
		sql_string+= ", rm_delta4x";
		sql_string2+=", :rm_delta4x";
		sql_object.rm_delta4x=req.body.RM_DELTA4X;
	    }
	    if (req.body.RM_DELTA5X!=null) {
		sql_string+= ", rm_delta5x";
		sql_string2+=", :rm_delta5x";
		sql_object.rm_delta5x=req.body.RM_DELTA5X;
	    }
	    if (req.body.RM_DELTA6X!=null) {
		sql_string+= ", rm_delta6x";
		sql_string2+=", :rm_delta6x";
		sql_object.rm_delta6x=req.body.RM_DELTA6X;
	    }
	    if (req.body.RM_DELTA7X!=null) {
		sql_string+= ", rm_delta7x";
		sql_string2+=", :rm_delta7x";
		sql_object.rm_delta7x=req.body.RM_DELTA7X;
	    }
	    if (req.body.RM_DELTA8X!=null) {
		sql_string+= ", rm_delta8x";
		sql_string2+=", :rm_delta8x";
		sql_object.rm_delta8x=req.body.RM_DELTA8X;
	    }
	    if (req.body.RM_DELTA9X!=null) {
		sql_string+= ", rm_delta9x";
		sql_string2+=", :rm_delta9x";
		sql_object.rm_delta9x=req.body.RM_DELTA9X;
	    }
	    if (req.body.RM_DELTA1Y!=null) {
		sql_string+= ", rm_delta1y";
		sql_string2+=", :rm_delta1y";
		sql_object.rm_delta1y=req.body.RM_DELTA1Y;
	    }
	    if (req.body.RM_DELTA2Y!=null) {
		sql_string+= ", rm_delta2y";
		sql_string2+=", :rm_delta2y";
		sql_object.rm_delta2y=req.body.RM_DELTA2Y;
	    }
	    if (req.body.RM_DELTA3Y!=null) {
		sql_string+= ", rm_delta3y";
		sql_string2+=", :rm_delta3y";
		sql_object.rm_delta3y=req.body.RM_DELTA3Y;
	    }
	    if (req.body.RM_DELTA4Y!=null) {
		sql_string+= ", rm_delta4y";
		sql_string2+=", :rm_delta4y";
		sql_object.rm_delta4y=req.body.RM_DELTA4Y;
	    }
	    if (req.body.RM_DELTA5Y!=null) {
		sql_string+= ", rm_delta5y";
		sql_string2+=", :rm_delta5y";
		sql_object.rm_delta5y=req.body.RM_DELTA5Y;
	    }
	    if (req.body.RM_DELTA6Y!=null) {
		sql_string+= ", rm_delta6y";
		sql_string2+=", :rm_delta6y";
		sql_object.rm_delta6y=req.body.RM_DELTA6Y;
	    }
	    if (req.body.RM_DELTA7Y!=null) {
		sql_string+= ", rm_delta7y";
		sql_string2+=", :rm_delta7y";
		sql_object.rm_delta7y=req.body.RM_DELTA7Y;
	    }
	    if (req.body.RM_DELTA8Y!=null) {
		sql_string+= ", rm_delta8y";
		sql_string2+=", :rm_delta8y";
		sql_object.rm_delta8y=req.body.RM_DELTA8Y;
	    }
	    if (req.body.RM_DELTA9Y!=null) {
		sql_string+= ", rm_delta9y";
		sql_string2+=", :rm_delta9y";
		sql_object.rm_delta9y=req.body.RM_DELTA9Y;
	    }
	    if (req.body.RM_PARALLELISMX!=null) {
		sql_string+= ", rm_parallelismx";
		sql_string2+=", :rm_parallelismx";
		sql_object.rm_parallelismx=req.body.RM_PARALLELISMX;
	    }
	    if (req.body.RM_PARALLELISMY!=null) {
		sql_string+= ", rm_parallelismy";
		sql_string2+=", :rm_parallelismy";
		sql_object.rm_parallelismy=req.body.RM_PARALLELISMY;
	    }
	    if (req.body.RM_ELONGATIONX!=null) {
		sql_string+= ", rm_elongationx";
		sql_string2+=", :rm_elongationx";
		sql_object.rm_elongationx=req.body.RM_ELONGATIONX;
	    }
	    if (req.body.RM_ELONGATIONY!=null) {
		sql_string+= ", rm_elongationy";
		sql_string2+=", :rm_elongationy";
		sql_object.rm_elongationy=req.body.RM_ELONGATIONY;
	    }
	    if (req.body.RM_FILE_CONTENT!=null) {
		sql_string+= ", rm_file_content";
		sql_string2+=", :rm_file_content";
		sql_object.rm_file_content=req.body.RM_FILE_CONTENT;
	    }
	    if (req.body.RASMASKOK!=null) {
		sql_string+= ", rasmaskok";
		sql_string2+=", :rasmaskok";
		sql_object.rasmaskok=req.body.RASMASKOK;
	    }
	    if (req.body.RASMASK2OK!=null) {
		sql_string+= ", rasmask2ok";
		sql_string2+=", :rasmask2ok";
		sql_object.rasmask2ok=req.body.RASMASK2OK;
	    }
	    if (req.body.TOTALDIMENSIONSOK!=null) {
		sql_string+= ", totaldimensionsok";
		sql_string2+=", :totaldimensionsok";
		sql_object.totaldimensionsok=req.body.TOTALDIMENSIONSOK;
	    }
	    if (req.body.TOTALDIMENSION_COMMENT!=null) {
		sql_string+= ", totaldimension_comment";
		sql_string2+=", :totaldimension_comment";
		sql_object.totaldimension_comment=req.body.TOTALDIMENSION_COMMENT;
	    }

	    sql_string=sql_string+", checker_dimensions, check_date_dimensions" + sql_string2+", :checker_dimensions, :check_date_dimensions)";
	    sql_object.checker_dimensions=req.body.USER;
	    sql_object.check_date_dimensions=req.body.CHECK_DATE_DIMENSIONS;
	    //console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering table " + table + ":" + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else {
		    callback(null, result);
		}
	    });
	}
    });

}
var registerPillarsTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    formatSpecificDate(req, "CHECK_DATE_PILLARS", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board";
	    sql_string2=") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
	    if (req.body.TAPETESTOK!=null) {
		sql_string+= ", tapetestok";
		sql_string2+=", :tapetestok";
		sql_object.tapetestok=req.body.TAPETESTOK;
	    }
	    if (req.body.PILLHEIGHT!=null) {
		sql_string+= ", pillheight";
		sql_string2+=", :pillheight";
		sql_object.pillheight=req.body.PILLHEIGHT;
	    }
	    if (req.body.PILLHEIGHTRMS!=null) {
		sql_string+= ", pillheightrms";
		sql_string2+=", :pillheightrms";
		sql_object.pillheightrms=req.body.PILLHEIGHTRMS;
	    }
	    if (req.body.PILLSHIFTOK!=null) {
		sql_string+= ", pillshiftok";
		sql_string2+=", :pillshiftok";
		sql_object.pillshiftok=req.body.PILLSHIFTOK;
	    }
	    if (req.body.DELTA_LR!=null) {
		sql_string+= ", delta_lr";
		sql_string2+=", :delta_lr";
		sql_object.delta_lr=req.body.DELTA_LR;
	    }
	    if (req.body.DELTA_BT!=null) {
		sql_string+= ", delta_bt";
		sql_string2+=", :delta_bt";
		sql_object.delta_bt=req.body.DELTA_BT;
	    }
            if (req.body.FWarnings!=null) {
                sql_string+= ", fil_warnings";
                sql_string2+=", :fil_warnings";
                sql_object.fil_warnings=req.body.FWarnings;
            }
            if (req.body.FWarning1!=null) {
                sql_string+= ", fil_warning1";
                sql_string2+=", :fil_warning1";
                sql_object.fil_warning1=req.body.FWarning1;
            }
            if (req.body.FWarning2!=null) {
                sql_string+= ", fil_warning2";
                sql_string2+=", :fil_warning2";
                sql_object.fil_warning2=req.body.FWarning2;
            }
            if (req.body.FWarning3!=null) {
                sql_string+= ", fil_warning3";
                sql_string2+=", :fil_warning3";
                sql_object.fil_warning3=req.body.FWarning3;
            }
	    if (req.body.PILL_FILE_CONTENT!=null) {
		sql_string+= ", pill_file_content";
		sql_string2+=", :pill_file_content";
		sql_object.pill_file_content=req.body.PILL_FILE_CONTENT;
	    }
	    if (req.body.TOTALPILLARSOK!=null) {
		sql_string+= ", totalpillarsok";
		sql_string2+=", :totalpillarsok";
		sql_object.totalpillarsok=req.body.TOTALPILLARSOK;
	    }
	    if (req.body.TOTALPILLARS_COMMENT!=null) {
		sql_string+= ", totalpillars_comment";
		sql_string2+=", :totalpillars_comment";
		sql_object.totalpillars_comment=req.body.TOTALPILLARS_COMMENT;
	    }

	    sql_string=sql_string+", checker_pillars, check_date_pillars" + sql_string2+", :checker_pillars, :check_date_pillars)";
	    sql_object.checker_pillars=req.body.USER;
	    sql_object.check_date_pillars=req.body.CHECK_DATE_PILLARS;
	    //console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering tmp pillars table: " + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else {
		    callback(null, result);
		}
	    });
	}
    });
}

var registerBacklightTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	}
	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
	if (req.body[key] == "null") {
	    req.body[key] = 0;
	}
    }
    formatSpecificDate(req, "CHECK_DATE_BACKLIGHT", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board";
	    sql_string2=") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board";
	    var sql_object= new Object();
	    sql_object.id_ls=ID_ls;
	    sql_object.id_se=ID_se;
	    sql_object.id_n=ID_n;
	    sql_object.id_n2=ID_n2;
	    sql_object.test_board=req.body.TEST_BOARD;
	    if (req.body.HOLESINTEROK!=null) {
		sql_string+= ", holesinterok";
		sql_string2+=", :holesinterok";
		sql_object.holesinterok=req.body.HOLESINTEROK;
	    }
	    if (req.body.HOLESOK!=null) {
		sql_string+= ", holesok";
		sql_string2+=", :holesok";
		sql_object.holesok=req.body.HOLESOK;
	    }
	    if (req.body.HOLES2OK!=null) {
		sql_string+= ", holes2ok";
		sql_string2+=", :holes2ok";
		sql_object.holes2ok=req.body.HOLES2OK;
	    }
	    if (req.body.EDGESACC_COMMENT!=null) {
		sql_string+= ", edgesacc_comment";
		sql_string2+=", :edgesacc_comment";
		sql_object.edgesacc_comment=req.body.EDGESACC_COMMENT;
	    }
	    if (req.body.EDGESACC!=null) {
		sql_string+= ", edgesacc";
		sql_string2+=", :edgesacc";
		sql_object.edgesacc=req.body.EDGESACC;
	    }
	    if (req.body.EDGERIGHTDOWN!=null) {
		sql_string+= ", edgerightdown";
		sql_string2+=", :edgerightdown";
		sql_object.edgerightdown=req.body.EDGERIGHTDOWN;
	    }
	    if (req.body.EDGERIGHTUP!=null) {
		sql_string+= ", edgerightup";
		sql_string2+=", :edgerightup";
		sql_object.edgerightup=req.body.EDGERIGHTUP;
	    }
	    if (req.body.EDGELEFTDOWN!=null) {
		sql_string+= ", edgeleftdown";
		sql_string2+=", :edgeleftdown";
		sql_object.edgeleftdown=req.body.EDGELEFTDOWN;
	    }
	    if (req.body.EDGELEFTUP!=null) {
		sql_string+= ", edgeleftup";
		sql_string2+=", :edgeleftup";
		sql_object.edgeleftup=req.body.EDGELEFTUP;
	    }
	    if (req.body.EDGESOK!=null) {
		sql_string+= ", edgesok";
		sql_string2+=", :edgesok";
		sql_object.edgesok=req.body.EDGESOK;
	    }
	    if (req.body.DBTRANSITIONS!=null) {
		sql_string+= ", dbtransitions";
		sql_string2+=", :dbtransitions";
		sql_object.dbtransitions=req.body.DBTRANSITIONS;
	    }
	    if (req.body.ALIGN_LEFT_L!=null) {
		sql_string+= ", align_left_l";
		sql_string2+=", :align_left_l";
		sql_object.align_left_l=req.body.ALIGN_LEFT_L;
	    }
	    if (req.body.ALIGN_LEFT_S!=null) {
		sql_string+= ", align_left_s";
		sql_string2+=", :align_left_s";
		sql_object.align_left_s=req.body.ALIGN_LEFT_S;
	    }
	    if (req.body.ALIGN_RIGHT_L!=null) {
		sql_string+= ", align_right_l";
		sql_string2+=", :align_right_l";
		sql_object.align_right_l=req.body.ALIGN_RIGHT_L;
	    }
	    if (req.body.ALIGN_RIGHT_S!=null) {
		sql_string+= ", align_right_s";
		sql_string2+=", :align_right_s";
		sql_object.align_right_s=req.body.ALIGN_RIGHT_S;
	    }
	    if (req.body.TOTALBACKLIGHTOK!=null) {
		sql_string+= ", totalbacklightok";
		sql_string2+=", :totalbacklightok";
		sql_object.totalbacklightok=req.body.TOTALBACKLIGHTOK;
	    }
	    if (req.body.TOTALBACKLIGHT_COMMENT!=null) {
		sql_string+= ", totalbacklight_comment";
		sql_string2+=", :totalbacklight_comment";
		sql_object.totalbacklight_comment=req.body.TOTALBACKLIGHT_COMMENT;
	    }



	sql_string=sql_string+", checker_backlight, check_date_backlight" + sql_string2+", :checker_backlight, :check_date_backlight)";
	sql_object.checker_backlight=req.body.USER;
	sql_object.check_date_backlight=req.body.CHECK_DATE_BACKLIGHT;
	//console.log(sql_string, sql_object);
	    executeSQL(sql_string, sql_object, function(err, result){
		if (err){
		    err.message="in registering backlight table: " + err.message;
		    err.sql_string=sql_string;
		    err.sql_object=sql_object;
		    return callback(err);
		} else {
		    callback(null, result);
		}
	    });
	}
    });
}

var registerToplightTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    formatSpecificDate(req, "CHECK_DATE_VISUAL", function(error, datazza){
	if (error) {
	    return callback(error);
	} else {
	    sql_string="INSERT INTO " + table + " ( id_ls, id_se, id_n, id_n2, test_board, kaptoncutok, kaptongluedok, copperwidthmean, copperwidthsigma, gapswidthmean, gapswidthsigma, coppergapsratio, coppergapsratioerror, totalvisualok, checker_visual, check_date_visual, totalvisual_comment, coverlaybubblesok " +
						   ") VALUES ( :id_ls, :id_se, :id_n, :id_n2, :test_board, :kaptoncutok, :kaptongluedok, :copperwidthmean, :copperwidthsigma, :gapswidthmean, :gapswidthsigma, :coppergapsratio, :coppergapsratioerror, :totalvisualok, :checker_visual, :check_date_visual, :totalvisual_comment, :coverlaybubblesok)";
						   var sql_object= new Object();
						   sql_object.id_ls=ID_ls;
						   sql_object.id_se=ID_se;
						   sql_object.id_n=ID_n;
						   sql_object.id_n2=ID_n2;
						   sql_object.test_board=req.body.TEST_BOARD;
						   sql_object.kaptoncutok=req.body.KAPTONCUTOK;
						   sql_object.kaptongluedok=req.body.KAPTONGLUEDOK;
						   sql_object.copperwidthmean=req.body.COPPERWIDTHMEAN;
						   sql_object.copperwidthsigma=req.body.COPPERWIDTHSIGMA;
						   sql_object.gapswidthmean=req.body.GAPSWIDTHMEAN;
						   sql_object.gapswidthsigma=req.body.GAPSWIDTHSIGMA;
						   sql_object.coppergapsratio=req.body.COPPERGAPSRATIO;
						   sql_object.coppergapsratioerror=req.body.COPPERGAPSRATIOERROR;
						   sql_object.totalvisualok=req.body.TOTALVISUALOK;
						   sql_object.checker_visual=req.body.USER;
						   sql_object.check_date_visual=req.body.CHECK_DATE_VISUAL;
						   sql_object.totalvisual_comment=req.body.TOTALVISUAL_COMMENT;
						   sql_object.coverlaybubblesok=req.body.COVERLAYBUBBLESOK;
						   //console.log(sql_string, sql_object);
						   executeSQL(sql_string, sql_object, function(err, result){
						       if (err){
							   err.message="in registering tmp visual table: " + err.message;
							   err.sql_string=sql_string;
							   err.sql_object=sql_object;
							   return callback(err);
						       } else {
							   callback(null, result);
						       }
						   });
	}
    });
}

var registerNewLogisticTable = function(ID_ls, ID_se, ID_n, ID_n2, req, table, callback) {
    for (var key in req.body) {
	if (req.body[key] == true) {
	    req.body[key] = 1;
	}
	if (req.body[key] == false) {
	    req.body[key] = 0;
	}
    }

    format_dates=[];

    format_dates.push(function(callback) {
	formatSpecificDate(req, "SHIPPED_DATE", function(error, datazza){
	    if (error) {
		return callback(error);
	    } else {
		return callback(null, datazza);
	    }
	});
    });

    format_dates.push(function(callback) {
	formatSpecificDate(req, "RECEIVED_DATE", function(error, datazza){
	    if (error) {
		return callback(error);
	    } else {
		return callback(null, datazza);
	    }
	});
    });

    format_dates.push(function(callback) {
	formatSpecificDate(req, "CHECK_DATE_LOGISTIC", function(error, datazza){
	    if (error) {
		return callback(error);
	    } else {
		return callback(null, datazza);
	    }
	});
    });

    async.parallel(format_dates, function(errAsync){
	if (errAsync){
	    return callbackTot(errAsync);
	} else {
	    oracledb.getConnection(
		{
		    user          : dbConfig.user,
		    password      : dbConfig.password,
		    connectString : dbConfig.connectString
		},
		function(err, connection)
		{
		    if (err) {
			return callback(err);
		    } else {
			sql_string_log="INSERT INTO " + table + " (id_ls, id_se, id_n, id_n2, test_board, manufreportok, manufreport_comment, manufreportbad, checker_logistic, check_date_logistic) VALUES (:id_ls, :id_se, :id_n, :id_n2, :test_board, :manufreportok, :manufreport_comment, :manufreportbad, :checker_logistic, :check_date_logistic) ";
			sql_obj_log=new Object();
			sql_obj_log.id_ls=ID_ls;
			sql_obj_log.id_se=ID_se;
			sql_obj_log.id_n=ID_n;
			sql_obj_log.id_n2=ID_n2;
			sql_obj_log.test_board= req.body.TEST_BOARD;
			sql_obj_log.manufreportok= req.body.MANUFREPORTOK;
			sql_obj_log.manufreport_comment= req.body.MANUFREPORT_COMMENT;
			sql_obj_log.manufreportbad= req.body.MANUFREPORTBAD;
			sql_obj_log.checker_logistic= req.body.USER;
			sql_obj_log.check_date_logistic= req.body.CHECK_DATE_LOGISTIC;
			executeSQL(sql_string_log, sql_obj_log, function(err, result){
			    if (err){
				err.message="In register to " + table + err.message;
				err.sql_string=sql_string_log;
				err.sql_obj=sql_obj_log;
				return callback(err);
			    } else { 
				return callback(null, result);
			    }
			});

		    };
		});
	}
    });
}

var registerVisualAffections= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, affection, table, callback)
{
    sql_string_vis="INSERT INTO " + table + "  (id_ls, id_se, id_n, id_n2, test_board, sector, type, severity, vis_comment) VALUES (:id_ls, :id_se, :id_n, :id_n2, :test_board, :sector, :type, :severity, :vis_comment)";
    var sql_object_vis= new Object();
    sql_object_vis.id_ls=ID_ls;
    sql_object_vis.id_se=ID_se;
    sql_object_vis.id_n=ID_n;
    sql_object_vis.id_n2=ID_n2;
    sql_object_vis.test_board=test_flag;
    sql_object_vis.sector=affection.Sector;
    sql_object_vis.type=affection.Type;
    sql_object_vis.severity=affection.Severity;
    sql_object_vis.vis_comment=affection.Comment;
    console.log(affection.Comment)
	console.log (sql_string_vis)
    executeSQL(sql_string_vis, sql_object_vis, function(err, result){
	if (err){
	    err.message="In registerVisualAffections" + err.message;
	    err.sql_string=sql_string;
	    err.sql_object=sql_object;
	    return callback(err);
	} else {
	    result.message="Added visual affection for sector " + affection.Sector + " of type " + affection.Type + " and severity " + affection.Severity ;
	    return callback(null, result);
	}
    });
}

var registerBLOBs= function (ID_ls, ID_se, ID_n, ID_n2, test_flag, BLOB, table, callback)
{
    inFileName=BLOB.Filename;
    if (BLOB.Sector=="nonConformityReport"){
	fileType="report";
    } else if (BLOB.Sector=="manufReport"){
	fileType="report";
    } else {
	fileType="image";
    }
    //we parse the filename to understand what we have to write in the table
    //Sector= inFileName.charAt(6) + inFileName.charAt(7) + inFileName.charAt(8)  + inFileName.charAt(9);
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		return callback(err);
	    } else {
		connection.execute(
		    "INSERT INTO " + table + " (id_ls, id_se, id_n, id_n2, test_board,  sector, type, description, filename, content) VALUES (:id_ls, :id_se, :id_n, :id_n2, :test_board, :sector, :type, :description, :filename, EMPTY_BLOB()) RETURNING content INTO :lobbv",
		    {	
			id_ls: ID_ls,
			id_se: ID_se,
			id_n: ID_n,
			id_n2: ID_n2,
			test_board: test_flag,
			sector: BLOB.Sector,
			type: fileType,
			description: BLOB.Comment,
			filename: inFileName,
			lobbv: {type: oracledb.BLOB, dir: oracledb.BIND_OUT} },
			{ autoCommit: false },  // a transaction needs to span the INSERT and pipe()
			function(err, result)
			{
			    if (err) 
				return callback(err);
			    else if (result.rowsAffected != 1 || result.outBinds.lobbv.length != 1) {
				//console.error('Error getting a LOB locator');
				return callback(new Error("Error getting a LOB locator"));
			    }

			    var lob = result.outBinds.lobbv[0];
			    lob.on(
				'error',
				function(err)
				{
				    console.log("lob.on 'error' event");
				    console.error(err);
				    return callback(err);
				});
				lob.on(
				    'finish',
				    function()
				    {
					//console.log("lob.on 'finish' event");
					connection.commit(
					    function(err)
					    {
						if (err)
						    return callback(err);
						else
						    console.log("file " + inFileName + " uploaded successfully.");
						connection.release(function(err) {
						    if (err)
							return callback(err);
						});
						var message2send="File" + inFileName + " uploaded successfully.";
						return callback(null, message2send);
					    });
				    });

				    //console.log('Reading from ' + upload_folder + inFileName);
				    var inStream = fs.createReadStream(upload_folder+inFileName);
				    inStream.on(
					'error',
					function(err)
					{
					    console.log("inStream.on 'error' event");
					    console.error(err);
					    connection.release(function(err) {
						if (err)
						    return callback(err);
					    });
					    return callback(err);
					});

					inStream.pipe(lob);  // copies the text to the BLOB
			});
	    }
	});
}

var formatSpecificDate = function (req, which_key, callback) {
    if (req.body[which_key]) {
    	if (req.body[which_key].indexOf("Z")>0) {  
		//if the dates are not already adjusted 
		var yy = req.body[which_key].substring(0,4);
		var mm = req.body[which_key].substring(5,7);
		if (mm=="01") mm="JAN";
		else if (mm=="02") mm="FEB";
		else if (mm=="03") mm="MAR";
		else if (mm=="04") mm="APR";
		else if (mm=="05") mm="MAY";
		else if (mm=="06") mm="JUN";
		else if (mm=="07") mm="JUL";
		else if (mm=="08") mm="AUG";
		else if (mm=="09") mm="SEP";
		else if (mm=="10") mm="OCT";
		else if (mm=="11") mm="NOV";
		else if (mm=="12") mm="DEC";
		else return (new Error("Date format unknown"));
		var dd = parseInt(req.body[which_key].substring(8,10));
		if (dd<10) dd="0"+ String(dd);
		newdate=dd+"-"+mm+"-"+yy;
		req.body[which_key]= newdate;
		return callback(null, newdate);
    	} else {
		console.log(which_key +  " = "  + req.body[which_key] + " is already adjusted");
		return callback(null, req.body[which_key]);
    	}
    } else {
		req.body[which_key]= "01-JAN-80";
		return callback(null, "01-JAN-80");
    }
}

var executeSQL = function (sql_string, sql_object, callback) {
    //console.log("executing " + sql_string);
    oracledb.getConnection(
	{
	    user          : dbConfig.user,
	    password      : dbConfig.password,
	    connectString : dbConfig.connectString
	},
	function(err, connection)
	{
	    if (err) {
		console.error(err.message);
		return callback(err);
	    } else {
		connection.execute(sql_string,sql_object,
				   {autoCommit: true},
				   function(err, result)
				   {
				       if (err) {
					   //console.error("In executing SQL: "+err);
					   doRelease(connection);
					   return callback(err);
				       } else {
					   doRelease(connection);
					   return callback(null, result);
				       }
				   });
	    }
	});
}

module.exports = {
    parentBoardFoil: function (req, res, callbackTot){
	"use strict";
	//first we check if the parenting is allowed
	var allowed_parenting=false;
	var allowed_par_board=true;
	var allowed_par_foil2=false;
	var allowed_group_foil=true;
	var allowed_group_board = true;
	console.log(req.body.userCN);

        var sql_string="SELECT * FROM  ATLAS_MUON_NSW_MM_LOG.parenting WHERE parenteqentryid= :eqentryid"
        var sql_object={eqentryid:req.body.board_id}
        executeSQL(sql_string, sql_object, function(err, result2){
            if (err){
            return callbackTot(err);
            } else if (result2.rows != ""){
            	allowed_par_board=false;
                //callbackTot(new Error("Board already parented"));

	    }
	});


        sql_string="SELECT * FROM  ATLAS_MUON_NSW_MM_LOG.parenting WHERE eqentryid= :eqentryid"
        sql_object={eqentryid:req.body.foil_id}
        executeSQL(sql_string, sql_object, function(err, result2){
            if (err){
            return callbackTot(err);
        
	    } else if (result2.rows != ""){

		async.each(result2.rows, function (row, callback) {
		if (row["PARENTEQENTRYID"]==2){
		
                allowed_par_foil2=true;
		console.log("oass") }
                //callbackTot(new Error("Foil already parented"));
		});
	    }
		else if (result2.rows == ""){
			allowed_par_foil2=true;
		}
        });



        sql_string="SELECT QUANTITY FROM  ATLAS_MUON_NSW_MM_LOG.EQUIPMENT where ID_EQUIPMENT = :eqentryid"
        sql_object={eqentryid:req.body.foil_id}
        executeSQL(sql_string, sql_object, function(err, result2){
            if (err){
            return callbackTot(err);
            } else if (result2.rows["QUANTITY"] != null){
                allowed_group_foil=false;
                //callbackTot(new Error("Foil is a group"));

            }
        });

        sql_string="SELECT QUANTITY FROM  ATLAS_MUON_NSW_MM_LOG.EQUIPMENT where ID_EQUIPMENT = :eqentryid"
        sql_object={eqentryid:req.body.board_id}
        executeSQL(sql_string, sql_object, function(err, result2){
            if (err){
            return callbackTot(err);
            } else if (result2.rows["QUANTITY"] != null){
                allowed_group_board=false;
                //callbackTot(new Error("Board is a group"));

            }
        });


	setTimeout(function(){
	console.log( allowed_par_foil2 + "\t" + allowed_par_board+ "\t" +allowed_group_board+ "\t" +allowed_group_foil)
	if (!allowed_par_foil2 || !allowed_par_board || !allowed_group_board || !allowed_group_foil) {
		return callbackTot(new Error( "Boards and Foils cannot be parented."))

	}else{
	var sql_string="SELECT allowedparent FROM atlas_muon_nsw_mm_log.allowedparenting where eqtypecode= :eqtypecode";
	var sql_object={eqtypecode:req.body.foil_mtf.substring(5,9)}
	executeSQL(sql_string, sql_object, function(err, result){
	    if (err){
		return callbackTot(err);
	    } else {
		//we loop over all the results to find the code of the board, if present. Otherwise we call an error
		async.each(result.rows, function (row, callback) {
		if (row["ALLOWEDPARENT"]==req.body.board_mtf.substring(5,9)) {
		    allowed_parenting=true;
		}
		callback(null);
		}, function (err) {
		    //this function will be called at the end of the loop, unless an error is called in the loop
		    if (err) {
			return callbackTot(err);
		    } else {
console.log( allowed_par_foil2 + "\t" + allowed_par_board+ "\t" +allowed_group_board+ "\t" +allowed_group_foil + "\t" +allowed_parenting)

			var procced = false;
			if (allowed_parenting  ) {
			    oracledb.getConnection(
				{
				    user          : dbConfig.user_log_w,
				    password      : dbConfig.password_log_w,
				    connectString : dbConfig.connectString
				},
				function(err, connection)
				{
				    if (err) {
					return callbackTot(err);
				    } else {
					var now = new Date();
					var utc_timestamp = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
					console.log(utc_timestamp)
					connection.execute(
					    "INSERT INTO ATLAS_MUON_NSW_MM_LOG.parenting (eqentryid, parenteqentryid, position, isactiveflag, websiteusercr, websiteusered, EVENTDATE) VALUES (:eqentryid, :parenteqentryid, :position, :isactiveflag, :websiteusercr, :websiteusered, :eventdate)",
					    {
						eqentryid:req.body.foil_id,
						parenteqentryid:req.body.board_id,
						position: null,
						isactiveflag: 'T',
						websiteusercr: req.body.userCN,
						websiteusered: req.body.userCN,
						eventdate: utc_timestamp
					    },
					    { autoCommit: true},
					    function(err, result)
					    {
						if (err) {
						    console.log(err)
						    doRelease(connection);
						    return callbackTot(err);
						} else {
							connection.execute(
							    "UPDATE ATLAS_MUON_NSW_MM_LOG.parenting SET ISACTIVEFLAG = 'F' WHERE EQENTRYID = :eqentryid AND PARENTEQENTRYID = :idorphanage",
							    {
									eqentryid:req.body.foil_id,
									idorphanage: '2'
							    },
							    { autoCommit: true},
							    function(err, result)
							    {
								if (err) {
								    console.log(err)
								    doRelease(connection);
								    return callbackTot(err);
								} else {
									// var now = new Date;
									// var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() ,
									//       now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
									// console.log(now);
									//
									var now = new Date();
                                        var utc_timestamp = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

									connection.execute(
									    "INSERT INTO ATLAS_MUON_NSW_MM_LOG.STATUSLOCATION (EQENTRYID, STATUSID, websiteusercr, websiteusered, MAJORLOCID, EVENTDATE) VALUES (:eqentryid, :statusid, :websiteusercr, :websiteusered, :majorlocid, :eventdate)",
									    {
											eqentryid:req.body.foil_id,
											statusid: '11',
											websiteusercr: req.body.userCN,
											websiteusered: req.body.userCN,
											majorlocid: '25',
											eventdate: utc_timestamp
									    },
									    { autoCommit: true},
									    function(err, result)
									    {
										if (err) {
										    console.log(err)
										    doRelease(connection);
										    return callbackTot(err);
										} else {

										    console.log(result);
										    doRelease(connection);
										    return callbackTot(null, {"message": 'Entries successfully parented'}); 
										}
									    });
								}
							    });
						}
					    });
				    }
				});
			} else { 
			    callbackTot(new Error("Parenting between " + req.body.board_mtf + " and " + req.body.foil_mtf+ " is not allowed"))
			}
		    }
		})
	    }
	});
   } },1000)},

    checkLog: function (req, res, callbackTot){
	// check if the entry already exists in the logistic database
	var ID_ls=req.body.id.charAt(0).toUpperCase();
	var ID_se=req.body.id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.id.charAt(2));
	var ID_n2=parseInt(req.body.id.charAt(3)+ req.body.id.charAt(4) + req.body.id.charAt(5));
	if (req.body.id.charAt(6).toUpperCase()=="T") {
	    var isTest=true;
	} else {
	    var isTest=false;
	}
	var object=req.body.object;

	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}

	if (object=="board") {
	    if (isTest) {
		alias_ID="20MNMBSE209998";
		char2look='O';
	    } else {
		var alias_ID=ID_ls+ID_se+ID_n+pad(ID_n2,3);
		char2look='F';
	    }
	} else if (object=="resfoil"){
	    var alias_ID=req.body.id;
	}
	console.log(alias_ID);
	results_tot=[];	
	tables =["EQUIPMENTDETAILS", "EQCOMMENTS", "STATUSLOCATION", "STICKERS", "DOCLINK"];
	oracledb.getConnection(
	    {
		user          : dbConfig.user_log,
		password      : dbConfig.password_log,
		connectString : dbConfig.connectString
	    },
	    function(err, connection)
	    {
		if (err) {
		    doRelease(connection);
		    return callbackTot(err);
		} else {
		    connection.execute(
			"SELECT * " +
			    " from ATLAS_MUON_NSW_MM_LOG.EQUIPMENT where OTHERID= :alias_id",
			    //" from ATLAS_MUON_NSW_MM_LOG.EQUIPMENT, ATLAS_MUON_NSW_MM_LOG.EQUIPMENTDETAILS where ATLAS_MUON_NSW_MM_LOG.EQUIPMENT.id_equipment = ATLAS_MUON_NSW_MM_LOG.EQUIPMENTDETAILS.eqentryid and PARTSBATCHMTFID= :mtf_id",
				{
				    alias_id:alias_ID
				},
				function(err, result)
				{
				    if (err) {
					doRelease(connection);
					return callbackTot(err);
				    } else if (result.rows != ""){
					doRelease(connection);
					results_tot.push({equipment: result});

					//we loop over the tables to grab all available informations
					async.each(tables, function (table, callbackEach) {
					    sql_string="SELECT * FROM ATLAS_MUON_NSW_MM_LOG." + table + " WHERE eqentryid= :eqentryid"
					    sql_object={eqentryid:result.rows[0]["ID_EQUIPMENT"]}
					    executeSQL(sql_string, sql_object, function(err, result2){
						if (err){
						    return callbackEach(err);
						} else {
						    //results_tot.push({table: result2});
						    if (Object.keys(result2.rows).length>0) {
							if (table=='EQUIPMENTDETAILS') {
							    results_tot.push({equipmentdetails: result2});
							} else if (table=="EQCOMMENTS") {
							    results_tot.push({eqcomments: result2});
							} else if (table="STATUSLOCATION") {
								results_tot.push({statuslocation: result2});
							} else if (table="STICKERS") {
							    results_tot.push({stickers: result2});
							}
						    }
                                                    else if (Object.keys(result2.rows).length==0 && table=='EQUIPMENTDETAILS') {
sql_string="SELECT BATCHHERITAGE.PARENTBATCHEQENTRYID FROM ATLAS_MUON_NSW_MM_LOG.BATCHHERITAGE start with BATCHHERITAGE.EQENTRYID= :eqentryid connect by prior PARENTBATCHEQENTRYID = EQENTRYID"
                                            		sql_object={eqentryid:result.rows[0]["ID_EQUIPMENT"]}
                                            		executeSQL(sql_string, sql_object, function(err, result4){
                                                		if (err){
                                                    			return callbackTot(err);
                                                		} else {
									sql_string="SELECT * FROM ATLAS_MUON_NSW_MM_LOG.EQUIPMENTDETAILS WHERE eqentryid= :eqentryid2"
                                            				sql_object={eqentryid2:result4.rows[0]["PARENTBATCHEQENTRYID"]}
                                            				executeSQL(sql_string, sql_object, function(err, result5){
	                                                			if (err){
                                                    					return callbackTot(err);
                                                				} else {
											if (Object.keys(result5.rows).length>0) 
											{
												results_tot.push({equipmentdetails: result5});	
												
											}

										}
									});
							
								}	
							});
                                                    }
						setTimeout(function(){
                                                   return callbackEach(null);
						}, 500);
						
						}
					    });

					}, function (err) {
					    //this function will be called at the end of the loop, unless an error is called before
					    if (err) {
						return callbackTot(err);
					    } else {
						
						// We fetched all the data, but in case of a board we have to check if it's already parented in the logistic DB
						if (object=="board") {
						    //toporagno : prevedere il contrario
						    sql_string="SELECT * FROM  ATLAS_MUON_NSW_MM_LOG.parenting WHERE parenteqentryid= :eqentryid"
						    sql_object={eqentryid:result.rows[0]["ID_EQUIPMENT"]}
						    executeSQL(sql_string, sql_object, function(err, result2){
							if (err){
							    return callbackTot(err);
							} else if (result2.rows != ""){
							    var parentFoilFound=false;
							    async.each(result2.rows, function (row, callbackEach) {
								//we have to verify that between those entries there is a foil
								sql_string="SELECT * FROM ATLAS_MUON_NSW_MM_LOG.EQUIPMENT WHERE id_equipment= :id_equipment"
								sql_object={id_equipment:row["EQENTRYID"]}
								executeSQL(sql_string, sql_object, function(err, result3){
								    if (err){
									return callbackEach(err);
								    } else {
									if (result3.rows[0]["PARTSBATCHMTFID"].charAt(5)==char2look) {
									    //ok, this board is already parented to a foil. Let's grab the informations about that foil
									    results_parent=[]
									    results_parent.push({parenting: {rows: [row]}});
									    tables.push("EQUIPMENT");
									    parentFoilFound=true;
									    async.each(tables, function (table, callbackEach2) {
										//toporagno : prevedere diversi apparentamenti
										if (table=="EQUIPMENT") {
										    sql_string="SELECT * FROM ATLAS_MUON_NSW_MM_LOG." + table + " WHERE id_equipment= :id_equipment"
										    sql_object={id_equipment:row["EQENTRYID"]}
										} else {
										    sql_string="SELECT * FROM ATLAS_MUON_NSW_MM_LOG." + table + " WHERE eqentryid= :eqentryid"
										    sql_object={eqentryid:row["EQENTRYID"]}
										}
										executeSQL(sql_string, sql_object, function(err, result3){
										    if (err){
											return callbackEach2(err);
										    } else {
											if (Object.keys(result3.rows).length>0) {
											    if (table=='EQUIPMENT') {
												results_parent.push({equipment: result3});
											    } else if (table=='EQUIPMENTDETAILS') {
												results_parent.push({equipmentdetails: result3});
											    } else if (table=="EQCOMMENTS") {
												results_parent.push({eqcomments: result3});
											    } else if (table="STATUSLOCATION") {
												results_parent.push({statuslocation: result3});
											    } else if (table="STICKERS") {
												results_parent.push({stickers: result3});
											    }
											}
											return callbackEach2(null);
										    }
										});

									    }, function (err) {
										//this function will be called at the end of the loop, unless an error is called before
										if (err) {
										    return callbackTot(err);
										} else {
										    //we add the parent foil informations in the array
										    results_tot.push({parent: results_parent});
										    return callbackEach(null);
										}
									    });
									} else {; //end of the if about the found foil
									    return callbackEach(null);
									}

								    }
								}) //end of the executeSQL
							    }, function (err) {//end of the loop over the rows
								//this function will be called at the end of the loop, unless an error is called before
								if (err) {
								    return callbackTot(err);
								} else {
								    return callbackTot(null, results_tot);
								}
							    });

							} else {
							    //no parented foil, we return only the board results
							    console.log("this board has not a parent foil");
							    return callbackTot(null, results_tot);
							}
						    });
						} else {
						    //this is a request for a foil...
						    return callbackTot(null, results_tot);
						}
					    }
					});
				    } else {
					doRelease(connection);
					return callbackTot({"message": 'Entry is not present in the logistic DB'}, result); 
				    }
				});
		}
	    });
    },

    checkResFoil: function(req, res, callbackTot) {
	oracledb.getConnection(
	    {
		user          : dbConfig.user,
		password      : dbConfig.password,
		connectString : dbConfig.connectString
	    },
	    function(err, connection)
	    {
		if (err) {
		    return callbackTot(err);
		} else {
		    connection.execute(
			"SELECT total_grade " +
			    "FROM resistive_foils WHERE ( foilid= :foilid)",
				{
				    foilid:req.body.foil_id.toUpperCase()
				},
				function(err, result)
				{
				    if (err) {
					doRelease(connection);
					return callbackTot(err);
				    } else if (result.rows != ""){
					doRelease(connection);
					return callbackTot(null, result);
				    } else {
					doRelease(connection);
					return callbackTot({"message": 'Entry is not present in the table resistive_foils'}, result); 
				    }
				});
		}
	    });
    },

    checkEntry: function(req, res, callbackTot) {
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));

	data2SQL=[]; // in this vector we add the functions wich will be executed in "series" mode

	//first we check if there is data in the temporary tables for this ID
	if (req.body.test_flag==true) {
	    req.body.test_flag=1;
	} else if (req.body.test_flag==false) {
	    req.body.test_flag=0;
	}
	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "logistic_table_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table logistic_table_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, {"message": 'Entry is present in the table logistic_table_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "toplight_inspection_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table toplight_inspection_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table toplight_inspection_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "backlight_inspection_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table backlight_inspection_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table backlight_inspection_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkAffections(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "visual_errors_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table visual_errors_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table visual_errors_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkBLOBs(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "all_blobs_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table all_blobs_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		} else { 
		    return callbackTmp(null, { "message": 'Entry is present in the table all_blobs_tmp', "result" : result}); 
		}
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "dimensions_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table dimensions_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table dimensions_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "pillars_inspection_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table pillars_inspection_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table pillars_inspection_tmp', "result" : result}); 
	    });
	});
	
	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "Capacitance_Check_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table Capacitance_Check_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table Capacitance_Check_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkPillarsAffections(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "pillars_errors_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table pillars_errors_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
		    } else {
			return callbackTmp(err);
		    }
		}
		return callbackTmp(null, { "message": 'Entry is present in the table pillars_errors_tmp', "result" : result}); 
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "hv_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table hv_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the series
		    } else {
			return callbackTmp(err);
		    }
		}
		//we call the error for using the feature of the "series" mode of Async, so the next function will not be executed
		return callbackTmp(null, { "message": 'Entry is present in the table hv_tmp', "result" : result});
	    });
	});

	data2SQL.push(function(callbackTmp){
	    checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "Resistive_Check_tmp", function(err, result){
		if(err){
		    //if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
		    if (err.message=="Entry is not present in the table Resistive_Check_tmp") {
			return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the series
		    } else {
			return callbackTmp(err);
		    }
		}
		//we call the error for using the feature of the "series" mode of Async, so the next function will not be executed
		return callbackTmp(null, { "message": 'Entry is present in the table Resistive_Check_tmp', "result" : result});
	    });
	});

        async.parallel(data2SQL, function(errAsync, result){
            if (errAsync){
                return callbackTot(errAsync);
            } else {
		var thereAreTmpEntries=0;
		result.forEach( function(item){
		    if (item!=null){
			thereAreTmpEntries+=1;
		    } 
		});
		if (thereAreTmpEntries>0) {
		    console.log("There is data in the temporary tables, which should be loaded");
		    return callbackTot(null, result);
		} else {
		    console.log("no results in the temporary tables: we check in the definitive tables");
		    data2SQL=[]; //voiding this array

		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "logistic_table", function(err, result){
			    if(err){
				if (err.message=="Entry is not present in the table logistic_table") {
				    err.message="Entry is not present in the DB";
				    console.log(err);
				    return callbackTmp(err);
				} else {
				    return callbackTmp(err);
				}
			    } else {
				if (result.rows != ""){
				    return callbackTmp(null, {"message": 'Entry is present in the table logistic_table', "result" : result}); 
				}
				else {
				    return callbackTmp({"message": 'Entry is not present in the DB'});
				}
			    }
			});
		    });


		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "toplight_inspection", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table toplight_inspection") {
				    //return callbackTmp(new Error("There is no data in definitive table toplight_inspection. This is unexpected!"));
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table toplight_inspection', "result" : result}); 
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "backlight_inspection", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table backlight_inspection") {
				    //return callbackTmp(new Error("There is no data in definitive table backlight_inspection. This is unexpected!"));
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table backlight_inspection', "result" : result}); 
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkAffections(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "visual_errors", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table visual_errors") {
				    return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table visual_errors', "result" : result}); 
			    }
			});
		    });


		    data2SQL.push(function(callbackTmp){
			checkBLOBs(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "all_blobs", function(err, result){
			    if(err){
				if (err.message=="Entry is not present in the table all_blobs") {
				    return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table all_blobs', "result" : result}); 
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "dimensions", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table dimensions") {
				    //return callbackTmp(new Error("There is no data in definitive table dimensions. This is unexpected!"));
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table dimensions', "result" : result}); 
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "pillars_inspection", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table pillars_inspection") {
				    //return callbackTmp(new Error("There is no data in definitive table pillars_inspection. This is unexpected!"));
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table pillars_inspection', "result" : result}); 
			    }
			});
		    });
			 
		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "Capacitance_Check", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table Capacitance_Check") {
				    //return callbackTmp(new Error("There is no data in definitive table pillars_inspection. This is unexpected!"));
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table Capacitance_Check', "result" : result}); 
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkPillarsAffections(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "pillars_errors", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table pillars_errors") {
				    return callbackTmp(null, null);//we do not pass the error because otherwise we will stop the execution of the stack
				} else {
				    return callbackTmp(err);
				}
			    } else {
				return callbackTmp(null, { "message": 'Entry is present in the table pillars_errors', "result" : result}); 
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "hv", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table hv") {
				    return callbackTmp(null, null);
				    //return callbackTmp(new Error("There is no data in definitive table HV. This is unexpected!"));
				} else {
				    return callbackTmp(err);
				}
			    } else{ 
				return callbackTmp(null, { "message": 'Entry is present in the table hv', "result" : result});
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkGeneralTable(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, "Resistive_Check", function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table Resistive_Check") {
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else{ 
				return callbackTmp(null, { "message": 'Entry is present in the table Resistive_Check', "result" : result});
			    }
			});
		    });

		    data2SQL.push(function(callbackTmp){
			checkFinal(ID_ls, ID_se, ID_n, ID_n2, req.body.test_flag, function(err, result){
			    if(err){
				//if we get this message, we pass by to the subsequent function, which will check the main table (non-temporary)
				if (err.message=="Entry is not present in the table final_decision") {
				    return callbackTmp(null, null);
				} else {
				    return callbackTmp(err);
				}
			    } else{ 
				return callbackTmp(null, { "message": 'Entry is present in the table final_decision', "result" : result});
			    }
			});
		    });

		    async.parallel(data2SQL, function(errAsync, result){
			if (errAsync){
			    console.log(errAsync);
			    return callbackTot(errAsync);
			} else {
			    var thereAreTmpEntries=0;
			    result.forEach( function(item){
				if (item!=null){
				    thereAreTmpEntries+=1;
				} 
			    });
			    if (thereAreTmpEntries>0) {
				console.log("There is data in the definitive tables, which should be loaded");
				return callbackTot(null, {"message" : "There is data in the definitive tables, which should be loaded", "results" : result});
			    } else {
				return callbackTot({"message": 'Entry is not present in the DB'});
			    }
			}
		    });

		}//here we close the other else
	    }//here we close the else
	});//here we close the async parallel
    },//and here we shoud close the whole funciton
    save_tmp_pillars: function (req, res, callbackTot) {
	//console.log(req.body);
        var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
        var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
        var ID_n=parseInt(req.body.pcb_id.charAt(2));
        var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4)) + req.body.pcb_id.charAt(5);
	if (req.body.TEST_BOARD==true) {
	    test_flag=1;
	} else {
	    test_flag=0;
	}
	pillAff=0;
	filesAndComment=0;
	for (var key in req.body) {
	    if (req.body.hasOwnProperty(key)) {
		//alert(key + " -> " + req.body[key]);
	    }
	    if (req.body[key] == true) {
		req.body[key] = 1;
	    }
	    if (req.body[key] == false) {
		req.body[key] = 0;
	    }

	    if (key == "all_files_and_comment") {
		if ((req.body[key] != null) && (req.body[key] != 0)) {
		    req.body[key].forEach( function (item){
			filesAndComment+=1;
		    });
		}
	    } else if (key == "all_visual_affections"){
		if (req.body[key]!=0) {
		    req.body[key].forEach( function (item){
			if (item.Type.indexOf("pillars")>-1){
			    pillAff+=1;
			}
		    });
		}
	    }
	}

	data2SQL_del=[]; // in this vector we add the functions wich will be executed asynchronously for deleting existing entries

	data2SQL_del.push(function(callbackPillDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_inspection_tmp", null, function(error, result){
		if (error){
		    return callbackPillDel(error);
		}
		return callbackPillDel(null, result);
	    });
	});

	data2SQL_del.push(function(callbackPillErrDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_errors_tmp", null , function(error, result){
		if (error){
		    return callbackPillErrDel(error);
		}
		return callbackPillErrDel(null, result);
	    });
	});

	data2SQL_del.push(function(callbackPillBlobsDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
		if (error){
		    return callbackPillBlobsDel(error);
		}
		return callbackPillBlobsDel(null, result);
	    });
	});

	data2SQL=[]; // in this vector we add the functions wich will be executed asynchronously

	data2SQL.push(function(callbackPill){
	    registerPillarsTable(ID_ls, ID_se, ID_n, ID_n2, req, "pillars_inspection_tmp", function(error, result){
		if (error){
		    return callbackPill(error);
		}
		return callbackPill(null, result);
	    });
	});

	if (pillAff>0){
	    //we add the visual affections to relative table
	    req.body.all_visual_affections.forEach( function (item, index, object){
		if (item.Type.indexOf("pillars")>-1){
		    data2SQL.push(function(callbackPill){
			registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, item, "pillars_errors_tmp", function(error, result){
			    if (error){
				return callbackPill(error);
			    }
			    return callbackPill(null, result);
			})
		    });
		}
	    });
	}

	if (filesAndComment>0){
	    //adding the BLOBs registration functions to the stack
	    req.body.all_files_and_comment.forEach( function (item, index, object){
		data2SQL.push(function(callbackPill){
		    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, item, "all_blobs_tmp", function(error, result){
			if (error){
			    return callbackPill(error);
			}
			return callbackPill(null, result);

		    });
		});
	    });
	}

	//..and then we actually execute the functions in the vector
	async.parallel(data2SQL_del, function(errAsyncDel, result){
	    if (errAsyncDel){
		return callbackTot(errAsyncDel);
	    } else {
		async.series(data2SQL, function(errAsync, result){
		    if (errAsync){
			return callbackTot(errAsync);
		    } else {
			callbackTot(null, result);
		    }
		});
	    }
	});

    },


    save_visual_error_inspection: function (req, res, callbackTot) {
       var now= new Date();
        var visAff=0;
        var pillAff=0;
        var filesAndComment=0;
        var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
        var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
        var ID_n=parseInt(req.body.pcb_id.charAt(2));
        var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
        if (req.body.TEST_BOARD==true) {
            test_flag=1;
        } else {
            test_flag=0;
        }
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
            }
            if (key == "all_files_and_comment") {
                req.body[key].forEach( function (){
                    filesAndComment+=1;
                });
                if (filesAndComment>0) {
                }
            } else if (key == "all_visual_affections"){
                req.body[key].forEach( function (item){
                    if (item.Type.indexOf("pillars")>-1){
                        pillAff+=1;
                    } else {
                        visAff+=1;
                    }
                });
                if (visAff>0) {
                }
            }else {
                if (req.body[key] == true) {
                    req.body[key] = 1;
                }
                if (req.body[key] == false) {
                    req.body[key] = 0;
                }
            }
        }


        data2SQL_del=[]; // in this vector we add the functions wich will be executed asynchronously for deleting existing entries

        data2SQL_del.push(function(callbackVisErrDel){
            DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "visual_errors_tmp", null, function(error, result){
                if (error){
                    return callbackVisErrDel(error);
                }
                return callbackVisErrDel(null, result);
            });
        });
        
        data2SQL_del.push(function(callbackPillErrDel){
            DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_errors_tmp", null , function(error, result){
                if (error){
                    return callbackPillErrDel(error);
                }
                return callbackPillErrDel(null, result);
            });
        });
        
        
        data2SQL_del.push(function(callbackVisBlobDel){
            DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
                if (error){
                    return callbackVisBlobDel(error);
                }
                return callbackVisBlobDel(null, result);
            });
        });

       if (visAff>0){
            req.body.all_visual_affections.forEach( function (itemVis, indexVis, objectVis){
                if (itemVis.Type.indexOf("pillars")<0) { //...excluding the pillars visual errors, which will go in another table
                    data2SQL.push(function(callbackVis){
                        registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemVis, "visual_errors_tmp", function(error, result){
                            if (error){
                                return callbackVis(error);
                            }
                            return callbackVis(null, result);
                        })
                    });
                }
            });
        }
        
        if (pillAff>0){
            req.body.all_visual_affections.forEach( function (item, index, object){
                if (item.Type.indexOf("pillars")>-1){
                    data2SQL.push(function(callbackPillErr){
                        registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, item, "pillars_errors_tmp", function(error, result){
                            if (error){
                                return callbackPillErr(error);
                            } else {
                                return callbackPillErr(null, result);
                            }
                        });
                    });
                }
            });
        }

        if (filesAndComment>0){
            req.body.all_files_and_comment.forEach( function (itemImg, indexImg, objectImg){
                data2SQL.push(function(callbackImg){
                    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs_tmp", function(error, result){
                        if (error){
                            return callbackImg(error);
                        }
                        return callbackImg(null, result);

                    });
                });
            });
        }


        async.parallel(data2SQL_del, function(errAsyncDel, resultDel){
            if (errAsyncDel){
                return callbackTot(errAsyncDel);
            } else {
                async.series(data2SQL, function(errAsync, result){
                    if (errAsync){
                        return callbackTot(errAsync);
                    }
                    callbackTot(null, result);
                });
            }
        });

    },


    save_toplight_inspection: function (req, res, callbackTot) {
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
        var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
        var ID_n=parseInt(req.body.pcb_id.charAt(2));
        var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
	    test_flag=1;
	} else {
	    test_flag=0;
	}
	visAff=0;
	filesAndComment=0;
	for (var key in req.body) {
	    if (req.body.hasOwnProperty(key)) {
		//alert(key + " -> " + req.body[key]);
	    }
	    if (req.body[key] == true) {
		req.body[key] = 1;
	    }
	    if (req.body[key] == false) {
		req.body[key] = 0;
	    }

	    if (key == "all_files_and_comment") {
		if ((req.body[key] != null) && (req.body[key] != 0)) {
		    for (item of req.body[key]) {
			filesAndComment+=1;
		    }
		} else {
		    console.log ("no file loaded");
		}
	    } else if (key == "all_visual_affections"){
		//console.log (req.body[key]);
		if (req.body[key] != 0) {
		    req.body[key].forEach( function (){
			visAff+=1;
		    });
		} else {
		    console.log ("no affections in the board");
		}
	    }
	}

	data2SQL_del=[]; // in this vector we add the functions wich will be executed asynchronously for deleting existing entries

	data2SQL_del.push(function(callbackVisDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "toplight_inspection_tmp", null, function(error, result){
		if (error){
		    return callbackVisDel(error);
		}
		return callbackVisDel(null, result);
	    });
	});

	data2SQL_del.push(function(callbackVisErrDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "visual_errors_tmp", null, function(error, result){
		if (error){
		    return callbackVisErrDel(error);
		}
		return callbackVisErrDel(null, result);
	    });
	});

	data2SQL_del.push(function(callbackVisBlobDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
		if (error){
		    return callbackVisBlobDel(error);
		}
		return callbackVisBlobDel(null, result);
	    });
	});

	/*
	data2SQL_del.push(function(callbackVisBlobDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", "connectorPicture", function(error, result){
		if (error){
		    return callbackVisBlobDel(error);
		}
		return callbackVisBlobDel(null, result);
	    });
	});
	*/

	data2SQL=[]; // in this vector we add the functions wich will be executed asynchronously for registering new entries

	data2SQL.push(function(callbackVis){
	    registerToplightTable(ID_ls, ID_se, ID_n, ID_n2, req, "toplight_inspection_tmp", function(error, result){
		if (error){
		    return callbackVis(error);
		}
		return callbackVis(null, result);
	    });
	});
	

	if (visAff>0){
	    //we add the visual affections to relative table
	    req.body.all_visual_affections.forEach( function (itemVis, indexVis, objectVis){
		if (itemVis.Type.indexOf("pillars")<0) { //...excluding the pillars visual errors, which will go in another table
		    data2SQL.push(function(callbackVis){
			registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemVis, "visual_errors_tmp", function(error, result){
			    if (error){
				return callbackVis(error);
			    }
			    return callbackVis(null, result);
			})
		    });
		}
	    });
	}

	if (filesAndComment>0){
	    //adding the BLOBs registration functions to the stack
	    req.body.all_files_and_comment.forEach( function (itemImg, indexImg, objectImg){
		data2SQL.push(function(callbackImg){
		    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs_tmp", function(error, result){
			if (error){
			    return callbackImg(error);
			}
			return callbackImg(null, result);

		    });
		});
	    });
	}

	//..and then we actually execute the functions in the vectors; Firs we delete the already present entries, and if this succeed we register the new
	async.parallel(data2SQL_del, function(errAsyncDel, resultDel){
	    if (errAsyncDel){
		return callbackTot(errAsyncDel);
	    } else {
		async.series(data2SQL, function(errAsync, result){
		    if (errAsync){
			return callbackTot(errAsync);
		    }
		    callbackTot(null, result);
		});
	    }
	});


    },
    analyze_connector_picture: function (req, res, callbackTot) {
	script_path='connector_check.py';
	var pic_analysis = spawn ('python', [script_path, '--filename' , '../../uploads/' + req.body.filename, '--houg-tresh', req.body.tresh, '--min-n-lines', req.body.min_lines, '--hough-theta-res', req.body.theta_res], {cwd: __dirname+'/../scripts/'});
	var result;
	pic_analysis.stdout.on('data', (data) => {
	    //console.log(`stdout: ${data}`);
	    //result=`stdout: ${data}`;
	    var str = data.toString(), lines = str.split(/(\r?\n)/g);
	    result=lines[0];
	});

	var error;
	pic_analysis.stderr.on('data', (data) => {
	    error=new Error(data);
	    console.log(`stderr: ${data}`);
	});

	pic_analysis.on('close', (code) => {
	    if (code==0) {
		callbackTot(null, result);
	    } else {
		console.log("error triggered")
		callbackTot(error, null);
	    }
	});
    },
    analyze_res_file: function (req, res, callbackTot) {
	//console.log("VL__________ analyzing file...")
        script_path='res_check.py';
        var file_analysis = spawn ('python', [script_path, '--filename' , '../../uploads/' + req.body.filename], {cwd: __dirname+'/../scripts/'});
        var result;
	//console.log("VL__________ file analyzed.")
 
        file_analysis.stdout.on('data', (data) => {
	    //console.log("VL__________ results are:") 
	    //console.log(data)
            var str = data.toString(), lines = str.split(/(\r?\n)/g);
            result=lines[0];
        });

        var error;
        file_analysis.stderr.on('data', (data) => {
	    //console.log("VL__________ there is an error.")	
            error=new Error(data);
            console.log(`stderr: ${data}`);
        });

        file_analysis.on('close', (code) => {
	    //console.log("VL__________ closing function...")
            if (code==0) {
		//console.log("VL__________ ...everything ok!")	
                callbackTot(null, result);
            } else {
		console.log("VL__________ ...but there is an error")	
                callbackTot(error, null);
            }
        });
    },
    save_backlight_inspection: function (req, res, callbackTot) {
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
        var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
        var ID_n=parseInt(req.body.pcb_id.charAt(2));
        var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
	    test_flag=1;
	} else {
	    test_flag=0;
	}
	visAff=0;
	filesAndComment=0;
	for (var key in req.body) {
	    if (req.body.hasOwnProperty(key)) {
		//alert(key + " -> " + req.body[key]);
	    }
	    if (req.body[key] == true) {
		req.body[key] = 1;
	    }
	    if (req.body[key] == false) {
		req.body[key] = 0;
	    }

	    if (key == "all_files_and_comment") {
		if ((req.body[key] != null) && (req.body[key] != 0)) {
		    for (item of req.body[key]) {
			filesAndComment+=1;
		    }
		} else {
		    console.log ("no file loaded");
		}
	    } else if (key == "all_visual_affections"){
		//console.log (req.body[key]);
		if (req.body[key] != 0) {
		    req.body[key].forEach( function (){
			visAff+=1;
		    });
		} else {
		    console.log ("no affections in the board");
		}
	    }
	}

	data2SQL_del=[]; // in this vector we add the functions wich will be executed asynchronously for deleting existing entries

	data2SQL_del.push(function(callbackBckDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "backlight_inspection_tmp", null, function(error, result){
		if (error){
		    return callbackBckDel(error);
		}
		return callbackBckDel(null, result);
	    });
	});

	data2SQL_del.push(function(callbackVisErrDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "visual_errors_tmp", null, function(error, result){
		if (error){
		    return callbackVisErrDel(error);
		}
		return callbackVisErrDel(null, result);
	    });
	});

	data2SQL_del.push(function(callbackVisBlobDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
		if (error){
		    return callbackVisBlobDel(error);
		}
		return callbackVisBlobDel(null, result);
	    });
	});


	data2SQL=[]; // in this vector we add the functions wich will be executed asynchronously for registering new entries

	data2SQL.push(function(callbackBck){
	    registerBacklightTable(ID_ls, ID_se, ID_n, ID_n2, req, "backlight_inspection_tmp", function(error, result){
		if (error){
		    return callbackBck(error);
		}
		return callbackBck(null, result);
	    });
	});
	

	if (visAff>0){
	    //we add the visual affections to relative table
	    req.body.all_visual_affections.forEach( function (itemVis, indexVis, objectVis){
		if (itemVis.Type.indexOf("pillars")<0) { //...excluding the pillars visual errors, which will go in another table
		    data2SQL.push(function(callbackVis){
			registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemVis, "visual_errors_tmp", function(error, result){
			    if (error){
				return callbackVis(error);
			    }
			    return callbackVis(null, result);
			})
		    });
		}
	    });
	}

	if (filesAndComment>0){
	    //adding the BLOBs registration functions to the stack
	    req.body.all_files_and_comment.forEach( function (itemImg, indexImg, objectImg){
		data2SQL.push(function(callbackImg){
		    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs_tmp", function(error, result){
			if (error){
			    return callbackImg(error);
			}
			return callbackImg(null, result);

		    });
		});
	    });
	}

	//..and then we actually execute the functions in the vectors; Firs we delete the already present entries, and if this succeed we register the new
	async.parallel(data2SQL_del, function(errAsyncDel, resultDel){
	    if (errAsyncDel){
		return callbackTot(errAsyncDel);
	    } else {
		async.series(data2SQL, function(errAsync, result){
		    if (errAsync){
			return callbackTot(errAsync);
		    }
		    callbackTot(null, result);
		});
	    }
	});


    },
    save_tmp_logistic: function (req, res, callbackTot) {
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
	    test_flag=1;
	} else {
	    test_flag=0;
	}


	data2SQL=[]; // in this vector we add the functions wich will be executed in series (because blobs registration sucks)

	data2SQL.push(function(callbackLog){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "logistic_table_tmp", null, function(error, result){
		if (error){
		    return callbackLog(error);
		} else {
		    registerNewLogisticTable(ID_ls, ID_se, ID_n, ID_n2, req, "logistic_table_tmp", function(error2, result){
			if (error2){
			    return callbackLog(error2);
			} else {
			    return callbackLog(null, result);
			}
		    });
		}
	    });
	});


	data2SQL.push(function(callbackBlobDel){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
		if (error){
		    return callbackBlobDel(error);
		} else {
		    return callbackBlobDel(null, result);
		}
	    });
	});

	data2SQL.push(function(callbackBlobDel2){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", "nonConformityReport", function(error, result){
		if (error){
		    return callbackBlobDel2(error);
		} else {
		    return callbackBlobDel2(null, result);
		}
	    });
	});

	if ((req.body["all_files_and_comment"] != null) && (req.body["all_files_and_comment"] != 0)) {
	    req.body.all_files_and_comment.forEach( function (itemImg, index, object){
		data2SQL.push(function(callbackReport){
		    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs_tmp", function(error, result){
			if (error){
			    return callbackReport(error);
			} else {
			    return callbackReport(null, result);
			}
		    });
		});
	    });
	}

	async.series(data2SQL, function(errAsync, result){
	    console.log("siamo qui")
	    if (errAsync){
		return callbackTot(errAsync);
	    } else {
		return callbackTot(null, result);
	    }
	});


    },
    save_tmp_dimensions: function (req, res, callbackTot) {
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
            test_flag=1;
        } else {
            test_flag=0;
        }

	DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "dimensions_tmp", null, function(error, result){
	    if (error){
		return callbackTot(error);
	    }
	    registerDimensionsTable(ID_ls, ID_se, ID_n, ID_n2, req, "dimensions_tmp", function(error2, result){
		if (error2){
		    return callbackTot(error2);
		} else {
		    return callbackTot(null, result);
		}
	    });
	});
    },
    save_tmp_HV: function (req, res, callbackTot) {
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
            test_flag=1;
        } else {
            test_flag=0;
        }


	DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "HV_tmp", null, function(error, result){
	    if (error){
		return callbackTot(error);
	    }
	    registerHVTable(ID_ls, ID_se, ID_n, ID_n2, req, "HV_tmp", function(error2, result){
		if (error2){
		    return callbackTot(error2);
		}
		return callbackTot(null, result);
	    });
	});
    },
	 
	 

    save_tmp_Resistive_Check: function (req, res, callbackTot) {
	console.log(req.body);
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
            test_flag=1;
        } else {
            test_flag=0;
        }

//////
	data2SQL = [];	
	data2SQL.push(function(callbackBlobDel2){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", "nonConformityReport", function(error, result){
		if (error){
		    return callbackBlobDel2(error);
		} else {
		    return callbackBlobDel2(null, result);
		}
	    });
	});

	if ((req.body["all_files_and_comment"] != null) && (req.body["all_files_and_comment"] != 0)) {
	    req.body.all_files_and_comment.forEach( function (itemImg, index, object){
		data2SQL.push(function(callbackReport){
		    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs_tmp", function(error, result){
			if (error){
			    return callbackReport(error);
			} else {
			    return callbackReport(null, result);
			}
		    });
		});
	    });
	}

	data2SQL.push(function(callbackRes){
		DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "Resistive_Check_tmp", null, function(error, result){
	    	if (error){
			return callbackRes(error);
	    	}
	    	registerResistive_CheckTable(ID_ls, ID_se, ID_n, ID_n2, req, "Resistive_Check_tmp", function(error2, result){
			if (error2){
			    	return callbackRes(error2);
			}
			return callbackRes(null, result);
		    });
		});
	});
	

/////////
        async.series(data2SQL, function(errAsync, result){
            console.log("siamo qui")
            if (errAsync){
                return callbackTot(errAsync);
            } else {
                return callbackTot(null, result);
            }
        });

    },
	
	
    save_tmp_Capacitance_Check: function (req, res, callbackTot) {
	console.log(req.body);
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
            test_flag=1;
        } else {
            test_flag=0;
        }

//////
	data2SQL = [];	
	data2SQL.push(function(callbackBlobDel2){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
		if (error){
		    return callbackBlobDel2(error);
		} else {
		    return callbackBlobDel2(null, result);
		}
	    });
	});

	if ((req.body["all_files_and_comment"] != null) && (req.body["all_files_and_comment"] != 0)) {
	    req.body.all_files_and_comment.forEach( function (itemImg, index, object){
		data2SQL.push(function(callbackReport){
		    registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs_tmp", function(error, result){
			if (error){
			    return callbackReport(error);
			} else {
			    return callbackReport(null, result);
			}
		    });
		});
	    });
	}

	data2SQL.push(function(callbackRes){
		DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "Capacitance_Check_tmp", null, function(error, result){
	    	if (error){
			return callbackRes(error);
	    	}
	    	registerCapacitance_CheckTable(ID_ls, ID_se, ID_n, ID_n2, req, "Capacitance_Check_tmp", function(error2, result){
			if (error2){
			    	return callbackRes(error2);
			}
			return callbackRes(null, result);
		    });
		});
	});
	
	

/////////
        async.series(data2SQL, function(errAsync, result){
            console.log("siamo qui")
            if (errAsync){
                return callbackTot(errAsync);
            } else {
                return callbackTot(null, result);
            }
        });

    },

    registerEntry: function (req, res, callbackTot) {
	var now= new Date();
	var visAff=0;
	var pillAff=0;
	var filesAndComment=0;
	var ID_ls=req.body.pcb_id.charAt(0).toUpperCase();
	var ID_se=req.body.pcb_id.charAt(1).toUpperCase();
	var ID_n=parseInt(req.body.pcb_id.charAt(2));
	var ID_n2=parseInt(req.body.pcb_id.charAt(3)+ req.body.pcb_id.charAt(4) + req.body.pcb_id.charAt(5));
	if (req.body.TEST_BOARD==true) {
	    test_flag=1;
	} else {
	    test_flag=0;
	}
	for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                //alert(key + " -> " + req.body[key]);
            }
            if (key == "all_files_and_comment") {
		req.body[key].forEach( function (){
		    filesAndComment+=1;
		});
		if (filesAndComment>0) {
		    //console.log ("contains files and/or comments");
		}
            } else if (key == "all_visual_affections"){
		req.body[key].forEach( function (item){
		    if (item.Type.indexOf("pillars")>-1){
			pillAff+=1;
		    } else {
			visAff+=1;
		    }
		});
		if (visAff>0) {
		    //console.log ("contains visual affections");
		}
	    }else {
		if (req.body[key] == true) {
		    req.body[key] = 1;
		}
		if (req.body[key] == false) {
		    req.body[key] = 0;
		}
            }
        }



	deleteAndFormat=[];

	deleteAndFormat.push(function(callbackDeleteLogistic){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "logistic_table", null, function(error, result){
		if (error){
		    return callbackDeleteLogistic(error);
		} else {
		    return callbackDeleteLogistic(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteVisual){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "toplight_inspection", null, function(error, result){
		if (error){
		    return callbackDeleteVisual(error);
		} else {
		    return callbackDeleteVisual(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteBacklight){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "backlight_inspection", null, function(error, result){
		if (error){
		    return callbackDeleteBacklight(error);
		} else {
		    return callbackDeleteBacklight(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteVisualAff){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "visual_errors", null, function(error, result){
		if (error){
		    return callbackDeleteVisualAff(error);
		} else {
		    return callbackDeleteVisualAff(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteBlobs){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs", null, function(error, result){
		if (error){
		    return callbackDeleteBlobs(error);
		} else { 
		    return callbackDeleteBlobs(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteDim){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "dimensions", null, function(error, result){
		if (error){
		    return callbackDeleteDim(error);
		} else {
		    return callbackDeleteDim(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeletePill){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_inspection", null, function(error, result){
		if (error){
		    return callbackDeletePill(error);
		} else {
		    return callbackDeletePill(null, result);
		}
	    });
	});
	
	deleteAndFormat.push(function(callbackDeleteCapCheck){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "Capacitance_Check", null, function(error, result){
		if (error){
		    return callbackDeleteCapCheck(error);
		} else {
		    return callbackDeleteCapCheck(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeletePillAff){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_errors", null, function(error, result){
		if (error){
		    return callbackDeletePillAff(error);
		} else {
		    return callbackDeletePillAff(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteRes){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "resistive_check", null, function(error, result){
		if (error){
		    return callbackDeleteRes(error);
		} else {
		    return callbackDeleteRes(null, result);
		}
	    });
	});
	
	deleteAndFormat.push(function(callbackDeleteHV){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "HV", null, function(error, result){
		if (error){
		    return callbackDeleteHV(error);
		} else {
		    return callbackDeleteHV(null, result);
		}
	    });
	});

	deleteAndFormat.push(function(callbackDeleteFinal){
	    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "final_decision", null, function(error, result){
		if (error){
		    return callbackDeleteFinal(error);
		} else {
		    return callbackDeleteFinal(null, result);
		}
	    });
	});


             async.parallel(deleteAndFormat, function(errAsync, result){
             if (errAsync){
                        return callbackTot(errAsync);
	    } else {
		console.log("In registering/updating definitive entry: we successfully deleted the (eventually...) already present data in the definitive tables. Now we proceed in registering the new");
		data2SQL=[]; // in this vector we add the functions wich will be executed asynchronously

		data2SQL.push(function(callbackLog){
		    registerNewLogisticTable(ID_ls, ID_se, ID_n, ID_n2, req, "logistic_table", function(error, result){
			if (error){
			    return callbackLog(error);
			} else {
			    return callbackLog(null, result);
			}
		    });
		});

		data2SQL.push(function(callbackVisa){
		    registerToplightTable(ID_ls, ID_se, ID_n, ID_n2, req, "toplight_inspection", function(error, result){
			if (error){
			    return callbackVisa(error);
			} else {
			    return callbackVisa(null, result);
			}
		    });
		});

		data2SQL.push(function(callbackBackLight){
		    registerBacklightTable(ID_ls, ID_se, ID_n, ID_n2, req, "backlight_inspection", function(error, result){
			if (error){
			    return callbackBacklight(error);
			} else {
			    return callbackBackLight(null, result);
			}
		    });
		});

		if (visAff>0){
		    //we add the visual affections to relative table
		    req.body.all_visual_affections.forEach( function (itemVis, indexVis, objectVis){
			if (itemVis.Type.indexOf("pillars")<0) { //...excluding the pillars visual errors, which will go in another table
			    data2SQL.push(function(callbackVis){
				registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemVis, "visual_errors", function(error, result){
				    if (error){
					return callbackVis(error);
				    } else {
					return callbackVis(null, result);
				    }
				})
			    });
			};
		    })
		}

		data2SQL.push(function(callbackDim){
		    registerDimensionsTable(ID_ls, ID_se, ID_n, ID_n2, req, "dimensions", function(error, result){
			if (error){
			    return callbackDim(error);
			} else {
			    return callbackDim(null, result);
			}
		    });
		});

		data2SQL.push(function(callbackPill){
		    registerPillarsTable(ID_ls, ID_se, ID_n, ID_n2, req, "pillars_inspection", function(error, result){
			if (error){
			    return callbackPill(error);
			} else {
			    return callbackPill(null, result);
			}
		    });
		});

		if (pillAff>0){
		    //we add the visual affections to relative table
		    req.body.all_visual_affections.forEach( function (item, index, object){
			if (item.Type.indexOf("pillars")>-1){
			    data2SQL.push(function(callbackPillErr){
				registerVisualAffections( ID_ls, ID_se, ID_n, ID_n2, test_flag, item, "pillars_errors", function(error, result){
				    if (error){
					return callbackPillErr(error);
				    } else {
					return callbackPillErr(null, result);
				    }
				});
			    });
			}
		    });
		}

		data2SQL.push(function(callbackHV){
		    registerHVTable(ID_ls, ID_se, ID_n, ID_n2, req, "HV", function(error, result){
			if (error){
			    return callbackHV(error);
			} else {
			    return callbackHV(null, result);
			}
		    });
		});

 		data2SQL.push(function(callbackRes){
                    registerResistive_CheckTable(ID_ls, ID_se, ID_n, ID_n2, req, "resistive_check", function(error, result){
                        if (error){
                            return callbackRes(error);
                        } else {
                            return callbackRes(null, result);
                        }
                    });
                });
		
		data2SQL.push(function(callbackCapacitance){
		    registerCapacitance_CheckTable(ID_ls, ID_se, ID_n, ID_n2, req, "Capacitance_Check", function(error, result){
			if (error){
			    return callbackCapacitance(error);
			} else {
			    return callbackCapacitance(null, result);
			}
		    });
		});

		data2SQL.push(function(callbackTotalFilled){
		    registerTotalFilled(ID_ls, ID_se, ID_n, ID_n2, req, function(error, result){
			if (error){
			    return callbackTotalFilled(error);
			} else {
			    return callbackTotalFilled(null, result);
			}
		    });
		});

		//..and then we actually execute the functions in the vector
		async.parallel(data2SQL, function(errAsync, result){
		    if (errAsync){
			return callbackTot(errAsync);
		    } else {
			//we have still to add the blobs; their relative functions should be executed in series!
			data2SQL=[];
			if (filesAndComment>0){
			    //adding the BLOBs registration functions to the stack
			    req.body.all_files_and_comment.forEach( function (itemImg, index, object){
				//console.log("file  " + itemImg.Filename);
				if ((itemImg.Filename.indexOf("manufReport")<0) && (itemImg.Filename.indexOf("nonConformityReport")<0)) { // we have to exclude the manufacturer report, which will go in another table
				    //console.log("we upload  " + itemImg.Filename);
				    data2SQL.push(function(callbackImg){
					registerBLOBs( ID_ls, ID_se, ID_n, ID_n2, test_flag, itemImg, "all_blobs", function(error, result){
					    if (error){
						return callbackImg(error);
					    } else {
						return callbackImg(null, result);
					    }
					});
				    });
				} 
			    });
			}
			async.series(data2SQL, function(errAsync2, result2){
			    if (errAsync2){
				return callbackTot(errAsync2);
			    } else {
				console.log("In registering/updating definitive entry: all entries successfully registered to the definitive tables. Now we delete the (eventually present...) entries in temporary tables");
				deleteAndFormat=[];

				deleteAndFormat.push(function(callbackDeleteLogistic){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "logistic_table_tmp", null, function(error, result){
					if (error) return callbackDeleteLogistic(error);
					else return callbackDeleteLogistic(null, result);
				    });
				});

				deleteAndFormat.push(function(callbackDeleteVisual){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "toplight_inspection_tmp", null, function(error, result){
					if (error) return callbackDeleteVisual(error);
					else return callbackDeleteVisual(null, result);
				    });
				});

				deleteAndFormat.push(function(callbackDeleteBacklight){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "backlight_inspection_tmp", null, function(error, result){
					if (error) return callbackDeleteVisual(error);
					else return callbackDeleteBacklight(null, result);
				    });
				});

				deleteAndFormat.push(function(callbackDeleteVisualAff){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "visual_errors_tmp", null, function(error, result){
					if (error){
					    return callbackDeleteVisualAff(error);
					} else {
					    return callbackDeleteVisualAff(null, result);
					}
				    });
				});

				deleteAndFormat.push(function(callbackDeleteBlobs){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "all_blobs_tmp", null, function(error, result){
					if (error){
					    return callbackDeleteBlobs(error);
					} else {
					    return callbackDeleteBlobs(null, result);
					}
				    });
				});

				deleteAndFormat.push(function(callbackDeleteDim){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "dimensions_tmp", null, function(error, result){
					if (error){
					    return callbackDeleteDim(error);
					} else {
					    return callbackDeleteDim(null, result);
					}
				    });
				});

				deleteAndFormat.push(function(callbackDeletePill){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_inspection_tmp", null, function(error, result){
					if (error){
					    return callbackDeletePill(error);
					} else {
					    return callbackDeletePill(null, result);
					}
				    });
				});

				deleteAndFormat.push(function(callbackDeletePillAff){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "pillars_errors_tmp", null, function(error, result){
					if (error){
					    return callbackDeletePillAff(error);
					} else {
					    return callbackDeletePillAff(null, result);
					}
				    });
				});
			
				deleteAndFormat.push(function(callbackDeleteCapcheck){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "capacitance_check_tmp", null, function(error, result){
					if (error){
					    return callbackDeleteCapcheck(error);
					} else {
					    return callbackDeleteCapcheck(null, result);
					}
				    });
				});
	
				deleteAndFormat.push(function(callbackDeleteRes){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "resistive_check_tmp", null, function(error, result){
					if (error){
					    return callbackDeleteRes(error);
					} else {
					    return callbackDeleteRes(null, result);
					}
				    });
				});


				deleteAndFormat.push(function(callbackDeleteHV){
				    DeleteTmpEntry(ID_ls, ID_se, ID_n, ID_n2, test_flag, "HV_tmp", null, function(error, result){
					if (error){
					    return callbackDeleteHV(error);
					} else {
					    return callbackDeleteHV(null, result);
					}
				    });
				});

				async.parallel(deleteAndFormat, function(errDelete, resultDel){
				    if (errDelete){
					return callbackTot(errAsync);
				    } else {
					console.log("In registering/updating definitive entry: all entries in temporary tables are deleted");
					callbackTot(null, null);
				    }
				});
			    }; //here should finish the function to delete the data on the temp tables
			});
		    }
		}); 
	    }//here ends the else after the error check
	});
    },


    AddLogDecision: function (req, res, callbackTot){
	                                        var now = new Date();
                                        var utc_timestamp = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
                                        console.log(utc_timestamp)
			        console.log(req.body.board_id)
				oracledb.getConnection(
                                {
                                    user          : dbConfig.user_log_w,
                                    password      : dbConfig.password_log_w,
                                    connectString : dbConfig.connectString
                                },
                                function(err, connection)
                                {
                                    if (err) {
                                        return callbackTot(err);
                                    } else {


//				    	console.log("INSERT INTO ATLAS_MUON_NSW_MM_LOG.STATUSLOCATION (EQENTRYID, STATUSID, websiteusercr, websiteusered, EVENTDATE) VALUES ( "+ req.body.board_id + ", 4 ,'" + req.body.userCN + "','"+ req.body.userCN + "','" + utc_timestamp + "') ");
					console.log(utc_timestamp)
					connection.execute(
                                         "INSERT INTO ATLAS_MUON_NSW_MM_LOG.STATUSLOCATION (EQENTRYID, STATUSID, websiteusercr, websiteusered, EVENTDATE) VALUES ( "+ req.body.board_id + ", 4 ,'" + req.body.userCN + "','"+ req.body.userCN + "' ,:eventdate)",
                                        {
//                                            eqentryid: req.body.board_id,
//                                            statusid: '4',
//                                            websiteusercr: req.body.userCN,
//                                           websiteusered: req.body.userCN,
                                            eventdate: utc_timestamp
                                         },
                                         { autoCommit: true},	
		           		 function(err, result)
                                         {
						if (err) {
							console.log(err)
                                                	doRelease(connection);
                                                	return callbackTot(err);
						}
						else {
							final_decision = ""
							if (req.body.grandtotalok==0){
								final_decision = "F"
							}
							else {
								final_decision = "T"
							}
							connection.execute(
                                        		 "UPDATE ATLAS_MUON_NSW_MM_LOG.EQUIPMENT SET ISNONCONFFLAG=:finaldecision WHERE id_equipment= :id_equipment",
                                        		{
 		                                       		id_equipment: req.body.board_id,
								finaldecision: final_decision
									
                                       			  },
                                       			  { autoCommit: true},
                                         		function(err, result)
                                         		{
                                                	if (err) {
                                                        	console.log(err)
                                                       		 doRelease(connection);
                                                       		 return callbackTot(err);
                                                		}
                                                	else {
								return callbackTot(null, {"message": 'Logistic DB successfully updated'});
                                                	}
						});
						
					}
  			            	 
	
				    });
				}
 			});   

},


GetLastEntry: function (req, res, callbackTot){
    // var table = 'Nuvola';
    console.log("sbd");
    // var table = req.body.table;
    console.log(dbConfig.user)
    var table = dbConfig.user;
    console.log(dbConfig.password)

    var connection = mysql.createConnection({
      host     : 'sql11.freesqldatabase.com',
      user     : "sql11172989",
      password : dbConfig.password,
      database : 'sql11172989'
    });

    connection.connect();

               console.log( "cdc");
   			var resultTot=[];
   			connection.query(
   			"SELECT * " +
   			" FROM " + table + " ORDER  BY Date_ DESC LIMIT  1 ",

   			{

   			},
   			function(err, result)
   			{
                    console.log(result[0])
                
   				if (err) {
   					connection.end();
   					return callbackTot(err);
   				} else {
   					connection.end();
   //console.log(result.rows)
   //we have to check if the files are already present on the disk cache (/uploads), otherwise we have to get them back from the DB
   					async.each(result, function (row, callbackEach) {
                        console.log(row)
   						resultTot.push(row);

   						return callbackEach(null);

   					});

   				}
   		return callbackTot( null, {"results" : resultTot});

   			});
           // }
       // });

   // if (err)
      
},


HistoryDataNuvola: function (req, res, callbackTot){
    var table = dbConfig.user;
    console.log("sbd");
    // var table = req.body.table;
    console.log(dbConfig.user)
    console.log(dbConfig.password)
    var stringtype = "";
    
    var var_val_name = req.body.var_val_name;
   var var_date = req.body.var_date;
   var min_date = req.body.min_date;
   var max_date = req.body.max_date;
       var table = req.body.table;
       
       console.log(var_val_name);
       console.log(table);
       console.log(var_date);
       
       
    var connection = mysql.createConnection({
      host     : 'sql11.freesqldatabase.com',
      user     : "sql11172989",
      password : dbConfig.password,
      database : 'sql11172989'
    });

    connection.connect();

   			var resultTot=[];
            
            console.log("SELECT " + var_val_name +
            " FROM " + table + " WHERE ( " + var_date  + " BETWEEN '" + min_date  + "' AND  '" + max_date + "' " + stringtype + " )");
   			connection.query(
            // "SELECT " + var_val_name +
            // ", Date_ FROM " + table + " WHERE ( " + var_date  + " BETWEEN '" + min_date  + "' AND  '" + max_date + "' " + stringtype + " )",
                
             "SELECT *"  +
             " FROM " + table + " WHERE ( " + var_date  + " BETWEEN '" + min_date  + "' AND  '" + max_date + "' " + stringtype + " )",
                
            // " FROM " + table + " WHERE ( " + var_date  + " BETWEEN TO_DATE( '" + min_date  + "', 'yyyy/mm/dd') AND TO_DATE ('" + max_date + "', 'yyyy/mm/dd') "+ stringtype + " )",

   			{

   			},
   			function(err, result)
   			{
                    // console.log(result[0])
                
   				if (err) {
   					connection.end();
   					return callbackTot(err);
   				} else {
   					connection.end();
   //console.log(result.rows)
   //we have to check if the files are already present on the disk cache (/uploads), otherwise we have to get them back from the DB
   					async.each(result, function (row, callbackEach) {
   						resultTot.push(row);

   						return callbackEach(null);

   					});

   				}
   		return callbackTot( null, {"results" : resultTot});

   			});
 
},



StaticsTableCheck: function (req, res, callbackTot){
			     // check if the entry already exists in the BLOB table
 var var_val_name = req.body.var_val_name;
var var_date = req.body.var_date;
var min_date = req.body.min_date;
var max_date = req.body.max_date;
    var table = req.body.table;
     

        var ID_ls="";
        var ID_se="";
        var ID_n="";


var stringtype = "";
if (req.body.TypeBoardSelected == true){
 
         ID_ls=req.body.selectedBoardType.charAt(0).toUpperCase();
         ID_se=req.body.selectedBoardType.charAt(1).toUpperCase();
         ID_n=parseInt(req.body.selectedBoardType.charAt(2));
       stringtype = "AND ID_LS = '" + ID_ls + "' AND ID_SE = '" + ID_se + "' AND ID_N = '" + ID_n + "'";
}


	oracledb.getConnection(
					     {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.connectString
     },
	function(err, connection)
	{
		if (err) {
			doRelease(connection);
			return callbackTot(err);
		} else {
		//	var string = "SELECT " + var_val_name +
                        " FROM " + table + " WHERE ( " + var_date  + " BETWEEN TO_DATE( '" + min_date  + "', 'yyyy/mm/dd') AND TO_DATE ('" + max_date + "', 'yyyy/mm/dd'))";
		//	console.log( string);
			var resultTot=[];
			connection.execute(
			"SELECT " + var_val_name +
			" FROM " + table + " WHERE ( " + var_date  + " BETWEEN TO_DATE( '" + min_date  + "', 'yyyy/mm/dd') AND TO_DATE ('" + max_date + "', 'yyyy/mm/dd') "+ stringtype + " )",
	//		"SELECT " + var_val_name + " FROM " + table,
		//"SELECT GRANDTOTALOK from FINAL_DECISION WHERE ( FILLED_DATE BETWEEN TO_DATE( '2010/12/01', 'yyyy/mm/dd') AND TO_DATE ('2012/12/12', 'yyyy/mm/dd'))",

			{
	//			var_val_name:var_val_name,
	//			var_date:var_date,
	//			min_date:min_date,
	//			max_date:max_date
			},
			function(err, result)
			{
				if (err) {
					doRelease(connection);
					return callbackTot(err);
				} else if (result.rows != ""){
					doRelease(connection);
//console.log(result.rows)
//we have to check if the files are already present on the disk cache (/uploads), otherwise we have to get them back from the DB

					async.each(result.rows, function (row, callbackEach) {

						resultTot.push(row);

						return callbackEach(null);

					});

				}
		return callbackTot( null, {"results" : resultTot});

			});
		}
	});

// if (err)
} ,



StaticsHistoryCheck: function (req, res, callbackTot){
			     // check if the entry already exists in the BLOB table
 var var_val_name = req.body.var_val_name;
var var_date = req.body.var_date;
var min_date = req.body.min_date;
var max_date = req.body.max_date;
    var table = req.body.table;


        var ID_ls="";
        var ID_se="";
        var ID_n="";

var stringtype = "";
if (req.body.TypeBoardSelected == true){


 	ID_ls=req.body.selectedBoardType.charAt(0).toUpperCase();
        ID_se=req.body.selectedBoardType.charAt(1).toUpperCase();
        ID_n=parseInt(req.body.selectedBoardType.charAt(2));

	stringtype = "AND ID_LS = '" + ID_ls + "' AND ID_SE = '" + ID_se + "' AND ID_N = '" + ID_n + "'";
}


console.log(var_date) ;
     oracledb.getConnection(
					     {
	user          : dbConfig.user,
	password      : dbConfig.password,
	connectString : dbConfig.connectString
     },
	function(err, connection)
	{
		if (err) {
			doRelease(connection);
			return callbackTot(err);
		} else {
			var resultTot=[];

			console.log("SELECT to_char(FILLED_DATE - 7/24,'IYYY') as YEAR, to_char(FILLED_DATE - 7/24,'IW') AS WEEK , count(*) as COUNT  FROM FINAL_DECISION WHERE ( " + var_date  + " BETWEEN TO_DATE( '" + min_date  + "', 'yyyy/mm/dd') AND TO_DATE ('" + max_date + "', 'yyyy/mm/dd') " + stringtype + ") GROUP BY (to_char(FILLED_DATE - 7/24,'IYYY'), to_char(FILLED_DATE - 7/24,'IW'))");
			connection.execute("SELECT to_char(FILLED_DATE - 7/24,'IYYY') as YEAR, to_char(FILLED_DATE - 7/24,'IW') AS WEEK , count(*) as COUNT  FROM FINAL_DECISION WHERE ( " + var_date  + " BETWEEN TO_DATE( '" + min_date  + "', 'yyyy/mm/dd') AND TO_DATE ('" + max_date + "', 'yyyy/mm/dd') " + stringtype + ") GROUP BY (to_char(FILLED_DATE - 7/24,'IYYY'), to_char(FILLED_DATE - 7/24,'IW'))", 

			{
			},
			function(err, result)
			{
				if (err) {
					doRelease(connection);
					return callbackTot(err);
				} else if (result.rows != ""){
					doRelease(connection);
//console.log(result.rows)
					async.each(result.rows, function (row, callbackEach) {

						console.log(row);
						resultTot.push(row);

						return callbackEach(null);

					});

				}
		console.log(resultTot);
		return callbackTot( null, {"results" : resultTot});

			});
		}
	});

// if (err)
} 





};


























