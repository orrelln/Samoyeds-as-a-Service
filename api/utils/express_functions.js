module.exports = {
    idToImgPath: (id, req) => {
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
};