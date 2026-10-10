import test from 'node:test'
import assert from 'node:assert/strict'
import {ReadingEngagement,MemoryReadingRepository} from './engagement.mjs'
const make=()=>new ReadingEngagement('qa')
const scroll=(e,at,y)=>e.scroll({at,y,scrollHeight:2000,viewportHeight:500})
test('open alone counts nothing',()=>{const e=make();e.tick(0);e.tick(15000);assert.equal(e.snapshot().estimatedReadingSeconds,0)})
test('scroll depth and time are independent',()=>{const e=make();scroll(e,0,0);scroll(e,100,1500);assert.equal(e.snapshot().maxScrollDepthPercent,100);assert.equal(e.snapshot().estimatedReadingSeconds,0)})
test('reading interaction and 15-second tick counts',()=>{const e=make();e.readerAction(0);e.tick(15000);assert.equal(e.snapshot().estimatedReadingSeconds,15)})
test('90-second idle stops estimates',()=>{const e=make();e.readerAction(0);for(let t=15000;t<=300000;t+=15000)e.tick(t);assert.equal(e.snapshot().estimatedReadingSeconds,90)})
test('hidden tab stops estimates',()=>{const e=make();e.readerAction(0);e.tick(15000);e.setVisible(20000,false);e.tick(60000);e.setVisible(70000,true);e.tick(85000);assert.equal(e.snapshot().estimatedReadingSeconds,20)})
test('delayed tick cannot manufacture large time',()=>{const e=make();e.readerAction(0);e.tick(80000);assert.equal(e.snapshot().estimatedReadingSeconds,15)})
test('read-back persistence seam is idempotent',()=>{const e=make(),db=new MemoryReadingRepository();e.readerAction(0);e.tick(15000);const row=db.save(e.snapshot());assert.deepEqual(db.read('qa'),row);assert.deepEqual(db.save(row),row)})
test('isolated analytics have no hours or grading fields',()=>{const keys=Object.keys(make().snapshot()).join(' ');for(const name of ['grade','attendance','mastery','official','studySeconds'])assert.equal(keys.includes(name),false)})
test('Chapter 1 only',()=>assert.throws(()=>new ReadingEngagement('qa','ch-2')))
test('monotonic timestamp validation',()=>{const e=make();e.readerAction(20);assert.throws(()=>e.tick(19))})
