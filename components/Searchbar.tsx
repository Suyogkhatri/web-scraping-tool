"use client"

import { scrapeAndStoreProduct } from "@/lib/action";
import { FormEvent, useState } from "react"

const isValidEcommerceProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;
    
    if(
      hostname.includes ('amazon.com') || 
      hostname.includes ('amazon.in') || 
      hostname.includes ('amazon.') || 
      hostname.includes ('daraz.com.np') || 
      hostname.includes ('darza.') || 
      hostname.includes('sastodeal.com') || 
      hostname.includes ('sastodeal.') || 
      hostname.endsWith ('amazon') || 
      hostname.endsWith ('daraz')|| 
      hostname.endsWith ('sastodeal')||
      hostname.includes ('thulo.com')||
      hostname.includes ('thulo.')||
      hostname.includes ('thulo')
      ){
        return true;
      }
    
    
  } catch (error) {
    return false;
  }

  return false;
  
}

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isloading, setisloading] = useState(false);
    
  const handleSumbit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isValidlink = isValidEcommerceProductURL(searchPrompt);

      //alert(isValidlink ? 'valid link' : 'Invalid link')
      
      if(!isValidlink) return alert ('Please provide a valid link')

      try {
        setisloading(true);

        //scrape the product link
        const product = await scrapeAndStoreProduct(searchPrompt);
      } catch (error) {
        console.log(error);
      } finally{
        setisloading(false);
      }

    }
  return (
    <form 
    className="flex flex-wrap gap-4 mt-12" 
    onSubmit={handleSumbit}>

        <input 
            type="text"
            value={searchPrompt}
            onChange= {(e) => setSearchPrompt(e.target.value)}
            placeholder="please enter product link"
            className=" searchbar-input"  
        />


        <button 
        type= "submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
        >
            {isloading ? 'starting....' : 'start'}
        </button>
    </form>
  )
}

export default Searchbar