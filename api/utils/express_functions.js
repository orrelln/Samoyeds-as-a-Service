module.exports = {
    idToImgPath: (id, req) => {
        try {
            if (id instanceof Array) {
                let paths = [];
                id.forEach((obj) => {
                    paths.push(`img.${req.hostname}/${obj}`);
                });
                return paths;
            } else {
                return `img.${req.hostname}/${id}`;
            }
        } catch (e) {
            console.log(e)
        }
    }
};