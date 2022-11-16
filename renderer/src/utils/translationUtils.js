import { isPlainObject, isString, set } from "lodash";
import {
  i18nKeySeparator,
  i18nNamespace,
  LANGS_CODES,
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../constants/translationConst";
import { consoleError } from "./commonUtils";

export const getNormalizedTranslation = object => {
  const result = {};

  for (const rootKey in object) {
    const nestedObject = object[rootKey];
    const isCorrectRootKey = TRANSLATION_ROOT_KEYS.hasOwnProperty(rootKey);
    const isNestedObject = isPlainObject(nestedObject);

    if (!isNestedObject) {
      consoleError(new Error("Invalid data pattern of translation."), {
        rootKey,
        isCorrectRootKey,
        nestedObject,
        isNestedObject,
      });
      break;
    }
    if (!isCorrectRootKey) {
      consoleError(new Error("Invalid root key of translation."), {
        rootKey,
        isCorrectRootKey,
        nestedObject,
        isNestedObject,
      });
    }

    for (const nestedKey in nestedObject) {
      const targetObject = nestedObject[nestedKey];
      const isCorrectNestedKey =
        TRANSLATION_KEYS[rootKey]?.hasOwnProperty(nestedKey);
      const isTargetObject = isPlainObject(targetObject);

      if (!isTargetObject) {
        consoleError(new Error("Invalid data pattern of translation."), {
          nestedKey,
          isCorrectNestedKey,
          targetObject,
          isTargetObject,
        });
        break;
      }
      if (!isCorrectNestedKey) {
        consoleError(new Error("Invalid nested key of translation."), {
          nestedKey,
          isCorrectNestedKey,
          targetObject,
          isTargetObject,
        });
      }

      for (const langCode in targetObject) {
        const translation = targetObject[langCode];
        const isCorrectLangCode = LANGS_CODES.hasOwnProperty(langCode);
        const isStr = isString(translation);

        if (!isStr) {
          consoleError(new Error("Invalid data type of translation."), {
            langCode,
            isCorrectLangCode,
            translation,
            isStr,
          });
        }
        if (!isCorrectLangCode) {
          consoleError(new Error("Invalid language code of translation."), {
            langCode,
            isCorrectLangCode,
            translation,
            isStr,
          });
        }

        set(result, [langCode, i18nNamespace, rootKey, nestedKey], translation);
      }
    }
  }

  return result;
};

export const getTranslationPath = (...args) => {
  let path = "";
  args.forEach(keyRaw => {
    const rawType = typeof keyRaw;
    const key = (keyRaw || "").toString();

    try {
      if (!(rawType === "string" || rawType === "number")) {
        throw new Error("Wrong type of key.");
      }
      if (!key.length) {
        throw new Error("Empty key.");
      }
      if (key.includes(i18nKeySeparator)) {
        throw new Error("Key includes separator.");
      }

      if (path) {
        path += i18nKeySeparator;
      }
      path += key;
    } catch (error) {
      console.error("Wrong translation key.");
      console.log("args", args);
      console.log("key", key);
      console.log(error);
    }
  });

  return path;
};
