from fasthtml.common import Div, H1, P, Form, Input, Button, Ul, Li, A

def gerar_titulo(titulo, subtitulo):
    return Div(
        H1(titulo),
        P(subtitulo),
        P("Este componente foi criado com FastHTML")
    )

def gerar_formulario():
    formulario = Form(
        Input(type="text",name="tarefa",placeholder="Insira a tarefa a ser adicionada"),
        Button("Enviar"),
        method="post",
        action="/adicionar_tarefas",
        hx_post="/adicionar_tarefas",
        hx_target = "#lista-tarefas",
        hx_swap="outerHTML"
    )
    return formulario

def gerar_lista_tarefas(lista_tarefas):
    itens_lista = [Li(tarefa, ' - ', A("Excluir", hx_get=f"/deletar/{i}", hx_target = "#lista-tarefas", hx_swap="outerHTML")) for i, tarefa in enumerate(lista_tarefas)]
    lista = Ul(
        *itens_lista, id="lista-tarefas"
    )
    return lista