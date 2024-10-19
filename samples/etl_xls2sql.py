import pyodbc
import pandas as pd
from sqlalchemy import create_engine

def record_exist(prj_id: str, sp_descript: str):
#    print(prj_id,sp_descript)
    qryRecordExist = f"""SELECT [id]
    FROM [p_wazi].[dbo].[jira_iris_sprint_planning]
    WHERE [projectid] = {prj_id} AND [description] = '{sp_descript}' """
#    print(qryRecordExist)
    cursor = conexao.cursor()	
    cursor.execute(qryRecordExist)
    row = cursor.fetchone() 
  #  while row:
 #       print (row[0]) 
#        row = cursor.fetchone()
    #print(row)
    if row == None: row = [0,]
    return  row[0]

dados_conexao = (
    "Driver={SQL Server};"
    "Server=10.110.10.220;"
    "Database=p_wazi;"
    "uid=wazi;"
    "pwd=yk$K_7#O"
)
conexao = pyodbc.connect(dados_conexao)
# ou
#connSqlServer = pyodbc.connect(driver='{SQL Server}',server='10.110.10.220',database='p_wazi',uid='wazi',pwd='yk$K_7#O')
print("Conexão bem sucedida !")


# Configurações do banco de dados
db_type = 'SQL Server' # 'mysql' ou 'postgresql', 'sqlite', etc.
user = 'wazi'
password = 'yk$K_7#O'
host = '10.110.10.220'
port = '1433'  # ou outra porta se necessário
database = 'p_wazi'
table_name = 'jira_iris_sprint_planning'

# Cria a conexão com o banco de dados
#engine = create_engine(f'{db_type}://{user}:{password}@{host}:{port}/{database}')

# Caminho para o arquivo Excel
file_path = './data/sprint_schedules.xlsx'
# Lê o arquivo Excel
df = pd.read_excel(file_path)
# ou Se o seu arquivo Excel contém várias planilhas e você deseja ler uma específica, você pode usar o parâmetro sheet_name
#df = pd.read_excel(file_path, sheet_name='Nome_da_Planilha')
# Ou, se você quiser ler a planilha por índice (por exemplo, a primeira planilha)
#df = pd.read_excel(file_path, sheet_name=0)

# Apresenta o conteúdo do DataFrame
#print(df)  # Exibe o DataFrame completo
# Alternativamente, você pode usar df.head() para exibir as primeiras 5 linhas
#print(df.head())
# Se quiser ver informações gerais sobre o DataFrame, como tipos de dados e contagem de valores não nulos
#print(df.info())

# Importa o DataFrame para a tabela SQL
#df.to_sql(table_name, con=engine, if_exists='replace', index=False)

# Seleciona as colunas relevantes (ID e o campo que deseja atualizar)
#colunas_desejadas = ['ID', 'CampoAtualizar']  # Substitua pelos nomes das suas colunas
#df_selecionado = df[colunas_desejadas]

# Conecta ao banco de dados e atualiza os registros
#with engine.connect() as connection:
 #   for index, row in df_selecionado.iterrows():
        # Comando SQL para atualizar o campo
  #      sql_update = f"""
   #     UPDATE {table_name}
    #    SET CampoAtualizar = '{row['CampoAtualizar']}'
     #   WHERE ID = {row['ID']}
      #  """
       # connection.execute(sql_update)

for index, row in df.iterrows():
    recordFound = record_exist(row['iProjectid'], row['tDescript'])
    if recordFound is any: recordFound = 0
#    print("ID Encontrado", recordFound)
    if recordFound <= 0:
        data2insert = f"""INSERT INTO [dbo].[jira_iris_sprint_planning] 
                    ([description],[pre_sprint_backlog_date],[scope_start_date],
                    [scope_approval_date],[refinement_date],[sprint_start_date],
                    [sprint_end_date],[sprint_review_date],[week_day],[business_days],
                    [holidays_days],[projectid]) 
                    VALUES ('{row['tDescript']}','{row['dPre_sprint_backlog_date']}','{row['dScope_start_date']}','{row['dScope_approval_date']}',
                    '{row['dRefinement_date']}','{row['dSprint_start_date']}','{row['dSprint_end_date']}','{row['dSprint_review_date']}',
                    '{row['tWeek_day']}',{row['iBusiness_days']},{row['iHolidays_days']},{row['iProjectid']})"""
        #print(data2insert)
        cursor_add = conexao.cursor()
        cursor_add.execute(data2insert)
        cursor_add.commit()
        cursor_add.close()
        print("Importação concluída com sucesso!")
    else:
        # Comando SQL para atualizar o campo
        sql_update = f"""
                UPDATE {table_name}
                SET [pre_sprint_backlog_date] = '{row['dPre_sprint_backlog_date']}',
                    [scope_start_date] = '{row['dScope_start_date']}',
                    [scope_approval_date] = '{row['dScope_approval_date']}',
                    [refinement_date] = '{row['dRefinement_date']}',
                    [sprint_start_date] = '{row['dSprint_start_date']}',
                    [sprint_end_date] = '{row['dSprint_end_date']}',
                    [sprint_review_date] = '{row['dSprint_review_date']}',
                    [week_day] = '{row['tWeek_day']}',
                    [business_days] = {row['iBusiness_days']},
                    [holidays_days] = {row['iHolidays_days']}
                WHERE ID = {recordFound}
                """ 
                #description+' (XLSX)' | substring(description,1,len(description)-7) | {row['tDescript']}
        conexao.execute(sql_update)
        conexao.commit()
        print("Modificação concluída com sucesso!")
        
# Comando SQL para excluir registro por ID
sql_update = f"""
        DELETE FROM {table_name}
        WHERE ID = 59 or ID = 60
        """
#conexao.execute(sql_update)
#conexao.commit()
#print("Exclusão concluída com sucesso!")

conexao.close()
