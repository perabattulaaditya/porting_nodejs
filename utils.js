var CryptoJS = require("crypto-js");
 

exports.md5 =function(s){
    var md5ciphertext = CryptoJS.MD5(s).toString()
    return md5ciphertext;
}
