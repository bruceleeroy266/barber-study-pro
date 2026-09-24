import type { QuizQuestion } from '@/types'

type Fact={cue:string;correct:string;distractors:[string,string,string]}
type Family={name:string;facts:readonly Fact[]}

const families:readonly Family[]=[
{name:'Combs & Brushes',facts:[
{cue:'carbon comb characteristics',correct:'Carbon combs are antistatic and resist heat and many chemicals.',distractors:['Metal combs are antistatic and never retain heat.','Graphite combs are the most rigid material in the source.','Hard-rubber combs are unaffected by disinfectants.']},
{cue:'tail comb use',correct:'A tail comb is used for sectioning and parting.',distractors:['A tail comb is primarily a razor-stropping tool.','A tail comb is used only for clipper blade cleaning.','A tail comb is a thermal iron attachment.']},
{cue:'wide-tooth comb use',correct:'Wide or coarse teeth help detangle and handle larger amounts of hair.',distractors:['Wide teeth are used only for precision detail cutting.','Wide teeth replace attachment combs on clippers.','Wide teeth are intended for razor honing.']},
{cue:'natural bristle brush',correct:'Natural bristles polish hair and help distribute sebum.',distractors:['Natural bristles are clipper guards.','Natural bristles are used to hone razors.','Natural bristles are designed to conduct heat to the scalp.']},
{cue:'comb condition',correct:'A comb with broken or rough teeth should be removed from service.',distractors:['Broken teeth improve sectioning accuracy.','Only comb color determines replacement.','A damaged comb is safe if used only on dry hair.']},
]},
{name:'Shears & Cutting Implements',facts:[
{cue:'French versus German shear style',correct:'French-style shears include a finger rest or tang; German style is described without it.',distractors:['German style always has two tangs.','French style refers to a convex blade grind only.','French and German describe clipper motor types.']},
{cue:'shear tension',correct:'The tension or pivot screw controls pressure between the blades.',distractors:['The bumper controls blade pressure.','The tang sharpens the cutting edge.','The shank changes the shear from left- to right-handed.']},
{cue:'convex versus beveled edge',correct:'Convex edges glide smoothly; beveled edges are more durable and grip hair differently.',distractors:['Beveled edges are straight-razor strops.','Convex and beveled describe clipper motors.','Convex edges are used only for thinning shears.']},
{cue:'palming',correct:'Palming keeps the shears controlled while freeing the fingers to work with the comb.',distractors:['Palming means placing shears on the workstation.','Palming is a honing procedure.','Palming changes the blade tension automatically.']},
{cue:'shear care',correct:'Clean and disinfect shears, maintain proper tension, avoid drops, and protect them during storage.',distractors:['Cut paper to test sharpness after each service.','Store shears open in a wet disinfectant container.','Drop shears lightly to reset blade alignment.']},
]},
{name:'Clippers & Trimmers',facts:[
{cue:'clipper system types',correct:'Detachable-blade clippers change blade units; adjustable-blade clippers use a lever.',distractors:['Detachable means the motor is removable.','Adjustable means the cord length changes.','Both terms describe razor grinds.']},
{cue:'motor types',correct:'Rotary, pivot, and magnetic are the three motor types named in the source.',distractors:['Ceramic, carbon, and steel are motor types.','Detachable, adjustable, and cordless are motor types.','Convex, beveled, and wedge are motor types.']},
{cue:'outliner pressure',correct:'Outliners should be used with light pressure and controlled movement.',distractors:['Heavy pressure improves precision safely.','Outliners should always be set flush.','Outliners require a guard for every detail service.']},
{cue:'blade material and size',correct:'Carbon steel and ceramic are blade materials, and 00000 is a very close blade size.',distractors:['00000 is the longest guard size.','Ceramic is a clipper motor type.','Carbon steel is a battery chemistry.']},
{cue:'pulling or snagging',correct:'Stop and inspect cleanliness, lubrication, alignment, and blade condition.',distractors:['Press harder and continue.','Assume the client caused the problem.','Replace the motor before checking the blade.']},
]},
{name:'Razors, Honing & Stropping',facts:[
{cue:'razor types',correct:'Changeable-blade razors use replaceable blades; conventional straight razors require edge maintenance.',distractors:['Conventional razors use disposable clipper guards.','Changeable-blade razors require honing after every use.','Hair razors and shaving razors are identical tools.']},
{cue:'razor anatomy',correct:'Head, back, shoulder, tang, point, edge, heel, shank, and pivot are straight-razor parts.',distractors:['Guard, taper lever, and motor are razor parts.','Finger rest, bumper, and tension screw are razor parts.','Barrel, nozzle, and diffuser are razor parts.']},
{cue:'razor shaper',correct:'A razor shaper or hair razor is used to texturize and shape hair.',distractors:['It is used to strop a conventional razor.','It is a clipper blade disinfectant.','It is a lather-heating device.']},
{cue:'honing procedure',correct:'Honing uses even diagonal strokes on both sides with pressure gradually reduced.',distractors:['Honing uses one heavy stroke on one side only.','Honing reverses direction by rolling on the cutting edge.','Honing is the same as disinfecting the razor.']},
{cue:'stropping procedure',correct:'Stropping uses even strokes and reverses direction by rolling the razor on its back.',distractors:['Stropping rolls the razor over the cutting edge.','Stropping removes metal with a hone.','Stropping works only one side of the blade.']},
]},
{name:'Thermal & Electrical Tools',facts:[
{cue:'Marcel iron',correct:'A Marcel iron is manually controlled and requires deliberate pressure and rotation.',distractors:['A Marcel iron is an automatic clipper attachment.','A Marcel iron is used to hone razors.','A Marcel iron is a disposable neck barrier.']},
{cue:'thermal heat check',correct:'Verify a safe working temperature before client contact.',distractors:['Always begin at maximum heat.','Touch the scalp to test the temperature.','Skip heat testing if the tool was used earlier.']},
{cue:'pressing comb safety',correct:'Keep a metal pressing comb from contacting the scalp.',distractors:['Pressing combs should rest on the scalp for control.','Only wooden combs can burn the scalp.','Pressing combs are used to remove hair clippings.']},
{cue:'blowdryer attachments',correct:'A diffuser disperses airflow for textured or curly hair.',distractors:['A concentrator disperses air broadly for curls.','A diffuser is a razor attachment.','A pick nozzle is used to hone shears.']},
{cue:'thermal manipulation sequence',correct:'Prepare and section, verify heat, control the tool, protect the scalp, and move consistently.',distractors:['Heat first, then section after scalp contact.','Hold the tool stationary until hair smokes.','Skip temperature control if heat protectant is used.']},
]},
{name:'Equipment, Supplies & Tool Safety',facts:[
{cue:'barber chair and barriers',correct:'The chair supports client positioning, while capes and neck strips provide service barriers.',distractors:['The chair disinfects implements.','Neck strips sharpen razors.','Capes adjust clipper length.']},
{cue:'hot towel and lather equipment',correct:'A hot-towel cabinet warms towels and a latherizer prepares shaving lather.',distractors:['A latherizer sharpens razors.','A hot-towel cabinet stores dirty shears.','Both tools are clipper motors.']},
{cue:'electric massager',correct:'An electric massager provides taught facial, scalp, or shoulder massage where permitted.',distractors:['It is used to set shear tension.','It replaces a blowdryer.','It is a razor-stropping tool.']},
{cue:'hair clipping removal',correct:'Use a clean folded towel, disposable paper neck strip, or maintained vacuum method.',distractors:['Use an unclean neck duster between clients.','Blow clippings into the air.','Use a contaminated cape to wipe the neck.']},
{cue:'towel hand wrap',correct:'Wrap the hand with clean material while keeping enough finger control for the service.',distractors:['Wrap the cutting edge of a razor inside the towel.','Reuse a damp wrap between clients.','Cover the hand so tightly that finger control is lost.']},
]},
]

