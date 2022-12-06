const { createBluetooth } = require("node-ble");
const { bluetooth, destroy } = createBluetooth();

/**
 * Для корректной работы необходимо в файл по адресу "/etc/dbus-1/system.d/bluetooth.conf" нужно добавить разрешения для текущего юзера
 *
 * <busconfig>
 * ...
 * ...
 *  <policy user="--username/id--">
 *     <allow own="org.bluez" />
 *     <allow send_destination="org.bluez" />
 *     <allow send_interface="org.bluez.GattCharacteristic1" />
 *     <allow send_interface="org.bluez.GattDescriptor1" />
 *     <allow send_interface="org.freedesktop.DBus.ObjectManager" />
 *     <allow send_interface="org.freedesktop.DBus.Properties" />
 *   </policy>
 * </busconfig>
 *
 * https://github.com/automation-stack/electron-sudo - получить айди текущего юзера, получить возможность прочесть и изменить конфигурационные файлы, перезапустить сервис (нужны права администратора)
 * https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js - распарсить файл настроек, добавить пункты, сохранить
 *
 *
 */

const TARGET_NAME = "Polar H7";
const TARGET_SERVICE = "180d";
const TARGET_CHARACTER = "2a37";

const asyncFn = async () => {
  const adapter = await bluetooth.defaultAdapter();

  if (!(await adapter.isDiscovering())) {
    await adapter.startDiscovery();
    await new Promise((resolve, reject) => {
      setTimeout(resolve, 5000);
    });
  }

  const devices = await adapter.devices();
  console.log("devices", devices);

  devices.forEach(async uuid => {
    const device = await adapter.getDevice(uuid);

    // console.log("device", device);
    try {
      const name = await device.getName();
      // console.log("uuid", uuid);
      // console.log("name",name);

      if (name.includes(TARGET_NAME)) {
        console.log(await device.toString());

        await device.connect();
        const gatts = await device.gatt();
        const gServices = await gatts.services();

        for (const serv of gServices) {
          if (serv.includes(TARGET_SERVICE)) {
            const GPserv = await gatts.getPrimaryService(serv);
            console.log("serv", serv);

            const chars = await GPserv.characteristics();
            console.log("chars", chars);

            for (const char of chars) {
              if (char.includes(TARGET_CHARACTER)) {
                const tarChar = await GPserv.getCharacteristic(char);

                console.log("flags", await tarChar.getFlags());
                tarChar.on("valuechanged", buf => {
                  console.log("valuechanged", buf[1]);

                  // buf.forEach(byte => console.log(byte));

                  console.log("ascii", buf[1].toString("ascii"));
                  console.log("utf8", buf[1].toString("utf8"));
                  console.log("utf16le", buf[1].toString("utf16le"));
                  console.log("ucs2", buf[1].toString("ucs2"));
                  console.log("base64", buf[1].toString("base64"));
                  console.log("binary", buf[1].toString("binary"));
                  console.log("hex", buf[1].toString("hex"));

                  console.log("--------------------------------------");
                });

                tarChar.startNotifications();
                console.log("isNotifying", await tarChar.isNotifying());
                console.log("readValue", await tarChar.readValue());
              }
            }
          }
        }
        // console.log("gatts",  gatts.toString());
        console.log("gatts services");
      }
    } catch (error) {
      // console.log("name err", error);
      console.log("name err");
    }
  });
  //   for (const uuid of devices) {
  //     const device = await adapter.getDevice(uuid);
  //     console.log("device", uuid);
  //     console.log(await device.toString());
  //   }
};

asyncFn();

// const device = await adapter.waitDevice('00:00:00:00:00:00')
// await device.connect()
// const gattServer = await device.gatt()
