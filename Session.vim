let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Desktop/dev/webdev/keerat
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
if &shortmess =~ 'A'
  set shortmess=aoOA
else
  set shortmess=aoO
endif
badd +1 ~/Desktop/dev/webdev/keerat/to_mongo.js
badd +627 ~/Desktop/dev/webdev/keerat/app/Paath/TRACKS.js
badd +1 ~/Desktop/dev/webdev/keerat/app/Paath/page.js
badd +10 ~/Desktop/dev/webdev/keerat/app/page.js
badd +4 ~/Desktop/dev/webdev/keerat/components/OptionsPage.js
badd +23 ~/Desktop/dev/webdev/keerat/tsconfig.json
badd +0 health://
badd +18 ~/Desktop/dev/webdev/keerat/app/backend/getTracks.js
badd +15 a
badd +42 ~/Desktop/dev/webdev/keerat/components/ListenPage/index.js
badd +115 ~/Desktop/dev/webdev/keerat/utils/store.js
badd +233 ~/Desktop/dev/webdev/keerat/utils/helper_funcs.js
argglobal
%argdel
$argadd ./
tabnew +setlocal\ bufhidden=wipe
tabrewind
edit ~/Desktop/dev/webdev/keerat/to_mongo.js
argglobal
balt ~/Desktop/dev/webdev/keerat/app/Paath/page.js
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=
setlocal fdl=4
setlocal fml=1
setlocal fdn=20
setlocal fen
29
normal! zo
31
normal! zo
45
normal! zo
let s:l = 45 - ((39 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 45
normal! 033|
tabnext
edit ~/Desktop/dev/webdev/keerat/app/Paath/TRACKS.js
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 87 + 87) / 175)
exe 'vert 2resize ' . ((&columns * 87 + 87) / 175)
argglobal
balt ~/Desktop/dev/webdev/keerat/app/Paath/page.js
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
626
normal! zo
let s:l = 625 - ((37 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 625
normal! 07|
wincmd w
argglobal
if bufexists(fnamemodify("~/Desktop/dev/webdev/keerat/app/backend/getTracks.js", ":p")) | buffer ~/Desktop/dev/webdev/keerat/app/backend/getTracks.js | else | edit ~/Desktop/dev/webdev/keerat/app/backend/getTracks.js | endif
if &buftype ==# 'terminal'
  silent file ~/Desktop/dev/webdev/keerat/app/backend/getTracks.js
endif
balt ~/Desktop/dev/webdev/keerat/app/Paath/page.js
setlocal fdm=indent
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=
setlocal fdl=3
setlocal fml=1
setlocal fdn=20
setlocal fen
9
normal! zo
let s:l = 18 - ((15 * winheight(0) + 25) / 50)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 18
normal! 043|
wincmd w
exe 'vert 1resize ' . ((&columns * 87 + 87) / 175)
exe 'vert 2resize ' . ((&columns * 87 + 87) / 175)
tabnext 2
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
nohlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
