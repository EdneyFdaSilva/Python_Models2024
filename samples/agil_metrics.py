import streamlit as st
import pandas as pd
import plotly.express as px

st.set_page_config(layout='wide')

# Caminho para o arquivo Excel
file_path = './data/Metricas do time agil - Sprint 7 IRIS 2024.xlsx'
# Lê o arquivo Excel
df = pd.read_excel(file_path)

df_filtered = df[df["IssueType"] == "Story"][['Sprints','Story Points']]
#df_filtered = df_filtered[['Sprints','Custom field (Story Points)']]
df_total_sprint = df_filtered.groupby(by=['Sprints']).sum('Story Points').sort_values(by='Sprints', ascending=True)
#df_total_sprint = df_total_sprint.drop("Parent id", axis=1) 
#df_total_sprint.columns
#df_filtered.columns
df_ttl = df_total_sprint
#df_ttl.index

df_story = df_filtered.groupby(by=['Sprints']).sum('Story Points')
df_story = df_story.rename(columns={"Story Points": "Quantidade"})
df_story['Issue Type'] = 'Story'
df_story.reset_index()
df_story = df_story.reset_index()
#df_story

df_bug = df[(df["IssueType"] == "Bug")][['Sprints','IssueType']]
df_bug_qty = df_bug.groupby(by=['Sprints'])['IssueType'].count()
df_bug = df[(df["IssueType"] == "Bug") | (df["IssueType"] == "Defect") | (df["IssueType"] == "Improvement")][['Sprints','IssueType']]
#df_bug = df[(df["IssueType"] == "Bug") | (df["IssueType"] == "Defect") | (df["IssueType"] == "Improvement")][['Sprints','IssueType']]
#df_bug_qty = df_bug_qty.set_index["Id"]
df_bug_qty = df_bug_qty.to_frame().reset_index()
df_bug_qty = df_bug_qty.rename(columns={'IssueType':'Quantidade'})
df_bug_qty['Issue Type'] = 'Bug'

df_defect = df[(df["IssueType"] == "Defect")][['Sprints','IssueType']]
df_defect_qty = df_defect.groupby(by=['Sprints'])['IssueType'].count()
df_defect_qty = df_defect_qty.to_frame().reset_index()
df_defect_qty = df_defect_qty.rename(columns={'IssueType':'Quantidade'})
df_defect_qty['Issue Type'] = 'Defect'

df_improvement = df[(df["IssueType"] == "Improvement")][['Sprints','IssueType']]
df_improvement_qty = df_improvement.groupby(by=['Sprints'])['IssueType'].count()
df_improvement_qty = df_improvement_qty.to_frame().reset_index()
df_improvement_qty = df_improvement_qty.rename(columns={'IssueType':'Quantidade'})
df_improvement_qty['Issue Type'] = 'Improvement'

df_SideEffect = df[(df["IssueType"] == "SideEffect")][['Sprints','IssueType']]
df_SideEffect_qty = df_SideEffect.groupby(by=['Sprints'])['IssueType'].count()
df_SideEffect_qty = df_SideEffect_qty.to_frame().reset_index()
df_SideEffect_qty = df_SideEffect_qty.rename(columns={'IssueType':'Quantidade'})
df_SideEffect_qty['Issue Type'] = 'SideEffect'

df_Legado = df[(df["IssueType"] == "Legado")][['Sprints','IssueType']]
df_Legado_qty = df_Legado.groupby(by=['Sprints'])['IssueType'].count()
df_Legado_qty = df_Legado_qty.to_frame().reset_index()
df_Legado_qty = df_Legado_qty.rename(columns={'IssueType':'Quantidade'})
df_Legado_qty['Issue Type'] = 'Legado'

# df_merge = df_story.merge(df_bug_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.merge(df_defect_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.rename(columns={"IssueType_x": "Bug_Qty", "IssueType_y": "Defect_Qty"})
# df_merge = df_merge.merge(df_improvement_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.merge(df_SideEffect_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.rename(columns={"IssueType_x": "Improvement_Qty", "IssueType_y": "SideEffect"})
# df_merge = df_merge.merge(df_Legado_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.rename(columns={"IssueType": "Legado_Qty"})
# dataset = df_merge
# dataset
# dataset = dataset.T
# dataset

