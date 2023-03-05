### Custom Trainer

На моем тренажере сломалась управляющая плата. Я хотел купить более современную модел, но выяснилось, что почти все современные тренажеры имеют умышленно ограниченный функционал и дают возможность запускать тяжелые тренировки только после оплаты ежемесячной подписки. Поэтому я пришел к выводу, что лучше будет создать собственное управление тренажером с помощью RPI. Таким образом я решу проблему и получу опыт работы с GPIO и создания приложений для Ubuntu.
Приложение писалось для тренажера ProForm PFEL59260 и испытывалось на нем. Возможно ваша модель может отличаться в той или иной степени, изучите схему подключения и сравните со своим аппаратом прежде чем что-то запускать или настраивать.

Это приложение создано для Raspberry Pi 3b+ (или выше) и предназначенное для модернизации существующего (или создания нового) элиптического (или вело) тренажера. Для того, что использовать его вам следует сделать сделать несколько приготовлений:
1. Установить [Raspberry Pi OS (64-bit)](https://www.raspberrypi.com/software/operating-systems/#raspberry-pi-os-64-bit "Raspberry Pi OS (64-bit)") на MicroSD.
2. В настройках системы включить SPI.
3. Скачать и установить последнюю версию этого приложения [отсюда](https://github.com/modox94/Custom-Trainer/releases "Releases").
4. Подключить свой тренажер согласно этой [схеме](https://github.com/modox94/Custom-Trainer/blob/main/other/scheme.pnghttp:// "схема").
5. Запустить приложение и в настройках установить положения мотора и провести калибровку. После калибровки тренажер будет готов к использованию.

В дальшейшем эта инструкция будет дополнятся по мере возможности, а приложение совершенствоваться. Если вы хотите внести изменения, дополнения или у вас есть вопросы вы можете написать мне в [телеграм](https://t.me/crazynike94 "телеграм") 
Приложение фактически не требует большого количества ресурсов и вероятно нормально работала бы даже на RPI1, однако я не смог скомпилировать приложение для 32 битной версии ПО. Если кто-то сможет помочь это сделать, то можно будет сильно удешевить модернизацию тренажера.