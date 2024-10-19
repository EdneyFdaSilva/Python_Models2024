from fasthtml.common import fast_app, serve, Titled, RedirectResponse
from componente import gerar_titulo, gerar_formulario, gerar_lista_tarefas

app, routes = fast_app()

lista_tarefas = []

@routes("/")
def homepage():
    formulario=gerar_formulario()
    Task_list_elem = gerar_lista_tarefas(lista_tarefas)
    return Titled("Lista de Tarefas",formulario, Task_list_elem)

@routes("/adicionar_tarefas", methods=["post"])
def add_task(tarefa: str):
    if tarefa:
        lista_tarefas.append(tarefa)
    return gerar_lista_tarefas(lista_tarefas)

@routes("/deletar/{idTarefa}")
def deletar(idTarefa: int):
    if len(lista_tarefas) > idTarefa:
        lista_tarefas.pop(idTarefa)
    return gerar_lista_tarefas(lista_tarefas)
    #return RedirectResponse(url="/", status_code=303)

@routes("/blog")
def homepage():
    return gerar_titulo("Bem vindo ao meu Blog sobre FastHTML","Agilidade Máxima aliada a facilidade usando Python")

serve()