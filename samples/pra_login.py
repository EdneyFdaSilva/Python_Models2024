import pyautogui
import time

pyautogui.PAUSE = 0.3

#time.sleep(5)
#pyautogui.scroll(-200)
#time.sleep(5)
#print(pyautogui.position())

pyautogui.press("win")
pyautogui.write("chrome")
pyautogui.press("enter")

time.sleep(1)

pyautogui.write("https://www.hashtagtreinamentos.com/treinamentos-corporativos")
pyautogui.press("enter")

time.sleep(3)

pyautogui.click(x=960, y=245)
time.sleep(3)

#encontrando uma posição na tela por imagem e clicando na posição
#posicao_assinatura = pyautogui.locateCenterOnScreen("botao_assinatura.png")
#pyautogui.click(posicao_assinatura)

#preencher o login no curso python
pyautogui.scroll(-200)
pyautogui.click(x=210, y=761)
pyautogui.write("Edney")
pyautogui.press("tab")
pyautogui.write("edneyfsilva@hotmail.com")
pyautogui.press("tab")
pyautogui.write("92 98416-2000")
pyautogui.press("tab")
time.sleep(3)
pyautogui.press("enter")