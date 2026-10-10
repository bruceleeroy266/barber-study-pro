// READING-2 isolated prototype, no production integration or writes.
export const IDLE_MS = 90_000
export const TICK_CAP_MS = 15_000
export class ReadingEngagement {
  constructor(studentId, chapterId = 'ch-1') {
    if (!studentId || chapterId !== 'ch-1') throw Error('Chapter 1 QA only')
    Object.assign(this, { studentId, chapterId, visible:true, lastAt:null,
      lastSignal:null, accountedAt:null, previousY:null, estimatedMs:0, depth:0, interactions:0 })
  }
  validate(at) {
    if (!Number.isFinite(at) || (this.lastAt !== null && at < this.lastAt)) throw Error('Invalid timestamp')
    this.lastAt = at
  }
  accrue(at) {
    if (!this.visible || this.lastSignal === null || this.accountedAt === null) return
    const boundary = Math.min(at, this.lastSignal + IDLE_MS)
    this.estimatedMs += Math.min(TICK_CAP_MS, Math.max(0, boundary - this.accountedAt))
    this.accountedAt = boundary
  }
  scroll({at,y,scrollHeight,viewportHeight}) {
    this.validate(at)
    if (!this.visible || ![y,scrollHeight,viewportHeight].every(Number.isFinite)) return
    const range = Math.max(0,scrollHeight-viewportHeight)
    const pos = Math.max(0,Math.min(y,range))
    this.depth = Math.max(this.depth,range ? pos/range : 1)
    const delta = this.previousY === null ? 0 : Math.abs(pos-this.previousY)
    this.previousY = pos
    if (delta < 48) return
    this.signalAt(at)
  }
  signalAt(at) {
    this.accrue(at)
    this.interactions++
    this.lastSignal = at
    this.accountedAt = at
  }
  readerAction(at) { this.validate(at); if (this.visible) this.signalAt(at) }
  tick(at) { this.validate(at); this.accrue(at) }
  setVisible(at,visible) {
    this.validate(at)
    if (!visible) this.accrue(at)
    this.visible = !!visible
    if (!visible) { this.lastSignal=null; this.accountedAt=null }
  }
  snapshot() {
    return Object.freeze({ studentId:this.studentId,chapterId:this.chapterId,
      estimatedReadingSeconds:Math.floor(this.estimatedMs/1000),
      maxScrollDepthPercent:Math.round(this.depth*100),
      readingInteractions:this.interactions })
  }
}
// Memory-only persistence seam. Must be replaced with authenticated server-authoritative
// append-only reading events and read-back before any production authorization.
export class MemoryReadingRepository {
  constructor(){this.rows=new Map()}
  save(row) {
    if(row.chapterId!=='ch-1')throw Error('Chapter 1 only')
    const key=row.studentId+':'+row.chapterId, previous=this.rows.get(key)
    const next={...row,
      estimatedReadingSeconds:Math.max(previous?.estimatedReadingSeconds??0,row.estimatedReadingSeconds),
      maxScrollDepthPercent:Math.max(previous?.maxScrollDepthPercent??0,row.maxScrollDepthPercent),
      readingInteractions:Math.max(previous?.readingInteractions??0,row.readingInteractions)}
    this.rows.set(key,Object.freeze(next))
    return next
  }
  read(studentId,chapterId='ch-1'){return this.rows.get(studentId+':'+chapterId)??null}
}
