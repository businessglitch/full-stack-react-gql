import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import { useRouter } from 'next/dist/client/router';
import {SearchStyles, DropDown, DropDownItem} from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
 query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
        where: {
            OR: [
                {name_contains_i: $searchTerm},
                {description_contains_i: $searchTerm}
            ]
        } 
    ) {
        id 
        name
        photo {
            image { 
                publicUrlTransformed
            }
        }

    }
 }
`
export default function Search() {
    const router = useRouter()
    const [findItems, {loading, data, error}] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
        fetchPolicy:'no-cache'
    })

    const items = data?.searchTerms  || [] 
    const findItemsButChill = debounce(findItems, 350)

    resetIdCounter();
    const {inputValue, getMenuProps,isOpen, getInputProps, getComboboxProps, getItemProps, highlightedIndex} = useCombobox({
        items,
        onInputValueChange() {
            // When someone times into the box
            findItemsButChill({
                variables: {
                    searchTerm: inputValue
                }
            })
        },
        onSelectedItemChange({selectedItem}) {
            // When someone selects an item from the box
            router.push(`product/${selectedItem.id}`)
        },
        itemToString: item => item?.name || ''
    })
    
    return (
        <>
            <div {...getComboboxProps()}>
                <input {...getInputProps({
                            type:"search",
                            placeholder:"Seach for an Item",
                            id: 'Search',
                            className: loading ? 'loading' : ''
                        })}
                />
            </div>
            <DropDown {...getMenuProps()}>
                {
                    isOpen && items.map((item,index) => {
                        const {name, photo, id} = item
                        return (
                            <DropDownItem highlighted={index === highlightedIndex} {...getItemProps({item})} key={id}>
                                <img src={photo.image.publicUrlTransformed} alt={name} width="50px"/>
                                {name}
                            
                            </DropDownItem>
                        )
                    })
                }
                {isOpen && !items.length && !loading && (
                    <DropDownItem>Sorry, No items found for ${inputValue}</DropDownItem>
                )}
            </DropDown>
        </>
        )
}