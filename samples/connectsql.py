import pyodbc

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

tDescript="'Sprint 11'"
dPre_sprint_backlog_date="'2024-08-12'"
dScope_start_date="'2024-08-26'"
dScope_approval_date="'2024-09-12'"
dRefinement_date="'2024-09-25'"
dSprint_start_date="'2024-10-11'"
dSprint_end_date="'2024-10-24'"
dSprint_review_date="'2024-10-25'"
tWeek_day="'Friday'"
iBusiness_days=10
iHolidays_days=0
iProjectid=4
data2insert = f"""INSERT INTO [dbo].[jira_iris_sprint_planning] 
                ([description],[pre_sprint_backlog_date],[scope_start_date],
                [scope_approval_date],[refinement_date],[sprint_start_date],
                [sprint_end_date],[sprint_review_date],[week_day],[business_days],
                [holidays_days],[projectid]) 
                VALUES ({tDescript},{dPre_sprint_backlog_date},{dScope_start_date},{dScope_approval_date},
                {dRefinement_date},{dSprint_start_date},{dSprint_end_date},{dSprint_review_date},
                {tWeek_day},{iBusiness_days},{iHolidays_days},{iProjectid})"""
cursor_add = conexao.cursor()
cursor_add.execute(data2insert)
#cursor_add.commit()
print("Conexão bem sucedida !")

cursor = conexao.cursor()	
cursor.execute("""WITH Sprint_Planning as (
    SELECT [projectid],[id],[description],[pre_sprint_backlog_date],
    [scope_start_date],[scope_approval_date],[refinement_date],
    [sprint_start_date],[sprint_end_date],[sprint_review_date],
    [week_day],[business_days],[holidays_days] 
    FROM [p_wazi].[dbo].[jira_iris_sprint_planning]
    ) 
    SELECT * FROM Sprint_Planning WHERE id >= 29 ORDER BY id DESC
    """)
row = cursor.fetchone() 
while row:
    print (row) 
    row = cursor.fetchone()
cursor.close()
print("Consulta bem sucedida !")
conexao.close()