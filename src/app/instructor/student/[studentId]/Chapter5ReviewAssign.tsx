'use client'

import { useState, useTransition } from 'react'
import { assignChapter5Review } from './chapter5-review-actions'

export default function Chapter5ReviewAssign({studentId,concepts,history}:{
  studentId:string
  concepts:{id:string;name:string}[]
  history:{conceptId:string;status:string;done:number;total:number}[]
}) {
  const [concept,setConcept]=useState(concepts[0]?.id??'')
  const [message,setMessage]=useState('')
  const [pending,startTransition]=useTransition()
  return <div className="p-6 border-t border-graphite space-y-3">
    <h3 className="text-sm font-semibold text-white">Assign Chapter 5 Targeted Review</h3>
    <label htmlFor="qa174-target" className="block text-sm text-silver">Concept to review</label>
    <select id="qa174-target" value={concept} onChange={e=>setConcept(e.target.value)} className="rounded border border-graphite bg-black text-white p-2">
      {concepts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
    </select>
    <button type="button" disabled={pending||!concept} onClick={() => startTransition(async()=>{
      const result=await assignChapter5Review(studentId,concept)
      setMessage(result.message)
    })} className="ml-3 rounded bg-gold text-black px-4 py-2 disabled:opacity-50">Assign review</button>
    {message && <p role="status" className="text-sm text-silver">{message}</p>}
    <h4 className="text-sm font-semibold text-white">Student review progress</h4>
    {history.length===0?<p className="text-sm text-silver">No Chapter 5 review assigned.</p>:<ul className="text-sm text-silver space-y-1">
      {history.map((h,i)=><li key={h.conceptId+'-'+i}>{concepts.find(c=>c.id===h.conceptId)?.name??h.conceptId}: {h.done}/{h.total} completed ({h.status})</li>)}
    </ul>}
  </div>
}
