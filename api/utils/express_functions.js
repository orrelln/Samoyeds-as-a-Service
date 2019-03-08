function idToImgPath(id, req) {
    try {
        if (id instanceof Array) {
            let paths = [];
            hostName = req.hostname.includes('www.') ? req.hostname.substring(4) : req.hostname;
            id.forEach((obj) => {
                paths.push(`http://img.${hostName}/${obj}`);
            });
            return paths;
        } else {
            return `http://img.${req.hostname}/${id}`;
        }
    } catch (e) {
        console.log(e)
    }
}

function rowsToSimple(rows, req) {
    try {
        let results = [];
        let currID;
        rows.forEach((row) => {
            if (currID !== row.id) {
                currID = row.id;
                results.push({
                    link: idToImgPath(currID, req),
                    breed: row.breed
                });
            }
        });
        return results;
    } catch (e) {
        console.log(e)
    }
}

function rowsToRobust(rows, req) {
    try {
        let results = [];
        let currRes;
        let currID;
        rows.forEach((row) => {
            if (currID !== row.id) {
                currID = row.id;
                if (currRes)
                    results.push(currRes);
                currRes = {
                    link: idToImgPath(currID, req),
                    breeds: []
                };
            }
            currRes.breeds.push({
                breed: row.breed,
                percentage: row.percentage
            });
        });
        if (currRes)
            results.push(currRes);
        return results;
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    idToImgPath,
    rowsToSimple,
    rowsToRobust
};