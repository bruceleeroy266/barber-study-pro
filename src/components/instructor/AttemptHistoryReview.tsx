'use client'
import { useState } from 'react'
import CoachingSearch from './CoachingSearch'
type Item={position:number;domain:string;prompt:string;options:Record<string,string>;correctOption:string;selectedOption:string|null;explanation:string|null;isScored:boolean}
type Attempt={attemptId:string;attemptNumber:number;status:string;completedAt:string|null;scoredCorrect:number|null;scoredTotal:number;percentage:number|null;passed:boolean|null;domainBreakdown:Record<string,{correct:number;total:number;percentage:number}>}
const labels:Record<string,string>={scientific_concepts:'Scientific Concepts',implements_equipment:'Implements & Equipment',hair_care_services:'Hair Care Services',facial_hair_skin_care_services:'Facial Hair & Skin Care'}
export default function AttemptHistoryReview({attempts,coaching}:{attempts:Attempt[];coaching:{attemptId:string;items:Item[]}[]}) {
 const [selectedId,setSelectedId]=useState(attempts[0]?.attemptId??'')
 if(!attempts.length)return <p>No completed practice exams recorded.</p>
 const a=attempts.find(x=>x.attemptId===selectedId)??attempts[0]
 const when=(date:string|null)=>date?new Date(date).toLocaleString():'Time unavailable'
 return <section className="min-w-0 space-y-4" aria-label="Exam attempt history">
  <h2 className="text-lg font-bold">Exam attempt history</h2>
  <label className="block text-sm font-medium" htmlFor="exam-attempt-picker">Choose a completed exam by date and time</label>
  <select id="exam-attempt-picker" value={a.attemptId} onChange={e=>setSelectedId(e.target.value)} className="block min-h-12 w-full min-w-0 rounded-lg border border-gray-600 bg-gray-950 px-3 py-3 text-base text-white">
   {attempts.map(item=><option key={item.attemptId} value={item.attemptId}>Attempt {item.attemptNumber} · {when(item.completedAt)} · {item.percentage??'—'}% · {item.status}</option>)}
  </select>
  <section className="min-w-0 space-y-3 overflow-hidden rounded-lg border p-3 sm:p-5" aria-label="Selected exam result">
   <h3 className="text-lg font-semibold">Attempt {a.attemptNumber}: {a.percentage??'—'}%</h3>
   <p className="text-sm">Scored: {a.scoredCorrect??'—'} / {a.scoredTotal} · {a.passed?'Passing':'Review recommended'} · {a.status}</p>
   <p className="text-sm text-gray-400">{when(a.completedAt)}</p>
   <ul className="space-y-1">{Object.entries(a.domainBreakdown??{}).map(([domain,score])=><li key={domain} className="text-sm">{labels[domain]??domain}: {score.correct}/{score.total} ({score.percentage}%)</li>)}</ul>
  </section>
  <CoachingSearch attempts={coaching} selectedAttemptId={a.attemptId}/>
 </section>
}
