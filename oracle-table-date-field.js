const oracleBb  = require('oracledb')
const oracleConfig  = require('./oracleconfig')
const loremIpsum  = require('lorem-ipsum')

const linesInsert = 1000

const [node, file, quantLines] = process.argv

console.log(quantLines)

const execute = (quant, err, connection) => {
    if (err) return console.error(err);
    
    let statement = `INSERT ALL `;
    let i = quant;
    while(i > 0) {
        i--
        let params = generateParams()
        statement = statement + `  into DATE_AS_PK (col1, col2, sometext, somefloat) values ((SELECT sysdate FROM dual), '${params.number}' , '${params.text}', '${params.float}')`
    }
    statement += "select 1 from dual"
    console.log(statement)

    connection.execute(statement, 
        [], 
        (err, result) => {
            if (err) return console.error(err)
            connection.commit()
            console.log("result", result)
            release(connection)
        }
    )
}

const generateParams = () => {
    return {
        number: Math.round(Math.ceil(Math.random() * 1000000)).toFixed(0),
        text: loremIpsum({count: 20, units: 'words'}),
        float: (Math.random() * 10000).toFixed(4)
    }
}

const release = (connection) => {
    connection.close(
    function(err) {
        if (err) {
        console.error(err.message);
        }
    });
}

oracleBb.getConnection( oracleConfig , (err, connection) =>  execute(quantLines, err, connection))
