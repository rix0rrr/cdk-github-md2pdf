FROM pandoc/latex

# BusyBox!
RUN apk add --no-cache git bash

# Packages used by eisvogel
RUN tlmgr install mdframed needspace sourcesanspro sourcecodepro ly1 mweights titling framed

# Custom scripts
ADD eisvogel.tex /root/.pandoc/templates/eisvogel.latex
ADD md2pdf /usr/local/bin
