BAIXE AS NOVAS DEPENDÊNCIA DO PROJETO
npm i --save-dev

# CONFIGURANDO PRETTIER

Vá para a guia "Extensions" (Extensões) no lado esquerdo da janela do VS Code.
Procure pela extensão "Prettier" e instale-a.
Abra a central de comando com Control + Shift + P.
Procure por "Format Document With". Ao pressionar Enter, será solicitado um formatter padrão. Escolha o prettier.
Pressione as teclas Command + '(aspas simples) para acessar o settings do vscode.
Procure na barra de pesquisa por: "Editor: Format on Save". Ative marcando a caixinha.

### PARA FORMATAR TODOS OS ARQUIVOS TS DO PROJETO MANUALMENTE, RODE NO TERMINAL (SÓ RODAR SE NECESSÁRIO, MAS GERALMENTE NÃO SERÁ)

prettier “\*/.ts” --write

---

# CONFIGURANDO ESLINT

### PARA CHECAR MANUALMENTE (OPCIONAL)

npx eslint .

### PARA CHECAR AUTOMATICAMENTE \*

Executar um script toda vez que você deseja fazer a verificação de código pode se tornar tedioso. Siga os passos abaixo para habilitar a verificação automática (linting) ao salvar no VS Code.

Vá para a guia "Extensions" (Extensões) no lado esquerdo da janela do VS Code.
Procure pela extensão "ESLint" e instale-a.
Uma vez que a extensão esteja instalada, abra as configurações do VS Code (File > Preferences > Settings ou pressione Ctrl +,).
No editor de configurações, procure por "code actions on save" (ações de código ao salvar).
Clique em "Edit in settings.json" (Editar em settings.json) e adicione as seguintes configurações ao arquivo settings.json.
json

### CODIGO PARA VISUAL CODE AUTO FIX ESLINT

{
"editor.codeActionsOnSave": {
"source.fixAll.eslint": true
},
"eslint.validate": ["javascript"],
"eslint.run": "onSave"
}

Isso habilitará a extensão ESLint para corrigir automaticamente o seu código sempre que você salvar.
