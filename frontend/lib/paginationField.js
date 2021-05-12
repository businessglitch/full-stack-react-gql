import gql from "graphql-tag";
import {PAGINATION_QUERY}  from '../components/Pagination'

export default function PaginationField() {
    return {
        keyArgs: false, // tells Apallo we are taking care of everything
        read(existing = [], {args, cache}) {
            const { skip, first } = args;

            const data = cache.readQuery({query: PAGINATION_QUERY})
            const count = data?._allProductsMeta.count 
            const page = skip / first + 1;
            const pages = Math.ceil(count/ first)

            const items = existing.slice(skip, skip+first).filter((x) =>  x)
            if (items.length && items.length !== first && page === pages) {
                return items;
            }

            if (items.length !== first) {
                return false
            } else if (items.length) {
                return items
            }

            return false
        },
        merge(existing, incoming, {args}) {
            // Runs when the Apollo client comes back from the network with the producsts
            const {skip, first} = args;
            const merged = existing ? existing.slice(0) : []
            for (let i = skip; i < skip + incoming.length; ++i) {
                merged[i] = incoming[i - skip];
            }

            return merged
        }
    }
}