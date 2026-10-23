import { canonicalMicroEvidence, summarizeMicroConcepts, type PersistedMicroCheckRow } from '@/lib/analytics/canonical-micro-evidence'
import { scoreEvidence } from '@/lib/analytics/academic-contract-v1'

export default function MicroCheckAccuracy({studentId,rows}:{studentId:string,rows:readonly PersistedMicroCheckRow[]}) {
  const chapters = [...new Set(rows.map(r=>r.chapter_id))].sort((a,b)=>
    Number(a.slice(3))-Number(b.slice(3)))
  return <section aria-label="Micro-knowledge accuracy" className="rounded-xl border border-graphite p-5">
    <h2 className="text-xl font-semibold">Micro-knowledge accuracy</h2>
    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Recorded first answers only. These percentages do not represent completion or the weighted chapter grade.</p>
    {chapters.length === 0 ? <p className="mt-4 text-sm">Not assessed</p> :
      <div className="mt-4 space-y-3">{chapters.map(chapterId => {
        const evidence = canonicalMicroEvidence({rows:rows.filter(r=>r.chapter_id===chapterId),studentId,chapterId})
        const score = scoreEvidence(evidence)
        return <div key={chapterId} className="border-b border-graphite pb-2">
          <p className="font-medium">{chapterId}: {score.percent}% ({score.correct}/{score.answered})</p>
          <ul className="mt-1 space-y-1 text-sm">{summarizeMicroConcepts(evidence).map(concept=>
            <li key={concept.conceptId}>{concept.conceptId}: {concept.percent}% ({concept.correct}/{concept.answered}) — {concept.evidenceStatus==='limited'?'Limited evidence':'Evidence available'}</li>
          )}</ul>
        </div>
      })}</div>}
  </section>
}
