// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var completeSessions = [];

// configuration =================

var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'bdb0213b09a170',
    password: 'secret',
    database: 'heroku_7fef7ab2ee4b24b',
    dateStrings: true
});

connection.connect();

setInterval(function() {
    connection.query('SELECT 1');
}, 5000);


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json({limit: '5mb'}));                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

function generateID() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
function findLastResource(data, previousViewTime) {
    let highestTime = 0;
    data = JSON.parse(data);
    data.map((element) => {
        if (element.name !== 'first-paint' && element.name !== 'first-contentful-paint' && element.initiatorType !== 'navigation' && !element.name.includes('tracker')) {
            if (element.responseEnd >= highestTime) {
                highestTime = element.responseEnd - previousViewTime;
            }
        }
    })
    return Math.round(parseFloat(highestTime) * 10)/10000;
}
function prepareObjForDatabase(object) {
    var completeDataModel = {
        site_id: null,
        user_id: null,
        domain: null,
        path: null,
        data: {
            timestamp: 0,
            usd: 'null',
            svt: 0,
            nt: 'null',
            rt: 'null',
            xhr: 'null',
            errors: 'null',
            dtc: 'null'
        }
    }

    for (var key in completeDataModel) {
        if (typeof object[key] == 'object') {
            for (var innerKey in object[key]) {
                if (innerKey in object[key]) {
                    completeDataModel[key][innerKey] = JSON.stringify(object[key][innerKey]);
                }
            }
        } else {
            completeDataModel[key] = object[key];
        }
    }
    completeDataModel.data.timestamp = moment.unix(completeDataModel.data.timestamp / 1000).toDate();

    return completeDataModel;
}
function analyzeLoadTimes(data) {
    var previousViewTime = 0, result = [];
    for (var i = 1; i < data.length; i++) {
        result.push({
            siteID: data[i].siteID,
            path: data[i].path,
            timeLoad: findLastResource(data[i].resourceTiming, previousViewTime)})
        previousViewTime += data[i].singleViewTime;
    }
    return result;
}
function setValueTimeLoads(data) {
    completeSessions.push(data);
}

// routes ======================================================================
var reqData;
app.post('/tracker', function(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    postResponse = generateID().toString();
    if (req.body.user_id === undefined) {
        req.body.user_id = postResponse;
    }
    res.send(postResponse);
    console.log('Request:', req.body);
    console.log('Response:', postResponse);
    reqData = prepareObjForDatabase(req.body);

    // putting data into database

    connection.query('INSERT INTO `Views` (siteID, userID, domain, path, timestamp, userDevice, singleViewTime, navigationTiming, resourceTiming, xhrProxy, errors, domTimeChanges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [
            reqData.site_id,
            reqData.user_id,
            reqData.domain,
            reqData.path,
            reqData.data.timestamp,
            reqData.data.usd,
            reqData.data.svt,
            reqData.data.nt,
            reqData.data.rt,
            reqData.data.xhr,
            reqData.data.errors,
            reqData.data.dtc
        ], (err, rows, fields) => {
            if (err) {
                throw err
            }
        })
});

app.get('/', function(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.write(JSON.stringify(requestData, null, 4));
});
app.get('/users_sessions', function(req, res) {
    connection.query('SELECT * from `Views` WHERE userDevice<>"null" ORDER BY `timestamp` DESC;', (err, rows, fields) => {
        res.status(200);
        res.json({response: rows})
    })
})
app.get('/session/:id', function(req, res) {
    connection.query('SELECT ID, timestamp, userID, siteID from `Views` WHERE ID=' + req.params.id + ';', (err, rows, fields) => {
        var sessionInfo = {
                ID: rows[0].ID,
                siteID: rows[0].siteID,
                userID: rows[0].userID,
                timestamp: rows[0].timestamp
            }, endTimestampRange;
        connection.query('SELECT timestamp from `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp > \'' + sessionInfo.timestamp + '\' AND userDevice<>\'null\' ORDER BY `timestamp` ASC', (err, rows, fields) => {
            if (rows[0] === null || rows === undefined) {
                connection.query('SELECT MAX(timestamp) from `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >\'' + sessionInfo.timestamp + '\' LIMIT 1 ORDER BY `timestamp` ASC', (err, rows, fields) => {
                    endTimestampRange = rows[0].timestamp;
                    connection.query('SELECT * FROM `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >=\'' + sessionInfo.timestamp + '\' AND timestamp<\'' + endTimestampRange + '\' ORDER BY `timestamp` ASC;',
                        (err, rows, fields) => {
                            res.send(rows);
                        })
                });
            } else if (rows[0] !== undefined) {
                endTimestampRange = rows[0].timestamp;
                connection.query('SELECT * FROM `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >=\'' + sessionInfo.timestamp + '\' and timestamp<\'' + endTimestampRange + '\' ORDER BY `timestamp` ASC;',
                    (err, rows, fields) => {
                        res.send(rows);
                    })
            } else {
                connection.query('SELECT * FROM `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >=\'' + sessionInfo.timestamp + '\' ORDER BY `timestamp` ASC;',
                    (err, rows, fields) => {
                        res.send(rows);
                    })
            }
        })
    })
})

