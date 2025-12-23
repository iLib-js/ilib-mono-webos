---
"ilib-loctool-webos-javascript": minor
"ilib-loctool-webos-dart": minor
"ilib-loctool-webos-json": minor
"ilib-loctool-webos-cpp": minor
"ilib-loctool-webos-qml": minor
"ilib-loctool-webos-c": minor
---

- Remove common xliff loading logic
 `commonXliff` of settings is deprecated.
 Instead, add the common data path to `translationsDir` as shown below.
 ```
  translationsDir : ["./xliffs", "./common"],
 ```
