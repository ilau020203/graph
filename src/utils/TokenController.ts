import {Token} from "../../generated/schema"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"

export function loadToken(_token : Bytes,timestamp:BigInt):Token {
    let token = Token.load(_token.toHexString());
    if(token==null){
        token =new Token(_token.toHexString());
        token.timestamp= timestamp;
        token.save();
    }
    return token;
}
