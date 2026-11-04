import type { PracticeQuestion } from './randomize';
import { infectionControlQuestions } from './infection-control-bank';
import { anatomyPhysiologyQuestions } from './anatomy-physiology';
import { scientificConceptGapQuestions } from './scientific-concepts-gap';
import { hairScalpDisorderQuestionBank } from './hair-scalp-disorders-bank';
import { hairStructurePropertyQuestionBank } from './hair-structure-properties-bank';
import { implementsEquipmentQuestions } from './implements-equipment';
import { hairCareQuestionBank } from './hair-care-services-bank';
import { facialHairSkinQuestions } from './facial-hair-skin-care';

type Row = { subject:string; question:PracticeQuestion };
type Finding = { severity:'FAIL'|'REVIEW'; rule:string; ids:string[]; detail:string };

const BANKS: Record<string, PracticeQuestion[]> = {
  'Infection Control': infectionControlQuestions as PracticeQuestion[],
  'Anatomy & Physiology': anatomyPhysiologyQuestions as PracticeQuestion[],
  'Skin Conditions & Barber Chemistry': scientificConceptGapQuestions as PracticeQuestion[],
  'Hair & Scalp Disorders': hairScalpDisorderQuestionBank as PracticeQuestion[],
  'Hair Structure & Properties': hairStructurePropertyQuestionBank as PracticeQuestion[],
  'Implements & Equipment': implementsEquipmentQuestions as PracticeQuestion[],
  'Hair Care Services': hairCareQuestionBank as PracticeQuestion[],
  'Facial Hair & Skin Care': facialHairSkinQuestions as PracticeQuestion[],
};

const OFFICIAL_WEIGHTS: Record<string,number> = {
  'Scientific Concepts':35,
  'Implements & Equipment':10,
  'Hair Care Services':40,
  'Facial Hair & Skin Care':15,
};

const stop = new Set([
  'the','a','an','and','or','to','of','in','on','for','with','at','by','from','is','are','be','been','being',
  'what','which','why','how','when','where','who','should','would','could','can','client','barber','hair','service',
  'product','best','most','main','primary','following','statement','correctly','correct','appropriate','before','after',
]);

function normalize(s:string){
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();
}
function tokens(s:string){
  return new Set(normalize(s).split(' ').filter(w=>w.length>2 && !stop.has(w)));
}
function jaccard(a:Set<string>, b:Set<string>){
  const inter=[...a].filter(x=>b.has(x)).length;
  const union=new Set([...a,...b]).size;
  return union ? inter/union : 0;
}
function option(q:PracticeQuestion){
  return q.options.find(o=>o.id===q.correctOptionId);
}
function sourceClass(source:string){
  const s=source.toLowerCase();
  if(s.includes('nic')) return 'NIC';
  if(s.includes('textbook') || s.includes('barbering')) return 'TEXTBOOK';
  if(s.includes('oklahoma')) return 'STATE';
  if(s.includes('cdc') || s.includes('osha') || s.includes('epa')) return 'AUTHORITY';
  if(s.includes('manufacturer')) return 'MANUFACTURER';
  return 'OTHER';
}

const all:Row[]=Object.entries(BANKS).flatMap(([subject,qs])=>qs.map(question=>({subject,question})));
const findings:Finding[]=[];

if(all.length!==573) findings.push({severity:'FAIL',rule:'bank-count',ids:[],detail:`Expected 573 questions; found ${all.length}`});
const ids=all.map(r=>r.question.id);
if(new Set(ids).size!==ids.length) findings.push({severity:'FAIL',rule:'duplicate-id',ids:[],detail:'Duplicate IDs detected'});

