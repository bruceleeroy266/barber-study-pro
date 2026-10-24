'use client'
import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
export default function LiveStatusRefresh(){
 const router=useRouter()
 useEffect(()=>{
  const handle=window.setInterval(()=>{if(document.visibilityState==='visible')router.refresh()},10000)
  return ()=>window.clearInterval(handle)
 },[router])
 return null
}
