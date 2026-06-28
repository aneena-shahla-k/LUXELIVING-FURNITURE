import React from 'react'
import CollectionCategories from '../Components/Collections/Collection-Category/CollectionCategories'
import ShopTheLook from '../Components/Collections/ShopTheLook/ShopTheLook'
import ShopDecor from '../Components/Collections/ShopDecor/ShopDecor'

export default function Collection() {
  return (
    <div>
        <CollectionCategories/>
        <ShopTheLook/>
        <ShopDecor/>
    </div>
  )
}
