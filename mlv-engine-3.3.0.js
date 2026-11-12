/*! mlv-engine 3.3.0 — map-location-video v3. Icon Maki (CC0, Mapbox). Dựa trên skill map-location-video của mktvantamland.
 * Logo AVI Realty: tài sản thương hiệu của AVI Realty, chỉ dùng cho nội dung của AVI Realty.
 * Bundled: mp4-muxer 5.2.2 (Copyright (c) 2023 Vanilagy), webm-muxer 5.1.4 (Copyright (c) 2022 Vanilagy), MIT License:
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(()=>{var ys=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},h=(e,t,i)=>(ys(e,t,"read from private field"),i?i.call(e):t.get(e)),V=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},oe=(e,t,i,n)=>(ys(e,t,"write to private field"),n?n.call(e,i):t.set(e,i),i),Hn=(e,t,i,n)=>({set _(a){oe(e,t,a,i)},get _(){return h(e,t,n)}}),j=(e,t,i)=>(ys(e,t,"access private method"),i),G=new Uint8Array(8),Ee=new DataView(G.buffer),ne=e=>[(e%256+256)%256],Q=e=>(Ee.setUint16(0,e,!1),[G[0],G[1]]),jn=e=>(Ee.setInt16(0,e,!1),[G[0],G[1]]),_a=e=>(Ee.setUint32(0,e,!1),[G[1],G[2],G[3]]),A=e=>(Ee.setUint32(0,e,!1),[G[0],G[1],G[2],G[3]]),Gn=e=>(Ee.setInt32(0,e,!1),[G[0],G[1],G[2],G[3]]),et=e=>(Ee.setUint32(0,Math.floor(e/2**32),!1),Ee.setUint32(4,e,!1),[G[0],G[1],G[2],G[3],G[4],G[5],G[6],G[7]]),bs=e=>(Ee.setInt16(0,2**8*e,!1),[G[0],G[1]]),ke=e=>(Ee.setInt32(0,2**16*e,!1),[G[0],G[1],G[2],G[3]]),ls=e=>(Ee.setInt32(0,2**30*e,!1),[G[0],G[1],G[2],G[3]]),be=(e,t=!1)=>{let i=Array(e.length).fill(null).map((n,a)=>e.charCodeAt(a));return t&&i.push(0),i},_i=e=>e&&e[e.length-1],vs=e=>{let t;for(let i of e)(!t||i.presentationTimestamp>t.presentationTimestamp)&&(t=i);return t},Me=(e,t,i=!0)=>{let n=e*t;return i?Math.round(n):n},Aa=e=>{let t=e*(Math.PI/180),i=Math.cos(t),n=Math.sin(t);return[i,n,0,-n,i,0,0,0,1]},Ba=Aa(0),Ia=e=>[ke(e[0]),ke(e[1]),ls(e[2]),ke(e[3]),ke(e[4]),ls(e[5]),ke(e[6]),ke(e[7]),ls(e[8])],Nt=e=>!e||typeof e!="object"?e:Array.isArray(e)?e.map(Nt):Object.fromEntries(Object.entries(e).map(([t,i])=>[t,Nt(i)])),mt=e=>e>=0&&e<2**32,se=(e,t,i)=>({type:e,contents:t&&new Uint8Array(t.flat(10)),children:i}),Z=(e,t,i,n,a)=>se(e,[ne(t),_a(i),n??[]],a),qn=e=>{let t=512;return e.fragmented?se("ftyp",[be("iso5"),A(t),be("iso5"),be("iso6"),be("mp41")]):se("ftyp",[be("isom"),A(t),be("isom"),e.holdsAvc?be("avc1"):[],be("mp41")])},hs=e=>({type:"mdat",largeSize:e}),Kn=e=>({type:"free",size:e}),Ci=(e,t,i=!1)=>se("moov",null,[Qn(t,e),...e.map(n=>Yn(n,t)),i?Er(e):null]),Qn=(e,t)=>{let i=Me(Math.max(0,...t.filter(f=>f.samples.length>0).map(f=>{let d=vs(f.samples);return d.presentationTimestamp+d.duration})),cs),n=Math.max(...t.map(f=>f.id))+1,a=!mt(e)||!mt(i),o=a?et:A;return Z("mvhd",+a,0,[o(e),o(e),A(cs),o(i),ke(1),bs(1),Array(10).fill(0),Ia(Ba),Array(24).fill(0),A(n)])},Yn=(e,t)=>se("trak",null,[Xn(e,t),Jn(e,t)]),Xn=(e,t)=>{let i=vs(e.samples),n=Me(i?i.presentationTimestamp+i.duration:0,cs),a=!mt(t)||!mt(n),o=a?et:A,f;return e.info.type==="video"?f=typeof e.info.rotation=="number"?Aa(e.info.rotation):e.info.rotation:f=Ba,Z("tkhd",+a,3,[o(t),o(t),A(e.id),A(0),o(n),Array(8).fill(0),Q(0),Q(0),bs(e.info.type==="audio"?1:0),Q(0),Ia(f),ke(e.info.type==="video"?e.info.width:0),ke(e.info.type==="video"?e.info.height:0)])},Jn=(e,t)=>se("mdia",null,[Zn(e,t),er(e.info.type==="video"?"vide":"soun"),tr(e)]),Zn=(e,t)=>{let i=vs(e.samples),n=Me(i?i.presentationTimestamp+i.duration:0,e.timescale),a=!mt(t)||!mt(n),o=a?et:A;return Z("mdhd",+a,0,[o(t),o(t),A(e.timescale),o(n),Q(21956),Q(0)])},er=e=>Z("hdlr",0,0,[be("mhlr"),be(e),A(0),A(0),A(0),be("mp4-muxer-hdlr",!0)]),tr=e=>se("minf",null,[e.info.type==="video"?ir():sr(),ar(),or(e)]),ir=()=>Z("vmhd",0,1,[Q(0),Q(0),Q(0),Q(0)]),sr=()=>Z("smhd",0,0,[Q(0),Q(0)]),ar=()=>se("dinf",null,[nr()]),nr=()=>Z("dref",0,0,[A(1)],[rr()]),rr=()=>Z("url ",0,1),or=e=>{let t=e.compositionTimeOffsetTable.length>1||e.compositionTimeOffsetTable.some(i=>i.sampleCompositionTimeOffset!==0);return se("stbl",null,[lr(e),Tr(e),Sr(e),Cr(e),xr(e),kr(e),t?Mr(e):null])},lr=e=>Z("stsd",0,0,[A(1)],[e.info.type==="video"?hr(Or[e.info.codec],e):yr(Pr[e.info.codec],e)]),hr=(e,t)=>se(e,[Array(6).fill(0),Q(1),Q(0),Q(0),Array(12).fill(0),Q(t.info.width),Q(t.info.height),A(4718592),A(4718592),A(0),Q(1),Array(32).fill(0),Q(24),jn(65535)],[Nr[t.info.codec](t),t.info.decoderConfig.colorSpace?ur(t):null]),fr={bt709:1,bt470bg:5,smpte170m:6},dr={bt709:1,smpte170m:6,"iec61966-2-1":13},cr={rgb:0,bt709:1,bt470bg:5,smpte170m:6},ur=e=>se("colr",[be("nclx"),Q(fr[e.info.decoderConfig.colorSpace.primaries]),Q(dr[e.info.decoderConfig.colorSpace.transfer]),Q(cr[e.info.decoderConfig.colorSpace.matrix]),ne((e.info.decoderConfig.colorSpace.fullRange?1:0)<<7)]),mr=e=>e.info.decoderConfig&&se("avcC",[...new Uint8Array(e.info.decoderConfig.description)]),pr=e=>e.info.decoderConfig&&se("hvcC",[...new Uint8Array(e.info.decoderConfig.description)]),wr=e=>{if(!e.info.decoderConfig)return null;let t=e.info.decoderConfig;if(!t.colorSpace)throw new Error("'colorSpace' is required in the decoder config for VP9.");let i=t.codec.split("."),n=Number(i[1]),a=Number(i[2]),d=(Number(i[3])<<4)+(0<<1)+Number(t.colorSpace.fullRange);return Z("vpcC",1,0,[ne(n),ne(a),ne(d),ne(2),ne(2),ne(2),Q(0)])},gr=()=>{let i=(1<<7)+1;return se("av1C",[i,0,0,0])},yr=(e,t)=>se(e,[Array(6).fill(0),Q(1),Q(0),Q(0),A(0),Q(t.info.numberOfChannels),Q(16),Q(0),Q(0),ke(t.info.sampleRate)],[Dr[t.info.codec](t)]),br=e=>{let t=new Uint8Array(e.info.decoderConfig.description);return Z("esds",0,0,[A(58753152),ne(32+t.byteLength),Q(1),ne(0),A(75530368),ne(18+t.byteLength),ne(64),ne(21),_a(0),A(130071),A(130071),A(92307584),ne(t.byteLength),...t,A(109084800),ne(1),ne(2)])},vr=e=>{let t=3840,i=0,n=e.info.decoderConfig?.description;if(n){if(n.byteLength<18)throw new TypeError("Invalid decoder description provided for Opus; must be at least 18 bytes long.");let a=ArrayBuffer.isView(n)?new DataView(n.buffer,n.byteOffset,n.byteLength):new DataView(n);t=a.getUint16(10,!0),i=a.getInt16(14,!0)}return se("dOps",[ne(0),ne(e.info.numberOfChannels),Q(t),A(e.info.sampleRate),bs(i),ne(0)])},Tr=e=>Z("stts",0,0,[A(e.timeToSampleTable.length),e.timeToSampleTable.map(t=>[A(t.sampleCount),A(t.sampleDelta)])]),Sr=e=>{if(e.samples.every(i=>i.type==="key"))return null;let t=[...e.samples.entries()].filter(([,i])=>i.type==="key");return Z("stss",0,0,[A(t.length),t.map(([i])=>A(i+1))])},Cr=e=>Z("stsc",0,0,[A(e.compactlyCodedChunkTable.length),e.compactlyCodedChunkTable.map(t=>[A(t.firstChunk),A(t.samplesPerChunk),A(1)])]),xr=e=>Z("stsz",0,0,[A(0),A(e.samples.length),e.samples.map(t=>A(t.size))]),kr=e=>e.finalizedChunks.length>0&&_i(e.finalizedChunks).offset>=2**32?Z("co64",0,0,[A(e.finalizedChunks.length),e.finalizedChunks.map(t=>et(t.offset))]):Z("stco",0,0,[A(e.finalizedChunks.length),e.finalizedChunks.map(t=>A(t.offset))]),Mr=e=>Z("ctts",0,0,[A(e.compositionTimeOffsetTable.length),e.compositionTimeOffsetTable.map(t=>[A(t.sampleCount),A(t.sampleCompositionTimeOffset)])]),Er=e=>se("mvex",null,e.map(_r)),_r=e=>Z("trex",0,0,[A(e.id),A(1),A(0),A(0),A(0)]),Ea=(e,t)=>se("moof",null,[Ar(e),...t.map(Br)]),Ar=e=>Z("mfhd",0,0,[A(e)]),Wa=e=>{let t=0,i=0,n=0,a=0,o=e.type==="delta";return i|=+o,o?t|=1:t|=2,t<<24|i<<16|n<<8|a},Br=e=>se("traf",null,[Ir(e),Wr(e),zr(e)]),Ir=e=>{let t=0;t|=8,t|=16,t|=32,t|=131072;let i=e.currentChunk.samples[1]??e.currentChunk.samples[0],n={duration:i.timescaleUnitsToNextSample,size:i.size,flags:Wa(i)};return Z("tfhd",0,t,[A(e.id),A(n.duration),A(n.size),A(n.flags)])},Wr=e=>Z("tfdt",1,0,[et(Me(e.currentChunk.startTimestamp,e.timescale))]),zr=e=>{let t=e.currentChunk.samples.map(k=>k.timescaleUnitsToNextSample),i=e.currentChunk.samples.map(k=>k.size),n=e.currentChunk.samples.map(Wa),a=e.currentChunk.samples.map(k=>Me(k.presentationTimestamp-k.decodeTimestamp,e.timescale)),o=new Set(t),f=new Set(i),d=new Set(n),v=new Set(a),S=d.size===2&&n[0]!==n[1],u=o.size>1,b=f.size>1,x=!S&&d.size>1,T=v.size>1||[...v].some(k=>k!==0),O=0;return O|=1,O|=4*+S,O|=256*+u,O|=512*+b,O|=1024*+x,O|=2048*+T,Z("trun",1,O,[A(e.currentChunk.samples.length),A(e.currentChunk.offset-e.currentChunk.moofOffset||0),S?A(n[0]):[],e.currentChunk.samples.map((k,W)=>[u?A(t[W]):[],b?A(i[W]):[],x?A(n[W]):[],T?Gn(a[W]):[]])])},Ur=e=>se("mfra",null,[...e.map(Fr),Rr()]),Fr=(e,t)=>Z("tfra",1,0,[A(e.id),A(63),A(e.finalizedChunks.length),e.finalizedChunks.map(n=>[et(Me(n.startTimestamp,e.timescale)),et(n.moofOffset),A(t+1),A(1),A(1)])]),Rr=()=>Z("mfro",0,0,[A(0)]),Or={avc:"avc1",hevc:"hvc1",vp9:"vp09",av1:"av01"},Nr={avc:mr,hevc:pr,vp9:wr,av1:gr},Pr={aac:"mp4a",opus:"Opus"},Dr={aac:br,opus:vr};var Ui=class{},Ts=class extends Ui{constructor(){super(...arguments),this.buffer=null}},za=class extends Ui{constructor(e){if(super(),this.options=e,typeof e!="object")throw new TypeError("StreamTarget requires an options object to be passed to its constructor.");if(e.onData){if(typeof e.onData!="function")throw new TypeError("options.onData, when provided, must be a function.");if(e.onData.length<2)throw new TypeError("options.onData, when provided, must be a function that takes in at least two arguments (data and position). Ignoring the position argument, which specifies the byte offset at which the data is to be written, can lead to broken outputs.")}if(e.chunked!==void 0&&typeof e.chunked!="boolean")throw new TypeError("options.chunked, when provided, must be a boolean.");if(e.chunkSize!==void 0&&(!Number.isInteger(e.chunkSize)||e.chunkSize<1024))throw new TypeError("options.chunkSize, when provided, must be an integer and not smaller than 1024.")}},Vr=class extends Ui{constructor(e,t){if(super(),this.stream=e,this.options=t,!(e instanceof FileSystemWritableFileStream))throw new TypeError("FileSystemWritableFileStreamTarget requires a FileSystemWritableFileStream instance.");if(t!==void 0&&typeof t!="object")throw new TypeError("FileSystemWritableFileStreamTarget's options, when provided, must be an object.");if(t&&t.chunkSize!==void 0&&(!Number.isInteger(t.chunkSize)||t.chunkSize<=0))throw new TypeError("options.chunkSize, when provided, must be a positive integer")}},Qe,dt,Ua=class{constructor(){this.pos=0,V(this,Qe,new Uint8Array(8)),V(this,dt,new DataView(h(this,Qe).buffer)),this.offsets=new WeakMap}seek(e){this.pos=e}writeU32(e){h(this,dt).setUint32(0,e,!1),this.write(h(this,Qe).subarray(0,4))}writeU64(e){h(this,dt).setUint32(0,Math.floor(e/2**32),!1),h(this,dt).setUint32(4,e,!1),this.write(h(this,Qe).subarray(0,8))}writeAscii(e){for(let t=0;t<e.length;t++)h(this,dt).setUint8(t%8,e.charCodeAt(t)),t%8===7&&this.write(h(this,Qe));e.length%8!==0&&this.write(h(this,Qe).subarray(0,e.length%8))}writeBox(e){if(this.offsets.set(e,this.pos),e.contents&&!e.children)this.writeBoxHeader(e,e.size??e.contents.byteLength+8),this.write(e.contents);else{let t=this.pos;if(this.writeBoxHeader(e,0),e.contents&&this.write(e.contents),e.children)for(let a of e.children)a&&this.writeBox(a);let i=this.pos,n=e.size??i-t;this.seek(t),this.writeBoxHeader(e,n),this.seek(i)}}writeBoxHeader(e,t){this.writeU32(e.largeSize?1:t),this.writeAscii(e.type),e.largeSize&&this.writeU64(t)}measureBoxHeader(e){return 8+(e.largeSize?8:0)}patchBox(e){let t=this.pos;this.seek(this.offsets.get(e)),this.writeBox(e),this.seek(t)}measureBox(e){if(e.contents&&!e.children)return this.measureBoxHeader(e)+e.contents.byteLength;{let t=this.measureBoxHeader(e);if(e.contents&&(t+=e.contents.byteLength),e.children)for(let i of e.children)i&&(t+=this.measureBox(i));return t}}};Qe=new WeakMap;dt=new WeakMap;var xi,Ze,$t,Rt,ki,fs,Lr=class extends Ua{constructor(e){super(),V(this,ki),V(this,xi,void 0),V(this,Ze,new ArrayBuffer(2**16)),V(this,$t,new Uint8Array(h(this,Ze))),V(this,Rt,0),oe(this,xi,e)}write(e){j(this,ki,fs).call(this,this.pos+e.byteLength),h(this,$t).set(e,this.pos),this.pos+=e.byteLength,oe(this,Rt,Math.max(h(this,Rt),this.pos))}finalize(){j(this,ki,fs).call(this,this.pos),h(this,xi).buffer=h(this,Ze).slice(0,Math.max(h(this,Rt),this.pos))}};xi=new WeakMap;Ze=new WeakMap;$t=new WeakMap;Rt=new WeakMap;ki=new WeakSet;fs=function(e){let t=h(this,Ze).byteLength;for(;t<e;)t*=2;if(t===h(this,Ze).byteLength)return;let i=new ArrayBuffer(t),n=new Uint8Array(i);n.set(h(this,$t),0),oe(this,Ze,i),oe(this,$t,n)};var $r=2**24,Hr=2,Pt,Ye,Ot,Re,we,Ai,ds,Ss,Fa,Cs,Ra,Dt,Bi,xs=class extends Ua{constructor(e){super(),V(this,Ai),V(this,Ss),V(this,Cs),V(this,Dt),V(this,Pt,void 0),V(this,Ye,[]),V(this,Ot,void 0),V(this,Re,void 0),V(this,we,[]),oe(this,Pt,e),oe(this,Ot,e.options?.chunked??!1),oe(this,Re,e.options?.chunkSize??$r)}write(e){h(this,Ye).push({data:e.slice(),start:this.pos}),this.pos+=e.byteLength}flush(){if(h(this,Ye).length===0)return;let e=[],t=[...h(this,Ye)].sort((i,n)=>i.start-n.start);e.push({start:t[0].start,size:t[0].data.byteLength});for(let i=1;i<t.length;i++){let n=e[e.length-1],a=t[i];a.start<=n.start+n.size?n.size=Math.max(n.size,a.start+a.data.byteLength-n.start):e.push({start:a.start,size:a.data.byteLength})}for(let i of e){i.data=new Uint8Array(i.size);for(let n of h(this,Ye))i.start<=n.start&&n.start<i.start+i.size&&i.data.set(n.data,n.start-i.start);h(this,Ot)?(j(this,Ai,ds).call(this,i.data,i.start),j(this,Dt,Bi).call(this)):h(this,Pt).options.onData?.(i.data,i.start)}h(this,Ye).length=0}finalize(){h(this,Ot)&&j(this,Dt,Bi).call(this,!0)}};Pt=new WeakMap;Ye=new WeakMap;Ot=new WeakMap;Re=new WeakMap;we=new WeakMap;Ai=new WeakSet;ds=function(e,t){let i=h(this,we).findIndex(d=>d.start<=t&&t<d.start+h(this,Re));i===-1&&(i=j(this,Cs,Ra).call(this,t));let n=h(this,we)[i],a=t-n.start,o=e.subarray(0,Math.min(h(this,Re)-a,e.byteLength));n.data.set(o,a);let f={start:a,end:a+o.byteLength};if(j(this,Ss,Fa).call(this,n,f),n.written[0].start===0&&n.written[0].end===h(this,Re)&&(n.shouldFlush=!0),h(this,we).length>Hr){for(let d=0;d<h(this,we).length-1;d++)h(this,we)[d].shouldFlush=!0;j(this,Dt,Bi).call(this)}o.byteLength<e.byteLength&&j(this,Ai,ds).call(this,e.subarray(o.byteLength),t+o.byteLength)};Ss=new WeakSet;Fa=function(e,t){let i=0,n=e.written.length-1,a=-1;for(;i<=n;){let o=Math.floor(i+(n-i+1)/2);e.written[o].start<=t.start?(i=o+1,a=o):n=o-1}for(e.written.splice(a+1,0,t),(a===-1||e.written[a].end<t.start)&&a++;a<e.written.length-1&&e.written[a].end>=e.written[a+1].start;)e.written[a].end=Math.max(e.written[a].end,e.written[a+1].end),e.written.splice(a+1,1)};Cs=new WeakSet;Ra=function(e){let i={start:Math.floor(e/h(this,Re))*h(this,Re),data:new Uint8Array(h(this,Re)),written:[],shouldFlush:!1};return h(this,we).push(i),h(this,we).sort((n,a)=>n.start-a.start),h(this,we).indexOf(i)};Dt=new WeakSet;Bi=function(e=!1){for(let t=0;t<h(this,we).length;t++){let i=h(this,we)[t];if(!(!i.shouldFlush&&!e)){for(let n of i.written)h(this,Pt).options.onData?.(i.data.subarray(n.start,n.end),i.start+n.start);h(this,we).splice(t--,1)}}};var jr=class extends xs{constructor(e){super(new za({onData:(t,i)=>e.stream.write({type:"write",data:t,position:i}),chunked:!0,chunkSize:e.options?.chunkSize}))}},cs=1e3,Gr=["avc","hevc","vp9","av1"],qr=["aac","opus"],Kr=2082844800,Qr=["strict","offset","cross-track-offset"],F,P,Ii,pe,le,re,ct,ut,ks,Xe,Je,Vt,us,Oa,ms,Na,Ms,Pa,ps,Da,Es,Va,Mi,ws,xe,Fe,_s,La,Lt,Wi,zi,As,pt,Ht,Ei,gs,$a=class{constructor(e){if(V(this,us),V(this,ms),V(this,Ms),V(this,ps),V(this,Es),V(this,Mi),V(this,xe),V(this,_s),V(this,Lt),V(this,zi),V(this,pt),V(this,Ei),V(this,F,void 0),V(this,P,void 0),V(this,Ii,void 0),V(this,pe,void 0),V(this,le,null),V(this,re,null),V(this,ct,Math.floor(Date.now()/1e3)+Kr),V(this,ut,[]),V(this,ks,1),V(this,Xe,[]),V(this,Je,[]),V(this,Vt,!1),j(this,us,Oa).call(this,e),e.video=Nt(e.video),e.audio=Nt(e.audio),e.fastStart=Nt(e.fastStart),this.target=e.target,oe(this,F,{firstTimestampBehavior:"strict",...e}),e.target instanceof Ts)oe(this,P,new Lr(e.target));else if(e.target instanceof za)oe(this,P,new xs(e.target));else if(e.target instanceof Vr)oe(this,P,new jr(e.target));else throw new Error(`Invalid target: ${e.target}`);j(this,ps,Da).call(this),j(this,ms,Na).call(this)}addVideoChunk(e,t,i,n){if(!(e instanceof EncodedVideoChunk))throw new TypeError("addVideoChunk's first argument (sample) must be of type EncodedVideoChunk.");if(t&&typeof t!="object")throw new TypeError("addVideoChunk's second argument (meta), when provided, must be an object.");if(i!==void 0&&(!Number.isFinite(i)||i<0))throw new TypeError("addVideoChunk's third argument (timestamp), when provided, must be a non-negative real number.");if(n!==void 0&&!Number.isFinite(n))throw new TypeError("addVideoChunk's fourth argument (compositionTimeOffset), when provided, must be a real number.");let a=new Uint8Array(e.byteLength);e.copyTo(a),this.addVideoChunkRaw(a,e.type,i??e.timestamp,e.duration,t,n)}addVideoChunkRaw(e,t,i,n,a,o){if(!(e instanceof Uint8Array))throw new TypeError("addVideoChunkRaw's first argument (data) must be an instance of Uint8Array.");if(t!=="key"&&t!=="delta")throw new TypeError("addVideoChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(i)||i<0)throw new TypeError("addVideoChunkRaw's third argument (timestamp) must be a non-negative real number.");if(!Number.isFinite(n)||n<0)throw new TypeError("addVideoChunkRaw's fourth argument (duration) must be a non-negative real number.");if(a&&typeof a!="object")throw new TypeError("addVideoChunkRaw's fifth argument (meta), when provided, must be an object.");if(o!==void 0&&!Number.isFinite(o))throw new TypeError("addVideoChunkRaw's sixth argument (compositionTimeOffset), when provided, must be a real number.");if(j(this,Ei,gs).call(this),!h(this,F).video)throw new Error("No video track declared.");if(typeof h(this,F).fastStart=="object"&&h(this,le).samples.length===h(this,F).fastStart.expectedVideoChunks)throw new Error(`Cannot add more video chunks than specified in 'fastStart' (${h(this,F).fastStart.expectedVideoChunks}).`);let f=j(this,Mi,ws).call(this,h(this,le),e,t,i,n,a,o);if(h(this,F).fastStart==="fragmented"&&h(this,re)){for(;h(this,Je).length>0&&h(this,Je)[0].decodeTimestamp<=f.decodeTimestamp;){let d=h(this,Je).shift();j(this,xe,Fe).call(this,h(this,re),d)}f.decodeTimestamp<=h(this,re).lastDecodeTimestamp?j(this,xe,Fe).call(this,h(this,le),f):h(this,Xe).push(f)}else j(this,xe,Fe).call(this,h(this,le),f)}addAudioChunk(e,t,i){if(!(e instanceof EncodedAudioChunk))throw new TypeError("addAudioChunk's first argument (sample) must be of type EncodedAudioChunk.");if(t&&typeof t!="object")throw new TypeError("addAudioChunk's second argument (meta), when provided, must be an object.");if(i!==void 0&&(!Number.isFinite(i)||i<0))throw new TypeError("addAudioChunk's third argument (timestamp), when provided, must be a non-negative real number.");let n=new Uint8Array(e.byteLength);e.copyTo(n),this.addAudioChunkRaw(n,e.type,i??e.timestamp,e.duration,t)}addAudioChunkRaw(e,t,i,n,a){if(!(e instanceof Uint8Array))throw new TypeError("addAudioChunkRaw's first argument (data) must be an instance of Uint8Array.");if(t!=="key"&&t!=="delta")throw new TypeError("addAudioChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(i)||i<0)throw new TypeError("addAudioChunkRaw's third argument (timestamp) must be a non-negative real number.");if(!Number.isFinite(n)||n<0)throw new TypeError("addAudioChunkRaw's fourth argument (duration) must be a non-negative real number.");if(a&&typeof a!="object")throw new TypeError("addAudioChunkRaw's fifth argument (meta), when provided, must be an object.");if(j(this,Ei,gs).call(this),!h(this,F).audio)throw new Error("No audio track declared.");if(typeof h(this,F).fastStart=="object"&&h(this,re).samples.length===h(this,F).fastStart.expectedAudioChunks)throw new Error(`Cannot add more audio chunks than specified in 'fastStart' (${h(this,F).fastStart.expectedAudioChunks}).`);let o=j(this,Mi,ws).call(this,h(this,re),e,t,i,n,a);if(h(this,F).fastStart==="fragmented"&&h(this,le)){for(;h(this,Xe).length>0&&h(this,Xe)[0].decodeTimestamp<=o.decodeTimestamp;){let f=h(this,Xe).shift();j(this,xe,Fe).call(this,h(this,le),f)}o.decodeTimestamp<=h(this,le).lastDecodeTimestamp?j(this,xe,Fe).call(this,h(this,re),o):h(this,Je).push(o)}else j(this,xe,Fe).call(this,h(this,re),o)}finalize(){if(h(this,Vt))throw new Error("Cannot finalize a muxer more than once.");if(h(this,F).fastStart==="fragmented"){for(let t of h(this,Xe))j(this,xe,Fe).call(this,h(this,le),t);for(let t of h(this,Je))j(this,xe,Fe).call(this,h(this,re),t);j(this,zi,As).call(this,!1)}else h(this,le)&&j(this,Lt,Wi).call(this,h(this,le)),h(this,re)&&j(this,Lt,Wi).call(this,h(this,re));let e=[h(this,le),h(this,re)].filter(Boolean);if(h(this,F).fastStart==="in-memory"){let t;for(let n=0;n<2;n++){let a=Ci(e,h(this,ct)),o=h(this,P).measureBox(a);t=h(this,P).measureBox(h(this,pe));let f=h(this,P).pos+o+t;for(let d of h(this,ut)){d.offset=f;for(let{data:v}of d.samples)f+=v.byteLength,t+=v.byteLength}if(f<2**32)break;t>=2**32&&(h(this,pe).largeSize=!0)}let i=Ci(e,h(this,ct));h(this,P).writeBox(i),h(this,pe).size=t,h(this,P).writeBox(h(this,pe));for(let n of h(this,ut))for(let a of n.samples)h(this,P).write(a.data),a.data=null}else if(h(this,F).fastStart==="fragmented"){let t=h(this,P).pos,i=Ur(e);h(this,P).writeBox(i);let n=h(this,P).pos-t;h(this,P).seek(h(this,P).pos-4),h(this,P).writeU32(n)}else{let t=h(this,P).offsets.get(h(this,pe)),i=h(this,P).pos-t;h(this,pe).size=i,h(this,pe).largeSize=i>=2**32,h(this,P).patchBox(h(this,pe));let n=Ci(e,h(this,ct));if(typeof h(this,F).fastStart=="object"){h(this,P).seek(h(this,Ii)),h(this,P).writeBox(n);let a=t-h(this,P).pos;h(this,P).writeBox(Kn(a))}else h(this,P).writeBox(n)}j(this,pt,Ht).call(this),h(this,P).finalize(),oe(this,Vt,!0)}};F=new WeakMap;P=new WeakMap;Ii=new WeakMap;pe=new WeakMap;le=new WeakMap;re=new WeakMap;ct=new WeakMap;ut=new WeakMap;ks=new WeakMap;Xe=new WeakMap;Je=new WeakMap;Vt=new WeakMap;us=new WeakSet;Oa=function(e){if(typeof e!="object")throw new TypeError("The muxer requires an options object to be passed to its constructor.");if(!(e.target instanceof Ui))throw new TypeError("The target must be provided and an instance of Target.");if(e.video){if(!Gr.includes(e.video.codec))throw new TypeError(`Unsupported video codec: ${e.video.codec}`);if(!Number.isInteger(e.video.width)||e.video.width<=0)throw new TypeError(`Invalid video width: ${e.video.width}. Must be a positive integer.`);if(!Number.isInteger(e.video.height)||e.video.height<=0)throw new TypeError(`Invalid video height: ${e.video.height}. Must be a positive integer.`);let t=e.video.rotation;if(typeof t=="number"&&![0,90,180,270].includes(t))throw new TypeError(`Invalid video rotation: ${t}. Has to be 0, 90, 180 or 270.`);if(Array.isArray(t)&&(t.length!==9||t.some(i=>typeof i!="number")))throw new TypeError(`Invalid video transformation matrix: ${t.join()}`);if(e.video.frameRate!==void 0&&(!Number.isInteger(e.video.frameRate)||e.video.frameRate<=0))throw new TypeError(`Invalid video frame rate: ${e.video.frameRate}. Must be a positive integer.`)}if(e.audio){if(!qr.includes(e.audio.codec))throw new TypeError(`Unsupported audio codec: ${e.audio.codec}`);if(!Number.isInteger(e.audio.numberOfChannels)||e.audio.numberOfChannels<=0)throw new TypeError(`Invalid number of audio channels: ${e.audio.numberOfChannels}. Must be a positive integer.`);if(!Number.isInteger(e.audio.sampleRate)||e.audio.sampleRate<=0)throw new TypeError(`Invalid audio sample rate: ${e.audio.sampleRate}. Must be a positive integer.`)}if(e.firstTimestampBehavior&&!Qr.includes(e.firstTimestampBehavior))throw new TypeError(`Invalid first timestamp behavior: ${e.firstTimestampBehavior}`);if(typeof e.fastStart=="object"){if(e.video){if(e.fastStart.expectedVideoChunks===void 0)throw new TypeError("'fastStart' is an object but is missing property 'expectedVideoChunks'.");if(!Number.isInteger(e.fastStart.expectedVideoChunks)||e.fastStart.expectedVideoChunks<0)throw new TypeError("'expectedVideoChunks' must be a non-negative integer.")}if(e.audio){if(e.fastStart.expectedAudioChunks===void 0)throw new TypeError("'fastStart' is an object but is missing property 'expectedAudioChunks'.");if(!Number.isInteger(e.fastStart.expectedAudioChunks)||e.fastStart.expectedAudioChunks<0)throw new TypeError("'expectedAudioChunks' must be a non-negative integer.")}}else if(![!1,"in-memory","fragmented"].includes(e.fastStart))throw new TypeError("'fastStart' option must be false, 'in-memory', 'fragmented' or an object.");if(e.minFragmentDuration!==void 0&&(!Number.isFinite(e.minFragmentDuration)||e.minFragmentDuration<0))throw new TypeError("'minFragmentDuration' must be a non-negative number.")};ms=new WeakSet;Na=function(){if(h(this,P).writeBox(qn({holdsAvc:h(this,F).video?.codec==="avc",fragmented:h(this,F).fastStart==="fragmented"})),oe(this,Ii,h(this,P).pos),h(this,F).fastStart==="in-memory")oe(this,pe,hs(!1));else if(h(this,F).fastStart!=="fragmented"){if(typeof h(this,F).fastStart=="object"){let e=j(this,Ms,Pa).call(this);h(this,P).seek(h(this,P).pos+e)}oe(this,pe,hs(!0)),h(this,P).writeBox(h(this,pe))}j(this,pt,Ht).call(this)};Ms=new WeakSet;Pa=function(){if(typeof h(this,F).fastStart!="object")return;let e=0,t=[h(this,F).fastStart.expectedVideoChunks,h(this,F).fastStart.expectedAudioChunks];for(let i of t)i&&(e+=8*Math.ceil(2/3*i),e+=4*i,e+=12*Math.ceil(2/3*i),e+=4*i,e+=8*i);return e+=4096,e};ps=new WeakSet;Da=function(){if(h(this,F).video&&oe(this,le,{id:1,info:{type:"video",codec:h(this,F).video.codec,width:h(this,F).video.width,height:h(this,F).video.height,rotation:h(this,F).video.rotation??0,decoderConfig:null},timescale:h(this,F).video.frameRate??57600,samples:[],finalizedChunks:[],currentChunk:null,firstDecodeTimestamp:void 0,lastDecodeTimestamp:-1,timeToSampleTable:[],compositionTimeOffsetTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),h(this,F).audio&&(oe(this,re,{id:h(this,F).video?2:1,info:{type:"audio",codec:h(this,F).audio.codec,numberOfChannels:h(this,F).audio.numberOfChannels,sampleRate:h(this,F).audio.sampleRate,decoderConfig:null},timescale:h(this,F).audio.sampleRate,samples:[],finalizedChunks:[],currentChunk:null,firstDecodeTimestamp:void 0,lastDecodeTimestamp:-1,timeToSampleTable:[],compositionTimeOffsetTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),h(this,F).audio.codec==="aac")){let e=j(this,Es,Va).call(this,2,h(this,F).audio.sampleRate,h(this,F).audio.numberOfChannels);h(this,re).info.decoderConfig={codec:h(this,F).audio.codec,description:e,numberOfChannels:h(this,F).audio.numberOfChannels,sampleRate:h(this,F).audio.sampleRate}}};Es=new WeakSet;Va=function(e,t,i){let a=[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350].indexOf(t),o=i,f="";f+=e.toString(2).padStart(5,"0"),f+=a.toString(2).padStart(4,"0"),a===15&&(f+=t.toString(2).padStart(24,"0")),f+=o.toString(2).padStart(4,"0");let d=Math.ceil(f.length/8)*8;f=f.padEnd(d,"0");let v=new Uint8Array(f.length/8);for(let S=0;S<f.length;S+=8)v[S/8]=parseInt(f.slice(S,S+8),2);return v};Mi=new WeakSet;ws=function(e,t,i,n,a,o,f){let d=n/1e6,v=(n-(f??0))/1e6,S=a/1e6,u=j(this,_s,La).call(this,d,v,e);return d=u.presentationTimestamp,v=u.decodeTimestamp,o?.decoderConfig&&(e.info.decoderConfig===null?e.info.decoderConfig=o.decoderConfig:Object.assign(e.info.decoderConfig,o.decoderConfig)),{presentationTimestamp:d,decodeTimestamp:v,duration:S,data:t,size:t.byteLength,type:i,timescaleUnitsToNextSample:Me(S,e.timescale)}};xe=new WeakSet;Fe=function(e,t){h(this,F).fastStart!=="fragmented"&&e.samples.push(t);let i=Me(t.presentationTimestamp-t.decodeTimestamp,e.timescale);if(e.lastTimescaleUnits!==null){let a=Me(t.decodeTimestamp,e.timescale,!1),o=Math.round(a-e.lastTimescaleUnits);if(e.lastTimescaleUnits+=o,e.lastSample.timescaleUnitsToNextSample=o,h(this,F).fastStart!=="fragmented"){let f=_i(e.timeToSampleTable);f.sampleCount===1?(f.sampleDelta=o,f.sampleCount++):f.sampleDelta===o?f.sampleCount++:(f.sampleCount--,e.timeToSampleTable.push({sampleCount:2,sampleDelta:o}));let d=_i(e.compositionTimeOffsetTable);d.sampleCompositionTimeOffset===i?d.sampleCount++:e.compositionTimeOffsetTable.push({sampleCount:1,sampleCompositionTimeOffset:i})}}else e.lastTimescaleUnits=0,h(this,F).fastStart!=="fragmented"&&(e.timeToSampleTable.push({sampleCount:1,sampleDelta:Me(t.duration,e.timescale)}),e.compositionTimeOffsetTable.push({sampleCount:1,sampleCompositionTimeOffset:i}));e.lastSample=t;let n=!1;if(!e.currentChunk)n=!0;else{let a=t.presentationTimestamp-e.currentChunk.startTimestamp;if(h(this,F).fastStart==="fragmented"){let o=h(this,le)??h(this,re),f=h(this,F).minFragmentDuration??1;e===o&&t.type==="key"&&a>=f&&(n=!0,j(this,zi,As).call(this))}else n=a>=.5}n&&(e.currentChunk&&j(this,Lt,Wi).call(this,e),e.currentChunk={startTimestamp:t.presentationTimestamp,samples:[]}),e.currentChunk.samples.push(t)};_s=new WeakSet;La=function(e,t,i){let n=h(this,F).firstTimestampBehavior==="strict",a=i.lastDecodeTimestamp===-1;if(n&&a&&t!==0)throw new Error(`The first chunk for your media track must have a timestamp of 0 (received DTS=${t}).Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of thedocument, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
`);if(h(this,F).firstTimestampBehavior==="offset"||h(this,F).firstTimestampBehavior==="cross-track-offset"){i.firstDecodeTimestamp===void 0&&(i.firstDecodeTimestamp=t);let f;h(this,F).firstTimestampBehavior==="offset"?f=i.firstDecodeTimestamp:f=Math.min(h(this,le)?.firstDecodeTimestamp??1/0,h(this,re)?.firstDecodeTimestamp??1/0),t-=f,e-=f}if(t<i.lastDecodeTimestamp)throw new Error(`Timestamps must be monotonically increasing (DTS went from ${i.lastDecodeTimestamp*1e6} to ${t*1e6}).`);return i.lastDecodeTimestamp=t,{presentationTimestamp:e,decodeTimestamp:t}};Lt=new WeakSet;Wi=function(e){if(h(this,F).fastStart==="fragmented")throw new Error("Can't finalize individual chunks if 'fastStart' is set to 'fragmented'.");if(e.currentChunk){if(e.finalizedChunks.push(e.currentChunk),h(this,ut).push(e.currentChunk),(e.compactlyCodedChunkTable.length===0||_i(e.compactlyCodedChunkTable).samplesPerChunk!==e.currentChunk.samples.length)&&e.compactlyCodedChunkTable.push({firstChunk:e.finalizedChunks.length,samplesPerChunk:e.currentChunk.samples.length}),h(this,F).fastStart==="in-memory"){e.currentChunk.offset=0;return}e.currentChunk.offset=h(this,P).pos;for(let t of e.currentChunk.samples)h(this,P).write(t.data),t.data=null;j(this,pt,Ht).call(this)}};zi=new WeakSet;As=function(e=!0){if(h(this,F).fastStart!=="fragmented")throw new Error("Can't finalize a fragment unless 'fastStart' is set to 'fragmented'.");let t=[h(this,le),h(this,re)].filter(d=>d&&d.currentChunk);if(t.length===0)return;let i=Hn(this,ks)._++;if(i===1){let d=Ci(t,h(this,ct),!0);h(this,P).writeBox(d)}let n=h(this,P).pos,a=Ea(i,t);h(this,P).writeBox(a);{let d=hs(!1),v=0;for(let u of t)for(let b of u.currentChunk.samples)v+=b.size;let S=h(this,P).measureBox(d)+v;S>=2**32&&(d.largeSize=!0,S=h(this,P).measureBox(d)+v),d.size=S,h(this,P).writeBox(d)}for(let d of t){d.currentChunk.offset=h(this,P).pos,d.currentChunk.moofOffset=n;for(let v of d.currentChunk.samples)h(this,P).write(v.data),v.data=null}let o=h(this,P).pos;h(this,P).seek(h(this,P).offsets.get(a));let f=Ea(i,t);h(this,P).writeBox(f),h(this,P).seek(o);for(let d of t)d.finalizedChunks.push(d.currentChunk),h(this,ut).push(d.currentChunk),d.currentChunk=null;e&&j(this,pt,Ht).call(this)};pt=new WeakSet;Ht=function(){h(this,P)instanceof xs&&h(this,P).flush()};Ei=new WeakSet;gs=function(){if(h(this,Vt))throw new Error("Cannot add new video or audio chunks after the file has been finalized.")};var Vs=(e,t,i)=>{if(!t.has(e))throw TypeError("Cannot "+i)},r=(e,t,i)=>(Vs(e,t,"read from private field"),i?i.call(e):t.get(e)),E=(e,t,i)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,i)},D=(e,t,i,n)=>(Vs(e,t,"write to private field"),n?n.call(e,i):t.set(e,i),i),B=(e,t,i)=>(Vs(e,t,"access private method"),i),ja=class{constructor(e){this.value=e}},Ls=class{constructor(e){this.value=e}},Ga=e=>e<256?1:e<65536?2:e<1<<24?3:e<2**32?4:e<2**40?5:6,Yr=e=>{if(e<127)return 1;if(e<16383)return 2;if(e<(1<<21)-1)return 3;if(e<(1<<28)-1)return 4;if(e<2**35-1)return 5;if(e<2**42-1)return 6;throw new Error("EBML VINT size not supported "+e)},wt=(e,t,i)=>{let n=0;for(let a=t;a<i;a++){let o=Math.floor(a/8),f=e[o],d=7-(a&7),v=(f&1<<d)>>d;n<<=1,n|=v}return n},Xr=(e,t,i,n)=>{for(let a=t;a<i;a++){let o=Math.floor(a/8),f=e[o],d=7-(a&7);f&=~(1<<d),f|=(n&1<<i-a-1)>>i-a-1<<d,e[o]=f}};var qi=class{},$s=class extends qi{constructor(){super(...arguments),this.buffer=null}},qa=class extends qi{constructor(e){if(super(),this.options=e,typeof e!="object")throw new TypeError("StreamTarget requires an options object to be passed to its constructor.");if(e.onData){if(typeof e.onData!="function")throw new TypeError("options.onData, when provided, must be a function.");if(e.onData.length<2)throw new TypeError("options.onData, when provided, must be a function that takes in at least two arguments (data and position). Ignoring the position argument, which specifies the byte offset at which the data is to be written, can lead to broken outputs.")}if(e.onHeader&&typeof e.onHeader!="function")throw new TypeError("options.onHeader, when provided, must be a function.");if(e.onCluster&&typeof e.onCluster!="function")throw new TypeError("options.onCluster, when provided, must be a function.");if(e.chunked!==void 0&&typeof e.chunked!="boolean")throw new TypeError("options.chunked, when provided, must be a boolean.");if(e.chunkSize!==void 0&&(!Number.isInteger(e.chunkSize)||e.chunkSize<1024))throw new TypeError("options.chunkSize, when provided, must be an integer and not smaller than 1024.")}},Jr=class extends qi{constructor(e,t){if(super(),this.stream=e,this.options=t,!(e instanceof FileSystemWritableFileStream))throw new TypeError("FileSystemWritableFileStreamTarget requires a FileSystemWritableFileStream instance.");if(t!==void 0&&typeof t!="object")throw new TypeError("FileSystemWritableFileStreamTarget's options, when provided, must be an object.");if(t&&t.chunkSize!==void 0&&(!Number.isInteger(t.chunkSize)||t.chunkSize<=0))throw new TypeError("options.chunkSize, when provided, must be a positive integer")}},He,K,Bs,Ka,Is,Qa,Ws,Ya,Fi,zs,Us,Xa,Ja=class{constructor(){E(this,Bs),E(this,Is),E(this,Ws),E(this,Fi),E(this,Us),this.pos=0,E(this,He,new Uint8Array(8)),E(this,K,new DataView(r(this,He).buffer)),this.offsets=new WeakMap,this.dataOffsets=new WeakMap}seek(e){this.pos=e}writeEBMLVarInt(e,t=Yr(e)){let i=0;switch(t){case 1:r(this,K).setUint8(i++,128|e);break;case 2:r(this,K).setUint8(i++,64|e>>8),r(this,K).setUint8(i++,e);break;case 3:r(this,K).setUint8(i++,32|e>>16),r(this,K).setUint8(i++,e>>8),r(this,K).setUint8(i++,e);break;case 4:r(this,K).setUint8(i++,16|e>>24),r(this,K).setUint8(i++,e>>16),r(this,K).setUint8(i++,e>>8),r(this,K).setUint8(i++,e);break;case 5:r(this,K).setUint8(i++,8|e/2**32&7),r(this,K).setUint8(i++,e>>24),r(this,K).setUint8(i++,e>>16),r(this,K).setUint8(i++,e>>8),r(this,K).setUint8(i++,e);break;case 6:r(this,K).setUint8(i++,4|e/2**40&3),r(this,K).setUint8(i++,e/2**32|0),r(this,K).setUint8(i++,e>>24),r(this,K).setUint8(i++,e>>16),r(this,K).setUint8(i++,e>>8),r(this,K).setUint8(i++,e);break;default:throw new Error("Bad EBML VINT size "+t)}this.write(r(this,He).subarray(0,i))}writeEBML(e){if(e!==null)if(e instanceof Uint8Array)this.write(e);else if(Array.isArray(e))for(let t of e)this.writeEBML(t);else if(this.offsets.set(e,this.pos),B(this,Fi,zs).call(this,e.id),Array.isArray(e.data)){let t=this.pos,i=e.size===-1?1:e.size??4;e.size===-1?B(this,Bs,Ka).call(this,255):this.seek(this.pos+i);let n=this.pos;if(this.dataOffsets.set(e,n),this.writeEBML(e.data),e.size!==-1){let a=this.pos-n,o=this.pos;this.seek(t),this.writeEBMLVarInt(a,i),this.seek(o)}}else if(typeof e.data=="number"){let t=e.size??Ga(e.data);this.writeEBMLVarInt(t),B(this,Fi,zs).call(this,e.data,t)}else typeof e.data=="string"?(this.writeEBMLVarInt(e.data.length),B(this,Us,Xa).call(this,e.data)):e.data instanceof Uint8Array?(this.writeEBMLVarInt(e.data.byteLength,e.size),this.write(e.data)):e.data instanceof ja?(this.writeEBMLVarInt(4),B(this,Is,Qa).call(this,e.data.value)):e.data instanceof Ls&&(this.writeEBMLVarInt(8),B(this,Ws,Ya).call(this,e.data.value))}};He=new WeakMap;K=new WeakMap;Bs=new WeakSet;Ka=function(e){r(this,K).setUint8(0,e),this.write(r(this,He).subarray(0,1))};Is=new WeakSet;Qa=function(e){r(this,K).setFloat32(0,e,!1),this.write(r(this,He).subarray(0,4))};Ws=new WeakSet;Ya=function(e){r(this,K).setFloat64(0,e,!1),this.write(r(this,He))};Fi=new WeakSet;zs=function(e,t=Ga(e)){let i=0;switch(t){case 6:r(this,K).setUint8(i++,e/2**40|0);case 5:r(this,K).setUint8(i++,e/2**32|0);case 4:r(this,K).setUint8(i++,e>>24);case 3:r(this,K).setUint8(i++,e>>16);case 2:r(this,K).setUint8(i++,e>>8);case 1:r(this,K).setUint8(i++,e);break;default:throw new Error("Bad UINT size "+t)}this.write(r(this,He).subarray(0,i))};Us=new WeakSet;Xa=function(e){this.write(new Uint8Array(e.split("").map(t=>t.charCodeAt(0))))};var Ri,rt,ii,Oi,Fs,Zr=class extends Ja{constructor(e){super(),E(this,Oi),E(this,Ri,void 0),E(this,rt,new ArrayBuffer(2**16)),E(this,ii,new Uint8Array(r(this,rt))),D(this,Ri,e)}write(e){B(this,Oi,Fs).call(this,this.pos+e.byteLength),r(this,ii).set(e,this.pos),this.pos+=e.byteLength}finalize(){B(this,Oi,Fs).call(this,this.pos),r(this,Ri).buffer=r(this,rt).slice(0,this.pos)}};Ri=new WeakMap;rt=new WeakMap;ii=new WeakMap;Oi=new WeakSet;Fs=function(e){let t=r(this,rt).byteLength;for(;t<e;)t*=2;if(t===r(this,rt).byteLength)return;let i=new ArrayBuffer(t),n=new Uint8Array(i);n.set(r(this,ii),0),D(this,rt,i),D(this,ii,n)};var gt,_e,Ae,tt,li=class extends Ja{constructor(e){super(),this.target=e,E(this,gt,!1),E(this,_e,void 0),E(this,Ae,void 0),E(this,tt,void 0)}write(e){if(!r(this,gt))return;let t=this.pos;if(t<r(this,Ae)){if(t+e.byteLength<=r(this,Ae))return;e=e.subarray(r(this,Ae)-t),t=0}let i=t+e.byteLength-r(this,Ae),n=r(this,_e).byteLength;for(;n<i;)n*=2;if(n!==r(this,_e).byteLength){let a=new Uint8Array(n);a.set(r(this,_e),0),D(this,_e,a)}r(this,_e).set(e,t-r(this,Ae)),D(this,tt,Math.max(r(this,tt),t+e.byteLength))}startTrackingWrites(){D(this,gt,!0),D(this,_e,new Uint8Array(2**10)),D(this,Ae,this.pos),D(this,tt,this.pos)}getTrackedWrites(){if(!r(this,gt))throw new Error("Can't get tracked writes since nothing was tracked.");let t={data:r(this,_e).subarray(0,r(this,tt)-r(this,Ae)),start:r(this,Ae),end:r(this,tt)};return D(this,_e,void 0),D(this,gt,!1),t}};gt=new WeakMap;_e=new WeakMap;Ae=new WeakMap;tt=new WeakMap;var eo=2**24,to=2,it,Tt,Qt,jt,Pe,ge,Vi,Rs,Hs,Za,js,en,Yt,Li,Gs=class extends li{constructor(e,t){super(e),E(this,Vi),E(this,Hs),E(this,js),E(this,Yt),E(this,it,[]),E(this,Tt,0),E(this,Qt,void 0),E(this,jt,void 0),E(this,Pe,void 0),E(this,ge,[]),D(this,Qt,t),D(this,jt,e.options?.chunked??!1),D(this,Pe,e.options?.chunkSize??eo)}write(e){super.write(e),r(this,it).push({data:e.slice(),start:this.pos}),this.pos+=e.byteLength}flush(){if(r(this,it).length===0)return;let e=[],t=[...r(this,it)].sort((i,n)=>i.start-n.start);e.push({start:t[0].start,size:t[0].data.byteLength});for(let i=1;i<t.length;i++){let n=e[e.length-1],a=t[i];a.start<=n.start+n.size?n.size=Math.max(n.size,a.start+a.data.byteLength-n.start):e.push({start:a.start,size:a.data.byteLength})}for(let i of e){i.data=new Uint8Array(i.size);for(let n of r(this,it))i.start<=n.start&&n.start<i.start+i.size&&i.data.set(n.data,n.start-i.start);if(r(this,jt))B(this,Vi,Rs).call(this,i.data,i.start),B(this,Yt,Li).call(this);else{if(r(this,Qt)&&i.start<r(this,Tt))throw new Error("Internal error: Monotonicity violation.");this.target.options.onData?.(i.data,i.start),D(this,Tt,i.start+i.data.byteLength)}}r(this,it).length=0}finalize(){r(this,jt)&&B(this,Yt,Li).call(this,!0)}};it=new WeakMap;Tt=new WeakMap;Qt=new WeakMap;jt=new WeakMap;Pe=new WeakMap;ge=new WeakMap;Vi=new WeakSet;Rs=function(e,t){let i=r(this,ge).findIndex(d=>d.start<=t&&t<d.start+r(this,Pe));i===-1&&(i=B(this,js,en).call(this,t));let n=r(this,ge)[i],a=t-n.start,o=e.subarray(0,Math.min(r(this,Pe)-a,e.byteLength));n.data.set(o,a);let f={start:a,end:a+o.byteLength};if(B(this,Hs,Za).call(this,n,f),n.written[0].start===0&&n.written[0].end===r(this,Pe)&&(n.shouldFlush=!0),r(this,ge).length>to){for(let d=0;d<r(this,ge).length-1;d++)r(this,ge)[d].shouldFlush=!0;B(this,Yt,Li).call(this)}o.byteLength<e.byteLength&&B(this,Vi,Rs).call(this,e.subarray(o.byteLength),t+o.byteLength)};Hs=new WeakSet;Za=function(e,t){let i=0,n=e.written.length-1,a=-1;for(;i<=n;){let o=Math.floor(i+(n-i+1)/2);e.written[o].start<=t.start?(i=o+1,a=o):n=o-1}for(e.written.splice(a+1,0,t),(a===-1||e.written[a].end<t.start)&&a++;a<e.written.length-1&&e.written[a].end>=e.written[a+1].start;)e.written[a].end=Math.max(e.written[a].end,e.written[a+1].end),e.written.splice(a+1,1)};js=new WeakSet;en=function(e){let i={start:Math.floor(e/r(this,Pe))*r(this,Pe),data:new Uint8Array(r(this,Pe)),written:[],shouldFlush:!1};return r(this,ge).push(i),r(this,ge).sort((n,a)=>n.start-a.start),r(this,ge).indexOf(i)};Yt=new WeakSet;Li=function(e=!1){for(let t=0;t<r(this,ge).length;t++){let i=r(this,ge)[t];if(!(!i.shouldFlush&&!e)){for(let n of i.written){if(r(this,Qt)&&i.start+n.start<r(this,Tt))throw new Error("Internal error: Monotonicity violation.");this.target.options.onData?.(i.data.subarray(n.start,n.end),i.start+n.start),D(this,Tt,i.start+n.end)}r(this,ge).splice(t--,1)}}};var io=class extends Gs{constructor(e,t){super(new qa({onData:(i,n)=>e.stream.write({type:"write",data:i,position:n}),chunked:!0,chunkSize:e.options?.chunkSize}),t)}},_t=1,si=2,$i=3,so=1,ao=2,no=17,ro=2**15,Xt=2**13,Ha="https://github.com/Vanilagy/webm-muxer",tn=6,sn=5,oo=["strict","offset","permissive"],N,I,ai,ni,Ne,At,yt,ot,Bt,je,St,Ct,Ie,hi,xt,Le,$e,st,Jt,Zt,kt,Mt,Hi,ri,ei,Os,an,Ns,nn,qs,rn,Ks,on,Qs,ln,Ys,hn,Xs,fn,Ki,Js,Qi,Zs,ea,dn,at,bt,nt,vt,Ps,cn,Ds,un,Gt,Ni,qt,Pi,ta,mn,Be,Oe,Et,oi,ti,ji,ia,pn,Gi,sa,Kt,Di,wn=class{constructor(e){E(this,Os),E(this,Ns),E(this,qs),E(this,Ks),E(this,Qs),E(this,Ys),E(this,Xs),E(this,Ki),E(this,Qi),E(this,ea),E(this,at),E(this,nt),E(this,Ps),E(this,Ds),E(this,Gt),E(this,qt),E(this,ta),E(this,Be),E(this,Et),E(this,ti),E(this,ia),E(this,Gi),E(this,Kt),E(this,N,void 0),E(this,I,void 0),E(this,ai,void 0),E(this,ni,void 0),E(this,Ne,void 0),E(this,At,void 0),E(this,yt,void 0),E(this,ot,void 0),E(this,Bt,void 0),E(this,je,void 0),E(this,St,void 0),E(this,Ct,void 0),E(this,Ie,void 0),E(this,hi,void 0),E(this,xt,0),E(this,Le,[]),E(this,$e,[]),E(this,st,[]),E(this,Jt,void 0),E(this,Zt,void 0),E(this,kt,-1),E(this,Mt,-1),E(this,Hi,-1),E(this,ri,void 0),E(this,ei,!1),B(this,Os,an).call(this,e),D(this,N,{type:"webm",firstTimestampBehavior:"strict",...e}),this.target=e.target;let t=!!r(this,N).streaming;if(e.target instanceof $s)D(this,I,new Zr(e.target));else if(e.target instanceof qa)D(this,I,new Gs(e.target,t));else if(e.target instanceof Jr)D(this,I,new io(e.target,t));else throw new Error(`Invalid target: ${e.target}`);B(this,Ns,nn).call(this)}addVideoChunk(e,t,i){if(!(e instanceof EncodedVideoChunk))throw new TypeError("addVideoChunk's first argument (chunk) must be of type EncodedVideoChunk.");if(t&&typeof t!="object")throw new TypeError("addVideoChunk's second argument (meta), when provided, must be an object.");if(i!==void 0&&(!Number.isFinite(i)||i<0))throw new TypeError("addVideoChunk's third argument (timestamp), when provided, must be a non-negative real number.");let n=new Uint8Array(e.byteLength);e.copyTo(n),this.addVideoChunkRaw(n,e.type,i??e.timestamp,t)}addVideoChunkRaw(e,t,i,n){if(!(e instanceof Uint8Array))throw new TypeError("addVideoChunkRaw's first argument (data) must be an instance of Uint8Array.");if(t!=="key"&&t!=="delta")throw new TypeError("addVideoChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(i)||i<0)throw new TypeError("addVideoChunkRaw's third argument (timestamp) must be a non-negative real number.");if(n&&typeof n!="object")throw new TypeError("addVideoChunkRaw's fourth argument (meta), when provided, must be an object.");if(B(this,Kt,Di).call(this),!r(this,N).video)throw new Error("No video track declared.");r(this,Jt)===void 0&&D(this,Jt,i),n&&B(this,Ps,cn).call(this,n);let a=B(this,qt,Pi).call(this,e,t,i,_t);for(r(this,N).video.codec==="V_VP9"&&B(this,Ds,un).call(this,a),D(this,kt,a.timestamp);r(this,$e).length>0&&r(this,$e)[0].timestamp<=a.timestamp;){let o=r(this,$e).shift();B(this,Be,Oe).call(this,o,!1)}!r(this,N).audio||a.timestamp<=r(this,Mt)?B(this,Be,Oe).call(this,a,!0):r(this,Le).push(a),B(this,Gt,Ni).call(this),B(this,at,bt).call(this)}addAudioChunk(e,t,i){if(!(e instanceof EncodedAudioChunk))throw new TypeError("addAudioChunk's first argument (chunk) must be of type EncodedAudioChunk.");if(t&&typeof t!="object")throw new TypeError("addAudioChunk's second argument (meta), when provided, must be an object.");if(i!==void 0&&(!Number.isFinite(i)||i<0))throw new TypeError("addAudioChunk's third argument (timestamp), when provided, must be a non-negative real number.");let n=new Uint8Array(e.byteLength);e.copyTo(n),this.addAudioChunkRaw(n,e.type,i??e.timestamp,t)}addAudioChunkRaw(e,t,i,n){if(!(e instanceof Uint8Array))throw new TypeError("addAudioChunkRaw's first argument (data) must be an instance of Uint8Array.");if(t!=="key"&&t!=="delta")throw new TypeError("addAudioChunkRaw's second argument (type) must be either 'key' or 'delta'.");if(!Number.isFinite(i)||i<0)throw new TypeError("addAudioChunkRaw's third argument (timestamp) must be a non-negative real number.");if(n&&typeof n!="object")throw new TypeError("addAudioChunkRaw's fourth argument (meta), when provided, must be an object.");if(B(this,Kt,Di).call(this),!r(this,N).audio)throw new Error("No audio track declared.");r(this,Zt)===void 0&&D(this,Zt,i),n?.decoderConfig&&(r(this,N).streaming?D(this,je,B(this,Et,oi).call(this,n.decoderConfig.description)):B(this,ti,ji).call(this,r(this,je),n.decoderConfig.description));let a=B(this,qt,Pi).call(this,e,t,i,si);for(D(this,Mt,a.timestamp);r(this,Le).length>0&&r(this,Le)[0].timestamp<=a.timestamp;){let o=r(this,Le).shift();B(this,Be,Oe).call(this,o,!0)}!r(this,N).video||a.timestamp<=r(this,kt)?B(this,Be,Oe).call(this,a,!r(this,N).video):r(this,$e).push(a),B(this,Gt,Ni).call(this),B(this,at,bt).call(this)}addSubtitleChunk(e,t,i){if(typeof e!="object"||!e)throw new TypeError("addSubtitleChunk's first argument (chunk) must be an object.");if(!(e.body instanceof Uint8Array))throw new TypeError("body must be an instance of Uint8Array.");if(!Number.isFinite(e.timestamp)||e.timestamp<0)throw new TypeError("timestamp must be a non-negative real number.");if(!Number.isFinite(e.duration)||e.duration<0)throw new TypeError("duration must be a non-negative real number.");if(e.additions&&!(e.additions instanceof Uint8Array))throw new TypeError("additions, when present, must be an instance of Uint8Array.");if(typeof t!="object")throw new TypeError("addSubtitleChunk's second argument (meta) must be an object.");if(B(this,Kt,Di).call(this),!r(this,N).subtitles)throw new Error("No subtitle track declared.");t?.decoderConfig&&(r(this,N).streaming?D(this,St,B(this,Et,oi).call(this,t.decoderConfig.description)):B(this,ti,ji).call(this,r(this,St),t.decoderConfig.description));let n=B(this,qt,Pi).call(this,e.body,"key",i??e.timestamp,$i,e.duration,e.additions);D(this,Hi,n.timestamp),r(this,st).push(n),B(this,Gt,Ni).call(this),B(this,at,bt).call(this)}finalize(){if(r(this,ei))throw new Error("Cannot finalize a muxer more than once.");for(;r(this,Le).length>0;)B(this,Be,Oe).call(this,r(this,Le).shift(),!0);for(;r(this,$e).length>0;)B(this,Be,Oe).call(this,r(this,$e).shift(),!0);for(;r(this,st).length>0&&r(this,st)[0].timestamp<=r(this,xt);)B(this,Be,Oe).call(this,r(this,st).shift(),!1);if(r(this,Ie)&&B(this,Gi,sa).call(this),r(this,I).writeEBML(r(this,Ct)),!r(this,N).streaming){let e=r(this,I).pos,t=r(this,I).pos-r(this,nt,vt);r(this,I).seek(r(this,I).offsets.get(r(this,ai))+4),r(this,I).writeEBMLVarInt(t,tn),r(this,yt).data=new Ls(r(this,xt)),r(this,I).seek(r(this,I).offsets.get(r(this,yt))),r(this,I).writeEBML(r(this,yt)),r(this,Ne).data[0].data[1].data=r(this,I).offsets.get(r(this,Ct))-r(this,nt,vt),r(this,Ne).data[1].data[1].data=r(this,I).offsets.get(r(this,ni))-r(this,nt,vt),r(this,Ne).data[2].data[1].data=r(this,I).offsets.get(r(this,At))-r(this,nt,vt),r(this,I).seek(r(this,I).offsets.get(r(this,Ne))),r(this,I).writeEBML(r(this,Ne)),r(this,I).seek(e)}B(this,at,bt).call(this),r(this,I).finalize(),D(this,ei,!0)}};N=new WeakMap;I=new WeakMap;ai=new WeakMap;ni=new WeakMap;Ne=new WeakMap;At=new WeakMap;yt=new WeakMap;ot=new WeakMap;Bt=new WeakMap;je=new WeakMap;St=new WeakMap;Ct=new WeakMap;Ie=new WeakMap;hi=new WeakMap;xt=new WeakMap;Le=new WeakMap;$e=new WeakMap;st=new WeakMap;Jt=new WeakMap;Zt=new WeakMap;kt=new WeakMap;Mt=new WeakMap;Hi=new WeakMap;ri=new WeakMap;ei=new WeakMap;Os=new WeakSet;an=function(e){if(typeof e!="object")throw new TypeError("The muxer requires an options object to be passed to its constructor.");if(!(e.target instanceof qi))throw new TypeError("The target must be provided and an instance of Target.");if(e.video){if(typeof e.video.codec!="string")throw new TypeError(`Invalid video codec: ${e.video.codec}. Must be a string.`);if(!Number.isInteger(e.video.width)||e.video.width<=0)throw new TypeError(`Invalid video width: ${e.video.width}. Must be a positive integer.`);if(!Number.isInteger(e.video.height)||e.video.height<=0)throw new TypeError(`Invalid video height: ${e.video.height}. Must be a positive integer.`);if(e.video.frameRate!==void 0&&(!Number.isFinite(e.video.frameRate)||e.video.frameRate<=0))throw new TypeError(`Invalid video frame rate: ${e.video.frameRate}. Must be a positive number.`);if(e.video.alpha!==void 0&&typeof e.video.alpha!="boolean")throw new TypeError(`Invalid video alpha: ${e.video.alpha}. Must be a boolean.`)}if(e.audio){if(typeof e.audio.codec!="string")throw new TypeError(`Invalid audio codec: ${e.audio.codec}. Must be a string.`);if(!Number.isInteger(e.audio.numberOfChannels)||e.audio.numberOfChannels<=0)throw new TypeError(`Invalid number of audio channels: ${e.audio.numberOfChannels}. Must be a positive integer.`);if(!Number.isInteger(e.audio.sampleRate)||e.audio.sampleRate<=0)throw new TypeError(`Invalid audio sample rate: ${e.audio.sampleRate}. Must be a positive integer.`);if(e.audio.bitDepth!==void 0&&(!Number.isInteger(e.audio.bitDepth)||e.audio.bitDepth<=0))throw new TypeError(`Invalid audio bit depth: ${e.audio.bitDepth}. Must be a positive integer.`)}if(e.subtitles&&typeof e.subtitles.codec!="string")throw new TypeError(`Invalid subtitles codec: ${e.subtitles.codec}. Must be a string.`);if(e.type!==void 0&&!["webm","matroska"].includes(e.type))throw new TypeError(`Invalid type: ${e.type}. Must be 'webm' or 'matroska'.`);if(e.firstTimestampBehavior&&!oo.includes(e.firstTimestampBehavior))throw new TypeError(`Invalid first timestamp behavior: ${e.firstTimestampBehavior}`);if(e.streaming!==void 0&&typeof e.streaming!="boolean")throw new TypeError(`Invalid streaming option: ${e.streaming}. Must be a boolean.`)};Ns=new WeakSet;nn=function(){r(this,I)instanceof li&&r(this,I).target.options.onHeader&&r(this,I).startTrackingWrites(),B(this,qs,rn).call(this),r(this,N).streaming||B(this,Ys,hn).call(this),B(this,Xs,fn).call(this),B(this,Ks,on).call(this),B(this,Qs,ln).call(this),r(this,N).streaming||(B(this,Ki,Js).call(this),B(this,Qi,Zs).call(this)),B(this,ea,dn).call(this),B(this,at,bt).call(this)};qs=new WeakSet;rn=function(){let e={id:440786851,data:[{id:17030,data:1},{id:17143,data:1},{id:17138,data:4},{id:17139,data:8},{id:17026,data:r(this,N).type??"webm"},{id:17031,data:2},{id:17029,data:2}]};r(this,I).writeEBML(e)};Ks=new WeakSet;on=function(){D(this,Bt,{id:236,size:4,data:new Uint8Array(Xt)}),D(this,je,{id:236,size:4,data:new Uint8Array(Xt)}),D(this,St,{id:236,size:4,data:new Uint8Array(Xt)})};Qs=new WeakSet;ln=function(){D(this,ot,{id:21936,data:[{id:21937,data:2},{id:21946,data:2},{id:21947,data:2},{id:21945,data:0}]})};Ys=new WeakSet;hn=function(){let e=new Uint8Array([28,83,187,107]),t=new Uint8Array([21,73,169,102]),i=new Uint8Array([22,84,174,107]);D(this,Ne,{id:290298740,data:[{id:19899,data:[{id:21419,data:e},{id:21420,size:5,data:0}]},{id:19899,data:[{id:21419,data:t},{id:21420,size:5,data:0}]},{id:19899,data:[{id:21419,data:i},{id:21420,size:5,data:0}]}]})};Xs=new WeakSet;fn=function(){let e={id:17545,data:new Ls(0)};D(this,yt,e);let t={id:357149030,data:[{id:2807729,data:1e6},{id:19840,data:Ha},{id:22337,data:Ha},r(this,N).streaming?null:e]};D(this,ni,t)};Ki=new WeakSet;Js=function(){let e={id:374648427,data:[]};D(this,At,e),r(this,N).video&&e.data.push({id:174,data:[{id:215,data:_t},{id:29637,data:_t},{id:131,data:so},{id:134,data:r(this,N).video.codec},r(this,Bt),r(this,N).video.frameRate?{id:2352003,data:1e9/r(this,N).video.frameRate}:null,{id:224,data:[{id:176,data:r(this,N).video.width},{id:186,data:r(this,N).video.height},r(this,N).video.alpha?{id:21440,data:1}:null,r(this,ot)]}]}),r(this,N).audio&&(D(this,je,r(this,N).streaming?r(this,je)||null:{id:236,size:4,data:new Uint8Array(Xt)}),e.data.push({id:174,data:[{id:215,data:si},{id:29637,data:si},{id:131,data:ao},{id:134,data:r(this,N).audio.codec},r(this,je),{id:225,data:[{id:181,data:new ja(r(this,N).audio.sampleRate)},{id:159,data:r(this,N).audio.numberOfChannels},r(this,N).audio.bitDepth?{id:25188,data:r(this,N).audio.bitDepth}:null]}]})),r(this,N).subtitles&&e.data.push({id:174,data:[{id:215,data:$i},{id:29637,data:$i},{id:131,data:no},{id:134,data:r(this,N).subtitles.codec},r(this,St)]})};Qi=new WeakSet;Zs=function(){let e={id:408125543,size:r(this,N).streaming?-1:tn,data:[r(this,N).streaming?null:r(this,Ne),r(this,ni),r(this,At)]};if(D(this,ai,e),r(this,I).writeEBML(e),r(this,I)instanceof li&&r(this,I).target.options.onHeader){let{data:t,start:i}=r(this,I).getTrackedWrites();r(this,I).target.options.onHeader(t,i)}};ea=new WeakSet;dn=function(){D(this,Ct,{id:475249515,data:[]})};at=new WeakSet;bt=function(){r(this,I)instanceof Gs&&r(this,I).flush()};nt=new WeakSet;vt=function(){return r(this,I).dataOffsets.get(r(this,ai))};Ps=new WeakSet;cn=function(e){if(e.decoderConfig){if(e.decoderConfig.colorSpace){let t=e.decoderConfig.colorSpace;if(D(this,ri,t),r(this,ot).data=[{id:21937,data:{rgb:1,bt709:1,bt470bg:5,smpte170m:6}[t.matrix]},{id:21946,data:{bt709:1,smpte170m:6,"iec61966-2-1":13}[t.transfer]},{id:21947,data:{bt709:1,bt470bg:5,smpte170m:6}[t.primaries]},{id:21945,data:[1,2][Number(t.fullRange)]}],!r(this,N).streaming){let i=r(this,I).pos;r(this,I).seek(r(this,I).offsets.get(r(this,ot))),r(this,I).writeEBML(r(this,ot)),r(this,I).seek(i)}}e.decoderConfig.description&&(r(this,N).streaming?D(this,Bt,B(this,Et,oi).call(this,e.decoderConfig.description)):B(this,ti,ji).call(this,r(this,Bt),e.decoderConfig.description))}};Ds=new WeakSet;un=function(e){if(e.type!=="key"||!r(this,ri))return;let t=0;if(wt(e.data,0,2)!==2)return;t+=2;let i=(wt(e.data,t+1,t+2)<<1)+wt(e.data,t+0,t+1);t+=2,i===3&&t++;let n=wt(e.data,t+0,t+1);if(t++,n)return;let a=wt(e.data,t+0,t+1);if(t++,a!==0)return;t+=2;let o=wt(e.data,t+0,t+24);if(t+=24,o!==4817730)return;i>=2&&t++;let f={rgb:7,bt709:2,bt470bg:1,smpte170m:3}[r(this,ri).matrix];Xr(e.data,t+0,t+3,f)};Gt=new WeakSet;Ni=function(){let e=Math.min(r(this,N).video?r(this,kt):1/0,r(this,N).audio?r(this,Mt):1/0),t=r(this,st);for(;t.length>0&&t[0].timestamp<=e;)B(this,Be,Oe).call(this,t.shift(),!r(this,N).video&&!r(this,N).audio)};qt=new WeakSet;Pi=function(e,t,i,n,a,o){let f=B(this,ta,mn).call(this,i,n);return{data:e,additions:o,type:t,timestamp:f,duration:a,trackNumber:n}};ta=new WeakSet;mn=function(e,t){let i=t===_t?r(this,kt):t===si?r(this,Mt):r(this,Hi);if(t!==$i){let n=t===_t?r(this,Jt):r(this,Zt);if(r(this,N).firstTimestampBehavior==="strict"&&i===-1&&e!==0)throw new Error(`The first chunk for your media track must have a timestamp of 0 (received ${e}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
If you want to allow non-zero first timestamps, set firstTimestampBehavior: 'permissive'.
`);r(this,N).firstTimestampBehavior==="offset"&&(e-=n)}if(e<i)throw new Error(`Timestamps must be monotonically increasing (went from ${i} to ${e}).`);if(e<0)throw new Error(`Timestamps must be non-negative (received ${e}).`);return e};Be=new WeakSet;Oe=function(e,t){r(this,N).streaming&&!r(this,At)&&(B(this,Ki,Js).call(this),B(this,Qi,Zs).call(this));let i=Math.floor(e.timestamp/1e3),n=i-r(this,hi),a=t&&e.type==="key"&&n>=1e3,o=n>=ro;if((!r(this,Ie)||a||o)&&(B(this,ia,pn).call(this,i),n=0),n<0)return;let f=new Uint8Array(4),d=new DataView(f.buffer);if(d.setUint8(0,128|e.trackNumber),d.setInt16(1,n,!1),e.duration===void 0&&!e.additions){d.setUint8(3,+(e.type==="key")<<7);let v={id:163,data:[f,e.data]};r(this,I).writeEBML(v)}else{let v=Math.floor(e.duration/1e3),S={id:160,data:[{id:161,data:[f,e.data]},e.duration!==void 0?{id:155,data:v}:null,e.additions?{id:30113,data:e.additions}:null]};r(this,I).writeEBML(S)}D(this,xt,Math.max(r(this,xt),i))};Et=new WeakSet;oi=function(e){return{id:25506,size:4,data:new Uint8Array(e)}};ti=new WeakSet;ji=function(e,t){let i=r(this,I).pos;r(this,I).seek(r(this,I).offsets.get(e));let n=6+t.byteLength,a=Xt-n;if(a<0){let o=t.byteLength+a;t instanceof ArrayBuffer?t=t.slice(0,o):t=t.buffer.slice(0,o),a=0}e=[B(this,Et,oi).call(this,t),{id:236,size:4,data:new Uint8Array(a)}],r(this,I).writeEBML(e),r(this,I).seek(i)};ia=new WeakSet;pn=function(e){r(this,Ie)&&B(this,Gi,sa).call(this),r(this,I)instanceof li&&r(this,I).target.options.onCluster&&r(this,I).startTrackingWrites(),D(this,Ie,{id:524531317,size:r(this,N).streaming?-1:sn,data:[{id:231,data:e}]}),r(this,I).writeEBML(r(this,Ie)),D(this,hi,e);let t=r(this,I).offsets.get(r(this,Ie))-r(this,nt,vt);r(this,Ct).data.push({id:187,data:[{id:179,data:e},r(this,N).video?{id:183,data:[{id:247,data:_t},{id:241,data:t}]}:null,r(this,N).audio?{id:183,data:[{id:247,data:si},{id:241,data:t}]}:null]})};Gi=new WeakSet;sa=function(){if(!r(this,N).streaming){let e=r(this,I).pos-r(this,I).dataOffsets.get(r(this,Ie)),t=r(this,I).pos;r(this,I).seek(r(this,I).offsets.get(r(this,Ie))+4),r(this,I).writeEBMLVarInt(e,sn),r(this,I).seek(t)}if(r(this,I)instanceof li&&r(this,I).target.options.onCluster){let{data:e,start:t}=r(this,I).getTrackedWrites();r(this,I).target.options.onCluster(e,t,r(this,hi))}};Kt=new WeakSet;Di=function(){if(r(this,ei))throw new Error("Cannot add new video or audio chunks after the file has been finalized.")};var lo=/(?:(\d{2}):)?(\d{2}):(\d{2}).(\d{3})/;var Qo=new TextEncoder,ho,fo,co,uo,mo,po,wo,go,yo;ho=new WeakMap;fo=new WeakMap;co=new WeakMap;uo=new WeakMap;mo=new WeakMap;po=new WeakSet;wo=function(e){let t=lo.exec(e);if(!t)throw new Error("Expected match.");return 3600*1e3*Number(t[1]||"0")+60*1e3*Number(t[2])+1e3*Number(t[3])+Number(t[4])};go=new WeakSet;yo=function(e){let t=Math.floor(e/36e5),i=Math.floor(e%(3600*1e3)/(60*1e3)),n=Math.floor(e%(60*1e3)/1e3),a=e%1e3;return t.toString().padStart(2,"0")+":"+i.toString().padStart(2,"0")+":"+n.toString().padStart(2,"0")+"."+a.toString().padStart(3,"0")};var gn="data:image/png;base64,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";var Xi = "3.3.0",
    fe = 30,
    ve = 1e3,
    ht = Math.PI / 180,
    Ce = 5.5,
    vo = (e, t, i) => `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${e}/${i}/${t}`,
    Tm = (e, t) => `https://routing.openstreetmap.de/routed-bike/route/v1/driving/${e.lon},${e.lat};${t.lon},${t.lat}?overview=full&geometries=geojson`,
    Mt = d => Math.max(1, d <= 8 ? d / 25 * 60 : 19.2 + (d - 8) / 30 * 60),
    To = (e, t) => `https://router.project-osrm.org/route/v1/driving/${e.lon},${e.lat};${t.lon},${t.lat}?overview=full&geometries=geojson`,
    So = (e, t) => `https://photon.komoot.io/api/?limit=5&lat=${t.lat}&lon=${t.lon}&q=${encodeURIComponent(e)}`,
    Ov = ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"],
    Tb = e => `https://router.project-osrm.org/table/v1/driving/${e.map(t=>`${(+t.lon).toFixed(6)},${(+t.lat).toFixed(6)}`).join(";")}?sources=0&annotations=duration,distance`,
    Px = e => `https://wsrv.nl/?url=${encodeURIComponent(e)}&output=png&w=800`,
    Nm = (e, t) => `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=vn&accept-language=vi&q=${encodeURIComponent(e)}&viewbox=${t.lon-.5},${t.lat+.5},${t.lon+.5},${t.lat-.5}`,
    Rd = (e, t, i) => `https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/${e}/${i}/${t}`,
    Ff = "",
    DeB0 = null,
    yn = "\u1EA2nh v\u1EC7 tinh: Esri, Maxar \xB7 \u0110\u01B0\u1EDDng: \xA9 OpenStreetMap \xB7 S\u1ED1 li\u1EC7u \u01B0\u1EDBc t\xEDnh",
    xn = {
        avi: {
            name: "AVI Realty",
            tagline: "ASSET \u2022 VALUE \u2022 INVESTMENT",
            website: "avirealty.vn",
            hotline: "",
            role: "",
            primary: "#2F4B3C",
            accent: "#F0531C",
            plate: "#F7F1E6",
            card: "rgba(20,38,30,.93)",
            logo: gn,
            logoAR: 1314 / 501
        }
    },
    ra = {
        "9:16": {
            W: 576,
            H: 1024,
            out: {
                1080: [1080, 1920],
                720: [720, 1280]
            },
            M: 36,
            YMIN: 130,
            CX0: 288,
            CY0: 500,
            PHI: 40,
            PHI0: 15,
            topY: 64,
            progY: 86,
            labelTop: 104,
            logoH: 20,
            markerD: 76,
            topFade: 170,
            botFade: 340,
            rail: {
                y0: 400,
                y1: 880,
                x1: 504
            },
            card: {
                x: 36,
                w: 504,
                h: 108,
                bottom: 84
            },
            outro: {
                x: 36,
                w: 504,
                h: 280,
                bottom: 84,
                split: !1
            },
            intro: {
                align: "center",
                x: 288,
                maxW: 484,
                y: [200, 262, 318],
                size: 52,
                min: 26,
                sub: 20
            },
            sting: {
                cx: 288,
                cy: 300,
                h: 64
            },
            fit: {
                x0: 80,
                x1: 496,
                y0: 215,
                y1: 788
            },
            fitOut: {
                x0: 80,
                x1: 496,
                y0: 215,
                y1: 624
            },
            footY: [59, 41],
            cols: 4
        },
        "1:1": {
            W: 720,
            H: 720,
            out: {
                1080: [1080, 1080],
                720: [720, 720]
            },
            M: 40,
            YMIN: 90,
            CX0: 360,
            CY0: 300,
            PHI: 36,
            PHI0: 14,
            topY: 46,
            progY: 68,
            labelTop: 86,
            logoH: 20,
            markerD: 64,
            topFade: 130,
            botFade: 260,
            card: {
                x: 40,
                w: 640,
                h: 100,
                bottom: 64
            },
            outro: {
                x: 40,
                w: 640,
                h: 196,
                bottom: 64,
                split: !0
            },
            intro: {
                align: "center",
                x: 360,
                maxW: 620,
                y: [112, 156, 194],
                size: 40,
                min: 22,
                sub: 18
            },
            sting: {
                cx: 360,
                cy: 145,
                h: 56
            },
            fit: {
                x0: 80,
                x1: 640,
                y0: 120,
                y1: 520
            },
            fitOut: {
                x0: 80,
                x1: 640,
                y0: 120,
                y1: 424
            },
            footY: [42, 26],
            cols: 3
        },
        "16:9": {
            W: 1024,
            H: 576,
            out: {
                1080: [1920, 1080],
                720: [1280, 720]
            },
            M: 48,
            YMIN: 80,
            CX0: 700,
            CY0: 300,
            PHI: 32,
            PHI0: 12,
            topY: 42,
            progY: 64,
            labelTop: 82,
            logoH: 20,
            markerD: 70,
            topFade: 130,
            botFade: 220,
            card: {
                x: 48,
                w: 360,
                h: 108,
                bottom: 60
            },
            outro: {
                x: 48,
                w: 380,
                h: 280,
                bottom: 60,
                split: !1
            },
            intro: {
                align: "left",
                x: 48,
                maxW: 560,
                y: [190, 244, 290],
                size: 50,
                min: 24,
                sub: 20
            },
            sting: {
                cx: 330,
                cy: 220,
                h: 70
            },
            fit: {
                x0: 460,
                x1: 976,
                y0: 100,
                y1: 500
            },
            fitOut: {
                x0: 460,
                x1: 976,
                y0: 100,
                y1: 500
            },
            footY: [38, 22],
            cols: 2
        }
    },
    De = {
        gold: {
            m: ["#fff7c9", "#ffd94f", "#d9a31c", "#85560a", "#f6cf63"],
            flat: "#ffc247",
            txt: "#2a1a00"
        },
        blue: {
            m: ["#eaf5ff", "#8fc6ff", "#3b7bdc", "#16367a", "#9bcaff"],
            flat: "#5fa8ff",
            txt: "#04122e"
        },
        ruby: {
            m: ["#ffe6ea", "#ff8d9f", "#dc304a", "#6f0f24", "#ffb3bf"],
            flat: "#ff5d73",
            txt: "#2a0510"
        },
        teal: {
            m: ["#e2fbf8", "#7fe3d8", "#1fa99a", "#0b5249", "#8cebe0"],
            flat: "#2cc4b3",
            txt: "#03201c"
        },
        green: {
            m: ["#ecfbe2", "#9fe07a", "#4c9f2a", "#1f4d10", "#b5ec95"],
            flat: "#6cc64a",
            txt: "#0c2004"
        },
        silver: {
            m: ["#f7f8fa", "#cfd5de", "#8d97a6", "#3e4652", "#dfe4ea"],
            flat: "#b9c2cf",
            txt: "#151a22"
        },
        violet: {
            m: ["#f3ecff", "#c4a5ff", "#7b4fd6", "#3a1d78", "#d2bcff"],
            flat: "#9b72f2",
            txt: "#14062e"
        },
        amber: {
            m: ["#fff1e0", "#ffc38a", "#e07b24", "#7a3a06", "#ffd2a6"],
            flat: "#f0913a",
            txt: "#2a1300"
        },
        brand: {
            m: ["#ff9a6b", "#f56a35", "#f0531c", "#b83c0f", "#ff8a5c"],
            flat: "#f0531c",
            txt: "#ffffff"
        }
    },
    Co = {
        "Y T\u1EBE": "ruby",
        "MUA S\u1EAEM": "gold",
        "K\u1EBET N\u1ED0I": "blue",
        "GI\xC1O D\u1EE4C": "teal",
        "C\xD4NG VI\xCAN": "green",
        "H\xC0NH CH\xCDNH": "silver",
        "TH\u1EC2 THAO": "violet",
        "KCN": "amber"
    },
    Mk = {"Y T\u1EBE": "hospital", "MUA S\u1EAEM": "shop", "K\u1EBET N\u1ED0I": "rail", "GI\xC1O D\u1EE4C": "school", "C\xD4NG VI\xCAN": "park", "H\xC0NH CH\xCDNH": "town-hall", "TH\u1EC2 THAO": "golf", "KCN": "industry"},
    MkD = {"hospital":"M7,1C6.4,1,6,1.4,6,2v4H2C1.4,6,1,6.4,1,7v1 c0,0.6,0.4,1,1,1h4v4c0,0.6,0.4,1,1,1h1c0.6,0,1-0.4,1-1V9h4c0.6,0,1-0.4,1-1V7c0-0.6-0.4-1-1-1H9V2c0-0.6-0.4-1-1-1H7z","shop":"m13.33 5h-1.83l-.39-2.33c-.1601-.7182-.7017-1.2905-1.41-1.49-.3493-.1124-.7131-.173-1.08-.18h-2.24c-.3669.007-.7307.0676-1.08.18-.7083.1995-1.2499.7718-1.41 1.49l-.39 2.33h-1.83c-.2761-.0017-.5013.2208-.503.497-.0003.0519.0074.1035.023.153l1.88 6.3c.1964.6246.7753 1.0496 1.43 1.05h6c.651-.0047 1.2247-.4289 1.42-1.05l1.88-6.3c.0829-.2634-.0635-.5441-.3269-.627-.0463-.0146-.0945-.0223-.1431-.023zm-8.81 0 .36-2.17c.0807-.3625.3736-.6395.74-.7.2463-.0776.5019-.1213.76-.13h2.24c.2614.0078.5205.0515.77.13.3664.0605.6593.3375.74.7l.35 2.17h-6z","rail":"M 3 1 C 2.4477 1 2 1.4477 2 2 L 2 10 C 2 10.5523 2.4477 11 3 11 L 12 11 C 12.5523 11 13 10.5523 13 10 L 13 2 C 13 1.4477 12.5523 1 12 1 L 3 1 z M 5.75 1.5 L 5.7597656 1.5 L 9.2597656 1.5 C 9.3978656 1.5 9.5097656 1.6119 9.5097656 1.75 C 9.5097656 1.8881 9.3978656 2 9.2597656 2 L 5.75 2 C 5.6119 2 5.5 1.8881 5.5 1.75 C 5.5 1.6119 5.6119 1.5 5.75 1.5 z M 3.5 3 L 7 3 L 7 7 L 3.5 7 C 3.2239 7 3 6.7761 3 6.5 L 3 3.5 C 3 3.2239 3.2239 3 3.5 3 z M 8 3 L 11.5 3 C 11.7761 3 12 3.2239 12 3.5 L 12 6.5 C 12 6.7761 11.7761 7 11.5 7 L 8 7 L 8 3 z M 5 8 C 5.5523 8 6 8.4477 6 9 C 6 9.5523 5.5523 10 5 10 C 4.4477 10 4 9.5523 4 9 C 4 8.4477 4.4477 8 5 8 z M 10 8 C 10.5523 8 11 8.4477 11 9 C 11 9.5523 10.5523 10 10 10 C 9.4477 10 9 9.5523 9 9 C 9 8.4477 9.4477 8 10 8 z M 10.445312 11.994141 C 10.380597 11.999652 10.314981 12.018581 10.253906 12.050781 C 10.030606 12.168381 9.9302313 12.433922 10.019531 12.669922 L 10.189453 13 L 4.8105469 13 L 4.9394531 12.730469 C 5.0371531 12.472169 4.9067375 12.183637 4.6484375 12.085938 C 4.4124375 11.996738 4.1468969 12.097113 4.0292969 12.320312 L 3.0292969 14.320312 C 3.0080969 14.377912 2.9986 14.4387 3 14.5 C 3 14.7761 3.2239 15 3.5 15 C 3.6802 14.999 3.8450875 14.899434 3.9296875 14.740234 L 3.9296875 14.689453 L 4 14.689453 L 4.3105469 14 L 10.689453 14 L 11 14.689453 L 11 14.740234 C 11.0846 14.899434 11.249488 14.999 11.429688 15 C 11.705787 15 11.929688 14.7761 11.929688 14.5 C 11.949587 14.4212 11.949587 14.338566 11.929688 14.259766 L 10.929688 12.259766 C 10.833163 12.076541 10.639459 11.977608 10.445312 11.994141 z","school":"M5.542 3.647 3.106 3l.443-1.63a.505.505 0 0 1 .618-.352l1.46.392a.5.5 0 0 1 .355.613l-.44 1.624Zm-4.52 7.356a.496.496 0 0 1-.005-.276l1.819-6.726 2.435.647-1.819 6.726a.499.499 0 0 1-.143.237l-1.457 1.347a.152.152 0 0 1-.247-.066l-.583-1.889ZM10 5c-2.25 0-3-.75-3-3 2.25 0 3 .75 3 3Zm-1.4 7.984c-1.37.21-3.126-1.706-3.52-3.8L5.969 5.9c.399-.35.903-.533 1.419-.533a2.71 2.71 0 0 1 1.564.489.964.964 0 0 0 1.089-.01 2.438 2.438 0 0 1 1.46-.479c.77 0 1.643.489 2.05 1.201 1.536 2.696-1.194 6.709-3.144 6.417a.867.867 0 0 1-.255-.093 1.427 1.427 0 0 0-1.302 0 .866.866 0 0 1-.25.092Z","park":"M14,5.75c0.0113-0.6863-0.3798-1.3159-1-1.61C12.9475,3.4906,12.4014,2.9926,11.75,3 c-0.0988,0.0079-0.1962,0.0281-0.29,0.06c-0.0607-0.66-0.6449-1.1458-1.3048-1.0851C9.8965,1.9987,9.6526,2.1058,9.46,2.28l0,0 c0-0.6904-0.5596-1.25-1.25-1.25S6.96,1.5896,6.96,2.28C6.96,2.28,7,2.3,7,2.33C6.4886,1.8913,5.7184,1.9503,5.2797,2.4618 C5.1316,2.6345,5.0347,2.8451,5,3.07C4.8417,3.0195,4.6761,2.9959,4.51,3C3.6816,2.9931,3.0044,3.659,2.9975,4.4874 C2.9958,4.6872,3.0341,4.8852,3.11,5.07C2.3175,5.2915,1.8546,6.1136,2.0761,6.9061C2.2163,7.4078,2.6083,7.7998,3.11,7.94 c0.2533,0.7829,1.0934,1.2123,1.8763,0.959C5.5216,8.7258,5.9137,8.2659,6,7.71C6.183,7.8691,6.4093,7.9701,6.65,8v5L5,14h5l-1.6-1 v-2c0.7381-0.8915,1.6915-1.5799,2.77-2c0.8012,0.1879,1.603-0.3092,1.7909-1.1103C12.9893,7.7686,13.0025,7.6444,13,7.52 c0.0029-0.0533,0.0029-0.1067,0-0.16C13.6202,7.0659,14.0113,6.4363,14,5.75z M8.4,10.26V6.82C8.6703,7.3007,9.1785,7.5987,9.73,7.6 h0.28c0.0156,0.4391,0.2242,0.849,0.57,1.12C9.7643,9.094,9.0251,9.6162,8.4,10.26z","town-hall":"M13,4H9l0-3L7.5,0L6,1v3H2L1,5v1h13V5L13,4z M7.5,1.5c0.4,0,0.7,0.3,0.7,0.8S7.9,3,7.5,3S6.7,2.7,6.7,2.2 C6.7,1.8,7.1,1.5,7.5,1.5z M13,7H2v4l-1,1.5V14h13v-1.5L13,11V7z M5,12.5H4V8h1V12.5z M8,12.5H7V8h1V12.5z M11,12.5h-1V8h1V12.5z","golf":"M3.3999,1.1c0,0.1,0,0.2,0,0.2c0,0.4,0.3,0.7,0.7,0.7c0.3,0,0.5-0.2,0.6-0.5l0,0L4.9,1l5.6,2.3L6.6,6C6.2,6.3,6.2,6.7,6.3,7.1 l0.9,2.1l-1.3,3.9C5.7,13.6,6.1,14,6.5,14c0.3,0,0.5-0.1,0.6-0.5l1.4-4l0.1,0.3v3.5c0,0,0,0.7,0.7,0.7s0.7-0.7,0.7-0.7V10 c0-0.2,0-0.3-0.1-0.5L8.5,6.1l2.7-1.9c0.2-0.2,0.4-0.3,0.4-0.6s-0.2-0.5-0.4-0.6L4,0.1c-0.0878,0-0.118,0.0179-0.2001,0.1 L3.3999,1.1z M5.5,3C4.7,3,4,3.7,4,4.5S4.7,6,5.5,6S7,5.3,7,4.5S6.2999,3,5.5,3z","industry":"M14,1v12H1V8.72c0.0016-0.1419,0.0634-0.2764,0.17-0.37l3-3.22c0.2074-0.1823,0.5234-0.1618,0.7056,0.0456 C4.9568,5.268,5.0011,5.387,5,5.51v3l3.16-3.37c0.2025-0.1878,0.5188-0.1759,0.7066,0.0266C8.9532,5.2599,9.0009,5.3827,9,5.51V11h3 V1H14z","airport":"M15,6.8182L15,8.5l-6.5-1 l-0.3182,4.7727L11,14v1l-3.5-0.6818L4,15v-1l2.8182-1.7273L6.5,7.5L0,8.5V6.8182L6.5,4.5v-3c0,0,0-1.5,1-1.5s1,1.5,1,1.5v2.8182 L15,6.8182z","bus":"M2 3C2 1.9 2.9 1 4 1H11C12.1 1 13 1.9 13 3V11C13 12 12 12 12 12V13C12 13.55 11.55 14 11 14C10.45 14 10 13.55 10 13V12H5V13C5 13.55 4.55 14 4 14C3.45 14 3 13.55 3 13V12C2 12 2 11 2 11V3ZM3.5 4C3.22 4 3 4.22 3 4.5V7.5C3 7.78 3.22 8 3.5 8H11.5C11.78 8 12 7.78 12 7.5V4.5C12 4.22 11.78 4 11.5 4H3.5ZM4 9C3.45 9 3 9.45 3 10C3 10.55 3.45 11 4 11C4.55 11 5 10.55 5 10C5 9.45 4.55 9 4 9ZM11 9C10.45 9 10 9.45 10 10C10 10.55 10.45 11 11 11C11.55 11 12 10.55 12 10C12 9.45 11.55 9 11 9ZM4 2.5C4 2.78 4.22 3 4.5 3H10.5C10.78 3 11 2.78 11 2.5C11 2.22 10.78 2 10.5 2H4.5C4.22 2 4 2.22 4 2.5Z","doctor":"M5.5,7C4.1193,7,3,5.8807,3,4.5l0,0v-2C3,2.2239,3.2239,2,3.5,2H4c0.2761,0,0.5-0.2239,0.5-0.5S4.2761,1,4,1H3.5 C2.6716,1,2,1.6716,2,2.5v2c0.0013,1.1466,0.5658,2.2195,1.51,2.87l0,0C4.4131,8.1662,4.9514,9.297,5,10.5C5,12.433,6.567,14,8.5,14 s3.5-1.567,3.5-3.5V9.93c1.0695-0.2761,1.7126-1.367,1.4365-2.4365C13.1603,6.424,12.0695,5.7809,11,6.057 C9.9305,6.3332,9.2874,7.424,9.5635,8.4935C9.7454,9.198,10.2955,9.7481,11,9.93v0.57c0,1.3807-1.1193,2.5-2.5,2.5S6,11.8807,6,10.5 c0.0511-1.2045,0.5932-2.3356,1.5-3.13l0,0C8.4404,6.7172,9.001,5.6448,9,4.5v-2C9,1.6716,8.3284,1,7.5,1H7 C6.7239,1,6.5,1.2239,6.5,1.5S6.7239,2,7,2h0.5C7.7761,2,8,2.2239,8,2.5v2l0,0C8,5.8807,6.8807,7,5.5,7 M11.5,9 c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S12.0523,9,11.5,9z","college":"M7.5,1L0,4.5l2,0.9v1.7C1.4,7.3,1,7.9,1,8.5s0.4,1.2,1,1.4V10l-0.9,2.1 C0.8,13,1,14,2.5,14s1.7-1,1.4-1.9L3,10c0.6-0.3,1-0.8,1-1.5S3.6,7.3,3,7.1V5.9L7.5,8L15,4.5L7.5,1z M11.9,7.5l-4.5,2L5,8.4v0.1 c0,0.7-0.3,1.3-0.8,1.8l0.6,1.4v0.1C4.9,12.2,5,12.6,4.9,13c0.7,0.3,1.5,0.5,2.5,0.5c3.3,0,4.5-2,4.5-3L11.9,7.5L11.9,7.5z","grocery":"M 13.199219 1.5 C 13.199219 1.5 11.808806 1.4588 11.253906 2 C 10.720406 2.5202 10.5 2.9177 10.5 4 L 1.1992188 4 L 2.59375 8.8144531 C 2.59725 8.8217531 2.6036219 8.8287375 2.6074219 8.8359375 C 2.8418219 9.4932375 3.4545469 9.9666406 4.1855469 9.9941406 C 4.1885469 9.9954406 4.1992187 10 4.1992188 10 L 10.699219 10 L 10.699219 10.199219 C 10.699219 10.199219 10.7 10.500391 10.5 10.900391 C 10.3 11.300391 10.200391 11.5 9.4003906 11.5 L 2.9003906 11.5 C 1.9003906 11.5 1.9003906 13 2.9003906 13 L 4.0996094 13 L 4.1992188 13 L 9.0996094 13 L 9.1992188 13 L 9.3007812 13 C 10.500781 13 11.399219 12.299609 11.699219 11.599609 C 11.999219 10.899609 12 10.300781 12 10.300781 L 12 10 L 12 4 C 12 3.4764 12.228619 3 12.699219 3 L 13.25 3 C 13.6642 3 14 2.6642 14 2.25 C 14 1.8358 13.6642 1.5 13.25 1.5 L 13.199219 1.5 z M 9.1992188 13 C 8.5992188 13 8.1992188 13.4 8.1992188 14 C 8.1992188 14.6 8.5992187 15 9.1992188 15 C 9.7992187 15 10.199219 14.6 10.199219 14 C 10.199219 13.4 9.7992188 13 9.1992188 13 z M 4.1992188 13 C 3.5992188 13 3.1992188 13.4 3.1992188 14 C 3.1992188 14.6 3.5992187 15 4.1992188 15 C 4.7992188 15 5.1992188 14.6 5.1992188 14 C 5.1992188 13.4 4.7992187 13 4.1992188 13 z","stadium":"M7,1v2v1.5v0.5098C4.1695,5.1037,2.0021,5.9665,2,7v4.5c0,1.1046,2.4624,2,5.5,2s5.5-0.8954,5.5-2V7 c-0.0021-1.0335-2.1695-1.8963-5-1.9902V4.0625L11,2.75L7,1z M3,8.1465c0.5148,0.2671,1.2014,0.4843,2,0.6328v2.9668 C3.7948,11.477,3,11.0199,3,10.5V8.1465z M12,8.1484V10.5c0,0.5199-0.7948,0.977-2,1.2461V8.7812 C10.7986,8.6328,11.4852,8.4155,12,8.1484z M6,8.9219C6.4877,8.973,6.9925,8.9992,7.5,9C8.0073,8.9999,8.5121,8.9743,9,8.9238 v2.9844C8.5287,11.964,8.0288,12,7.5,12S6.4713,11.964,6,11.9082V8.9219z","bridge":"m0 6.84201v4.15799h2v-1c.036-1.08899.911-1.96399 2-1.99999 1.089.036 1.964.911 2 1.99999v1h3v-1c.036-1.08899.911-1.96399 2-1.99999 1.089.036 1.964.911 2 1.99999v1h2v-4.15799c-4.4-5.76-11.929-4.442-15 0zm9.5-3.108c.514.121 1.016.289 1.5.5v2.766h-1.5zm-.5-.1v3.366h-1.5v-3.494c.503 0 1.005.043 1.5.128zm-5.5.843c.48-.248.982-.451 1.5-.606v3.129h-1.5zm2 2.523v-3.27c.493-.115.995-.187 1.5-.215v3.485zm-2.5-2.256v2.256h-2.5c.676-.906 1.532-1.672 2.5-2.256zm8.5 2.256v-2.5l-.053-.053c1.202.603 2.247 1.477 3.053 2.553z"},
    MkC = {},
    mkPath = e => {
        let t = MkD[e] || MkD[Mk[e]];
        return !t || typeof Path2D > "u" ? null : MkC[t] || (MkC[t] = new Path2D(t))
    },
    Wt = e => new Promise(t => setTimeout(t, e)),
    fi = (e, t = 0, i = 1) => Math.max(t, Math.min(i, e)),
    ye = e => (e = fi(e), e * e * (3 - 2 * e)),
    Ge = (e, t, i) => e + (t - e) * i,
    Te = (e, t) => `${e} ${t}px ${Ff}"Segoe UI","Helvetica Neue",Arial,sans-serif`,
    bn = e => (e + 180) / 360,
    vn = e => {
        let t = Math.sin(e * ht);
        return .5 - Math.log((1 + t) / (1 - t)) / (4 * Math.PI)
    },
    lt = (e, t, i = 4) => e.x0 < t.x1 + i && e.x1 > t.x0 - i && e.y0 < t.y1 + i && e.y1 > t.y0 - i,
    oa = (e, t) => {
        let n = (t.lat - e.lat) * ht,
            a = (t.lon - e.lon) * ht,
            o = Math.sin(n / 2) ** 2 + Math.cos(e.lat * ht) * Math.cos(t.lat * ht) * Math.sin(a / 2) ** 2;
        return 2 * 6371 * Math.asin(Math.sqrt(o))
    },
    xo = {
        bv: "benh vien",
        dh: "dai hoc",
        tttm: "trung tam thuong mai",
        kcn: "khu cong nghiep",
        thpt: "truong thpt",
        sb: "san bay",
        q: "quan",
        tp: "thanh pho"
    },
    aa = e => String(e || "").toLowerCase().normalize("NFD").replace(new RegExp("\\p{M}", "gu"), "").replace(/đ/g, "d").replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean).map(t => xo[t] || t).join(" ").split(" ").filter(Boolean),
    ko = (e, t) => {
        let i = aa(e),
            n = new Set(aa(t));
        return i.length ? i.filter(a => n.has(a)).length / i.length : 0
    },
    Mo = e => aa(e).join("-") || "du-an",
    Hx = e => {
        let t = /^#?([0-9a-f]{6})$/i.exec(String(e || "").trim());
        return t ? [0, 2, 4].map(i => parseInt(t[1].slice(i, i + 2), 16)) : null
    },
    Rg = e => "#" + e.map(t => Math.round(fi(t, 0, 255)).toString(16).padStart(2, "0")).join(""),
    Bp = e => {
        let t = Hx(e) || [240, 83, 28],
            i = a => Rg(t.map(o => o + (a > 0 ? (255 - o) * a : o * a))),
            n = (.299 * t[0] + .587 * t[1] + .114 * t[2]) / 255;
        return {
            m: [i(.45), i(.2), Rg(t), i(-.38), i(.32)],
            flat: Rg(t),
            txt: n > .6 ? "#1a1a1a" : "#ffffff"
        }
    },
    Pb = (e, t) => {
        if (!e.logo) throw new Error("brandMode 'project' c\u1EA7n brand.logo (URL logo ch\u1EE7 \u0111\u1EA7u t\u01B0)");
        let i = Hx(e.primary) || [31, 58, 95];
        return {
            name: e.name || "",
            tagline: e.tagline || "",
            website: e.website || "",
            hotline: "",
            role: "",
            primary: Rg(i),
            accent: Hx(e.accent) ? Rg(Hx(e.accent)) : "#E0A526",
            plate: e.plate || "#FFFFFF",
            card: e.card || `rgba(${i.map(a=>Math.round(a*.42)).join(",")},.93)`,
            logo: e.logo,
            logoAR: 2.5,
            font: e.font || "",
            fontUrl: e.fontUrl || "",
            project: !0,
            ...t.brandMode !== "project-only" ? {
                avi: {
                    logoAR: xn.avi.logoAR,
                    plate: xn.avi.plate
                },
                website: xn.avi.website,
                tagline: xn.avi.tagline
            } : {},
            ...t.hotline !== void 0 ? {
                hotline: t.hotline
            } : {},
            ...t.website !== void 0 ? {
                website: t.website
            } : {},
            ...t.role !== void 0 ? {
                role: t.role
            } : {}
        }
    },
    Lb = async e => {
        let t = /^data:|cdn\.jsdelivr\.net|raw\.githubusercontent\.com|wsrv\.nl/.test(e.logo) ? [e.logo] : [e.logo, Px(e.logo)];
        for (let i of t) try {
            let n = await fetch(i);
            if (n.ok) return await createImageBitmap(await n.blob())
        } catch {}
        return null
    };

function Eo(e, t, i, n) {
    let a = ra[e];
    if (!a) throw new Error("format kh\xF4ng h\u1EE3p l\u1EC7: " + e);
    let {
        W: o,
        H: f,
        M: d,
        YMIN: v,
        CX0: S,
        CY0: u
    } = a, [b, x] = a.out[i.res] || a.out[1080], T = b / o, O = a.PHI * ht, k = a.PHI0 * ht, {
        P: W,
        pois: J
    } = t, H = J.length, M = i.brandObj, X = i.introDur || (M ? 4 : 3.5), de = i.outroDur || (M ? 5 : 3.5), br = fi(+i.bright || 0), ie = X + Ce * H, qe = ie + de, zt = 1.3, ze = M ? "brand" : "gold", Ut = f - a.card.bottom - a.card.h, ha = f - a.outro.bottom - a.outro.h, fa = {
        x0: a.card.x,
        y0: Ut,
        x1: a.card.x + a.card.w,
        y1: f - a.card.bottom
    }, da = {
        x0: a.outro.x,
        y0: ha,
        x1: a.outro.x + a.outro.w,
        y1: f - a.outro.bottom
    }, Mn = (l, c) => ({
        x0: l.x0 - c,
        y0: l.y0 - c,
        x1: l.x1 + c,
        y1: l.y1 + c
    }), En = f - a.card.bottom, ci = l => a.rail && l.y1 > a.rail.y0 && l.y0 < a.rail.y1 ? a.rail.x1 : o - d, _n = Math.max(1, Math.ceil(Math.max(...J.map(l => oa(W, l))))), ui = (i.marker === "logo" || i.marker === "image") && i.markerBmp ? i.marker : "pin", ca = X, Ft = document.createElement("canvas");
    Ft.width = b, Ft.height = x;
    let s = Ft.getContext("2d");
    s.imageSmoothingQuality = "high";
    let Ji = [],
        Se = (l, c, m, w, y, p) => Ji.push({
            kind: l,
            x0: c,
            y0: m,
            x1: w,
            y1: y,
            id: p
        }),
        Ke = (l, c, m) => {
            let w = s.createLinearGradient(0, c, 0, m);
            return [0, .3, .55, .8, 1].forEach((y, p) => w.addColorStop(y, De[l].m[p])), w
        };

    function ae(l, c, m, w, y) {
        let p = m;
        for (s.font = Te(c, p); s.measureText(l).width > y && p > w;) p -= 1, s.font = Te(c, p);
        return p
    }
    let Ve = [bn(W.lon), vn(W.lat)],
        mi = J.map(l => {
            let c = l.coords.map(w => [bn(w[0]), vn(w[1])]),
                m = [0];
            for (let w = 1; w < c.length; w++) m.push(m[w - 1] + Math.hypot(c[w][0] - c[w - 1][0], c[w][1] - c[w - 1][1]));
            return {
                p: l,
                pts: c,
                cum: m,
                end: c[c.length - 1]
            }
        });

    function pi(l) {
        let c = Math.cos(l),
            m = Math.sin(l),
            w = v - u,
            y = ve * c + w * m,
            p = y / (ve * c),
            g = f - u,
            C = ve * c + g * m;
        return {
            c,
            s: m,
            FU: Math.max(S, o - S) / p + 10,
            VF: -(w * ve / y) + 10,
            VB: g * ve / C + 10
        }
    }
    let wi = 0,
        gi = 0,
        Zi = 0;
    for (let l = 0; l <= 20; l++) {
        let c = pi(Ge(k, O, l / 20));
        wi = Math.max(wi, c.FU), gi = Math.max(gi, c.VF), Zi = Math.max(Zi, c.VB)
    }
    let es = wi + 10,
        ts = gi + 10,
        yi = document.createElement("canvas");
    yi.width = Math.ceil((2 * wi + 20) * T), yi.height = Math.ceil((gi + Zi + 20) * T);
    let bi = yi.getContext("2d");

    function ua(l) {
        let c = pi(l.phi),
            m = 256 * 2 ** l.z;
        return (w, y) => {
            let p = (w - Ve[0]) * m,
                g = (y - Ve[1]) * m,
                C = ve - g * c.s;
            if (C < 5) return [0, -9999, .1];
            let z = ve / C;
            return [S + p * z, u + z * g * c.c, z]
        }
    }

    function ma(l, c) {
        for (let m = 16.2; m > 8; m -= .02) {
            let w = ua({
                    z: m,
                    phi: O
                }),
                y = !0;
            for (let p of l) {
                let g = w(p[0], p[1]);
                if (g[0] < c.x0 || g[0] > c.x1 || g[1] < c.y0 || g[1] > c.y1) {
                    y = !1;
                    break
                }
            }
            if (y) return {
                z: m,
                phi: O
            }
        }
        return {
            z: 9,
            phi: O
        }
    }
    let vi = mi.map(l => ma([Ve, ...l.pts], a.fit)),
        pa = ma([Ve, ...mi.flatMap(l => l.pts)], a.fitOut),
        An = {
            z: 12.8,
            phi: k
        },
        wa = {
            z: 15,
            phi: O
        },
        is = (l, c, m) => ({
            z: Ge(l.z, c.z, m),
            phi: Ge(l.phi, c.phi, m)
        });

    function ga(l) {
        if (l < X) return is(An, wa, ye(l / X));
        if (l >= ie) return is(vi[H - 1], pa, ye((l - ie) / 1.8));
        let c = Math.min(H - 1, Math.floor((l - X) / Ce)),
            m = X + Ce * c;
        return is(c === 0 ? wa : vi[c - 1], vi[c], ye((l - m) / 1.4))
    }
    let Bn = Math.log2(T) - .4;

    function ya(l) {
        let c = Math.max(1, Math.min(i.maxZoom, Math.ceil(l.z + Bn))),
            m = 2 ** c,
            w = 256 * 2 ** (l.z - c),
            y = pi(l.phi),
            p = Ve[0] * m,
            g = Ve[1] * m,
            C = Math.floor(p - y.FU / w),
            z = Math.floor(p + y.FU / w),
            $ = Math.floor(g - y.VF / w),
            R = Math.floor(g + y.VB / w),
            L = [];
        for (let _ = C; _ <= z; _++)
            for (let U = $; U <= R; U++) L.push([c, _, U, p, g, w]);
        return L
    }

    function ba(l) {
        return ya(ga(l)).map(([c, m, w]) => c + "/" + m + "/" + w)
    }
    let Ti = 1, Bq = 0, Ha = 0;

    function In(l) {
        let c = pi(l.phi);
        bi.setTransform(T, 0, 0, T, 0, 0), bi.fillStyle = "#0a0f1c", bi.fillRect(es - c.FU, ts - c.VF, 2 * c.FU, c.VF + c.VB);
        bi.filter = br > 0 ? `brightness(${1+.22*br}) contrast(${1+.05*br}) saturate(${1+.15*br})` : "none";
        for (let [m, w, y, p, g, C] of ya(l)) {
            let z = n.src(m + "/" + w + "/" + y);
            z && bi.drawImage(z.b, z.sx, z.sy, z.sw, z.sw, es + (w - p) * C, ts + (y - g) * C, C + .7 / T, C + .7 / T)
        }
        if (bi.filter = "none", bi.globalAlpha = 1 - Bq, i.rd)
            for (let [m, w, y, p, g, C] of ya(l)) {
                let z = i.rd.src(m + "/" + w + "/" + y);
                z && bi.drawImage(z.b, z.sx, z.sy, z.sw, z.sw, es + (w - p) * C, ts + (y - g) * C, C + .7 / T, C + .7 / T)
            }
        bi.globalAlpha = 1, s.setTransform(1, 0, 0, 1, 0, 0);
        for (let m = Math.floor(v * T); m < x; m += Ti) {
            let w = m / T,
                y = (m + Ti) / T,
                p = w - u,
                g = ve * c.c + p * c.s,
                C = y - u,
                z = ve * c.c + C * c.s,
                $ = p * ve / g,
                R = C * ve / z,
                L = g / (ve * c.c),
                _ = o / L;
            s.drawImage(yi, (es - _ * S / o) * T, (ts + $) * T, _ * T, Math.max(R - $, .6 / T) * T, 0, m, b, Ti + .4)
        }
    }
    let va = (l, A) => {
        let c = l * (A || M.logoAR),
            m = l * .35,
            w = l * .25;
        return {
            w: c,
            px: m,
            py: w,
            pw: c + 2 * m,
            ph: l + 2 * w
        }
    };

    function Si(l, c, m, w = 1, y = "logo", A = !1) {
        let K = A && M && M.avi ? M.avi : M;
        if (!K || !K.img) return;
        let p = va(m, K.logoAR),
            g = l - p.pw / 2,
            C = c - p.ph / 2;
        return s.save(), s.globalAlpha = w, s.shadowColor = "rgba(0,0,0,.35)", s.shadowBlur = m * .4, s.beginPath(), s.roundRect(g, C, p.pw, p.ph, p.ph * .28), s.fillStyle = K.plate, s.fill(), s.shadowColor = "transparent", s.drawImage(K.img, g + p.px, C + p.py, p.w, m), s.restore(), Se(y, g, C, g + p.pw, C + p.ph), {
            x0: g,
            y0: C,
            x1: g + p.pw,
            y1: C + p.ph
        }
    }
    let Ta = () => d + va(a.logoH, M.avi ? M.avi.logoAR : M.logoAR).pw / 2;

    function Wn(l) {
        if (!M) return;
        if (l >= zt || i.hook && i.heroIn) {
            Si(Ta(), a.topY, a.logoH, 1, "logo", !!M.avi);
            return
        }
        let c = ye(l / .35),
            m = ye((l - .9) / (zt - .9));
        s.save(), s.fillStyle = `rgba(4,10,8,${.45*(1-m)*(1-.75*Ha)})`, s.fillRect(0, 0, o, f), s.restore(), M.avi ? (Si(a.sting.cx, a.sting.cy, a.sting.h, c * (1 - m), "logo-sting"), m > 0 && Si(Ta(), a.topY, a.logoH, m, "logo", !0)) : Si(Ge(a.sting.cx, Ta(), m), Ge(a.sting.cy, a.topY, m), Ge(a.sting.h, a.logoH, m), c, "logo-sting")
    }

    function zn(l, c, m) {
        if (ui === "pin" || m < ca) return null;
        let w = .2 + .8 * ye((m - ca) / .4),
            y = l[1] - 38 * c,
            p = i.markerBmp,
            g = U => {
                let ee = 0;
                return U.x0 < d ? ee = d - U.x0 : U.x1 > o - d && (ee = o - d - U.x1), {
                    x0: U.x0 + ee,
                    y0: U.y0,
                    x1: U.x1 + ee,
                    y1: U.y1
                }
            };
        if (ui === "logo") {
            let ee = Math.min(30 * p.width / p.height, 170),
                he = ee + 24,
                q = 48,
                te = y - 8,
                ce = g({
                    x0: l[0] - he / 2,
                    y0: te - q,
                    x1: l[0] + he / 2,
                    y1: te
                });
            return {
                kind: "logo",
                s: w,
                pinTop: y,
                x: l[0],
                plate: ce,
                w: ee,
                h: 30,
                rects: [ce]
            }
        }
        let C = a.markerD,
            z = C / 2,
            $ = y - 8 - z,
            R = {
                x0: l[0] - z - 3,
                y0: $ - z - 3,
                x1: l[0] + z + 3,
                y1: $ + z + 3
            };
        s.font = Te(700, 13);
        let L = s.measureText(i.name).width + 22,
            _ = g({
                x0: l[0] - L / 2,
                y0: R.y0 - 6 - 22,
                x1: l[0] + L / 2,
                y1: R.y0 - 6
            });
        return {
            kind: "image",
            s: w,
            pinTop: y,
            x: l[0],
            cy: $,
            r: z,
            circ: R,
            lab: _,
            rects: [R, _]
        }
    }

    function Un(l, c) {
        let m = i.markerBmp,
            w = M ? M.accent : De.gold.flat;
        if (s.save(), s.globalAlpha = c, s.translate(l.x, l.pinTop), s.scale(l.s, l.s), s.translate(-l.x, -l.pinTop), s.beginPath(), s.moveTo(l.x - 7, l.pinTop - 9), s.lineTo(l.x + 7, l.pinTop - 9), s.lineTo(l.x, l.pinTop - 1), s.closePath(), s.fillStyle = l.kind === "logo" ? M ? M.plate : "#F7F1E6" : "#fff", s.fill(), s.shadowColor = "rgba(0,0,0,.45)", s.shadowBlur = 12, l.kind === "logo") {
            let y = l.plate,
                p = y.x1 - y.x0,
                g = y.y1 - y.y0;
            s.beginPath(), s.roundRect(y.x0, y.y0, p, g, 10), s.fillStyle = M ? M.plate : "#F7F1E6", s.fill(), s.shadowColor = "transparent", s.lineWidth = 2, s.strokeStyle = w, s.stroke(), s.drawImage(m, y.x0 + (p - l.w) / 2, y.y0 + (g - l.h) / 2, l.w, l.h)
        } else {
            s.beginPath(), s.arc(l.x, l.cy, l.r + 3, 0, 7), s.fillStyle = "#fff", s.fill(), s.shadowColor = "transparent", s.save(), s.beginPath(), s.arc(l.x, l.cy, l.r, 0, 7), s.clip();
            let y = Math.max(2 * l.r / m.width, 2 * l.r / m.height),
                p = m.width * y,
                g = m.height * y;
            s.drawImage(m, l.x - p / 2, l.cy - g / 2, p, g), s.restore(), s.beginPath(), s.arc(l.x, l.cy, l.r + 4.5, 0, 7), s.lineWidth = 2.5, s.strokeStyle = w, s.stroke(), as(l.lab, i.name, ze, 1, !0)
        }
        s.restore()
    }

    function Fn(l, c, m, w) {
        let y = M ? M.accent : De.gold.flat;
        s.save(), s.strokeStyle = y, s.lineWidth = 2;
        for (let p = 0; p < 2; p++) {
            let g = (w * .8 + p * .5) % 1,
                C = (14 + 46 * g) * m;
            s.globalAlpha = .65 * (1 - g), s.beginPath(), s.ellipse(l, c, C, C * .42, 0, 0, 7), s.stroke()
        }
        s.restore()
    }

    function ss(l, c, m, w) {
        s.save(), s.translate(l, c), s.scale(w, w), s.beginPath(), s.ellipse(0, 2, 10, 3.5, 0, 0, 7), s.fillStyle = "rgba(0,0,0,.45)", s.fill(), s.beginPath(), s.moveTo(0, 0), s.bezierCurveTo(-4, -8, -14, -14, -14, -24), s.arc(0, -24, 14, Math.PI, 0), s.bezierCurveTo(14, -14, 4, -8, 0, 0), s.closePath(), s.fillStyle = Ke(m, -38, 0), s.fill(), s.lineWidth = 1.6, s.strokeStyle = "rgba(255,255,255,.85)", s.stroke(), s.beginPath(), s.arc(0, -24, 5.5, 0, 7), s.fillStyle = "rgba(255,255,255,.93)", s.fill(), s.lineWidth = 1.5, s.strokeStyle = De[m].m[3], s.stroke(), s.beginPath(), s.ellipse(-6, -32, 3.2, 6, -.5, 0, 7), s.fillStyle = "rgba(255,255,255,.4)", s.fill(), s.restore()
    }

    function Sa(l, c, m, w, y) {
        s.font = Te(700, 13);
        let p = (s.measureText(w).width + 22) * m,
            g = 24 * m,
            C = 14 * m,
            z = 12 * m,
            $ = 14 * m,
            R = {
                center: {
                    x0: l - p / 2,
                    y0: c - 38 * m - $ - g,
                    x1: l + p / 2,
                    y1: c - 38 * m - $
                },
                left: {
                    x0: l - C - z - p,
                    y0: c - 24 * m - g / 2,
                    x1: l - C - z,
                    y1: c - 24 * m + g / 2
                },
                right: {
                    x0: l + C + z,
                    y0: c - 24 * m - g / 2,
                    x1: l + C + z + p,
                    y1: c - 24 * m + g / 2
                }
            },
            L = q => q.x0 >= d && q.x1 <= ci(q) && q.y0 >= a.labelTop && q.y1 <= En && !y.some(te => lt(q, te)),
            _ = R.center.x1 > ci(R.center) ? ["left", "center", "right"] : R.center.x0 < d ? ["right", "center", "left"] : ["center", "left", "right"];
        for (let q of _)
            if (L(R[q])) return {
                mode: q,
                rect: R[q]
            };
        let U = R.center,
            ee = ci(U),
            he = 0;
        return U.x0 < d ? he = d - U.x0 : U.x1 > ee && (he = ee - U.x1), {
            mode: "center*",
            rect: {
                x0: U.x0 + he,
                y0: U.y0,
                x1: U.x1 + he,
                y1: U.y1
            }
        }
    }

    function as(l, c, m, w, y) {
        let p = l.x1 - l.x0,
            g = l.y1 - l.y0;
        s.beginPath(), s.roundRect(l.x0, l.y0, p, g, g / 2), y ? (s.fillStyle = Ke(m, l.y0, l.y1), s.fill(), s.strokeStyle = "rgba(255,255,255,.7)", s.lineWidth = 1, s.stroke(), s.fillStyle = De[m].txt) : (s.fillStyle = "rgba(8,14,30,.92)", s.fill(), s.strokeStyle = Ke(m, l.y0, l.y1), s.lineWidth = 1.8, s.stroke(), s.fillStyle = "#fff"), s.font = Te(700, 13 * w), s.textAlign = "center", s.textBaseline = "middle", s.fillText(c, (l.x0 + l.x1) / 2, (l.y0 + l.y1) / 2 + .5)
    }

    function ns(l, c, m) {
        let w = c.cum[c.cum.length - 1],
            y = w * m;
        s.beginPath();
        let p = 0,
            g = 0;
        for (let C = 0; C < c.pts.length; C++) {
            let z = l(c.pts[C][0], c.pts[C][1]);
            if (c.cum[C] <= y) C === 0 ? s.moveTo(z[0], z[1]) : s.lineTo(z[0], z[1]), p = z[0], g = z[1];
            else {
                let $ = l(c.pts[C - 1][0], c.pts[C - 1][1]),
                    R = (y - c.cum[C - 1]) / Math.max(c.cum[C] - c.cum[C - 1], 1e-12);
                p = Ge($[0], z[0], R), g = Ge($[1], z[1], R), s.lineTo(p, g);
                break
            }
        }
        return [p, g]
    }

    function Ca(l, c, m, w) {
        if (m <= 0) return null;
        s.save(), s.lineCap = "round", s.lineJoin = "round";
        let y = ns(l, c, m);
        return s.strokeStyle = c.p.color, s.globalAlpha = w * .22, s.lineWidth = 14, s.stroke(), ns(l, c, m), s.globalAlpha = w * .55, s.lineWidth = 7, s.stroke(), ns(l, c, m), s.globalAlpha = w, s.strokeStyle = "#fff", s.lineWidth = 2.2, s.stroke(), s.restore(), y
    }

    function Rn(l, c, m, w) {
        s.save(), s.translate(c, m);
        let y = Ke(w, -15, 15),
            mp = mkPath(l);
        if (s.fillStyle = y, s.strokeStyle = y, mp) s.scale(26 / 15, 26 / 15), s.translate(-7.5, -7.5), s.fillStyle = Ke(w, 0, 15), s.fill(mp);
        else if (l === "Y T\u1EBE") s.fillRect(-4, -13, 8, 26), s.fillRect(-13, -4, 26, 8);
        else if (l === "MUA S\u1EAEM") s.beginPath(), s.moveTo(-13, -3), s.lineTo(13, -3), s.lineTo(9, 12), s.lineTo(-9, 12), s.closePath(), s.fill(), s.lineWidth = 3, s.beginPath(), s.arc(0, -3, 8, Math.PI, 0), s.stroke();
        else if (l === "GI\xC1O D\u1EE4C") s.beginPath(), s.moveTo(0, -11), s.lineTo(15, -3), s.lineTo(0, 5), s.lineTo(-15, -3), s.closePath(), s.fill(), s.fillRect(-8, 1, 16, 8), s.lineWidth = 2, s.beginPath(), s.moveTo(12, -2), s.lineTo(12, 9), s.stroke();
        else if (l === "C\xD4NG VI\xCAN") s.beginPath(), s.arc(0, -4, 10, 0, 7), s.fill(), s.fillRect(-2.5, 4, 5, 10);
        else if (l === "H\xC0NH CH\xCDNH") {
            s.beginPath(), s.moveTo(-14, -6), s.lineTo(0, -14), s.lineTo(14, -6), s.closePath(), s.fill();
            for (let p of [-10, -2, 6]) s.fillRect(p, -4, 4, 13);
            s.fillRect(-14, 10, 28, 3)
        } else s.beginPath(), s.moveTo(14, -14), s.lineTo(-14, -3), s.lineTo(-4, 2), s.lineTo(-1, 13), s.closePath(), s.fill();
        s.restore()
    }

    function xa(l, c, m, w) {
        s.font = Te(700, 14);
        let y = s.measureText(m).width + 24;
        return s.beginPath(), s.roundRect(l, c, y, 28, 14), s.fillStyle = "rgba(255,255,255,.07)", s.fill(), s.strokeStyle = Ke(w, c, c + 28), s.lineWidth = 1.8, s.stroke(), s.fillStyle = "#fff", s.textAlign = "left", s.textBaseline = "middle", s.fillText(m, l + 12, c + 15), y + 8
    }

    function On(l, c, m) {
        let w = l.p,
            y = a.card.w,
            p = a.card.h,
            g = a.card.x,
            C = Ut + (1 - ye(m)) * 50;
        s.save(), s.globalAlpha = ye(m), s.beginPath(), s.roundRect(g, C, y, p, 18), s.fillStyle = M ? M.card : "rgba(9,16,38,.93)", s.fill(), s.strokeStyle = "rgba(255,255,255,.14)", s.lineWidth = 1, s.stroke(), M && (s.save(), s.clip(), s.fillStyle = M.accent, s.fillRect(g, C, 5, p), s.restore());
        let z = g + 44,
            $ = C + p / 2;
        s.beginPath(), s.arc(z, $, 28, 0, 7), s.fillStyle = "rgba(255,255,255,.05)", s.fill(), s.save(), s.translate(z, $), s.beginPath(), s.arc(0, 0, 28, 0, 7), s.strokeStyle = Ke(w.sty, -28, 28), s.lineWidth = 3, s.stroke(), s.restore(), Rn(w.icon || w.cat, z, $, w.sty);
        let R = g + 88,
            L = y - 88 - 18,
            _ = C + (p - 108) / 2;
        s.textAlign = "left", s.textBaseline = "middle", s.font = Te(700, 12), s.fillStyle = w.color, s.fillText(`${w.cat} \xB7 0${c+1}/0${H}`, R, _ + 26);
        let U = ae(w.name, 700, 20, 13, L);
        s.font = Te(700, U), s.fillStyle = "#fff", s.fillText(w.name, R, _ + 52);
        let ee = s.measureText(w.name).width,
            he = R;
        he += xa(he, _ + 66, w.km.toFixed(1).replace(".", ",") + " km", w.sty);
        let q = he + xa(he, _ + 66, `~${Math.max(1,Math.round(w.min))} ph\xFAt ${i.travel === "moto" ? "xe m\xE1y" : "l\xE1i xe"}`, w.sty) - 8;
        s.restore(), m >= 1 && (Se("card", g, C, g + y, C + p), Se("cardtext", R, _ + 40, R + ee, _ + 64), Se("cardtext", R, _ + 66, q, _ + 94))
    }

    function Nn(l) {
        let c = s.createLinearGradient(0, 0, 0, a.topFade);
        c.addColorStop(0, `rgba(3,6,16,${.8-.3*Ha})`), c.addColorStop(1, "rgba(3,6,16,0)"), s.fillStyle = c, s.fillRect(0, 0, o, a.topFade), s.textBaseline = "middle", M ? (s.textAlign = "right", s.font = Te(800, 12), s.fillStyle = M.accent, s.fillText(i.name, o - d, a.topY - 7), s.font = Te(600, 11), s.fillStyle = "rgba(255,255,255,.75)", s.fillText(i.area, o - d, a.topY + 8)) : (s.font = Te(700, 12), s.textAlign = "left", s.fillStyle = De.gold.flat, s.fillText("\u25CF " + i.name, d, a.topY), s.textAlign = "right", s.fillStyle = "rgba(255,255,255,.7)", s.fillText(i.area, o - d, a.topY));
        let m = 6,
            w = (o - 2 * d - (H - 1) * m) / H;
        for (let y = 0; y < H; y++) {
            let p = d + y * (w + m);
            s.fillStyle = "rgba(255,255,255,.18)", s.fillRect(p, a.progY, w, 4);
            let g = X + Ce * y,
                C = l >= ie ? 1 : fi((l - g) / Ce);
            C > 0 && (s.fillStyle = J[y].color, s.fillRect(p, a.progY, w * C, 4))
        }
    }

    function Pn(l) {
        let m = (i.hook && i.heroIn ? ye((l - i.hero.dur + .2) / .5) : ye((l - (M ? 1.2 : .2)) / .6)) * (1 - ye((l - (X - .5)) / .5));
        if (m <= 0) return;
        let w = a.intro;
        s.save(), s.globalAlpha = m, s.textAlign = w.align, s.textBaseline = "middle", s.shadowColor = "rgba(0,0,0,.7)", s.shadowBlur = 14;
        let y = [
            [i.intro[0], 800, w.size, w.min, "#fff", w.y[0]],
            [i.intro[1], 800, w.size, w.min, M ? M.accent : De.gold.flat, w.y[1]],
            [i.subtitle, 600, w.sub, 13, "#fff", w.y[2]]
        ];
        for (let [p, g, C, z, $, R] of y) {
            if (!p) continue;
            let L = ae(p, g, C, z, w.maxW);
            s.fillStyle = $, s.fillText(p, w.x, R);
            let _ = s.measureText(p).width,
                U = w.align === "left" ? w.x : w.x - _ / 2;
            Se("text", U, R - L / 2, U + _, R + L / 2)
        }
        s.restore()
    }

    function rs(l, c, m, w, y) {
        s.beginPath(), s.roundRect(l, c, m, w, w / 2), M ? (s.fillStyle = M.accent, s.fill(), s.fillStyle = "#fff") : (s.fillStyle = Ke("gold", c, c + w), s.fill(), s.strokeStyle = "rgba(255,255,255,.7)", s.lineWidth = 1, s.stroke(), s.fillStyle = De.gold.txt), ae(y, 800, 16, 11, m - 24), s.textAlign = "center", s.fillText(y, l + m / 2, c + w / 2 + 1)
    }

    function Dn(l) {
        let c = ye((l - ie - .6) / .8);
        if (c <= 0) return;
        let m = a.outro,
            w = m.h,
            y = m.x,
            p = m.w,
            g = ha + (1 - c) * 60;
        s.save(), s.globalAlpha = c, s.beginPath(), s.roundRect(y, g, p, w, 20), s.fillStyle = M ? M.card : "rgba(9,16,38,.94)", s.fill(), s.strokeStyle = "rgba(255,255,255,.14)", s.lineWidth = 1, s.stroke(), s.textAlign = "center", s.textBaseline = "middle";
        let C = `${H} ti\u1EC7n \xEDch \xB7 trong b\xE1n k\xEDnh ${_n} km`,
            z = M && M.hotline ? `HOTLINE ${M.hotline}` : i.cta,
            $ = M ? [M.role, M.website].filter(Boolean).join(" \xB7 ") : "";
        if (M)
            if (m.split) {
                let R = p * .52,
                    L = y + R / 2,
                    _ = y + R + (p - R) / 2,
                    U = R - 36,
                    ee = p - R - 32;
                ae(i.name, 800, 24, 14, U), s.fillStyle = "#fff", s.fillText(i.name, L, g + 34), i.tagline && (ae(i.tagline, 500, 12, 9, U), s.fillStyle = "rgba(255,255,255,.7)", s.fillText(i.tagline, L, g + 58)), ae(C, 700, 12, 9, U), s.fillStyle = M.accent, s.fillText(C, L, g + 80), rs(y + 18, g + 100, R - 36, 44, z), $ && (ae($, 700, 12, 9, U), s.fillStyle = "rgba(255,255,255,.85)", s.fillText($, L, g + 164)), s.fillStyle = "rgba(255,255,255,.15)", s.fillRect(y + R, g + 20, 1, w - 40), s.restore(), Si(_, g + 74, 40, c, "logo-end", !!M.avi), s.save(), s.globalAlpha = c, s.textAlign = "center", s.textBaseline = "middle", s.letterSpacing = "2px", ae(M.tagline, 700, 10, 7, ee), s.fillStyle = "rgba(255,255,255,.85)", s.fillText(M.tagline, _, g + 124), s.letterSpacing = "0px", ae(i.note, 500, 9, 7, ee), s.fillStyle = "rgba(255,255,255,.45)", s.fillText(i.note, _, g + 172)
            } else {
                let R = y + p / 2,
                    L = p - 40;
                ae(i.name, 800, 24, 15, L), s.fillStyle = "#fff", s.fillText(i.name, R, g + 32), i.tagline && (ae(i.tagline, 500, 12, 9, L), s.fillStyle = "rgba(255,255,255,.7)", s.fillText(i.tagline, R, g + 56)), ae(C, 700, 12, 9, L), s.fillStyle = M.accent, s.fillText(C, R, g + 78), s.fillStyle = "rgba(255,255,255,.15)", s.fillRect(y + 24, g + 96, p - 48, 1), s.restore(), Si(R, g + 133, 34, c, "logo-end", !!M.avi), s.save(), s.globalAlpha = c, s.textAlign = "center", s.textBaseline = "middle", s.letterSpacing = "2px", ae(M.tagline, 700, 10, 8, L), s.fillStyle = "rgba(255,255,255,.85)", s.fillText(M.tagline, R, g + 176), s.letterSpacing = "0px", rs(y + 28, g + 192, p - 56, 44, z), $ && (ae($, 700, 12, 9, L), s.fillStyle = "rgba(255,255,255,.85)", s.fillText($, R, g + 252)), ae(i.note, 500, 9, 7, L), s.fillStyle = "rgba(255,255,255,.45)", s.fillText(i.note, R, g + 268)
            }
        else {
            let R = y + p / 2,
                L = p - 40;
            ae(i.name, 800, 26, 16, L), s.fillStyle = "#fff", s.fillText(i.name, R, g + 36), ae(i.tagline, 500, 13, 10, L), s.fillStyle = "rgba(255,255,255,.7)", s.fillText(i.tagline, R, g + 66), rs(y + 28, g + 90, p - 56, 48, i.cta), ae(i.note, 500, 10, 8, L), s.fillStyle = "rgba(255,255,255,.45)", s.fillText(i.note, R, g + 158)
        }
        s.restore(), c >= 1 && Se("card", y, g, y + p, g + w)
    }

    function Pp(q, c, m, w, y, pr) {
        if (!q.p.photoBmp) return null;
        let p = ye((w - 3.5) / .35) * fi((Ce - .2 - w) / .3);
        if (p <= 0) return null;
        let A = {
                x0: c[0] - 14 * m,
                y0: c[1] - 38 * m,
                x1: c[0] + 14 * m,
                y1: c[1]
            },
            z = a.labelTop + 8,
            $ = f - a.card.bottom - a.card.h - 24,
            cz = {
                x0: o * .36,
                y0: z + ($ - z) * .3,
                x1: o * .64,
                y1: z + ($ - z) * .7
            },
            pz = pr ? {
                x0: pr.x0 - o * .1,
                y0: pr.y0 - o * .14,
                x1: pr.x1 + o * .1,
                y1: pr.y1 + o * .05
            } : null;
        for (let k of [.85, .7, .6]) {
            let g = Math.round(o * (e === "16:9" ? .27 : .4) * k),
                C = Math.round(g * .68),
                B = null;
            for (let R = z; R <= $ - C; R += 12)
                for (let L = d + 5; L <= o - d - g - 5; L += 12) {
                    let _ = {
                        x0: L - 4,
                        y0: R - 4,
                        x1: L + g + 4,
                        y1: R + C + 4
                    };
                    if (lt(_, A, 10) || lt(_, cz, 0) || pz && lt(_, pz, 0) || y.some(U => lt(_, U, 6))) continue;
                    let D = Math.hypot(L + g / 2 - c[0], R + C / 2 - c[1]);
                    (!B || D < B.D) && (B = {
                        r: _,
                        D
                    })
                }
            if (B) return {
                r: B.r,
                a: p,
                s: .6 + .4 * ye((w - 3.5) / .35)
            }
        }
        return null
    }

    function Pd(l, c) {
        let m = l.r,
            w = m.x1 - m.x0 - 8,
            y = m.y1 - m.y0 - 8,
            p = (m.x0 + m.x1) / 2,
            g = (m.y0 + m.y1) / 2;
        s.save(), s.globalAlpha = l.a, s.translate(p, g), s.scale(l.s, l.s), s.translate(-p, -g), s.shadowColor = "rgba(0,0,0,.45)", s.shadowBlur = 18, s.beginPath(), s.roundRect(m.x0, m.y0, w + 8, y + 8, 12), s.fillStyle = "#fff", s.fill(), s.shadowColor = "transparent", s.beginPath(), s.roundRect(m.x0 + 4, m.y0 + 4, w, y, 9), s.clip();
        let C = Math.max(w / c.width, y / c.height),
            z = c.width * C,
            $ = c.height * C;
        s.drawImage(c, p - z / 2, g - $ / 2, z, $), s.restore(), l.a >= .99 && Se("text", m.x0, m.y0, m.x1, m.y1, "photo")
    }

    function Hd(l) {
        let A = 0,
            B = null,
            k = 0,
            Ho = Math.min(2.5, (qe - ie) * .4);
        if (Ha = 0, i.heroIn && l < i.hero.dur + .6) B = i.heroIn, A = l < i.hero.dur ? 1 : 1 - ye((l - i.hero.dur) / .6), k = l / (i.hero.dur + .6);
        else if (i.heroOut && l >= ie + Ho) B = i.heroOut, A = ye((l - ie - Ho) / .7), k = (l - ie - Ho) / Math.max(1, qe - ie - Ho);
        if (!B || A <= 0) return;
        Ha = A;
        let sc = 1.04 + .08 * k,
            r = Math.max(o / B.width, f / B.height) * sc,
            dw = B.width * r,
            dh = B.height * r;
        s.save(), s.globalAlpha = A, s.filter = "brightness(1.08) saturate(1.15) contrast(1.04)", s.drawImage(B, (o - dw) / 2, (f - dh) / 2 - .015 * f * k, dw, dh), s.filter = "none";
        let g = s.createLinearGradient(0, 0, 0, f * .45);
        g.addColorStop(0, "rgba(0,0,0,.34)"), g.addColorStop(1, "rgba(0,0,0,0)"), s.fillStyle = g, s.fillRect(0, 0, o, f * .45), g = s.createLinearGradient(0, f * .72, 0, f), g.addColorStop(0, "rgba(0,0,0,0)"), g.addColorStop(1, "rgba(0,0,0,.3)"), s.fillStyle = g, s.fillRect(0, f * .72, o, f * .28), s.restore(), B === i.heroIn && i.hook && Hk(l)
    }

    function Hk(l) {
        let A = 1 - ye((l - (i.hero.dur - .45)) / .45);
        if (A <= 0) return;
        let [h1, h2, h3] = i.hook, z = 1 + .06 * (1 - ye(l / .45)), cx = o / 2, cy = f * .3, W = o * .86;
        s.save(), s.globalAlpha = A, s.translate(cx, cy), s.scale(z, z), s.translate(-cx, -cy), s.textAlign = "center", s.textBaseline = "middle";
        let b1 = h1 ? ae(h1, 900, Math.round(o * .19), Math.round(o * .08), W) : 0;
        if (h3) {
            let b3 = ae(h3, 700, Math.round(o * .03), 10, W - 30), w3 = s.measureText(h3).width + 28, y3 = cy - b1 * .62 - b3;
            s.fillStyle = "rgba(0,0,0,.42)", s.beginPath(), s.roundRect(cx - w3 / 2, y3 - b3 * .9, w3, b3 * 1.8, b3 * .9), s.fill(), s.fillStyle = "#fff", s.fillText(h3, cx, y3 + 1)
        }
        h1 && (s.font = Te(900, b1), s.shadowColor = "rgba(0,0,0,.55)", s.shadowBlur = 22, s.shadowOffsetY = 3, s.fillStyle = "#fff", s.fillText(h1, cx, cy), s.shadowColor = "transparent");
        if (h2) {
            let b2 = ae(h2, 800, Math.round(o * .058), 12, W - 40), w2 = s.measureText(h2).width + 40, y2 = cy + b1 * .55 + b2 * .9;
            s.fillStyle = M ? M.primary || M.card || "#21362C" : "#0b1a33", s.beginPath(), s.roundRect(cx - w2 / 2, y2 - b2 * .85, w2, b2 * 1.7, 10), s.fill(), s.fillStyle = M ? M.accent : De.gold.flat, s.fillRect(cx - w2 / 2 + 10, y2 + b2 * .85 - 3, w2 - 20, 3), s.fillStyle = "#fff", s.fillText(h2, cx, y2 + 1)
        }
        s.restore()
    }

    function Cp(l, c) {
        if (i.hook && i.heroIn && l < i.hero.dur) return null;
        let m = i.caps && i.caps.find(z0 => l >= z0.t0 && l < z0.t1);
        if (!m) return null;
        let w = e === "16:9" ? 18 : 17,
            cw = c.x1 - c.x0 - 20,
            cx = (c.x0 + c.x1) / 2,
            y = cw - 28,
            p = [""];
        s.font = Te(700, w);
        for (let g of String(m.text).split(/\s+/).filter(Boolean)) {
            let C = p[p.length - 1] ? p[p.length - 1] + " " + g : g;
            s.measureText(C).width > y && p[p.length - 1] ? p.push(g) : p[p.length - 1] = C
        }
        p = p.slice(0, 2);
        let g = w + 6,
            C = p.length * g + 14,
            z = Math.min(cw, Math.max(...p.map(L => s.measureText(L).width)) + 28),
            $ = c.y0 - 4,
            R = cx - z / 2;
        return {
            ln: p,
            cx: cx,
            fs: w,
            lh: g,
            r: {
                x0: R,
                y0: $ - C,
                x1: R + z,
                y1: $
            },
            a: fi(Math.min((l - m.t0) / .15, (m.t1 - l) / .15))
        }
    }

    function Cd(l) {
        let c = l.r;
        s.save(), s.globalAlpha = l.a, s.beginPath(), s.roundRect(c.x0, c.y0, c.x1 - c.x0, c.y1 - c.y0, 12), s.fillStyle = "rgba(6,10,20,.78)", s.fill(), s.font = Te(700, l.fs), s.textAlign = "center", s.textBaseline = "middle", s.fillStyle = "#fff";
        l.ln.forEach((m, w) => s.fillText(m, l.cx, c.y0 + 7 + l.lh / 2 + w * l.lh));
        s.restore(), Se("text", c.x0, c.y0, c.x1, c.y1, "cap")
    }

    function os(l, c = !0) {
        Ji = [], Bq = i.bgBlur ? i.bgBlur * (l < X ? 1 - ye((l - X + 1) / 1) : l >= ie ? ye((l - ie) / .8) : 0) : 0;
        let m = ga(l),
            w = ua(m);
        s.setTransform(1, 0, 0, 1, 0, 0), s.fillStyle = "#0a0f1c", s.fillRect(0, 0, b, x), c && In(m), c && Bq > .02 && (s.save(), s.setTransform(1, 0, 0, 1, 0, 0), s.filter = `blur(${(Bq*3.5*T).toFixed(1)}px) saturate(${(1-.35*Bq).toFixed(2)}) brightness(${(1-.15*Bq).toFixed(2)})`, s.drawImage(s.canvas, 0, 0), s.filter = "none", s.restore()), s.setTransform(T, 0, 0, T, 0, 0), s.fillStyle = `rgba(4,8,22,${(M?.15:.32)*(1-.8*br)})`, s.fillRect(0, 0, o, f);
        let y = s.createLinearGradient(0, v - 10, 0, u - 40);
        y.addColorStop(0, "rgba(10,15,28,1)"), y.addColorStop(.35, "rgba(10,15,28,.55)"), y.addColorStop(1, "rgba(10,15,28,0)"), s.fillStyle = y, s.fillRect(0, 0, o, u - 40);
        let p = Math.max(o, f);
        y = s.createRadialGradient(o / 2, f / 2, p * .25, o / 2, f / 2, p * .75), y.addColorStop(0, "rgba(0,0,0,0)"), y.addColorStop(1, `rgba(0,0,0,${(M?.3:.5)*(1-.6*br)})`), s.fillStyle = y, s.fillRect(0, 0, o, f), y = s.createLinearGradient(0, f - a.botFade, 0, f), y.addColorStop(0, "rgba(3,6,16,0)"), y.addColorStop(1, `rgba(3,6,16,${.8-.3*br})`), s.fillStyle = y, s.fillRect(0, f - a.botFade, o, a.botFade);
        let g = w(Ve[0], Ve[1]),
            C = 1.15 * fi(g[2], .8, 1.15),
            z = Math.min(H - 1, Math.floor((l - X) / Ce)),
            $ = X + Ce * z,
            R = Mn(l >= ie ? da : fa, 10),
            Qc = Cp(l, R),
            L = Sa(g[0], g[1], C, i.name, [R, ...Qc ? [Qc.r] : []]),
            _ = {
                x0: g[0] - 14 * C,
                y0: g[1] - 38 * C,
                x1: g[0] + 14 * C,
                y1: g[1]
            },
            U = zn(g, C, l),
            ee = U ? U.rects : [L.rect],
            he = [];
        if (M && (l < X + 1.5 || l >= ie) && Fn(g[0], g[1], C, l), l >= ie) mi.forEach(q => {
            Ca(w, q, 1, .6);
            let te = w(q.end[0], q.end[1]),
                ce = .6 * fi(te[2], .75, 1.15);
            ss(te[0], te[1], q.p.sty, ce), he.push({
                x0: te[0] - 14 * ce,
                y0: te[1] - 38 * ce,
                x1: te[0] + 14 * ce,
                y1: te[1]
            })
        });
        else if (l >= X) {
            let q = mi[z],
                te = ye((l - $ - .9) / 2.6),
                ce = Ca(w, q, te, 1);
            if (te > .97) {
                let me = w(q.end[0], q.end[1]),
                    Ma = ye((l - $ - 3.4) / .35),
                    Ue = (.4 + .6 * Ma) * fi(me[2], .8, 1.15);
                let Ph = null,
                    Qu = fi(me[2], .8, 1.15),
                    Qf = Sa(me[0], me[1], Qu, q.p.name, [...ee, _, R, ...Qc ? [Qc.r] : []]);
                if (ss(me[0], me[1], q.p.sty, Ue), he.push({
                        x0: me[0] - 14 * Ue,
                        y0: me[1] - 38 * Ue,
                        x1: me[0] + 14 * Ue,
                        y1: me[1]
                    }), Ph = Pp(q, me, Qu, l - $, [...ee, _, R, ...U ? [] : [L.rect], ...Qc ? [Qc.r] : [], Qf.rect], _), Ma >= 1) {
                    let ft = Sa(me[0], me[1], Ue, q.p.name, [...ee, _, R, ...Qc ? [Qc.r] : [], ...Ph ? [Ph.r] : []]);
                    as(ft.rect, q.p.name, q.p.sty, Ue, !1), Se("label", ft.rect.x0, ft.rect.y0, ft.rect.x1, ft.rect.y1, "poi:" + ft.mode), Se("body", me[0] - 14 * Ue, me[1] - 38 * Ue, me[0] + 14 * Ue, me[1])
                }
                Ph && Pd(Ph, q.p.photoBmp)
            } else ce && te > 0 && (s.beginPath(), s.arc(ce[0], ce[1], 7, 0, 7), s.fillStyle = "#fff", s.fill(), s.strokeStyle = q.p.color, s.lineWidth = 3, s.stroke());
            On(q, z, (l - $ - 1) / .5)
        }
        if (ss(g[0], g[1], ze, C), !U) as(L.rect, i.name, ze, C, !0), Se("label", L.rect.x0, L.rect.y0, L.rect.x1, L.rect.y1, "proj:" + L.mode);
        else {
            let q = he.some(te => U.rects.some(ce => lt(te, ce, 2)));
            Un(U, q ? .3 : 1), !q && U.s >= 1 && U.rects.forEach((te, ce) => Se("label", te.x0, te.y0, te.x1, te.y1, "proj:" + ui + ce))
        }
        Se("body", _.x0, _.y0, _.x1, _.y1), Hd(l), Nn(l), Pn(l), l >= ie && Dn(l), Wn(l), Qc && Cd(Qc), s.save(), s.textAlign = "center", s.textBaseline = "middle", s.font = Te(700, 13), s.fillStyle = "rgba(255,255,255,.88)", i.footer && s.fillText(i.footer, o / 2, f - a.footY[0]), ae(yn, 500, 9, 7, o - 2 * d), s.fillStyle = "rgba(255,255,255,.5)", s.fillText(yn, o / 2, f - a.footY[1]), s.restore(), s.setTransform(1, 0, 0, 1, 0, 0)
    }

    function Vn() {
        let l = [],
            c = 0,
            m = {};
        for (let p = 0; p < qe; p += .2) {
            os(p, !1);
            let g = Ji;
            for (let _ of g) c++, _.kind !== "body" && (_.x0 < d - .6 || _.x1 > o - d + .6) && l.push(`NGANG t=${p.toFixed(1)} ${_.kind} ${_.x0.toFixed(0)}..${_.x1.toFixed(0)}`), _.kind === "label" && _.x1 > ci(_) + .6 && l.push(`RAY-PHAI t=${p.toFixed(1)} ${_.id}`), _.kind === "label" && _.y0 < a.labelTop && l.push(`TREN t=${p.toFixed(1)} label y0=${_.y0.toFixed(0)}`), _.id && (m[_.id] = (m[_.id] || 0) + 1);
            let C = g.filter(_ => _.kind === "label"),
                z = g.filter(_ => _.kind === "body"),
                $ = g.filter(_ => _.kind === "text"),
                R = g.filter(_ => _.kind.startsWith("logo"));
            for (let _ of C)
                for (let U of $) lt(_, U, 0) && l.push(`CHONG chu-label t=${p.toFixed(1)} ${_.id}`);
            for (let _ of [...C, ...$])
                for (let U of R) lt(_, U, 0) && l.push(`CHONG logo t=${p.toFixed(1)} ${_.id||_.kind}`);
            if (p >= X && p < ie && (p - X) % Ce >= 3.9 || p >= ie + 1.6) {
                let _ = p >= ie ? da : fa;
                for (let U of C) lt(U, _, 14) && l.push(`GAP t=${p.toFixed(1)} ${U.id}`);
                for (let U = 0; U < C.length; U++) {
                    for (let ee = U + 1; ee < C.length; ee++) lt(C[U], C[ee], 0) && l.push(`CHONG label-label t=${p.toFixed(1)}`);
                    for (let ee of z) lt(C[U], ee, 0) && l.push(`CHONG label-icon t=${p.toFixed(1)} ${C[U].id}`)
                }
            }
        }
        let w = Object.entries(m).filter(([p]) => p.endsWith("*")).reduce((p, [, g]) => p + g, 0),
            y = Object.keys(m).filter(p => p.endsWith("*"));
        return {
            checked: c,
            violationCount: l.length,
            violations: l.slice(0, 8),
            fallback: w,
            fbIds: y
        }
    }
    async function ka(l) {
        await n.ensure(ba(l)), i.rd && await i.rd.ensure(ba(l))
    }

    function Ln(l) {
        Ti = l
    }

    function $n() {
        let l = [M ? .6 : 1.8, ...M ? [2.6] : [], ...J.map((C, z) => X + Ce * z + 4.4), qe - 1],
            c = a.cols,
            m = Math.ceil(l.length / c),
            w = o / 2,
            y = f / 2,
            p = document.createElement("canvas");
        p.width = w * c, p.height = y * m;
        let g = p.getContext("2d");
        return {
            canvas: p,
            times: l,
            async draw() {
                for (let C = 0; C < l.length; C++) {
                    await ka(l[C]), os(l[C]);
                    let z = C % c * w,
                        $ = Math.floor(C / c) * y;
                    g.drawImage(Ft, z, $, w, y), g.save(), g.strokeStyle = "rgba(255,0,200,.85)", g.setLineDash([4, 3]), g.lineWidth = 1, g.strokeRect(z + d / 2, $ + (a.topY - 18) / 2, (o - 2 * d) / 2, (f - a.card.bottom - a.topY + 18) / 2), g.restore()
                }
            }
        }
    }
    return {
        fmt: e,
        W: o,
        H: f,
        Wp: b,
        Hp: x,
        k: T,
        T: qe,
        INTRO: X,
        OUTRO: de,
        OUT0: ie,
        N: H,
        MK: ui,
        canvas: Ft,
        render: os,
        prepare: ka,
        keysAt: ba,
        checkAll: Vn,
        sheet: $n,
        setStep: Ln,
        fits: vi.map(l => +l.z.toFixed(2)).concat([+pa.z.toFixed(2)])
    }
}

function _o(e = 500, uf = vo, ph = !0) {
    let t = new Map,
        i = new Map,
        n = new Map,
        a = new Set,
        o = {
            total: 0,
            retried: 0,
            placeholder: 0,
            fallback: 0,
            failed: 0,
            failedKeys: []
        };
    async function f(S, u, b) {
        for (let x = 0; x < 3; x++) {
            try {
                let T = await fetch(uf(S, u, b)),
                    O = T.headers.get("content-type") || "";
                if (T.ok && O.startsWith("image/")) {
                    let k = await T.blob();
                    if (k.size > 0) return k
                }
            } catch {}
            x < 2 && (o.retried++, await Wt(400 * (x + 1)))
        }
        return null
    }
    async function d(S) {
        return [...new Uint8Array(await crypto.subtle.digest("SHA-1", await S.arrayBuffer())).slice(0, 8)].map(b => b.toString(16).padStart(2, "0")).join("")
    }
    async function v(S, u, b = 12) {
        let x = 0;
        await Promise.all(Array.from({
            length: b
        }, async () => {
            for (; x < S.length;) await u(S[x++])
        }))
    }
    return {
        get stats() {
            return {
                ...o,
                failedKeys: o.failedKeys.slice(0, 5),
                decoded: i.size
            }
        },
        async fetchAll(S, u) {
            let b = [...S].filter(k => !t.has(k) && !n.has(k));
            o.total += b.length;
            let x = 0;
            await v(b, async k => {
                let [W, J, H] = k.split("/").map(Number), M = await f(W, J, H);
                M ? t.set(k, M) : a.add(k), x++, x % 40 === 0 && u(x, b.length)
            });
            let T = new Map;
            await v(ph ? b.filter(k => t.has(k) && +k.split("/")[0] >= 14) : [], async k => {
                let W = t.get(k).size + ":" + await d(t.get(k));
                T.has(W) || T.set(W, []), T.get(W).push(k)
            });
            let O = new Set;
            for (let [k, W] of T)
                if (W.length >= 3) {
                    O.add(k);
                    for (let J of W) t.delete(J), a.add(J), o.placeholder++
                } await v([...a], async k => {
                let [W, J, H] = k.split("/").map(Number);
                for (let M = 1; M <= 4 && W - M >= 1; M++) {
                    let X = `${W-M}/${J>>M}/${H>>M}`;
                    if (!t.has(X)) {
                        let de = await f(W - M, J >> M, H >> M);
                        if (!de || W - M >= 14 && O.has(de.size + ":" + await d(de))) continue;
                        t.set(X, de)
                    }
                    n.set(k, {
                        key: X,
                        dz: M
                    }), a.delete(k), o.fallback++;
                    return
                }
                o.failed++, o.failedKeys.length < 20 && o.failedKeys.push(k)
            }, 6)
        },
        async ensure(S) {
            let u = new Set;
            for (let T of S) t.has(T) ? u.add(T) : n.has(T) && u.add(n.get(T).key);
            let b = [...u],
                x = b.filter(T => !i.has(T));
            await Promise.all(x.map(async T => {
                try {
                    i.set(T, await createImageBitmap(t.get(T)))
                } catch {}
            }));
            for (let T of b)
                if (i.has(T)) {
                    let O = i.get(T);
                    i.delete(T), i.set(T, O)
                } for (; i.size > Math.max(e, b.length + 50);) {
                let [T, O] = i.entries().next().value;
                O.close && O.close(), i.delete(T)
            }
        },
        src(S) {
            if (t.has(S)) {
                let k = i.get(S);
                return k ? {
                    b: k,
                    sx: 0,
                    sy: 0,
                    sw: 256
                } : null
            }
            let u = n.get(S);
            if (!u) return null;
            let b = i.get(u.key);
            if (!b) return null;
            let [, x, T] = S.split("/").map(Number), O = 256 / 2 ** u.dz;
            return {
                b,
                sx: (x - (x >> u.dz << u.dz)) * O,
                sy: (T - (T >> u.dz << u.dz)) * O,
                sw: O
            }
        }
    }
}
var ue = 48e3,
    la = {
        "sang-trong": {
            bpm: 84,
            bars: 2,
            chords: [
                [50, 54, 57, 61],
                [47, 50, 54, 57],
                [43, 47, 50, 54],
                [45, 50, 52, 57]
            ],
            bass: [38, 35, 31, 33],
            drums: !1,
            rev: .35
        },
        "nang-dong": {
            bpm: 112,
            bars: 1,
            chords: [
                [48, 52, 55],
                [47, 50, 55],
                [45, 48, 52],
                [45, 48, 53]
            ],
            bass: [36, 31, 33, 29],
            drums: !0,
            rev: .16
        }
    },
    Yi = e => 440 * 2 ** ((e - 69) / 12);

function kn(e, t) {
    let i = e.createBuffer(1, Math.ceil(ue * t), ue),
        n = i.getChannelData(0),
        a = 12345;
    for (let o = 0; o < n.length; o++) a = a * 1103515245 + 12345 & 2147483647, n[o] = a / 1073741823 - 1;
    return i
}

function Ao(e, t) {
    let i = e.createBuffer(2, Math.ceil(ue * t), ue);
    for (let n = 0; n < 2; n++) {
        let a = i.getChannelData(n),
            o = 777 + n * 991;
        for (let f = 0; f < a.length; f++) o = o * 1103515245 + 12345 & 2147483647, a[f] = (o / 1073741823 - 1) * Math.pow(1 - f / a.length, 3)
    }
    return i
}

function Tn(e, t, i, n, a, o, f, d, v, S) {
    let u = e.createOscillator();
    u.type = i, u.frequency.value = n;
    let b = e.createGain();
    b.gain.setValueAtTime(0, a), b.gain.linearRampToValueAtTime(f, a + d), b.gain.setTargetAtTime(0, a + Math.max(d, o - v), v / 3);
    let x = u;
    if (S) {
        let T = e.createBiquadFilter();
        T.type = "lowpass", T.frequency.value = S, u.connect(T), x = T
    }
    x.connect(b).connect(t), u.start(a), u.stop(a + o + v * 2)
}

function na(e, t, i, n, a, o, f, d) {
    let v = e.createOscillator();
    v.type = i, v.frequency.value = n;
    let S = e.createGain();
    S.gain.setValueAtTime(0, a), S.gain.linearRampToValueAtTime(o, a + .005), S.gain.exponentialRampToValueAtTime(1e-4, a + f);
    let u = v;
    if (d) {
        let b = e.createBiquadFilter();
        b.type = "lowpass", b.frequency.value = d, v.connect(b), u = b
    }
    u.connect(S).connect(t), v.start(a), v.stop(a + f + .05)
}

function Sn(e, t, i, n, a, o, f, d, v = 1) {
    let S = e.createBufferSource();
    S.buffer = i;
    let u = e.createBiquadFilter();
    u.type = f, u.frequency.value = d, u.Q.value = v;
    let b = e.createGain();
    b.gain.setValueAtTime(0, n), b.gain.linearRampToValueAtTime(a, n + .004), b.gain.exponentialRampToValueAtTime(1e-4, n + o), S.connect(u).connect(b).connect(t), S.start(n, Math.random() * .5), S.stop(n + o + .02)
}

function Cn(e, t, i, n) {
    let a = e.createOscillator();
    a.frequency.setValueAtTime(150, i), a.frequency.exponentialRampToValueAtTime(45, i + .12);
    let o = e.createGain();
    o.gain.setValueAtTime(n, i), o.gain.exponentialRampToValueAtTime(1e-4, i + .35), a.connect(o).connect(t), a.start(i), a.stop(i + .4)
}

function Bo(e, t, i, n) {
    let a = la[i],
        o = 60 / a.bpm,
        f = o * 4 * a.bars,
        d = kn(e, 2),
        v = e.createConvolver();
    v.buffer = Ao(e, 2.4);
    let S = e.createGain();
    S.gain.value = a.rev, v.connect(S).connect(t);
    let u = e.createGain();
    u.connect(t), u.connect(v);
    for (let b = 0, x = 0; b < n + f; b += f, x++) {
        let T = a.chords[x % a.chords.length],
            O = a.bass[x % a.bass.length];
        for (let H of T)
            for (let M of [-7, 7]) {
                let X = e.createOscillator();
                X.type = "sawtooth", X.frequency.value = Yi(H), X.detune.value = M;
                let de = e.createBiquadFilter();
                de.type = "lowpass", de.frequency.value = a.drums ? 1300 : 900;
                let ie = e.createGain();
                ie.gain.setValueAtTime(0, b), ie.gain.linearRampToValueAtTime(.022, b + (a.drums ? .08 : .7)), ie.gain.setTargetAtTime(0, b + f - .15, .12), X.connect(de).connect(ie).connect(u), X.start(b), X.stop(b + f + .6)
            }
        if (a.drums)
            for (let H = 0; H < 8 * a.bars; H++) Tn(e, u, "triangle", Yi(O + (H % 4 === 3 ? 7 : 0)), b + H * o / 2, o / 2 * .9, .2, .01, .08, 420);
        else Tn(e, u, "sine", Yi(O), b, f, .22, .08, .4);
        let k = [...T.map(H => H + 12), T[1] + 24],
            W = a.drums ? o / 4 : o / 2,
            J = Math.round(f / W);
        for (let H = 0; H < J; H++) {
            let M = k[H * (a.drums ? 3 : 1) % k.length];
            na(e, u, a.drums ? "square" : "triangle", Yi(M), b + H * W, a.drums ? .035 : .07, a.drums ? .22 : .9, a.drums ? 2600 : 3200)
        }
        if (a.drums)
            for (let H = 0; H < 4 * a.bars; H++) {
                let M = b + H * o;
                Cn(e, u, M, .5), H % 2 === 1 && Sn(e, u, d, M, .12, .16, "bandpass", 1600, .8), Sn(e, u, d, M + o / 2, .05, .05, "highpass", 7e3)
            } else Cn(e, u, b, .18)
    }
}

function It(e, t, i, n, a) {
    if (!(a < 0))
        if (n === "whoosh") {
            let o = e.createBufferSource();
            o.buffer = i;
            let f = e.createBiquadFilter();
            f.type = "bandpass", f.Q.value = 1.1, f.frequency.setValueAtTime(300, a), f.frequency.exponentialRampToValueAtTime(2600, a + .55);
            let d = e.createGain();
            d.gain.setValueAtTime(0, a), d.gain.linearRampToValueAtTime(.32, a + .35), d.gain.linearRampToValueAtTime(0, a + .62), o.connect(f).connect(d).connect(t), o.start(a), o.stop(a + .7)
        } else if (n === "pop") {
        let o = e.createOscillator();
        o.frequency.setValueAtTime(520, a), o.frequency.exponentialRampToValueAtTime(980, a + .07);
        let f = e.createGain();
        f.gain.setValueAtTime(.22, a), f.gain.exponentialRampToValueAtTime(1e-4, a + .14), o.connect(f).connect(t), o.start(a), o.stop(a + .16)
    } else n === "shimmer" ? [1568, 2093, 2637, 3136, 3951].forEach((o, f) => na(e, t, "sine", o, a + f * .035, .05, 1.3)) : n === "chime" && [
        [880, .12],
        [1320, .06],
        [1760, .04]
    ].forEach(([o, f]) => na(e, t, "sine", o, a, f, 1.8))
}

function Io(e, t) {
    let i = x => {
            let T = new Float64Array(x.length),
                O = [
                    [1.53512485958697, -2.69169618940638, 1.19839281085285, -1.69065929318241, .73248077421585],
                    [1, -2, 1, -1.99004745483398, .99007225036621]
                ],
                k = x;
            for (let [W, J, H, M, X] of O) {
                let de = 0,
                    ie = 0,
                    qe = 0,
                    zt = 0;
                for (let ze = 0; ze < k.length; ze++) {
                    let Ut = W * k[ze] + J * de + H * ie - M * qe - X * zt;
                    ie = de, de = k[ze], zt = qe, qe = Ut, T[ze] = Ut
                }
                k = T.slice()
            }
            return k
        },
        n = i(e),
        a = i(t),
        o = Math.round(.4 * ue),
        f = Math.round(.1 * ue),
        d = [];
    for (let x = 0; x + o <= n.length; x += f) {
        let T = 0;
        for (let O = x; O < x + o; O++) T += n[O] * n[O] + a[O] * a[O];
        d.push(T / o)
    }
    let v = x => -.691 + 10 * Math.log10(x || 1e-12),
        S = d.filter(x => v(x) > -70);
    if (!S.length) return -70;
    let u = v(S.reduce((x, T) => x + T, 0) / S.length) - 10,
        b = S.filter(x => v(x) > u);
    return v(b.reduce((x, T) => x + T, 0) / b.length)
}
async function Wo(e, t) {
    if ((!e.music || e.music === "none") && !e.voice) return null;
    let i = t.T,
        n = new OfflineAudioContext(2, Math.ceil(ue * i), ue),
        a = n.createGain(),
        o = n.createGain();
    a.gain.value = .85, o.gain.value = .7, a.connect(n.destination), o.connect(n.destination);
    let f = e.music;
    if (typeof e.music == "object" && e.music.url) {
        let k = await (await fetch(e.music.url)).arrayBuffer(),
            W = await n.decodeAudioData(k),
            J = n.createBufferSource();
        J.buffer = W, J.loop = W.duration < i, J.connect(a), J.start(0), f = "file"
    } else if (la[e.music]) Bo(n, a, e.music, i);
    else if (e.music && e.music !== "none") throw new Error("music kh\xF4ng h\u1EE3p l\u1EC7: " + JSON.stringify(e.music));
    if (e.voice) {
        let k;
        try {
            let W = await fetch(e.voice.url);
            if (!W.ok) throw new Error("HTTP " + W.status);
            k = await n.decodeAudioData(await W.arrayBuffer())
        } catch (W) {
            throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c gi\u1ECDng \u0111\u1ECDc t\u1EEB voice.url (" + W.message + ")")
        }
        let W = n.createBufferSource(),
            J = n.createGain();
        J.gain.value = 1.6, W.buffer = k, W.connect(J).connect(n.destination), W.start(0), a.gain.value = .22, o.gain.value = .4, f = (f && f !== "none" ? f + " + " : "") + "gi\u1ECDng \u0111\u1ECDc"
    }
    let d = kn(n, 2);
    e.brandObj && It(n, o, d, "shimmer", .05);
    for (let k = 0; k < t.N; k++) {
        let W = t.INTRO + Ce * k;
        It(n, o, d, "whoosh", W - .1), It(n, o, d, "pop", W + 3.4)
    }
    t.MK !== "pin" && It(n, o, d, "pop", t.INTRO + .05), It(n, o, d, "whoosh", t.OUT0 - .1), It(n, o, d, "chime", t.OUT0 + .6);
    let v = await n.startRendering(),
        S = v.getChannelData(0),
        u = v.getChannelData(1),
        b = S.length,
        x = Math.pow(10, (-13.6 - Io(S, u)) / 20),
        T = Math.round(.3 * ue),
        O = Math.round(1.5 * ue);
    for (let k of [S, u])
        for (let W = 0; W < b; W++) {
            let J = Math.min(1, W / T, (b - 1 - W) / O);
            k[W] = .89 * Math.tanh(k[W] * x * J / .89)
        }
    return {
        buf: v,
        src: f
    }
}
async function zo(e) {
    if (typeof AudioEncoder > "u") return null;
    let t = e === "mp4" ? [
        ["mp4a.40.2", "aac"],
        ["opus", "opus"]
    ] : [
        ["opus", "A_OPUS"]
    ];
    for (let [i, n] of t) {
        let a = {
            codec: i,
            sampleRate: ue,
            numberOfChannels: 2,
            bitrate: 16e4
        };
        try {
            if ((await AudioEncoder.isConfigSupported(a)).supported) return {
                codec: i,
                mcodec: n,
                cfg: a
            }
        } catch {}
    }
    return null
}
async function Uo(e, t) {
    let i = [],
        n = null,
        a = new AudioEncoder({
            output: (v, S) => i.push([v, S]),
            error: v => {
                n = v
            }
        });
    a.configure(t.cfg);
    let o = e.getChannelData(0),
        f = e.getChannelData(1),
        d = 1024;
    for (let v = 0; v < e.length; v += d) {
        let S = Math.min(d, e.length - v),
            u = new Float32Array(S * 2);
        u.set(o.subarray(v, v + S), 0), u.set(f.subarray(v, v + S), S);
        let b = new AudioData({
            format: "f32-planar",
            sampleRate: ue,
            numberOfFrames: S,
            numberOfChannels: 2,
            timestamp: Math.round(v * 1e6 / ue),
            data: u
        });
        a.encode(b), b.close(), a.encodeQueueSize > 32 && await Wt(1)
    }
    if (await a.flush(), a.close(), n) throw n;
    return i
}
async function Fo(e, t) {
    if (typeof VideoEncoder > "u") return null;
    let i = Math.round(e * t * fe * .17),
        n = [
            ["avc1.640028", "mp4"],
            ["avc1.4d0028", "mp4"],
            ["avc1.42e028", "mp4"],
            ["vp09.00.40.08", "webm"],
            ["vp8", "webm"]
        ];
    for (let [a, o] of n) {
        let f = {
            codec: a,
            width: e,
            height: t,
            bitrate: i,
            framerate: fe,
            ...o === "mp4" ? {
                avc: {
                    format: "avc"
                }
            } : {}
        };
        try {
            if ((await VideoEncoder.isConfigSupported(f)).supported) return {
                codec: a,
                mux: o,
                cfg: f
            }
        } catch {}
    }
    return null
}
async function Ro(e, t, i) {
    let n = await Fo(e.Wp, e.Hp);
    if (!n) return Oo(e, t);
    let a = i ? await zo(n.mux) : null,
        o = a ? await Uo(i.buf, a) : [],
        f = a ? {
            audio: {
                codec: a.mcodec,
                numberOfChannels: 2,
                sampleRate: ue
            }
        } : {},
        d = n.mux === "mp4" ? new Ts : new $s,
        v = n.mux === "mp4" ? new $a({
            target: d,
            video: {
                codec: "avc",
                width: e.Wp,
                height: e.Hp,
                frameRate: fe
            },
            ...f,
            fastStart: "in-memory"
        }) : new wn({
            target: d,
            video: {
                codec: n.codec.startsWith("vp09") ? "V_VP9" : "V_VP8",
                width: e.Wp,
                height: e.Hp,
                frameRate: fe
            },
            ...f
        }),
        S = 0,
        u = k => {
            for (; S < o.length && o[S][0].timestamp <= k;) v.addAudioChunk(o[S][0], o[S][1]), S++
        },
        b = null,
        x = new VideoEncoder({
            output: (k, W) => {
                u(k.timestamp), v.addVideoChunk(k, W)
            },
            error: k => {
                b = k
            }
        });
    x.configure(n.cfg);
    let T = Math.round(e.T * fe),
        O = performance.now();
    for (let k = 0; k < T; k++) {
        if (b) throw b;
        let W = k / fe;
        await e.prepare(W), e.render(W);
        let J = new VideoFrame(e.canvas, {
            timestamp: Math.round(k * 1e6 / fe),
            duration: Math.round(1e6 / fe)
        });
        for (x.encode(J, {
                keyFrame: k % (fe * 2) === 0
            }), J.close(); x.encodeQueueSize > 6;) await Wt(4);
        k % 15 === 0 && t(k / T)
    }
    if (await x.flush(), x.close(), u(1 / 0), v.finalize(), b) throw b;
    return {
        blob: new Blob([d.buffer], {
            type: n.mux === "mp4" ? "video/mp4" : "video/webm"
        }),
        ext: n.mux,
        codec: n.codec,
        sec: (performance.now() - O) / 1e3,
        late: 0,
        audio: i ? a ? `${i.src} \xB7 ${a.codec}` : "kh\xF4ng xu\u1EA5t \u0111\u01B0\u1EE3c ti\u1EBFng (tr\xECnh duy\u1EC7t thi\u1EBFu AudioEncoder)" : "kh\xF4ng nh\u1EA1c"
    }
}
async function Oo(e, t) {
    let i = e.canvas.captureStream(fe),
        n = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find(u => MediaRecorder.isTypeSupported(u)),
        a = new MediaRecorder(i, {
            mimeType: n,
            videoBitsPerSecond: 8e6
        }),
        o = [];
    a.ondataavailable = u => {
        u.data.size && o.push(u.data)
    };
    let f = new Promise(u => a.onstop = u);
    a.start(250);
    let d = Math.round(e.T * fe),
        v = performance.now(),
        S = 0;
    for (let u = 0; u < d; u++) {
        await e.prepare(u / fe), e.render(u / fe), u % 15 === 0 && t(u / d);
        let b = v + (u + 1) * 1e3 / fe - performance.now();
        b > 0 ? await Wt(b) : (S++, await Wt(0))
    }
    return await Wt(400), a.stop(), await f, {
        blob: new Blob(o, {
            type: "video/webm"
        }),
        ext: "webm",
        codec: n + " (realtime)",
        sec: (performance.now() - v) / 1e3,
        late: S,
        audio: "kh\xF4ng (ch\u1EBF \u0111\u1ED9 ghi tr\u1EF1c ti\u1EBFp)"
    }
}

function di() {
    return document.getElementById("mlv-st") || (document.documentElement.innerHTML = '<head><meta charset="utf-8"><title>Map video</title></head><body style="margin:0;background:#0b0f1a;color:#cfd6e6;font-family:Segoe UI,Arial,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh"><div id="mlv-st" style="padding:6px;font-size:13px">...</div><div id="mlv-stage" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:flex-start"></div></body>'), {
        st: document.getElementById("mlv-st"),
        stage: document.getElementById("mlv-stage")
    }
}
var Y = {
    version: Xi,
    LAYOUTS: ra,
    BRANDS: xn,
    st: {
        phase: "idle"
    },
    results: [],
    R: {}
};

function We(e, t) {
    Y.st.phase = e, t && Object.assign(Y.st, t);
    try {
        di().st.textContent = e
    } catch {}
}

function No(e) {
    let t = (e.name || "D\u1EF0 \xC1N").toUpperCase(),
        i = t.split(/\s+/),
        n = Math.ceil(i.length / 2),
        a = (e.formats || [e.format || "9:16"]).filter(v => ra[v]);
    if (!a.length) throw new Error("formats ph\u1EA3i thu\u1ED9c 9:16, 16:9, 1:1");
    if (!e.project || !isFinite(e.project.lat) || !isFinite(e.project.lon)) throw new Error("thi\u1EBFu project {lat, lon}");
    let o = (e.pois || []).map(v => {
        let S = (v.cat || "K\u1EBET N\u1ED0I").toUpperCase();
        return {
            ...v,
            cat: S,
            icon: v.icon && MkD[v.icon] ? v.icon : void 0,
            sty: v.sty || Co[S] || "gold"
        }
    });
    if (o.length < 1 || o.length > 6) throw new Error("c\u1EA7n 1\u20136 \u0111\u1ECBa \u0111i\u1EC3m (n\xEAn 3\u20136)");
    if (["logo", "image"].includes(e.marker) && !e.markerUrl && !(e.brandMode === "project" && e.brand && e.brand.logo)) throw new Error("marker " + e.marker + " c\u1EA7n markerUrl (URL c\xF4ng khai c\xF3 CORS, vd jsDelivr)");
    if (e.music && e.music !== "none" && !la[e.music] && !(typeof e.music == "object" && e.music.url)) throw new Error("music ph\u1EA3i l\xE0 none | sang-trong | nang-dong | {url}");
    for (let v of o)
        if (!isFinite(v.lat) || !isFinite(v.lon)) throw new Error("thi\u1EBFu t\u1ECDa \u0111\u1ED9: " + v.name);
    let f = e.brand === void 0 ? "avi" : e.brand,
        bm = e.brandMode || (f === "none" || f === !1 ? "none" : "avi"),
        d = bm === "none" || f === "none" || f === !1 ? null : /^project/.test(bm) ? Pb(typeof f == "object" ? f : {}, e) : {
            ...xn[typeof f == "string" ? f : "avi"],
            ...typeof f == "object" ? f : {},
            ...e.hotline !== void 0 ? {
                hotline: e.hotline
            } : {},
            ...e.website !== void 0 ? {
                website: e.website
            } : {},
            ...e.role !== void 0 ? {
                role: e.role
            } : {}
        };
    return {
        name: t,
        intro: e.intro || [i.slice(0, n).join(" "), i.slice(n).join(" ")],
        subtitle: e.subtitle ?? (d ? null : "Xung quanh c\xF3 g\xEC?"),
        area: e.area || "",
        tagline: e.tagline || "",
        cta: e.cta || "LI\xCAN H\u1EC6 NH\u1EACN TH\xD4NG TIN",
        note: e.note ?? "S\u1ED1 li\u1EC7u v\xE0 v\u1ECB tr\xED mang t\xEDnh tham kh\u1EA3o",
        footer: e.footer ?? (d ? d.website : "Video \u0111\u01B0\u1EE3c l\xE0m b\u1EDFi Claude Code"),
        brandObj: d,
        project: {
            lat: +e.project.lat,
            lon: +e.project.lon
        },
        pois: o,
        formats: a,
        res: e.res === 720 ? 720 : 1080,
        maxZoom: e.maxZoom || 17,
        music: e.music || "none",
        marker: ["logo", "image"].includes(e.marker) ? e.marker : "pin",
        markerUrl: e.markerUrl || (bm === "project" && f && f.logo) || "",
        voice: e.voice && e.voice.url ? {
            url: e.voice.url,
            wordsUrl: e.voice.wordsUrl || ""
        } : null,
        captions: !!e.captions,
        poiDur: fi(+e.poiDur || 5.5, 5.5, 9),
        introDur: e.introDur ? fi(+e.introDur, 3, 8) : 0,
        outroDur: e.outroDur ? fi(+e.outroDur, 3.5, 8) : 0,
        bright: fi(+e.bright || 0),
        roads: !!e.roads,
        noVideo: !!e.noVideo,
        travel: e.travel === "moto" ? "moto" : "car",
        hook: Array.isArray(e.hook) && e.hook.some(Boolean) ? e.hook.slice(0, 3) : null,
        hero: e.hero ? {
            intro: typeof e.hero == "string" ? e.hero : e.hero.intro || e.hero.url || "",
            outro: typeof e.hero == "string" ? "" : e.hero.outro || "",
            dur: fi(+(e.hero.dur || 3), 2, 5)
        } : null,
        bgBlur: e.bgBlur == null ? 0 : fi(+e.bgBlur),
        brandMode: bm
    }
}
Y.geo = async function(e, t, i = {}) {
    let n = [];
    for (let a of e) {
        let o;
        try {
            let b = await Fx(So(a, t), {}, 8e3);
            if (!b.ok) throw new Error("HTTP " + b.status);
            o = await b.json()
        } catch (b) {
            try {
                await Wt(1100);
                let x = await Fx(Nm(a, t), {}, 1e4);
                if (!x.ok) throw new Error("HTTP " + x.status);
                o = {
                    features: (await x.json()).map(T => ({
                        properties: {
                            name: T.name || String(T.display_name || "").split(",")[0],
                            osm_value: T.type
                        },
                        geometry: {
                            coordinates: [+T.lon, +T.lat]
                        }
                    }))
                }
            } catch (x) {
                n.push({
                    q: a,
                    err: "Photon: " + b + " / Nominatim: " + x
                });
                continue
            }
        }
        let f = (o.features || []).map(b => {
            let x = b.properties || {},
                [T, O] = b.geometry.coordinates,
                k = x.name || [x.housenumber, x.street].filter(Boolean).join(" ");
            return {
                name: k,
                lat: +O.toFixed(6),
                lon: +T.toFixed(6),
                km: +oa(t, {
                    lat: O,
                    lon: T
                }).toFixed(1),
                kind: x.osm_value || x.type || "",
                sim: ko(a, k)
            }
        }).sort((b, x) => x.sim - b.sim || b.km - x.km);
        if (!f.length) {
            n.push({
                q: a,
                miss: !0
            });
            continue
        }
        let d = f[0],
            v = [];
        d.sim < .5 && v.push("t\xEAn l\u1EC7ch"), d.km > (i.maxKm || 20) && v.push("xa");
        let {
            sim: S,
            ...u
        } = d;
        n.push({
            q: a,
            ...u,
            ...v.length ? {
                warn: v.join(","),
                alt: f.slice(1, 3).map(b => `${b.name} ${b.km}km`)
            } : {}
        })
    }
    return n
};
Y.run = function(e) {
    let t = No(e);
    Ce = t.poiDur, Y.cfg = t, Y.results = [], Y.R = {}, Y.st = {
        phase: "start",
        done: !1,
        v: Xi,
        warn: []
    }, di();
    let i = Y.tiles = _o();
    Y.job = (async () => {
        try {
            if (Ff = "", DeB0 = DeB0 || De.brand, De.brand = DeB0, t.brandObj) {
                We("\u0110ang n\u1EA1p logo...");
                let u = await Lb(t.brandObj);
                if (u) t.brandObj.img = u, t.brandObj.logoAR = u.width / u.height, t.brandObj.project && (De.brand = Bp(t.brandObj.accent)), t.brandObj.avi && (t.brandObj.avi.img = await createImageBitmap(await (await fetch(gn)).blob())), t.brandObj.font && await Lf(t.brandObj.font, t.brandObj.fontUrl);
                else if (t.brandObj.project) t.brandObj.avi ? (Y.st.warn.push("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c logo d\u1EF1 \xE1n \u2192 d\xF9ng th\u01B0\u01A1ng hi\u1EC7u AVI Realty"), t.brandObj = {
                    ...xn.avi,
                    hotline: t.brandObj.hotline,
                    role: t.brandObj.role,
                    img: await createImageBitmap(await (await fetch(gn)).blob())
                }) : (Y.st.warn.push("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c logo d\u1EF1 \xE1n \u2192 video kh\xF4ng th\u01B0\u01A1ng hi\u1EC7u"), t.brandObj = null);
                else throw new Error("Kh\xF4ng n\u1EA1p \u0111\u01B0\u1EE3c logo th\u01B0\u01A1ng hi\u1EC7u")
            }
            if (t.captions && t.voice && t.voice.wordsUrl) try {
                let u = await (await fetch(t.voice.wordsUrl)).json();
                t.caps = (u.caps || u).filter(b => isFinite(b.t0) && isFinite(b.t1) && b.text)
            } catch {
                Y.st.warn.push("Kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c ph\u1EE5 \u0111\u1EC1 (words.json)")
            }
            if (t.marker !== "pin") {
                We("\u0110ang n\u1EA1p \u1EA3nh d\u1EF1 \xE1n...");
                try {
                    if (t.markerBmp = await Lb({
                            logo: t.markerUrl
                        }), !t.markerBmp) throw new Error("kh\xF4ng \u0111\u1ECDc \u0111\u01B0\u1EE3c \u1EA3nh")
                } catch (u) {
                    throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c " + (t.marker === "logo" ? "logo" : "\u1EA3nh") + " d\u1EF1 \xE1n t\u1EEB markerUrl (" + u.message + "). C\u1EA7n URL c\xF4ng khai cho ph\xE9p CORS, vd jsDelivr.")
                }
            }
            t.rd = t.roads ? _o(500, Rd, !1) : null;
            let ph = 0;
            for (let u of t.pois)
                if (u.photo) {
                    We("\u0110ang n\u1EA1p \u1EA3nh ti\u1EC7n \xEDch...");
                    let b = await Lb({
                        logo: u.photo
                    });
                    b && b.width > 1e3 && (b = await createImageBitmap(b, {
                        resizeWidth: 1e3,
                        resizeHeight: Math.round(b.height * 1e3 / b.width),
                        resizeQuality: "high"
                    })), b ? (u.photoBmp = b, ph++) : Y.st.warn.push("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c \u1EA3nh: " + u.name)
                } Y.st.photos = ph;
            if (t.hero) {
                We("\u0110ang n\u1EA1p \u1EA3nh m\u1EDF \u0111\u1EA7u...");
                for (let [k, v] of [["heroIn", t.hero.intro], ["heroOut", t.hero.outro]])
                    if (v) {
                        let b = await Lb({
                            logo: v
                        });
                        b && b.width > 1920 && (b = await createImageBitmap(b, {
                            resizeWidth: 1920,
                            resizeHeight: Math.round(b.height * 1920 / b.width),
                            resizeQuality: "high"
                        })), b ? t[k] = b : Y.st.warn.push("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c \u1EA3nh m\u1EDF/k\u1EBFt: " + v)
                    } Y.st.hero = (t.heroIn ? 1 : 0) + (t.heroOut ? 1 : 0)
            }
            We("\u0110ang l\u1EA5y tuy\u1EBFn \u0111\u01B0\u1EDDng...");
            let a = [],
                o = [];
            for (let u of t.pois) {
                let b, x, T, O = !1;
                try {
                    if (u.route === "line") b = [
                        [t.project.lon, t.project.lat],
                        [u.lon, u.lat]
                    ], x = oa(t.project, u), T = t.travel === "moto" ? Mt(x) : x * 2;
                    else {
                        let W = (await (await fetch(t.travel === "moto" ? Tm(t.project, u) : To(t.project, u))).json()).routes[0];
                        b = W.geometry.coordinates, x = W.distance / 1e3, T = t.travel === "moto" ? Mt(x) : W.duration / 60
                    }
                } catch {
                    b = [
                        [t.project.lon, t.project.lat],
                        [u.lon, u.lat]
                    ], x = oa(t.project, u), T = t.travel === "moto" ? Mt(x) : x * 2, O = !0
                }
                u.km != null && isFinite(+u.km) && (x = +u.km), u.min != null && isFinite(+u.min) && (T = +u.min);
                a.push({
                    ...u,
                    coords: b,
                    km: x,
                    min: T,
                    color: De[u.sty].flat
                }), o.push({
                    n: u.name,
                    km: +x.toFixed(1),
                    min: Math.round(T),
                    ...O ? {
                        est: "chim bay"
                    } : {}
                })
            }
            if (t.subtitle == null) {
                let u = a.reduce((b, x) => x.min < b.min ? x : b);
                t.subtitle = `~${Math.max(1,Math.round(u.min))} ph\xFAt t\u1EDBi ${u.name}`
            }
            Y.st.routes = o;
            let f = {
                    P: t.project,
                    pois: a
                },
                d = t.formats.map(u => Y.R[u] = Eo(u, f, t, i));
            We("\u0110ang t\u1EA3i \u1EA3nh v\u1EC7 tinh...");
            let v = new Set;
            for (let u of d)
                for (let b = 0; b < u.T * fe; b++)
                    for (let x of u.keysAt(b / fe)) v.add(x);
            if (await i.fetchAll(v, (u, b) => We(`\u0110ang t\u1EA3i \u1EA3nh v\u1EC7 tinh ${u}/${b}`)), t.rd && (We("\u0110ang t\u1EA3i l\u1EDBp t\xEAn \u0111\u01B0\u1EDDng..."), await t.rd.fetchAll(v, () => {}), Y.st.roads = t.rd.stats.failed ? `thi\u1EBFu ${t.rd.stats.failed} \xF4` : "c\xF3"), Y.st.tiles = i.stats, i.stats.failed > 0) throw new Error(`Thi\u1EBFu \u1EA3nh v\u1EC7 tinh \u1EDF ${i.stats.failed}/${i.stats.total} \xF4 (${i.stats.failedKeys.join(", ")}). Ki\u1EC3m tra m\u1EA1ng / quy\u1EC1n truy c\u1EADp server.arcgisonline.com r\u1ED3i ch\u1EA1y l\u1EA1i; kh\xF4ng xu\u1EA5t video c\xF3 \xF4 tr\u1ED1ng.`);
            let S = null;
            (t.music !== "none" || t.voice) && !t.noVideo && (We("\u0110ang d\u1EF1ng \xE2m thanh..."), S = await Wo(t, d[0]));
            for (let u of d) {
                We(`Ki\u1EC3m tra b\u1ED1 c\u1EE5c ${u.fmt}...`);
                let b = u.checkAll();
                await u.prepare(10);
                let x = performance.now();
                for (let W = 0; W < 10; W++) u.render(10 + W * .1);
                (performance.now() - x) / 10 > 60 && u.setStep(2);
                let T = t.noVideo ? {
                        blob: new Blob([]),
                        ext: "none",
                        codec: "",
                        sec: 0,
                        late: 0,
                        audio: ""
                    } : await Ro(u, W => We(`\u0110ang xu\u1EA5t ${u.fmt} ${Math.round(W*100)}%`, {
                        pct: Math.round(W * 100)
                    }), S),
                    O = u.sheet();
                await O.draw();
                let k = URL.createObjectURL(T.blob);
                Y.results.push({
                    fmt: u.fmt,
                    size: `${u.Wp}x${u.Hp}`,
                    codec: T.codec,
                    audio: T.audio,
                    ext: T.ext,
                    MB: +(T.blob.size / 1e6).toFixed(1),
                    sec: Math.round(T.sec),
                    late: T.late,
                    check: b,
                    url: k,
                    blob: T.blob,
                    sheet: O.canvas,
                    file: `${Mo(t.name)}_${u.fmt.replace(":","x")}.${T.ext}`
                })
            }
            We("Xong", {
                done: !0
            }), t.noVideo || Y.show()
        } catch (a) {
            Y.st.err = String(a && a.stack || a), We("L\u1ED7i: " + a)
        }
    })();
    let n = t.brandObj;
    return {
        started: !0,
        v: Xi,
        brand: n ? n.name : "none",
        music: typeof t.music == "object" ? "file" : t.music,
        marker: t.marker,
        formats: t.formats,
        res: t.res,
        poiDur: Ce,
        voice: !!t.voice,
        captions: t.captions,
        T: (t.introDur || (n ? 4 : 3.5)) + Ce * t.pois.length + (t.outroDur || (n ? 5 : 3.5))
    }
};
Y.summary = function() {
    let e = Y.st;
    return {
        v: Xi,
        phase: e.phase,
        done: !!e.done,
        ...e.err ? {
            err: e.err.slice(0, 400)
        } : {},
        ...e.warn && e.warn.length ? {
            warn: e.warn
        } : {},
        ...e.font ? {
            font: e.font
        } : {},
        ...e.photos != null ? {
            photos: e.photos
        } : {},
        ...e.roads ? {
            roads: e.roads
        } : {},
        ...e.hero != null ? {
            hero: e.hero
        } : {},
        ...e.routes ? {
            routes: e.routes
        } : {},
        ...e.tiles ? {
            map: "Esri World Imagery (v\u1EC7 tinh)",
            tiles: {
                n: e.tiles.total,
                retried: e.tiles.retried,
                placeholder: e.tiles.placeholder,
                fallback: e.tiles.fallback,
                failed: e.tiles.failed
            }
        } : {},
        out: Y.results.map(t => ({
            fmt: t.fmt,
            size: t.size,
            codec: t.codec,
            audio: t.audio,
            MB: t.MB,
            sec: t.sec,
            late: t.late,
            viol: t.check.violationCount,
            fallback: t.check.fallback,
            ...t.check.fallback ? {
                fbIds: t.check.fbIds
            } : {},
            ...t.check.violationCount ? {
                list: t.check.violations
            } : {}
        }))
    }
};
Y.wait = function(e = 25) {
    return new Promise(t => {
        let i = Date.now(),
            n = () => {
                Y.st.done || Y.st.err || Date.now() - i > e * 1e3 ? t(Y.summary()) : setTimeout(n, 500)
            };
        n()
    })
};
Y.show = function() {
    let {
        stage: e
    } = di();
    e.innerHTML = "";
    for (let t of Y.results) {
        let i = document.createElement("div");
        i.style.cssText = "display:flex;flex-direction:column;align-items:center";
        let n = t.fmt === "16:9" ? "max-width:92vw;max-height:52vh" : "max-height:72vh;max-width:46vw";
        i.innerHTML = `<video src="${t.url}" controls autoplay loop muted style="${n};background:#000"></video>`;
        let a = document.createElement("a");
        a.href = t.url, a.download = t.file, a.textContent = `\u2B07 ${t.fmt} \xB7 ${t.size} \xB7 ${t.ext.toUpperCase()} \xB7 ${t.MB} MB`, a.style.cssText = "margin:8px;padding:8px 14px;background:#ffd94f;color:#2a1a00;border-radius:18px;font-weight:700;text-decoration:none;font-size:14px", i.appendChild(a), e.appendChild(i)
    }
    return Y.results.map(t => t.file)
};
Y.sheet = function(e) {
    let t = Y.results.find(n => !e || n.fmt === e);
    if (!t) return "ch\u01B0a c\xF3";
    let {
        stage: i
    } = di();
    return i.innerHTML = "", t.sheet.style.cssText = "max-height:88vh;max-width:96vw", i.appendChild(t.sheet), t.fmt
};
Y.view = async function(e, t) {
    let i = Y.R[e];
    if (!i) return "ch\u01B0a c\xF3";
    await i.prepare(t), i.render(t);
    let {
        stage: n
    } = di();
    return n.innerHTML = "", i.canvas.style.cssText = "max-height:88vh;max-width:96vw", n.appendChild(i.canvas), `${e} t=${t}`
};

async function Lf(e, u) {
    let t = String(e).split(",")[0].replace(/["']/g, "").trim(),
        i = () => [...document.fonts].some(n => n.family.replace(/["']/g, "") === t && n.status === "loaded");
    if (!t || /^(arial|helvetica|helvetica neue|segoe ui|system-ui|sans-serif|serif|-apple-system|blinkmacsystemfont|times new roman|inherit|initial)$/i.test(t)) return;
    try {
        if (u && !i()) {
            let n = new FontFace(t, `url(${u})`, {
                weight: "100 900"
            });
            await n.load(), document.fonts.add(n)
        }
        if (!i()) {
            let n = document.createElement("link");
            n.rel = "stylesheet", n.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(t).replace(/%20/g,"+")}:wght@400;600;700;800&display=block`, await new Promise((a, o) => {
                n.onload = a, n.onerror = o, document.head.appendChild(n)
            }), await Promise.race([document.fonts.load(`700 20px "${t}"`, "Đặt ệ"), Wt(6e3)])
        }
        if (i()) {
            Ff = `"${t}",`, Y.st.font = t;
            return
        }
    } catch {}
    Y.st.warn.push(`Font "${t}" kh\xF4ng tải được, d\xF9ng font mặc định`)
}
async function Fx(e, t = {}, i = 12e3) {
    let n = new AbortController,
        a = setTimeout(() => n.abort(), i);
    try {
        return await fetch(e, {
            ...t,
            signal: n.signal
        })
    } finally {
        clearTimeout(a)
    }
}
Y.poi = async function(e, t = {}) {
    let i = +t.km || 3,
        n = Math.round(i * 1e3),
        a = `${(+e.lat).toFixed(6)},${(+e.lon).toFixed(6)}`,
        C = t.cats,
        o = [
            ["Y TẾ", '["amenity"~"^(hospital|clinic)$"]'],
            ["MUA SẮM", '["shop"~"^(mall|supermarket|department_store)$"]'],
            ["GI\xC1O DỤC", '["amenity"~"^(school|university|college)$"]'],
            ["KẾT NỐI", '["railway"~"^(station|halt)$"]'],
            ["C\xD4NG VI\xCAN", '["leisure"="park"]'],
            ["THỂ THAO", '["leisure"~"^(golf_course|sports_centre|stadium)$"]'],
            ["H\xC0NH CH\xCDNH", '["amenity"="townhall"]'],
            ["KCN", '["landuse"="industrial"]']
        ].filter(b => !C || C.includes(b[0])),
        f = `[out:json][timeout:20];(${o.map(b=>`nwr(around:${n},${a})${b[1]}["name"];`).join("")});out center tags 400;`,
        p = [
            ["Y TẾ", "bệnh viện", "amenity:hospital"],
            ["MUA SẮM", "trung t\xE2m thương mại", "shop:mall"],
            ["MUA SẮM", "si\xEAu thị", "shop:supermarket"],
            ["GI\xC1O DỤC", "đại học", "amenity:university"],
            ["KẾT NỐI", "bến xe", "amenity:bus_station"],
            ["C\xD4NG VI\xCAN", "c\xF4ng vi\xEAn", "leisure:park"],
            ["THỂ THAO", "s\xE2n golf", "leisure:golf_course"],
            ["KCN", "khu c\xF4ng nghiệp", "landuse:industrial"]
        ].filter(b => !C || C.includes(b[0])),
        L = [],
        src = {
            overpass: 0,
            photon: 0
        };
    let d = (async () => {
            let b = await Promise.any(Ov.map(async x => {
                let T = await Fx(x, {
                    method: "POST",
                    body: "data=" + encodeURIComponent(f),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }, 15e3);
                if (!T.ok) throw new Error("HTTP " + T.status);
                let O = await T.json();
                if (!O.elements || !O.elements.length && O.remark) throw new Error(O.remark || "empty");
                return O.elements
            })).catch(() => null);
            if (b)
                for (let x of b) {
                    let T = x.tags || {};
                    src.overpass++, L.push({
                        name: T["name:vi"] || T.name,
                        lat: x.lat ?? x.center?.lat,
                        lon: x.lon ?? x.center?.lon,
                        kind: T.amenity || T.shop || T.leisure || T.railway || T.landuse || "",
                        wd: !!T.wikidata
                    })
                }
        })(),
        v = async () => {
            let b = 0;
            for (let [T, O, k] of p) {
                if (b >= 2) {
                    src.photonStop = !0;
                    break
                }
                try {
                    let J = await Fx(`https://photon.komoot.io/api/?q=${encodeURIComponent(O)}&lat=${e.lat}&lon=${e.lon}&limit=15&osm_tag=${k}`, {}, 8e3);
                    if (!J.ok) throw new Error("HTTP " + J.status);
                    let H = await J.json();
                    b = 0;
                    for (let M of H.features || []) {
                        let X = M.properties || {},
                            [de, ie] = M.geometry.coordinates;
                        src.photon++, L.push({
                            name: X.name,
                            lat: ie,
                            lon: de,
                            kind: X.osm_value || k.split(":")[1],
                            cat0: T
                        })
                    }
                } catch {
                    b++
                }
                await Wt(1100)
            }
        };
    await d, (!L.length || t.photon) && await v();
    let S = {
            hospital: 3,
            mall: 3,
            university: 3,
            golf_course: 3,
            station: 3,
            bus_station: 2,
            stadium: 2,
            department_store: 2,
            college: 2,
            townhall: 2,
            industrial: 2,
            supermarket: 1.5,
            school: 1,
            park: 1,
            clinic: 0,
            sports_centre: 0,
            halt: 0
        },
        u = (b, x) => /^(hospital|clinic)$/.test(b) ? "Y TẾ" : /^(mall|supermarket|department_store)$/.test(b) ? "MUA SẮM" : /^(school|university|college)$/.test(b) ? "GI\xC1O DỤC" : /^(station|halt|bus_station)$/.test(b) ? "KẾT NỐI" : b === "park" ? "C\xD4NG VI\xCAN" : /^(golf_course|sports_centre|stadium)$/.test(b) ? "THỂ THAO" : b === "townhall" ? "H\xC0NH CH\xCDNH" : b === "industrial" ? "KCN" : x || "",
        R = Math.min(i * 3, i + 12),
        g = new Map;
    for (let b of L) {
        if (!b.name || !isFinite(b.lat) || !isFinite(b.lon)) continue;
        let x = u(b.kind, b.cat0);
        if (!x || C && !C.includes(x)) continue;
        let T = oa(e, b);
        if (T > R) continue;
        let O = aa(b.name).join(" "),
            k = (S[b.kind] ?? .5) + (b.wd ? 2 : 0) - T / i,
            W = g.get(O);
        (!W || k > W.sc) && g.set(O, {
            cat: x,
            name: b.name,
            lat: +(+b.lat).toFixed(6),
            lon: +(+b.lon).toFixed(6),
            km: +T.toFixed(1),
            kind: b.kind,
            sc: k
        })
    }
    if (Y.st.poiSrc = src, !g.size) return {
        err: "Kh\xF4ng lấy được tiện \xEDch (Overpass v\xE0 Photon lỗi hoặc rỗng)",
        src
    };
    let w = [...g.values()].sort((b, x) => x.sc - b.sc),
        y = {},
        z = [];
    for (let b of w)(y[b.cat] = (y[b.cat] || 0) + 1) <= (t.perCat || 4) && z.length < (t.max || 20) && z.push(b);
    return z.map(({
        sc: b,
        ...x
    }) => x)
};
Y.dist = async function(e, t) {
    let i = [];
    for (let n = 0; n < t.length; n += 90) {
        let a = t.slice(n, n + 90),
            o = null;
        try {
            o = await (await Fx(Tb([e, ...a]), {}, 15e3)).json()
        } catch {}
        a.forEach((f, d) => {
            let v = o && o.durations && o.durations[0] ? o.durations[0][d + 1] : null,
                S = o && o.distances && o.distances[0] ? o.distances[0][d + 1] : null,
                u = v == null || S == null,
                b = oa(e, f);
            i.push({
                ...f,
                km: u ? +b.toFixed(1) : +(S / 1e3).toFixed(1),
                min: u ? Math.max(1, Math.round(b * 2)) : Math.max(1, Math.round(v / 60)),
                ...u ? {
                    est: "chim bay"
                } : {}
            })
        })
    }
    return i.sort((n, a) => n.min - a.min)
};
Y.CATS = Object.keys(Mk);
Y.ICONS = Object.keys(MkD);
window.MLV = Y;
})();