for(const {question:q} of all){
  const correct=option(q);
  if(!correct) {
    findings.push({severity:'FAIL',rule:'missing-key',ids:[q.id],detail:'correctOptionId does not resolve'});
    continue;
  }
  if(q.options.length!==4 || new Set(q.options.map(o=>normalize(o.text))).size!==4){
    findings.push({severity:'FAIL',rule:'option-integrity',ids:[q.id],detail:'Question does not have four unique normalized options'});
  }
  if(!q.explanation?.trim()) findings.push({severity:'FAIL',rule:'missing-explanation',ids:[q.id],detail:'Blank explanation'});
  if(!Array.isArray(q.sourceBasis) || q.sourceBasis.length===0) {
    findings.push({severity:'FAIL',rule:'missing-source',ids:[q.id],detail:'No sourceBasis'});
  } else {
    const classes=new Set(q.sourceBasis.map(sourceClass));
    if(classes.size===1 && classes.has('OTHER')){
      findings.push({severity:'REVIEW',rule:'vague-source-grounding',ids:[q.id],detail:q.sourceBasis.join(' | ')});
    }
  }

  const distractors=q.options.filter(o=>o.id!==q.correctOptionId);
  const correctLen=correct.text.length;
  const avgDist=distractors.reduce((n,o)=>n+o.text.length,0)/Math.max(1,distractors.length);
  if(correctLen>avgDist*1.8 && correctLen-avgDist>28){
    findings.push({severity:'REVIEW',rule:'answer-length-cue',ids:[q.id],detail:`Correct=${correctLen} chars, distractor avg=${avgDist.toFixed(1)}`});
  }

  const bad=/\b(always|never|obviously|impossible|nothing|only if|regardless of|ignore|skip|does not matter|irrelevant)\b/i;
  if(distractors.filter(o=>bad.test(o.text)).length>=2){
    findings.push({severity:'REVIEW',rule:'weak-distractor-language',ids:[q.id],detail:'Two or more distractors contain giveaway/extreme wording'});
  }

  if(q.difficulty==='hard'){
    if(q.type==='recall') findings.push({severity:'FAIL',rule:'hard-recall',ids:[q.id],detail:'Hard item is recall-only'});
    const ct=tokens(correct.text);
    const close=distractors.filter(o=>jaccard(ct,tokens(o.text))>=0.10).length;
    if(close<2) findings.push({severity:'REVIEW',rule:'hard-distractors-too-distant',ids:[q.id],detail:`Only ${close} distractors share meaningful answer-family language`});
  }

  const expTokens=tokens(q.explanation);
  const ansTokens=tokens(correct.text);
  if(ansTokens.size>=3 && jaccard(expTokens,ansTokens)<0.05){
    findings.push({severity:'REVIEW',rule:'key-explanation-alignment',ids:[q.id],detail:'Correct answer has very low lexical support in explanation; manual key check required'});
  }
}

for(let i=0;i<all.length;i++){
  const a=all[i].question, at=tokens(a.prompt);
  for(let j=i+1;j<all.length;j++){
    const b=all[j].question;
    const sim=jaccard(at,tokens(b.prompt));
    if(sim>=0.90){
      findings.push({severity:'FAIL',rule:'semantic-near-duplicate',ids:[a.id,b.id],detail:`Prompt token Jaccard=${sim.toFixed(2)}`});
    } else if(sim>=0.72 && (a.competency===b.competency || all[i].subject===all[j].subject)){
      findings.push({severity:'REVIEW',rule:'semantic-overlap',ids:[a.id,b.id],detail:`Prompt token Jaccard=${sim.toFixed(2)}; same subject/competency family`});
    }
  }
}

const domainCounts=new Map<string,number>();
const domainHard=new Map<string,number>();
const competencyCounts=new Map<string,number>();
for(const {question:q} of all){
  domainCounts.set(q.domain,(domainCounts.get(q.domain)||0)+1);
  if(q.difficulty==='hard') domainHard.set(q.domain,(domainHard.get(q.domain)||0)+1);
  const key=`${q.domain}::${q.competency}`;
  competencyCounts.set(key,(competencyCounts.get(key)||0)+1);
}

for(const [domain,weight] of Object.entries(OFFICIAL_WEIGHTS)){
  const n=domainCounts.get(domain)||0;
  if(n<Math.ceil(weight*1.5)){
    findings.push({severity:'FAIL',rule:'domain-reserve-depth',ids:[],detail:`${domain} has only ${n} bank items for a ${weight}% scored domain`});
  }
  const hard=domainHard.get(domain)||0;
  if(hard===0) findings.push({severity:'FAIL',rule:'domain-hard-depth',ids:[],detail:`${domain} has no hard items`});
}

const concentrated=[...competencyCounts.entries()].filter(([,n])=>n>=18).sort((a,b)=>b[1]-a[1]);
for(const [key,n] of concentrated){
  findings.push({severity:'REVIEW',rule:'competency-concentration',ids:[],detail:`${key} has ${n} questions; review for redundancy/crowding`});
}

const hard=all.filter(r=>r.question.difficulty==='hard').length;
const hardPct=hard/all.length*100;
if(hardPct>55) findings.push({severity:'REVIEW',rule:'difficulty-inflation',ids:[],detail:`${hard}/${all.length} = ${hardPct.toFixed(1)}% hard`});

const failures=findings.filter(f=>f.severity==='FAIL');
const reviews=findings.filter(f=>f.severity==='REVIEW');
const byRule=(items:Finding[])=>Object.fromEntries([...new Set(items.map(f=>f.rule))].sort().map(rule=>[rule,items.filter(f=>f.rule===rule).length]));

console.log(JSON.stringify({
  totalQuestions:all.length,
  hardQuestions:hard,
  hardPercent:Number(hardPct.toFixed(1)),
  domainCounts:Object.fromEntries(domainCounts),
  domainHard:Object.fromEntries(domainHard),
  officialScoredWeights:OFFICIAL_WEIGHTS,
  failures:failures.length,
  reviews:reviews.length,
  failuresByRule:byRule(failures),
  reviewsByRule:byRule(reviews),
  failureDetails:failures,
  reviewDetails:reviews.slice(0,250),
  note:'REVIEW findings are audit candidates, not automatic defects. FAIL findings block Phase 3D certification.'
},null,2));

if(failures.length) process.exitCode=2;
