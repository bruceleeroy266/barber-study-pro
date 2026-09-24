import { chapter5QuizQuestionConceptMappings, chapter5ReassessmentQuestionConceptMappings } from '@/lib/chapter-5-concepts/mappings'
import type { ConceptId,QuizQuestionId,ChapterId,ICanonicalMappingProvider } from '@/lib/reassessment/types'
export class Chapter5MappingProvider implements ICanonicalMappingProvider{
 readonly chapterId:ChapterId='ch-5'
 private readonly q2c=new Map<QuizQuestionId,ConceptId>()
 private readonly c2q=new Map<ConceptId,QuizQuestionId[]>()
 constructor(){
  for(const m of [...chapter5QuizQuestionConceptMappings,...chapter5ReassessmentQuestionConceptMappings]){
   const q=m.questionId as string,c=m.conceptFamilyId as string
   this.q2c.set(q,c); this.c2q.set(c,[...(this.c2q.get(c)??[]),q])
  }
 }
 getConceptForQuestion(q:QuizQuestionId){return this.q2c.get(q)}
 getQuestionsForConcept(c:ConceptId){return this.c2q.get(c)??[]}
 isQuestionMappedToConcept(q:QuizQuestionId,c:ConceptId){return this.q2c.get(q)===c}
 getAllConceptIds(){return Array.from(this.c2q.keys())}
 getAllQuestionIds(){return Array.from(this.q2c.keys())}
}
let instance:Chapter5MappingProvider|null=null
export function getChapter5MappingProvider(){return instance??=new Chapter5MappingProvider()}
export function resetChapter5MappingProvider(){instance=null}
