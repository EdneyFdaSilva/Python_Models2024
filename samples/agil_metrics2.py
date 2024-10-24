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
df_bug = df[(df["IssueType"] == "Bug")][['Sprints','IssueType']]
df_bug_qty = df_bug.groupby(by=['Sprints'])['IssueType'].count()
df_defect = df[(df["IssueType"] == "Defect")][['Sprints','IssueType']]
df_defect_qty = df_defect.groupby(by=['Sprints'])['IssueType'].count()
df_improvement = df[(df["IssueType"] == "Improvement")][['Sprints','IssueType']]
df_improvement_qty = df_improvement.groupby(by=['Sprints'])['IssueType'].count()
df_SideEffect = df[(df["IssueType"] == "Side Effect")][['Sprints','IssueType']]
df_SideEffect_qty = df_SideEffect.groupby(by=['Sprints'])['IssueType'].count()
df_Legado = df[(df["IssueType"] == "Legado")][['Sprints','IssueType']]
df_Legado_qty = df_Legado.groupby(by=['Sprints'])['IssueType'].count()
df_bug = df[(df["IssueType"] == "Bug") | (df["IssueType"] == "Defect") | (df["IssueType"] == "Improvement")][['Sprints','IssueType']]
#df_bug = df[(df["IssueType"] == "Bug") | (df["IssueType"] == "Defect") | (df["IssueType"] == "Improvement")][['Sprints','IssueType']]
df_story['Issue Type'] = 'Story'
df_bug_qty
#df_defect_qty
#df_improvement_qty
# df_merge = df_story.merge(df_bug_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.merge(df_defect_qty, left_on='Sprints', right_on='Sprints',how='left')

# df_merge = df_merge.rename(columns={"IssueType_x": "Bug_Qty", "IssueType_y": "Defect_Qty"})

# df_merge = df_merge.merge(df_improvement_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.merge(df_SideEffect_qty, left_on='Sprints', right_on='Sprints',how='left')

# df_merge = df_merge.rename(columns={"IssueType_x": "Improvement_Qty", "IssueType_y": "SideEffect"})

# df_merge = df_merge.merge(df_Legado_qty, left_on='Sprints', right_on='Sprints',how='left')
# df_merge = df_merge.rename(columns={"IssueType": "Legado_Qty"})
# df_merge

col1, col2 = st.columns(2)
col3, col4, col5 = st.columns(3)

fig_date = px.bar(df_ttl, x=df_ttl.index, y="Story Points", title="Sprint Velocity (Points)",text_auto=True)
col1.plotly_chart(fig_date, use_container_width=True)

# dataset = df_merge
# dataset
# dataset = dataset.T
# dataset

# fig_prod = px.bar(dataset, x=dataset.index, y="Total",color="IssueType", title="Issue Type",orientation="v")
# col2.plotly_chart(fig_prod, use_container_width=True)


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