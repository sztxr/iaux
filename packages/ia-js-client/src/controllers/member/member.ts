import { MetadataService, Metadata } from '../../services/metadata'
import { DetailsService, DetailsResponse } from '../../services/details'

/* Note this is subclassed by dweb-archive#iaux/ArchiveMember */

export class Member {
    readonly identifier:string

    private metadataCache:Metadata

    constructor (identifier:string, metadata?:Metadata) {
        this.identifier = identifier
        this.metadataCache = metadata
    }
}