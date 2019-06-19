import Vinyl = require('vinyl');
import {targetCsv} from '../plugin';
const from2 = require('from2');

class lambdaResponse {
  statusCode: number = 200
  isBase64Encoded: boolean = false
  headers: object = {
    // TODO: limit to a whitelist of allowed sites
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true // Required for cookies, authorization headers with HTTPS
  }
  body: string = '' // set response body here
}

export async function doParse(event:any, context:any, callback:any){
  console.log(event);
  const response = new lambdaResponse()
  response.body = JSON.stringify({ message: 'this is a dummy body and should be replaced.' })
  const body = JSON.parse(event.body);
  const config = body.config;
  const toParse: Vinyl | string = body.toParse;

  let file:Vinyl;
  if(Vinyl.isVinyl(toParse)){
    file = toParse;
  }else{
    file = new Vinyl({
      contents: Buffer.from(toParse)
    })
  }

  let result:string = '';
  try{
    from2.obj([file]).pipe(targetCsv({}))
    .on('data', function(data:any){
      console.log(data.contents.toString())
      result+= JSON.stringify(data)+'\n';
    })
    .on('error', function(err:any){
      response.body = JSON.stringify(file)
      callback(err,response);
    })
    .on('end', function(){
      response.body = result;
      callback(null,response);
    })
  }catch(err){
    callback(err,response)
  }
}
