'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
type Item={position:number;domain:string;prompt:string;selectedOption:string|null;selectedAnswer:string|null;isCorrect:boolean|null;flagged:boolean}
export default function LiveExamReview({items}:{items:Item[]}) {
 const router=useRouter()
 useEffect(()=>{const id=setInterval(()=>router.refresh(),10000);return()=>clearInterval(id)},[router])
 const answered=items.filter(i=>i.selectedOption).length
 return <section className="min-w-0 space-y-3 rounded-xl border border-blue-500/40 p-3 sm:p-5" aria-label="Live full exam review">
  <h2 className="text-lg font-bold">Live Full Exam Review</h2>
  <p className="text-sm text-gray-400">Instructor-only · read-only · refreshes about every 10 seconds. Correct option and explanations are hidden until the attempt ends.</p>
  <p className="text-sm" aria-live="polite">{answered} of {items.length} answered</p>
  <div className="space-y-2">
   {items.map(i=><details key={i.position} className="min-w-0 overflow-hidden rounded-lg border border-gray-700 p-3">
    <summary className="cursor-pointer break-words font-medium">Q{i.position}: {i.selectedOption?i.isCorrect?'Answered · Correct':'Answered · Incorrect':'Unanswered'} {i.flagged?'★':''}</summary>
    <p className="mt-2 break-words text-sm">{i.prompt}</p>
    <p className="mt-2 break-words text-sm">Student selected: {i.selectedOption?i.selectedOption.toUpperCase()+'. '+(i.selectedAnswer||''):'Not answered'}</p>
    <p className="mt-1 text-sm">{i.isCorrect===null?'Not graded yet':i.isCorrect?'Correct':'Incorrect'}</p>
   </details>)}
  </div>
 </section>
}