const stems=[
(c:string)=>`Which statement BEST applies to ${c}?`,
(c:string)=>`A student is reviewing ${c}. Which correction is MOST accurate?`,
(c:string)=>`On a difficult Chapter 5 item about ${c}, which choice should remain after eliminating the inaccurate options?`,
]
function rotate(correct:string,distractors:readonly string[],i:number){
 const p=i%4; const a=[...distractors]; a.splice(p,0,correct); return {a,correct:['a','b','c','d'][p] as 'a'|'b'|'c'|'d'}
}
const questions:QuizQuestion[]=[]
let sequence=51
for(const family of families){
 for(let variant=0;variant<3;variant++){
  for(const fact of family.facts){
   const r=rotate(fact.correct,fact.distractors,sequence)
   questions.push({
    id:`qq-5-${String(sequence).padStart(3,'0')}`,
    quiz_id:'quiz-5',
    question:stems[variant](fact.cue),
    answer_a:r.a[0],answer_b:r.a[1],answer_c:r.a[2],answer_d:r.a[3],
    correct_answer:r.correct,
    explanation:`Read carefully. Identify the keyword or service condition. Eliminate choices that conflict with Chapter 5 tool purpose, anatomy, or procedure. Apply safety/procedure logic when relevant. Make the best remaining choice: ${fact.correct}`,
    difficulty:'hard',
    order_index:sequence,
   })
   sequence++
  }
 }
}
export const chapter5ReassessmentQuestions:QuizQuestion[]=questions
if(chapter5ReassessmentQuestions.length!==90) throw new Error(`Chapter 5 reassessment reserve must contain 90 questions; got ${chapter5ReassessmentQuestions.length}`)