app.get('/overview/loadTimes', function(req, res) {
    let sessionsIDs = [];
    connection.query('SELECT ID from `Views` WHERE userDevice<>"null" ORDER BY `timestamp` DESC;', (err, rows, fields) => {
        for (let i = 0; i < rows.length; i++) {
            sessionsIDs.push(rows[i].ID)
        }
        sessionsIDs.forEach(element => {
            connection.query('SELECT ID, timestamp, userID, siteID from `Views` WHERE ID=' + element + ';', (err, rows, fields) => {
                var sessionInfo = {
                        ID: rows[0].ID,
                        siteID: rows[0].siteID,
                        userID: rows[0].userID,
                        timestamp: rows[0].timestamp
                    }, endTimestampRange;
                connection.query('SELECT timestamp from `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp > \'' + sessionInfo.timestamp + '\' AND userDevice<>\'null\' ORDER BY `timestamp` ASC', (err, rows, fields) => {
                    if (rows[0] === null || rows === undefined) {
                        connection.query('SELECT MAX(timestamp) from `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >\'' + sessionInfo.timestamp + '\' LIMIT 1 ORDER BY `timestamp` ASC', (err, rows, fields) => {
                            endTimestampRange = rows[0].timestamp;
                            connection.query('SELECT * FROM `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >=\'' + sessionInfo.timestamp + '\' AND timestamp<\'' + endTimestampRange + '\' ORDER BY `timestamp` ASC;',
                                (err, rows, fields) => {
                                    setValueTimeLoads(analyzeLoadTimes(rows))
                                })
                        });
                    } else if (rows[0] !== undefined) {
                        endTimestampRange = rows[0].timestamp;
                        connection.query('SELECT * FROM `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >=\'' + sessionInfo.timestamp + '\' and timestamp<\'' + endTimestampRange + '\' ORDER BY `timestamp` ASC;',
                            (err, rows, fields) => {
                                setValueTimeLoads(analyzeLoadTimes(rows))
                            })
                    } else {
                        connection.query('SELECT * FROM `Views` WHERE siteID=\'' + sessionInfo.siteID + '\' AND userID=\'' + sessionInfo.userID + '\' AND timestamp >=\'' + sessionInfo.timestamp + '\' ORDER BY `timestamp` ASC;',
                            (err, rows, fields) => {
                                setValueTimeLoads(analyzeLoadTimes(rows))
                            })
                    }
                })
            })
        })
        setTimeout(function() {
            res.send(completeSessions);
            completeSessions = [];
        }, 3000)
    })
})
app.get('/overview/errors', function(req, res) {
    let errors = [];
    connection.query('SELECT siteID, path, xhrProxy, errors, timestamp from `Views` WHERE (xhrProxy<>\'null\' OR errors<>\'null\') AND (xhrProxy<>\'[]\' OR errors<>\'[]\') ORDER BY `timestamp` DESC;', (err, rows, fields) => {
        for (var i = 0; i < rows.length; i++) {
            errors.push({
                siteID: rows[i].siteID,
                path: rows[i].path,
                timestamp: rows[i].timestamp,
                xhrProxy: rows[i].xhrProxy,
                errors: rows[i].errors
            })
        }
        res.send(errors);
    })
})


// listen (start app with node server.js) ======================================
app.listen(process.env.PORT || 8080, function() {
    console.log('Express server listening on port %d in %s mode', this.address().port, app.settings.env);
});
