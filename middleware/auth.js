import jwt from 'jsonwebtoken'

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; //our own less than 500

        let decodedData;

        if(token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
        } else {
            //google
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch(e) {
        console.log(e);
    }
}

export default auth;