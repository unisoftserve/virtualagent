(function(){
  const script=document.currentScript;
  const ENDPOINT=(script.getAttribute("data-endpoint")||"").replace(/\/+$/,"")+"/chat";
  const TITLE=script.getAttribute("data-title")||"Assistant";
  const WELCOME=script.getAttribute("data-welcome")||"Hi! Ask me anything about our service.";
  if(!ENDPOINT||ENDPOINT==="/chat"){console.error("chat-widget: data-endpoint required");return;}

  const style=document.createElement("style");
  style.textContent=`
    .vb-launch{position:fixed;right:18px;bottom:18px;z-index:99999;width:56px;height:56px;border-radius:999px;border:none;background:#0f172a;color:#fff;cursor:pointer;box-shadow:0 10px 24px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center;font-size:20px}
    .vb-win{position:fixed;right:18px;bottom:88px;z-index:99999;width:360px;height:520px;background:#fff;border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.2);display:none;overflow:hidden;border:1px solid rgba(2,6,23,.1)}
    .vb-head{background:#0f172a;color:#fff;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;font-weight:600}
    .vb-body{height:calc(100% - 104px);overflow:auto;padding:12px;background:#f8fafc}
    .vb-row{display:flex;margin:8px 0}
    .vb-msg{max-width:75%;padding:10px 12px;border-radius:12px;line-height:1.35;font-size:14px;background:#e2e8f0;color:#0f172a}
    .vb-row.user{justify-content:flex-end}.vb-row.user .vb-msg{background:#0f172a;color:#fff}
    .vb-input{display:flex;gap:8px;padding:10px;background:#fff;border-top:1px solid rgba(2,6,23,.08)}
    .vb-input input{flex:1;padding:10px 12px;border:1px solid rgba(2,6,23,.12);border-radius:10px;font:inherit}
    .vb-input button{padding:10px 14px;background:#0f172a;color:#fff;border:none;border-radius:10px;cursor:pointer}
    .vb-head button{background:transparent;border:none;color:#fff;cursor:pointer;font-size:18px}
    .vb-actions{display:flex;gap:8px;align-items:center}.vb-clear{background:#334155;color:#fff;border:none;border-radius:12px;padding:6px 10px;cursor:pointer;font-size:12px}`;
  document.head.appendChild(style);

  const launcher=document.createElement("button");launcher.className="vb-launch";launcher.innerHTML="💬";
  const win=document.createElement("div");win.className="vb-win";
  const head=document.createElement("div");head.className="vb-head";
  const actions=document.createElement("div");actions.className="vb-actions";
  const clearBtn=document.createElement("button");clearBtn.className="vb-clear";clearBtn.textContent="Clear";
  const closeBtn=document.createElement("button");closeBtn.setAttribute("aria-label","Close");closeBtn.textContent="×";
  actions.appendChild(clearBtn);actions.appendChild(closeBtn);
  head.append(document.createTextNode(TITLE),actions);

  const body=document.createElement("div");body.className="vb-body";
  const inputBar=document.createElement("div");inputBar.className="vb-input";
  const input=document.createElement("input");input.placeholder="Type your question...";
  const sendBtn=document.createElement("button");sendBtn.textContent="Send";
  inputBar.append(input,sendBtn);

  win.append(head,body,inputBar);document.body.append(launcher,win);
  function toggle(){win.style.display=(win.style.display==="block")?"none":"block";if(win.style.display==="block"){input.focus();}}
  launcher.addEventListener("click",toggle);closeBtn.addEventListener("click",toggle);

  const messages=[];
  function add(role,text){const row=document.createElement("div");row.className="vb-row "+(role==="user"?"user":"assistant");
    const msg=document.createElement("div");msg.className="vb-msg";msg.textContent=text;row.appendChild(msg);body.appendChild(row);body.scrollTop=body.scrollHeight;}
  function clear(){messages.length=0;body.innerHTML="";add("assistant",WELCOME);input.focus();}clearBtn.addEventListener("click",clear);

  async function send(){
    const text=(input.value||"").trim(); if(!text) return;
    input.value=""; input.disabled=true; sendBtn.disabled=true;
    add("user",text); messages.push({role:"user",content:text});
    try{
      const res=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages})});
      const data=await res.json();
      add("assistant", data.reply || "Sorry, I couldn't get a response.");
      messages.push({role:"assistant",content:data.reply || ""});
    }catch{ add("assistant","Network error. Please try again."); }
    finally{ input.disabled=false; sendBtn.disabled=false; input.focus(); }
  }
  sendBtn.addEventListener("click",send);
  input.addEventListener("keydown",e=>{ if(e.key==="Enter") send(); });

  add("assistant", WELCOME);
})();
