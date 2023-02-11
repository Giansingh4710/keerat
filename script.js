const optsParent = document.getElementById("optsParent")
allOpts.forEach(str=>{
  const div = document.createElement('div')
  const href = str.replaceAll(' ','');

  div.innerText = str;
  div.onclick = () => location.href = href ;
  div.classList.add("opt")

  optsParent.appendChild(div)
})
