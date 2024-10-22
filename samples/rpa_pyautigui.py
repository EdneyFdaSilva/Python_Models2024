import pyautogui
import time

pyautogui.PAUSE = 2.5

time.sleep(5)
print(pyautogui.position())

print(pyautogui.size())

#funcoes de mouse
time.sleep(5)
pyautogui.moveTo(x=770, y=241)
time.sleep(5)
pyautogui.click(x=1180, y=241)
pyautogui.click(x=1080, y=341)
pyautogui.scroll(-100)

#funcoes do teclado
pyautogui.write("Edney")
pyautogui.hotkey("ctrl","c")
pyautogui.press('tab')

#saber a teclas possiveis
print(pyautogui.KEYBOARD_KEYS)