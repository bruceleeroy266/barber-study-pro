'use client'

import { useMemo, useState } from 'react'

type Item = { position:number; domain:string; prompt:string; options:Record<string,string>; correctOption:string; selectedOption:string|null; explanation:string|null; isScored:boolean }
type Attempt = { attemptId:string; items:Item[] }
const labels:Record<string,string> = {
 scientific_concepts:'Scientific Concepts', implements_equipment:'Implements & Equipment',
 hair_care_services:'Hair Care Services', facial_hair_skin_care_services:'Facial Hair & Skin Care'
}
const hints:Record<string,string[]> = {
 scientific_concepts:['Which scientific principle applies?','What biological process or safety principle matters?','Explain the underlying concept without naming an option.'],
 implements_equipment:['What is the tool designed to do?','Which sanitation or safety requirement applies?','Explain the safest professional technique.'],
 hair_care_services:['Which hair characteristic matters?','What could happen if the service is performed incorrectly?','Describe the correct service sequence.'],
 facial_hair_skin_care_services:['Which facial-hair or skin concern matters?','How should client safety guide the service?','Describe the relevant professional principle.']
}
export default function CoachingSearch({attempts,selectedAttemptId}:{attempts:Attempt[];selectedAttemptId:string}) {
 const [query,setQuery]=useState('')
 const [domain,setDomain]=useState('all')
 const [answerStatus,setAnswerStatus]=useState('all')
 const questions=useMemo(()=>attempts.filter(a=>a.attemptId===selectedAttemptId).flatMap(a=>a.items.map(q=>({...q,key:a.attemptId+'-'+q.position}))),[attempts,selectedAttemptId])
 const filtered=questions.filter(q=>{
  const needle=query.trim().toLowerCase()
  return (domain==='all'||q.domain===domain) &&
   (answerStatus==='all' || (answerStatus==='answered' && Boolean(q.selectedOption)) || (answerStatus==='correct' && Boolean(q.selectedOption) && q.selectedOption?.toLowerCase()===q.correctOption?.toLowerCase()) || (answerStatus==='missed' && Boolean(q.selectedOption) && q.selectedOption?.toLowerCase()!==q.correctOption?.toLowerCase()) || (answerStatus==='unanswered' && !q.selectedOption)) &&
   (!needle || [q.position.toString(), 'q'+q.position, q.prompt,labels[q.domain]||q.domain].some(s=>s.toLowerCase().includes(needle)))
 })
 if (!questions.length) return null
 return <section className="min-w-0 space-y-4 overflow-hidden rounded-xl border border-amber-500/40 p-3 sm:p-5 lg:p-6">
  <h2 className="break-words text-lg font-bold sm:text-xl">Instructor Question Coaching</h2>
  <p className="text-sm text-gray-400">Search only this student&apos;s finalized exam attempts. Instructor-only answer keys must not be shared during active tests. Hints are general and pending academic review.</p>
  <label className="block text-sm font-medium" htmlFor="coaching-search">Search by question number, topic or keyword</label>
  <input id="coaching-search" type="search" value={query} onChange={e=>setQuery(e.target.value)}
    placeholder="Search 110 questions..." className="block min-h-12 w-full min-w-0 rounded-lg border border-gray-600 bg-gray-950 px-3 py-3 text-base text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" />
  <label className="block text-sm font-medium" htmlFor="coaching-domain">Theory topic</label>
  <select id="coaching-domain" value={domain} onChange={e=>setDomain(e.target.value)}
    className="block min-h-12 w-full min-w-0 rounded-lg border border-gray-600 bg-gray-950 px-3 py-3 text-base text-white">
   <option value="all">All topics</option>
   {Object.entries(labels).map(([key,value])=><option key={key} value={key}>{value}</option>)}
  </select>
  <label className="block text-sm font-medium" htmlFor="coaching-answer-status">Question results</label>
  <select id="coaching-answer-status" value={answerStatus} onChange={e=>setAnswerStatus(e.target.value)} className="block min-h-12 w-full min-w-0 rounded-lg border border-gray-600 bg-gray-950 px-3 py-3 text-base text-white">
   <option value="all">All questions</option>
   <option value="answered">Answered questions</option>
   <option value="correct">Correctly answered</option>
   <option value="missed">Missed questions</option>
   <option value="unanswered">Unanswered questions</option>
  </select>
  <p aria-live="polite" className="text-sm text-gray-400">{filtered.length} of {questions.length} questions</p>
  <div className="min-w-0 space-y-3">
  {filtered.map(q=><details key={q.key} className="min-w-0 overflow-hidden rounded-lg border border-gray-700 p-3 sm:p-4">
   <summary className="cursor-pointer break-words py-1 font-semibold leading-relaxed">Q{q.position}: {q.prompt}</summary>
   <p className="mt-2 text-xs text-gray-400">{labels[q.domain]||q.domain} · {q.isScored?'Scored':'Unscored'}</p>
   <ul className="mt-2 space-y-2 break-words text-sm leading-relaxed">{Object.entries(q.options).map(([letter,option])=><li key={letter}>{letter.toUpperCase()}. {option}</li>)}</ul>
   <div className="mt-3 rounded-lg border border-gray-700 p-3 sm:p-4">
    <p className="font-medium">Teaching hints</p>
    <ol className="mt-2 list-inside list-decimal space-y-2 break-words text-sm leading-relaxed">{(hints[q.domain]||['Identify the main concept.','Consider safe practice.','Explain the reasoning.']).map(h=><li key={h}>{h}</li>)}</ol>
   </div>
   <details className="mt-3 min-w-0 overflow-hidden rounded-lg border border-amber-500/40 p-3 sm:p-4">
    <summary className="cursor-pointer py-2 font-semibold">Reveal instructor-only answer</summary>
    <p className="mt-2">Correct option: {q.correctOption?.toUpperCase()||'Unavailable'}</p>
    <p className="text-sm">Student selected: {q.selectedOption?.toUpperCase()||'Unanswered'}</p>
    <p className="mt-2 break-words text-sm leading-relaxed">{q.explanation||'Explanation awaiting academic review.'}</p>
   </details>
  </details>)}
  {!filtered.length&&<p className="text-sm text-gray-400">No matching questions.</p>}
  </div>
 </section>
}
