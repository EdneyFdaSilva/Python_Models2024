from fasthtml.common import FastHTML, serve

app = FastHTML()

@app.get("/")
def homepage():
    return "<h1>Bem vindo ao meu site com FastHTML</h1>"
serve()