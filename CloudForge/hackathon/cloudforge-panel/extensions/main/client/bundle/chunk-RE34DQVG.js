var ki={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Hi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Bc=0,ul=1,zc=2;var dl=1,Gc=2,ui=3,bi=0,At=1,Bt=2,Ei=0,$i=1,pl=2,ml=3,fl=4,kc=5,Fi=100,Hc=101,Vc=102,Wc=103,Xc=104,jc=200,qc=201,Yc=202,Zc=203,wn=204,An=205,Jc=206,Kc=207,$c=208,Qc=209,eh=210,th=211,ih=212,rh=213,sh=214,ya=0,xa=1,Ma=2,Qi=3,Sa=4,ba=5,Ta=6,Ea=7,wa=0,nh=1,ah=2,wi=0,oh=1,lh=2,ch=3,hh=4,uh=5,dh=6,ph=7;var gl=300,sr=301,nr=302,Aa=303,Ra=304,ks=306,Rn=1e3,Oi=1001,Cn=1002,Wt=1003,mh=1004;var Hs=1005;var $t=1006,Ca=1007;var Vi=1008;var ii=1009,_l=1010,vl=1011,Xr=1012,Ia=1013,Wi=1014,di=1015,jr=1016,Pa=1017,La=1018,qr=1020,yl=35902,xl=35899,Ml=1021,Sl=1022,Xt=1023,Cr=1026,Yr=1027,bl=1028,Da=1029,Tl=1030,Ua=1031;var Na=1033,Vs=33776,Ws=33777,Xs=33778,js=33779,Oa=35840,Fa=35841,Ba=35842,za=35843,Ga=36196,ka=37492,Ha=37496,Va=37808,Wa=37809,Xa=37810,ja=37811,qa=37812,Ya=37813,Za=37814,Ja=37815,Ka=37816,$a=37817,Qa=37818,eo=37819,to=37820,io=37821,ro=36492,so=36494,no=36495,ao=36283,oo=36284,lo=36285,co=36286;var hs=2300,In=2301,En=2302,Ko=2400,$o=2401,Qo=2402;var fh=3200,gh=3201;var El=0,_h=1,Ai="",Ut="srgb",er="srgb-linear",us="linear",et="srgb";var Ki=7680;var el=519,vh=512,yh=513,xh=514,wl=515,Mh=516,Sh=517,bh=518,Th=519,tl=35044;var Al="300 es",Vt=2e3,ds=2001;var oi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let s=i[e];if(s!==void 0){let n=s.indexOf(t);n!==-1&&s.splice(n,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let s=i.slice(0);for(let n=0,a=s.length;n<a;n++)s[n].call(this,e);e.target=null}}},Mt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],nc=1234567,Ar=Math.PI/180,Ir=180/Math.PI;function ar(){let r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Mt[r&255]+Mt[r>>8&255]+Mt[r>>16&255]+Mt[r>>24&255]+"-"+Mt[e&255]+Mt[e>>8&255]+"-"+Mt[e>>16&15|64]+Mt[e>>24&255]+"-"+Mt[t&63|128]+Mt[t>>8&255]+"-"+Mt[t>>16&255]+Mt[t>>24&255]+Mt[i&255]+Mt[i>>8&255]+Mt[i>>16&255]+Mt[i>>24&255]).toLowerCase()}function Ve(r,e,t){return Math.max(e,Math.min(t,r))}function Rl(r,e){return(r%e+e)%e}function yu(r,e,t,i,s){return i+(r-e)*(s-i)/(t-e)}function xu(r,e,t){return r!==e?(t-r)/(e-r):0}function os(r,e,t){return(1-t)*r+t*e}function Mu(r,e,t,i){return os(r,e,1-Math.exp(-t*i))}function Su(r,e=1){return e-Math.abs(Rl(r,e*2)-e)}function bu(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*(3-2*r))}function Tu(r,e,t){return r<=e?0:r>=t?1:(r=(r-e)/(t-e),r*r*r*(r*(r*6-15)+10))}function Eu(r,e){return r+Math.floor(Math.random()*(e-r+1))}function wu(r,e){return r+Math.random()*(e-r)}function Au(r){return r*(.5-Math.random())}function Ru(r){r!==void 0&&(nc=r);let e=nc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Cu(r){return r*Ar}function Iu(r){return r*Ir}function Pu(r){return(r&r-1)===0&&r!==0}function Lu(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Du(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Uu(r,e,t,i,s){let n=Math.cos,a=Math.sin,o=n(t/2),l=a(t/2),c=n((e+i)/2),h=a((e+i)/2),d=n((e-i)/2),m=a((e-i)/2),u=n((i-e)/2),g=a((i-e)/2);switch(s){case"XYX":r.set(o*h,l*d,l*m,o*c);break;case"YZY":r.set(l*m,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*m,o*h,o*c);break;case"XZX":r.set(o*h,l*g,l*u,o*c);break;case"YXY":r.set(l*u,o*h,l*g,o*c);break;case"ZYZ":r.set(l*g,l*u,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function wr(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function wt(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}var Cl={DEG2RAD:Ar,RAD2DEG:Ir,generateUUID:ar,clamp:Ve,euclideanModulo:Rl,mapLinear:yu,inverseLerp:xu,lerp:os,damp:Mu,pingpong:Su,smoothstep:bu,smootherstep:Tu,randInt:Eu,randFloat:wu,randFloatSpread:Au,seededRandom:Ru,degToRad:Cu,radToDeg:Iu,isPowerOfTwo:Pu,ceilPowerOfTwo:Lu,floorPowerOfTwo:Du,setQuaternionFromProperEuler:Uu,normalize:wt,denormalize:wr},K=class r{constructor(e=0,t=0){r.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),s=Math.sin(t),n=this.x-e.x,a=this.y-e.y;return this.x=n*i-a*s+e.x,this.y=n*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ct=class{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,n,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],d=i[s+3],m=n[a+0],u=n[a+1],g=n[a+2],_=n[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=m,e[t+1]=u,e[t+2]=g,e[t+3]=_;return}if(d!==_||l!==m||c!==u||h!==g){let f=1-o,p=l*m+c*u+h*g+d*_,b=p>=0?1:-1,y=1-p*p;if(y>Number.EPSILON){let R=Math.sqrt(y),E=Math.atan2(R,p*b);f=Math.sin(f*E)/R,o=Math.sin(o*E)/R}let v=o*b;if(l=l*f+m*v,c=c*f+u*v,h=h*f+g*v,d=d*f+_*v,f===1-o){let R=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=R,c*=R,h*=R,d*=R}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,s,n,a){let o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],d=n[a],m=n[a+1],u=n[a+2],g=n[a+3];return e[t]=o*g+h*d+l*u-c*m,e[t+1]=l*g+h*m+c*d-o*u,e[t+2]=c*g+h*u+o*m-l*d,e[t+3]=h*g-o*d-l*m-c*u,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,s=e._y,n=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),d=o(n/2),m=l(i/2),u=l(s/2),g=l(n/2);switch(a){case"XYZ":this._x=m*h*d+c*u*g,this._y=c*u*d-m*h*g,this._z=c*h*g+m*u*d,this._w=c*h*d-m*u*g;break;case"YXZ":this._x=m*h*d+c*u*g,this._y=c*u*d-m*h*g,this._z=c*h*g-m*u*d,this._w=c*h*d+m*u*g;break;case"ZXY":this._x=m*h*d-c*u*g,this._y=c*u*d+m*h*g,this._z=c*h*g+m*u*d,this._w=c*h*d-m*u*g;break;case"ZYX":this._x=m*h*d-c*u*g,this._y=c*u*d+m*h*g,this._z=c*h*g-m*u*d,this._w=c*h*d+m*u*g;break;case"YZX":this._x=m*h*d+c*u*g,this._y=c*u*d+m*h*g,this._z=c*h*g-m*u*d,this._w=c*h*d-m*u*g;break;case"XZY":this._x=m*h*d-c*u*g,this._y=c*u*d-m*h*g,this._z=c*h*g+m*u*d,this._w=c*h*d+m*u*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],s=t[4],n=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],m=i+o+d;if(m>0){let u=.5/Math.sqrt(m+1);this._w=.25/u,this._x=(h-l)*u,this._y=(n-c)*u,this._z=(a-s)*u}else if(i>o&&i>d){let u=2*Math.sqrt(1+i-o-d);this._w=(h-l)/u,this._x=.25*u,this._y=(s+a)/u,this._z=(n+c)/u}else if(o>d){let u=2*Math.sqrt(1+o-i-d);this._w=(n-c)/u,this._x=(s+a)/u,this._y=.25*u,this._z=(l+h)/u}else{let u=2*Math.sqrt(1+d-i-o);this._w=(a-s)/u,this._x=(n+c)/u,this._y=(l+h)/u,this._z=.25*u}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,s=e._y,n=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-n*l,this._y=s*h+a*l+n*o-i*c,this._z=n*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-n*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let i=this._x,s=this._y,n=this._z,a=this._w,o=a*e._w+i*e._x+s*e._y+n*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=n,this;let l=1-o*o;if(l<=Number.EPSILON){let u=1-t;return this._w=u*a+t*this._w,this._x=u*i+t*this._x,this._y=u*s+t*this._y,this._z=u*n+t*this._z,this.normalize(),this}let c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,m=Math.sin(t*h)/c;return this._w=a*d+this._w*m,this._x=i*d+this._x*m,this._y=s*d+this._y*m,this._z=n*d+this._z*m,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),n=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),n*Math.sin(t),n*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},A=class r{constructor(e=0,t=0,i=0){r.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ac.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ac.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,s=this.z,n=e.elements;return this.x=n[0]*t+n[3]*i+n[6]*s,this.y=n[1]*t+n[4]*i+n[7]*s,this.z=n[2]*t+n[5]*i+n[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,n=e.elements,a=1/(n[3]*t+n[7]*i+n[11]*s+n[15]);return this.x=(n[0]*t+n[4]*i+n[8]*s+n[12])*a,this.y=(n[1]*t+n[5]*i+n[9]*s+n[13])*a,this.z=(n[2]*t+n[6]*i+n[10]*s+n[14])*a,this}applyQuaternion(e){let t=this.x,i=this.y,s=this.z,n=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-n*s),d=2*(n*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-n*d,this.z=s+l*d+n*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,s=this.z,n=e.elements;return this.x=n[0]*t+n[4]*i+n[8]*s,this.y=n[1]*t+n[5]*i+n[9]*s,this.z=n[2]*t+n[6]*i+n[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,s=e.y,n=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-n*o,this.y=n*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return To.copy(this).projectOnVector(e),this.sub(To)}reflect(e){return this.sub(To.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(Ve(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},To=new A,ac=new Ct,Ge=class r{constructor(e,t,i,s,n,a,o,l,c){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,n,a,o,l,c)}set(e,t,i,s,n,a,o,l,c){let h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=n,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,n=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],m=i[2],u=i[5],g=i[8],_=s[0],f=s[3],p=s[6],b=s[1],y=s[4],v=s[7],R=s[2],E=s[5],P=s[8];return n[0]=a*_+o*b+l*R,n[3]=a*f+o*y+l*E,n[6]=a*p+o*v+l*P,n[1]=c*_+h*b+d*R,n[4]=c*f+h*y+d*E,n[7]=c*p+h*v+d*P,n[2]=m*_+u*b+g*R,n[5]=m*f+u*y+g*E,n[8]=m*p+u*v+g*P,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],s=e[2],n=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*n*h+i*o*l+s*n*c-s*a*l}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],n=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,m=o*l-h*n,u=c*n-a*l,g=t*d+i*m+s*u;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=d*_,e[1]=(s*c-h*i)*_,e[2]=(o*i-s*a)*_,e[3]=m*_,e[4]=(h*t-s*l)*_,e[5]=(s*n-o*t)*_,e[6]=u*_,e[7]=(i*l-c*t)*_,e[8]=(a*t-i*n)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,n,a,o){let l=Math.cos(n),c=Math.sin(n);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Eo.makeScale(e,t)),this}rotate(e){return this.premultiply(Eo.makeRotation(-e)),this}translate(e,t){return this.premultiply(Eo.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}},Eo=new Ge;function Il(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function ps(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Eh(){let r=ps("canvas");return r.style.display="block",r}var oc={};function Pr(r){r in oc||(oc[r]=!0,console.warn(r))}function wh(r,e,t){return new Promise(function(i,s){function n(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:s();break;case r.TIMEOUT_EXPIRED:setTimeout(n,t);break;default:i()}}setTimeout(n,t)})}var lc=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cc=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Nu(){let r={enabled:!0,workingColorSpace:er,spaces:{},convert:function(s,n,a){return this.enabled===!1||n===a||!n||!a||(this.spaces[n].transfer===et&&(s.r=Si(s.r),s.g=Si(s.g),s.b=Si(s.b)),this.spaces[n].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[n].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===et&&(s.r=Rr(s.r),s.g=Rr(s.g),s.b=Rr(s.b))),s},workingToColorSpace:function(s,n){return this.convert(s,this.workingColorSpace,n)},colorSpaceToWorking:function(s,n){return this.convert(s,n,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ai?us:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,n=this.workingColorSpace){return s.fromArray(this.spaces[n].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,n,a){return s.copy(this.spaces[n].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,n){return Pr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(s,n)},toWorkingColorSpace:function(s,n){return Pr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(s,n)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[er]:{primaries:e,whitePoint:i,transfer:us,toXYZ:lc,fromXYZ:cc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ut},outputColorSpaceConfig:{drawingBufferColorSpace:Ut}},[Ut]:{primaries:e,whitePoint:i,transfer:et,toXYZ:lc,fromXYZ:cc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ut}}}),r}var Je=Nu();function Si(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Rr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var mr,Pn=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{mr===void 0&&(mr=ps("canvas")),mr.width=e.width,mr.height=e.height;let s=mr.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=mr}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=ps("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let s=i.getImageData(0,0,e.width,e.height),n=s.data;for(let a=0;a<n.length;a++)n[a]=Si(n[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Si(t[i]/255)*255):t[i]=Si(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Ou=0,Lr=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ou++}),this.uuid=ar(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let n;if(Array.isArray(s)){n=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?n.push(wo(s[a].image)):n.push(wo(s[a]))}else n=wo(s);i.url=n}return t||(e.images[this.uuid]=i),i}};function wo(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Pn.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Fu=0,Ao=new A,Rt=class r extends oi{constructor(e=r.DEFAULT_IMAGE,t=r.DEFAULT_MAPPING,i=Oi,s=Oi,n=$t,a=Vi,o=Xt,l=ii,c=r.DEFAULT_ANISOTROPY,h=Ai){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=ar(),this.name="",this.source=new Lr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=n,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new K(0,0),this.repeat=new K(1,1),this.center=new K(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ao).x}get height(){return this.source.getSize(Ao).y}get depth(){return this.source.getSize(Ao).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==gl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Rn:e.x=e.x-Math.floor(e.x);break;case Oi:e.x=e.x<0?0:1;break;case Cn:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Rn:e.y=e.y-Math.floor(e.y);break;case Oi:e.y=e.y<0?0:1;break;case Cn:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Rt.DEFAULT_IMAGE=null,Rt.DEFAULT_MAPPING=gl,Rt.DEFAULT_ANISOTROPY=1;var ot=class r{constructor(e=0,t=0,i=0,s=1){r.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,s=this.z,n=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*n,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*n,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*n,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*n,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,n,a=e.elements,o=a[0],l=a[4],c=a[8],h=a[1],d=a[5],m=a[9],u=a[2],g=a[6],_=a[10];if(Math.abs(l-h)<.01&&Math.abs(c-u)<.01&&Math.abs(m-g)<.01){if(Math.abs(l+h)<.1&&Math.abs(c+u)<.1&&Math.abs(m+g)<.1&&Math.abs(o+d+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let p=(o+1)/2,b=(d+1)/2,y=(_+1)/2,v=(l+h)/4,R=(c+u)/4,E=(m+g)/4;return p>b&&p>y?p<.01?(i=0,s=.707106781,n=.707106781):(i=Math.sqrt(p),s=v/i,n=R/i):b>y?b<.01?(i=.707106781,s=0,n=.707106781):(s=Math.sqrt(b),i=v/s,n=E/s):y<.01?(i=.707106781,s=.707106781,n=0):(n=Math.sqrt(y),i=R/n,s=E/n),this.set(i,s,n,t),this}let f=Math.sqrt((g-m)*(g-m)+(c-u)*(c-u)+(h-l)*(h-l));return Math.abs(f)<.001&&(f=1),this.x=(g-m)/f,this.y=(c-u)/f,this.z=(h-l)/f,this.w=Math.acos((o+d+_-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Ve(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ln=class extends oi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$t,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);let s={width:e,height:t,depth:i.depth},n=new Rt(s);this.textures=[];let a=i.count;for(let o=0;o<a;o++)this.textures[o]=n.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){let t={minFilter:$t,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,n=this.textures.length;s<n;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let s=Object.assign({},e.textures[t].image);this.textures[t].source=new Lr(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},li=class extends Ln{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},ms=class extends Rt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Dn=class extends Rt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=Oi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ot=class{constructor(e=new A(1/0,1/0,1/0),t=new A(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Yt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Yt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Yt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let n=i.getAttribute("position");if(t===!0&&n!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=n.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Yt):Yt.fromBufferAttribute(n,a),Yt.applyMatrix4(e.matrixWorld),this.expandByPoint(Yt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Js.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Js.copy(i.boundingBox)),Js.applyMatrix4(e.matrixWorld),this.union(Js)}let s=e.children;for(let n=0,a=s.length;n<a;n++)this.expandByObject(s[n],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Yt),Yt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ts),Ks.subVectors(this.max,ts),fr.subVectors(e.a,ts),gr.subVectors(e.b,ts),_r.subVectors(e.c,ts),Ri.subVectors(gr,fr),Ci.subVectors(_r,gr),qi.subVectors(fr,_r);let t=[0,-Ri.z,Ri.y,0,-Ci.z,Ci.y,0,-qi.z,qi.y,Ri.z,0,-Ri.x,Ci.z,0,-Ci.x,qi.z,0,-qi.x,-Ri.y,Ri.x,0,-Ci.y,Ci.x,0,-qi.y,qi.x,0];return!Ro(t,fr,gr,_r,Ks)||(t=[1,0,0,0,1,0,0,0,1],!Ro(t,fr,gr,_r,Ks))?!1:($s.crossVectors(Ri,Ci),t=[$s.x,$s.y,$s.z],Ro(t,fr,gr,_r,Ks))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Yt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Yt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},gi=[new A,new A,new A,new A,new A,new A,new A,new A],Yt=new A,Js=new Ot,fr=new A,gr=new A,_r=new A,Ri=new A,Ci=new A,qi=new A,ts=new A,Ks=new A,$s=new A,Yi=new A;function Ro(r,e,t,i,s){for(let n=0,a=r.length-3;n<=a;n+=3){Yi.fromArray(r,n);let o=s.x*Math.abs(Yi.x)+s.y*Math.abs(Yi.y)+s.z*Math.abs(Yi.z),l=e.dot(Yi),c=t.dot(Yi),h=i.dot(Yi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Bu=new Ot,is=new A,Co=new A,Qt=class{constructor(e=new A,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):Bu.setFromPoints(e).getCenter(i);let s=0;for(let n=0,a=e.length;n<a;n++)s=Math.max(s,i.distanceToSquared(e[n]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;is.subVectors(e,this.center);let t=is.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(is,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Co.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(is.copy(e.center).add(Co)),this.expandByPoint(is.copy(e.center).sub(Co))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},_i=new A,Io=new A,Qs=new A,Ii=new A,Po=new A,en=new A,Lo=new A,ci=class{constructor(e=new A,t=new A(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,_i)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=_i.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(_i.copy(this.origin).addScaledVector(this.direction,t),_i.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Io.copy(e).add(t).multiplyScalar(.5),Qs.copy(t).sub(e).normalize(),Ii.copy(this.origin).sub(Io);let n=e.distanceTo(t)*.5,a=-this.direction.dot(Qs),o=Ii.dot(this.direction),l=-Ii.dot(Qs),c=Ii.lengthSq(),h=Math.abs(1-a*a),d,m,u,g;if(h>0)if(d=a*l-o,m=a*o-l,g=n*h,d>=0)if(m>=-g)if(m<=g){let _=1/h;d*=_,m*=_,u=d*(d+a*m+2*o)+m*(a*d+m+2*l)+c}else m=n,d=Math.max(0,-(a*m+o)),u=-d*d+m*(m+2*l)+c;else m=-n,d=Math.max(0,-(a*m+o)),u=-d*d+m*(m+2*l)+c;else m<=-g?(d=Math.max(0,-(-a*n+o)),m=d>0?-n:Math.min(Math.max(-n,-l),n),u=-d*d+m*(m+2*l)+c):m<=g?(d=0,m=Math.min(Math.max(-n,-l),n),u=m*(m+2*l)+c):(d=Math.max(0,-(a*n+o)),m=d>0?n:Math.min(Math.max(-n,-l),n),u=-d*d+m*(m+2*l)+c);else m=a>0?-n:n,d=Math.max(0,-(a*m+o)),u=-d*d+m*(m+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Io).addScaledVector(Qs,m),u}intersectSphere(e,t){_i.subVectors(e.center,this.origin);let i=_i.dot(this.direction),s=_i.dot(_i)-i*i,n=e.radius*e.radius;if(s>n)return null;let a=Math.sqrt(n-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,n,a,o,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,m=this.origin;return c>=0?(i=(e.min.x-m.x)*c,s=(e.max.x-m.x)*c):(i=(e.max.x-m.x)*c,s=(e.min.x-m.x)*c),h>=0?(n=(e.min.y-m.y)*h,a=(e.max.y-m.y)*h):(n=(e.max.y-m.y)*h,a=(e.min.y-m.y)*h),i>a||n>s||((n>i||isNaN(i))&&(i=n),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-m.z)*d,l=(e.max.z-m.z)*d):(o=(e.max.z-m.z)*d,l=(e.min.z-m.z)*d),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,_i)!==null}intersectTriangle(e,t,i,s,n){Po.subVectors(t,e),en.subVectors(i,e),Lo.crossVectors(Po,en);let a=this.direction.dot(Lo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);let l=o*this.direction.dot(en.crossVectors(Ii,en));if(l<0)return null;let c=o*this.direction.dot(Po.cross(Ii));if(c<0||l+c>a)return null;let h=-o*Ii.dot(Lo);return h<0?null:this.at(h/a,n)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},We=class r{constructor(e,t,i,s,n,a,o,l,c,h,d,m,u,g,_,f){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,n,a,o,l,c,h,d,m,u,g,_,f)}set(e,t,i,s,n,a,o,l,c,h,d,m,u,g,_,f){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=n,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=d,p[14]=m,p[3]=u,p[7]=g,p[11]=_,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,i=e.elements,s=1/vr.setFromMatrixColumn(e,0).length(),n=1/vr.setFromMatrixColumn(e,1).length(),a=1/vr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*n,t[5]=i[5]*n,t[6]=i[6]*n,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,s=e.y,n=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(n),d=Math.sin(n);if(e.order==="XYZ"){let m=a*h,u=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=u+g*c,t[5]=m-_*c,t[9]=-o*l,t[2]=_-m*c,t[6]=g+u*c,t[10]=a*l}else if(e.order==="YXZ"){let m=l*h,u=l*d,g=c*h,_=c*d;t[0]=m+_*o,t[4]=g*o-u,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=u*o-g,t[6]=_+m*o,t[10]=a*l}else if(e.order==="ZXY"){let m=l*h,u=l*d,g=c*h,_=c*d;t[0]=m-_*o,t[4]=-a*d,t[8]=g+u*o,t[1]=u+g*o,t[5]=a*h,t[9]=_-m*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){let m=a*h,u=a*d,g=o*h,_=o*d;t[0]=l*h,t[4]=g*c-u,t[8]=m*c+_,t[1]=l*d,t[5]=_*c+m,t[9]=u*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){let m=a*l,u=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=_-m*d,t[8]=g*d+u,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=u*d+g,t[10]=m-_*d}else if(e.order==="XZY"){let m=a*l,u=a*c,g=o*l,_=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=m*d+_,t[5]=a*h,t[9]=u*d-g,t[2]=g*d-u,t[6]=o*h,t[10]=_*d+m}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zu,e,Gu)}lookAt(e,t,i){let s=this.elements;return Lt.subVectors(e,t),Lt.lengthSq()===0&&(Lt.z=1),Lt.normalize(),Pi.crossVectors(i,Lt),Pi.lengthSq()===0&&(Math.abs(i.z)===1?Lt.x+=1e-4:Lt.z+=1e-4,Lt.normalize(),Pi.crossVectors(i,Lt)),Pi.normalize(),tn.crossVectors(Lt,Pi),s[0]=Pi.x,s[4]=tn.x,s[8]=Lt.x,s[1]=Pi.y,s[5]=tn.y,s[9]=Lt.y,s[2]=Pi.z,s[6]=tn.z,s[10]=Lt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,s=t.elements,n=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],m=i[9],u=i[13],g=i[2],_=i[6],f=i[10],p=i[14],b=i[3],y=i[7],v=i[11],R=i[15],E=s[0],P=s[4],C=s[8],S=s[12],M=s[1],L=s[5],U=s[9],B=s[13],H=s[2],W=s[6],V=s[10],$=s[14],k=s[3],se=s[7],pe=s[11],Ie=s[15];return n[0]=a*E+o*M+l*H+c*k,n[4]=a*P+o*L+l*W+c*se,n[8]=a*C+o*U+l*V+c*pe,n[12]=a*S+o*B+l*$+c*Ie,n[1]=h*E+d*M+m*H+u*k,n[5]=h*P+d*L+m*W+u*se,n[9]=h*C+d*U+m*V+u*pe,n[13]=h*S+d*B+m*$+u*Ie,n[2]=g*E+_*M+f*H+p*k,n[6]=g*P+_*L+f*W+p*se,n[10]=g*C+_*U+f*V+p*pe,n[14]=g*S+_*B+f*$+p*Ie,n[3]=b*E+y*M+v*H+R*k,n[7]=b*P+y*L+v*W+R*se,n[11]=b*C+y*U+v*V+R*pe,n[15]=b*S+y*B+v*$+R*Ie,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],s=e[8],n=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],m=e[10],u=e[14],g=e[3],_=e[7],f=e[11],p=e[15];return g*(+n*l*d-s*c*d-n*o*m+i*c*m+s*o*u-i*l*u)+_*(+t*l*u-t*c*m+n*a*m-s*a*u+s*c*h-n*l*h)+f*(+t*c*d-t*o*u-n*a*d+i*a*u+n*o*h-i*c*h)+p*(-s*o*h-t*l*d+t*o*m+s*a*d-i*a*m+i*l*h)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],s=e[2],n=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],m=e[10],u=e[11],g=e[12],_=e[13],f=e[14],p=e[15],b=d*f*c-_*m*c+_*l*u-o*f*u-d*l*p+o*m*p,y=g*m*c-h*f*c-g*l*u+a*f*u+h*l*p-a*m*p,v=h*_*c-g*d*c+g*o*u-a*_*u-h*o*p+a*d*p,R=g*d*l-h*_*l-g*o*m+a*_*m+h*o*f-a*d*f,E=t*b+i*y+s*v+n*R;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let P=1/E;return e[0]=b*P,e[1]=(_*m*n-d*f*n-_*s*u+i*f*u+d*s*p-i*m*p)*P,e[2]=(o*f*n-_*l*n+_*s*c-i*f*c-o*s*p+i*l*p)*P,e[3]=(d*l*n-o*m*n-d*s*c+i*m*c+o*s*u-i*l*u)*P,e[4]=y*P,e[5]=(h*f*n-g*m*n+g*s*u-t*f*u-h*s*p+t*m*p)*P,e[6]=(g*l*n-a*f*n-g*s*c+t*f*c+a*s*p-t*l*p)*P,e[7]=(a*m*n-h*l*n+h*s*c-t*m*c-a*s*u+t*l*u)*P,e[8]=v*P,e[9]=(g*d*n-h*_*n-g*i*u+t*_*u+h*i*p-t*d*p)*P,e[10]=(a*_*n-g*o*n+g*i*c-t*_*c-a*i*p+t*o*p)*P,e[11]=(h*o*n-a*d*n-h*i*c+t*d*c+a*i*u-t*o*u)*P,e[12]=R*P,e[13]=(h*_*s-g*d*s+g*i*m-t*_*m-h*i*f+t*d*f)*P,e[14]=(g*o*s-a*_*s-g*i*l+t*_*l+a*i*f-t*o*f)*P,e[15]=(a*d*s-h*o*s+h*i*l-t*d*l-a*i*m+t*o*m)*P,this}scale(e){let t=this.elements,i=e.x,s=e.y,n=e.z;return t[0]*=i,t[4]*=s,t[8]*=n,t[1]*=i,t[5]*=s,t[9]*=n,t[2]*=i,t[6]*=s,t[10]*=n,t[3]*=i,t[7]*=s,t[11]*=n,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),s=Math.sin(t),n=1-i,a=e.x,o=e.y,l=e.z,c=n*a,h=n*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,n*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,n,a){return this.set(1,i,n,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){let s=this.elements,n=t._x,a=t._y,o=t._z,l=t._w,c=n+n,h=a+a,d=o+o,m=n*c,u=n*h,g=n*d,_=a*h,f=a*d,p=o*d,b=l*c,y=l*h,v=l*d,R=i.x,E=i.y,P=i.z;return s[0]=(1-(_+p))*R,s[1]=(u+v)*R,s[2]=(g-y)*R,s[3]=0,s[4]=(u-v)*E,s[5]=(1-(m+p))*E,s[6]=(f+b)*E,s[7]=0,s[8]=(g+y)*P,s[9]=(f-b)*P,s[10]=(1-(m+_))*P,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){let s=this.elements,n=vr.set(s[0],s[1],s[2]).length(),a=vr.set(s[4],s[5],s[6]).length(),o=vr.set(s[8],s[9],s[10]).length();this.determinant()<0&&(n=-n),e.x=s[12],e.y=s[13],e.z=s[14],Zt.copy(this);let l=1/n,c=1/a,h=1/o;return Zt.elements[0]*=l,Zt.elements[1]*=l,Zt.elements[2]*=l,Zt.elements[4]*=c,Zt.elements[5]*=c,Zt.elements[6]*=c,Zt.elements[8]*=h,Zt.elements[9]*=h,Zt.elements[10]*=h,t.setFromRotationMatrix(Zt),i.x=n,i.y=a,i.z=o,this}makePerspective(e,t,i,s,n,a,o=Vt,l=!1){let c=this.elements,h=2*n/(t-e),d=2*n/(i-s),m=(t+e)/(t-e),u=(i+s)/(i-s),g,_;if(l)g=n/(a-n),_=a*n/(a-n);else if(o===Vt)g=-(a+n)/(a-n),_=-2*a*n/(a-n);else if(o===ds)g=-a/(a-n),_=-a*n/(a-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=m,c[12]=0,c[1]=0,c[5]=d,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,n,a,o=Vt,l=!1){let c=this.elements,h=2/(t-e),d=2/(i-s),m=-(t+e)/(t-e),u=-(i+s)/(i-s),g,_;if(l)g=1/(a-n),_=a/(a-n);else if(o===Vt)g=-2/(a-n),_=-(a+n)/(a-n);else if(o===ds)g=-1/(a-n),_=-n/(a-n);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=m,c[1]=0,c[5]=d,c[9]=0,c[13]=u,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}},vr=new A,Zt=new We,zu=new A(0,0,0),Gu=new A(1,1,1),Pi=new A,tn=new A,Lt=new A,hc=new We,uc=new Ct,ei=class r{constructor(e=0,t=0,i=0,s=r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let s=e.elements,n=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],m=s[6],u=s[10];switch(t){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,u),this._z=Math.atan2(-a,n)):(this._x=Math.atan2(m,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,u),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,n),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-d,u),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-Ve(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(m,u),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,n)):(this._x=0,this._y=Math.atan2(o,u));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,c),this._y=Math.atan2(o,n)):(this._x=Math.atan2(-h,u),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return hc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(hc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return uc.setFromEuler(this),this.setFromQuaternion(uc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ei.DEFAULT_ORDER="XYZ";var Dr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},ku=0,dc=new A,yr=new Ct,vi=new We,rn=new A,rs=new A,Hu=new A,Vu=new Ct,pc=new A(1,0,0),mc=new A(0,1,0),fc=new A(0,0,1),gc={type:"added"},Wu={type:"removed"},xr={type:"childadded",child:null},Do={type:"childremoved",child:null},yt=class r extends oi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ku++}),this.uuid=ar(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let e=new A,t=new ei,i=new Ct,s=new A(1,1,1);function n(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(n),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new We},normalMatrix:{value:new Ge}}),this.matrix=new We,this.matrixWorld=new We,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return yr.setFromAxisAngle(e,t),this.quaternion.multiply(yr),this}rotateOnWorldAxis(e,t){return yr.setFromAxisAngle(e,t),this.quaternion.premultiply(yr),this}rotateX(e){return this.rotateOnAxis(pc,e)}rotateY(e){return this.rotateOnAxis(mc,e)}rotateZ(e){return this.rotateOnAxis(fc,e)}translateOnAxis(e,t){return dc.copy(e).applyQuaternion(this.quaternion),this.position.add(dc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(pc,e)}translateY(e){return this.translateOnAxis(mc,e)}translateZ(e){return this.translateOnAxis(fc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(vi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?rn.copy(e):rn.set(e,t,i);let s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?vi.lookAt(rs,rn,this.up):vi.lookAt(rn,rs,this.up),this.quaternion.setFromRotationMatrix(vi),s&&(vi.extractRotation(s.matrixWorld),yr.setFromRotationMatrix(vi),this.quaternion.premultiply(yr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gc),xr.child=e,this.dispatchEvent(xr),xr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Wu),Do.child=e,this.dispatchEvent(Do),Do.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),vi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),vi.multiply(e.parent.matrixWorld)),e.applyMatrix4(vi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gc),xr.child=e,this.dispatchEvent(xr),xr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){let n=this.children[i].getObjectByProperty(e,t);if(n!==void 0)return n}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let s=this.children;for(let n=0,a=s.length;n<a;n++)s[n].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,Hu),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,Vu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){let s=this.children;for(let n=0,a=s.length;n<a;n++)s[n].updateWorldMatrix(!1,!0)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function n(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=n(e.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];n(e.shapes,d)}else n(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(n(e.materials,this.material[l]));s.material=o}else s.material=n(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(n(e.animations,l))}}if(t){let o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),m=a(e.skeletons),u=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),m.length>0&&(i.skeletons=m),u.length>0&&(i.animations=u),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let s=e.children[i];this.add(s.clone())}return this}};yt.DEFAULT_UP=new A(0,1,0),yt.DEFAULT_MATRIX_AUTO_UPDATE=!0,yt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Jt=new A,yi=new A,Uo=new A,xi=new A,Mr=new A,Sr=new A,_c=new A,No=new A,Oo=new A,Fo=new A,Bo=new ot,zo=new ot,Go=new ot,Mi=class r{constructor(e=new A,t=new A,i=new A){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),Jt.subVectors(e,t),s.cross(Jt);let n=s.lengthSq();return n>0?s.multiplyScalar(1/Math.sqrt(n)):s.set(0,0,0)}static getBarycoord(e,t,i,s,n){Jt.subVectors(s,t),yi.subVectors(i,t),Uo.subVectors(e,t);let a=Jt.dot(Jt),o=Jt.dot(yi),l=Jt.dot(Uo),c=yi.dot(yi),h=yi.dot(Uo),d=a*c-o*o;if(d===0)return n.set(0,0,0),null;let m=1/d,u=(c*l-o*h)*m,g=(a*h-o*l)*m;return n.set(1-u-g,g,u)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,xi)===null?!1:xi.x>=0&&xi.y>=0&&xi.x+xi.y<=1}static getInterpolation(e,t,i,s,n,a,o,l){return this.getBarycoord(e,t,i,s,xi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,xi.x),l.addScaledVector(a,xi.y),l.addScaledVector(o,xi.z),l)}static getInterpolatedAttribute(e,t,i,s,n,a){return Bo.setScalar(0),zo.setScalar(0),Go.setScalar(0),Bo.fromBufferAttribute(e,t),zo.fromBufferAttribute(e,i),Go.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Bo,n.x),a.addScaledVector(zo,n.y),a.addScaledVector(Go,n.z),a}static isFrontFacing(e,t,i,s){return Jt.subVectors(i,t),yi.subVectors(e,t),Jt.cross(yi).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jt.subVectors(this.c,this.b),yi.subVectors(this.a,this.b),Jt.cross(yi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return r.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return r.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,n){return r.getInterpolation(e,this.a,this.b,this.c,t,i,s,n)}containsPoint(e){return r.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return r.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,s=this.b,n=this.c,a,o;Mr.subVectors(s,i),Sr.subVectors(n,i),No.subVectors(e,i);let l=Mr.dot(No),c=Sr.dot(No);if(l<=0&&c<=0)return t.copy(i);Oo.subVectors(e,s);let h=Mr.dot(Oo),d=Sr.dot(Oo);if(h>=0&&d<=h)return t.copy(s);let m=l*d-h*c;if(m<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Mr,a);Fo.subVectors(e,n);let u=Mr.dot(Fo),g=Sr.dot(Fo);if(g>=0&&u<=g)return t.copy(n);let _=u*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(Sr,o);let f=h*g-u*d;if(f<=0&&d-h>=0&&u-g>=0)return _c.subVectors(n,s),o=(d-h)/(d-h+(u-g)),t.copy(s).addScaledVector(_c,o);let p=1/(f+_+m);return a=_*p,o=m*p,t.copy(i).addScaledVector(Mr,a).addScaledVector(Sr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Ah={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},sn={h:0,s:0,l:0};function ko(r,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?r+(e-r)*6*t:t<1/2?e:t<2/3?r+(e-r)*6*(2/3-t):r}var ke=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=Je.workingColorSpace){if(e=Rl(e,1),t=Ve(t,0,1),i=Ve(i,0,1),t===0)this.r=this.g=this.b=i;else{let n=i<=.5?i*(1+t):i+t-i*t,a=2*i-n;this.r=ko(a,n,e+1/3),this.g=ko(a,n,e),this.b=ko(a,n,e-1/3)}return Je.colorSpaceToWorking(this,s),this}setStyle(e,t=Ut){function i(n){n!==void 0&&parseFloat(n)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let n,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,t);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,t);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=s[1],a=n.length;if(a===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(n,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){let i=Ah[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Si(e.r),this.g=Si(e.g),this.b=Si(e.b),this}copyLinearToSRGB(e){return this.r=Rr(e.r),this.g=Rr(e.g),this.b=Rr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return Je.workingToColorSpace(St.copy(this),e),Math.round(Ve(St.r*255,0,255))*65536+Math.round(Ve(St.g*255,0,255))*256+Math.round(Ve(St.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.workingToColorSpace(St.copy(this),t);let i=St.r,s=St.g,n=St.b,a=Math.max(i,s,n),o=Math.min(i,s,n),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(s-n)/d+(s<n?6:0);break;case s:l=(n-i)/d+2;break;case n:l=(i-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Je.workingColorSpace){return Je.workingToColorSpace(St.copy(this),t),e.r=St.r,e.g=St.g,e.b=St.b,e}getStyle(e=Ut){Je.workingToColorSpace(St.copy(this),e);let t=St.r,i=St.g,s=St.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Li),this.setHSL(Li.h+e,Li.s+t,Li.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Li),e.getHSL(sn);let i=os(Li.h,sn.h,t),s=os(Li.s,sn.s,t),n=os(Li.l,sn.l,t);return this.setHSL(i,s,n),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,s=this.b,n=e.elements;return this.r=n[0]*t+n[3]*i+n[6]*s,this.g=n[1]*t+n[4]*i+n[7]*s,this.b=n[2]*t+n[5]*i+n[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},St=new ke;ke.NAMES=Ah;var Xu=0,hi=class extends oi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Xu++}),this.uuid=ar(),this.name="",this.type="Material",this.blending=$i,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wn,this.blendDst=An,this.blendEquation=Fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=el,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ki,this.stencilZFail=Ki,this.stencilZPass=Ki,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(i.blending=this.blending),this.side!==bi&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==wn&&(i.blendSrc=this.blendSrc),this.blendDst!==An&&(i.blendDst=this.blendDst),this.blendEquation!==Fi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==el&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ki&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ki&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ki&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(n){let a=[];for(let o in n){let l=n[o];delete l.metadata,a.push(l)}return a}if(t){let n=s(e.textures),a=s(e.images);n.length>0&&(i.textures=n),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let s=t.length;i=new Array(s);for(let n=0;n!==s;++n)i[n]=t[n].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},tr=class extends hi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=wa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},U_=ju();function ju(){let r=new ArrayBuffer(4),e=new Float32Array(r),t=new Uint32Array(r),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,s[l]=-c-1,s[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,s[l]=13,s[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24):(i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13)}let n=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,n[l]=c|h}for(let l=1024;l<2048;++l)n[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:s,mantissaTable:n,exponentTable:a,offsetTable:o}}var ut=new A,nn=new K,qu=0,Tt=class{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:qu++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=tl,this.updateRanges=[],this.gpuType=di,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,n=this.itemSize;s<n;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)nn.fromBufferAttribute(this,t),nn.applyMatrix3(e),this.setXY(t,nn.x,nn.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix3(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.applyMatrix4(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.applyNormalMatrix(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)ut.fromBufferAttribute(this,t),ut.transformDirection(e),this.setXYZ(t,ut.x,ut.y,ut.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=wr(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=wt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=wr(t,this.array)),t}setX(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=wr(t,this.array)),t}setY(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=wr(t,this.array)),t}setZ(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=wr(t,this.array)),t}setW(e,t){return this.normalized&&(t=wt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=wt(t,this.array),i=wt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=wt(t,this.array),i=wt(i,this.array),s=wt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,n){return e*=this.itemSize,this.normalized&&(t=wt(t,this.array),i=wt(i,this.array),s=wt(s,this.array),n=wt(n,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=n,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==tl&&(e.usage=this.usage),e}};var fs=class extends Tt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var gs=class extends Tt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Ue=class extends Tt{constructor(e,t,i){super(new Float32Array(e),t,i)}},Yu=0,kt=new We,Ho=new yt,br=new A,Dt=new Ot,ss=new Ot,gt=new A,it=class r extends oi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=ar(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Il(e)?gs:fs)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let n=new Ge().getNormalMatrix(e);i.applyNormalMatrix(n),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return kt.makeRotationFromQuaternion(e),this.applyMatrix4(kt),this}rotateX(e){return kt.makeRotationX(e),this.applyMatrix4(kt),this}rotateY(e){return kt.makeRotationY(e),this.applyMatrix4(kt),this}rotateZ(e){return kt.makeRotationZ(e),this.applyMatrix4(kt),this}translate(e,t,i){return kt.makeTranslation(e,t,i),this.applyMatrix4(kt),this}scale(e,t,i){return kt.makeScale(e,t,i),this.applyMatrix4(kt),this}lookAt(e){return Ho.lookAt(e),Ho.updateMatrix(),this.applyMatrix4(Ho.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(br).negate(),this.translate(br.x,br.y,br.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let s=0,n=e.length;s<n;s++){let a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Ue(i,3))}else{let i=Math.min(e.length,t.count);for(let s=0;s<i;s++){let n=e[s];t.setXYZ(s,n.x,n.y,n.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ot);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new A(-1/0,-1/0,-1/0),new A(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){let n=t[i];Dt.setFromBufferAttribute(n),this.morphTargetsRelative?(gt.addVectors(this.boundingBox.min,Dt.min),this.boundingBox.expandByPoint(gt),gt.addVectors(this.boundingBox.max,Dt.max),this.boundingBox.expandByPoint(gt)):(this.boundingBox.expandByPoint(Dt.min),this.boundingBox.expandByPoint(Dt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qt);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new A,1/0);return}if(e){let i=this.boundingSphere.center;if(Dt.setFromBufferAttribute(e),t)for(let n=0,a=t.length;n<a;n++){let o=t[n];ss.setFromBufferAttribute(o),this.morphTargetsRelative?(gt.addVectors(Dt.min,ss.min),Dt.expandByPoint(gt),gt.addVectors(Dt.max,ss.max),Dt.expandByPoint(gt)):(Dt.expandByPoint(ss.min),Dt.expandByPoint(ss.max))}Dt.getCenter(i);let s=0;for(let n=0,a=e.count;n<a;n++)gt.fromBufferAttribute(e,n),s=Math.max(s,i.distanceToSquared(gt));if(t)for(let n=0,a=t.length;n<a;n++){let o=t[n],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)gt.fromBufferAttribute(o,c),l&&(br.fromBufferAttribute(e,c),gt.add(br)),s=Math.max(s,i.distanceToSquared(gt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,s=t.normal,n=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tt(new Float32Array(4*i.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let C=0;C<i.count;C++)o[C]=new A,l[C]=new A;let c=new A,h=new A,d=new A,m=new K,u=new K,g=new K,_=new A,f=new A;function p(C,S,M){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,S),d.fromBufferAttribute(i,M),m.fromBufferAttribute(n,C),u.fromBufferAttribute(n,S),g.fromBufferAttribute(n,M),h.sub(c),d.sub(c),u.sub(m),g.sub(m);let L=1/(u.x*g.y-g.x*u.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-u.y).multiplyScalar(L),f.copy(d).multiplyScalar(u.x).addScaledVector(h,-g.x).multiplyScalar(L),o[C].add(_),o[S].add(_),o[M].add(_),l[C].add(f),l[S].add(f),l[M].add(f))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let C=0,S=b.length;C<S;++C){let M=b[C],L=M.start,U=M.count;for(let B=L,H=L+U;B<H;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let y=new A,v=new A,R=new A,E=new A;function P(C){R.fromBufferAttribute(s,C),E.copy(R);let S=o[C];y.copy(S),y.sub(R.multiplyScalar(R.dot(S))).normalize(),v.crossVectors(E,S);let M=v.dot(l[C])<0?-1:1;a.setXYZW(C,y.x,y.y,y.z,M)}for(let C=0,S=b.length;C<S;++C){let M=b[C],L=M.start,U=M.count;for(let B=L,H=L+U;B<H;B+=3)P(e.getX(B+0)),P(e.getX(B+1)),P(e.getX(B+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Tt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let m=0,u=i.count;m<u;m++)i.setXYZ(m,0,0,0);let s=new A,n=new A,a=new A,o=new A,l=new A,c=new A,h=new A,d=new A;if(e)for(let m=0,u=e.count;m<u;m+=3){let g=e.getX(m+0),_=e.getX(m+1),f=e.getX(m+2);s.fromBufferAttribute(t,g),n.fromBufferAttribute(t,_),a.fromBufferAttribute(t,f),h.subVectors(a,n),d.subVectors(s,n),h.cross(d),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,f),o.add(h),l.add(h),c.add(h),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let m=0,u=t.count;m<u;m+=3)s.fromBufferAttribute(t,m+0),n.fromBufferAttribute(t,m+1),a.fromBufferAttribute(t,m+2),h.subVectors(a,n),d.subVectors(s,n),h.cross(d),i.setXYZ(m+0,h.x,h.y,h.z),i.setXYZ(m+1,h.x,h.y,h.z),i.setXYZ(m+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)gt.fromBufferAttribute(e,t),gt.normalize(),e.setXYZ(t,gt.x,gt.y,gt.z)}toNonIndexed(){function e(o,l){let c=o.array,h=o.itemSize,d=o.normalized,m=new c.constructor(l.length*h),u=0,g=0;for(let _=0,f=l.length;_<f;_++){o.isInterleavedBufferAttribute?u=l[_]*o.data.stride+o.offset:u=l[_]*h;for(let p=0;p<h;p++)m[g++]=c[u++]}return new Tt(m,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new r,i=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=e(l,i);t.setAttribute(o,c)}let n=this.morphAttributes;for(let o in n){let l=[],c=n[o];for(let h=0,d=c.length;h<d;h++){let m=c[h],u=e(m,i);l.push(u)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let s={},n=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,m=c.length;d<m;d++){let u=c[d];h.push(u.toJSON(e.data))}h.length>0&&(s[l]=h,n=!0)}n&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let s=e.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(t))}let n=e.morphAttributes;for(let c in n){let h=[],d=n[c];for(let m=0,u=d.length;m<u;m++)h.push(d[m].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let c=0,h=a.length;c<h;c++){let d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},vc=new We,Zi=new ci,an=new Qt,yc=new A,on=new A,ln=new A,cn=new A,Vo=new A,hn=new A,xc=new A,un=new A,xt=class extends yt{constructor(e=new it,t=new tr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,n=i.length;s<n;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let i=this.geometry,s=i.attributes.position,n=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);let o=this.morphTargetInfluences;if(n&&o){hn.set(0,0,0);for(let l=0,c=n.length;l<c;l++){let h=o[l],d=n[l];h!==0&&(Vo.fromBufferAttribute(d,e),a?hn.addScaledVector(Vo,h):hn.addScaledVector(Vo.sub(t),h))}t.add(hn)}return t}raycast(e,t){let i=this.geometry,s=this.material,n=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),an.copy(i.boundingSphere),an.applyMatrix4(n),Zi.copy(e.ray).recast(e.near),!(an.containsPoint(Zi.origin)===!1&&(Zi.intersectSphere(an,yc)===null||Zi.origin.distanceToSquared(yc)>(e.far-e.near)**2))&&(vc.copy(n).invert(),Zi.copy(e.ray).applyMatrix4(vc),!(i.boundingBox!==null&&Zi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Zi)))}_computeIntersections(e,t,i){let s,n=this.geometry,a=this.material,o=n.index,l=n.attributes.position,c=n.attributes.uv,h=n.attributes.uv1,d=n.attributes.normal,m=n.groups,u=n.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=m.length;g<_;g++){let f=m[g],p=a[f.materialIndex],b=Math.max(f.start,u.start),y=Math.min(o.count,Math.min(f.start+f.count,u.start+u.count));for(let v=b,R=y;v<R;v+=3){let E=o.getX(v),P=o.getX(v+1),C=o.getX(v+2);s=dn(this,p,e,i,c,h,d,E,P,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(o.count,u.start+u.count);for(let f=g,p=_;f<p;f+=3){let b=o.getX(f),y=o.getX(f+1),v=o.getX(f+2);s=dn(this,a,e,i,c,h,d,b,y,v),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=m.length;g<_;g++){let f=m[g],p=a[f.materialIndex],b=Math.max(f.start,u.start),y=Math.min(l.count,Math.min(f.start+f.count,u.start+u.count));for(let v=b,R=y;v<R;v+=3){let E=v,P=v+1,C=v+2;s=dn(this,p,e,i,c,h,d,E,P,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{let g=Math.max(0,u.start),_=Math.min(l.count,u.start+u.count);for(let f=g,p=_;f<p;f+=3){let b=f,y=f+1,v=f+2;s=dn(this,a,e,i,c,h,d,b,y,v),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}};function Zu(r,e,t,i,s,n,a,o){let l;if(e.side===At?l=i.intersectTriangle(a,n,s,!0,o):l=i.intersectTriangle(s,n,a,e.side===bi,o),l===null)return null;un.copy(o),un.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(un);return c<t.near||c>t.far?null:{distance:c,point:un.clone(),object:r}}function dn(r,e,t,i,s,n,a,o,l,c){r.getVertexPosition(o,on),r.getVertexPosition(l,ln),r.getVertexPosition(c,cn);let h=Zu(r,e,t,i,on,ln,cn,xc);if(h){let d=new A;Mi.getBarycoord(xc,on,ln,cn,d),s&&(h.uv=Mi.getInterpolatedAttribute(s,o,l,c,d,new K)),n&&(h.uv1=Mi.getInterpolatedAttribute(n,o,l,c,d,new K)),a&&(h.normal=Mi.getInterpolatedAttribute(a,o,l,c,d,new A),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let m={a:o,b:l,c,normal:new A,materialIndex:0};Mi.getNormal(on,ln,cn,m.normal),h.face=m,h.barycoord=d}return h}var Ti=class r extends it{constructor(e=1,t=1,i=1,s=1,n=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:n,depthSegments:a};let o=this;s=Math.floor(s),n=Math.floor(n),a=Math.floor(a);let l=[],c=[],h=[],d=[],m=0,u=0;g("z","y","x",-1,-1,i,t,e,a,n,0),g("z","y","x",1,-1,i,t,-e,a,n,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,n,4),g("x","y","z",-1,-1,e,t,-i,s,n,5),this.setIndex(l),this.setAttribute("position",new Ue(c,3)),this.setAttribute("normal",new Ue(h,3)),this.setAttribute("uv",new Ue(d,2));function g(_,f,p,b,y,v,R,E,P,C,S){let M=v/P,L=R/C,U=v/2,B=R/2,H=E/2,W=P+1,V=C+1,$=0,k=0,se=new A;for(let pe=0;pe<V;pe++){let Ie=pe*L-B;for(let Le=0;Le<W;Le++){let Ye=Le*M-U;se[_]=Ye*b,se[f]=Ie*y,se[p]=H,c.push(se.x,se.y,se.z),se[_]=0,se[f]=0,se[p]=E>0?1:-1,h.push(se.x,se.y,se.z),d.push(Le/P),d.push(1-pe/C),$+=1}}for(let pe=0;pe<C;pe++)for(let Ie=0;Ie<P;Ie++){let Le=m+Ie+W*pe,Ye=m+Ie+W*(pe+1),$e=m+(Ie+1)+W*(pe+1),Ke=m+(Ie+1)+W*pe;l.push(Le,Ye,Ke),l.push(Ye,$e,Ke),k+=6}o.addGroup(u,k,S),u+=k,m+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function or(r){let e={};for(let t in r){e[t]={};for(let i in r[t]){let s=r[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Et(r){let e={};for(let t=0;t<r.length;t++){let i=or(r[t]);for(let s in i)e[s]=i[s]}return e}function Ju(r){let e=[];for(let t=0;t<r.length;t++)e.push(r[t].clone());return e}function Pl(r){let e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}var Rh={clone:or,merge:Et},Ku=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$u=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ti=class extends hi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ku,this.fragmentShader=$u,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=or(e.uniforms),this.uniformsGroups=Ju(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let s in this.uniforms){let n=this.uniforms[s].value;n&&n.isTexture?t.uniforms[s]={type:"t",value:n.toJSON(e).uuid}:n&&n.isColor?t.uniforms[s]={type:"c",value:n.getHex()}:n&&n.isVector2?t.uniforms[s]={type:"v2",value:n.toArray()}:n&&n.isVector3?t.uniforms[s]={type:"v3",value:n.toArray()}:n&&n.isVector4?t.uniforms[s]={type:"v4",value:n.toArray()}:n&&n.isMatrix3?t.uniforms[s]={type:"m3",value:n.toArray()}:n&&n.isMatrix4?t.uniforms[s]={type:"m4",value:n.toArray()}:t.uniforms[s]={value:n}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}},Ur=class extends yt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new We,this.projectionMatrix=new We,this.projectionMatrixInverse=new We,this.coordinateSystem=Vt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Di=new A,Mc=new K,Sc=new K,bt=class extends Ur{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ir*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ir*2*Math.atan(Math.tan(Ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Di.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Di.x,Di.y).multiplyScalar(-e/Di.z),Di.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Di.x,Di.y).multiplyScalar(-e/Di.z)}getViewSize(e,t){return this.getViewBounds(e,Mc,Sc),t.subVectors(Sc,Mc)}setViewOffset(e,t,i,s,n,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=n,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Ar*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,n=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;n+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}let o=this.filmOffset;o!==0&&(n+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(n,n+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Tr=-90,Er=1,Un=class extends yt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new bt(Tr,Er,e,t);s.layers=this.layers,this.add(s);let n=new bt(Tr,Er,e,t);n.layers=this.layers,this.add(n);let a=new bt(Tr,Er,e,t);a.layers=this.layers,this.add(a);let o=new bt(Tr,Er,e,t);o.layers=this.layers,this.add(o);let l=new bt(Tr,Er,e,t);l.layers=this.layers,this.add(l);let c=new bt(Tr,Er,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,s,n,a,o,l]=t;for(let c of t)this.remove(c);if(e===Vt)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ds)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[n,a,o,l,c,h]=this.children,d=e.getRenderTarget(),m=e.getActiveCubeFace(),u=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,n),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(d,m,u),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},_s=class extends Rt{constructor(e=[],t=sr,i,s,n,a,o,l,c,h){super(e,t,i,s,n,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Nn=class extends li{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new _s(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ti(5,5,5),n=new ti({name:"CubemapFromEquirect",uniforms:or(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:At,blending:Ei});n.uniforms.tEquirect.value=t;let a=new xt(s,n),o=t.minFilter;return t.minFilter===Vi&&(t.minFilter=$t),new Un(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){let n=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(n)}},Kt=class extends yt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Qu={type:"move"},Nr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Kt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Kt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new A,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new A),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Kt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new A,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new A),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,n=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(let _ of e.hand.values()){let f=t.getJointPose(_,i),p=this._getHandJoint(c,_);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],m=h.position.distanceTo(d.position),u=.02,g=.005;c.inputState.pinching&&m>u+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&m<=u-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(n=t.getPose(e.gripSpace,i),n!==null&&(l.matrix.fromArray(n.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,n.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(n.linearVelocity)):l.hasLinearVelocity=!1,n.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(n.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&n!==null&&(s=n),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qu)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=n!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Kt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}};var vs=class extends yt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ei,this.environmentIntensity=1,this.environmentRotation=new ei,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}};var N_=new A;var O_=new A,F_=new A,B_=new A,z_=new K,G_=new K,k_=new We,H_=new A,V_=new A,W_=new A,X_=new K,j_=new K,q_=new K;var Y_=new A,Z_=new A;var J_=new A,K_=new ot,$_=new ot,Q_=new A,e0=new We,t0=new A,i0=new Qt,r0=new We,s0=new ci;var n0=new We,a0=new We;var o0=new We,l0=new We;var c0=new Ot,h0=new We,u0=new xt,d0=new Qt;var Wo=new A,ed=new A,td=new Ge,Ht=class{constructor(e=new A(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let s=Wo.subVectors(i,t).cross(ed.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let i=e.delta(Wo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let n=-(e.start.dot(this.normal)+this.constant)/s;return n<0||n>1?null:t.copy(e.start).addScaledVector(i,n)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||td.getNormalMatrix(e),s=this.coplanarPoint(Wo).applyMatrix4(e),n=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(n),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ji=new Qt,id=new K(.5,.5),pn=new A,Bi=class{constructor(e=new Ht,t=new Ht,i=new Ht,s=new Ht,n=new Ht,a=new Ht){this.planes=[e,t,i,s,n,a]}set(e,t,i,s,n,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(n),o[5].copy(a),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Vt,i=!1){let s=this.planes,n=e.elements,a=n[0],o=n[1],l=n[2],c=n[3],h=n[4],d=n[5],m=n[6],u=n[7],g=n[8],_=n[9],f=n[10],p=n[11],b=n[12],y=n[13],v=n[14],R=n[15];if(s[0].setComponents(c-a,u-h,p-g,R-b).normalize(),s[1].setComponents(c+a,u+h,p+g,R+b).normalize(),s[2].setComponents(c+o,u+d,p+_,R+y).normalize(),s[3].setComponents(c-o,u-d,p-_,R-y).normalize(),i)s[4].setComponents(l,m,f,v).normalize(),s[5].setComponents(c-l,u-m,p-f,R-v).normalize();else if(s[4].setComponents(c-l,u-m,p-f,R-v).normalize(),t===Vt)s[5].setComponents(c+l,u+m,p+f,R+v).normalize();else if(t===ds)s[5].setComponents(l,m,f,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ji.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ji.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ji)}intersectsSprite(e){Ji.center.set(0,0,0);let t=id.distanceTo(e.center);return Ji.radius=.7071067811865476+t,Ji.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ji)}intersectsSphere(e){let t=this.planes,i=e.center,s=-e.radius;for(let n=0;n<6;n++)if(t[n].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let s=t[i];if(pn.x=s.normal.x>0?e.max.x:e.min.x,pn.y=s.normal.y>0?e.max.y:e.min.y,pn.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(pn)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},si=new We,ni=new Bi,On=class r{constructor(){this.coordinateSystem=Vt}intersectsObject(e,t){if(!t.isArrayCamera||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let s=t.cameras[i];if(si.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),ni.setFromProjectionMatrix(si,s.coordinateSystem,s.reversedDepth),ni.intersectsObject(e))return!0}return!1}intersectsSprite(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let s=t.cameras[i];if(si.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),ni.setFromProjectionMatrix(si,s.coordinateSystem,s.reversedDepth),ni.intersectsSprite(e))return!0}return!1}intersectsSphere(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let s=t.cameras[i];if(si.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),ni.setFromProjectionMatrix(si,s.coordinateSystem,s.reversedDepth),ni.intersectsSphere(e))return!0}return!1}intersectsBox(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let s=t.cameras[i];if(si.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),ni.setFromProjectionMatrix(si,s.coordinateSystem,s.reversedDepth),ni.intersectsBox(e))return!0}return!1}containsPoint(e,t){if(!t||!t.cameras||t.cameras.length===0)return!1;for(let i=0;i<t.cameras.length;i++){let s=t.cameras[i];if(si.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),ni.setFromProjectionMatrix(si,s.coordinateSystem,s.reversedDepth),ni.containsPoint(e))return!0}return!1}clone(){return new r}};var il=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(e,t,i,s){let n=this.pool,a=this.list;this.index>=n.length&&n.push({start:-1,count:-1,z:-1,index:-1});let o=n[this.index];a.push(o),this.index++,o.start=e,o.count=t,o.z=i,o.index=s}reset(){this.list.length=0,this.index=0}},p0=new We,m0=new ke(1,1,1),f0=new Bi,g0=new On,_0=new Ot,v0=new Qt,y0=new A,x0=new A,M0=new A,S0=new il,b0=new xt;var Or=class extends hi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Fn=new A,Bn=new A,bc=new We,ns=new ci,mn=new Qt,Xo=new A,Tc=new A,zn=class extends yt{constructor(e=new it,t=new Or){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let s=1,n=t.count;s<n;s++)Fn.fromBufferAttribute(t,s-1),Bn.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Fn.distanceTo(Bn);e.setAttribute("lineDistance",new Ue(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,n=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),mn.copy(i.boundingSphere),mn.applyMatrix4(s),mn.radius+=n,e.ray.intersectsSphere(mn)===!1)return;bc.copy(s).invert(),ns.copy(e.ray).applyMatrix4(bc);let o=n/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){let m=Math.max(0,a.start),u=Math.min(h.count,a.start+a.count);for(let g=m,_=u-1;g<_;g+=c){let f=h.getX(g),p=h.getX(g+1),b=fn(this,e,ns,l,f,p,g);b&&t.push(b)}if(this.isLineLoop){let g=h.getX(u-1),_=h.getX(m),f=fn(this,e,ns,l,g,_,u-1);f&&t.push(f)}}else{let m=Math.max(0,a.start),u=Math.min(d.count,a.start+a.count);for(let g=m,_=u-1;g<_;g+=c){let f=fn(this,e,ns,l,g,g+1,g);f&&t.push(f)}if(this.isLineLoop){let g=fn(this,e,ns,l,u-1,m,u-1);g&&t.push(g)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,n=i.length;s<n;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function fn(r,e,t,i,s,n,a){let o=r.geometry.attributes.position;if(Fn.fromBufferAttribute(o,s),Bn.fromBufferAttribute(o,n),t.distanceSqToSegment(Fn,Bn,Xo,Tc)>i)return;Xo.applyMatrix4(r.matrixWorld);let l=e.ray.origin.distanceTo(Xo);if(!(l<e.near||l>e.far))return{distance:l,point:Tc.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}var Ec=new A,wc=new A,ys=class extends zn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let s=0,n=t.count;s<n;s+=2)Ec.fromBufferAttribute(t,s),wc.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ec.distanceTo(wc);e.setAttribute("lineDistance",new Ue(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Fr=class extends hi{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ac=new We,rl=new ci,gn=new Qt,_n=new A,xs=class extends yt{constructor(e=new it,t=new Fr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let i=this.geometry,s=this.matrixWorld,n=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),gn.copy(i.boundingSphere),gn.applyMatrix4(s),gn.radius+=n,e.ray.intersectsSphere(gn)===!1)return;Ac.copy(s).invert(),rl.copy(e.ray).applyMatrix4(Ac);let o=n/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){let d=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let u=d,g=m;u<g;u++){let _=c.getX(u);_n.fromBufferAttribute(h,_),Rc(_n,_,l,s,e,t,this)}}else{let d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let u=d,g=m;u<g;u++)_n.fromBufferAttribute(h,u),Rc(_n,u,l,s,e,t,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,n=i.length;s<n;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Rc(r,e,t,i,s,n,a){let o=rl.distanceSqToPoint(r);if(o<t){let l=new A;rl.closestPointToPoint(r,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;n.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}var Ms=class extends Rt{constructor(e,t,i,s,n,a,o,l,c){super(e,t,i,s,n,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Ss=class extends Rt{constructor(e,t,i=Wi,s,n,a,o=Wt,l=Wt,c,h=Cr,d=1){if(h!==Cr&&h!==Yr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let m={width:e,height:t,depth:d};super(m,s,n,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Lr(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}},bs=class extends Rt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Gn=class r extends it{constructor(e=1,t=1,i=4,s=8,n=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:i,radialSegments:s,heightSegments:n},t=Math.max(0,t),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),n=Math.max(1,Math.floor(n));let a=[],o=[],l=[],c=[],h=t/2,d=Math.PI/2*e,m=t,u=2*d+m,g=i*2+n,_=s+1,f=new A,p=new A;for(let b=0;b<=g;b++){let y=0,v=0,R=0,E=0;if(b<=i){let S=b/i,M=S*Math.PI/2;v=-h-e*Math.cos(M),R=e*Math.sin(M),E=-e*Math.cos(M),y=S*d}else if(b<=i+n){let S=(b-i)/n;v=-h+S*t,R=e,E=0,y=d+S*m}else{let S=(b-i-n)/i,M=S*Math.PI/2;v=h+e*Math.sin(M),R=e*Math.cos(M),E=e*Math.sin(M),y=d+m+S*d}let P=Math.max(0,Math.min(1,y/u)),C=0;b===0?C=.5/s:b===g&&(C=-.5/s);for(let S=0;S<=s;S++){let M=S/s,L=M*Math.PI*2,U=Math.sin(L),B=Math.cos(L);p.x=-R*B,p.y=v,p.z=R*U,o.push(p.x,p.y,p.z),f.set(-R*B,E,R*U),f.normalize(),l.push(f.x,f.y,f.z),c.push(M+C,P)}if(b>0){let S=(b-1)*_;for(let M=0;M<s;M++){let L=S+M,U=S+M+1,B=b*_+M,H=b*_+M+1;a.push(L,U,B),a.push(U,H,B)}}}this.setIndex(a),this.setAttribute("position",new Ue(o,3)),this.setAttribute("normal",new Ue(l,3)),this.setAttribute("uv",new Ue(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},kn=class r extends it{constructor(e=1,t=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:s},t=Math.max(3,t);let n=[],a=[],o=[],l=[],c=new A,h=new K;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,m=3;d<=t;d++,m+=3){let u=i+d/t*s;c.x=e*Math.cos(u),c.y=e*Math.sin(u),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[m]/e+1)/2,h.y=(a[m+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)n.push(d,d+1,0);this.setIndex(n),this.setAttribute("position",new Ue(a,3)),this.setAttribute("normal",new Ue(o,3)),this.setAttribute("uv",new Ue(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.segments,e.thetaStart,e.thetaLength)}},zi=class r extends it{constructor(e=1,t=1,i=1,s=32,n=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:n,openEnded:a,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),n=Math.floor(n);let h=[],d=[],m=[],u=[],g=0,_=[],f=i/2,p=0;b(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new Ue(d,3)),this.setAttribute("normal",new Ue(m,3)),this.setAttribute("uv",new Ue(u,2));function b(){let v=new A,R=new A,E=0,P=(t-e)/i;for(let C=0;C<=n;C++){let S=[],M=C/n,L=M*(t-e)+e;for(let U=0;U<=s;U++){let B=U/s,H=B*l+o,W=Math.sin(H),V=Math.cos(H);R.x=L*W,R.y=-M*i+f,R.z=L*V,d.push(R.x,R.y,R.z),v.set(W,P,V).normalize(),m.push(v.x,v.y,v.z),u.push(B,1-M),S.push(g++)}_.push(S)}for(let C=0;C<s;C++)for(let S=0;S<n;S++){let M=_[S][C],L=_[S+1][C],U=_[S+1][C+1],B=_[S][C+1];(e>0||S!==0)&&(h.push(M,L,B),E+=3),(t>0||S!==n-1)&&(h.push(L,U,B),E+=3)}c.addGroup(p,E,0),p+=E}function y(v){let R=g,E=new K,P=new A,C=0,S=v===!0?e:t,M=v===!0?1:-1;for(let U=1;U<=s;U++)d.push(0,f*M,0),m.push(0,M,0),u.push(.5,.5),g++;let L=g;for(let U=0;U<=s;U++){let B=U/s*l+o,H=Math.cos(B),W=Math.sin(B);P.x=S*W,P.y=f*M,P.z=S*H,d.push(P.x,P.y,P.z),m.push(0,M,0),E.x=H*.5+.5,E.y=W*.5*M+.5,u.push(E.x,E.y),g++}for(let U=0;U<s;U++){let B=R+U,H=L+U;v===!0?h.push(H,H+1,B):h.push(H+1,H,B),C+=3}c.addGroup(p,C,v===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Hn=class r extends zi{constructor(e=1,t=1,i=32,s=1,n=!1,a=0,o=Math.PI*2){super(0,e,t,i,s,n,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:s,openEnded:n,thetaStart:a,thetaLength:o}}static fromJSON(e){return new r(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}},Gi=class r extends it{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};let n=[],a=[];o(s),c(i),h(),this.setAttribute("position",new Ue(n,3)),this.setAttribute("normal",new Ue(n.slice(),3)),this.setAttribute("uv",new Ue(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){let y=new A,v=new A,R=new A;for(let E=0;E<t.length;E+=3)u(t[E+0],y),u(t[E+1],v),u(t[E+2],R),l(y,v,R,b)}function l(b,y,v,R){let E=R+1,P=[];for(let C=0;C<=E;C++){P[C]=[];let S=b.clone().lerp(v,C/E),M=y.clone().lerp(v,C/E),L=E-C;for(let U=0;U<=L;U++)U===0&&C===E?P[C][U]=S:P[C][U]=S.clone().lerp(M,U/L)}for(let C=0;C<E;C++)for(let S=0;S<2*(E-C)-1;S++){let M=Math.floor(S/2);S%2===0?(m(P[C][M+1]),m(P[C+1][M]),m(P[C][M])):(m(P[C][M+1]),m(P[C+1][M+1]),m(P[C+1][M]))}}function c(b){let y=new A;for(let v=0;v<n.length;v+=3)y.x=n[v+0],y.y=n[v+1],y.z=n[v+2],y.normalize().multiplyScalar(b),n[v+0]=y.x,n[v+1]=y.y,n[v+2]=y.z}function h(){let b=new A;for(let y=0;y<n.length;y+=3){b.x=n[y+0],b.y=n[y+1],b.z=n[y+2];let v=f(b)/2/Math.PI+.5,R=p(b)/Math.PI+.5;a.push(v,1-R)}g(),d()}function d(){for(let b=0;b<a.length;b+=6){let y=a[b+0],v=a[b+2],R=a[b+4],E=Math.max(y,v,R),P=Math.min(y,v,R);E>.9&&P<.1&&(y<.2&&(a[b+0]+=1),v<.2&&(a[b+2]+=1),R<.2&&(a[b+4]+=1))}}function m(b){n.push(b.x,b.y,b.z)}function u(b,y){let v=b*3;y.x=e[v+0],y.y=e[v+1],y.z=e[v+2]}function g(){let b=new A,y=new A,v=new A,R=new A,E=new K,P=new K,C=new K;for(let S=0,M=0;S<n.length;S+=9,M+=6){b.set(n[S+0],n[S+1],n[S+2]),y.set(n[S+3],n[S+4],n[S+5]),v.set(n[S+6],n[S+7],n[S+8]),E.set(a[M+0],a[M+1]),P.set(a[M+2],a[M+3]),C.set(a[M+4],a[M+5]),R.copy(b).add(y).add(v).divideScalar(3);let L=f(R);_(E,M+0,b,L),_(P,M+2,y,L),_(C,M+4,v,L)}}function _(b,y,v,R){R<0&&b.x===1&&(a[y]=b.x-1),v.x===0&&v.z===0&&(a[y]=R/2/Math.PI+.5)}function f(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.vertices,e.indices,e.radius,e.details)}},Vn=class r extends Gi{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=1/i,n=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(n,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},vn=new A,yn=new A,jo=new A,xn=new Mi,Wn=class extends it{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let i=Math.pow(10,4),s=Math.cos(Ar*t),n=e.getIndex(),a=e.getAttribute("position"),o=n?n.count:a.count,l=[0,0,0],c=["a","b","c"],h=new Array(3),d={},m=[];for(let u=0;u<o;u+=3){n?(l[0]=n.getX(u),l[1]=n.getX(u+1),l[2]=n.getX(u+2)):(l[0]=u,l[1]=u+1,l[2]=u+2);let{a:g,b:_,c:f}=xn;if(g.fromBufferAttribute(a,l[0]),_.fromBufferAttribute(a,l[1]),f.fromBufferAttribute(a,l[2]),xn.getNormal(jo),h[0]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,h[1]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,h[2]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let p=0;p<3;p++){let b=(p+1)%3,y=h[p],v=h[b],R=xn[c[p]],E=xn[c[b]],P=`${y}_${v}`,C=`${v}_${y}`;C in d&&d[C]?(jo.dot(d[C].normal)<=s&&(m.push(R.x,R.y,R.z),m.push(E.x,E.y,E.z)),d[C]=null):P in d||(d[P]={index0:l[p],index1:l[b],normal:jo.clone()})}}for(let u in d)if(d[u]){let{index0:g,index1:_}=d[u];vn.fromBufferAttribute(a,g),yn.fromBufferAttribute(a,_),m.push(vn.x,vn.y,vn.z),m.push(yn.x,yn.y,yn.z)}this.setAttribute("position",new Ue(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},Ft=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,s=this.getPoint(0),n=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),n+=i.distanceTo(s),t.push(n),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),s=0,n=i.length,a;t?a=t:a=e*i[n-1];let o=0,l=n-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(n-1);let h=i[s],d=i[s+1]-h,m=(a-h)/d;return(s+m)/(n-1)}getTangent(e,t){let i=e-1e-4,s=e+1e-4;i<0&&(i=0),s>1&&(s=1);let n=this.getPoint(i),a=this.getPoint(s),o=t||(n.isVector2?new K:new A);return o.copy(a).sub(n).normalize(),o}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new A,s=[],n=[],a=[],o=new A,l=new We;for(let u=0;u<=e;u++){let g=u/e;s[u]=this.getTangentAt(g,new A)}n[0]=new A,a[0]=new A;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),d=Math.abs(s[0].y),m=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),m<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),n[0].crossVectors(s[0],o),a[0].crossVectors(s[0],n[0]);for(let u=1;u<=e;u++){if(n[u]=n[u-1].clone(),a[u]=a[u-1].clone(),o.crossVectors(s[u-1],s[u]),o.length()>Number.EPSILON){o.normalize();let g=Math.acos(Ve(s[u-1].dot(s[u]),-1,1));n[u].applyMatrix4(l.makeRotationAxis(o,g))}a[u].crossVectors(s[u],n[u])}if(t===!0){let u=Math.acos(Ve(n[0].dot(n[e]),-1,1));u/=e,s[0].dot(o.crossVectors(n[0],n[e]))>0&&(u=-u);for(let g=1;g<=e;g++)n[g].applyMatrix4(l.makeRotationAxis(s[g],u*g)),a[g].crossVectors(s[g],n[g])}return{tangents:s,normals:n,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Br=class extends Ft{constructor(e=0,t=0,i=1,s=1,n=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=n,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new K){let i=t,s=Math.PI*2,n=this.aEndAngle-this.aStartAngle,a=Math.abs(n)<Number.EPSILON;for(;n<0;)n+=s;for(;n>s;)n-=s;n<Number.EPSILON&&(a?n=0:n=s),this.aClockwise===!0&&!a&&(n===s?n=-s:n=n-s);let o=this.aStartAngle+e*n,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),m=l-this.aX,u=c-this.aY;l=m*h-u*d+this.aX,c=m*d+u*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Xn=class extends Br{constructor(e,t,i,s,n,a){super(e,t,i,i,s,n,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Ll(){let r=0,e=0,t=0,i=0;function s(n,a,o,l){r=n,e=o,t=-3*n+3*a-2*o-l,i=2*n-2*a+o+l}return{initCatmullRom:function(n,a,o,l,c){s(a,o,c*(o-n),c*(l-a))},initNonuniformCatmullRom:function(n,a,o,l,c,h,d){let m=(a-n)/c-(o-n)/(c+h)+(o-a)/h,u=(o-a)/h-(l-a)/(h+d)+(l-o)/d;m*=h,u*=h,s(a,o,m,u)},calc:function(n){let a=n*n,o=a*n;return r+e*n+t*a+i*o}}}var Mn=new A,qo=new Ll,Yo=new Ll,Zo=new Ll,jn=class extends Ft{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new A){let i=t,s=this.points,n=s.length,a=(n-(this.closed?0:1))*e,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/n)+1)*n:l===0&&o===n-1&&(o=n-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%n]:(Mn.subVectors(s[0],s[1]).add(s[0]),c=Mn);let d=s[o%n],m=s[(o+1)%n];if(this.closed||o+2<n?h=s[(o+2)%n]:(Mn.subVectors(s[n-1],s[n-2]).add(s[n-1]),h=Mn),this.curveType==="centripetal"||this.curveType==="chordal"){let u=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),u),_=Math.pow(d.distanceToSquared(m),u),f=Math.pow(m.distanceToSquared(h),u);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),qo.initNonuniformCatmullRom(c.x,d.x,m.x,h.x,g,_,f),Yo.initNonuniformCatmullRom(c.y,d.y,m.y,h.y,g,_,f),Zo.initNonuniformCatmullRom(c.z,d.z,m.z,h.z,g,_,f)}else this.curveType==="catmullrom"&&(qo.initCatmullRom(c.x,d.x,m.x,h.x,this.tension),Yo.initCatmullRom(c.y,d.y,m.y,h.y,this.tension),Zo.initCatmullRom(c.z,d.z,m.z,h.z,this.tension));return i.set(qo.calc(l),Yo.calc(l),Zo.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new A().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function Cc(r,e,t,i,s){let n=(i-e)*.5,a=(s-t)*.5,o=r*r,l=r*o;return(2*t-2*i+n+a)*l+(-3*t+3*i-2*n-a)*o+n*r+t}function rd(r,e){let t=1-r;return t*t*e}function sd(r,e){return 2*(1-r)*r*e}function nd(r,e){return r*r*e}function ls(r,e,t,i){return rd(r,e)+sd(r,t)+nd(r,i)}function ad(r,e){let t=1-r;return t*t*t*e}function od(r,e){let t=1-r;return 3*t*t*r*e}function ld(r,e){return 3*(1-r)*r*r*e}function cd(r,e){return r*r*r*e}function cs(r,e,t,i,s){return ad(r,e)+od(r,t)+ld(r,i)+cd(r,s)}var Ts=class extends Ft{constructor(e=new K,t=new K,i=new K,s=new K){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new K){let i=t,s=this.v0,n=this.v1,a=this.v2,o=this.v3;return i.set(cs(e,s.x,n.x,a.x,o.x),cs(e,s.y,n.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},qn=class extends Ft{constructor(e=new A,t=new A,i=new A,s=new A){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new A){let i=t,s=this.v0,n=this.v1,a=this.v2,o=this.v3;return i.set(cs(e,s.x,n.x,a.x,o.x),cs(e,s.y,n.y,a.y,o.y),cs(e,s.z,n.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},Es=class extends Ft{constructor(e=new K,t=new K){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new K){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new K){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Yn=class extends Ft{constructor(e=new A,t=new A){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new A){let i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new A){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ws=class extends Ft{constructor(e=new K,t=new K,i=new K){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new K){let i=t,s=this.v0,n=this.v1,a=this.v2;return i.set(ls(e,s.x,n.x,a.x),ls(e,s.y,n.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},As=class extends Ft{constructor(e=new A,t=new A,i=new A){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new A){let i=t,s=this.v0,n=this.v1,a=this.v2;return i.set(ls(e,s.x,n.x,a.x),ls(e,s.y,n.y,a.y),ls(e,s.z,n.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},Rs=class extends Ft{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new K){let i=t,s=this.points,n=(s.length-1)*e,a=Math.floor(n),o=n-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],d=s[a>s.length-3?s.length-1:a+2];return i.set(Cc(o,l.x,c.x,h.x,d.x),Cc(o,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let s=e.points[t];this.points.push(new K().fromArray(s))}return this}},Zn=Object.freeze({__proto__:null,ArcCurve:Xn,CatmullRomCurve3:jn,CubicBezierCurve:Ts,CubicBezierCurve3:qn,EllipseCurve:Br,LineCurve:Es,LineCurve3:Yn,QuadraticBezierCurve:ws,QuadraticBezierCurve3:As,SplineCurve:Rs}),Jn=class extends Ft{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Zn[i](t,e))}return this}getPoint(e,t){let i=e*this.getLength(),s=this.getCurveLengths(),n=0;for(;n<s.length;){if(s[n]>=i){let a=s[n]-i,o=this.curves[n],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}n++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],i;for(let s=0,n=this.curves;s<n.length;s++){let a=n[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){let s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){let s=e.curves[t];this.curves.push(new Zn[s.type]().fromJSON(s))}return this}},Cs=class extends Jn{constructor(e){super(),this.type="Path",this.currentPoint=new K,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let i=new Es(this.currentPoint.clone(),new K(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){let n=new ws(this.currentPoint.clone(),new K(e,t),new K(i,s));return this.curves.push(n),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,n,a){let o=new Ts(this.currentPoint.clone(),new K(e,t),new K(i,s),new K(n,a));return this.curves.push(o),this.currentPoint.set(n,a),this}splineThru(e){let t=[this.currentPoint.clone()].concat(e),i=new Rs(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,n,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,n,a),this}absarc(e,t,i,s,n,a){return this.absellipse(e,t,i,i,s,n,a),this}ellipse(e,t,i,s,n,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,s,n,a,o,l),this}absellipse(e,t,i,s,n,a,o,l){let c=new Br(e,t,i,s,n,a,o,l);if(this.curves.length>0){let d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},Is=class extends Cs{constructor(e){super(e),this.uuid=ar(),this.type="Shape",this.holes=[]}getPointsHoles(e){let t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){let s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){let s=e.holes[t];this.holes.push(new Cs().fromJSON(s))}return this}};function hd(r,e,t=2){let i=e&&e.length,s=i?e[0]*t:r.length,n=Ch(r,0,s,t,!0),a=[];if(!n||n.next===n.prev)return a;let o,l,c;if(i&&(n=fd(r,e,n,t)),r.length>80*t){o=1/0,l=1/0;let h=-1/0,d=-1/0;for(let m=t;m<s;m+=t){let u=r[m],g=r[m+1];u<o&&(o=u),g<l&&(l=g),u>h&&(h=u),g>d&&(d=g)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return Ps(n,a,t,o,l,c,0),a}function Ch(r,e,t,i,s){let n;if(s===wd(r,e,t,i)>0)for(let a=e;a<t;a+=i)n=Ic(a/i|0,r[a],r[a+1],n);else for(let a=t-i;a>=e;a-=i)n=Ic(a/i|0,r[a],r[a+1],n);return n&&zr(n,n.next)&&(Ds(n),n=n.next),n}function ir(r,e){if(!r)return r;e||(e=r);let t=r,i;do if(i=!1,!t.steiner&&(zr(t,t.next)||ht(t.prev,t,t.next)===0)){if(Ds(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ps(r,e,t,i,s,n,a){if(!r)return;!a&&n&&xd(r,i,s,n);let o=r;for(;r.prev!==r.next;){let l=r.prev,c=r.next;if(n?dd(r,i,s,n):ud(r)){e.push(l.i,r.i,c.i),Ds(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=pd(ir(r),e),Ps(r,e,t,i,s,n,2)):a===2&&md(r,e,t,i,s,n):Ps(ir(r),e,t,i,s,n,1);break}}}function ud(r){let e=r.prev,t=r,i=r.next;if(ht(e,t,i)>=0)return!1;let s=e.x,n=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(s,n,a),d=Math.min(o,l,c),m=Math.max(s,n,a),u=Math.max(o,l,c),g=i.next;for(;g!==e;){if(g.x>=h&&g.x<=m&&g.y>=d&&g.y<=u&&as(s,o,n,l,a,c,g.x,g.y)&&ht(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function dd(r,e,t,i){let s=r.prev,n=r,a=r.next;if(ht(s,n,a)>=0)return!1;let o=s.x,l=n.x,c=a.x,h=s.y,d=n.y,m=a.y,u=Math.min(o,l,c),g=Math.min(h,d,m),_=Math.max(o,l,c),f=Math.max(h,d,m),p=sl(u,g,e,t,i),b=sl(_,f,e,t,i),y=r.prevZ,v=r.nextZ;for(;y&&y.z>=p&&v&&v.z<=b;){if(y.x>=u&&y.x<=_&&y.y>=g&&y.y<=f&&y!==s&&y!==a&&as(o,h,l,d,c,m,y.x,y.y)&&ht(y.prev,y,y.next)>=0||(y=y.prevZ,v.x>=u&&v.x<=_&&v.y>=g&&v.y<=f&&v!==s&&v!==a&&as(o,h,l,d,c,m,v.x,v.y)&&ht(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;y&&y.z>=p;){if(y.x>=u&&y.x<=_&&y.y>=g&&y.y<=f&&y!==s&&y!==a&&as(o,h,l,d,c,m,y.x,y.y)&&ht(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;v&&v.z<=b;){if(v.x>=u&&v.x<=_&&v.y>=g&&v.y<=f&&v!==s&&v!==a&&as(o,h,l,d,c,m,v.x,v.y)&&ht(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function pd(r,e){let t=r;do{let i=t.prev,s=t.next.next;!zr(i,s)&&Ph(i,t,t.next,s)&&Ls(i,s)&&Ls(s,i)&&(e.push(i.i,t.i,s.i),Ds(t),Ds(t.next),t=r=s),t=t.next}while(t!==r);return ir(t)}function md(r,e,t,i,s,n){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&bd(a,o)){let l=Lh(a,o);a=ir(a,a.next),l=ir(l,l.next),Ps(a,e,t,i,s,n,0),Ps(l,e,t,i,s,n,0);return}o=o.next}a=a.next}while(a!==r)}function fd(r,e,t,i){let s=[];for(let n=0,a=e.length;n<a;n++){let o=e[n]*i,l=n<a-1?e[n+1]*i:r.length,c=Ch(r,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(Sd(c))}s.sort(gd);for(let n=0;n<s.length;n++)t=_d(s[n],t);return t}function gd(r,e){let t=r.x-e.x;if(t===0&&(t=r.y-e.y,t===0)){let i=(r.next.y-r.y)/(r.next.x-r.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function _d(r,e){let t=vd(r,e);if(!t)return e;let i=Lh(t,r);return ir(i,i.next),ir(t,t.next)}function vd(r,e){let t=e,i=r.x,s=r.y,n=-1/0,a;if(zr(r,t))return t;do{if(zr(r,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){let d=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=i&&d>n&&(n=d,a=t.x<t.next.x?t:t.next,d===i))return a}t=t.next}while(t!==e);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Ih(s<c?i:n,s,l,c,s<c?n:i,s,t.x,t.y)){let d=Math.abs(s-t.y)/(i-t.x);Ls(t,r)&&(d<h||d===h&&(t.x>a.x||t.x===a.x&&yd(a,t)))&&(a=t,h=d)}t=t.next}while(t!==o);return a}function yd(r,e){return ht(r.prev,r,e.prev)<0&&ht(e.next,r,r.next)<0}function xd(r,e,t,i){let s=r;do s.z===0&&(s.z=sl(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==r);s.prevZ.nextZ=null,s.prevZ=null,Md(s)}function Md(r){let e,t=1;do{let i=r,s;r=null;let n=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),n?n.nextZ=s:r=s,s.prevZ=n,n=s;i=a}n.nextZ=null,t*=2}while(e>1);return r}function sl(r,e,t,i,s){return r=(r-t)*s|0,e=(e-i)*s|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r|e<<1}function Sd(r){let e=r,t=r;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==r);return t}function Ih(r,e,t,i,s,n,a,o){return(s-a)*(e-o)>=(r-a)*(n-o)&&(r-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(n-o)>=(s-a)*(i-o)}function as(r,e,t,i,s,n,a,o){return!(r===a&&e===o)&&Ih(r,e,t,i,s,n,a,o)}function bd(r,e){return r.next.i!==e.i&&r.prev.i!==e.i&&!Td(r,e)&&(Ls(r,e)&&Ls(e,r)&&Ed(r,e)&&(ht(r.prev,r,e.prev)||ht(r,e.prev,e))||zr(r,e)&&ht(r.prev,r,r.next)>0&&ht(e.prev,e,e.next)>0)}function ht(r,e,t){return(e.y-r.y)*(t.x-e.x)-(e.x-r.x)*(t.y-e.y)}function zr(r,e){return r.x===e.x&&r.y===e.y}function Ph(r,e,t,i){let s=bn(ht(r,e,t)),n=bn(ht(r,e,i)),a=bn(ht(t,i,r)),o=bn(ht(t,i,e));return!!(s!==n&&a!==o||s===0&&Sn(r,t,e)||n===0&&Sn(r,i,e)||a===0&&Sn(t,r,i)||o===0&&Sn(t,e,i))}function Sn(r,e,t){return e.x<=Math.max(r.x,t.x)&&e.x>=Math.min(r.x,t.x)&&e.y<=Math.max(r.y,t.y)&&e.y>=Math.min(r.y,t.y)}function bn(r){return r>0?1:r<0?-1:0}function Td(r,e){let t=r;do{if(t.i!==r.i&&t.next.i!==r.i&&t.i!==e.i&&t.next.i!==e.i&&Ph(t,t.next,r,e))return!0;t=t.next}while(t!==r);return!1}function Ls(r,e){return ht(r.prev,r,r.next)<0?ht(r,e,r.next)>=0&&ht(r,r.prev,e)>=0:ht(r,e,r.prev)<0||ht(r,r.next,e)<0}function Ed(r,e){let t=r,i=!1,s=(r.x+e.x)/2,n=(r.y+e.y)/2;do t.y>n!=t.next.y>n&&t.next.y!==t.y&&s<(t.next.x-t.x)*(n-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==r);return i}function Lh(r,e){let t=nl(r.i,r.x,r.y),i=nl(e.i,e.x,e.y),s=r.next,n=e.prev;return r.next=e,e.prev=r,t.next=s,s.prev=t,i.next=t,t.prev=i,n.next=i,i.prev=n,i}function Ic(r,e,t,i){let s=nl(r,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ds(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function nl(r,e,t){return{i:r,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function wd(r,e,t,i){let s=0;for(let n=e,a=t-i;n<t;n+=i)s+=(r[a]-r[n])*(r[n+1]+r[a+1]),a=n;return s}var al=class{static triangulate(e,t,i=2){return hd(e,t,i)}},ai=class r{static area(e){let t=e.length,i=0;for(let s=t-1,n=0;n<t;s=n++)i+=e[s].x*e[n].y-e[n].x*e[s].y;return i*.5}static isClockWise(e){return r.area(e)<0}static triangulateShape(e,t){let i=[],s=[],n=[];Pc(e),Lc(i,e);let a=e.length;t.forEach(Pc);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Lc(i,t[l]);let o=al.triangulate(i,s);for(let l=0;l<o.length;l+=3)n.push(o.slice(l,l+3));return n}};function Pc(r){let e=r.length;e>2&&r[e-1].equals(r[0])&&r.pop()}function Lc(r,e){for(let t=0;t<e.length;t++)r.push(e[t].x),r.push(e[t].y)}var Kn=class r extends it{constructor(e=new Is([new K(.5,.5),new K(-.5,.5),new K(-.5,-.5),new K(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let i=this,s=[],n=[];for(let o=0,l=e.length;o<l;o++){let c=e[o];a(c)}this.setAttribute("position",new Ue(s,3)),this.setAttribute("uv",new Ue(n,2)),this.computeVertexNormals();function a(o){let l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1,m=t.bevelEnabled!==void 0?t.bevelEnabled:!0,u=t.bevelThickness!==void 0?t.bevelThickness:.2,g=t.bevelSize!==void 0?t.bevelSize:u-.1,_=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3,p=t.extrudePath,b=t.UVGenerator!==void 0?t.UVGenerator:Ad,y,v=!1,R,E,P,C;p&&(y=p.getSpacedPoints(h),v=!0,m=!1,R=p.computeFrenetFrames(h,!1),E=new A,P=new A,C=new A),m||(f=0,u=0,g=0,_=0);let S=o.extractPoints(c),M=S.shape,L=S.holes;if(!ai.isClockWise(M)){M=M.reverse();for(let w=0,te=L.length;w<te;w++){let ee=L[w];ai.isClockWise(ee)&&(L[w]=ee.reverse())}}function U(w){let te=10000000000000001e-36,ee=w[0];for(let ce=1;ce<=w.length;ce++){let Y=ce%w.length,Me=w[Y],ie=Me.x-ee.x,ve=Me.y-ee.y,He=ie*ie+ve*ve,Be=Math.max(Math.abs(Me.x),Math.abs(Me.y),Math.abs(ee.x),Math.abs(ee.y)),I=te*Be*Be;if(He<=I){w.splice(Y,1),ce--;continue}ee=Me}}U(M),L.forEach(U);let B=L.length,H=M;for(let w=0;w<B;w++){let te=L[w];M=M.concat(te)}function W(w,te,ee){return te||console.error("THREE.ExtrudeGeometry: vec does not exist"),w.clone().addScaledVector(te,ee)}let V=M.length;function $(w,te,ee){let ce,Y,Me,ie=w.x-te.x,ve=w.y-te.y,He=ee.x-w.x,Be=ee.y-w.y,I=ie*ie+ve*ve,x=ie*Be-ve*He;if(Math.abs(x)>Number.EPSILON){let F=Math.sqrt(I),X=Math.sqrt(He*He+Be*Be),Z=te.x-ve/F,j=te.y+ie/F,Ce=ee.x-Be/X,le=ee.y+He/X,Te=((Ce-Z)*Be-(le-j)*He)/(ie*Be-ve*He);ce=Z+ie*Te-w.x,Y=j+ve*Te-w.y;let ge=ce*ce+Y*Y;if(ge<=2)return new K(ce,Y);Me=Math.sqrt(ge/2)}else{let F=!1;ie>Number.EPSILON?He>Number.EPSILON&&(F=!0):ie<-Number.EPSILON?He<-Number.EPSILON&&(F=!0):Math.sign(ve)===Math.sign(Be)&&(F=!0),F?(ce=-ve,Y=ie,Me=Math.sqrt(I)):(ce=ie,Y=ve,Me=Math.sqrt(I/2))}return new K(ce/Me,Y/Me)}let k=[];for(let w=0,te=H.length,ee=te-1,ce=w+1;w<te;w++,ee++,ce++)ee===te&&(ee=0),ce===te&&(ce=0),k[w]=$(H[w],H[ee],H[ce]);let se=[],pe,Ie=k.concat();for(let w=0,te=B;w<te;w++){let ee=L[w];pe=[];for(let ce=0,Y=ee.length,Me=Y-1,ie=ce+1;ce<Y;ce++,Me++,ie++)Me===Y&&(Me=0),ie===Y&&(ie=0),pe[ce]=$(ee[ce],ee[Me],ee[ie]);se.push(pe),Ie=Ie.concat(pe)}let Le;if(f===0)Le=ai.triangulateShape(H,L);else{let w=[],te=[];for(let ee=0;ee<f;ee++){let ce=ee/f,Y=u*Math.cos(ce*Math.PI/2),Me=g*Math.sin(ce*Math.PI/2)+_;for(let ie=0,ve=H.length;ie<ve;ie++){let He=W(H[ie],k[ie],Me);fe(He.x,He.y,-Y),ce===0&&w.push(He)}for(let ie=0,ve=B;ie<ve;ie++){let He=L[ie];pe=se[ie];let Be=[];for(let I=0,x=He.length;I<x;I++){let F=W(He[I],pe[I],Me);fe(F.x,F.y,-Y),ce===0&&Be.push(F)}ce===0&&te.push(Be)}}Le=ai.triangulateShape(w,te)}let Ye=Le.length,$e=g+_;for(let w=0;w<V;w++){let te=m?W(M[w],Ie[w],$e):M[w];v?(P.copy(R.normals[0]).multiplyScalar(te.x),E.copy(R.binormals[0]).multiplyScalar(te.y),C.copy(y[0]).add(P).add(E),fe(C.x,C.y,C.z)):fe(te.x,te.y,0)}for(let w=1;w<=h;w++)for(let te=0;te<V;te++){let ee=m?W(M[te],Ie[te],$e):M[te];v?(P.copy(R.normals[w]).multiplyScalar(ee.x),E.copy(R.binormals[w]).multiplyScalar(ee.y),C.copy(y[w]).add(P).add(E),fe(C.x,C.y,C.z)):fe(ee.x,ee.y,d/h*w)}for(let w=f-1;w>=0;w--){let te=w/f,ee=u*Math.cos(te*Math.PI/2),ce=g*Math.sin(te*Math.PI/2)+_;for(let Y=0,Me=H.length;Y<Me;Y++){let ie=W(H[Y],k[Y],ce);fe(ie.x,ie.y,d+ee)}for(let Y=0,Me=L.length;Y<Me;Y++){let ie=L[Y];pe=se[Y];for(let ve=0,He=ie.length;ve<He;ve++){let Be=W(ie[ve],pe[ve],ce);v?fe(Be.x,Be.y+y[h-1].y,y[h-1].x+ee):fe(Be.x,Be.y,d+ee)}}}Ke(),q();function Ke(){let w=s.length/3;if(m){let te=0,ee=V*te;for(let ce=0;ce<Ye;ce++){let Y=Le[ce];Pe(Y[2]+ee,Y[1]+ee,Y[0]+ee)}te=h+f*2,ee=V*te;for(let ce=0;ce<Ye;ce++){let Y=Le[ce];Pe(Y[0]+ee,Y[1]+ee,Y[2]+ee)}}else{for(let te=0;te<Ye;te++){let ee=Le[te];Pe(ee[2],ee[1],ee[0])}for(let te=0;te<Ye;te++){let ee=Le[te];Pe(ee[0]+V*h,ee[1]+V*h,ee[2]+V*h)}}i.addGroup(w,s.length/3-w,0)}function q(){let w=s.length/3,te=0;Q(H,te),te+=H.length;for(let ee=0,ce=L.length;ee<ce;ee++){let Y=L[ee];Q(Y,te),te+=Y.length}i.addGroup(w,s.length/3-w,1)}function Q(w,te){let ee=w.length;for(;--ee>=0;){let ce=ee,Y=ee-1;Y<0&&(Y=w.length-1);for(let Me=0,ie=h+f*2;Me<ie;Me++){let ve=V*Me,He=V*(Me+1),Be=te+ce+ve,I=te+Y+ve,x=te+Y+He,F=te+ce+He;Re(Be,I,x,F)}}}function fe(w,te,ee){l.push(w),l.push(te),l.push(ee)}function Pe(w,te,ee){be(w),be(te),be(ee);let ce=s.length/3,Y=b.generateTopUV(i,s,ce-3,ce-2,ce-1);qe(Y[0]),qe(Y[1]),qe(Y[2])}function Re(w,te,ee,ce){be(w),be(te),be(ce),be(te),be(ee),be(ce);let Y=s.length/3,Me=b.generateSideWallUV(i,s,Y-6,Y-3,Y-2,Y-1);qe(Me[0]),qe(Me[1]),qe(Me[3]),qe(Me[1]),qe(Me[2]),qe(Me[3])}function be(w){s.push(l[w*3+0]),s.push(l[w*3+1]),s.push(l[w*3+2])}function qe(w){n.push(w.x),n.push(w.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Rd(t,i,e)}static fromJSON(e,t){let i=[];for(let n=0,a=e.shapes.length;n<a;n++){let o=t[e.shapes[n]];i.push(o)}let s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new Zn[s.type]().fromJSON(s)),new r(i,e.options)}},Ad={generateTopUV:function(r,e,t,i,s){let n=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],h=e[s*3+1];return[new K(n,a),new K(o,l),new K(c,h)]},generateSideWallUV:function(r,e,t,i,s,n){let a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],d=e[i*3+2],m=e[s*3],u=e[s*3+1],g=e[s*3+2],_=e[n*3],f=e[n*3+1],p=e[n*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new K(a,1-l),new K(c,1-d),new K(m,1-g),new K(_,1-p)]:[new K(o,1-l),new K(h,1-d),new K(u,1-g),new K(f,1-p)]}};function Rd(r,e,t){if(t.shapes=[],Array.isArray(r))for(let i=0,s=r.length;i<s;i++){let n=r[i];t.shapes.push(n.uuid)}else t.shapes.push(r.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}var $n=class r extends Gi{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],n=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,n,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Qn=class r extends it{constructor(e=[new K(0,-.5),new K(.5,0),new K(0,.5)],t=12,i=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:s},t=Math.floor(t),s=Ve(s,0,Math.PI*2);let n=[],a=[],o=[],l=[],c=[],h=1/t,d=new A,m=new K,u=new A,g=new A,_=new A,f=0,p=0;for(let b=0;b<=e.length-1;b++)switch(b){case 0:f=e[b+1].x-e[b].x,p=e[b+1].y-e[b].y,u.x=p*1,u.y=-f,u.z=p*0,_.copy(u),u.normalize(),l.push(u.x,u.y,u.z);break;case e.length-1:l.push(_.x,_.y,_.z);break;default:f=e[b+1].x-e[b].x,p=e[b+1].y-e[b].y,u.x=p*1,u.y=-f,u.z=p*0,g.copy(u),u.x+=_.x,u.y+=_.y,u.z+=_.z,u.normalize(),l.push(u.x,u.y,u.z),_.copy(g)}for(let b=0;b<=t;b++){let y=i+b*h*s,v=Math.sin(y),R=Math.cos(y);for(let E=0;E<=e.length-1;E++){d.x=e[E].x*v,d.y=e[E].y,d.z=e[E].x*R,a.push(d.x,d.y,d.z),m.x=b/t,m.y=E/(e.length-1),o.push(m.x,m.y);let P=l[3*E+0]*v,C=l[3*E+1],S=l[3*E+0]*R;c.push(P,C,S)}}for(let b=0;b<t;b++)for(let y=0;y<e.length-1;y++){let v=y+b*e.length,R=v,E=v+e.length,P=v+e.length+1,C=v+1;n.push(R,E,C),n.push(P,C,E)}this.setIndex(n),this.setAttribute("position",new Ue(a,3)),this.setAttribute("uv",new Ue(o,2)),this.setAttribute("normal",new Ue(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.points,e.segments,e.phiStart,e.phiLength)}},ea=class r extends Gi{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},Gr=class r extends it{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};let n=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,d=e/o,m=t/l,u=[],g=[],_=[],f=[];for(let p=0;p<h;p++){let b=p*m-a;for(let y=0;y<c;y++){let v=y*d-n;g.push(v,-b,0),_.push(0,0,1),f.push(y/o),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){let y=b+c*p,v=b+c*(p+1),R=b+1+c*(p+1),E=b+1+c*p;u.push(y,v,E),u.push(v,R,E)}this.setIndex(u),this.setAttribute("position",new Ue(g,3)),this.setAttribute("normal",new Ue(_,3)),this.setAttribute("uv",new Ue(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.width,e.height,e.widthSegments,e.heightSegments)}},ta=class r extends it{constructor(e=.5,t=1,i=32,s=1,n=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:s,thetaStart:n,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);let o=[],l=[],c=[],h=[],d=e,m=(t-e)/s,u=new A,g=new K;for(let _=0;_<=s;_++){for(let f=0;f<=i;f++){let p=n+f/i*a;u.x=d*Math.cos(p),u.y=d*Math.sin(p),l.push(u.x,u.y,u.z),c.push(0,0,1),g.x=(u.x/t+1)/2,g.y=(u.y/t+1)/2,h.push(g.x,g.y)}d+=m}for(let _=0;_<s;_++){let f=_*(i+1);for(let p=0;p<i;p++){let b=p+f,y=b,v=b+i+1,R=b+i+2,E=b+1;o.push(y,v,E),o.push(v,R,E)}}this.setIndex(o),this.setAttribute("position",new Ue(l,3)),this.setAttribute("normal",new Ue(c,3)),this.setAttribute("uv",new Ue(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}},ia=class r extends it{constructor(e=new Is([new K(0,.5),new K(-.5,-.5),new K(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};let i=[],s=[],n=[],a=[],o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new Ue(s,3)),this.setAttribute("normal",new Ue(n,3)),this.setAttribute("uv",new Ue(a,2));function c(h){let d=s.length/3,m=h.extractPoints(t),u=m.shape,g=m.holes;ai.isClockWise(u)===!1&&(u=u.reverse());for(let f=0,p=g.length;f<p;f++){let b=g[f];ai.isClockWise(b)===!0&&(g[f]=b.reverse())}let _=ai.triangulateShape(u,g);for(let f=0,p=g.length;f<p;f++){let b=g[f];u=u.concat(b)}for(let f=0,p=u.length;f<p;f++){let b=u[f];s.push(b.x,b.y,0),n.push(0,0,1),a.push(b.x,b.y)}for(let f=0,p=_.length;f<p;f++){let b=_[f],y=b[0]+d,v=b[1]+d,R=b[2]+d;i.push(y,v,R),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return Cd(t,e)}static fromJSON(e,t){let i=[];for(let s=0,n=e.shapes.length;s<n;s++){let a=t[e.shapes[s]];i.push(a)}return new r(i,e.curveSegments)}};function Cd(r,e){if(e.shapes=[],Array.isArray(r))for(let t=0,i=r.length;t<i;t++){let s=r[t];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e}var kr=class r extends it{constructor(e=1,t=32,i=16,s=0,n=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:n,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));let l=Math.min(a+o,Math.PI),c=0,h=[],d=new A,m=new A,u=[],g=[],_=[],f=[];for(let p=0;p<=i;p++){let b=[],y=p/i,v=0;p===0&&a===0?v=.5/t:p===i&&l===Math.PI&&(v=-.5/t);for(let R=0;R<=t;R++){let E=R/t;d.x=-e*Math.cos(s+E*n)*Math.sin(a+y*o),d.y=e*Math.cos(a+y*o),d.z=e*Math.sin(s+E*n)*Math.sin(a+y*o),g.push(d.x,d.y,d.z),m.copy(d).normalize(),_.push(m.x,m.y,m.z),f.push(E+v,1-y),b.push(c++)}h.push(b)}for(let p=0;p<i;p++)for(let b=0;b<t;b++){let y=h[p][b+1],v=h[p][b],R=h[p+1][b],E=h[p+1][b+1];(p!==0||a>0)&&u.push(y,v,E),(p!==i-1||l<Math.PI)&&u.push(v,R,E)}this.setIndex(u),this.setAttribute("position",new Ue(g,3)),this.setAttribute("normal",new Ue(_,3)),this.setAttribute("uv",new Ue(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}},ra=class r extends Gi{constructor(e=1,t=0){let i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],s=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,s,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new r(e.radius,e.detail)}},sa=class r extends it{constructor(e=1,t=.4,i=12,s=48,n=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:n},i=Math.floor(i),s=Math.floor(s);let a=[],o=[],l=[],c=[],h=new A,d=new A,m=new A;for(let u=0;u<=i;u++)for(let g=0;g<=s;g++){let _=g/s*n,f=u/i*Math.PI*2;d.x=(e+t*Math.cos(f))*Math.cos(_),d.y=(e+t*Math.cos(f))*Math.sin(_),d.z=t*Math.sin(f),o.push(d.x,d.y,d.z),h.x=e*Math.cos(_),h.y=e*Math.sin(_),m.subVectors(d,h).normalize(),l.push(m.x,m.y,m.z),c.push(g/s),c.push(u/i)}for(let u=1;u<=i;u++)for(let g=1;g<=s;g++){let _=(s+1)*u+g-1,f=(s+1)*(u-1)+g-1,p=(s+1)*(u-1)+g,b=(s+1)*u+g;a.push(_,f,b),a.push(f,p,b)}this.setIndex(a),this.setAttribute("position",new Ue(o,3)),this.setAttribute("normal",new Ue(l,3)),this.setAttribute("uv",new Ue(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}},na=class r extends it{constructor(e=1,t=.4,i=64,s=8,n=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:s,p:n,q:a},i=Math.floor(i),s=Math.floor(s);let o=[],l=[],c=[],h=[],d=new A,m=new A,u=new A,g=new A,_=new A,f=new A,p=new A;for(let y=0;y<=i;++y){let v=y/i*n*Math.PI*2;b(v,n,a,e,u),b(v+.01,n,a,e,g),f.subVectors(g,u),p.addVectors(g,u),_.crossVectors(f,p),p.crossVectors(_,f),_.normalize(),p.normalize();for(let R=0;R<=s;++R){let E=R/s*Math.PI*2,P=-t*Math.cos(E),C=t*Math.sin(E);d.x=u.x+(P*p.x+C*_.x),d.y=u.y+(P*p.y+C*_.y),d.z=u.z+(P*p.z+C*_.z),l.push(d.x,d.y,d.z),m.subVectors(d,u).normalize(),c.push(m.x,m.y,m.z),h.push(y/i),h.push(R/s)}}for(let y=1;y<=i;y++)for(let v=1;v<=s;v++){let R=(s+1)*(y-1)+(v-1),E=(s+1)*y+(v-1),P=(s+1)*y+v,C=(s+1)*(y-1)+v;o.push(R,E,C),o.push(E,P,C)}this.setIndex(o),this.setAttribute("position",new Ue(l,3)),this.setAttribute("normal",new Ue(c,3)),this.setAttribute("uv",new Ue(h,2));function b(y,v,R,E,P){let C=Math.cos(y),S=Math.sin(y),M=R/v*y,L=Math.cos(M);P.x=E*(2+L)*.5*C,P.y=E*(2+L)*S*.5,P.z=E*Math.sin(M)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new r(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}},aa=class r extends it{constructor(e=new As(new A(-1,-1,0),new A(-1,1,0),new A(1,1,0)),t=64,i=1,s=8,n=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:s,closed:n};let a=e.computeFrenetFrames(t,n);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new A,l=new A,c=new K,h=new A,d=[],m=[],u=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new Ue(d,3)),this.setAttribute("normal",new Ue(m,3)),this.setAttribute("uv",new Ue(u,2));function _(){for(let y=0;y<t;y++)f(y);f(n===!1?t:0),b(),p()}function f(y){h=e.getPointAt(y/t,h);let v=a.normals[y],R=a.binormals[y];for(let E=0;E<=s;E++){let P=E/s*Math.PI*2,C=Math.sin(P),S=-Math.cos(P);l.x=S*v.x+C*R.x,l.y=S*v.y+C*R.y,l.z=S*v.z+C*R.z,l.normalize(),m.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,d.push(o.x,o.y,o.z)}}function p(){for(let y=1;y<=t;y++)for(let v=1;v<=s;v++){let R=(s+1)*(y-1)+(v-1),E=(s+1)*y+(v-1),P=(s+1)*y+v,C=(s+1)*(y-1)+v;g.push(R,E,C),g.push(E,P,C)}}function b(){for(let y=0;y<=t;y++)for(let v=0;v<=s;v++)c.x=y/t,c.y=v/s,u.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new r(new Zn[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}},Hr=class extends it{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){let t=[],i=new Set,s=new A,n=new A;if(e.index!==null){let a=e.attributes.position,o=e.index,l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let d=l[c],m=d.start,u=d.count;for(let g=m,_=m+u;g<_;g+=3)for(let f=0;f<3;f++){let p=o.getX(g+f),b=o.getX(g+(f+1)%3);s.fromBufferAttribute(a,p),n.fromBufferAttribute(a,b),Dc(s,n,i)===!0&&(t.push(s.x,s.y,s.z),t.push(n.x,n.y,n.z))}}}else{let a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,d=3*o+(c+1)%3;s.fromBufferAttribute(a,h),n.fromBufferAttribute(a,d),Dc(s,n,i)===!0&&(t.push(s.x,s.y,s.z),t.push(n.x,n.y,n.z))}}this.setAttribute("position",new Ue(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}};function Dc(r,e,t){let i=`${r.x},${r.y},${r.z}-${e.x},${e.y},${e.z}`,s=`${e.x},${e.y},${e.z}-${r.x},${r.y},${r.z}`;return t.has(i)===!0||t.has(s)===!0?!1:(t.add(i),t.add(s),!0)}var T0=Object.freeze({__proto__:null,BoxGeometry:Ti,CapsuleGeometry:Gn,CircleGeometry:kn,ConeGeometry:Hn,CylinderGeometry:zi,DodecahedronGeometry:Vn,EdgesGeometry:Wn,ExtrudeGeometry:Kn,IcosahedronGeometry:$n,LatheGeometry:Qn,OctahedronGeometry:ea,PlaneGeometry:Gr,PolyhedronGeometry:Gi,RingGeometry:ta,ShapeGeometry:ia,SphereGeometry:kr,TetrahedronGeometry:ra,TorusGeometry:sa,TorusKnotGeometry:na,TubeGeometry:aa,WireframeGeometry:Hr});var Us=class extends hi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=El,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ei,this.combine=wa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},oa=class extends hi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},la=class extends hi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Tn(r,e){return!r||r.constructor===e?r:typeof e.BYTES_PER_ELEMENT=="number"?new e(r):Array.prototype.slice.call(r)}function Id(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}var rr=class{constructor(e,t,i,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,s=t[i],n=t[i-1];i:{e:{let a;t:{r:if(!(e<s)){for(let o=i+2;;){if(s===void 0){if(e<n)break r;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(n=s,s=t[++i],e<s)break e}a=t.length;break t}if(!(e>=n)){let o=t[1];e<o&&(i=2,n=o);for(let l=i-2;;){if(n===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=n,n=t[--i-1],e>=n)break e}a=i,i=0;break t}break i}for(;i<a;){let o=i+a>>>1;e<t[o]?a=o:i=o+1}if(s=t[i],n=t[i-1],n===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,n,s)}return this.interpolate_(i,n,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,s=this.valueSize,n=e*s;for(let a=0;a!==s;++a)t[a]=i[n+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ca=class extends rr{constructor(e,t,i,s){super(e,t,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ko,endingEnd:Ko}}intervalChanged_(e,t,i){let s=this.parameterPositions,n=e-2,a=e+1,o=s[n],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case $o:n=e,o=2*t-i;break;case Qo:n=s.length-2,o=t+s[n]-s[n+1];break;default:n=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case $o:a=e,l=2*i-t;break;case Qo:a=1,l=i+s[1]-s[0];break;default:a=e-1,l=t}let c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=n*h,this._offsetNext=a*h}interpolate_(e,t,i,s){let n=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,m=this._weightPrev,u=this._weightNext,g=(i-t)/(s-t),_=g*g,f=_*g,p=-m*f+2*m*_-m*g,b=(1+m)*f+(-1.5-2*m)*_+(-.5+m)*g+1,y=(-1-u)*f+(1.5+u)*_+.5*g,v=u*f-u*_;for(let R=0;R!==o;++R)n[R]=p*a[h+R]+b*a[c+R]+y*a[l+R]+v*a[d+R];return n}},ha=class extends rr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let n=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(s-t),d=1-h;for(let m=0;m!==o;++m)n[m]=a[c+m]*d+a[l+m]*h;return n}},ua=class extends rr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e){return this.copySampleValue_(e-1)}},Nt=class{constructor(e,t,i,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Tn(t,this.TimeBufferType),this.values=Tn(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:Tn(e.times,Array),values:Tn(e.values,Array)};let s=e.getInterpolation();s!==e.DefaultInterpolation&&(i.interpolation=s)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new ua(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ha(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new ca(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case hs:t=this.InterpolantFactoryMethodDiscrete;break;case In:t=this.InterpolantFactoryMethodLinear;break;case En:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return hs;case this.InterpolantFactoryMethodLinear:return In;case this.InterpolantFactoryMethodSmooth:return En}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,s=t.length;i!==s;++i)t[i]*=e}return this}trim(e,t){let i=this.times,s=i.length,n=0,a=s-1;for(;n!==s&&i[n]<e;)++n;for(;a!==-1&&i[a]>t;)--a;if(++a,n!==0||a!==s){n>=a&&(a=Math.max(a,1),n=a-1);let o=this.getValueSize();this.times=i.slice(n,a),this.values=this.values.slice(n*o,a*o)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,s=this.values,n=i.length;n===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==n;o++){let l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(s!==void 0&&Id(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===En,n=e.length-1,a=1;for(let o=1;o<n;++o){let l=!1,c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(s)l=!0;else{let d=o*i,m=d-i,u=d+i;for(let g=0;g!==i;++g){let _=t[d+g];if(_!==t[m+g]||_!==t[u+g]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];let d=o*i,m=a*i;for(let u=0;u!==i;++u)t[m+u]=t[d+u]}++a}}if(n>0){e[a]=e[n];for(let o=n*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,s=new i(this.name,e,t);return s.createInterpolant=this.createInterpolant,s}};Nt.prototype.ValueTypeName="",Nt.prototype.TimeBufferType=Float32Array,Nt.prototype.ValueBufferType=Float32Array,Nt.prototype.DefaultInterpolation=In;var Ui=class extends Nt{constructor(e,t,i){super(e,t,i)}};Ui.prototype.ValueTypeName="bool",Ui.prototype.ValueBufferType=Array,Ui.prototype.DefaultInterpolation=hs,Ui.prototype.InterpolantFactoryMethodLinear=void 0,Ui.prototype.InterpolantFactoryMethodSmooth=void 0;var da=class extends Nt{constructor(e,t,i,s){super(e,t,i,s)}};da.prototype.ValueTypeName="color";var pa=class extends Nt{constructor(e,t,i,s){super(e,t,i,s)}};pa.prototype.ValueTypeName="number";var ma=class extends rr{constructor(e,t,i,s){super(e,t,i,s)}interpolate_(e,t,i,s){let n=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(s-t),c=e*o;for(let h=c+o;c!==h;c+=4)Ct.slerpFlat(n,0,a,c-o,a,c,l);return n}},Ns=class extends Nt{constructor(e,t,i,s){super(e,t,i,s)}InterpolantFactoryMethodLinear(e){return new ma(this.times,this.values,this.getValueSize(),e)}};Ns.prototype.ValueTypeName="quaternion",Ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Ni=class extends Nt{constructor(e,t,i){super(e,t,i)}};Ni.prototype.ValueTypeName="string",Ni.prototype.ValueBufferType=Array,Ni.prototype.DefaultInterpolation=hs,Ni.prototype.InterpolantFactoryMethodLinear=void 0,Ni.prototype.InterpolantFactoryMethodSmooth=void 0;var fa=class extends Nt{constructor(e,t,i,s){super(e,t,i,s)}};fa.prototype.ValueTypeName="vector";var ga=class{constructor(e,t,i){let s=this,n=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.abortController=new AbortController,this.itemStart=function(h){o++,n===!1&&s.onStart!==void 0&&s.onStart(h,a,o),n=!0},this.itemEnd=function(h){a++,s.onProgress!==void 0&&s.onProgress(h,a,o),a===o&&(n=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,m=c.length;d<m;d+=2){let u=c[d],g=c[d+1];if(u.global&&(u.lastIndex=0),u.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Dh=new ga,_a=class{constructor(e){this.manager=e!==void 0?e:Dh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){let i=this;return new Promise(function(s,n){i.load(e,s,t,n)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};_a.DEFAULT_MATERIAL_NAME="__DEFAULT";var Os=class extends yt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}};var Jo=new We,Uc=new A,Nc=new A,ol=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new K(512,512),this.mapType=ii,this.map=null,this.mapPass=null,this.matrix=new We,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bi,this._frameExtents=new K(1,1),this._viewportCount=1,this._viewports=[new ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,i=this.matrix;Uc.setFromMatrixPosition(e.matrixWorld),t.position.copy(Uc),Nc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nc),t.updateMatrixWorld(),Jo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jo,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Jo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}};var E0=new We,w0=new A,A0=new A;var Fs=class extends Ur{constructor(e=-1,t=1,i=1,s=-1,n=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=n,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,n,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=n,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,n=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=c*this.view.offsetX,a=n+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(n,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ll=class extends ol{constructor(){super(new Fs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Vr=class extends Os{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(yt.DEFAULT_UP),this.updateMatrix(),this.target=new yt,this.shadow=new ll}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Bs=class extends Os{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var R0=new We,C0=new We,I0=new We;var va=class extends bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var P0=new A,L0=new Ct,D0=new A,U0=new A,N0=new A;var O0=new A,F0=new Ct,B0=new A,z0=new A;var Dl="\\[\\]\\.:\\/",Pd=new RegExp("["+Dl+"]","g"),Ul="[^"+Dl+"]",Ld="[^"+Dl.replace("\\.","")+"]",Dd=/((?:WC+[\/:])*)/.source.replace("WC",Ul),Ud=/(WCOD+)?/.source.replace("WCOD",Ld),Nd=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ul),Od=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ul),Fd=new RegExp("^"+Dd+Ud+Nd+Od+"$"),Bd=["material","materials","bones","map"],cl=class{constructor(e,t,i){let s=i||at.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,n=i.length;s!==n;++s)i[s].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},at=class r{constructor(e,t,i){this.path=t,this.parsedPath=i||r.parseTrackName(t),this.node=r.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new r.Composite(e,t,i):new r(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Pd,"")}static parseTrackName(e){let t=Fd.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let n=i.nodeName.substring(s+1);Bd.indexOf(n)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=n)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(n){for(let a=0;a<n.length;a++){let o=n[a];if(o.name===t||o.uuid===t)return o;let l=i(o.children);if(l)return l}return null},s=i(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)e[t++]=i[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)i[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)i[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let s=0,n=i.length;s!==n;++s)i[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,s=t.propertyName,n=t.propertyIndex;if(e||(e=r.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let a=e[s];if(a===void 0){let c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(n!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[n]!==void 0&&(n=e.morphTargetDictionary[n])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=n}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};at.Composite=cl,at.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},at.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},at.prototype.GetterByBindingType=[at.prototype._getValue_direct,at.prototype._getValue_array,at.prototype._getValue_arrayElement,at.prototype._getValue_toArray],at.prototype.SetterByBindingTypeAndVersioning=[[at.prototype._setValue_direct,at.prototype._setValue_direct_setNeedsUpdate,at.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[at.prototype._setValue_array,at.prototype._setValue_array_setNeedsUpdate,at.prototype._setValue_array_setMatrixWorldNeedsUpdate],[at.prototype._setValue_arrayElement,at.prototype._setValue_arrayElement_setNeedsUpdate,at.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[at.prototype._setValue_fromArray,at.prototype._setValue_fromArray_setNeedsUpdate,at.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var G0=new Float32Array(1);var Oc=new We,zs=class{constructor(e,t,i=0,s=1/0){this.ray=new ci(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Dr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Oc.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Oc),this}intersectObject(e,t=!0,i=[]){return hl(e,this,i,t),i.sort(Fc),i}intersectObjects(e,t=!0,i=[]){for(let s=0,n=e.length;s<n;s++)hl(e[s],this,i,t);return i.sort(Fc),i}};function Fc(r,e){return r.distance-e.distance}function hl(r,e,t,i){let s=!0;if(r.layers.test(e.layers)&&r.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){let n=r.children;for(let a=0,o=n.length;a<o;a++)hl(n[a],e,t,!0)}}var Wr=class{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ve(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Ve(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var k0=new K;var H0=new A,V0=new A,W0=new A,X0=new A,j0=new A,q0=new A,Y0=new A;var Z0=new A;var J0=new A,K0=new We,$0=new We;var Q0=new A,ev=new ke,tv=new ke;var iv=new A,rv=new A,sv=new A;var nv=new A,av=new Ur;var ov=new Ot;var lv=new A;var Gs=class extends oi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Nl(r,e,t,i){let s=zd(i);switch(t){case Ml:return r*e;case bl:return r*e/s.components*s.byteLength;case Da:return r*e/s.components*s.byteLength;case Tl:return r*e*2/s.components*s.byteLength;case Ua:return r*e*2/s.components*s.byteLength;case Sl:return r*e*3/s.components*s.byteLength;case Xt:return r*e*4/s.components*s.byteLength;case Na:return r*e*4/s.components*s.byteLength;case Vs:case Ws:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Xs:case js:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Fa:case za:return Math.max(r,16)*Math.max(e,8)/4;case Oa:case Ba:return Math.max(r,8)*Math.max(e,8)/2;case Ga:case ka:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Ha:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Va:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case ja:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case qa:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Ya:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Za:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Ja:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Ka:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case $a:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case eo:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case to:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case io:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case ro:case so:case no:return Math.ceil(r/4)*Math.ceil(e/4)*16;case ao:case oo:return Math.ceil(r/4)*Math.ceil(e/4)*8;case lo:case co:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function zd(r){switch(r){case ii:case _l:return{byteLength:1,components:1};case Xr:case vl:case jr:return{byteLength:2,components:1};case Pa:case La:return{byteLength:2,components:4};case Wi:case Ia:case di:return{byteLength:4,components:1};case yl:case xl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}})),typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function ru(){let r=null,e=!1,t=null,i=null;function s(n,a){t(n,a),i=r.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=r.requestAnimationFrame(s),e=!0)},stop:function(){r.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(n){t=n},setContext:function(n){r=n}}}function kd(r){let e=new WeakMap;function t(o,l){let c=o.array,h=o.usage,d=c.byteLength,m=r.createBuffer();r.bindBuffer(l,m),r.bufferData(l,c,h),o.onUploadCallback();let u;if(c instanceof Float32Array)u=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)u=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?u=r.HALF_FLOAT:u=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)u=r.SHORT;else if(c instanceof Uint32Array)u=r.UNSIGNED_INT;else if(c instanceof Int32Array)u=r.INT;else if(c instanceof Int8Array)u=r.BYTE;else if(c instanceof Uint8Array)u=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)u=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:m,type:u,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){let h=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,h);else{d.sort((u,g)=>u.start-g.start);let m=0;for(let u=1;u<d.length;u++){let g=d[m],_=d[u];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++m,d[m]=_)}d.length=m+1;for(let u=0,g=d.length;u<g;u++){let _=d[u];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function n(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=e.get(o);l&&(r.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:n,update:a}}var Hd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Vd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Wd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Xd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Zd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Jd=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Kd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$d=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ep=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,tp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ip=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ap=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,op=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,cp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,hp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,up=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,dp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,pp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,mp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,_p=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,vp="gl_FragColor = linearToOutputTexel( gl_FragColor );",yp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Sp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Ep=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ap=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Rp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Cp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ip=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Dp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Up=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Np=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Op=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Bp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,zp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Gp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,kp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Hp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Vp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Wp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Zp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Jp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Kp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$p=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,em=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,im=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,sm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,am=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,om=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,hm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,um=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,pm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,mm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,_m=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,vm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ym=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Tm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Em=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,wm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Am=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Cm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Im=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Pm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Um=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Om=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,zm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Gm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,km=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Hm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ym=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Zm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Jm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,$m=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ef=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,rf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,af=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,of=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,cf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,hf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,uf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,df=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,pf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mf=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ff=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gf=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,_f=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,vf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,yf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,xf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:Hd,alphahash_pars_fragment:Vd,alphamap_fragment:Wd,alphamap_pars_fragment:Xd,alphatest_fragment:jd,alphatest_pars_fragment:qd,aomap_fragment:Yd,aomap_pars_fragment:Zd,batching_pars_vertex:Jd,batching_vertex:Kd,begin_vertex:$d,beginnormal_vertex:Qd,bsdfs:ep,iridescence_fragment:tp,bumpmap_pars_fragment:ip,clipping_planes_fragment:rp,clipping_planes_pars_fragment:sp,clipping_planes_pars_vertex:np,clipping_planes_vertex:ap,color_fragment:op,color_pars_fragment:lp,color_pars_vertex:cp,color_vertex:hp,common:up,cube_uv_reflection_fragment:dp,defaultnormal_vertex:pp,displacementmap_pars_vertex:mp,displacementmap_vertex:fp,emissivemap_fragment:gp,emissivemap_pars_fragment:_p,colorspace_fragment:vp,colorspace_pars_fragment:yp,envmap_fragment:xp,envmap_common_pars_fragment:Mp,envmap_pars_fragment:Sp,envmap_pars_vertex:bp,envmap_physical_pars_fragment:Up,envmap_vertex:Tp,fog_vertex:Ep,fog_pars_vertex:wp,fog_fragment:Ap,fog_pars_fragment:Rp,gradientmap_pars_fragment:Cp,lightmap_pars_fragment:Ip,lights_lambert_fragment:Pp,lights_lambert_pars_fragment:Lp,lights_pars_begin:Dp,lights_toon_fragment:Np,lights_toon_pars_fragment:Op,lights_phong_fragment:Fp,lights_phong_pars_fragment:Bp,lights_physical_fragment:zp,lights_physical_pars_fragment:Gp,lights_fragment_begin:kp,lights_fragment_maps:Hp,lights_fragment_end:Vp,logdepthbuf_fragment:Wp,logdepthbuf_pars_fragment:Xp,logdepthbuf_pars_vertex:jp,logdepthbuf_vertex:qp,map_fragment:Yp,map_pars_fragment:Zp,map_particle_fragment:Jp,map_particle_pars_fragment:Kp,metalnessmap_fragment:$p,metalnessmap_pars_fragment:Qp,morphinstance_vertex:em,morphcolor_vertex:tm,morphnormal_vertex:im,morphtarget_pars_vertex:rm,morphtarget_vertex:sm,normal_fragment_begin:nm,normal_fragment_maps:am,normal_pars_fragment:om,normal_pars_vertex:lm,normal_vertex:cm,normalmap_pars_fragment:hm,clearcoat_normal_fragment_begin:um,clearcoat_normal_fragment_maps:dm,clearcoat_pars_fragment:pm,iridescence_pars_fragment:mm,opaque_fragment:fm,packing:gm,premultiplied_alpha_fragment:_m,project_vertex:vm,dithering_fragment:ym,dithering_pars_fragment:xm,roughnessmap_fragment:Mm,roughnessmap_pars_fragment:Sm,shadowmap_pars_fragment:bm,shadowmap_pars_vertex:Tm,shadowmap_vertex:Em,shadowmask_pars_fragment:wm,skinbase_vertex:Am,skinning_pars_vertex:Rm,skinning_vertex:Cm,skinnormal_vertex:Im,specularmap_fragment:Pm,specularmap_pars_fragment:Lm,tonemapping_fragment:Dm,tonemapping_pars_fragment:Um,transmission_fragment:Nm,transmission_pars_fragment:Om,uv_pars_fragment:Fm,uv_pars_vertex:Bm,uv_vertex:zm,worldpos_vertex:Gm,background_vert:km,background_frag:Hm,backgroundCube_vert:Vm,backgroundCube_frag:Wm,cube_vert:Xm,cube_frag:jm,depth_vert:qm,depth_frag:Ym,distanceRGBA_vert:Zm,distanceRGBA_frag:Jm,equirect_vert:Km,equirect_frag:$m,linedashed_vert:Qm,linedashed_frag:ef,meshbasic_vert:tf,meshbasic_frag:rf,meshlambert_vert:sf,meshlambert_frag:nf,meshmatcap_vert:af,meshmatcap_frag:of,meshnormal_vert:lf,meshnormal_frag:cf,meshphong_vert:hf,meshphong_frag:uf,meshphysical_vert:df,meshphysical_frag:pf,meshtoon_vert:mf,meshtoon_frag:ff,points_vert:gf,points_frag:_f,shadow_vert:vf,shadow_frag:yf,sprite_vert:xf,sprite_frag:Mf},ue={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new K(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new K(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},pi={basic:{uniforms:Et([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Et([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new ke(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Et([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Et([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Et([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new ke(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Et([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Et([ue.points,ue.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Et([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Et([ue.common,ue.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Et([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Et([ue.sprite,ue.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Et([ue.common,ue.displacementmap,{referencePosition:{value:new A},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Et([ue.lights,ue.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};pi.physical={uniforms:Et([pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new K(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new K},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new K},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var ho={r:0,b:0,g:0},lr=new ei,Sf=new We;function bf(r,e,t,i,s,n,a){let o=new ke(0),l=n===!0?0:1,c,h,d=null,m=0,u=null;function g(y){let v=y.isScene===!0?y.background:null;return v&&v.isTexture&&(v=(y.backgroundBlurriness>0?t:e).get(v)),v}function _(y){let v=!1,R=g(y);R===null?p(o,l):R&&R.isColor&&(p(R,1),v=!0);let E=r.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(r.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function f(y,v){let R=g(v);R&&(R.isCubeTexture||R.mapping===ks)?(h===void 0&&(h=new xt(new Ti(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:or(pi.backgroundCube.uniforms),vertexShader:pi.backgroundCube.vertexShader,fragmentShader:pi.backgroundCube.fragmentShader,side:At,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,P,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),lr.copy(v.backgroundRotation),lr.x*=-1,lr.y*=-1,lr.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(lr.y*=-1,lr.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Sf.makeRotationFromEuler(lr)),h.material.toneMapped=Je.getTransfer(R.colorSpace)!==et,(d!==R||m!==R.version||u!==r.toneMapping)&&(h.material.needsUpdate=!0,d=R,m=R.version,u=r.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(c===void 0&&(c=new xt(new Gr(2,2),new ti({name:"BackgroundMaterial",uniforms:or(pi.background.uniforms),vertexShader:pi.background.vertexShader,fragmentShader:pi.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=R,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=Je.getTransfer(R.colorSpace)!==et,R.matrixAutoUpdate===!0&&R.updateMatrix(),c.material.uniforms.uvTransform.value.copy(R.matrix),(d!==R||m!==R.version||u!==r.toneMapping)&&(c.material.needsUpdate=!0,d=R,m=R.version,u=r.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,v){y.getRGB(ho,Pl(r)),i.buffers.color.setClear(ho.r,ho.g,ho.b,v,a)}function b(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,v=1){o.set(y),l=v,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(o,l)},render:_,addToRenderList:f,dispose:b}}function Tf(r,e){let t=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},s=m(null),n=s,a=!1;function o(M,L,U,B,H){let W=!1,V=d(B,U,L);n!==V&&(n=V,c(n.object)),W=u(M,B,U,H),W&&g(M,B,U,H),H!==null&&e.update(H,r.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,v(M,L,U,B),H!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return r.createVertexArray()}function c(M){return r.bindVertexArray(M)}function h(M){return r.deleteVertexArray(M)}function d(M,L,U){let B=U.wireframe===!0,H=i[M.id];H===void 0&&(H={},i[M.id]=H);let W=H[L.id];W===void 0&&(W={},H[L.id]=W);let V=W[B];return V===void 0&&(V=m(l()),W[B]=V),V}function m(M){let L=[],U=[],B=[];for(let H=0;H<t;H++)L[H]=0,U[H]=0,B[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:U,attributeDivisors:B,object:M,attributes:{},index:null}}function u(M,L,U,B){let H=n.attributes,W=L.attributes,V=0,$=U.getAttributes();for(let k in $)if($[k].location>=0){let se=H[k],pe=W[k];if(pe===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&(pe=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&(pe=M.instanceColor)),se===void 0||se.attribute!==pe||pe&&se.data!==pe.data)return!0;V++}return n.attributesNum!==V||n.index!==B}function g(M,L,U,B){let H={},W=L.attributes,V=0,$=U.getAttributes();for(let k in $)if($[k].location>=0){let se=W[k];se===void 0&&(k==="instanceMatrix"&&M.instanceMatrix&&(se=M.instanceMatrix),k==="instanceColor"&&M.instanceColor&&(se=M.instanceColor));let pe={};pe.attribute=se,se&&se.data&&(pe.data=se.data),H[k]=pe,V++}n.attributes=H,n.attributesNum=V,n.index=B}function _(){let M=n.newAttributes;for(let L=0,U=M.length;L<U;L++)M[L]=0}function f(M){p(M,0)}function p(M,L){let U=n.newAttributes,B=n.enabledAttributes,H=n.attributeDivisors;U[M]=1,B[M]===0&&(r.enableVertexAttribArray(M),B[M]=1),H[M]!==L&&(r.vertexAttribDivisor(M,L),H[M]=L)}function b(){let M=n.newAttributes,L=n.enabledAttributes;for(let U=0,B=L.length;U<B;U++)L[U]!==M[U]&&(r.disableVertexAttribArray(U),L[U]=0)}function y(M,L,U,B,H,W,V){V===!0?r.vertexAttribIPointer(M,L,U,H,W):r.vertexAttribPointer(M,L,U,B,H,W)}function v(M,L,U,B){_();let H=B.attributes,W=U.getAttributes(),V=L.defaultAttributeValues;for(let $ in W){let k=W[$];if(k.location>=0){let se=H[$];if(se===void 0&&($==="instanceMatrix"&&M.instanceMatrix&&(se=M.instanceMatrix),$==="instanceColor"&&M.instanceColor&&(se=M.instanceColor)),se!==void 0){let pe=se.normalized,Ie=se.itemSize,Le=e.get(se);if(Le===void 0)continue;let Ye=Le.buffer,$e=Le.type,Ke=Le.bytesPerElement,q=$e===r.INT||$e===r.UNSIGNED_INT||se.gpuType===Ia;if(se.isInterleavedBufferAttribute){let Q=se.data,fe=Q.stride,Pe=se.offset;if(Q.isInstancedInterleavedBuffer){for(let Re=0;Re<k.locationSize;Re++)p(k.location+Re,Q.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Re=0;Re<k.locationSize;Re++)f(k.location+Re);r.bindBuffer(r.ARRAY_BUFFER,Ye);for(let Re=0;Re<k.locationSize;Re++)y(k.location+Re,Ie/k.locationSize,$e,pe,fe*Ke,(Pe+Ie/k.locationSize*Re)*Ke,q)}else{if(se.isInstancedBufferAttribute){for(let Q=0;Q<k.locationSize;Q++)p(k.location+Q,se.meshPerAttribute);M.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Q=0;Q<k.locationSize;Q++)f(k.location+Q);r.bindBuffer(r.ARRAY_BUFFER,Ye);for(let Q=0;Q<k.locationSize;Q++)y(k.location+Q,Ie/k.locationSize,$e,pe,Ie*Ke,Ie/k.locationSize*Q*Ke,q)}}else if(V!==void 0){let pe=V[$];if(pe!==void 0)switch(pe.length){case 2:r.vertexAttrib2fv(k.location,pe);break;case 3:r.vertexAttrib3fv(k.location,pe);break;case 4:r.vertexAttrib4fv(k.location,pe);break;default:r.vertexAttrib1fv(k.location,pe)}}}}b()}function R(){C();for(let M in i){let L=i[M];for(let U in L){let B=L[U];for(let H in B)h(B[H].object),delete B[H];delete L[U]}delete i[M]}}function E(M){if(i[M.id]===void 0)return;let L=i[M.id];for(let U in L){let B=L[U];for(let H in B)h(B[H].object),delete B[H];delete L[U]}delete i[M.id]}function P(M){for(let L in i){let U=i[L];if(U[M.id]===void 0)continue;let B=U[M.id];for(let H in B)h(B[H].object),delete B[H];delete U[M.id]}}function C(){S(),a=!0,n!==s&&(n=s,c(n.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:C,resetDefaultState:S,dispose:R,releaseStatesOfGeometry:E,releaseStatesOfProgram:P,initAttributes:_,enableAttribute:f,disableUnusedAttributes:b}}function Ef(r,e,t){let i;function s(c){i=c}function n(c,h){r.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,d){d!==0&&(r.drawArraysInstanced(i,c,h,d),t.update(h,i,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,d);let m=0;for(let u=0;u<d;u++)m+=h[u];t.update(m,i,1)}function l(c,h,d,m){if(d===0)return;let u=e.get("WEBGL_multi_draw");if(u===null)for(let g=0;g<c.length;g++)a(c[g],h[g],m[g]);else{u.multiDrawArraysInstancedWEBGL(i,c,0,h,0,m,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_]*m[_];t.update(g,i,1)}}this.setMode=s,this.render=n,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function wf(r,e,t,i){let s;function n(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){let P=e.get("EXT_texture_filter_anisotropic");s=r.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(P){return!(P!==Xt&&i.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(P){let C=P===jr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(P!==ii&&i.convert(P)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==di&&!C)}function l(P){if(P==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=t.logarithmicDepthBuffer===!0,m=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),u=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),f=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),b=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),y=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,E=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:m,maxTextures:u,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:b,maxVaryings:y,maxFragmentUniforms:v,vertexTextures:R,maxSamples:E}}function Af(r){let e=this,t=null,i=0,s=!1,n=!1,a=new Ht,o=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,m){let u=d.length!==0||m||i!==0||s;return s=m,i=d.length,u},this.beginShadows=function(){n=!0,h(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(d,m){t=h(d,m,0)},this.setState=function(d,m,u){let g=d.clippingPlanes,_=d.clipIntersection,f=d.clipShadows,p=r.get(d);if(!s||g===null||g.length===0||n&&!f)n?h(null):c();else{let b=n?0:i,y=b*4,v=p.clippingState||null;l.value=v,v=h(g,m,y,u);for(let R=0;R!==y;++R)v[R]=t[R];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,m,u,g){let _=d!==null?d.length:0,f=null;if(_!==0){if(f=l.value,g!==!0||f===null){let p=u+_*4,b=m.matrixWorldInverse;o.getNormalMatrix(b),(f===null||f.length<p)&&(f=new Float32Array(p));for(let y=0,v=u;y!==_;++y,v+=4)a.copy(d[y]).applyMatrix4(b,o),a.normal.toArray(f,v),f[v+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,f}}function Rf(r){let e=new WeakMap;function t(a,o){return o===Aa?a.mapping=sr:o===Ra&&(a.mapping=nr),a}function i(a){if(a&&a.isTexture){let o=a.mapping;if(o===Aa||o===Ra)if(e.has(a)){let l=e.get(a).texture;return t(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let c=new Nn(l.height);return c.fromEquirectangularTexture(r,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function n(){e=new WeakMap}return{get:i,dispose:n}}var Jr=4,Uh=[.125,.215,.35,.446,.526,.582],ur=20,Ol=new Fs,Nh=new ke,Fl=null,Bl=0,zl=0,Gl=!1,hr=(1+Math.sqrt(5))/2,Zr=1/hr,Oh=[new A(-hr,Zr,0),new A(hr,Zr,0),new A(-Zr,0,hr),new A(Zr,0,hr),new A(0,hr,-Zr),new A(0,hr,Zr),new A(-1,1,-1),new A(1,1,-1),new A(-1,1,1),new A(1,1,1)],Cf=new A,mo=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,n={}){let{size:a=256,position:o=Cf}=n;Fl=this._renderer.getRenderTarget(),Bl=this._renderer.getActiveCubeFace(),zl=this._renderer.getActiveMipmapLevel(),Gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Fl,Bl,zl),this._renderer.xr.enabled=Gl,e.scissorTest=!1,uo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===sr||e.mapping===nr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Fl=this._renderer.getRenderTarget(),Bl=this._renderer.getActiveCubeFace(),zl=this._renderer.getActiveMipmapLevel(),Gl=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:$t,minFilter:$t,generateMipmaps:!1,type:jr,format:Xt,colorSpace:er,depthBuffer:!1},s=Fh(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fh(e,t,i);let{_lodMax:n}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=If(n)),this._blurMaterial=Pf(n,e,t)}return s}_compileMaterial(e){let t=new xt(this._lodPlanes[0],e);this._renderer.compile(t,Ol)}_sceneToCubeUV(e,t,i,s,n){let a=new bt(90,1,t,i),o=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],c=this._renderer,h=c.autoClear,d=c.toneMapping;c.getClearColor(Nh),c.toneMapping=wi,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(s),c.clearDepth(),c.setRenderTarget(null));let m=new tr({name:"PMREM.Background",side:At,depthWrite:!1,depthTest:!1}),u=new xt(new Ti,m),g=!1,_=e.background;_?_.isColor&&(m.color.copy(_),e.background=null,g=!0):(m.color.copy(Nh),g=!0);for(let f=0;f<6;f++){let p=f%3;p===0?(a.up.set(0,o[f],0),a.position.set(n.x,n.y,n.z),a.lookAt(n.x+l[f],n.y,n.z)):p===1?(a.up.set(0,0,o[f]),a.position.set(n.x,n.y,n.z),a.lookAt(n.x,n.y+l[f],n.z)):(a.up.set(0,o[f],0),a.position.set(n.x,n.y,n.z),a.lookAt(n.x,n.y,n.z+l[f]));let b=this._cubeSize;uo(s,p*b,f>2?b:0,b,b),c.setRenderTarget(s),g&&c.render(u,a),c.render(e,a)}u.geometry.dispose(),u.material.dispose(),c.toneMapping=d,c.autoClear=h,e.background=_}_textureToCubeUV(e,t){let i=this._renderer,s=e.mapping===sr||e.mapping===nr;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=zh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bh());let n=s?this._cubemapMaterial:this._equirectMaterial,a=new xt(this._lodPlanes[0],n),o=n.uniforms;o.envMap.value=e;let l=this._cubeSize;uo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Ol)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let s=this._lodPlanes.length;for(let n=1;n<s;n++){let a=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),o=Oh[(s-n-1)%Oh.length];this._blur(e,n-1,n,a,o)}t.autoClear=i}_blur(e,t,i,s,n){let a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",n),this._halfBlur(a,e,i,i,s,"longitudinal",n)}_halfBlur(e,t,i,s,n,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,d=new xt(this._lodPlanes[s],c),m=c.uniforms,u=this._sizeLods[i]-1,g=isFinite(n)?Math.PI/(2*u):2*Math.PI/(2*ur-1),_=n/g,f=isFinite(n)?1+Math.floor(h*_):ur;f>ur&&console.warn(`sigmaRadians, ${n}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ur}`);let p=[],b=0;for(let P=0;P<ur;++P){let C=P/_,S=Math.exp(-C*C/2);p.push(S),P===0?b+=S:P<f&&(b+=2*S)}for(let P=0;P<p.length;P++)p[P]=p[P]/b;m.envMap.value=e.texture,m.samples.value=f,m.weights.value=p,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);let{_lodMax:y}=this;m.dTheta.value=g,m.mipInt.value=y-i;let v=this._sizeLods[s],R=3*v*(s>y-Jr?s-y+Jr:0),E=4*(this._cubeSize-v);uo(t,R,E,3*v,2*v),l.setRenderTarget(t),l.render(d,Ol)}};function If(r){let e=[],t=[],i=[],s=r,n=r-Jr+1+Uh.length;for(let a=0;a<n;a++){let o=Math.pow(2,s);t.push(o);let l=1/o;a>r-Jr?l=Uh[a-r+Jr-1]:a===0&&(l=0),i.push(l);let c=1/(o-2),h=-c,d=1+c,m=[h,h,d,h,d,d,h,h,d,d,h,d],u=6,g=6,_=3,f=2,p=1,b=new Float32Array(_*g*u),y=new Float32Array(f*g*u),v=new Float32Array(p*g*u);for(let E=0;E<u;E++){let P=E%3*2/3-1,C=E>2?0:-1,S=[P,C,0,P+2/3,C,0,P+2/3,C+1,0,P,C,0,P+2/3,C+1,0,P,C+1,0];b.set(S,_*g*E),y.set(m,f*g*E);let M=[E,E,E,E,E,E];v.set(M,p*g*E)}let R=new it;R.setAttribute("position",new Tt(b,_)),R.setAttribute("uv",new Tt(y,f)),R.setAttribute("faceIndex",new Tt(v,p)),e.push(R),s>Jr&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Fh(r,e,t){let i=new li(r,e,t);return i.texture.mapping=ks,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function uo(r,e,t,i,s){r.viewport.set(e,t,i,s),r.scissor.set(e,t,i,s)}function Pf(r,e,t){let i=new Float32Array(ur),s=new A(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:ur,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function Bh(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function zh(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ei,depthTest:!1,depthWrite:!1})}function Jl(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Lf(r){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){let l=o.mapping,c=l===Aa||l===Ra,h=l===sr||l===nr;if(c||h){let d=e.get(o),m=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==m)return t===null&&(t=new mo(r)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{let u=o.image;return c&&u&&u.height>0||h&&u&&s(u)?(t===null&&(t=new mo(r)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",n),d.texture):null}}}return o}function s(o){let l=0,c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function n(o){let l=o.target;l.removeEventListener("dispose",n);let c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function Df(r){let e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=r.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let s=t(i);return s===null&&Pr("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Uf(r,e,t,i){let s={},n=new WeakMap;function a(d){let m=d.target;m.index!==null&&e.remove(m.index);for(let g in m.attributes)e.remove(m.attributes[g]);m.removeEventListener("dispose",a),delete s[m.id];let u=n.get(m);u&&(e.remove(u),n.delete(m)),i.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,t.memory.geometries--}function o(d,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,t.memory.geometries++),m}function l(d){let m=d.attributes;for(let u in m)e.update(m[u],r.ARRAY_BUFFER)}function c(d){let m=[],u=d.index,g=d.attributes.position,_=0;if(u!==null){let b=u.array;_=u.version;for(let y=0,v=b.length;y<v;y+=3){let R=b[y+0],E=b[y+1],P=b[y+2];m.push(R,E,E,P,P,R)}}else if(g!==void 0){let b=g.array;_=g.version;for(let y=0,v=b.length/3-1;y<v;y+=3){let R=y+0,E=y+1,P=y+2;m.push(R,E,E,P,P,R)}}else return;let f=new(Il(m)?gs:fs)(m,1);f.version=_;let p=n.get(d);p&&e.remove(p),n.set(d,f)}function h(d){let m=n.get(d);if(m){let u=d.index;u!==null&&m.version<u.version&&c(d)}else c(d);return n.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Nf(r,e,t){let i;function s(m){i=m}let n,a;function o(m){n=m.type,a=m.bytesPerElement}function l(m,u){r.drawElements(i,u,n,m*a),t.update(u,i,1)}function c(m,u,g){g!==0&&(r.drawElementsInstanced(i,u,n,m*a,g),t.update(u,i,g))}function h(m,u,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,n,m,0,g);let _=0;for(let f=0;f<g;f++)_+=u[f];t.update(_,i,1)}function d(m,u,g,_){if(g===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<m.length;p++)c(m[p]/a,u[p],_[p]);else{f.multiDrawElementsInstancedWEBGL(i,u,0,n,m,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=u[b]*_[b];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Of(r){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(n,a,o){switch(t.calls++,a){case r.TRIANGLES:t.triangles+=o*(n/3);break;case r.LINES:t.lines+=o*(n/2);break;case r.LINE_STRIP:t.lines+=o*(n-1);break;case r.LINE_LOOP:t.lines+=o*n;break;case r.POINTS:t.points+=o*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function Ff(r,e,t){let i=new WeakMap,s=new ot;function n(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0,m=i.get(o);if(m===void 0||m.count!==d){let g=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",g)};var u=g;m!==void 0&&m.texture.dispose();let _=o.morphAttributes.position!==void 0,f=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,b=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],R=0;_===!0&&(R=1),f===!0&&(R=2),p===!0&&(R=3);let E=o.attributes.position.count*R,P=1;E>e.maxTextureSize&&(P=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);let C=new Float32Array(E*P*4*d),S=new ms(C,E,P,d);S.type=di,S.needsUpdate=!0;let M=R*4;for(let L=0;L<d;L++){let U=b[L],B=y[L],H=v[L],W=E*P*4*L;for(let V=0;V<U.count;V++){let $=V*M;_===!0&&(s.fromBufferAttribute(U,V),C[W+$+0]=s.x,C[W+$+1]=s.y,C[W+$+2]=s.z,C[W+$+3]=0),f===!0&&(s.fromBufferAttribute(B,V),C[W+$+4]=s.x,C[W+$+5]=s.y,C[W+$+6]=s.z,C[W+$+7]=0),p===!0&&(s.fromBufferAttribute(H,V),C[W+$+8]=s.x,C[W+$+9]=s.y,C[W+$+10]=s.z,C[W+$+11]=H.itemSize===4?s.w:1)}}m={count:d,texture:S,size:new K(E,P)},i.set(o,m),o.addEventListener("dispose",g)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,t);else{let g=0;for(let f=0;f<c.length;f++)g+=c[f];let _=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",_),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",m.texture,t),l.getUniforms().setValue(r,"morphTargetsTextureSize",m.size)}return{update:n}}function Bf(r,e,t,i){let s=new WeakMap;function n(l){let c=i.render.frame,h=l.geometry,d=e.get(l,h);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,r.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,r.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){let m=l.skeleton;s.get(m)!==c&&(m.update(),s.set(m,c))}return d}function a(){s=new WeakMap}function o(l){let c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:n,dispose:a}}var su=new Rt,Gh=new Ss(1,1),nu=new ms,au=new Dn,ou=new _s,kh=[],Hh=[],Vh=new Float32Array(16),Wh=new Float32Array(9),Xh=new Float32Array(4);function $r(r,e,t){let i=r[0];if(i<=0||i>0)return r;let s=e*t,n=kh[s];if(n===void 0&&(n=new Float32Array(s),kh[s]=n),e!==0){i.toArray(n,0);for(let a=1,o=0;a!==e;++a)o+=t,r[a].toArray(n,o)}return n}function pt(r,e){if(r.length!==e.length)return!1;for(let t=0,i=r.length;t<i;t++)if(r[t]!==e[t])return!1;return!0}function mt(r,e){for(let t=0,i=e.length;t<i;t++)r[t]=e[t]}function go(r,e){let t=Hh[e];t===void 0&&(t=new Int32Array(e),Hh[e]=t);for(let i=0;i!==e;++i)t[i]=r.allocateTextureUnit();return t}function zf(r,e){let t=this.cache;t[0]!==e&&(r.uniform1f(this.addr,e),t[0]=e)}function Gf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;r.uniform2fv(this.addr,e),mt(t,e)}}function kf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(pt(t,e))return;r.uniform3fv(this.addr,e),mt(t,e)}}function Hf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;r.uniform4fv(this.addr,e),mt(t,e)}}function Vf(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(pt(t,e))return;r.uniformMatrix2fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,i))return;Xh.set(i),r.uniformMatrix2fv(this.addr,!1,Xh),mt(t,i)}}function Wf(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(pt(t,e))return;r.uniformMatrix3fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,i))return;Wh.set(i),r.uniformMatrix3fv(this.addr,!1,Wh),mt(t,i)}}function Xf(r,e){let t=this.cache,i=e.elements;if(i===void 0){if(pt(t,e))return;r.uniformMatrix4fv(this.addr,!1,e),mt(t,e)}else{if(pt(t,i))return;Vh.set(i),r.uniformMatrix4fv(this.addr,!1,Vh),mt(t,i)}}function jf(r,e){let t=this.cache;t[0]!==e&&(r.uniform1i(this.addr,e),t[0]=e)}function qf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;r.uniform2iv(this.addr,e),mt(t,e)}}function Yf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;r.uniform3iv(this.addr,e),mt(t,e)}}function Zf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;r.uniform4iv(this.addr,e),mt(t,e)}}function Jf(r,e){let t=this.cache;t[0]!==e&&(r.uniform1ui(this.addr,e),t[0]=e)}function Kf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(pt(t,e))return;r.uniform2uiv(this.addr,e),mt(t,e)}}function $f(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(pt(t,e))return;r.uniform3uiv(this.addr,e),mt(t,e)}}function Qf(r,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(pt(t,e))return;r.uniform4uiv(this.addr,e),mt(t,e)}}function eg(r,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s);let n;this.type===r.SAMPLER_2D_SHADOW?(Gh.compareFunction=wl,n=Gh):n=su,t.setTexture2D(e||n,s)}function tg(r,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||au,s)}function ig(r,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||ou,s)}function rg(r,e,t){let i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(r.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||nu,s)}function sg(r){switch(r){case 5126:return zf;case 35664:return Gf;case 35665:return kf;case 35666:return Hf;case 35674:return Vf;case 35675:return Wf;case 35676:return Xf;case 5124:case 35670:return jf;case 35667:case 35671:return qf;case 35668:case 35672:return Yf;case 35669:case 35673:return Zf;case 5125:return Jf;case 36294:return Kf;case 36295:return $f;case 36296:return Qf;case 35678:case 36198:case 36298:case 36306:case 35682:return eg;case 35679:case 36299:case 36307:return tg;case 35680:case 36300:case 36308:case 36293:return ig;case 36289:case 36303:case 36311:case 36292:return rg}}function ng(r,e){r.uniform1fv(this.addr,e)}function ag(r,e){let t=$r(e,this.size,2);r.uniform2fv(this.addr,t)}function og(r,e){let t=$r(e,this.size,3);r.uniform3fv(this.addr,t)}function lg(r,e){let t=$r(e,this.size,4);r.uniform4fv(this.addr,t)}function cg(r,e){let t=$r(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,t)}function hg(r,e){let t=$r(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,t)}function ug(r,e){let t=$r(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,t)}function dg(r,e){r.uniform1iv(this.addr,e)}function pg(r,e){r.uniform2iv(this.addr,e)}function mg(r,e){r.uniform3iv(this.addr,e)}function fg(r,e){r.uniform4iv(this.addr,e)}function gg(r,e){r.uniform1uiv(this.addr,e)}function _g(r,e){r.uniform2uiv(this.addr,e)}function vg(r,e){r.uniform3uiv(this.addr,e)}function yg(r,e){r.uniform4uiv(this.addr,e)}function xg(r,e,t){let i=this.cache,s=e.length,n=go(t,s);pt(i,n)||(r.uniform1iv(this.addr,n),mt(i,n));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||su,n[a])}function Mg(r,e,t){let i=this.cache,s=e.length,n=go(t,s);pt(i,n)||(r.uniform1iv(this.addr,n),mt(i,n));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||au,n[a])}function Sg(r,e,t){let i=this.cache,s=e.length,n=go(t,s);pt(i,n)||(r.uniform1iv(this.addr,n),mt(i,n));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||ou,n[a])}function bg(r,e,t){let i=this.cache,s=e.length,n=go(t,s);pt(i,n)||(r.uniform1iv(this.addr,n),mt(i,n));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||nu,n[a])}function Tg(r){switch(r){case 5126:return ng;case 35664:return ag;case 35665:return og;case 35666:return lg;case 35674:return cg;case 35675:return hg;case 35676:return ug;case 5124:case 35670:return dg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return fg;case 5125:return gg;case 36294:return _g;case 36295:return vg;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return xg;case 35679:case 36299:case 36307:return Mg;case 35680:case 36300:case 36308:case 36293:return Sg;case 36289:case 36303:case 36311:case 36292:return bg}}var Hl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=sg(t.type)}},Vl=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Tg(t.type)}},Wl=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let s=this.seq;for(let n=0,a=s.length;n!==a;++n){let o=s[n];o.setValue(e,t[o.id],i)}}},kl=/(\w+)(\])?(\[|\.)?/g;function jh(r,e){r.seq.push(e),r.map[e.id]=e}function Eg(r,e,t){let i=r.name,s=i.length;for(kl.lastIndex=0;;){let n=kl.exec(i),a=kl.lastIndex,o=n[1],l=n[2]==="]",c=n[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){jh(t,c===void 0?new Hl(o,r,e):new Vl(o,r,e));break}else{let h=t.map[o];h===void 0&&(h=new Wl(o),jh(t,h)),t=h}}}var Kr=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){let n=e.getActiveUniform(t,s),a=e.getUniformLocation(t,n.name);Eg(n,a,this)}}setValue(e,t,i,s){let n=this.map[t];n!==void 0&&n.setValue(e,i,s)}setOptional(e,t,i){let s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let n=0,a=t.length;n!==a;++n){let o=t[n],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){let i=[];for(let s=0,n=e.length;s!==n;++s){let a=e[s];a.id in t&&i.push(a)}return i}};function qh(r,e,t){let i=r.createShader(e);return r.shaderSource(i,t),r.compileShader(i),i}var wg=37297,Ag=0;function Rg(r,e){let t=r.split(`
`),i=[],s=Math.max(e-6,0),n=Math.min(e+6,t.length);for(let a=s;a<n;a++){let o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}var Yh=new Ge;function Cg(r){Je._getMatrix(Yh,Je.workingColorSpace,r);let e=`mat3( ${Yh.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(r)){case us:return[e,"LinearTransferOETF"];case et:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Zh(r,e,t){let i=r.getShaderParameter(e,r.COMPILE_STATUS),s=(r.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let n=/ERROR: 0:(\d+)/.exec(s);if(n){let a=parseInt(n[1]);return t.toUpperCase()+`

`+s+`

`+Rg(r.getShaderSource(e),a)}else return s}function Ig(r,e){let t=Cg(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Pg(r,e){let t;switch(e){case oh:t="Linear";break;case lh:t="Reinhard";break;case ch:t="Cineon";break;case hh:t="ACESFilmic";break;case dh:t="AgX";break;case ph:t="Neutral";break;case uh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+r+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var po=new A;function Lg(){Je.getLuminanceCoefficients(po);let r=po.x.toFixed(4),e=po.y.toFixed(4),t=po.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Dg(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qs).join(`
`)}function Ug(r){let e=[];for(let t in r){let i=r[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Ng(r,e){let t={},i=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let n=r.getActiveAttrib(e,s),a=n.name,o=1;n.type===r.FLOAT_MAT2&&(o=2),n.type===r.FLOAT_MAT3&&(o=3),n.type===r.FLOAT_MAT4&&(o=4),t[a]={type:n.type,location:r.getAttribLocation(e,a),locationSize:o}}return t}function qs(r){return r!==""}function Jh(r,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Kh(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Og=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xl(r){return r.replace(Og,Bg)}var Fg=new Map;function Bg(r,e){let t=Xe[e];if(t===void 0){let i=Fg.get(e);if(i!==void 0)t=Xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Xl(t)}var zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function $h(r){return r.replace(zg,Gg)}function Gg(r,e,t,i){let s="";for(let n=parseInt(e);n<parseInt(t);n++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return s}function Qh(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function kg(r){let e="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===dl?e="SHADOWMAP_TYPE_PCF":r.shadowMapType===Gc?e="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===ui&&(e="SHADOWMAP_TYPE_VSM"),e}function Hg(r){let e="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case sr:case nr:e="ENVMAP_TYPE_CUBE";break;case ks:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Vg(r){let e="ENVMAP_MODE_REFLECTION";return r.envMap&&r.envMapMode===nr&&(e="ENVMAP_MODE_REFRACTION"),e}function Wg(r){let e="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case wa:e="ENVMAP_BLENDING_MULTIPLY";break;case nh:e="ENVMAP_BLENDING_MIX";break;case ah:e="ENVMAP_BLENDING_ADD";break}return e}function Xg(r){let e=r.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function jg(r,e,t,i){let s=r.getContext(),n=t.defines,a=t.vertexShader,o=t.fragmentShader,l=kg(t),c=Hg(t),h=Vg(t),d=Wg(t),m=Xg(t),u=Dg(t),g=Ug(n),_=s.createProgram(),f,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(qs).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(qs).join(`
`),p.length>0&&(p+=`
`)):(f=[Qh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qs).join(`
`),p=[Qh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==wi?"#define TONE_MAPPING":"",t.toneMapping!==wi?Xe.tonemapping_pars_fragment:"",t.toneMapping!==wi?Pg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Ig("linearToOutputTexel",t.outputColorSpace),Lg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(qs).join(`
`)),a=Xl(a),a=Jh(a,t),a=Kh(a,t),o=Xl(o),o=Jh(o,t),o=Kh(o,t),a=$h(a),o=$h(o),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,f=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",t.glslVersion===Al?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Al?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let y=b+f+a,v=b+p+o,R=qh(s,s.VERTEX_SHADER,y),E=qh(s,s.FRAGMENT_SHADER,v);s.attachShader(_,R),s.attachShader(_,E),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function P(L){if(r.debug.checkShaderErrors){let U=s.getProgramInfoLog(_)||"",B=s.getShaderInfoLog(R)||"",H=s.getShaderInfoLog(E)||"",W=U.trim(),V=B.trim(),$=H.trim(),k=!0,se=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(k=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(s,_,R,E);else{let pe=Zh(s,R,"vertex"),Ie=Zh(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+W+`
`+pe+`
`+Ie)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(V===""||$==="")&&(se=!1);se&&(L.diagnostics={runnable:k,programLog:W,vertexShader:{log:V,prefix:f},fragmentShader:{log:$,prefix:p}})}s.deleteShader(R),s.deleteShader(E),C=new Kr(s,_),S=Ng(s,_)}let C;this.getUniforms=function(){return C===void 0&&P(this),C};let S;this.getAttributes=function(){return S===void 0&&P(this),S};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=s.getProgramParameter(_,wg)),M},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ag++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=E,this}var qg=0,jl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),n=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(n)===!1&&(a.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new ql(e),t.set(e,i)),i}},ql=class{constructor(e){this.id=qg++,this.code=e,this.usedTimes=0}};function Yg(r,e,t,i,s,n,a){let o=new Dr,l=new jl,c=new Set,h=[],d=s.logarithmicDepthBuffer,m=s.vertexTextures,u=s.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function f(S,M,L,U,B){let H=U.fog,W=B.geometry,V=S.isMeshStandardMaterial?U.environment:null,$=(S.isMeshStandardMaterial?t:e).get(S.envMap||V),k=$&&$.mapping===ks?$.image.height:null,se=g[S.type];S.precision!==null&&(u=s.getMaxPrecision(S.precision),u!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",u,"instead."));let pe=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ie=pe!==void 0?pe.length:0,Le=0;W.morphAttributes.position!==void 0&&(Le=1),W.morphAttributes.normal!==void 0&&(Le=2),W.morphAttributes.color!==void 0&&(Le=3);let Ye,$e,Ke,q;if(se){let Qe=pi[se];Ye=Qe.vertexShader,$e=Qe.fragmentShader}else Ye=S.vertexShader,$e=S.fragmentShader,l.update(S),Ke=l.getVertexShaderID(S),q=l.getFragmentShaderID(S);let Q=r.getRenderTarget(),fe=r.state.buffers.depth.getReversed(),Pe=B.isInstancedMesh===!0,Re=B.isBatchedMesh===!0,be=!!S.map,qe=!!S.matcap,w=!!$,te=!!S.aoMap,ee=!!S.lightMap,ce=!!S.bumpMap,Y=!!S.normalMap,Me=!!S.displacementMap,ie=!!S.emissiveMap,ve=!!S.metalnessMap,He=!!S.roughnessMap,Be=S.anisotropy>0,I=S.clearcoat>0,x=S.dispersion>0,F=S.iridescence>0,X=S.sheen>0,Z=S.transmission>0,j=Be&&!!S.anisotropyMap,Ce=I&&!!S.clearcoatMap,le=I&&!!S.clearcoatNormalMap,Te=I&&!!S.clearcoatRoughnessMap,ge=F&&!!S.iridescenceMap,ae=F&&!!S.iridescenceThicknessMap,me=X&&!!S.sheenColorMap,ze=X&&!!S.sheenRoughnessMap,we=!!S.specularMap,de=!!S.specularColorMap,je=!!S.specularIntensityMap,D=Z&&!!S.transmissionMap,oe=Z&&!!S.thicknessMap,he=!!S.gradientMap,Ee=!!S.alphaMap,ne=S.alphaTest>0,J=!!S.alphaHash,Se=!!S.extensions,De=wi;S.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(De=r.toneMapping);let dt={shaderID:se,shaderType:S.type,shaderName:S.name,vertexShader:Ye,fragmentShader:$e,defines:S.defines,customVertexShaderID:Ke,customFragmentShaderID:q,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:u,batching:Re,batchingColor:Re&&B._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&B.instanceColor!==null,instancingMorph:Pe&&B.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:Q===null?r.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:er,alphaToCoverage:!!S.alphaToCoverage,map:be,matcap:qe,envMap:w,envMapMode:w&&$.mapping,envMapCubeUVHeight:k,aoMap:te,lightMap:ee,bumpMap:ce,normalMap:Y,displacementMap:m&&Me,emissiveMap:ie,normalMapObjectSpace:Y&&S.normalMapType===_h,normalMapTangentSpace:Y&&S.normalMapType===El,metalnessMap:ve,roughnessMap:He,anisotropy:Be,anisotropyMap:j,clearcoat:I,clearcoatMap:Ce,clearcoatNormalMap:le,clearcoatRoughnessMap:Te,dispersion:x,iridescence:F,iridescenceMap:ge,iridescenceThicknessMap:ae,sheen:X,sheenColorMap:me,sheenRoughnessMap:ze,specularMap:we,specularColorMap:de,specularIntensityMap:je,transmission:Z,transmissionMap:D,thicknessMap:oe,gradientMap:he,opaque:S.transparent===!1&&S.blending===$i&&S.alphaToCoverage===!1,alphaMap:Ee,alphaTest:ne,alphaHash:J,combine:S.combine,mapUv:be&&_(S.map.channel),aoMapUv:te&&_(S.aoMap.channel),lightMapUv:ee&&_(S.lightMap.channel),bumpMapUv:ce&&_(S.bumpMap.channel),normalMapUv:Y&&_(S.normalMap.channel),displacementMapUv:Me&&_(S.displacementMap.channel),emissiveMapUv:ie&&_(S.emissiveMap.channel),metalnessMapUv:ve&&_(S.metalnessMap.channel),roughnessMapUv:He&&_(S.roughnessMap.channel),anisotropyMapUv:j&&_(S.anisotropyMap.channel),clearcoatMapUv:Ce&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:le&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Te&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:me&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:ze&&_(S.sheenRoughnessMap.channel),specularMapUv:we&&_(S.specularMap.channel),specularColorMapUv:de&&_(S.specularColorMap.channel),specularIntensityMapUv:je&&_(S.specularIntensityMap.channel),transmissionMapUv:D&&_(S.transmissionMap.channel),thicknessMapUv:oe&&_(S.thicknessMap.channel),alphaMapUv:Ee&&_(S.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Y||Be),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!W.attributes.uv&&(be||Ee),fog:!!H,useFog:S.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:fe,skinning:B.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Ie,morphTextureStride:Le,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:r.shadowMap.enabled&&L.length>0,shadowMapType:r.shadowMap.type,toneMapping:De,decodeVideoTexture:be&&S.map.isVideoTexture===!0&&Je.getTransfer(S.map.colorSpace)===et,decodeVideoTextureEmissive:ie&&S.emissiveMap.isVideoTexture===!0&&Je.getTransfer(S.emissiveMap.colorSpace)===et,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Bt,flipSided:S.side===At,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Se&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Se&&S.extensions.multiDraw===!0||Re)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return dt.vertexUv1s=c.has(1),dt.vertexUv2s=c.has(2),dt.vertexUv3s=c.has(3),c.clear(),dt}function p(S){let M=[];if(S.shaderID?M.push(S.shaderID):(M.push(S.customVertexShaderID),M.push(S.customFragmentShaderID)),S.defines!==void 0)for(let L in S.defines)M.push(L),M.push(S.defines[L]);return S.isRawShaderMaterial===!1&&(b(M,S),y(M,S),M.push(r.outputColorSpace)),M.push(S.customProgramCacheKey),M.join()}function b(S,M){S.push(M.precision),S.push(M.outputColorSpace),S.push(M.envMapMode),S.push(M.envMapCubeUVHeight),S.push(M.mapUv),S.push(M.alphaMapUv),S.push(M.lightMapUv),S.push(M.aoMapUv),S.push(M.bumpMapUv),S.push(M.normalMapUv),S.push(M.displacementMapUv),S.push(M.emissiveMapUv),S.push(M.metalnessMapUv),S.push(M.roughnessMapUv),S.push(M.anisotropyMapUv),S.push(M.clearcoatMapUv),S.push(M.clearcoatNormalMapUv),S.push(M.clearcoatRoughnessMapUv),S.push(M.iridescenceMapUv),S.push(M.iridescenceThicknessMapUv),S.push(M.sheenColorMapUv),S.push(M.sheenRoughnessMapUv),S.push(M.specularMapUv),S.push(M.specularColorMapUv),S.push(M.specularIntensityMapUv),S.push(M.transmissionMapUv),S.push(M.thicknessMapUv),S.push(M.combine),S.push(M.fogExp2),S.push(M.sizeAttenuation),S.push(M.morphTargetsCount),S.push(M.morphAttributeCount),S.push(M.numDirLights),S.push(M.numPointLights),S.push(M.numSpotLights),S.push(M.numSpotLightMaps),S.push(M.numHemiLights),S.push(M.numRectAreaLights),S.push(M.numDirLightShadows),S.push(M.numPointLightShadows),S.push(M.numSpotLightShadows),S.push(M.numSpotLightShadowsWithMaps),S.push(M.numLightProbes),S.push(M.shadowMapType),S.push(M.toneMapping),S.push(M.numClippingPlanes),S.push(M.numClipIntersection),S.push(M.depthPacking)}function y(S,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),M.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),S.push(o.mask)}function v(S){let M=g[S.type],L;if(M){let U=pi[M];L=Rh.clone(U.uniforms)}else L=S.uniforms;return L}function R(S,M){let L;for(let U=0,B=h.length;U<B;U++){let H=h[U];if(H.cacheKey===M){L=H,++L.usedTimes;break}}return L===void 0&&(L=new jg(r,M,S,n),h.push(L)),L}function E(S){if(--S.usedTimes===0){let M=h.indexOf(S);h[M]=h[h.length-1],h.pop(),S.destroy()}}function P(S){l.remove(S)}function C(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:v,acquireProgram:R,releaseProgram:E,releaseShaderCache:P,programs:h,dispose:C}}function Zg(){let r=new WeakMap;function e(a){return r.has(a)}function t(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function i(a){r.delete(a)}function s(a,o,l){r.get(a)[o]=l}function n(){r=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:n}}function Jg(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.z!==e.z?r.z-e.z:r.id-e.id}function eu(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function tu(){let r=[],e=0,t=[],i=[],s=[];function n(){e=0,t.length=0,i.length=0,s.length=0}function a(d,m,u,g,_,f){let p=r[e];return p===void 0?(p={id:d.id,object:d,geometry:m,material:u,groupOrder:g,renderOrder:d.renderOrder,z:_,group:f},r[e]=p):(p.id=d.id,p.object=d,p.geometry=m,p.material=u,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=f),e++,p}function o(d,m,u,g,_,f){let p=a(d,m,u,g,_,f);u.transmission>0?i.push(p):u.transparent===!0?s.push(p):t.push(p)}function l(d,m,u,g,_,f){let p=a(d,m,u,g,_,f);u.transmission>0?i.unshift(p):u.transparent===!0?s.unshift(p):t.unshift(p)}function c(d,m){t.length>1&&t.sort(d||Jg),i.length>1&&i.sort(m||eu),s.length>1&&s.sort(m||eu)}function h(){for(let d=e,m=r.length;d<m;d++){let u=r[d];if(u.id===null)break;u.id=null,u.object=null,u.geometry=null,u.material=null,u.group=null}}return{opaque:t,transmissive:i,transparent:s,init:n,push:o,unshift:l,finish:h,sort:c}}function Kg(){let r=new WeakMap;function e(i,s){let n=r.get(i),a;return n===void 0?(a=new tu,r.set(i,[a])):s>=n.length?(a=new tu,n.push(a)):a=n[s],a}function t(){r=new WeakMap}return{get:e,dispose:t}}function $g(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new A,color:new ke};break;case"SpotLight":t={position:new A,direction:new A,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new A,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new A,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new A,halfWidth:new A,halfHeight:new A};break}return r[e.id]=t,t}}}function Qg(){let r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=t,t}}}var e_=0;function t_(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function i_(r){let e=new $g,t=Qg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new A);let s=new A,n=new We,a=new We;function o(c){let h=0,d=0,m=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let u=0,g=0,_=0,f=0,p=0,b=0,y=0,v=0,R=0,E=0,P=0;c.sort(t_);for(let S=0,M=c.length;S<M;S++){let L=c[S],U=L.color,B=L.intensity,H=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=U.r*B,d+=U.g*B,m+=U.b*B;else if(L.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(L.sh.coefficients[V],B);P++}else if(L.isDirectionalLight){let V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,k=t.get(L);k.shadowIntensity=$.intensity,k.shadowBias=$.bias,k.shadowNormalBias=$.normalBias,k.shadowRadius=$.radius,k.shadowMapSize=$.mapSize,i.directionalShadow[u]=k,i.directionalShadowMap[u]=W,i.directionalShadowMatrix[u]=L.shadow.matrix,b++}i.directional[u]=V,u++}else if(L.isSpotLight){let V=e.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(U).multiplyScalar(B),V.distance=H,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,i.spot[_]=V;let $=L.shadow;if(L.map&&(i.spotLightMap[R]=L.map,R++,$.updateMatrices(L),L.castShadow&&E++),i.spotLightMatrix[_]=$.matrix,L.castShadow){let k=t.get(L);k.shadowIntensity=$.intensity,k.shadowBias=$.bias,k.shadowNormalBias=$.normalBias,k.shadowRadius=$.radius,k.shadowMapSize=$.mapSize,i.spotShadow[_]=k,i.spotShadowMap[_]=W,v++}_++}else if(L.isRectAreaLight){let V=e.get(L);V.color.copy(U).multiplyScalar(B),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),i.rectArea[f]=V,f++}else if(L.isPointLight){let V=e.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){let $=L.shadow,k=t.get(L);k.shadowIntensity=$.intensity,k.shadowBias=$.bias,k.shadowNormalBias=$.normalBias,k.shadowRadius=$.radius,k.shadowMapSize=$.mapSize,k.shadowCameraNear=$.camera.near,k.shadowCameraFar=$.camera.far,i.pointShadow[g]=k,i.pointShadowMap[g]=W,i.pointShadowMatrix[g]=L.shadow.matrix,y++}i.point[g]=V,g++}else if(L.isHemisphereLight){let V=e.get(L);V.skyColor.copy(L.color).multiplyScalar(B),V.groundColor.copy(L.groundColor).multiplyScalar(B),i.hemi[p]=V,p++}}f>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=m;let C=i.hash;(C.directionalLength!==u||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==f||C.hemiLength!==p||C.numDirectionalShadows!==b||C.numPointShadows!==y||C.numSpotShadows!==v||C.numSpotMaps!==R||C.numLightProbes!==P)&&(i.directional.length=u,i.spot.length=_,i.rectArea.length=f,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=v+R-E,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,C.directionalLength=u,C.pointLength=g,C.spotLength=_,C.rectAreaLength=f,C.hemiLength=p,C.numDirectionalShadows=b,C.numPointShadows=y,C.numSpotShadows=v,C.numSpotMaps=R,C.numLightProbes=P,i.version=e_++)}function l(c,h){let d=0,m=0,u=0,g=0,_=0,f=h.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){let y=c[p];if(y.isDirectionalLight){let v=i.directional[d];v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(f),d++}else if(y.isSpotLight){let v=i.spot[u];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(f),v.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(f),u++}else if(y.isRectAreaLight){let v=i.rectArea[g];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(f),a.identity(),n.copy(y.matrixWorld),n.premultiply(f),a.extractRotation(n),v.halfWidth.set(y.width*.5,0,0),v.halfHeight.set(0,y.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){let v=i.point[m];v.position.setFromMatrixPosition(y.matrixWorld),v.position.applyMatrix4(f),m++}else if(y.isHemisphereLight){let v=i.hemi[_];v.direction.setFromMatrixPosition(y.matrixWorld),v.direction.transformDirection(f),_++}}}return{setup:o,setupView:l,state:i}}function iu(r){let e=new i_(r),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function n(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}let c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:n,pushShadow:a}}function r_(r){let e=new WeakMap;function t(s,n=0){let a=e.get(s),o;return a===void 0?(o=new iu(r),e.set(s,[o])):n>=a.length?(o=new iu(r),a.push(o)):o=a[n],o}function i(){e=new WeakMap}return{get:t,dispose:i}}var s_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,n_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function a_(r,e,t){let i=new Bi,s=new K,n=new K,a=new ot,o=new oa({depthPacking:gh}),l=new la,c={},h=t.maxTextureSize,d={[bi]:At,[At]:bi,[Bt]:Bt},m=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new K},radius:{value:4}},vertexShader:s_,fragmentShader:n_}),u=m.clone();u.defines.HORIZONTAL_PASS=1;let g=new it;g.setAttribute("position",new Tt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new xt(g,m),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=dl;let p=this.type;this.render=function(E,P,C){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||E.length===0)return;let S=r.getRenderTarget(),M=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),U=r.state;U.setBlending(Ei),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let B=p!==ui&&this.type===ui,H=p===ui&&this.type!==ui;for(let W=0,V=E.length;W<V;W++){let $=E[W],k=$.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let se=k.getFrameExtents();if(s.multiply(se),n.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(n.x=Math.floor(h/se.x),s.x=n.x*se.x,k.mapSize.x=n.x),s.y>h&&(n.y=Math.floor(h/se.y),s.y=n.y*se.y,k.mapSize.y=n.y)),k.map===null||B===!0||H===!0){let Ie=this.type!==ui?{minFilter:Wt,magFilter:Wt}:{};k.map!==null&&k.map.dispose(),k.map=new li(s.x,s.y,Ie),k.map.texture.name=$.name+".shadowMap",k.camera.updateProjectionMatrix()}r.setRenderTarget(k.map),r.clear();let pe=k.getViewportCount();for(let Ie=0;Ie<pe;Ie++){let Le=k.getViewport(Ie);a.set(n.x*Le.x,n.y*Le.y,n.x*Le.z,n.y*Le.w),U.viewport(a),k.updateMatrices($,Ie),i=k.getFrustum(),v(P,C,k.camera,$,this.type)}k.isPointLightShadow!==!0&&this.type===ui&&b(k,C),k.needsUpdate=!1}p=this.type,f.needsUpdate=!1,r.setRenderTarget(S,M,L)};function b(E,P){let C=e.update(_);m.defines.VSM_SAMPLES!==E.blurSamples&&(m.defines.VSM_SAMPLES=E.blurSamples,u.defines.VSM_SAMPLES=E.blurSamples,m.needsUpdate=!0,u.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new li(s.x,s.y)),m.uniforms.shadow_pass.value=E.map.texture,m.uniforms.resolution.value=E.mapSize,m.uniforms.radius.value=E.radius,r.setRenderTarget(E.mapPass),r.clear(),r.renderBufferDirect(P,null,C,m,_,null),u.uniforms.shadow_pass.value=E.mapPass.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,r.setRenderTarget(E.map),r.clear(),r.renderBufferDirect(P,null,C,u,_,null)}function y(E,P,C,S){let M=null,L=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)M=L;else if(M=C.isPointLight===!0?l:o,r.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){let U=M.uuid,B=P.uuid,H=c[U];H===void 0&&(H={},c[U]=H);let W=H[B];W===void 0&&(W=M.clone(),H[B]=W,P.addEventListener("dispose",R)),M=W}if(M.visible=P.visible,M.wireframe=P.wireframe,S===ui?M.side=P.shadowSide!==null?P.shadowSide:P.side:M.side=P.shadowSide!==null?P.shadowSide:d[P.side],M.alphaMap=P.alphaMap,M.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,M.map=P.map,M.clipShadows=P.clipShadows,M.clippingPlanes=P.clippingPlanes,M.clipIntersection=P.clipIntersection,M.displacementMap=P.displacementMap,M.displacementScale=P.displacementScale,M.displacementBias=P.displacementBias,M.wireframeLinewidth=P.wireframeLinewidth,M.linewidth=P.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){let U=r.properties.get(M);U.light=C}return M}function v(E,P,C,S,M){if(E.visible===!1)return;if(E.layers.test(P.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===ui)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);let U=e.update(E),B=E.material;if(Array.isArray(B)){let H=U.groups;for(let W=0,V=H.length;W<V;W++){let $=H[W],k=B[$.materialIndex];if(k&&k.visible){let se=y(E,k,S,M);E.onBeforeShadow(r,E,P,C,U,se,$),r.renderBufferDirect(C,null,U,se,E,$),E.onAfterShadow(r,E,P,C,U,se,$)}}}else if(B.visible){let H=y(E,B,S,M);E.onBeforeShadow(r,E,P,C,U,H,null),r.renderBufferDirect(C,null,U,H,E,null),E.onAfterShadow(r,E,P,C,U,H,null)}}let L=E.children;for(let U=0,B=L.length;U<B;U++)v(L[U],P,C,S,M)}function R(E){E.target.removeEventListener("dispose",R);for(let P in c){let C=c[P],S=E.target.uuid;S in C&&(C[S].dispose(),delete C[S])}}}var o_={[ya]:xa,[Ma]:Ta,[Sa]:Ea,[Qi]:ba,[xa]:ya,[Ta]:Ma,[Ea]:Sa,[ba]:Qi};function l_(r,e){function t(){let D=!1,oe=new ot,he=null,Ee=new ot(0,0,0,0);return{setMask:function(ne){he!==ne&&!D&&(r.colorMask(ne,ne,ne,ne),he=ne)},setLocked:function(ne){D=ne},setClear:function(ne,J,Se,De,dt){dt===!0&&(ne*=De,J*=De,Se*=De),oe.set(ne,J,Se,De),Ee.equals(oe)===!1&&(r.clearColor(ne,J,Se,De),Ee.copy(oe))},reset:function(){D=!1,he=null,Ee.set(-1,0,0,0)}}}function i(){let D=!1,oe=!1,he=null,Ee=null,ne=null;return{setReversed:function(J){if(oe!==J){let Se=e.get("EXT_clip_control");J?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),oe=J;let De=ne;ne=null,this.setClear(De)}},getReversed:function(){return oe},setTest:function(J){J?Q(r.DEPTH_TEST):fe(r.DEPTH_TEST)},setMask:function(J){he!==J&&!D&&(r.depthMask(J),he=J)},setFunc:function(J){if(oe&&(J=o_[J]),Ee!==J){switch(J){case ya:r.depthFunc(r.NEVER);break;case xa:r.depthFunc(r.ALWAYS);break;case Ma:r.depthFunc(r.LESS);break;case Qi:r.depthFunc(r.LEQUAL);break;case Sa:r.depthFunc(r.EQUAL);break;case ba:r.depthFunc(r.GEQUAL);break;case Ta:r.depthFunc(r.GREATER);break;case Ea:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Ee=J}},setLocked:function(J){D=J},setClear:function(J){ne!==J&&(oe&&(J=1-J),r.clearDepth(J),ne=J)},reset:function(){D=!1,he=null,Ee=null,ne=null,oe=!1}}}function s(){let D=!1,oe=null,he=null,Ee=null,ne=null,J=null,Se=null,De=null,dt=null;return{setTest:function(Qe){D||(Qe?Q(r.STENCIL_TEST):fe(r.STENCIL_TEST))},setMask:function(Qe){oe!==Qe&&!D&&(r.stencilMask(Qe),oe=Qe)},setFunc:function(Qe,mi,ri){(he!==Qe||Ee!==mi||ne!==ri)&&(r.stencilFunc(Qe,mi,ri),he=Qe,Ee=mi,ne=ri)},setOp:function(Qe,mi,ri){(J!==Qe||Se!==mi||De!==ri)&&(r.stencilOp(Qe,mi,ri),J=Qe,Se=mi,De=ri)},setLocked:function(Qe){D=Qe},setClear:function(Qe){dt!==Qe&&(r.clearStencil(Qe),dt=Qe)},reset:function(){D=!1,oe=null,he=null,Ee=null,ne=null,J=null,Se=null,De=null,dt=null}}}let n=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap,h={},d={},m=new WeakMap,u=[],g=null,_=!1,f=null,p=null,b=null,y=null,v=null,R=null,E=null,P=new ke(0,0,0),C=0,S=!1,M=null,L=null,U=null,B=null,H=null,W=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),V=!1,$=0,k=r.getParameter(r.VERSION);k.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(k)[1]),V=$>=1):k.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),V=$>=2);let se=null,pe={},Ie=r.getParameter(r.SCISSOR_BOX),Le=r.getParameter(r.VIEWPORT),Ye=new ot().fromArray(Ie),$e=new ot().fromArray(Le);function Ke(D,oe,he,Ee){let ne=new Uint8Array(4),J=r.createTexture();r.bindTexture(D,J),r.texParameteri(D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(D,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Se=0;Se<he;Se++)D===r.TEXTURE_3D||D===r.TEXTURE_2D_ARRAY?r.texImage3D(oe,0,r.RGBA,1,1,Ee,0,r.RGBA,r.UNSIGNED_BYTE,ne):r.texImage2D(oe+Se,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ne);return J}let q={};q[r.TEXTURE_2D]=Ke(r.TEXTURE_2D,r.TEXTURE_2D,1),q[r.TEXTURE_CUBE_MAP]=Ke(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[r.TEXTURE_2D_ARRAY]=Ke(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),q[r.TEXTURE_3D]=Ke(r.TEXTURE_3D,r.TEXTURE_3D,1,1),n.setClear(0,0,0,1),a.setClear(1),o.setClear(0),Q(r.DEPTH_TEST),a.setFunc(Qi),ce(!1),Y(ul),Q(r.CULL_FACE),te(Ei);function Q(D){h[D]!==!0&&(r.enable(D),h[D]=!0)}function fe(D){h[D]!==!1&&(r.disable(D),h[D]=!1)}function Pe(D,oe){return d[D]!==oe?(r.bindFramebuffer(D,oe),d[D]=oe,D===r.DRAW_FRAMEBUFFER&&(d[r.FRAMEBUFFER]=oe),D===r.FRAMEBUFFER&&(d[r.DRAW_FRAMEBUFFER]=oe),!0):!1}function Re(D,oe){let he=u,Ee=!1;if(D){he=m.get(oe),he===void 0&&(he=[],m.set(oe,he));let ne=D.textures;if(he.length!==ne.length||he[0]!==r.COLOR_ATTACHMENT0){for(let J=0,Se=ne.length;J<Se;J++)he[J]=r.COLOR_ATTACHMENT0+J;he.length=ne.length,Ee=!0}}else he[0]!==r.BACK&&(he[0]=r.BACK,Ee=!0);Ee&&r.drawBuffers(he)}function be(D){return g!==D?(r.useProgram(D),g=D,!0):!1}let qe={[Fi]:r.FUNC_ADD,[Hc]:r.FUNC_SUBTRACT,[Vc]:r.FUNC_REVERSE_SUBTRACT};qe[Wc]=r.MIN,qe[Xc]=r.MAX;let w={[jc]:r.ZERO,[qc]:r.ONE,[Yc]:r.SRC_COLOR,[wn]:r.SRC_ALPHA,[eh]:r.SRC_ALPHA_SATURATE,[$c]:r.DST_COLOR,[Jc]:r.DST_ALPHA,[Zc]:r.ONE_MINUS_SRC_COLOR,[An]:r.ONE_MINUS_SRC_ALPHA,[Qc]:r.ONE_MINUS_DST_COLOR,[Kc]:r.ONE_MINUS_DST_ALPHA,[th]:r.CONSTANT_COLOR,[ih]:r.ONE_MINUS_CONSTANT_COLOR,[rh]:r.CONSTANT_ALPHA,[sh]:r.ONE_MINUS_CONSTANT_ALPHA};function te(D,oe,he,Ee,ne,J,Se,De,dt,Qe){if(D===Ei){_===!0&&(fe(r.BLEND),_=!1);return}if(_===!1&&(Q(r.BLEND),_=!0),D!==kc){if(D!==f||Qe!==S){if((p!==Fi||v!==Fi)&&(r.blendEquation(r.FUNC_ADD),p=Fi,v=Fi),Qe)switch(D){case $i:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case pl:r.blendFunc(r.ONE,r.ONE);break;case ml:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case fl:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case $i:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case pl:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case ml:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case fl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}b=null,y=null,R=null,E=null,P.set(0,0,0),C=0,f=D,S=Qe}return}ne=ne||oe,J=J||he,Se=Se||Ee,(oe!==p||ne!==v)&&(r.blendEquationSeparate(qe[oe],qe[ne]),p=oe,v=ne),(he!==b||Ee!==y||J!==R||Se!==E)&&(r.blendFuncSeparate(w[he],w[Ee],w[J],w[Se]),b=he,y=Ee,R=J,E=Se),(De.equals(P)===!1||dt!==C)&&(r.blendColor(De.r,De.g,De.b,dt),P.copy(De),C=dt),f=D,S=!1}function ee(D,oe){D.side===Bt?fe(r.CULL_FACE):Q(r.CULL_FACE);let he=D.side===At;oe&&(he=!he),ce(he),D.blending===$i&&D.transparent===!1?te(Ei):te(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),a.setFunc(D.depthFunc),a.setTest(D.depthTest),a.setMask(D.depthWrite),n.setMask(D.colorWrite);let Ee=D.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(D.stencilWriteMask),o.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),o.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ie(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?Q(r.SAMPLE_ALPHA_TO_COVERAGE):fe(r.SAMPLE_ALPHA_TO_COVERAGE)}function ce(D){M!==D&&(D?r.frontFace(r.CW):r.frontFace(r.CCW),M=D)}function Y(D){D!==Bc?(Q(r.CULL_FACE),D!==L&&(D===ul?r.cullFace(r.BACK):D===zc?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):fe(r.CULL_FACE),L=D}function Me(D){D!==U&&(V&&r.lineWidth(D),U=D)}function ie(D,oe,he){D?(Q(r.POLYGON_OFFSET_FILL),(B!==oe||H!==he)&&(r.polygonOffset(oe,he),B=oe,H=he)):fe(r.POLYGON_OFFSET_FILL)}function ve(D){D?Q(r.SCISSOR_TEST):fe(r.SCISSOR_TEST)}function He(D){D===void 0&&(D=r.TEXTURE0+W-1),se!==D&&(r.activeTexture(D),se=D)}function Be(D,oe,he){he===void 0&&(se===null?he=r.TEXTURE0+W-1:he=se);let Ee=pe[he];Ee===void 0&&(Ee={type:void 0,texture:void 0},pe[he]=Ee),(Ee.type!==D||Ee.texture!==oe)&&(se!==he&&(r.activeTexture(he),se=he),r.bindTexture(D,oe||q[D]),Ee.type=D,Ee.texture=oe)}function I(){let D=pe[se];D!==void 0&&D.type!==void 0&&(r.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function x(){try{r.compressedTexImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function F(){try{r.compressedTexImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function X(){try{r.texSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{r.texSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function j(){try{r.compressedTexSubImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ce(){try{r.compressedTexSubImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function le(){try{r.texStorage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Te(){try{r.texStorage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ge(){try{r.texImage2D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ae(){try{r.texImage3D(...arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function me(D){Ye.equals(D)===!1&&(r.scissor(D.x,D.y,D.z,D.w),Ye.copy(D))}function ze(D){$e.equals(D)===!1&&(r.viewport(D.x,D.y,D.z,D.w),$e.copy(D))}function we(D,oe){let he=c.get(oe);he===void 0&&(he=new WeakMap,c.set(oe,he));let Ee=he.get(D);Ee===void 0&&(Ee=r.getUniformBlockIndex(oe,D.name),he.set(D,Ee))}function de(D,oe){let he=c.get(oe).get(D);l.get(oe)!==he&&(r.uniformBlockBinding(oe,he,D.__bindingPointIndex),l.set(oe,he))}function je(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),h={},se=null,pe={},d={},m=new WeakMap,u=[],g=null,_=!1,f=null,p=null,b=null,y=null,v=null,R=null,E=null,P=new ke(0,0,0),C=0,S=!1,M=null,L=null,U=null,B=null,H=null,Ye.set(0,0,r.canvas.width,r.canvas.height),$e.set(0,0,r.canvas.width,r.canvas.height),n.reset(),a.reset(),o.reset()}return{buffers:{color:n,depth:a,stencil:o},enable:Q,disable:fe,bindFramebuffer:Pe,drawBuffers:Re,useProgram:be,setBlending:te,setMaterial:ee,setFlipSided:ce,setCullFace:Y,setLineWidth:Me,setPolygonOffset:ie,setScissorTest:ve,activeTexture:He,bindTexture:Be,unbindTexture:I,compressedTexImage2D:x,compressedTexImage3D:F,texImage2D:ge,texImage3D:ae,updateUBOMapping:we,uniformBlockBinding:de,texStorage2D:le,texStorage3D:Te,texSubImage2D:X,texSubImage3D:Z,compressedTexSubImage2D:j,compressedTexSubImage3D:Ce,scissor:me,viewport:ze,reset:je}}function c_(r,e,t,i,s,n,a){let o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new K,h=new WeakMap,d,m=new WeakMap,u=!1;try{u=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,x){return u?new OffscreenCanvas(I,x):ps("canvas")}function _(I,x,F){let X=1,Z=Be(I);if((Z.width>F||Z.height>F)&&(X=F/Math.max(Z.width,Z.height)),X<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let j=Math.floor(X*Z.width),Ce=Math.floor(X*Z.height);d===void 0&&(d=g(j,Ce));let le=x?g(j,Ce):d;return le.width=j,le.height=Ce,le.getContext("2d").drawImage(I,0,0,j,Ce),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+j+"x"+Ce+")."),le}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),I;return I}function f(I){return I.generateMipmaps}function p(I){r.generateMipmap(I)}function b(I){return I.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?r.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function y(I,x,F,X,Z=!1){if(I!==null){if(r[I]!==void 0)return r[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let j=x;if(x===r.RED&&(F===r.FLOAT&&(j=r.R32F),F===r.HALF_FLOAT&&(j=r.R16F),F===r.UNSIGNED_BYTE&&(j=r.R8)),x===r.RED_INTEGER&&(F===r.UNSIGNED_BYTE&&(j=r.R8UI),F===r.UNSIGNED_SHORT&&(j=r.R16UI),F===r.UNSIGNED_INT&&(j=r.R32UI),F===r.BYTE&&(j=r.R8I),F===r.SHORT&&(j=r.R16I),F===r.INT&&(j=r.R32I)),x===r.RG&&(F===r.FLOAT&&(j=r.RG32F),F===r.HALF_FLOAT&&(j=r.RG16F),F===r.UNSIGNED_BYTE&&(j=r.RG8)),x===r.RG_INTEGER&&(F===r.UNSIGNED_BYTE&&(j=r.RG8UI),F===r.UNSIGNED_SHORT&&(j=r.RG16UI),F===r.UNSIGNED_INT&&(j=r.RG32UI),F===r.BYTE&&(j=r.RG8I),F===r.SHORT&&(j=r.RG16I),F===r.INT&&(j=r.RG32I)),x===r.RGB_INTEGER&&(F===r.UNSIGNED_BYTE&&(j=r.RGB8UI),F===r.UNSIGNED_SHORT&&(j=r.RGB16UI),F===r.UNSIGNED_INT&&(j=r.RGB32UI),F===r.BYTE&&(j=r.RGB8I),F===r.SHORT&&(j=r.RGB16I),F===r.INT&&(j=r.RGB32I)),x===r.RGBA_INTEGER&&(F===r.UNSIGNED_BYTE&&(j=r.RGBA8UI),F===r.UNSIGNED_SHORT&&(j=r.RGBA16UI),F===r.UNSIGNED_INT&&(j=r.RGBA32UI),F===r.BYTE&&(j=r.RGBA8I),F===r.SHORT&&(j=r.RGBA16I),F===r.INT&&(j=r.RGBA32I)),x===r.RGB&&(F===r.UNSIGNED_INT_5_9_9_9_REV&&(j=r.RGB9_E5),F===r.UNSIGNED_INT_10F_11F_11F_REV&&(j=r.R11F_G11F_B10F)),x===r.RGBA){let Ce=Z?us:Je.getTransfer(X);F===r.FLOAT&&(j=r.RGBA32F),F===r.HALF_FLOAT&&(j=r.RGBA16F),F===r.UNSIGNED_BYTE&&(j=Ce===et?r.SRGB8_ALPHA8:r.RGBA8),F===r.UNSIGNED_SHORT_4_4_4_4&&(j=r.RGBA4),F===r.UNSIGNED_SHORT_5_5_5_1&&(j=r.RGB5_A1)}return(j===r.R16F||j===r.R32F||j===r.RG16F||j===r.RG32F||j===r.RGBA16F||j===r.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function v(I,x){let F;return I?x===null||x===Wi||x===qr?F=r.DEPTH24_STENCIL8:x===di?F=r.DEPTH32F_STENCIL8:x===Xr&&(F=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Wi||x===qr?F=r.DEPTH_COMPONENT24:x===di?F=r.DEPTH_COMPONENT32F:x===Xr&&(F=r.DEPTH_COMPONENT16),F}function R(I,x){return f(I)===!0||I.isFramebufferTexture&&I.minFilter!==Wt&&I.minFilter!==$t?Math.log2(Math.max(x.width,x.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?x.mipmaps.length:1}function E(I){let x=I.target;x.removeEventListener("dispose",E),C(x),x.isVideoTexture&&h.delete(x)}function P(I){let x=I.target;x.removeEventListener("dispose",P),M(x)}function C(I){let x=i.get(I);if(x.__webglInit===void 0)return;let F=I.source,X=m.get(F);if(X){let Z=X[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&S(I),Object.keys(X).length===0&&m.delete(F)}i.remove(I)}function S(I){let x=i.get(I);r.deleteTexture(x.__webglTexture);let F=I.source,X=m.get(F);delete X[x.__cacheKey],a.memory.textures--}function M(I){let x=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(x.__webglFramebuffer[X]))for(let Z=0;Z<x.__webglFramebuffer[X].length;Z++)r.deleteFramebuffer(x.__webglFramebuffer[X][Z]);else r.deleteFramebuffer(x.__webglFramebuffer[X]);x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer[X])}else{if(Array.isArray(x.__webglFramebuffer))for(let X=0;X<x.__webglFramebuffer.length;X++)r.deleteFramebuffer(x.__webglFramebuffer[X]);else r.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&r.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&r.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let X=0;X<x.__webglColorRenderbuffer.length;X++)x.__webglColorRenderbuffer[X]&&r.deleteRenderbuffer(x.__webglColorRenderbuffer[X]);x.__webglDepthRenderbuffer&&r.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let F=I.textures;for(let X=0,Z=F.length;X<Z;X++){let j=i.get(F[X]);j.__webglTexture&&(r.deleteTexture(j.__webglTexture),a.memory.textures--),i.remove(F[X])}i.remove(I)}let L=0;function U(){L=0}function B(){let I=L;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),L+=1,I}function H(I){let x=[];return x.push(I.wrapS),x.push(I.wrapT),x.push(I.wrapR||0),x.push(I.magFilter),x.push(I.minFilter),x.push(I.anisotropy),x.push(I.internalFormat),x.push(I.format),x.push(I.type),x.push(I.generateMipmaps),x.push(I.premultiplyAlpha),x.push(I.flipY),x.push(I.unpackAlignment),x.push(I.colorSpace),x.join()}function W(I,x){let F=i.get(I);if(I.isVideoTexture&&ve(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&F.__version!==I.version){let X=I.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(F,I,x);return}}else I.isExternalTexture&&(F.__webglTexture=I.sourceTexture?I.sourceTexture:null);t.bindTexture(r.TEXTURE_2D,F.__webglTexture,r.TEXTURE0+x)}function V(I,x){let F=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&F.__version!==I.version){q(F,I,x);return}t.bindTexture(r.TEXTURE_2D_ARRAY,F.__webglTexture,r.TEXTURE0+x)}function $(I,x){let F=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&F.__version!==I.version){q(F,I,x);return}t.bindTexture(r.TEXTURE_3D,F.__webglTexture,r.TEXTURE0+x)}function k(I,x){let F=i.get(I);if(I.version>0&&F.__version!==I.version){Q(F,I,x);return}t.bindTexture(r.TEXTURE_CUBE_MAP,F.__webglTexture,r.TEXTURE0+x)}let se={[Rn]:r.REPEAT,[Oi]:r.CLAMP_TO_EDGE,[Cn]:r.MIRRORED_REPEAT},pe={[Wt]:r.NEAREST,[mh]:r.NEAREST_MIPMAP_NEAREST,[Hs]:r.NEAREST_MIPMAP_LINEAR,[$t]:r.LINEAR,[Ca]:r.LINEAR_MIPMAP_NEAREST,[Vi]:r.LINEAR_MIPMAP_LINEAR},Ie={[vh]:r.NEVER,[Th]:r.ALWAYS,[yh]:r.LESS,[wl]:r.LEQUAL,[xh]:r.EQUAL,[bh]:r.GEQUAL,[Mh]:r.GREATER,[Sh]:r.NOTEQUAL};function Le(I,x){if(x.type===di&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===$t||x.magFilter===Ca||x.magFilter===Hs||x.magFilter===Vi||x.minFilter===$t||x.minFilter===Ca||x.minFilter===Hs||x.minFilter===Vi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(I,r.TEXTURE_WRAP_S,se[x.wrapS]),r.texParameteri(I,r.TEXTURE_WRAP_T,se[x.wrapT]),(I===r.TEXTURE_3D||I===r.TEXTURE_2D_ARRAY)&&r.texParameteri(I,r.TEXTURE_WRAP_R,se[x.wrapR]),r.texParameteri(I,r.TEXTURE_MAG_FILTER,pe[x.magFilter]),r.texParameteri(I,r.TEXTURE_MIN_FILTER,pe[x.minFilter]),x.compareFunction&&(r.texParameteri(I,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(I,r.TEXTURE_COMPARE_FUNC,Ie[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Wt||x.minFilter!==Hs&&x.minFilter!==Vi||x.type===di&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let F=e.get("EXT_texture_filter_anisotropic");r.texParameterf(I,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Ye(I,x){let F=!1;I.__webglInit===void 0&&(I.__webglInit=!0,x.addEventListener("dispose",E));let X=x.source,Z=m.get(X);Z===void 0&&(Z={},m.set(X,Z));let j=H(x);if(j!==I.__cacheKey){Z[j]===void 0&&(Z[j]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Z[j].usedTimes++;let Ce=Z[I.__cacheKey];Ce!==void 0&&(Z[I.__cacheKey].usedTimes--,Ce.usedTimes===0&&S(x)),I.__cacheKey=j,I.__webglTexture=Z[j].texture}return F}function $e(I,x,F){return Math.floor(Math.floor(I/F)/x)}function Ke(I,x,F,X){let Z=I.updateRanges;if(Z.length===0)t.texSubImage2D(r.TEXTURE_2D,0,0,0,x.width,x.height,F,X,x.data);else{Z.sort((ge,ae)=>ge.start-ae.start);let j=0;for(let ge=1;ge<Z.length;ge++){let ae=Z[j],me=Z[ge],ze=ae.start+ae.count,we=$e(me.start,x.width,4),de=$e(ae.start,x.width,4);me.start<=ze+1&&we===de&&$e(me.start+me.count-1,x.width,4)===we?ae.count=Math.max(ae.count,me.start+me.count-ae.start):(++j,Z[j]=me)}Z.length=j+1;let Ce=r.getParameter(r.UNPACK_ROW_LENGTH),le=r.getParameter(r.UNPACK_SKIP_PIXELS),Te=r.getParameter(r.UNPACK_SKIP_ROWS);r.pixelStorei(r.UNPACK_ROW_LENGTH,x.width);for(let ge=0,ae=Z.length;ge<ae;ge++){let me=Z[ge],ze=Math.floor(me.start/4),we=Math.ceil(me.count/4),de=ze%x.width,je=Math.floor(ze/x.width),D=we;r.pixelStorei(r.UNPACK_SKIP_PIXELS,de),r.pixelStorei(r.UNPACK_SKIP_ROWS,je),t.texSubImage2D(r.TEXTURE_2D,0,de,je,D,1,F,X,x.data)}I.clearUpdateRanges(),r.pixelStorei(r.UNPACK_ROW_LENGTH,Ce),r.pixelStorei(r.UNPACK_SKIP_PIXELS,le),r.pixelStorei(r.UNPACK_SKIP_ROWS,Te)}}function q(I,x,F){let X=r.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(X=r.TEXTURE_2D_ARRAY),x.isData3DTexture&&(X=r.TEXTURE_3D);let Z=Ye(I,x),j=x.source;t.bindTexture(X,I.__webglTexture,r.TEXTURE0+F);let Ce=i.get(j);if(j.version!==Ce.__version||Z===!0){t.activeTexture(r.TEXTURE0+F);let le=Je.getPrimaries(Je.workingColorSpace),Te=x.colorSpace===Ai?null:Je.getPrimaries(x.colorSpace),ge=x.colorSpace===Ai||le===Te?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);let ae=_(x.image,!1,s.maxTextureSize);ae=He(x,ae);let me=n.convert(x.format,x.colorSpace),ze=n.convert(x.type),we=y(x.internalFormat,me,ze,x.colorSpace,x.isVideoTexture);Le(X,x);let de,je=x.mipmaps,D=x.isVideoTexture!==!0,oe=Ce.__version===void 0||Z===!0,he=j.dataReady,Ee=R(x,ae);if(x.isDepthTexture)we=v(x.format===Yr,x.type),oe&&(D?t.texStorage2D(r.TEXTURE_2D,1,we,ae.width,ae.height):t.texImage2D(r.TEXTURE_2D,0,we,ae.width,ae.height,0,me,ze,null));else if(x.isDataTexture)if(je.length>0){D&&oe&&t.texStorage2D(r.TEXTURE_2D,Ee,we,je[0].width,je[0].height);for(let ne=0,J=je.length;ne<J;ne++)de=je[ne],D?he&&t.texSubImage2D(r.TEXTURE_2D,ne,0,0,de.width,de.height,me,ze,de.data):t.texImage2D(r.TEXTURE_2D,ne,we,de.width,de.height,0,me,ze,de.data);x.generateMipmaps=!1}else D?(oe&&t.texStorage2D(r.TEXTURE_2D,Ee,we,ae.width,ae.height),he&&Ke(x,ae,me,ze)):t.texImage2D(r.TEXTURE_2D,0,we,ae.width,ae.height,0,me,ze,ae.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){D&&oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ee,we,je[0].width,je[0].height,ae.depth);for(let ne=0,J=je.length;ne<J;ne++)if(de=je[ne],x.format!==Xt)if(me!==null)if(D){if(he)if(x.layerUpdates.size>0){let Se=Nl(de.width,de.height,x.format,x.type);for(let De of x.layerUpdates){let dt=de.data.subarray(De*Se/de.data.BYTES_PER_ELEMENT,(De+1)*Se/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ne,0,0,De,de.width,de.height,1,me,dt)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,ae.depth,me,de.data)}else t.compressedTexImage3D(r.TEXTURE_2D_ARRAY,ne,we,de.width,de.height,ae.depth,0,de.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else D?he&&t.texSubImage3D(r.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,ae.depth,me,ze,de.data):t.texImage3D(r.TEXTURE_2D_ARRAY,ne,we,de.width,de.height,ae.depth,0,me,ze,de.data)}else{D&&oe&&t.texStorage2D(r.TEXTURE_2D,Ee,we,je[0].width,je[0].height);for(let ne=0,J=je.length;ne<J;ne++)de=je[ne],x.format!==Xt?me!==null?D?he&&t.compressedTexSubImage2D(r.TEXTURE_2D,ne,0,0,de.width,de.height,me,de.data):t.compressedTexImage2D(r.TEXTURE_2D,ne,we,de.width,de.height,0,de.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):D?he&&t.texSubImage2D(r.TEXTURE_2D,ne,0,0,de.width,de.height,me,ze,de.data):t.texImage2D(r.TEXTURE_2D,ne,we,de.width,de.height,0,me,ze,de.data)}else if(x.isDataArrayTexture)if(D){if(oe&&t.texStorage3D(r.TEXTURE_2D_ARRAY,Ee,we,ae.width,ae.height,ae.depth),he)if(x.layerUpdates.size>0){let ne=Nl(ae.width,ae.height,x.format,x.type);for(let J of x.layerUpdates){let Se=ae.data.subarray(J*ne/ae.data.BYTES_PER_ELEMENT,(J+1)*ne/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,J,ae.width,ae.height,1,me,ze,Se)}x.clearLayerUpdates()}else t.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,me,ze,ae.data)}else t.texImage3D(r.TEXTURE_2D_ARRAY,0,we,ae.width,ae.height,ae.depth,0,me,ze,ae.data);else if(x.isData3DTexture)D?(oe&&t.texStorage3D(r.TEXTURE_3D,Ee,we,ae.width,ae.height,ae.depth),he&&t.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,me,ze,ae.data)):t.texImage3D(r.TEXTURE_3D,0,we,ae.width,ae.height,ae.depth,0,me,ze,ae.data);else if(x.isFramebufferTexture){if(oe)if(D)t.texStorage2D(r.TEXTURE_2D,Ee,we,ae.width,ae.height);else{let ne=ae.width,J=ae.height;for(let Se=0;Se<Ee;Se++)t.texImage2D(r.TEXTURE_2D,Se,we,ne,J,0,me,ze,null),ne>>=1,J>>=1}}else if(je.length>0){if(D&&oe){let ne=Be(je[0]);t.texStorage2D(r.TEXTURE_2D,Ee,we,ne.width,ne.height)}for(let ne=0,J=je.length;ne<J;ne++)de=je[ne],D?he&&t.texSubImage2D(r.TEXTURE_2D,ne,0,0,me,ze,de):t.texImage2D(r.TEXTURE_2D,ne,we,me,ze,de);x.generateMipmaps=!1}else if(D){if(oe){let ne=Be(ae);t.texStorage2D(r.TEXTURE_2D,Ee,we,ne.width,ne.height)}he&&t.texSubImage2D(r.TEXTURE_2D,0,0,0,me,ze,ae)}else t.texImage2D(r.TEXTURE_2D,0,we,me,ze,ae);f(x)&&p(X),Ce.__version=j.version,x.onUpdate&&x.onUpdate(x)}I.__version=x.version}function Q(I,x,F){if(x.image.length!==6)return;let X=Ye(I,x),Z=x.source;t.bindTexture(r.TEXTURE_CUBE_MAP,I.__webglTexture,r.TEXTURE0+F);let j=i.get(Z);if(Z.version!==j.__version||X===!0){t.activeTexture(r.TEXTURE0+F);let Ce=Je.getPrimaries(Je.workingColorSpace),le=x.colorSpace===Ai?null:Je.getPrimaries(x.colorSpace),Te=x.colorSpace===Ai||Ce===le?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,x.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,x.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Te);let ge=x.isCompressedTexture||x.image[0].isCompressedTexture,ae=x.image[0]&&x.image[0].isDataTexture,me=[];for(let J=0;J<6;J++)!ge&&!ae?me[J]=_(x.image[J],!0,s.maxCubemapSize):me[J]=ae?x.image[J].image:x.image[J],me[J]=He(x,me[J]);let ze=me[0],we=n.convert(x.format,x.colorSpace),de=n.convert(x.type),je=y(x.internalFormat,we,de,x.colorSpace),D=x.isVideoTexture!==!0,oe=j.__version===void 0||X===!0,he=Z.dataReady,Ee=R(x,ze);Le(r.TEXTURE_CUBE_MAP,x);let ne;if(ge){D&&oe&&t.texStorage2D(r.TEXTURE_CUBE_MAP,Ee,je,ze.width,ze.height);for(let J=0;J<6;J++){ne=me[J].mipmaps;for(let Se=0;Se<ne.length;Se++){let De=ne[Se];x.format!==Xt?we!==null?D?he&&t.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se,0,0,De.width,De.height,we,De.data):t.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se,je,De.width,De.height,0,De.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):D?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se,0,0,De.width,De.height,we,de,De.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se,je,De.width,De.height,0,we,de,De.data)}}}else{if(ne=x.mipmaps,D&&oe){ne.length>0&&Ee++;let J=Be(me[0]);t.texStorage2D(r.TEXTURE_CUBE_MAP,Ee,je,J.width,J.height)}for(let J=0;J<6;J++)if(ae){D?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,me[J].width,me[J].height,we,de,me[J].data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,je,me[J].width,me[J].height,0,we,de,me[J].data);for(let Se=0;Se<ne.length;Se++){let De=ne[Se].image[J].image;D?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se+1,0,0,De.width,De.height,we,de,De.data):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se+1,je,De.width,De.height,0,we,de,De.data)}}else{D?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,we,de,me[J]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,je,we,de,me[J]);for(let Se=0;Se<ne.length;Se++){let De=ne[Se];D?he&&t.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se+1,0,0,we,de,De.image[J]):t.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,Se+1,je,we,de,De.image[J])}}}f(x)&&p(r.TEXTURE_CUBE_MAP),j.__version=Z.version,x.onUpdate&&x.onUpdate(x)}I.__version=x.version}function fe(I,x,F,X,Z,j){let Ce=n.convert(F.format,F.colorSpace),le=n.convert(F.type),Te=y(F.internalFormat,Ce,le,F.colorSpace),ge=i.get(x),ae=i.get(F);if(ae.__renderTarget=x,!ge.__hasExternalTextures){let me=Math.max(1,x.width>>j),ze=Math.max(1,x.height>>j);Z===r.TEXTURE_3D||Z===r.TEXTURE_2D_ARRAY?t.texImage3D(Z,j,Te,me,ze,x.depth,0,Ce,le,null):t.texImage2D(Z,j,Te,me,ze,0,Ce,le,null)}t.bindFramebuffer(r.FRAMEBUFFER,I),ie(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,X,Z,ae.__webglTexture,0,Me(x)):(Z===r.TEXTURE_2D||Z>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,X,Z,ae.__webglTexture,j),t.bindFramebuffer(r.FRAMEBUFFER,null)}function Pe(I,x,F){if(r.bindRenderbuffer(r.RENDERBUFFER,I),x.depthBuffer){let X=x.depthTexture,Z=X&&X.isDepthTexture?X.type:null,j=v(x.stencilBuffer,Z),Ce=x.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,le=Me(x);ie(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,le,j,x.width,x.height):F?r.renderbufferStorageMultisample(r.RENDERBUFFER,le,j,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,j,x.width,x.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ce,r.RENDERBUFFER,I)}else{let X=x.textures;for(let Z=0;Z<X.length;Z++){let j=X[Z],Ce=n.convert(j.format,j.colorSpace),le=n.convert(j.type),Te=y(j.internalFormat,Ce,le,j.colorSpace),ge=Me(x);F&&ie(x)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,ge,Te,x.width,x.height):ie(x)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ge,Te,x.width,x.height):r.renderbufferStorage(r.RENDERBUFFER,Te,x.width,x.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Re(I,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(r.FRAMEBUFFER,I),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let F=i.get(x.depthTexture);F.__renderTarget=x,(!F.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),W(x.depthTexture,0);let X=F.__webglTexture,Z=Me(x);if(x.depthTexture.format===Cr)ie(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,X,0,Z):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,X,0);else if(x.depthTexture.format===Yr)ie(x)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,X,0,Z):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,X,0);else throw new Error("Unknown depthTexture format")}function be(I){let x=i.get(I),F=I.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==I.depthTexture){let X=I.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),X){let Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,X.removeEventListener("dispose",Z)};X.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=X}if(I.depthTexture&&!x.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");let X=I.texture.mipmaps;X&&X.length>0?Re(x.__webglFramebuffer[0],I):Re(x.__webglFramebuffer,I)}else if(F){x.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[X]),x.__webglDepthbuffer[X]===void 0)x.__webglDepthbuffer[X]=r.createRenderbuffer(),Pe(x.__webglDepthbuffer[X],I,!1);else{let Z=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,j=x.__webglDepthbuffer[X];r.bindRenderbuffer(r.RENDERBUFFER,j),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,j)}}else{let X=I.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(r.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=r.createRenderbuffer(),Pe(x.__webglDepthbuffer,I,!1);else{let Z=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,j=x.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,j),r.framebufferRenderbuffer(r.FRAMEBUFFER,Z,r.RENDERBUFFER,j)}}t.bindFramebuffer(r.FRAMEBUFFER,null)}function qe(I,x,F){let X=i.get(I);x!==void 0&&fe(X.__webglFramebuffer,I,I.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),F!==void 0&&be(I)}function w(I){let x=I.texture,F=i.get(I),X=i.get(x);I.addEventListener("dispose",P);let Z=I.textures,j=I.isWebGLCubeRenderTarget===!0,Ce=Z.length>1;if(Ce||(X.__webglTexture===void 0&&(X.__webglTexture=r.createTexture()),X.__version=x.version,a.memory.textures++),j){F.__webglFramebuffer=[];for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[le]=[];for(let Te=0;Te<x.mipmaps.length;Te++)F.__webglFramebuffer[le][Te]=r.createFramebuffer()}else F.__webglFramebuffer[le]=r.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let le=0;le<x.mipmaps.length;le++)F.__webglFramebuffer[le]=r.createFramebuffer()}else F.__webglFramebuffer=r.createFramebuffer();if(Ce)for(let le=0,Te=Z.length;le<Te;le++){let ge=i.get(Z[le]);ge.__webglTexture===void 0&&(ge.__webglTexture=r.createTexture(),a.memory.textures++)}if(I.samples>0&&ie(I)===!1){F.__webglMultisampledFramebuffer=r.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(r.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let le=0;le<Z.length;le++){let Te=Z[le];F.__webglColorRenderbuffer[le]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,F.__webglColorRenderbuffer[le]);let ge=n.convert(Te.format,Te.colorSpace),ae=n.convert(Te.type),me=y(Te.internalFormat,ge,ae,Te.colorSpace,I.isXRRenderTarget===!0),ze=Me(I);r.renderbufferStorageMultisample(r.RENDERBUFFER,ze,me,I.width,I.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+le,r.RENDERBUFFER,F.__webglColorRenderbuffer[le])}r.bindRenderbuffer(r.RENDERBUFFER,null),I.depthBuffer&&(F.__webglDepthRenderbuffer=r.createRenderbuffer(),Pe(F.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(r.FRAMEBUFFER,null)}}if(j){t.bindTexture(r.TEXTURE_CUBE_MAP,X.__webglTexture),Le(r.TEXTURE_CUBE_MAP,x);for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0)for(let Te=0;Te<x.mipmaps.length;Te++)fe(F.__webglFramebuffer[le][Te],I,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+le,Te);else fe(F.__webglFramebuffer[le],I,x,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);f(x)&&p(r.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ce){for(let le=0,Te=Z.length;le<Te;le++){let ge=Z[le],ae=i.get(ge),me=r.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(me=I.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(me,ae.__webglTexture),Le(me,ge),fe(F.__webglFramebuffer,I,ge,r.COLOR_ATTACHMENT0+le,me,0),f(ge)&&p(me)}t.unbindTexture()}else{let le=r.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(le=I.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),t.bindTexture(le,X.__webglTexture),Le(le,x),x.mipmaps&&x.mipmaps.length>0)for(let Te=0;Te<x.mipmaps.length;Te++)fe(F.__webglFramebuffer[Te],I,x,r.COLOR_ATTACHMENT0,le,Te);else fe(F.__webglFramebuffer,I,x,r.COLOR_ATTACHMENT0,le,0);f(x)&&p(le),t.unbindTexture()}I.depthBuffer&&be(I)}function te(I){let x=I.textures;for(let F=0,X=x.length;F<X;F++){let Z=x[F];if(f(Z)){let j=b(I),Ce=i.get(Z).__webglTexture;t.bindTexture(j,Ce),p(j),t.unbindTexture()}}}let ee=[],ce=[];function Y(I){if(I.samples>0){if(ie(I)===!1){let x=I.textures,F=I.width,X=I.height,Z=r.COLOR_BUFFER_BIT,j=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ce=i.get(I),le=x.length>1;if(le)for(let ge=0;ge<x.length;ge++)t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.RENDERBUFFER,null),t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.TEXTURE_2D,null,0);t.bindFramebuffer(r.READ_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer);let Te=I.texture.mipmaps;Te&&Te.length>0?t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer[0]):t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ce.__webglFramebuffer);for(let ge=0;ge<x.length;ge++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(Z|=r.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(Z|=r.STENCIL_BUFFER_BIT)),le){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ce.__webglColorRenderbuffer[ge]);let ae=i.get(x[ge]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,ae,0)}r.blitFramebuffer(0,0,F,X,0,0,F,X,Z,r.NEAREST),l===!0&&(ee.length=0,ce.length=0,ee.push(r.COLOR_ATTACHMENT0+ge),I.depthBuffer&&I.resolveDepthBuffer===!1&&(ee.push(j),ce.push(j),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,ce)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ee))}if(t.bindFramebuffer(r.READ_FRAMEBUFFER,null),t.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),le)for(let ge=0;ge<x.length;ge++){t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.RENDERBUFFER,Ce.__webglColorRenderbuffer[ge]);let ae=i.get(x[ge]).__webglTexture;t.bindFramebuffer(r.FRAMEBUFFER,Ce.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+ge,r.TEXTURE_2D,ae,0)}t.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ce.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&l){let x=I.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[x])}}}function Me(I){return Math.min(s.maxSamples,I.samples)}function ie(I){let x=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function ve(I){let x=a.render.frame;h.get(I)!==x&&(h.set(I,x),I.update())}function He(I,x){let F=I.colorSpace,X=I.format,Z=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||F!==er&&F!==Ai&&(Je.getTransfer(F)===et?(X!==Xt||Z!==ii)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),x}function Be(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=U,this.setTexture2D=W,this.setTexture2DArray=V,this.setTexture3D=$,this.setTextureCube=k,this.rebindTextures=qe,this.setupRenderTarget=w,this.updateRenderTargetMipmap=te,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=ie}function h_(r,e){function t(i,s=Ai){let n,a=Je.getTransfer(s);if(i===ii)return r.UNSIGNED_BYTE;if(i===Pa)return r.UNSIGNED_SHORT_4_4_4_4;if(i===La)return r.UNSIGNED_SHORT_5_5_5_1;if(i===yl)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===xl)return r.UNSIGNED_INT_10F_11F_11F_REV;if(i===_l)return r.BYTE;if(i===vl)return r.SHORT;if(i===Xr)return r.UNSIGNED_SHORT;if(i===Ia)return r.INT;if(i===Wi)return r.UNSIGNED_INT;if(i===di)return r.FLOAT;if(i===jr)return r.HALF_FLOAT;if(i===Ml)return r.ALPHA;if(i===Sl)return r.RGB;if(i===Xt)return r.RGBA;if(i===Cr)return r.DEPTH_COMPONENT;if(i===Yr)return r.DEPTH_STENCIL;if(i===bl)return r.RED;if(i===Da)return r.RED_INTEGER;if(i===Tl)return r.RG;if(i===Ua)return r.RG_INTEGER;if(i===Na)return r.RGBA_INTEGER;if(i===Vs||i===Ws||i===Xs||i===js)if(a===et)if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(i===Vs)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ws)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Xs)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===js)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=e.get("WEBGL_compressed_texture_s3tc"),n!==null){if(i===Vs)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ws)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Xs)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===js)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Oa||i===Fa||i===Ba||i===za)if(n=e.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(i===Oa)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Fa)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ba)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===za)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ga||i===ka||i===Ha)if(n=e.get("WEBGL_compressed_texture_etc"),n!==null){if(i===Ga||i===ka)return a===et?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(i===Ha)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Va||i===Wa||i===Xa||i===ja||i===qa||i===Ya||i===Za||i===Ja||i===Ka||i===$a||i===Qa||i===eo||i===to||i===io)if(n=e.get("WEBGL_compressed_texture_astc"),n!==null){if(i===Va)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Wa)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Xa)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ja)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===qa)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ya)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Za)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ja)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ka)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===$a)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Qa)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===eo)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===to)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===io)return a===et?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ro||i===so||i===no)if(n=e.get("EXT_texture_compression_bptc"),n!==null){if(i===ro)return a===et?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===so)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===no)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ao||i===oo||i===lo||i===co)if(n=e.get("EXT_texture_compression_rgtc"),n!==null){if(i===ao)return n.COMPRESSED_RED_RGTC1_EXT;if(i===oo)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===lo)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===co)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===qr?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:t}}var u_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,d_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Yl=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new bs(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new ti({vertexShader:u_,fragmentShader:d_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new xt(new Gr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Zl=class extends oi{constructor(e,t){super();let i=this,s=null,n=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,m=null,u=null,g=null,_=typeof XRWebGLBinding<"u",f=new Yl,p={},b=t.getContextAttributes(),y=null,v=null,R=[],E=[],P=new K,C=null,S=new bt;S.viewport=new ot;let M=new bt;M.viewport=new ot;let L=[S,M],U=new va,B=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let Q=R[q];return Q===void 0&&(Q=new Nr,R[q]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(q){let Q=R[q];return Q===void 0&&(Q=new Nr,R[q]=Q),Q.getGripSpace()},this.getHand=function(q){let Q=R[q];return Q===void 0&&(Q=new Nr,R[q]=Q),Q.getHandSpace()};function W(q){let Q=E.indexOf(q.inputSource);if(Q===-1)return;let fe=R[Q];fe!==void 0&&(fe.update(q.inputSource,q.frame,c||a),fe.dispatchEvent({type:q.type,data:q.inputSource}))}function V(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",$);for(let q=0;q<R.length;q++){let Q=E[q];Q!==null&&(E[q]=null,R[q].disconnect(Q))}B=null,H=null,f.reset();for(let q in p)delete p[q];e.setRenderTarget(y),u=null,m=null,d=null,s=null,v=null,Ke.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){n=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return m!==null?m:u},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(q){if(s=q,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",V),s.addEventListener("inputsourceschange",$),b.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(P),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Q=null,fe=null,Pe=null;b.depth&&(Pe=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=b.stencil?Yr:Cr,fe=b.stencil?qr:Wi);let Re={colorFormat:t.RGBA8,depthFormat:Pe,scaleFactor:n};d=this.getBinding(),m=d.createProjectionLayer(Re),s.updateRenderState({layers:[m]}),e.setPixelRatio(1),e.setSize(m.textureWidth,m.textureHeight,!1),v=new li(m.textureWidth,m.textureHeight,{format:Xt,type:ii,depthTexture:new Ss(m.textureWidth,m.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}else{let Q={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:n};u=new XRWebGLLayer(s,t,Q),s.updateRenderState({baseLayer:u}),e.setPixelRatio(1),e.setSize(u.framebufferWidth,u.framebufferHeight,!1),v=new li(u.framebufferWidth,u.framebufferHeight,{format:Xt,type:ii,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ke.setContext(s),Ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function $(q){for(let Q=0;Q<q.removed.length;Q++){let fe=q.removed[Q],Pe=E.indexOf(fe);Pe>=0&&(E[Pe]=null,R[Pe].disconnect(fe))}for(let Q=0;Q<q.added.length;Q++){let fe=q.added[Q],Pe=E.indexOf(fe);if(Pe===-1){for(let be=0;be<R.length;be++)if(be>=E.length){E.push(fe),Pe=be;break}else if(E[be]===null){E[be]=fe,Pe=be;break}if(Pe===-1)break}let Re=R[Pe];Re&&Re.connect(fe)}}let k=new A,se=new A;function pe(q,Q,fe){k.setFromMatrixPosition(Q.matrixWorld),se.setFromMatrixPosition(fe.matrixWorld);let Pe=k.distanceTo(se),Re=Q.projectionMatrix.elements,be=fe.projectionMatrix.elements,qe=Re[14]/(Re[10]-1),w=Re[14]/(Re[10]+1),te=(Re[9]+1)/Re[5],ee=(Re[9]-1)/Re[5],ce=(Re[8]-1)/Re[0],Y=(be[8]+1)/be[0],Me=qe*ce,ie=qe*Y,ve=Pe/(-ce+Y),He=ve*-ce;if(Q.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(He),q.translateZ(ve),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Re[10]===-1)q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let Be=qe+ve,I=w+ve,x=Me-He,F=ie+(Pe-He),X=te*w/I*Be,Z=ee*w/I*Be;q.projectionMatrix.makePerspective(x,F,X,Z,Be,I),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function Ie(q,Q){Q===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(Q.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(s===null)return;let Q=q.near,fe=q.far;f.texture!==null&&(f.depthNear>0&&(Q=f.depthNear),f.depthFar>0&&(fe=f.depthFar)),U.near=M.near=S.near=Q,U.far=M.far=S.far=fe,(B!==U.near||H!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),B=U.near,H=U.far),U.layers.mask=q.layers.mask|6,S.layers.mask=U.layers.mask&3,M.layers.mask=U.layers.mask&5;let Pe=q.parent,Re=U.cameras;Ie(U,Pe);for(let be=0;be<Re.length;be++)Ie(Re[be],Pe);Re.length===2?pe(U,S,M):U.projectionMatrix.copy(S.projectionMatrix),Le(q,U,Pe)};function Le(q,Q,fe){fe===null?q.matrix.copy(Q.matrixWorld):(q.matrix.copy(fe.matrixWorld),q.matrix.invert(),q.matrix.multiply(Q.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(Q.projectionMatrix),q.projectionMatrixInverse.copy(Q.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Ir*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(m===null&&u===null))return l},this.setFoveation=function(q){l=q,m!==null&&(m.fixedFoveation=q),u!==null&&u.fixedFoveation!==void 0&&(u.fixedFoveation=q)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(U)},this.getCameraTexture=function(q){return p[q]};let Ye=null;function $e(q,Q){if(h=Q.getViewerPose(c||a),g=Q,h!==null){let fe=h.views;u!==null&&(e.setRenderTargetFramebuffer(v,u.framebuffer),e.setRenderTarget(v));let Pe=!1;fe.length!==U.cameras.length&&(U.cameras.length=0,Pe=!0);for(let be=0;be<fe.length;be++){let qe=fe[be],w=null;if(u!==null)w=u.getViewport(qe);else{let ee=d.getViewSubImage(m,qe);w=ee.viewport,be===0&&(e.setRenderTargetTextures(v,ee.colorTexture,ee.depthStencilTexture),e.setRenderTarget(v))}let te=L[be];te===void 0&&(te=new bt,te.layers.enable(be),te.viewport=new ot,L[be]=te),te.matrix.fromArray(qe.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(qe.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(w.x,w.y,w.width,w.height),be===0&&(U.matrix.copy(te.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Pe===!0&&U.cameras.push(te)}let Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){d=i.getBinding();let be=d.getDepthInformation(fe[0]);be&&be.isValid&&be.texture&&f.init(be,s.renderState)}if(Re&&Re.includes("camera-access")&&_){e.state.unbindTexture(),d=i.getBinding();for(let be=0;be<fe.length;be++){let qe=fe[be].camera;if(qe){let w=p[qe];w||(w=new bs,p[qe]=w);let te=d.getCameraImage(qe);w.sourceTexture=te}}}}for(let fe=0;fe<R.length;fe++){let Pe=E[fe],Re=R[fe];Pe!==null&&Re!==void 0&&Re.update(Pe,Q,c||a)}Ye&&Ye(q,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}let Ke=new ru;Ke.setAnimationLoop($e),this.setAnimationLoop=function(q){Ye=q},this.dispose=function(){}}},cr=new ei,p_=new We;function m_(r,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function i(f,p){p.color.getRGB(f.fogColor.value,Pl(r)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,b,y,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?n(f,p):p.isMeshToonMaterial?(n(f,p),d(f,p)):p.isMeshPhongMaterial?(n(f,p),h(f,p)):p.isMeshStandardMaterial?(n(f,p),m(f,p),p.isMeshPhysicalMaterial&&u(f,p,v)):p.isMeshMatcapMaterial?(n(f,p),g(f,p)):p.isMeshDepthMaterial?n(f,p):p.isMeshDistanceMaterial?(n(f,p),_(f,p)):p.isMeshNormalMaterial?n(f,p):p.isLineBasicMaterial?(a(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?l(f,p,b,y):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function n(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===At&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===At&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);let b=e.get(p),y=b.envMap,v=b.envMapRotation;y&&(f.envMap.value=y,cr.copy(v),cr.x*=-1,cr.y*=-1,cr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(cr.y*=-1,cr.z*=-1),f.envMapRotation.value.setFromMatrix4(p_.makeRotationFromEuler(cr)),f.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function a(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,b,y){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*b,f.scale.value=y*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function h(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function d(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function m(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function u(f,p,b){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===At&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,p){p.matcap&&(f.matcap.value=p.matcap)}function _(f,p){let b=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(b.matrixWorld),f.nearDistance.value=b.shadow.camera.near,f.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function f_(r,e,t,i){let s={},n={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,y){let v=y.program;i.uniformBlockBinding(b,v)}function c(b,y){let v=s[b.id];v===void 0&&(g(b),v=h(b),s[b.id]=v,b.addEventListener("dispose",f));let R=y.program;i.updateUBOMapping(b,R);let E=e.render.frame;n[b.id]!==E&&(m(b),n[b.id]=E)}function h(b){let y=d();b.__bindingPointIndex=y;let v=r.createBuffer(),R=b.__size,E=b.usage;return r.bindBuffer(r.UNIFORM_BUFFER,v),r.bufferData(r.UNIFORM_BUFFER,R,E),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,y,v),v}function d(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(b){let y=s[b.id],v=b.uniforms,R=b.__cache;r.bindBuffer(r.UNIFORM_BUFFER,y);for(let E=0,P=v.length;E<P;E++){let C=Array.isArray(v[E])?v[E]:[v[E]];for(let S=0,M=C.length;S<M;S++){let L=C[S];if(u(L,E,S,R)===!0){let U=L.__offset,B=Array.isArray(L.value)?L.value:[L.value],H=0;for(let W=0;W<B.length;W++){let V=B[W],$=_(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,r.bufferSubData(r.UNIFORM_BUFFER,U+H,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):(V.toArray(L.__data,H),H+=$.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,U,L.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function u(b,y,v,R){let E=b.value,P=y+"_"+v;if(R[P]===void 0)return typeof E=="number"||typeof E=="boolean"?R[P]=E:R[P]=E.clone(),!0;{let C=R[P];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return R[P]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function g(b){let y=b.uniforms,v=0,R=16;for(let P=0,C=y.length;P<C;P++){let S=Array.isArray(y[P])?y[P]:[y[P]];for(let M=0,L=S.length;M<L;M++){let U=S[M],B=Array.isArray(U.value)?U.value:[U.value];for(let H=0,W=B.length;H<W;H++){let V=B[H],$=_(V),k=v%R,se=k%$.boundary,pe=k+se;v+=se,pe!==0&&R-pe<$.storage&&(v+=R-pe),U.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=v,v+=$.storage}}}let E=v%R;return E>0&&(v+=R-E),b.__size=v,b.__cache={},this}function _(b){let y={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(y.boundary=4,y.storage=4):b.isVector2?(y.boundary=8,y.storage=8):b.isVector3||b.isColor?(y.boundary=16,y.storage=12):b.isVector4?(y.boundary=16,y.storage=16):b.isMatrix3?(y.boundary=48,y.storage=48):b.isMatrix4?(y.boundary=64,y.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),y}function f(b){let y=b.target;y.removeEventListener("dispose",f);let v=a.indexOf(y.__bindingPointIndex);a.splice(v,1),r.deleteBuffer(s[y.id]),delete s[y.id],delete n[y.id]}function p(){for(let b in s)r.deleteBuffer(s[b]);a=[],s={},n={}}return{bind:l,update:c,dispose:p}}var fo=class{constructor(e={}){let{canvas:t=Eh(),context:i=null,depth:s=!0,stencil:n=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:m=!1}=e;this.isWebGLRenderer=!0;let u;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=i.getContextAttributes().alpha}else u=a;let g=new Uint32Array(4),_=new Int32Array(4),f=null,p=null,b=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=wi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let v=this,R=!1;this._outputColorSpace=Ut;let E=0,P=0,C=null,S=-1,M=null,L=new ot,U=new ot,B=null,H=new ke(0),W=0,V=t.width,$=t.height,k=1,se=null,pe=null,Ie=new ot(0,0,V,$),Le=new ot(0,0,V,$),Ye=!1,$e=new Bi,Ke=!1,q=!1,Q=new We,fe=new A,Pe=new ot,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},be=!1;function qe(){return C===null?k:1}let w=i;function te(T,O){return t.getContext(T,O)}try{let T={alpha:!0,depth:s,stencil:n,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"180"}`),t.addEventListener("webglcontextlost",he,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",ne,!1),w===null){let O="webgl2";if(w=te(O,T),w===null)throw te(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let ee,ce,Y,Me,ie,ve,He,Be,I,x,F,X,Z,j,Ce,le,Te,ge,ae,me,ze,we,de,je;function D(){ee=new Df(w),ee.init(),we=new h_(w,ee),ce=new wf(w,ee,e,we),Y=new l_(w,ee),ce.reversedDepthBuffer&&m&&Y.buffers.depth.setReversed(!0),Me=new Of(w),ie=new Zg,ve=new c_(w,ee,Y,ie,ce,we,Me),He=new Rf(v),Be=new Lf(v),I=new kd(w),de=new Tf(w,I),x=new Uf(w,I,Me,de),F=new Bf(w,x,I,Me),ae=new Ff(w,ce,ve),le=new Af(ie),X=new Yg(v,He,Be,ee,ce,de,le),Z=new m_(v,ie),j=new Kg,Ce=new r_(ee),ge=new bf(v,He,Be,Y,F,u,l),Te=new a_(v,F,ce),je=new f_(w,Me,ce,Y),me=new Ef(w,ee,Me),ze=new Nf(w,ee,Me),Me.programs=X.programs,v.capabilities=ce,v.extensions=ee,v.properties=ie,v.renderLists=j,v.shadowMap=Te,v.state=Y,v.info=Me}D();let oe=new Zl(v,w);this.xr=oe,this.getContext=function(){return w},this.getContextAttributes=function(){return w.getContextAttributes()},this.forceContextLoss=function(){let T=ee.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){let T=ee.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(T){T!==void 0&&(k=T,this.setSize(V,$,!1))},this.getSize=function(T){return T.set(V,$)},this.setSize=function(T,O,z=!0){if(oe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=T,$=O,t.width=Math.floor(T*k),t.height=Math.floor(O*k),z===!0&&(t.style.width=T+"px",t.style.height=O+"px"),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(V*k,$*k).floor()},this.setDrawingBufferSize=function(T,O,z){V=T,$=O,k=z,t.width=Math.floor(T*z),t.height=Math.floor(O*z),this.setViewport(0,0,T,O)},this.getCurrentViewport=function(T){return T.copy(L)},this.getViewport=function(T){return T.copy(Ie)},this.setViewport=function(T,O,z,G){T.isVector4?Ie.set(T.x,T.y,T.z,T.w):Ie.set(T,O,z,G),Y.viewport(L.copy(Ie).multiplyScalar(k).round())},this.getScissor=function(T){return T.copy(Le)},this.setScissor=function(T,O,z,G){T.isVector4?Le.set(T.x,T.y,T.z,T.w):Le.set(T,O,z,G),Y.scissor(U.copy(Le).multiplyScalar(k).round())},this.getScissorTest=function(){return Ye},this.setScissorTest=function(T){Y.setScissorTest(Ye=T)},this.setOpaqueSort=function(T){se=T},this.setTransparentSort=function(T){pe=T},this.getClearColor=function(T){return T.copy(ge.getClearColor())},this.setClearColor=function(){ge.setClearColor(...arguments)},this.getClearAlpha=function(){return ge.getClearAlpha()},this.setClearAlpha=function(){ge.setClearAlpha(...arguments)},this.clear=function(T=!0,O=!0,z=!0){let G=0;if(T){let N=!1;if(C!==null){let re=C.texture.format;N=re===Na||re===Ua||re===Da}if(N){let re=C.texture.type,_e=re===ii||re===Wi||re===Xr||re===qr||re===Pa||re===La,ye=ge.getClearColor(),xe=ge.getClearAlpha(),Ne=ye.r,Fe=ye.g,Oe=ye.b;_e?(g[0]=Ne,g[1]=Fe,g[2]=Oe,g[3]=xe,w.clearBufferuiv(w.COLOR,0,g)):(_[0]=Ne,_[1]=Fe,_[2]=Oe,_[3]=xe,w.clearBufferiv(w.COLOR,0,_))}else G|=w.COLOR_BUFFER_BIT}O&&(G|=w.DEPTH_BUFFER_BIT),z&&(G|=w.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),w.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",he,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",ne,!1),ge.dispose(),j.dispose(),Ce.dispose(),ie.dispose(),He.dispose(),Be.dispose(),F.dispose(),de.dispose(),je.dispose(),X.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",ri),oe.removeEventListener("sessionend",Ql),Xi.stop()};function he(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;let T=Me.autoReset,O=Te.enabled,z=Te.autoUpdate,G=Te.needsUpdate,N=Te.type;D(),Me.autoReset=T,Te.enabled=O,Te.autoUpdate=z,Te.needsUpdate=G,Te.type=N}function ne(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function J(T){let O=T.target;O.removeEventListener("dispose",J),Se(O)}function Se(T){De(T),ie.remove(T)}function De(T){let O=ie.get(T).programs;O!==void 0&&(O.forEach(function(z){X.releaseProgram(z)}),T.isShaderMaterial&&X.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,z,G,N,re){O===null&&(O=Re);let _e=N.isMesh&&N.matrixWorld.determinant()<0,ye=pu(T,O,z,G,N);Y.setMaterial(G,_e);let xe=z.index,Ne=1;if(G.wireframe===!0){if(xe=x.getWireframeAttribute(z),xe===void 0)return;Ne=2}let Fe=z.drawRange,Oe=z.attributes.position,Ze=Fe.start*Ne,rt=(Fe.start+Fe.count)*Ne;re!==null&&(Ze=Math.max(Ze,re.start*Ne),rt=Math.min(rt,(re.start+re.count)*Ne)),xe!==null?(Ze=Math.max(Ze,0),rt=Math.min(rt,xe.count)):Oe!=null&&(Ze=Math.max(Ze,0),rt=Math.min(rt,Oe.count));let nt=rt-Ze;if(nt<0||nt===1/0)return;de.setup(N,G,ye,z,xe);let lt,st=me;if(xe!==null&&(lt=I.get(xe),st=ze,st.setIndex(lt)),N.isMesh)G.wireframe===!0?(Y.setLineWidth(G.wireframeLinewidth*qe()),st.setMode(w.LINES)):st.setMode(w.TRIANGLES);else if(N.isLine){let Ae=G.linewidth;Ae===void 0&&(Ae=1),Y.setLineWidth(Ae*qe()),N.isLineSegments?st.setMode(w.LINES):N.isLineLoop?st.setMode(w.LINE_LOOP):st.setMode(w.LINE_STRIP)}else N.isPoints?st.setMode(w.POINTS):N.isSprite&&st.setMode(w.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Pr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),st.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(ee.get("WEBGL_multi_draw"))st.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let Ae=N._multiDrawStarts,_t=N._multiDrawCounts,fi=N._multiDrawCount,jt=xe?I.get(xe).bytesPerElement:1,pr=ie.get(G).currentProgram.getUniforms();for(let Pt=0;Pt<fi;Pt++)pr.setValue(w,"_gl_DrawID",Pt),st.render(Ae[Pt]/jt,_t[Pt])}else if(N.isInstancedMesh)st.renderInstances(Ze,nt,N.count);else if(z.isInstancedBufferGeometry){let Ae=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,_t=Math.min(z.instanceCount,Ae);st.renderInstances(Ze,nt,_t)}else st.render(Ze,nt)};function dt(T,O,z){T.transparent===!0&&T.side===Bt&&T.forceSinglePass===!1?(T.side=At,T.needsUpdate=!0,Zs(T,O,z),T.side=bi,T.needsUpdate=!0,Zs(T,O,z),T.side=Bt):Zs(T,O,z)}this.compile=function(T,O,z=null){z===null&&(z=T),p=Ce.get(z),p.init(O),y.push(p),z.traverseVisible(function(N){N.isLight&&N.layers.test(O.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),T!==z&&T.traverseVisible(function(N){N.isLight&&N.layers.test(O.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();let G=new Set;return T.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let re=N.material;if(re)if(Array.isArray(re))for(let _e=0;_e<re.length;_e++){let ye=re[_e];dt(ye,z,N),G.add(ye)}else dt(re,z,N),G.add(re)}),p=y.pop(),G},this.compileAsync=function(T,O,z=null){let G=this.compile(T,O,z);return new Promise(N=>{function re(){if(G.forEach(function(_e){ie.get(_e).currentProgram.isReady()&&G.delete(_e)}),G.size===0){N(T);return}setTimeout(re,10)}ee.get("KHR_parallel_shader_compile")!==null?re():setTimeout(re,10)})};let Qe=null;function mi(T){Qe&&Qe(T)}function ri(){Xi.stop()}function Ql(){Xi.start()}let Xi=new ru;Xi.setAnimationLoop(mi),typeof self<"u"&&Xi.setContext(self),this.setAnimationLoop=function(T){Qe=T,oe.setAnimationLoop(T),T===null?Xi.stop():Xi.start()},oe.addEventListener("sessionstart",ri),oe.addEventListener("sessionend",Ql),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(O),O=oe.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,O,C),p=Ce.get(T,y.length),p.init(O),y.push(p),Q.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),$e.setFromProjectionMatrix(Q,Vt,O.reversedDepth),q=this.localClippingEnabled,Ke=le.init(this.clippingPlanes,q),f=j.get(T,b.length),f.init(),b.push(f),oe.enabled===!0&&oe.isPresenting===!0){let re=v.xr.getDepthSensingMesh();re!==null&&So(re,O,-1/0,v.sortObjects)}So(T,O,0,v.sortObjects),f.finish(),v.sortObjects===!0&&f.sort(se,pe),be=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,be&&ge.addToRenderList(f,T),this.info.render.frame++,Ke===!0&&le.beginShadows();let z=p.state.shadowsArray;Te.render(z,T,O),Ke===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();let G=f.opaque,N=f.transmissive;if(p.setupLights(),O.isArrayCamera){let re=O.cameras;if(N.length>0)for(let _e=0,ye=re.length;_e<ye;_e++){let xe=re[_e];tc(G,N,T,xe)}be&&ge.render(T);for(let _e=0,ye=re.length;_e<ye;_e++){let xe=re[_e];ec(f,T,xe,xe.viewport)}}else N.length>0&&tc(G,N,T,O),be&&ge.render(T),ec(f,T,O);C!==null&&P===0&&(ve.updateMultisampleRenderTarget(C),ve.updateRenderTargetMipmap(C)),T.isScene===!0&&T.onAfterRender(v,T,O),de.resetDefaultState(),S=-1,M=null,y.pop(),y.length>0?(p=y[y.length-1],Ke===!0&&le.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?f=b[b.length-1]:f=null};function So(T,O,z,G){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||$e.intersectsSprite(T)){G&&Pe.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Q);let re=F.update(T),_e=T.material;_e.visible&&f.push(T,re,_e,z,Pe.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||$e.intersectsObject(T))){let re=F.update(T),_e=T.material;if(G&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Pe.copy(T.boundingSphere.center)):(re.boundingSphere===null&&re.computeBoundingSphere(),Pe.copy(re.boundingSphere.center)),Pe.applyMatrix4(T.matrixWorld).applyMatrix4(Q)),Array.isArray(_e)){let ye=re.groups;for(let xe=0,Ne=ye.length;xe<Ne;xe++){let Fe=ye[xe],Oe=_e[Fe.materialIndex];Oe&&Oe.visible&&f.push(T,re,Oe,z,Pe.z,Fe)}}else _e.visible&&f.push(T,re,_e,z,Pe.z,null)}}let N=T.children;for(let re=0,_e=N.length;re<_e;re++)So(N[re],O,z,G)}function ec(T,O,z,G){let N=T.opaque,re=T.transmissive,_e=T.transparent;p.setupLightsView(z),Ke===!0&&le.setGlobalState(v.clippingPlanes,z),G&&Y.viewport(L.copy(G)),N.length>0&&Ys(N,O,z),re.length>0&&Ys(re,O,z),_e.length>0&&Ys(_e,O,z),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function tc(T,O,z,G){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new li(1,1,{generateMipmaps:!0,type:ee.has("EXT_color_buffer_half_float")||ee.has("EXT_color_buffer_float")?jr:ii,minFilter:Vi,samples:4,stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));let N=p.state.transmissionRenderTarget[G.id],re=G.viewport||L;N.setSize(re.z*v.transmissionResolutionScale,re.w*v.transmissionResolutionScale);let _e=v.getRenderTarget(),ye=v.getActiveCubeFace(),xe=v.getActiveMipmapLevel();v.setRenderTarget(N),v.getClearColor(H),W=v.getClearAlpha(),W<1&&v.setClearColor(16777215,.5),v.clear(),be&&ge.render(z);let Ne=v.toneMapping;v.toneMapping=wi;let Fe=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),Ke===!0&&le.setGlobalState(v.clippingPlanes,G),Ys(T,z,G),ve.updateMultisampleRenderTarget(N),ve.updateRenderTargetMipmap(N),ee.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let Ze=0,rt=O.length;Ze<rt;Ze++){let nt=O[Ze],lt=nt.object,st=nt.geometry,Ae=nt.material,_t=nt.group;if(Ae.side===Bt&&lt.layers.test(G.layers)){let fi=Ae.side;Ae.side=At,Ae.needsUpdate=!0,ic(lt,z,G,st,Ae,_t),Ae.side=fi,Ae.needsUpdate=!0,Oe=!0}}Oe===!0&&(ve.updateMultisampleRenderTarget(N),ve.updateRenderTargetMipmap(N))}v.setRenderTarget(_e,ye,xe),v.setClearColor(H,W),Fe!==void 0&&(G.viewport=Fe),v.toneMapping=Ne}function Ys(T,O,z){let G=O.isScene===!0?O.overrideMaterial:null;for(let N=0,re=T.length;N<re;N++){let _e=T[N],ye=_e.object,xe=_e.geometry,Ne=_e.group,Fe=_e.material;Fe.allowOverride===!0&&G!==null&&(Fe=G),ye.layers.test(z.layers)&&ic(ye,O,z,xe,Fe,Ne)}}function ic(T,O,z,G,N,re){T.onBeforeRender(v,O,z,G,N,re),T.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),N.onBeforeRender(v,O,z,G,T,re),N.transparent===!0&&N.side===Bt&&N.forceSinglePass===!1?(N.side=At,N.needsUpdate=!0,v.renderBufferDirect(z,O,G,N,T,re),N.side=bi,N.needsUpdate=!0,v.renderBufferDirect(z,O,G,N,T,re),N.side=Bt):v.renderBufferDirect(z,O,G,N,T,re),T.onAfterRender(v,O,z,G,N,re)}function Zs(T,O,z){O.isScene!==!0&&(O=Re);let G=ie.get(T),N=p.state.lights,re=p.state.shadowsArray,_e=N.state.version,ye=X.getParameters(T,N.state,re,O,z),xe=X.getProgramCacheKey(ye),Ne=G.programs;G.environment=T.isMeshStandardMaterial?O.environment:null,G.fog=O.fog,G.envMap=(T.isMeshStandardMaterial?Be:He).get(T.envMap||G.environment),G.envMapRotation=G.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,Ne===void 0&&(T.addEventListener("dispose",J),Ne=new Map,G.programs=Ne);let Fe=Ne.get(xe);if(Fe!==void 0){if(G.currentProgram===Fe&&G.lightsStateVersion===_e)return sc(T,ye),Fe}else ye.uniforms=X.getUniforms(T),T.onBeforeCompile(ye,v),Fe=X.acquireProgram(ye,xe),Ne.set(xe,Fe),G.uniforms=ye.uniforms;let Oe=G.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Oe.clippingPlanes=le.uniform),sc(T,ye),G.needsLights=fu(T),G.lightsStateVersion=_e,G.needsLights&&(Oe.ambientLightColor.value=N.state.ambient,Oe.lightProbe.value=N.state.probe,Oe.directionalLights.value=N.state.directional,Oe.directionalLightShadows.value=N.state.directionalShadow,Oe.spotLights.value=N.state.spot,Oe.spotLightShadows.value=N.state.spotShadow,Oe.rectAreaLights.value=N.state.rectArea,Oe.ltc_1.value=N.state.rectAreaLTC1,Oe.ltc_2.value=N.state.rectAreaLTC2,Oe.pointLights.value=N.state.point,Oe.pointLightShadows.value=N.state.pointShadow,Oe.hemisphereLights.value=N.state.hemi,Oe.directionalShadowMap.value=N.state.directionalShadowMap,Oe.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Oe.spotShadowMap.value=N.state.spotShadowMap,Oe.spotLightMatrix.value=N.state.spotLightMatrix,Oe.spotLightMap.value=N.state.spotLightMap,Oe.pointShadowMap.value=N.state.pointShadowMap,Oe.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Fe,G.uniformsList=null,Fe}function rc(T){if(T.uniformsList===null){let O=T.currentProgram.getUniforms();T.uniformsList=Kr.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function sc(T,O){let z=ie.get(T);z.outputColorSpace=O.outputColorSpace,z.batching=O.batching,z.batchingColor=O.batchingColor,z.instancing=O.instancing,z.instancingColor=O.instancingColor,z.instancingMorph=O.instancingMorph,z.skinning=O.skinning,z.morphTargets=O.morphTargets,z.morphNormals=O.morphNormals,z.morphColors=O.morphColors,z.morphTargetsCount=O.morphTargetsCount,z.numClippingPlanes=O.numClippingPlanes,z.numIntersection=O.numClipIntersection,z.vertexAlphas=O.vertexAlphas,z.vertexTangents=O.vertexTangents,z.toneMapping=O.toneMapping}function pu(T,O,z,G,N){O.isScene!==!0&&(O=Re),ve.resetTextureUnits();let re=O.fog,_e=G.isMeshStandardMaterial?O.environment:null,ye=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:er,xe=(G.isMeshStandardMaterial?Be:He).get(G.envMap||_e),Ne=G.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Fe=!!z.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Oe=!!z.morphAttributes.position,Ze=!!z.morphAttributes.normal,rt=!!z.morphAttributes.color,nt=wi;G.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(nt=v.toneMapping);let lt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,st=lt!==void 0?lt.length:0,Ae=ie.get(G),_t=p.state.lights;if(Ke===!0&&(q===!0||T!==M)){let vt=T===M&&G.id===S;le.setState(G,T,vt)}let fi=!1;G.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==_t.state.version||Ae.outputColorSpace!==ye||N.isBatchedMesh&&Ae.batching===!1||!N.isBatchedMesh&&Ae.batching===!0||N.isBatchedMesh&&Ae.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Ae.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Ae.instancing===!1||!N.isInstancedMesh&&Ae.instancing===!0||N.isSkinnedMesh&&Ae.skinning===!1||!N.isSkinnedMesh&&Ae.skinning===!0||N.isInstancedMesh&&Ae.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Ae.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Ae.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Ae.instancingMorph===!1&&N.morphTexture!==null||Ae.envMap!==xe||G.fog===!0&&Ae.fog!==re||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==le.numPlanes||Ae.numIntersection!==le.numIntersection)||Ae.vertexAlphas!==Ne||Ae.vertexTangents!==Fe||Ae.morphTargets!==Oe||Ae.morphNormals!==Ze||Ae.morphColors!==rt||Ae.toneMapping!==nt||Ae.morphTargetsCount!==st)&&(fi=!0):(fi=!0,Ae.__version=G.version);let jt=Ae.currentProgram;fi===!0&&(jt=Zs(G,O,N));let pr=!1,Pt=!1,es=!1,ct=jt.getUniforms(),zt=Ae.uniforms;if(Y.useProgram(jt.program)&&(pr=!0,Pt=!0,es=!0),G.id!==S&&(S=G.id,Pt=!0),pr||M!==T){Y.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ct.setValue(w,"projectionMatrix",T.projectionMatrix),ct.setValue(w,"viewMatrix",T.matrixWorldInverse);let vt=ct.map.cameraPosition;vt!==void 0&&vt.setValue(w,fe.setFromMatrixPosition(T.matrixWorld)),ce.logarithmicDepthBuffer&&ct.setValue(w,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ct.setValue(w,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,Pt=!0,es=!0)}if(N.isSkinnedMesh){ct.setOptional(w,N,"bindMatrix"),ct.setOptional(w,N,"bindMatrixInverse");let vt=N.skeleton;vt&&(vt.boneTexture===null&&vt.computeBoneTexture(),ct.setValue(w,"boneTexture",vt.boneTexture,ve))}N.isBatchedMesh&&(ct.setOptional(w,N,"batchingTexture"),ct.setValue(w,"batchingTexture",N._matricesTexture,ve),ct.setOptional(w,N,"batchingIdTexture"),ct.setValue(w,"batchingIdTexture",N._indirectTexture,ve),ct.setOptional(w,N,"batchingColorTexture"),N._colorsTexture!==null&&ct.setValue(w,"batchingColorTexture",N._colorsTexture,ve));let Gt=z.morphAttributes;if((Gt.position!==void 0||Gt.normal!==void 0||Gt.color!==void 0)&&ae.update(N,z,jt),(Pt||Ae.receiveShadow!==N.receiveShadow)&&(Ae.receiveShadow=N.receiveShadow,ct.setValue(w,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(zt.envMap.value=xe,zt.flipEnvMap.value=xe.isCubeTexture&&xe.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&O.environment!==null&&(zt.envMapIntensity.value=O.environmentIntensity),Pt&&(ct.setValue(w,"toneMappingExposure",v.toneMappingExposure),Ae.needsLights&&mu(zt,es),re&&G.fog===!0&&Z.refreshFogUniforms(zt,re),Z.refreshMaterialUniforms(zt,G,k,$,p.state.transmissionRenderTarget[T.id]),Kr.upload(w,rc(Ae),zt,ve)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Kr.upload(w,rc(Ae),zt,ve),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ct.setValue(w,"center",N.center),ct.setValue(w,"modelViewMatrix",N.modelViewMatrix),ct.setValue(w,"normalMatrix",N.normalMatrix),ct.setValue(w,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){let vt=G.uniformsGroups;for(let qt=0,bo=vt.length;qt<bo;qt++){let ji=vt[qt];je.update(ji,jt),je.bind(ji,jt)}}return jt}function mu(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function fu(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(T,O,z){let G=ie.get(T);G.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),ie.get(T.texture).__webglTexture=O,ie.get(T.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:z,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,O){let z=ie.get(T);z.__webglFramebuffer=O,z.__useDefaultFramebuffer=O===void 0};let gu=w.createFramebuffer();this.setRenderTarget=function(T,O=0,z=0){C=T,E=O,P=z;let G=!0,N=null,re=!1,_e=!1;if(T){let ye=ie.get(T);if(ye.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(w.FRAMEBUFFER,null),G=!1;else if(ye.__webglFramebuffer===void 0)ve.setupRenderTarget(T);else if(ye.__hasExternalTextures)ve.rebindTextures(T,ie.get(T.texture).__webglTexture,ie.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){let Fe=T.depthTexture;if(ye.__boundDepthTexture!==Fe){if(Fe!==null&&ie.has(Fe)&&(T.width!==Fe.image.width||T.height!==Fe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");ve.setupDepthRenderbuffer(T)}}let xe=T.texture;(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)&&(_e=!0);let Ne=ie.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ne[O])?N=Ne[O][z]:N=Ne[O],re=!0):T.samples>0&&ve.useMultisampledRTT(T)===!1?N=ie.get(T).__webglMultisampledFramebuffer:Array.isArray(Ne)?N=Ne[z]:N=Ne,L.copy(T.viewport),U.copy(T.scissor),B=T.scissorTest}else L.copy(Ie).multiplyScalar(k).floor(),U.copy(Le).multiplyScalar(k).floor(),B=Ye;if(z!==0&&(N=gu),Y.bindFramebuffer(w.FRAMEBUFFER,N)&&G&&Y.drawBuffers(T,N),Y.viewport(L),Y.scissor(U),Y.setScissorTest(B),re){let ye=ie.get(T.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_CUBE_MAP_POSITIVE_X+O,ye.__webglTexture,z)}else if(_e){let ye=O;for(let xe=0;xe<T.textures.length;xe++){let Ne=ie.get(T.textures[xe]);w.framebufferTextureLayer(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0+xe,Ne.__webglTexture,z,ye)}}else if(T!==null&&z!==0){let ye=ie.get(T.texture);w.framebufferTexture2D(w.FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,ye.__webglTexture,z)}S=-1},this.readRenderTargetPixels=function(T,O,z,G,N,re,_e,ye=0){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=ie.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(xe=xe[_e]),xe){Y.bindFramebuffer(w.FRAMEBUFFER,xe);try{let Ne=T.textures[ye],Fe=Ne.format,Oe=Ne.type;if(!ce.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ce.textureTypeReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-G&&z>=0&&z<=T.height-N&&(T.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+ye),w.readPixels(O,z,G,N,we.convert(Fe),we.convert(Oe),re))}finally{let Ne=C!==null?ie.get(C).__webglFramebuffer:null;Y.bindFramebuffer(w.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(T,O,z,G,N,re,_e,ye=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=ie.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(xe=xe[_e]),xe)if(O>=0&&O<=T.width-G&&z>=0&&z<=T.height-N){Y.bindFramebuffer(w.FRAMEBUFFER,xe);let Ne=T.textures[ye],Fe=Ne.format,Oe=Ne.type;if(!ce.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ce.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ze=w.createBuffer();w.bindBuffer(w.PIXEL_PACK_BUFFER,Ze),w.bufferData(w.PIXEL_PACK_BUFFER,re.byteLength,w.STREAM_READ),T.textures.length>1&&w.readBuffer(w.COLOR_ATTACHMENT0+ye),w.readPixels(O,z,G,N,we.convert(Fe),we.convert(Oe),0);let rt=C!==null?ie.get(C).__webglFramebuffer:null;Y.bindFramebuffer(w.FRAMEBUFFER,rt);let nt=w.fenceSync(w.SYNC_GPU_COMMANDS_COMPLETE,0);return w.flush(),await wh(w,nt,4),w.bindBuffer(w.PIXEL_PACK_BUFFER,Ze),w.getBufferSubData(w.PIXEL_PACK_BUFFER,0,re),w.deleteBuffer(Ze),w.deleteSync(nt),re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,O=null,z=0){let G=Math.pow(2,-z),N=Math.floor(T.image.width*G),re=Math.floor(T.image.height*G),_e=O!==null?O.x:0,ye=O!==null?O.y:0;ve.setTexture2D(T,0),w.copyTexSubImage2D(w.TEXTURE_2D,z,0,0,_e,ye,N,re),Y.unbindTexture()};let _u=w.createFramebuffer(),vu=w.createFramebuffer();this.copyTextureToTexture=function(T,O,z=null,G=null,N=0,re=null){re===null&&(N!==0?(Pr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),re=N,N=0):re=0);let _e,ye,xe,Ne,Fe,Oe,Ze,rt,nt,lt=T.isCompressedTexture?T.mipmaps[re]:T.image;if(z!==null)_e=z.max.x-z.min.x,ye=z.max.y-z.min.y,xe=z.isBox3?z.max.z-z.min.z:1,Ne=z.min.x,Fe=z.min.y,Oe=z.isBox3?z.min.z:0;else{let Gt=Math.pow(2,-N);_e=Math.floor(lt.width*Gt),ye=Math.floor(lt.height*Gt),T.isDataArrayTexture?xe=lt.depth:T.isData3DTexture?xe=Math.floor(lt.depth*Gt):xe=1,Ne=0,Fe=0,Oe=0}G!==null?(Ze=G.x,rt=G.y,nt=G.z):(Ze=0,rt=0,nt=0);let st=we.convert(O.format),Ae=we.convert(O.type),_t;O.isData3DTexture?(ve.setTexture3D(O,0),_t=w.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(ve.setTexture2DArray(O,0),_t=w.TEXTURE_2D_ARRAY):(ve.setTexture2D(O,0),_t=w.TEXTURE_2D),w.pixelStorei(w.UNPACK_FLIP_Y_WEBGL,O.flipY),w.pixelStorei(w.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),w.pixelStorei(w.UNPACK_ALIGNMENT,O.unpackAlignment);let fi=w.getParameter(w.UNPACK_ROW_LENGTH),jt=w.getParameter(w.UNPACK_IMAGE_HEIGHT),pr=w.getParameter(w.UNPACK_SKIP_PIXELS),Pt=w.getParameter(w.UNPACK_SKIP_ROWS),es=w.getParameter(w.UNPACK_SKIP_IMAGES);w.pixelStorei(w.UNPACK_ROW_LENGTH,lt.width),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,lt.height),w.pixelStorei(w.UNPACK_SKIP_PIXELS,Ne),w.pixelStorei(w.UNPACK_SKIP_ROWS,Fe),w.pixelStorei(w.UNPACK_SKIP_IMAGES,Oe);let ct=T.isDataArrayTexture||T.isData3DTexture,zt=O.isDataArrayTexture||O.isData3DTexture;if(T.isDepthTexture){let Gt=ie.get(T),vt=ie.get(O),qt=ie.get(Gt.__renderTarget),bo=ie.get(vt.__renderTarget);Y.bindFramebuffer(w.READ_FRAMEBUFFER,qt.__webglFramebuffer),Y.bindFramebuffer(w.DRAW_FRAMEBUFFER,bo.__webglFramebuffer);for(let ji=0;ji<xe;ji++)ct&&(w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,ie.get(T).__webglTexture,N,Oe+ji),w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,ie.get(O).__webglTexture,re,nt+ji)),w.blitFramebuffer(Ne,Fe,_e,ye,Ze,rt,_e,ye,w.DEPTH_BUFFER_BIT,w.NEAREST);Y.bindFramebuffer(w.READ_FRAMEBUFFER,null),Y.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else if(N!==0||T.isRenderTargetTexture||ie.has(T)){let Gt=ie.get(T),vt=ie.get(O);Y.bindFramebuffer(w.READ_FRAMEBUFFER,_u),Y.bindFramebuffer(w.DRAW_FRAMEBUFFER,vu);for(let qt=0;qt<xe;qt++)ct?w.framebufferTextureLayer(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,Gt.__webglTexture,N,Oe+qt):w.framebufferTexture2D(w.READ_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,Gt.__webglTexture,N),zt?w.framebufferTextureLayer(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,vt.__webglTexture,re,nt+qt):w.framebufferTexture2D(w.DRAW_FRAMEBUFFER,w.COLOR_ATTACHMENT0,w.TEXTURE_2D,vt.__webglTexture,re),N!==0?w.blitFramebuffer(Ne,Fe,_e,ye,Ze,rt,_e,ye,w.COLOR_BUFFER_BIT,w.NEAREST):zt?w.copyTexSubImage3D(_t,re,Ze,rt,nt+qt,Ne,Fe,_e,ye):w.copyTexSubImage2D(_t,re,Ze,rt,Ne,Fe,_e,ye);Y.bindFramebuffer(w.READ_FRAMEBUFFER,null),Y.bindFramebuffer(w.DRAW_FRAMEBUFFER,null)}else zt?T.isDataTexture||T.isData3DTexture?w.texSubImage3D(_t,re,Ze,rt,nt,_e,ye,xe,st,Ae,lt.data):O.isCompressedArrayTexture?w.compressedTexSubImage3D(_t,re,Ze,rt,nt,_e,ye,xe,st,lt.data):w.texSubImage3D(_t,re,Ze,rt,nt,_e,ye,xe,st,Ae,lt):T.isDataTexture?w.texSubImage2D(w.TEXTURE_2D,re,Ze,rt,_e,ye,st,Ae,lt.data):T.isCompressedTexture?w.compressedTexSubImage2D(w.TEXTURE_2D,re,Ze,rt,lt.width,lt.height,st,lt.data):w.texSubImage2D(w.TEXTURE_2D,re,Ze,rt,_e,ye,st,Ae,lt);w.pixelStorei(w.UNPACK_ROW_LENGTH,fi),w.pixelStorei(w.UNPACK_IMAGE_HEIGHT,jt),w.pixelStorei(w.UNPACK_SKIP_PIXELS,pr),w.pixelStorei(w.UNPACK_SKIP_ROWS,Pt),w.pixelStorei(w.UNPACK_SKIP_IMAGES,es),re===0&&O.generateMipmaps&&w.generateMipmap(_t),Y.unbindTexture()},this.initRenderTarget=function(T){ie.get(T).__webglFramebuffer===void 0&&ve.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?ve.setTextureCube(T,0):T.isData3DTexture?ve.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?ve.setTexture2DArray(T,0):ve.setTexture2D(T,0),Y.unbindTexture()},this.resetState=function(){E=0,P=0,C=null,Y.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}};var lu={type:"change"},$l={type:"start"},hu={type:"end"},_o=new ci,cu=new Ht,__=Math.cos(70*Cl.DEG2RAD),ft=new A,It=2*Math.PI,tt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Kl=1e-6,vo=class extends Gs{constructor(e,t=null){super(e,t),this.state=tt.NONE,this.target=new A,this.cursor=new A,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ki.ROTATE,MIDDLE:ki.DOLLY,RIGHT:ki.PAN},this.touches={ONE:Hi.ROTATE,TWO:Hi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new A,this._lastQuaternion=new Ct,this._lastTargetPosition=new A,this._quat=new Ct().setFromUnitVectors(e.up,new A(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Wr,this._sphericalDelta=new Wr,this._scale=1,this._panOffset=new A,this._rotateStart=new K,this._rotateEnd=new K,this._rotateDelta=new K,this._panStart=new K,this._panEnd=new K,this._panDelta=new K,this._dollyStart=new K,this._dollyEnd=new K,this._dollyDelta=new K,this._dollyDirection=new A,this._mouse=new K,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=y_.bind(this),this._onPointerDown=v_.bind(this),this._onPointerUp=x_.bind(this),this._onContextMenu=A_.bind(this),this._onMouseWheel=b_.bind(this),this._onKeyDown=T_.bind(this),this._onTouchStart=E_.bind(this),this._onTouchMove=w_.bind(this),this._onMouseDown=M_.bind(this),this._onMouseMove=S_.bind(this),this._interceptControlDown=R_.bind(this),this._interceptControlUp=C_.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(lu),this.update(),this.state=tt.NONE}update(e=null){let t=this.object.position;ft.copy(t).sub(this.target),ft.applyQuaternion(this._quat),this._spherical.setFromVector3(ft),this.autoRotate&&this.state===tt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=It:i>Math.PI&&(i-=It),s<-Math.PI?s+=It:s>Math.PI&&(s-=It),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let n=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),n=a!=this._spherical.radius}if(ft.setFromSpherical(this._spherical),ft.applyQuaternion(this._quatInverse),t.copy(this.target).add(ft),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){let o=ft.length();a=this._clampDistance(o*this._scale);let l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),n=!!l}else if(this.object.isOrthographicCamera){let o=new A(this._mouse.x,this._mouse.y,0);o.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),n=l!==this.object.zoom;let c=new A(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=ft.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(_o.origin.copy(this.object.position),_o.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(_o.direction))<__?this.object.lookAt(this.target):(cu.setFromNormalAndCoplanarPoint(this.object.up,this.target),_o.intersectPlane(cu,this.target))))}else if(this.object.isOrthographicCamera){let a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),n=!0)}return this._scale=1,this._performCursorZoom=!1,n||this._lastPosition.distanceToSquared(this.object.position)>Kl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Kl||this._lastTargetPosition.distanceToSquared(this.target)>Kl?(this.dispatchEvent(lu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?It/60*this.autoRotateSpeed*e:It/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){ft.setFromMatrixColumn(t,0),ft.multiplyScalar(-e),this._panOffset.add(ft)}_panUp(e,t){this.screenSpacePanning===!0?ft.setFromMatrixColumn(t,1):(ft.setFromMatrixColumn(t,0),ft.crossVectors(this.object.up,ft)),ft.multiplyScalar(e),this._panOffset.add(ft)}_pan(e,t){let i=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;ft.copy(s).sub(this.target);let n=ft.length();n*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*n/i.clientHeight,this.object.matrix),this._panUp(2*t*n/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let i=this.domElement.getBoundingClientRect(),s=e-i.left,n=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(n/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(It*this._rotateDelta.x/t.clientHeight),this._rotateUp(It*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-It*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,n=Math.sqrt(i*i+s*s);this._dollyStart.set(0,n)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),n=.5*(e.pageY+i.y);this._rotateEnd.set(s,n)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(It*this._rotateDelta.x/t.clientHeight),this._rotateUp(It*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,n=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,n),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new K,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}};function v_(r){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(r.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(r)&&(this._addPointer(r),r.pointerType==="touch"?this._onTouchStart(r):this._onMouseDown(r)))}function y_(r){this.enabled!==!1&&(r.pointerType==="touch"?this._onTouchMove(r):this._onMouseMove(r))}function x_(r){switch(this._removePointer(r),this._pointers.length){case 0:this.domElement.releasePointerCapture(r.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(hu),this.state=tt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function M_(r){let e;switch(r.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ki.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(r),this.state=tt.DOLLY;break;case ki.ROTATE:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=tt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=tt.ROTATE}break;case ki.PAN:if(r.ctrlKey||r.metaKey||r.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(r),this.state=tt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(r),this.state=tt.PAN}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent($l)}function S_(r){switch(this.state){case tt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(r);break;case tt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(r);break;case tt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(r);break}}function b_(r){this.enabled===!1||this.enableZoom===!1||this.state!==tt.NONE||(r.preventDefault(),this.dispatchEvent($l),this._handleMouseWheel(this._customWheelEvent(r)),this.dispatchEvent(hu))}function T_(r){this.enabled!==!1&&this._handleKeyDown(r)}function E_(r){switch(this._trackPointer(r),this._pointers.length){case 1:switch(this.touches.ONE){case Hi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(r),this.state=tt.TOUCH_ROTATE;break;case Hi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(r),this.state=tt.TOUCH_PAN;break;default:this.state=tt.NONE}break;case 2:switch(this.touches.TWO){case Hi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(r),this.state=tt.TOUCH_DOLLY_PAN;break;case Hi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(r),this.state=tt.TOUCH_DOLLY_ROTATE;break;default:this.state=tt.NONE}break;default:this.state=tt.NONE}this.state!==tt.NONE&&this.dispatchEvent($l)}function w_(r){switch(this._trackPointer(r),this.state){case tt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(r),this.update();break;case tt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(r),this.update();break;case tt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(r),this.update();break;case tt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(r),this.update();break;default:this.state=tt.NONE}}function A_(r){this.enabled!==!1&&r.preventDefault()}function R_(r){r.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function C_(r){r.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var uu=["#e85d5d","#5e6ad2","#29a9a0","#b05ac8","#db8e2f","#35a66f","#74859b"],dr={bg:16514044,base:5660782,detectBg:11712706,remaining:8423830,overlay:8141549,mesh:1483594},Qr={base:3,shape:3,highlighted:4,remaining:2},I_=85e4,P_=75e4,yo=null;function L_(){if(yo)return yo;let r=document.createElement("canvas");r.width=r.height=32;let e=r.getContext("2d"),t=e.createRadialGradient(16,16,1,16,16,15);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.45,"rgba(255,255,255,0.95)"),t.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=t,e.fillRect(0,0,32,32),yo=new Ms(r),yo}function D_(r,e){if(e<=I_)return r;let t=Math.floor(e/P_),i=Math.floor(e/t),s=new Float32Array(i*3);for(let n=0;n<i;n++){let a=n*t*3;s[n*3]=r[a],s[n*3+1]=r[a+1],s[n*3+2]=r[a+2]}return s}function du(r,{onPick:e}={}){let t=new fo({antialias:!0,alpha:!1,preserveDrawingBuffer:!1});t.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),t.setClearColor(dr.bg,1),r.appendChild(t.domElement),t.domElement.classList.add("cf-canvas");let i=new vs;i.add(new Bs(16777215,1.35));let s=new Vr(16777215,1.6);s.position.set(1.2,-1.6,1.4),i.add(s);let n=new Vr(16777215,.55);n.position.set(-1.4,1.1,-.8),i.add(n);let a=new bt(50,1,.01,100);a.up.set(0,0,1),a.position.set(3,-4,2.6);let o=new vo(a,t.domElement);o.enableDamping=!0,o.dampingFactor=.12,o.rotateSpeed=.9;let l={disposed:!1,visible:!0,width:0,height:0},c=()=>{let y=r.clientWidth,v=r.clientHeight;return!y||!v?!1:(l.width=y,l.height=v,a.aspect=y/v,a.updateProjectionMatrix(),t.setSize(y,v,!1),!0)},h=new ResizeObserver(c);h.observe(r),c();let d=()=>{l.disposed||(l.visible&&(o.update(),t.render(i,a)),t.setAnimationLoop(d))};t.setAnimationLoop(d);let m=null,u=null,g=(y,v)=>{m=y,u=v??null},_=y=>{let v=y??m;if(!v)return;let R=new Ot(new A(v.min[0],v.min[1],v.min[2]),new A(v.max[0],v.max[1],v.max[2])),E=R.getCenter(new A),P=R.getSize(new A),C=Math.max(P.x,P.y,P.z,.001),S=new A(-.58,-.52,.63).normalize(),M=[];for(let H of[R.min.x,R.max.x])for(let W of[R.min.y,R.max.y])for(let V of[R.min.z,R.max.z])M.push(new A(H,W,V));let L=.86,U=C*2,B=new A;for(let H=0;H<8;H++){a.position.copy(E).addScaledVector(S,U),a.lookAt(E),a.near=C*.001,a.far=Math.max(C*40,U+C*3),a.updateMatrixWorld(!0),a.updateProjectionMatrix();let W=0;for(let se of M)B.copy(se).project(a),!(!Number.isFinite(B.x)||!Number.isFinite(B.y))&&(W=Math.max(W,Math.abs(B.x),Math.abs(B.y)));let V=0;if(u&&u.length>=9){let se=Math.floor(u.length/3),pe=Math.max(1,Math.ceil(se/2e4));for(let Ie=0;Ie<se;Ie+=pe){let Le=Ie*3;if(B.set(u[Le],u[Le+1],u[Le+2]).project(a),!Number.isFinite(B.x)||!Number.isFinite(B.y))continue;let Ye=Math.abs(B.x),$e=Math.abs(B.y);Ye>V&&(V=Ye),$e>V&&(V=$e)}}let $=V>0?V:W;if(!($>0))break;let k=Math.min(C*20,Math.max(C*.2,U*($/L)));if(Math.abs(k-U)/U<.004){U=k;break}U=k}a.position.copy(E).addScaledVector(S,U),a.lookAt(E),o.target.copy(E),o.minDistance=C*.05,o.maxDistance=C*30,a.updateProjectionMatrix(),o.update()},f=y=>{if(!y)return;let v=new A(y.max[0]-y.min[0],y.max[1]-y.min[1],y.max[2]-y.min[2]),R=new A((y.min[0]+y.max[0])/2,(y.min[1]+y.max[1])/2,(y.min[2]+y.max[2])/2),E=Math.max(v.x,v.y,v.z,.001),P=new A().subVectors(a.position,o.target).normalize();P.lengthSq()<1e-6&&P.set(-.5,-1,.45).normalize();let C=E*2.6;a.position.copy(R).addScaledVector(P,C),o.target.copy(R),o.minDistance=E*.05,o.maxDistance=E*30,a.updateProjectionMatrix(),o.update()},p=(y,v,R)=>{let E=new A(...v),P=new A(...y).normalize().multiplyScalar(-1);a.position.copy(E).addScaledVector(P,(R??1)*2.2),o.target.copy(E),o.update()};if(e){let y=new zs,v=new K,R=t.domElement,E=null,P=(C,S)=>(C.clientX-S.x)**2+(C.clientY-S.y)**2>25;R.addEventListener("pointerdown",C=>{E=C.isPrimary&&C.button===0&&C.buttons===1?{pointerId:C.pointerId,x:C.clientX,y:C.clientY,dragged:!1,ended:!1}:null}),R.addEventListener("pointermove",C=>{E?.pointerId!==C.pointerId||E.ended||(P(C,E)||C.buttons!==1)&&(E.dragged=!0)}),R.addEventListener("pointerup",C=>{E?.pointerId===C.pointerId&&(E.dragged||=P(C,E)||C.button!==0,E.ended=!0)}),R.addEventListener("pointercancel",()=>{E=null}),R.addEventListener("wheel",()=>{E=null},{passive:!0}),t.domElement.addEventListener("click",C=>{let S=E;if(E=null,!S?.ended||S.dragged||C.button!==0||!l.visible||!l.width)return;let M=t.domElement.getBoundingClientRect();v.x=(C.clientX-M.left)/M.width*2-1,v.y=-((C.clientY-M.top)/M.height)*2+1,y.setFromCamera(v,a),e(y,C)})}return{renderer:t,scene:i,camera:a,controls:o,resize:c,fit:_,focus:f,faceNormal:p,setBounds:g,dispose:()=>{l.disposed=!0,t.setAnimationLoop(null),h.disconnect(),o.dispose(),t.dispose(),t.domElement.parentNode===r&&r.removeChild(t.domElement)},set visible(y){l.visible=y},get visible(){return l.visible},get size(){return{w:l.width,h:l.height}}}}function xo({color:r,size:e,opacity:t,depthTest:i=!0}){return new Fr({color:new ke(r),size:e,sizeAttenuation:!1,map:L_(),alphaTest:.04,transparent:!0,opacity:t,depthTest:i,depthWrite:i,vertexColors:!1})}function Mo(r,e,t){let i=Math.floor(r.length/3)*3,s=i===r.length?r:r.subarray(0,i),n=new it;n.setAttribute("position",new Tt(D_(s,s.length/3),3));let a=new xs(n,e);return a.renderOrder=t,a.frustumCulled=!1,a}function Jx(r,{onPickShape:e}={}){let t=du(r,{onPick:e?(u,g)=>e(u,g,m):null}),i=new Kt;t.scene.add(i);let s=null,n=null,a=[],o=new Kt;i.add(o);let l={box:new Ti(1,1,1),cylinder:new zi(.5,.5,1,32,1,!0),sphere:new kr(.5,24,16)},c="detect",h=null,d=!1,m={stage:t,setBounds(u,g){t.setBounds(u,g)},fit(){t.fit()},setBase(u,g){s&&(i.remove(s),s.geometry.dispose()),s=Mo(u,xo({color:dr.base,size:Qr.base,opacity:1}),0),i.add(s),t.setBounds(g,u),m.applyMode()},setRemaining(u){n&&(i.remove(n),n.geometry.dispose()),!u||u.length===0?n=null:(n=Mo(u,xo({color:dr.remaining,size:Qr.remaining,opacity:.9}),1e3),i.add(n)),m.applyMode()},setShapes(u){for(let g of a)i.remove(g.points),g.points.geometry.dispose(),g.material.dispose();a.length=0;for(let{prim:g,positions:_}of u??[]){if(!_||_.length===0)continue;let f=xo({color:new ke(uu[g.id%uu.length]).getHex(),size:Qr.shape,opacity:1}),p=Mo(_,f,2+g.id);i.add(p),a.push({id:g.id,points:p,material:f,prim:g})}m.buildOverlay(u??[]),m.applyMode()},setMode(u){c=u,m.applyMode()},setOverlayVisible(u){d=u,o.visible=u},get mode(){return c},highlight(u){h=u,m.applyMode()},get highlighted(){return h},applyMode(){let u=c!=="inliers"&&c!=="remaining";s&&(s.visible=u,s.material.opacity=c==="detect"?.45:1),n&&(n.visible=c==="remaining"||c==="detect");let g=c!=="raw"&&c!=="remaining";for(let _ of a)_.points.visible=g,g&&(h===null?(_.material.opacity=1,_.material.size=Qr.shape,_.material.depthTest=!0,_.points.renderOrder=2+_.id):h===_.id?(_.material.opacity=1,_.material.size=Qr.highlighted,_.material.depthTest=!1,_.points.renderOrder=900):(_.material.opacity=.18,_.material.size=Qr.shape,_.material.depthTest=!0,_.points.renderOrder=2+_.id));for(let _ of o.children){if(!d){_.visible=!1;continue}let f=_.userData.shapeId,p=h!==null&&f===h;_.visible=h===null?_.userData.unit!=="frustum":p,_.material.opacity=p?.34:_.userData.unit==="bbox"?.05:.06,_.renderOrder=p?950:500+f}},buildOverlay(u){for(;o.children.length;){let g=o.children.pop();g.geometry?.dispose?.(),g.material?.dispose?.()}for(let{prim:g}of u??[]){let _=g.unit==="frustum"?new zi(g.radii[1],g.radii[0],1,32,1,!0):l[g.unit];if(!_)continue;let f=new xt(_,new tr({color:dr.overlay,transparent:!0,opacity:g.unit==="bbox"?.06:.14,side:Bt,depthWrite:!1}));f.position.fromArray(g.position),f.quaternion.fromArray(g.quaternion),f.scale.fromArray(g.scale),f.renderOrder=500+g.id,f.userData.shapeId=g.id,f.userData.unit=g.unit,o.add(f)}o.visible=d},focusShape(u){let g=a.find(f=>f.id===u);if(!g)return;g.points.geometry.computeBoundingBox();let _=g.points.geometry.boundingBox;t.focus({min:[_.min.x,_.min.y,_.min.z],max:[_.max.x,_.max.y,_.max.z]})},faceShape(u){let g=a.find(f=>f.id===u);if(!g)return;let _=g.prim.coefficients;if(g.prim.type==="Plane"&&_.length>=4){let f=g.points.geometry.boundingBox,p=Math.max(f.max.x-f.min.x,f.max.y-f.min.y,f.max.z-f.min.z);t.faceNormal([_[0],_[1],_[2]],[(f.min.x+f.max.x)/2,(f.min.y+f.max.y)/2,(f.min.z+f.max.z)/2],p)}},pickShapeId(u){let g=u.intersectObjects(o.visible?o.children.filter(p=>p.visible):[],!1);if(g.length)return g[0].object.userData.shapeId??null;let _=a.filter(p=>p.points.visible);if(!_.length)return null;let f=u.intersectObjects(_.map(p=>p.points),!1);if(f.length){let p=f[0].object;return _.find(b=>b.points===p)?.id??null}return null},dispose(){t.dispose()}};return m.applyMode(),m}function Kx(r){let e=du(r),t=new Kt;e.scene.add(t);let i=null,s=null,n=null,a=!1,o=l=>{l&&(t.remove(l),l.geometry?.dispose?.(),Array.isArray(l.material)?l.material.forEach(c=>c.dispose()):l.material?.dispose?.())};return{stage:e,set visible(l){e.visible=l},get visible(){return e.visible},setMesh(l,c,h){if(o(i),o(s),!l||c===0){i=null,s=null;return}let d=new it;d.setAttribute("position",new Tt(l,3)),d.computeVertexNormals(),e.setBounds(h),i=new xt(d,new Us({color:dr.mesh,transparent:!0,opacity:.55,side:Bt})),i.renderOrder=2,t.add(i),c<=2e4&&(s=new ys(new Hr(d),new Or({color:dr.mesh,transparent:!0,opacity:.5})),s.renderOrder=3,s.visible=a,t.add(s))},setWireframe(l){a=l,s&&(s.visible=l)},setCloudOverlay(l){if(o(n),!l||l.length===0){n=null;return}n=Mo(l,xo({color:dr.base,size:2,opacity:.55}),1),t.add(n)},fit(){e.fit()},dispose(){e.dispose()}}}export{uu as a,Jx as b,Kx as c};
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
