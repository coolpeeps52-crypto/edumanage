const STORAGE_KEY = "edumanage_students_v1";
const sampleStudents = [
  {id:1001,name:"Ayesha Khan",email:"ayesha@example.com",course:"Python",year:"1",status:"Active",created:Date.now()-86400000*2},
  {id:1002,name:"Ali Ahmed",email:"ali@example.com",course:"Web Development",year:"2",status:"Active",created:Date.now()-86400000},
  {id:1003,name:"Sara Malik",email:"sara@example.com",course:"Data Science",year:"1",status:"Inactive",created:Date.now()}
];
let students = loadStudents();

function loadStudents(){
  try { const saved=localStorage.getItem(STORAGE_KEY); return saved===null ? sampleStudents : JSON.parse(saved); }
  catch { return sampleStudents; }
}
function saveStudents(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(students)); }
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase();}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showToast(message){
  const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function goTo(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById("page-"+page).classList.add("active");
  document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  document.getElementById("pageCrumb").textContent=({dashboard:"Dashboard",students:"Students",add:document.getElementById("editId").value?"Edit Student":"Add Student",about:"About Project"})[page];
  document.getElementById("sidebar").classList.remove("open");
  if(page==="dashboard")renderDashboard();
  if(page==="students")renderStudents();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>goTo(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.go==="add")resetForm();goTo(b.dataset.go);}));
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("todayLabel").textContent=new Intl.DateTimeFormat("en",{weekday:"short",month:"short",day:"numeric"}).format(new Date());
document.getElementById("yearNow").textContent=new Date().getFullYear();

function studentRow(s,withActions=false){
  return `<tr><td><div class="student-cell"><span class="student-initial">${escapeHTML(initials(s.name))}</span><span><b>${escapeHTML(s.name)}</b><small>${escapeHTML(s.email)}</small></span></div></td><td>#${s.id}</td><td>${escapeHTML(s.course)}</td><td>Year ${escapeHTML(s.year)}</td><td><span class="status ${s.status.toLowerCase()}">${escapeHTML(s.status)}</span></td>${withActions?`<td><button class="action-btn" data-edit="${s.id}">Edit</button><button class="action-btn delete" data-delete="${s.id}">Delete</button></td>`:""}</tr>`;
}
function renderDashboard(){
  document.getElementById("totalCount").textContent=students.length;
  document.getElementById("activeCount").textContent=students.filter(s=>s.status==="Active").length;
  document.getElementById("inactiveCount").textContent=students.filter(s=>s.status==="Inactive").length;
  document.getElementById("courseCount").textContent=new Set(students.map(s=>s.course)).size;
  const recent=[...students].sort((a,b)=>b.created-a.created).slice(0,5);
  document.getElementById("recentBody").innerHTML=recent.map(s=>studentRow(s)).join("");
  document.getElementById("recentEmpty").hidden=students.length>0;
}
function renderStudents(){
  const q=document.getElementById("searchInput").value.trim().toLowerCase();
  const status=document.getElementById("statusFilter").value;
  const filtered=students.filter(s=>(status==="all"||s.status===status)&&[s.name,s.email,s.course,String(s.id)].some(v=>v.toLowerCase().includes(q)));
  document.getElementById("studentsBody").innerHTML=filtered.map(s=>studentRow(s,true)).join("");
  document.getElementById("studentsEmpty").hidden=filtered.length>0;
  document.getElementById("tableFooter").textContent=`Showing ${filtered.length} of ${students.length} student record(s)`;
}
document.getElementById("searchInput").addEventListener("input",renderStudents);
document.getElementById("statusFilter").addEventListener("change",renderStudents);

function resetForm(){
  document.getElementById("studentForm").reset();
  document.getElementById("editId").value="";
  document.getElementById("formTitle").textContent="Add New Student";
  document.getElementById("saveBtn").textContent="Save Student →";
  document.getElementById("formMessage").textContent="";
  document.getElementById("pageCrumb").textContent="Add Student";
}
function editStudent(id){
  const s=students.find(x=>x.id===id);if(!s)return;
  document.getElementById("editId").value=s.id;
  document.getElementById("studentName").value=s.name;
  document.getElementById("studentEmail").value=s.email;
  document.getElementById("studentCourse").value=s.course;
  document.getElementById("studentYear").value=s.year;
  document.getElementById("studentStatus").value=s.status;
  document.getElementById("formTitle").textContent="Edit Student";
  document.getElementById("saveBtn").textContent="Save Changes →";
  document.getElementById("formMessage").textContent="";
  goTo("add");
}
document.getElementById("studentsBody").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
  if(edit)editStudent(Number(edit.dataset.edit));
  if(del){
    const id=Number(del.dataset.delete),s=students.find(x=>x.id===id);
    if(s&&confirm(`Delete ${s.name}'s record? This cannot be undone.`)){
      students=students.filter(x=>x.id!==id);saveStudents();renderStudents();renderDashboard();showToast("Student record deleted.");
    }
  }
});
document.getElementById("studentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const idValue=document.getElementById("editId").value;
  const name=document.getElementById("studentName").value.trim();
  const email=document.getElementById("studentEmail").value.trim();
  const course=document.getElementById("studentCourse").value;
  const year=document.getElementById("studentYear").value;
  const status=document.getElementById("studentStatus").value;
  const duplicate=students.some(s=>s.email.toLowerCase()===email.toLowerCase()&&String(s.id)!==idValue);
  if(duplicate){showToast("This email is already registered.");return;}
  if(idValue){
    const i=students.findIndex(s=>s.id===Number(idValue));
    if(i>=0)students[i]={...students[i],name,email,course,year,status};
    showToast("Student record updated successfully.");
  }else{
    const id=students.length?Math.max(...students.map(s=>s.id))+1:1001;
    students.push({id,name,email,course,year,status,created:Date.now()});
    showToast("New student registered successfully.");
  }
  saveStudents();resetForm();renderDashboard();goTo("students");
});
document.getElementById("cancelBtn").addEventListener("click",()=>{resetForm();goTo("students");});
document.getElementById("exportBtn").addEventListener("click",()=>{
  const headers=["ID","Name","Email","Course","Year","Status"];
  const rows=students.map(s=>[s.id,s.name,s.email,s.course,s.year,s.status]);
  const csv=[headers,...rows].map(row=>row.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="edumanage_students.csv";a.click();URL.revokeObjectURL(url);
  showToast("CSV file downloaded.");
});
renderDashboard();
