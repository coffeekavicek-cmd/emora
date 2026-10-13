/* Native date/time inputs retain validation and picker behavior; empty values have visible localized hints. */
(()=>{'use strict';
const labels={ru:{date:'Выбрать дату',time:'Выбрать время'},uz:{date:'Sanani tanla',time:'Vaqtni tanla'},en:{date:'Choose a date',time:'Choose a time'}};
const fields=[];
document.querySelectorAll('input[type=date],input[type=time]').forEach(input=>{
 const wrap=document.createElement('div');wrap.className='emora-date-field';
 input.before(wrap);wrap.append(input);
 const hint=document.createElement('span');hint.className='emora-date-hint';hint.setAttribute('aria-hidden','true');wrap.append(hint);
 const update=()=>{const language=labels[document.documentElement.lang]||labels.ru;hint.textContent=language[input.type];wrap.classList.toggle('has-value',Boolean(input.value));};
 input.addEventListener('input',update);input.addEventListener('change',update);fields.push(update);update();
});
const refresh=()=>fields.forEach(update=>update());new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
window.addEventListener('message',event=>{if(event.origin===location.origin)setTimeout(refresh,0)});
})();
