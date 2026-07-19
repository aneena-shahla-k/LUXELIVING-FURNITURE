import React, { useEffect } from 'react'; // 1. useEffect ഇമ്പോർട്ട് ചെയ്യുക
import CollectionCategories from '../Components/Collections/Collection-Category/CollectionCategories'
import ShopTheLook from '../Components/Collections/ShopTheLook/ShopTheLook'
import ShopDecor from '../Components/Collections/ShopDecor/ShopDecor'

export default function Collection() {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <CollectionCategories/>
      <ShopTheLook/>
      <ShopDecor/>
    </div>
  )
}
