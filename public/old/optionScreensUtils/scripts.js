const optsParent = document.getElementById("optsParent")
allOpts.forEach(str => {
  const a = document.createElement('a')
  const href = str.replaceAll(' ', '');

  a.innerText = str;
  a.href = href;
  a.classList.add("opt")

  optsParent.appendChild(a)
})

