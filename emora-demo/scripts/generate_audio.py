"""Generate four original royalty-free instrumental loops for EMORA."""
import math, wave
from pathlib import Path
import numpy as np
ROOT=Path(__file__).resolve().parent.parent
SR=22050; DUR=24; N=SR*DUR
NOTES={'C':261.63,'D':293.66,'E':329.63,'F':349.23,'G':392.,'A':440.,'B':493.88}
CHORDS=[['C','E','G'],['A','C','E'],['F','A','C'],['G','B','D']]
def tone(freq,secs,kind):
 t=np.arange(int(SR*secs))/SR
 if kind=='bell': wave=np.sin(2*np.pi*freq*t)+.3*np.sin(2*np.pi*freq*2.99*t)+.16*np.sin(2*np.pi*freq*5.1*t); env=np.exp(-3.8*t/secs)
 elif kind=='piano':wave=np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*2*freq*t)+.08*np.sin(2*np.pi*3*freq*t);env=np.exp(-2.3*t/secs)
 elif kind=='string':wave=np.sin(2*np.pi*freq*t)+.25*np.sin(2*np.pi*freq*2.01*t);env=np.minimum(1,t/.35)*np.minimum(1,(secs-t)/.6)
 else:wave=np.sin(2*np.pi*freq*t)+.23*np.sin(2*np.pi*freq*.5*t);env=np.minimum(1,t/.35)*np.minimum(1,(secs-t)/.35)
 return wave*env
for name,kind,tempo in [('yulduz','bell',.5),('sokin','piano',.75),('quvonch','bell',.375),('va-da','string',.75)]:
 out=np.zeros(N,dtype=np.float64)
 for bar in range(4):
  start=bar*6; chord=CHORDS[(bar+(['yulduz','sokin','quvonch','va-da'].index(name)))%4]
  for note in chord:
   seg=tone(NOTES[note]/2,5.9,'pad' if kind!='string' else 'string')*.075
   a=int(start*SR);out[a:a+len(seg)]+=seg[:N-a]
  steps=int(6/tempo)
  for j in range(steps):
   note=chord[(j*2+bar)%3];freq=NOTES[note]*(2 if name=='quvonch' else 1)
   seg=tone(freq,min(tempo*1.8,1.2),kind)*(.085 if name!='va-da' else .05)
   a=int((start+j*tempo)*SR);out[a:a+len(seg)]+=seg[:N-a]
 if name=='quvonch':
  for j in range(int(DUR/.75)):
   a=int(j*.75*SR);seg=np.random.default_rng(j).normal(0,1,int(SR*.08))*np.exp(-np.linspace(0,7,int(SR*.08)))*.025;out[a:a+len(seg)]+=seg
 out*=np.minimum(1,np.arange(N)/(SR*.5))*np.minimum(1,(N-np.arange(N))/(SR*.7))
 out=np.clip(out*2.3,-.9,.9)
 wav=ROOT/'public'/'audio'/f'{name}.wav'
 with wave.open(str(wav),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((out*32767).astype('<i2').tobytes())