df_issuetype = pd.concat([df_bug_qty,df_defect_qty],ignore_index=True)
df_issuetype = pd.concat([df_issuetype,df_Legado_qty],ignore_index=True)
df_issuetype = pd.concat([df_issuetype,df_SideEffect_qty],ignore_index=True)
df_issuetype = pd.concat([df_issuetype,df_improvement_qty],ignore_index=True)

df_Severity1 = df[(df["Severity"] == "SEV 1")][['Sprints','Severity']]
df_Severity1_qty = df_Severity1.groupby(by=['Sprints'])['Severity'].count()
df_Severity1_qty = df_Severity1_qty.to_frame().reset_index()
df_Severity1_qty = df_Severity1_qty.rename(columns={'Severity':'Quantidade'})
df_Severity1_qty['Severity'] = 'SEV 1'

df_Severity2 = df[(df["Severity"] == "SEV 2")][['Sprints','Severity']]
df_Severity2_qty = df_Severity2.groupby(by=['Sprints'])['Severity'].count()
df_Severity2_qty = df_Severity2_qty.to_frame().reset_index()
df_Severity2_qty = df_Severity2_qty.rename(columns={'Severity':'Quantidade'})
df_Severity2_qty['Severity'] = 'SEV 2'

df_Severity3 = df[(df["Severity"] == "SEV 3")][['Sprints','Severity']]
df_Severity3_qty = df_Severity3.groupby(by=['Sprints'])['Severity'].count()
df_Severity3_qty = df_Severity3_qty.to_frame().reset_index()
df_Severity3_qty = df_Severity3_qty.rename(columns={'Severity':'Quantidade'})
df_Severity3_qty['Severity'] = 'SEV 3'

df_Severity4 = df[(df["Severity"] == "SEV 4")][['Sprints','Severity']]
df_Severity4_qty = df_Severity4.groupby(by=['Sprints'])['Severity'].count()
df_Severity4_qty = df_Severity4_qty.to_frame().reset_index()
df_Severity4_qty = df_Severity4_qty.rename(columns={'Severity':'Quantidade'})
df_Severity4_qty['Severity'] = 'SEV 4'

df_sev = pd.concat([df_Severity1_qty,df_Severity2_qty,df_Severity3_qty,df_Severity4_qty],ignore_index=True)

sr_story = df_ttl['Story Points'].squeeze()

df_issuetype['Target'] = 25
sr_tgt = df_issuetype['Target']

df_issuetype['Average']=18.7
sr_avg = df_issuetype['Average']


col1, col2 = st.columns(2)
col3, col4, col5 = st.columns(3)

fig_date = px.bar(df_ttl, x=df_ttl.index, y="Story Points", title="Sprint Velocity (Points)",text_auto=True)
fig_date.add_scatter(name='Target',x=df_ttl.index,y=sr_tgt)
fig_date.add_scatter(name='Average',x=df_ttl.index,y=sr_avg)
col1.plotly_chart(fig_date, use_container_width=True)

fig_prod = px.bar(df_issuetype, x='Sprints', y="Quantidade",color="Issue Type", title="Issue Type (Quantity)",orientation="v",text_auto=True)
fig_prod.add_scatter(name='Story Point',x=df_issuetype['Sprints'],y=sr_story)
col2.plotly_chart(fig_prod, use_container_width=True)

fig_prod = px.bar(df_sev, x='Sprints', y="Quantidade",color="Severity", title="Issue by Severity (Quantity)",orientation="v",text_auto=True)
col3.plotly_chart(fig_prod, use_container_width=True)

"""city_total = df_filtered.groupby("City")[["Total"]].sum().reset_index()
fig_city = px.bar(city_total, x="City", y="Total",
                   title="Faturamento por filial")
col3.plotly_chart(fig_city, use_container_width=True)


fig_kind = px.pie(df_filtered, values="Total", names="Payment",
                   title="Faturamento por tipo de pagamento")
col4.plotly_chart(fig_kind, use_container_width=True)


city_total = df_filtered.groupby("City")[["Rating"]].mean().reset_index()
fig_rating = px.bar(df_filtered, y="Rating", x="City",
                   title="Avaliação")
col5.plotly_chart(fig_rating, use_container_width=True) """