import fetch from 'node-fetch';
import debugf from 'debug';
import {Metadata, RawMetadataAPIResponse} from "./metadata";
const debug = debugf("iajs:related"); //TODO-ISSUE#5 (and see examples changed below)
declare var DwebArchive; // This is initialized (along with DwebObjects) at application level TODO-ISSUE#3

// Example
// https://be-api.us.archive.org/mds/v1/get_related/all/diagnosisinterve0000unse

export class RawRelatedAPIResponse {
  hits:object //TODO most of the structure is buried here, should be TS-ified  hits: {hits: [ ] }

  // Other unknown fields (such as the _*.json files)
  [key: string]: any

  constructor (responseData:object) {
    // Assign properties (might be a better way)
    debug('responseData=%O', responseData)
    Object.keys(responseData).forEach((property, index) => {
      if (responseData[property]) {
        this[property] = responseData[property]
      }
    })
  }
}

/**
 * This class is a wrapper for metadata responses
 * NOTE might end up combining Metadata and RawMetadataAPIResponse
 */
export class Related {
  readonly data:RawRelatedAPIResponse
  readonly error:boolean = false
  readonly responseCode:number|null = null

  public constructor (data:RawRelatedAPIResponse, error:boolean = false, responseCode:number = null) {
    this.data = data
    this.error = error
    this.responseCode = responseCode
  }
}


export class RelatedService {


  public API_BASE:string = (typeof DwebArchive !== "undefined") && DwebArchive.mirror
      ? DwebArchive.mirror+'/arc/archive.org/mds/v1'
      :'https://be-api.us.archive.org/mds/v1';
  /**
   * Fetches the full Metadata for an item
   * @param identifier the archive.org identifier
   */

  //TODO use similar patterns to metadata.ts to return a typed data structure

  public async get (options: {identifier:string}):Promise<any> {
    debug('getting related for %s', options.identifier);
    return fetch(`${this.API_BASE}/get_related/all/${options.identifier}`)
        .then(res => res.text())
        .then(body => JSON.parse(body))
        .then(obj => { //TODO-MITRA compact this once tested
          const rel_response = new RawRelatedAPIResponse(obj);
          const rel = new Related(rel_response)
          return (rel)
        })
        .catch((err) => { //TODO-MITRA should return Related
          const rel_response = new RawRelatedAPIResponse({hits: {hits: []}});
          const responseCode = 500 // TODO get responseCode
          const rel = new Related(rel_response, true, responseCode)
          //reject(md)  // TODO-ISSUE#4b this has to be wrong, you can't reject something that isn't an error or at least shouldnt - its either return(rel) or ...
          throw(err);
        });
  }
}
